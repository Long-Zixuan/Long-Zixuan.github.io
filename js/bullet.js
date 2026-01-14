class Bullet extends JSBehavior
{
    constructor(gameObject, stateMachine)
    {
        super(gameObject, stateMachine);
        this._vSpeed = 0;
        this._hSpeed = 0;
    }

    getTopNum()
    {
        console.log(this._gameObject.Top);
        return parseFloat(this._gameObject.Top.toString().slice(0, this._gameObject.Top.toString().length - 1));
    }

    getLeftNum()
    {
        return parseFloat(this._gameObject.Left.toString().slice(0, this._gameObject.Left.toString().length - 1));
    }

    move()
    {
        let top = this.getTopNum() + this._vSpeed * deltaTime;
        let left = this.getLeftNum() + this._hSpeed * deltaTime;
        this._gameObject.setTop(top + "%");
        this._gameObject.setLeft(left + "%");
    }

    setSpeed(vSpeed, hSpeed)
    {
        this._vSpeed = vSpeed;
        this._hSpeed = hSpeed;
    }

    update()
    {
        super.update();
        this.move();
    }

}