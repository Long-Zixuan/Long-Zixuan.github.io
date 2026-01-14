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

    onCollisionLogic()
    {
        for( i in this._collEventAndFuncs)
        {
            f = this._collEventAndFuncs[i];
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

    fixUpate(){}

    destroy()
    {
        JSBehaviors.splice(JSBehaviors.indexOf(this), 1);
        this._gameObject.removeBehavior(this);
    }

    setActive(active)
    {
        if(active == self._active)
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
}