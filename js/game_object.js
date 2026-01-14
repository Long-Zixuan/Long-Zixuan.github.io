class GameObject extends BaseObject
{
    constructor(element = null)
    {
        super();
        this._active = true;
        this._visible = true;
        this._behaviors = [];
        if(element)
        {
            this._element = element;
            this._top = element.style.top;
            this._left = element.style.left;
            this._zIndex = element.style.zIndex;
            this._bottom = element.style.bottom;
            this._right = element.style.right;
            this._width = element.offsetWidth;
            this._height = element.offsetHeight;

        }
        else
        {
            this._element = null;
            this._left = 0;
            this._top = 0;
            this._width = 0;
            this._height = 0;
            this._zIndex = 0;
            this._bottom = 0;
            this._right = 0;
        }
        
    }

    static createEmpty()
    {
        return new GameObject();
    }

    static createWithEleId(id)
    {
        return new this(document.getElementById(id));
    }

    get Top()
    {
        return this._top;
    }

    get Left()
    {
        return this._left;
    }


    get Width()
    {
        return this._width;
    }

    get Height()
    {
        return this._height;
    }

    setTop(top)
    {
        this._top = top;
        if(this._element)
        {
            this._element.style.top = top;
        }
    }

    setLeft(left)
    {
        this._left = left;
        if(this._element)
        {
            this._element.style.left = left;
        }
    }

    setHeight(height)
    {
        this._height = height;
        if(this._element)
        {
            this._element.offsetHeight = height;
        }
    }

    setBottom(bottom)
    {
        this._bottom = bottom;
        if(this._element)
        {
            this._element.style.bottom = bottom;
        }
    }

    setRight(right)
    {
        this._right = right;
        if(this._element)
        {
            this._element.style.right = right;
        }
    }

    setZIndex(zIndex)
    {
        this._zIndex = zIndex;
        if(this._element)
        {
            this._element.style.zIndex = zIndex;
        }
    }

    setWidth(width)
    {
        this._width = width;
        if(this._element)
        {
            this._element.style.offsetWidth = width;
        }
    }

    setVisible(visible)
    {
        this._visible = visible;
        if(this._element)
        {
            this._element.style.visibility = visible ? "visible" : "hidden";
        }
    }

    setActive(active)
    {
        super.setActive(active);
        for(i in this._behaviors)
        {
            b = this._behaviors[i];
            b.setActive(active);
        }
    }

    setElement(element)
    {
        this._element = element;
        this._element.style.position = "absolute";
        this._element.style.top = this._top;
        this._element.style.left = this._left;
        this._element.style.zIndex = this._zIndex;
        this._element.style.bottom = this._bottom;
        this._element.style.right = this._right;
        this._element.offsetWidth = this._width;
        this._element.offsetHeight = this._height;
        this.setActive(this._active);
    }

    get Element()
    {
        return this._element;
    }

    get Rect()
    {
        return this._element.getBoundingClientRect();
    }

    setActive(active)
    {
        if(this._active == active)
        {
            return false;
        }
        this._active = active;
        this.setVisible(active);
        for(var i = this._behaviors.length - 1; i >= 0; i--)
        {
            this._behaviors[i].setActive(active);
        }
        return true;
    }

    setSrc(src)
    {
        if(this._element)
        {
            this._element.src = src;
        }
    }

    setClassName(className)
    {
        if(this._element)
        {
            this._element.className = className;
        }
    }

    addBehavior(behavior)
    {
        this._behaviors.push(behavior);
    }

    removeBehavior(behavior)
    {
        var index = this._behaviors.indexOf(behavior);
        if(index != -1)
        {
            this._behaviors.splice(index, 1);
        }
    }

    destroy()
    {
        if(this._element)
        {
            this._element.remove();
        }
        for(var i = this._behaviors.length - 1; i >= 0; i--)
        {
            this._behaviors[i].destroy();
        }
        delete this;
    }

    get isVisible()
    {
        return this._visible;
    }
}

//LZX-VSCode-2026-01-13-001