class Character extends JSBehavior
{
    constructor(element,stateMachine = null)
    {
        super(element);
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
        this._isDead = true;
        for(i in this._dieDelegates)
        {
            this._dieDelegates[i](this);
        }
    }

    get isDead() { return this._isDead; }

    get getHealth() { return this._health; }

    _initStateMachine(){}
}