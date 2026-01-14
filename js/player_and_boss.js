class Player extends Character
{
    constructor(gameObject,stateMachine = null) 
    {
        super(gameObject,stateMachine);
        this.verticalSpeed = 0.583 * 60;
        this.horizontalSpeed = 0.625 * 60;
        this.lastShotTime = Date.now();
        this.shootCooldown = 150;
        gameObject.setTop("90%");
        gameObject.setLeft("50%");
    }

    update()
    {
        super.update();
        this.move();
        this.attack();
    }

    setPos(top,left)
    {
        this._gameObject.setTop(top + "%");
        this._gameObject.setLeft(left + "%");
    }

    createBullets() 
    {
        // 子弹间距
        const spacing = 1.75;

        // 创建三发子弹
        for(let i = -1; i <= 1; i++) {
            const bullet = document.createElement('img');
            bullet.src = './src/img/our_bullet2.png';
            bullet.className = 'bullet';

            // 计算子弹位置，中间子弹在玩家正上方，两侧子弹略微偏移
            const bulletLeft = this.getLeftNum() + ((this._gameObject.getWidth / 3) / gameContainer.offsetWidth) * 100 + (i * spacing);//照理说应该是this.element.offsetWidth / 2更接近角色中心，但是经过测试这里除以3更接近角色中心，不知道为什么
            bullet.style.left = bulletLeft + '%';
            bullet.style.top = this.getTopNum() + '%';

            gameContainer.appendChild(bullet);

            // 为两侧子弹添加横向运动
            const horizontalSpeed = i * 0.5 * 0.125 * 60; // 子弹横向扩散速度

            bullets.push({
                element: bullet,
                top: this.getTopNum(),
                left: bulletLeft,
                horizontalSpeed: horizontalSpeed // 新增横向速度属性
            });
        }
    }

    attack()
    {
        const currentTime = Date.now();
        //角色移动
        if (isSpacePressed && currentTime - this.lastShotTime >= this.shootCooldown) 
        {
            this.createBullets();
            this.lastShotTime = currentTime;
        }

    }
    move()
    {
        let left = this.getLeftNum();
        let top = this.getTopNum();
        if(keys['ArrowLeft'] && left > 0) 
        {
            left -= this.horizontalSpeed * deltaTime;
        }
        if(keys['ArrowRight'] && left < 100 - this._gameObject.getWidth/gameContainer.offsetWidth * 100) 
        {
            left += this.horizontalSpeed * deltaTime;
        }
        if(keys['ArrowUp'] && top > 0) {
            top -= this.verticalSpeed * deltaTime;
        }
        if(keys['ArrowDown'] && top < 100 - this._gameObject.getHeight/gameContainer.offsetHeight * 100) 
        {
            top += this.verticalSpeed * deltaTime;
        }
        
        // 更新角色位置
        this._gameObject.setLeft(left + '%');
        this._gameObject.setTop(top + '%');
        //console.log(this.element.offsetWidth/gameContainer.offsetWidth);
    }

    checkHealth()
    {
        if(this._health <= 0)
        {
            this.onDie();
        }
    }
}