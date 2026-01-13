class GameObject
{
    constructor(element = null)
    {
        this._active = true;
        this._visible = true;
        if(this._img.hasAttribute("style"))
        {
            this._element = element;
            this._left = this._element.style.left;
            this._top = this._element.style.top;
            this._width = this._element.style.offsetWidth;
            this._height = this._element.style.offsetHeight;
        }
        else if(element)
        {
            this._element = element.element;
            this._left = this._element.style.left;
            this._top = this._element.style.top;
            this._width = this._element.style.offsetWidth;
            this._height = this._element.style.offsetHeight;
        }
        else
        {
            this._element = null;
            this._left = 0;
            this._top = 0;
            this._width = 0;
            this._height = 0;
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

    setTop(top)
    {
        this._top = top;
        if(this._element)
        {
            this._element.style.top = top;
        }
    }

    setWidth(width)
    { 
        this._width = width;
        if(this._element)
        {
            this._element.style.width = width;
        }
    }

    setHeight(height)
    {
        this._height = height;
        if(this._element)
        {
            this._element.style.height = height;
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

    setElement(element)
    {
        if(!this._img.hasAttribute("style"))
        {
            element = element.element;
        }
        this._element = element;
        this._left = this._element.style.left;
        this._top = this._element.style.top;
        this._width = this._element.style.offsetWidth;
        this._height = this._element.style.offsetHeight;
    }

    setActive(active)
    {
        if(this._active == active)
        {
            return false;
        }
        this._active = active;
        this.setActive(active);
        return true;
    }

    destroy()
    {
        if(this._element)
        {
            this._element.remove();
        }
        delete this;
    }

    get isVisible()
    {
        return this._visible;
    }
}