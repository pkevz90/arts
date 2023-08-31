class StateMachine {
    constructor(options = {}) {
        let {name = 'sat'} = options
        this.states = {
            default: new State()
        }
        this.name = name
        this.currentState = 'default'
    }

    addState(options = {}) {

    }

    runCurrentState(states = {sat: [42164,0,0,0,3.014,0]}, burns = [], time) {
        let stateReturn = this.states[this.currentState].runState(states, burns, time)
        console.log(stateReturn);
    }
    
    getStateFromHistory(history, time)

    runHistory(stateHistories = {}, timeFinal = 17200, dt = 600) {
        if (stateHistories[this.name] === undefined) return
        let satStateNames = Object.keys(stateHistories)
        let burns = []
        for (let time = 0; time <= timeFinal; time+=dt) {
            let states = {}
            for (let index = 0; index < satStateNames.length; index++) {
                states[satStateNames[index]] = this.getStateFromHistory(stateHistories[satStateNames[index]], time)
                let returnFromState = this.runCurrentState(states, burns, time)
                if (returnFromState !== null) {
                    burns.push({t: time, direction: returnFromState})
                    return burns
                }
            }
            
        }
    }
}

class State {
    constructor(options = {}) {
        let {exitCriteriaList = [], name = null, action = new StateAction()} = options
        this.action = action
        this.name = name
        this.exitCriteriaList = exitCriteriaList
        // Return both the action from current state and the state for the next time step 
    }
    runState(state = {sat: [42164,0,0,0,0,0]}, burns, time) {
        // State is a list of j2000 states for every object in the scenario
        let switchState = false
        for (let index = 0; index < this.exitCriteriaList.length; index++) {
            // Check if any of the criteria functions return true, if so, list that state to switch too
            let flag = this.exitCriteriaList[index].evaluate(state, burns, time)
            if (flag) {
                switchState = this.exitCriteriaList[index].target
                return
            }
        }
        // Return both the action from current state and the state for the next time step 

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
    burn(state, burns, time) {
        let burnTimes = burns.map(b => b.t)
        if (burnTimes.map(b => Math.abs(b-time)).filter(b => b < this.parameters.limits).length > 0) {
            return null
        }
        else {
            return [this.parameters.r, this.parameters.i, this.parameters.c].map(s => s/1000)
        }
    }
    coast() {
        return null
    }
    returnToPosition(state, burns, time) {
        return null
    }
    returnAction(state,burns, time) {
        return this[this.action](state, burns, time)
    }
}

class ExitCriteria {
    constructor(name='sat', target, parameters = ['curRange', [100]]) {
        this.target = target
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
    evaluate(state, burns, time) {
        return this[this.parameters[0]](state, burns, time)
    }
    curRangeLess(state, burns, time) {
        return math.norm(math.subtract(state[this.name].slice(0,3), state[this.target].slice(0,3))) < this.parameters[1]
    }
    curRangeGreater(state, burns, time, criteria) {
        return math.norm(math.subtract(state[this.name].slice(0,3), state[this.target].slice(0,3))) > this.parameters[1]
    }
    pocaLess(state, burns, time, criteria) {
        return false
    }
    pocaGreater(state, burns, time, criteria) {
        return false
    }
    intercept(state, burns, time, criteria) {
        return false
    }
    afterTime(state, burns, time, criteria) {
        return false
    }
    beforeTime(state, burns, time, criteria) {
        return false
    }

}
let sm
function buildTestStateMachine() {
    sm = new StateMachine({name: 'sat1'})
    let slideState = new State()
    slideState.exitCriteriaList.push(new ExitCriteria('sat1','sat2', ['curRangeGreater', [100]]))
    slideState.action = new StateAction({type: 'burn', parameters: {r: 5, i: 0, c: 0, limit: 7200}, target: 'sat2'})

    sm.states.default.exitCriteriaList.push(new ExitCriteria('sat1','sat2', ['curRangeLess', [100]]))
    sm.states.slide = slideState
}
buildTestStateMachine()
console.log(sm);