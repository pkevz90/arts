class StateMachine {
    constructor(options = {}) {
        let {name = 'sat'} = options
        this.states = {
            default: new State()
        }
        this.name = name
        this.burns = []
        this.currentState = 'default'
    }

    machineFromString(inputString = '') {
        inputString = inputString.split(/\n|\r/)
        // console.log(inputString);
        let curState
        for (let index = 0; index < inputString.length; index++) {
            if (inputString[index].search(/state/i) !== -1) {
                let stateString = inputString[index].split(/state/i)[1].trim()
                stateString = stateString.replace(/ {1,}/,'_')
                curState = stateString
                this.states[stateString] = new State({name: this.name})
                // console.log('\n\nSwitched to ' + curState);
            }
            if (inputString[index].search(/action/i) !== -1) {
                let actionString = inputString[index].split(/action/i)[1].split(/ {1,}/).filter(s => s.length > 0)[0].trim()
                let parameters = inputString[index].match(/\[.{1,}\]/)[0]
                parameters = parameters.slice(1).slice(0,parameters.length-2).split(',').map(s => Number(s))
                let targets = inputString[index].split(/\[.{1,}\]/)[1].split(/ {1,}/).filter(s => s.length > 0)[0]
                // console.log({actionString, parameters});
                this.states[curState].action = new StateAction({type: actionString, parameters, name: this.name, target: targets})
            }
            if (inputString[index].search(/transition/i) !== -1) {
                let transition = inputString[index].split(/transition/i)[1].split(/ {1,}/).filter(s => s.length > 0)[1].trim()
                let transitionState = inputString[index].split(/transition/i)[1].split(/ {1,}/).filter(s => s.length > 0)[0].trim()
                let transitionTarget = inputString[index].split(/transition/i)[1].split(/ {1,}/).filter(s => s.length > 0)
                transitionTarget = transitionTarget[transitionTarget.length-1].trim()
                let parameters = inputString[index].match(/\[.{1,}\]/)[0]
                parameters = parameters.slice(1).slice(0,parameters.length-2).split(',').map(s => Number(s))
                let targets = inputString[index].split(/\[.{1,}\]/)[1].split(/ {1,}/).filter(s => s.length > 0)[0]
                // console.log({transition, transitionState, transitionTarget, parameters});
                this.states[curState].exitCriteriaList.push(new StateTransition(this.name, targets, transitionState, [transition, parameters]))
                
            }
            
        }
    }

    runCurrentState(states = {sat: [42164,0,0,0,3.014,0]}, time=0) {
        let stateReturn = this.states[this.currentState].runState(states, this.burns, time)
        this.currentState = stateReturn.switch === false ? this.currentState : stateReturn.switch
        if (stateReturn.switch !== false) {
            console.log('Switching to ' + stateReturn.switch);
            stateReturn = this.states[this.currentState].runState(states, this.burns, time)
            
        }
        if (stateReturn.action !== null && math.norm(stateReturn.action) > 0.00001) {
            this.burns.push({t: time, direction: stateReturn.action})
        }
        else return [null]
        return [stateReturn.action];
    }
    
  

}

class State {
    constructor(options = {}) {
        let {exitCriteriaList = [], name = null, action = new StateAction()} = options
        this.action = action
        this.name = name
        this.exitCriteriaList = exitCriteriaList
        this.entryTime
        // Return both the action from current state and the state for the next time step 
    }
    runState(state = {sat: [42164,0,0,0,0,0]}, burns, time) {
        // State is a list of j2000 states for every object in the scenario
        let switchState = false
        for (let index = 0; index < this.exitCriteriaList.length; index++) {
            // Check if any of the criteria functions return true, if so, list that state to switch too
            let flag = this.exitCriteriaList[index].evaluate(state, burns, time, this.entryTime)
            if (flag) {
                switchState = this.exitCriteriaList[index].toState
                break
            }
        }
        // Return both the action from current state and the state for the next time step 
        return {action: this.calculateAction(state, burns, time, this.entryTime), switch: switchState}
    }
    calculateAction(state, burns, time) {
        return this.action.returnAction(state, burns, time)
    }
}

class StateAction {
    constructor(options = {}) {
        let {name= null, target = null, type = 'coast', parameters = {}} = options
        this.parameters = parameters
        this.action = type
        this.target = target
        this.name = name
    }
    burn(state, burns, time, stateEntryTime) {
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters[3]).length > 0) {
            return null
        }
        else {
            let rEci2Ric = astro.Eci2RicRotation(state[this.name])
            return math.multiply(rEci2Ric.C, this.parameters.slice(0,3).map(s => s/1000))
        }
    }
    coast() {
        return null
    }
    returnToPosition(state, burns, tim, stateEntryTimee) {
        return null
    }
    returnAction(state,burns, time, stateEntryTime) {
        return this[this.action](state, burns, time)
    }
    setDriftToAltitude(state, burns, time, stateEntryTime) {
        // console.log(burns);
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters[2]).length > 0) {
            return null
        }

        let targetVelocity = (398600.4418*(2/math.norm(state[this.name].slice(0,3))-1/this.parameters[1])) ** 0.5
        let rEci2Ric = astro.Eci2RicRotation(state[this.name])
        let currentRicVelocityVector = math.multiply(math.transpose(rEci2Ric.C), state[this.name].slice(3))
        let inTrackBurnTarget = (targetVelocity**2-currentRicVelocityVector[0]**2-currentRicVelocityVector[2]**2)**0.5
        let burnRic = [0,inTrackBurnTarget-currentRicVelocityVector[1],0]
        // console.log(burnRic, inTrackBurnTarget, currentRicVelocityVector[1]);
        let burnEci = math.multiply(rEci2Ric.C, burnRic)
        // let correctedEci = math.add(state[this.name], [0,0,0,...burnEci])
        // console.log(astro.j20002Coe(correctedEci));
        return burnEci
    }
    setDriftToTarget(state, burns, time, stateEntryTime) {
        // [rel drift rate (pos for towards in deg/day), burn spacing]
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters[1]).length > 0) {
            return null
        }
        let targetSemiMajorAxis = astro.j20002Coe(state[this.target]).a
        let targetMm = (398600.4418/targetSemiMajorAxis**3)**0.5

        let angleToTarget = math.cross(state[this.target].slice(0,3), state[this.name].slice(0,3))
        let angularMomentumTarget = math.cross(state[this.target].slice(0,3), state[this.target].slice(3))
        let behindTarget = angleToTarget[2] * angularMomentumTarget[2] < 0
        console.log(angleToTarget, angularMomentumTarget);
        let desiredDriftRate = (this.parameters[0]/86400)*Math.PI/180
        let desiredMm = targetMm + (behindTarget ? 1 : -1)*desiredDriftRate
        let desiredSemiMajorAxis = (398600.4418/desiredMm**2)**(1/3)

        let targetVelocity = (398600.4418*(2/math.norm(state[this.name].slice(0,3))-1/desiredSemiMajorAxis)) ** 0.5
        let rEci2Ric = astro.Eci2RicRotation(state[this.name])
        let currentRicVelocityVector = math.multiply(math.transpose(rEci2Ric.C), state[this.name].slice(3))
        let inTrackBurnTarget = (targetVelocity**2-currentRicVelocityVector[0]**2-currentRicVelocityVector[2]**2)**0.5
        let burnRic = [0,inTrackBurnTarget-currentRicVelocityVector[1],0]
        // console.log(burnRic, inTrackBurnTarget, currentRicVelocityVector[1]);
        let burnEci = math.multiply(rEci2Ric.C, burnRic)
        // let correctedEci = math.add(state[this.name], [0,0,0,...burnEci])
        // console.log(astro.j20002Coe(correctedEci));
        return burnEci
    }
    enterNmc(state, burns, time, stateEntryTime) {
        // Paremeters [size, maxDv]
    }
    increaseRangeRate(state, burns, time, stateEntryTime) {
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters[2]).length > 0) {
            return null
        }
        // Convert to range rate, tangential rate
        let rrVector = math.subtract(state[this.name], state[this.target]).slice(0,3)
        rrVector = rrVector.map(s => s/math.norm(rrVector))
        let relVel = math.subtract(state[this.name], state[this.target]).slice(3)

        let rangeRate = math.dot(rrVector, relVel)
        let rangeRateBurn = this.parameters[0]/1000 - rangeRate
        if (rangeRateBurn < 0) return null
        rangeRateBurn = rangeRateBurn > this.parameters[1]/1000 ? this.parameters[1]/1000 : rangeRateBurn
        rangeRateBurn = math.dotMultiply(rangeRateBurn, rrVector)
        return rangeRateBurn

    }
    decreaseRangeRate(state, burns, time, stateEntryTime) {
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters[2]).length > 0) {
            return null
        }
        // Convert to range rate, tangential rate
        let rrVector = math.subtract(state[this.name], state[this.target]).slice(0,3)
        rrVector = rrVector.map(s => s/math.norm(rrVector))
        let relVel = math.subtract(state[this.name], state[this.target]).slice(3)

        let rangeRate = math.dot(rrVector, relVel)
        let rangeRateBurn = this.parameters[0]/1000 - rangeRate
        if (rangeRate > 0) return null
        rangeRateBurn = rangeRateBurn > this.parameters[1]/1000 ? this.parameters[1]/1000 : rangeRateBurn
        rangeRateBurn = math.dotMultiply(rangeRateBurn, rrVector)
        return rangeRateBurn

    }
    setPoca(state, burns, time, stateEntryTime) {
        return null
    }
    gainSun(state, burns, time, stateEntryTime) {
        return null
    }
    gotoWaypoint(state, burns, time, stateEntryTime) {
        return null
    }
    gotoLongitude(state, burns, time, stateEntryTime) {
        return null
    }
}

class StateTransition {
    constructor(name='sat', target, toState, parameters = ['curRange', [100]]) {
        this.target = target
        this.toState = toState
        this.name = name
        // Available criteria
        //  curRangeLess: current range to specified satellite within criteria [range]
        //  curRangeGreater: current range to specified satellite within criteria [range]
        //  pocaLess: future poca to state satellites's trajectory within criteria [range, timeLimit]
        //  pocaGreater: future poca to state satellites's trajectory within criteria [range, timeLimit]
        //  intercept: intercept solution from specified satellite to state's satellite within criteria [dV, relVel, CATS, CATM]
        //  afterTime: after specified time has past [time]
        //  beforeTime: until specified time has past [time]
        // Criteria consist of [type, criteria]
        this.parameters = parameters
    }
    evaluate(state, burns, time, stateEntryTime) {
        return this[this.parameters[0]](state, burns, time)
    }
    angularDifferenceGreater(state, burns, time, stateEntryTime) {
        // Paramter(s) [angle to be greater than]
        let diff = math.acos(math.dot(state[this.target].slice(0,3), state[this.name].slice(0,3))/math.norm(state[this.target].slice(0,3))/math.norm(state[this.name].slice(0,3)))*180/Math.PI
        return diff > this.parameters[1][0]
    }
    angularDifferenceLess(state, burns, time, stateEntryTime) {
        // Paramter(s) [angle to be less than]
        let diff = math.acos(math.dot(state[this.target].slice(0,3), state[this.name].slice(0,3))/math.norm(state[this.target].slice(0,3))/math.norm(state[this.name].slice(0,3)))*180/Math.PI
        return diff < this.parameters[1][0]
    }
    curRangeLess(state, burns, time, stateEntryTime) {
        console.log(this.target);
        return math.norm(math.subtract(state[this.name].slice(0,3), state[this.target].slice(0,3))) < this.parameters[1]
    }
    curRangeGreater(state, burns, time, stateEntryTime) {
        return math.norm(math.subtract(state[this.name].slice(0,3), state[this.target].slice(0,3))) > this.parameters[1]
    }
    pocaLess(state, burns, time, stateEntryTime) {
        return false
    }
    pocaGreater(state, burns, time, stateEntryTime) {
        return false
    }
    intercept(state, burns, time, stateEntryTime) {
        return false
    }
    afterTime(state, burns, time, stateEntryTime) {
        return false
    }
    beforeTime(state, burns, time, stateEntryTime) {
        return false
    }
    driftRateLess(state, burns, time, stateEntryTime) {
        // console.log(this.parameters);
        let currentMm = astro.j20002Coe(state[this.name]).a
        currentMm = (398600.4418/currentMm**3)**0.5
        let targetMm = (398600.4418/this.parameters[1][1]**3)**0.5
        // console.log(math.abs(currentMm-targetMm), this.parameters[1][0]);
        return math.abs(currentMm-targetMm) < this.parameters[1][0]
    }
    driftRateMore(state, burns, time, stateEntryTime) {
        let currentMm = astro.j20002Coe(state[this.name]).a
        currentMm = (398600.4418/currentMm**3)**0.5
        let targetMm = (398600.4418/this.parameters[1][1]**3)**0.5
        // console.log(math.abs(currentMm-targetMm), this.parameters[1][0]);
        return math.abs(currentMm-targetMm) > this.parameters[1][0]
    }
    driftRateToTargetLess(state, burns, time, stateEntryTime) {
        // console.log(this.parameters);
        let currentMm = astro.j20002Coe(state[this.name]).a
        currentMm = (398600.4418/currentMm**3)**0.5
        let targetMm = astro.j20002Coe(state[this.target]).a
        // console.log(math.abs(currentMm-targetMm), this.parameters[1][0]);
        return math.abs(currentMm-targetMm) < this.parameters[1][0]
    }
    driftRateToTargetMore(state, burns, time, stateEntryTime) {
        let currentMm = astro.j20002Coe(state[this.name]).a
        currentMm = (398600.4418/currentMm**3)**0.5
        let targetMm = astro.j20002Coe(state[this.target]).a
        // console.log(math.abs(currentMm-targetMm), this.parameters[1][0]);
        return math.abs(currentMm-targetMm) > this.parameters[1][0]
    }

}

let buildString = `
    STATE default
        TRANSITION slide curRangeLess [100] sat2
        TRANSITION scram curRangeLess [25] sat2

    STATE slide
        ACTION increaseRangeRate [1,2,10800] sat2
        TRANSITION settle curRangeGreater [100] sat2
        TRANSITION scram curRangeLess [25] sat2

    STATE scram
        ACTION increaseRangeRate [10,4,7200] sat2
        TRANSITION settle curRangeGreater [100] sat2

    STATE settle
        ACTION setDrift [0, 42164, 10800]
        TRANSITION default driftRateLess [0.00000001, 42164]

    STATE nmc
        action enterNmc [50, 10800, 7200]
        TRANSITION default afterTime [10800]
`

buildString = `
STATE default
    TRANSITION drifttowards angularDifferenceGreater [0.5] sat2        
	TRANSITION nmc angularDifferenceLess [0.1] sat2

STATE drifttowards
    ACTION setDriftToTarget [0.5,7200] sat2
    TRANSITION default angularDifferenceLess [0.5] sat2

STATE nmc        
    ACTION setDriftToTarget [0 ,7200] sat2
    TRANSITION default angularDifferenceGreater [1] sat2
    TRANSITION default driftRateMore [0.1] sat2
    `

let sm
function buildTestStateMachine() {
    sm = new StateMachine({name: 'sat1'})
    sm.machineFromString(buildString)
}
// buildTestStateMachine()


function testStateMachine(sat1Eci = [38035.49754266645, 17992.30040739409, 33.011734797688405, -1.3153986046562771, 2.7828479662660683, -0.052546609845741346], sat2ric = [76.53, 368.02,0,0.00007, -0.00856, 0]) {
    let sat2Eci = astro.Ric2Eci(sat2ric, sat1Eci)
    let time = 0, finalTime = 2*86400, dt = 600
    
    sm = new StateMachine({name: 'sat1'})
    sm.machineFromString(buildString)
    while (time < finalTime) {
        let stateResult = sm.runCurrentState({
            sat1: sat1Eci, sat2: sat2Eci
        }, time)
        // console.log(math.norm(math.subtract(sat1Eci, sat2Eci).slice(0,3)).toFixed());
        console.log(astro.Eci2Ric(sat1Eci, sat2Eci).slice(0,3).map(s => s.toFixed(1)).join(' '));
        if (stateResult[0] !== null) {
            console.log(stateResult, time);
        
            sat1Eci = math.add(sat1Eci, [0,0,0,...stateResult[0]])
        }
        sat1Eci = propToTime(sat1Eci, dt)
        sat2Eci = propToTime(sat2Eci, dt)
        time += dt
    }
}

function testStateMachineWithScenario(sat1 = 0, sat2 = 1) {
    let time = mainWindow.scenarioTime, finalTime = 86400*5, dt = 600
    
    sm = new StateMachine({name: 'sat1'})
    sm.machineFromString(buildString)
    console.log(sm);
    let a = setInterval(() => {
        mainWindow.changeTime(time, true)
        let sat1Eci = Object.values(getCurrentInertial(sat1))
        let sat2Eci = Object.values(getCurrentInertial(sat2))
        // console.log(time, sat1Eci);
        let stateResult = sm.runCurrentState({
            sat1: sat1Eci, sat2: sat2Eci
        }, time)
        // console.log(math.norm(math.subtract(sat1Eci, sat2Eci).slice(0,3)).toFixed());
        // console.log(astro.Eci2Ric(sat1Eci, sat2Eci).slice(0,3).map(s => s.toFixed(1)).join(' '));
        if (stateResult[0] !== null) {
            console.log(stateResult, time);
            
            let rEci2Ric = astro.Eci2RicRotation(sat1Eci)
            console.log(math.multiply(math.transpose(rEci2Ric.C), stateResult[0]))
            insertDirectionBurn(sat1, time, math.multiply(math.transpose(rEci2Ric.C), stateResult[0]))

            mainWindow.changeTime(time, true)
            // sat1Eci = math.add(sat1Eci, [0,0,0,...stateResult[0]])
        }
        // // sat1Eci = propToTime(sat1Eci, dt)
        // // sat2Eci = propToTime(sat2Eci, dt)
        time += dt
        if (time > finalTime) clearInterval(a)
    }, 100)
    
}