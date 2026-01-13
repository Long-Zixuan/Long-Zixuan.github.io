class Character extends JSBehavior
{
    constructor(left, top, width, height, stateMachine, element)
    {
        super(left, top, width, height, element);
        this._isDead = false;
        this._health = 100;
        this._stateMachine = stateMachine;
        this._dieDelegates = [];
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

    setState(state){ this._stateMachine.input(state);}

    get isDead() { return this._isDead; }

    get getHealth() { return this._health; }

    addDieDelegate(delegate) { this._dieDelegates.push(delegate); }

    onDie()
    {
        this._isDead = true;
        for(i in this._dieDelegates)
        {
            this._dieDelegates[i]();
        }
    }
}