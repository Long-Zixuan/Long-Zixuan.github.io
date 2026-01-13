class GameObject
{
    constructor(left, top, width, height, element = null)
    {
        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
        this._active = true;
        this._visible = true;
        if(this._img.hasAttribute("style"))
        {
            this._element = element;
        }
        else if(element)
        {
            this._element = element.element;
        }
        else
        {
            this._element = null;
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