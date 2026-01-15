class JSObjPool 
{
    constructor(className, jsObj, count) 
    {
        this._jsObjs = [];
        this.count = count;
        this.jsObj = jsObj;
        this.className = className;
        for (let i = 0; i < this.count; i++)
        {
            let cloneObj = cloneJSBehavior(jsObj, className);
            cloneObj.GameObj.setTop("-100px");
            cloneObj.GameObj.setLeft("-100px");
            gameContainer.appendChild(cloneObj.GameObj.Element);
            cloneObj.GameObj.setActive(false);
            this._jsObjs.push(cloneObj);
        }
    } 

    getJSObj()
    {
        if(this._jsObjs.length > 0)
        {
            let bul = this._jsObjs.pop();
            bul.GameObj.setActive(true);
            bul.GameObj.setVisible(true);
            return bul;
        }
        let obj = cloneJSBehavior(this.jsObj,this.className);
        gameContainer.appendChild(obj.GameObj.Element);
        return obj;
    }

    returnJSObj(jsObj)
    {
        if(this._jsObjs.length < this.count)
        {
            jsObj.GameObj.setTop("-100px");
            jsObj.GameObj.setLeft("-100px");
            jsObj.GameObj.setActive(false);
            jsObj.clearAllCollisionEventAndFuncs()
            this._jsObjs.push(jsObj);
        }
        else
        {
            jsObj.GameObj.destroy();
        }
    }
}

//LZX-VSCode-2026-01-14-010