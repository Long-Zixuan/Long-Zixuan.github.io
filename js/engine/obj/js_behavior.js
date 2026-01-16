class JSBehavior extends BaseObject
{
   
    constructor(gameObject)
    {
        super();
        this._gameObject = gameObject;
        this._gameObject.addBehavior(this);
        this._active = gameObject.getActive();
        this._visible = gameObject.isVisible;
        this._collEventAndFuncs = [];
        JSBehaviors.push(this);
    }

    addCollisionEventAndFuncs(eventAndFunc)
    {
        this._collEventAndFuncs.push(eventAndFunc);
    }

    clearAllCollisionEventAndFuncs()
    {
        this._collEventAndFuncs.splice(0, this._collEventAndFuncs.length);
    }

    onCollisionLogic()
    {
        for(var i in this._collEventAndFuncs)
        {
            let f = this._collEventAndFuncs[i];
            if(f[0](this))
            {
                f[1](this);
            }
        }
    }

    awake(){}

    start(){}
    update()
    {
        this.onCollisionLogic();
    }

    lateUpdate(){}

    fixUpdate(){}

    destroy()
    {
        JSBehaviors.splice(JSBehaviors.indexOf(this), 1);
        this._gameObject.removeBehavior(this);
    }

    setActive(active)
    {
        if(active == this._active)
        {
            return false;
        }
        if(active)
        {
            this.awake();
        }
        super.setActive(active);
        return true;
    }

    get Active()
    {
        return this._active;
    }

    get GameObj()
    {
        return this._gameObject;
    }

    get Top()
    {
        return this._gameObject.Top;
    }

    get Bottom()
    {
        return this._gameObject.Bottom;
    }

    get Left()
    {
        return this._gameObject.Left;
    }

    get Right()
    {
        return this._gameObject.Left;
    }


    get Width()
    {
        return this._gameObject.Width;
    }

    get Height()
    {
        return this._gameObject.Height;
    }

    get Rect()
    {
        return this._gameObject.Rect;
    }

    setTop(top)
    {
        this._gameObject.setTop(top);
    }

    setLeft(left)
    {
        this._gameObject.setLeft(left);
    }

    setHeight(height)
    {
        this._gameObject.setHeight(height);
    }

    setBottom(bottom)
    {
        this._gameObject.setBottom(bottom);
    }

    setRight(right)
    {
        this._gameObject.setRight(right);
    }
}

//LZX-VSCode-2026-01-13-004
