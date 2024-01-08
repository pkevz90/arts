class EKF {
    constructor(options = {}) {
        let {measurement_dim = 2, state_dim = 6, estState = [10,0,0,0,0,0], P, R, Q} = options
        this.state_dim = state_dim
        this.estState = estState || math.zeros([state_dim])
        this.measurement_dim = measurement_dim
        this.P = P || math.diag([1,1,1,0.001, 0.001,0.001].map(s => s**2))
        this.H = math.zeros([this.measurement_dim, this.state_dim])
        this.h = math.zeros([this.measurement_dim, 1])
        this.Q = Q || math.diag([0.0001,0.0001,0.0001,0.0000001, 0.0000001,0.0000001].map(s => s**2))
        this.z = math.zeros([this.measurement_dim, 1])
        this.R = R || math.diag([0.001, 0.001].map(s => s**2))
        this.K = undefined
        this.H = undefined
        this.lastUpdateTime = 0
    }
    createMeasurement = createOpticalMeasurement
    createMeasurementJacobian(satRic = [20, 20, 5, 0, 0, 0]) {
        let deltas = [0.01,0.01,0.01,0.00001,0.00001,0.00001]
        let baseMeas = this.createMeasurement(satRic)
        let H = []
        for (let ii = 0; ii < deltas.length; ii++) {
            let satRicCopy = satRic.slice()
            satRicCopy[ii] += deltas[ii]
            let newMeas = this.createMeasurement(satRicCopy)
            let derivativeMeas = math.subtract(newMeas, baseMeas).map(s => s/deltas[ii])
            H.push(derivativeMeas)
        }
        this.H = math.transpose(H)
    }
    computeOptimalGain() {
        this.createMeasurementJacobian(this.estState)
        let S = math.add(math.multiply(this.H, this.P, math.transpose(this.H)), this.R)
        this.K = math.multiply(this.P, math.transpose(this.H), math.inv(S))
    }
    propagateCovariance(dt = 10) {
        let F = this.stateTransitionRpo(dt)
        this.P = math.add(math.multiply(F, this.P, math.transpose(F)), this.Q)
    }
    updateCovariance() {
        this.P = math.multiply(math.subtract(math.identity([6]), math.multiply(this.K, this.H)), this.P)
    }
    updateStateEstimate(z) {
        let y = math.subtract(z, this.createMeasurement(this.estState,false,true))
        this.estState = math.squeeze(math.add(math.transpose([this.estState]), math.multiply(this.K, y)))
    }
    propagateEstState(dt = 10) {
        // let F = this.stateTransitionRpo(dt)
        // this.estState = math.multiply(F, this.estState)
        this.estState = runge_kuttaEkf(this.estState, dt)
    }
    stateTransitionRpo(t = 3600, n = 2*Math.PI/86164) {
        let cosnt = Math.cos(n*t), sinnt = Math.sin(n*t), nInv = 1/n
        return [
            [4-3*cosnt, 0,0,nInv*sinnt, 2*nInv*(1-cosnt), 0],
            [6*(sinnt-n*t),1,0,2*nInv*(cosnt-1), nInv*(4*sinnt-3*n*t), 0],
            [0,0,cosnt,0,0,nInv*sinnt],
            [3*n*sinnt, 0, 0, cosnt, 2*sinnt, 0],
            [6*n*(cosnt-1),0,0, -2*sinnt, 4*cosnt-3,0],
            [0,0,-n*sinnt, 0,0,cosnt]
        ]
    }
    stepFilter(time, measure, u = [0,0,0]) {
        let dt = time - this.lastUpdateTime
        this.estState = math.add(this.estState, [0,0,0,...u])
        this.lastUpdateTime = time + 0
        this.propagateEstState(dt)
        this.propagateCovariance(dt)
        this.computeOptimalGain()
        this.updateStateEstimate(measure)
        this.updateCovariance()
    }
}

function createOpticalMeasurement(satRic = [20, 20, 5, 0, 0, 0], noise = false, col = false) {
    // RA, Dec, Range (if measurement_dim === 3)
    let out = []
    out.push(math.atan2(satRic[1], -satRic[0]))
    out.push(math.atan2(satRic[2], math.norm(satRic.slice(0,2))))

    out = noise === false ? out : addNoiseFromMatrix(out, noise)
    return col ? math.transpose([out]) : out
}

function createOpticalRangeMeasurement(satRic = [20, 20, 5, 0, 0, 0], noise = false, col = false) {
    // RA, Dec, Range (if measurement_dim === 3)
    let out = []
    out.push(math.atan2(satRic[1], -satRic[0]))
    out.push(math.atan2(satRic[2], math.norm(satRic.slice(0,2))))
    out.push(math.norm(satRic.slice(0,3)))
    out = noise === false ? out : addNoiseFromMatrix(out, noise)
    return col ? math.transpose([out]) : out
}

function addNoiseFromMatrix(a = [0,0], b=[[1,0],[0,1]]) {
    a = a.slice()
    b = math.transpose(astro.choleskyDecomposition(b))
    b.forEach(row => {
        let randGauss = randn_bm()
        a = math.add(a, row.map(s => s*randGauss))
    })
    return a
}

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
//[71.82921053184695, 737.2315866236775, 0, 0.00014933288306357567, -0.00855527514091463, 0]
function runFilterTest(eciChief = [42164,0,0,0,3.074666284127684,0], ricDep =[1,1,1, 0,0,0]) {
    let eciDep = Ric2Eci(ricDep.slice(0,3), ricDep.slice(3), eciChief.slice(0,3), eciChief.slice(3))
    eciDep = [...eciDep.rEcci, ...eciDep.drEci]
    let P = math.diag([0.5,0.5,0.5,0.001, 0.001,0.001].map(s => s**2))
    let degNoise = 0.05 
    let measureNoiseCov = math.diag([degNoise*Math.PI/180, degNoise*Math.PI/180].map(s => s**2))
    let filter = new EKF({
        R: measureNoiseCov,
        estState: addNoiseFromMatrix(ricDep, P)
    })
    let burns = {
        chief: [],
        dep: [
            [1000, [0,0,-0.00025]]
        ]
    }
    let dt = 5, tF = 3600, time = 0
    while (time < tF) {
        depBurns = burns.dep.filter(s => s[0] <= time)
        let ricburn = [0,0,0]
        if (depBurns.length > 0) {
            ricburn = depBurns[0][1]
            burns.dep.shift()
            console.log(ricburn);
            let c = ConvEciToRic(eciDep, [0,0,0,0,0,0], true)[0]
            let eciBurn = math.multiply(math.transpose(c), ricburn)
            console.log(eciBurn);
            eciDep = math.add(eciDep, [0,0,0,...eciBurn])
        }
        eciChief = propToTime(eciChief, dt)
        eciDep = propToTime(eciDep, dt)
        let curRic = astro.Eci2Ric(eciChief, eciDep)
        let realMeas = createOpticalMeasurement(curRic)
        let estMeas = createOpticalMeasurement(filter.estState)
        // console.log(astro.mahalanobisDistance([realMeas], [estMeas], measureNoiseCov));
        
        filter.stepFilter(time, createOpticalMeasurement(curRic, measureNoiseCov, true), ricburn)
        console.log(curRic);
        console.log(filter.estState);
        console.log(math.subtract(realMeas, estMeas).map(s => Math.abs(s)));
        time += dt
    }
}

function runRangeFilterTest(eciChief = [42164,0,0,0,3.074666284127684,0], ricDep =[10,10,10,0,0,0]) {
    let eciDep = Ric2Eci(ricDep.slice(0,3), ricDep.slice(3), eciChief.slice(0,3), eciChief.slice(3))
    eciDep = [...eciDep.rEcci, ...eciDep.drEci]
    let P = math.diag([5,5,5,0.001, 0.001,0.001].map(s => s**2))
    let degNoise = 0.5 
    let measureNoiseCov = math.diag([degNoise*Math.PI/180, degNoise*Math.PI/180, 0.010].map(s => s**2))
    let filter = new EKF({
        R: measureNoiseCov,
        estState: addNoiseFromMatrix(ricDep, P)
    })
    filter.createMeasurement = createOpticalRangeMeasurement
    let burns = {
        chief: [],
        dep: [
            [1000, [0,0,0.001]]
        ]
    }
    let dt = 5, tF = 3600, time = 0
    while (time < tF) {
        let curChief = propToTime(eciChief, time)
        let curDep = propToTime(eciDep, time)
        let curRic = astro.Eci2Ric(curChief, curDep)
        depBurns = burns.dep.filter(s => s[0] <= time)
        filter.stepFilter(time, createOpticalRangeMeasurement(curRic, measureNoiseCov, true))
        console.log([curRic], [filter.estState], filter.P);
        console.log(astro.choleskyDecomposition(filter.P));
        console.log(astro.mahalanobisDistance([curRic], [filter.estState], filter.P));
        time += dt
    }
}

function nerm(state = [-1.89733896, 399.98, 0, 0, 0, 0], n = 2*Math.PI/86164) {
    let ndot = 0
    let mu = 398600.4418
    let r0 = (398600.4418 / n **2) **(1/3)
    let x = state[0], y = state[1], z = state[2], dx = state[3], dy = state[4], dz = state[5];
    let rT = ((r0 + x) ** 2 + y ** 2 + z ** 2) ** (1.5);
    return [
        dx,
        dy,
        dz,
        -mu * (r0 + x) / rT+ mu / r0 ** 2 + 2 * n * dy + n ** 2 * x + ndot * y,
        -mu * y / rT - 2 * n * dx - ndot * x + n ** 2 * y,
        -mu * z / rT
    ];
}

function runge_kuttaEkf(state=[10,10,10,0,0,0], dt=3600) {
    let k1 = nerm(state);
    let k2 = nerm(math.add(state, math.dotMultiply(dt/2, k1)));
    return math.add(state, math.dotMultiply(dt, k2));
}