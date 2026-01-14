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

//LZX-VSCode-2026-01-14-009