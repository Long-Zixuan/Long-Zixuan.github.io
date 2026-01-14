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