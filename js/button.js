class Button extends GameObject
{
    constructor(gameObject)
    {
        super(gameObject);
    }

    addClickListener(func)
    {
        this._element.addEventListener("click", func);
    }
}