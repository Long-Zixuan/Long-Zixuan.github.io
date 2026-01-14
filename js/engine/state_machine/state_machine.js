//一个极其简陋的状态机
class StateMachine
{
    
    constructor(initState = null)
    {
        this._curState = initState;
        this._stateTrans = {};
        this._states = {};
    }

    setState(stateId)
    {
        this._curState = stateId;
    }
    input(event)
    {
        if(!this._states.hasOwnProperty(this._curState))
        {
            console.log("ERROR!:Invalid state");
            return false;
        }
        for(var i in this._stateTrans[this._curState])
        {
            if(this._stateTrans[this._curState][i]["event"] == event)
            {
                var isChange = this._changeState(this._stateTrans[this._curState][i]);
                if(!isChange)
                {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    _changeState(trans)
    {
        if(!trans.hasOwnProperty("toState"))
        {
            console.log("ERROR!:Invalid transition");
            return false;
        }
        let toStateId = trans["toState"];
        if(this._curState == toStateId)
        {
            return false;
        }
        if(!this._states.hasOwnProperty(this._curState))
        {
            return false;
        }
        let oldState = this._states[this._curState];
        if (!this._states.hasOwnProperty(toStateId))
        {
            return false;
        }
        let newState = this._states[toStateId];
        oldState["onExit"]();
        newState["onEnter"]();
        try
        {
            var func = trans["action"];
            if(func)
            {
                func();
            }
        }
        catch(err)
        {
            console.log(err);
        }
        this._curState = toStateId;
        return true;
    }

    addState(stateId,state)
    {
        this._states[stateId] = state;
    }

    addTrans(fromState, toState, event, act = null)
    {
        if(!this._stateTrans.hasOwnProperty(fromState))
        {
            this._stateTrans[fromState] = [];
        }
        this._stateTrans[fromState].push(
            {
                "toState":toState,
                "event":event,
                "action":act
            }
        );
    }

    getCurState()
    {
        return this._curState;
    }

    update()
    {
        if(!this._states.hasOwnProperty(this._curState))
        {
            return false;
        }
        this._states[this._curState]["onUpdate"]();
        return true;
    }
}

//LZX completed this script on 2026/01/12
//LZX-TC-VSCode-2026-01-12-001