class JSBehavior extends GameObject
{
    _collEventAndFuncs = [];
    constructor(left, top, width, height, element = null)
    {
        super(left, top, width, height, element);
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
        super.destroy();
    }

    setActive(active)
    {
        if(!super.setActive(active))
        {
            return false;
        }
        if(active)
        {
            this.awake();
        }
        return true;
    }
}