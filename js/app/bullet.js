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

    selfDestoryLogic()
    {
        if(this.getTopNum() <= 0 - this._gameObject.Height/gameContainer.offsetHeight * 100 || this.getLeftNum() < 0 - this._gameObject.Width/gameContainer.offsetWidth * 100 || this.getLeftNum() > 100 || this.getTopNum() > 100) {
            this._gameObject.destroy();       
        }
    }

    update()
    {
        super.update();
        this.move();
        this.selfDestoryLogic();
    }

}

//LZX-VSCode-2026-01-14-005