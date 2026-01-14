class Text extends GameObject 
{
    constructor(gameObject)
    {
        super(gameObject);
    }

    static createWithEleId(id)
    {
        return new Text(document.getElementById(id));
    }
    
    setText(text)
    {
        this._element.textContent = text;
    }
}