class BulletsPool 
{
    static _instance = null;
    static get Instance()
    {
        return this._instance;
    }
    createBullet()
    {
        let bulletEle = document.createElement('img');
        let bulletObj = new GameObject(bulletEle);
        bulletObj.setClassName('bullet');
        let bullet = new Bullet(bulletObj);
        bullet.GameObj.setTop("-100px");
        bullet.GameObj.setLeft("-100px");
        return bullet;
    }

    constructor() 
    {
        this._bullets = [];
        this.count = 100;
        for (let i = 0; i < this.count; i++)
        {
            let bullet = this.createBullet();
            bullet.GameObj.setActive(false);
            this._bullets.push(bullet);
        }
        BulletsPool._instance = this;
    } 

    getBullet()
    {
        if(this._bullets.length > 0)
        {
            let bul = this._bullets.pop();
            bul.GameObj.setActive(true);
            bul.GameObj.setVisible(true);
            return bul;
        }
        return this.createBullet();
    }

    returnBullet(bullet)
    {
        if(this._bullets.length < this.count)
        {
            bullet.GameObj.setTop("-100px");
            bullet.GameObj.setLeft("-100px");
            bullet.GameObj.setActive(false);
            bullet.clearAllCollisionEventAndFuncs()
            this._bullets.push(bullet);
        }
        else
        {
            bullet.GameObj.destroy();
        }
    }
}

let bulletPoolMgr = new BulletsPool();
//LZX-VSCode-2026-01-14-010