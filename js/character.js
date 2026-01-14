class Character extends JSBehavior
{
    constructor(gameObject,stateMachine = null)
    {
        super(gameObject);
        this._isDead = false;
        this._health = 100;
        if(stateMachine)
        {
            this._stateMachine = stateMachine;
        }
        else
        {
            this._stateMachine = new StateMachine();
        }
        this._dieDelegates = [];
        this._initStateMachine();
    }

    setHealth(health) { this._health = health; }

    hurt(damage) { this._health -= damage; }

    checkHealth() 
    {

    }

    update()
    {
        super.update();
        this.checkHealth();
        this._stateMachine.update();
    }

    setState(state)
    { 
        this._stateMachine.input(state);
    }

    setStateMechine(stateMachine) { this._stateMachine = stateMachine; }

    addDieDelegate(delegate) { this._dieDelegates.push(delegate); }

    onDie()
    {
        if(!this._isDead)
        {
            for(var i in this._dieDelegates)
            {
                this._dieDelegates[i](this);
            }
            this._isDead = true;
        }
    }

    get isDead() { return this._isDead; }

    get Health() { return this._health; }

    _initStateMachine(){}

    getTopNum()
    {
        console.log(this._gameObject.Top);
        return parseFloat(this._gameObject.Top.toString().slice(0, this._gameObject.Top.toString().length - 1));
    }

    getLeftNum()
    {
        return parseFloat(this._gameObject.Left.toString().slice(0, this._gameObject.Left.toString().length - 1));
    }
}

//LZX-VSCode-2026-01-14-001