class Button extends GameObject
{
    constructor(gameObject)
    {
        super(gameObject);
    }

    static createWithEleId(id)
    {
        return new Button(document.getElementById(id));
    }

    addClickListener(func)
    {
        this._element.addEventListener("click", func);
    }
}