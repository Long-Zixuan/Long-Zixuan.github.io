class Text extends GameObject 
{
    constructor(gameObject)
    {
        super(gameObject);
    }

    setText(text)
    {
        this._element.textContent = text;
    }
}

//LZX-VSCode-2026-01-14-010