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
        this.addDieDelegate((obj)=>{obj._gameObject.Element.src = './src/img/player_die.png';gameStateMachine.input(GAME_EVENT_DIE);})
        this.bulletColEvent = null;
    }

    update()
    {
        super.update();
        this.move();
        this.attack();
    }

    createBullets() 
    {
        // 子弹间距
        const spacing = 1.75;

        // 创建三发子弹
        for(let i = -1; i <= 1; i++) {
            let bulletEle = document.createElement('img');
            //bulletEle.src = './src/img/our_bullet2.png';
            //bulletEle.className = 'bullet';
            let bulletObj = new GameObject(bulletEle);
            let bullet = new Bullet(bulletObj);
            bullet.GameObj.setSrc('./src/img/our_bullet2.png');
            bullet.GameObj.setClassName('bullet');
            // 计算子弹位置，中间子弹在玩家正上方，两侧子弹略微偏移
            const bulletLeft = this.getLeftNum() + ((this._gameObject.Width / 3) / gameContainer.offsetWidth) * 100 + (i * spacing);//照理说应该是this.element.offsetWidth / 2更接近角色中心，但是经过测试这里除以3更接近角色中心，不知道为什么
            bullet.GameObj.setLeft(bulletLeft + '%');
            //bullet.style.left = bulletLeft + '%';
            //bullet.style.top = this.getTopNum() + '%';
            bullet.GameObj.setTop(this.getTopNum() + '%');

            bullet.addCollisionEventAndFuncs(this._bulletColEvent);

            gameContainer.appendChild(bullet.GameObj.Element);

            // 为两侧子弹添加横向运动
            const horizontalSpeed = i * 0.5 * 0.125 * 60; // 子弹横向扩散速度

            bullet.setSpeed(-120, horizontalSpeed);

            /*bullets.push({
                element: bullet,
                top: this.getTopNum(),
                left: bulletLeft,
                horizontalSpeed: horizontalSpeed // 新增横向速度属性
            });*/
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
        if(keys['ArrowRight'] && left < 100 - this._gameObject.Width/gameContainer.offsetWidth * 100) 
        {
            left += this.horizontalSpeed * deltaTime;
        }
        if(keys['ArrowUp'] && top > 0) {
            top -= this.verticalSpeed * deltaTime;
        }
        if(keys['ArrowDown'] && top < 100 - this._gameObject.Height/gameContainer.offsetHeight * 100) 
        {
            top += this.verticalSpeed * deltaTime;
        }
        
        // 更新角色位置
        this._gameObject.setLeft(left + '%');
        this._gameObject.setTop(top + '%');
    }

    checkHealth()
    {
        if(this._health <= 0)
        {
            this.onDie();
        }
    }

    setBulletColEvent(event)
    {
        console.log(event.length)
        this._bulletColEvent = event;
    }
}

class Boss extends Character
{
    constructor(gameObject,stateMachine = null) 
    {
        super(gameObject,stateMachine);
        gameObject.setTop("5%");
        gameObject.setLeft("50%");
        this.verticalSpeed = 0.25 * 60;
        this.horizontalSpeed = 0.16 * 60;
        this.verticalSpeedRate = 1;
        this.horizontalSpeedRate = 1;
        this.lastDirChangeTime = Date.now();
        this.lastAttackModeChangeTime = Date.now();
        this.lastAttackTime = Date.now();
        this.attackModeChangeTime = 5000;
        this.changeDirTime = 150;
        this.attackTime = 1000;
        this.Angle = 0;
        this.attackMode = 0;
        this.addDieDelegate((obj)=>{obj._gameObject.Element.src = './src/img/boss_die.png';gameStateMachine.input(GAME_EVENT_WIN);})
        this._bulletColEvent = null;
    }

    update()
    {
        super.update();
        this.move();
        this.attack();
    }
    

    move()
    {
        this.changeDir();
        let left = this.getLeftNum();
        let top = this.getTopNum();
        if(top < 100 - (this._gameObject.Height / gameContainer.offsetHeight) * 100 && this.verticalSpeedRate > 0)
            {
                top += this.verticalSpeed * this.verticalSpeedRate * deltaTime;
            }
            if(this.top > 0 && this.verticalSpeedRate < 0)
            {
                top += this.verticalSpeed* this.verticalSpeedRate * deltaTime;
            }
            if(left < 100 - (this._gameObject.Width / gameContainer.offsetWidth) * 100 && this.horizontalSpeedRate > 0)
            {
                left += this.horizontalSpeed* this.horizontalSpeedRate * deltaTime;
            }
            if(left > 0 && this.horizontalSpeedRate < 0)
            {
                left += this.horizontalSpeed * this.horizontalSpeedRate * deltaTime;
            }
            // 更新boss位置
            this._gameObject.setTop(top + '%');
            this._gameObject.setLeft(left + '%');
    }
    changeDir()
    {
        let currentTime = Date.now();
        if(currentTime - this.lastDirChangeTime < this.changeDirTime){return;}
        this.lastDirChangeTime = currentTime;
        this.verticalSpeedRate = 1 - 2 * Math.random();
        this.horizontalSpeedRate = 1 - 2 * Math.random();
    }

    attack()
    {
        this.attackModeChange();
        if(gameStateMachine.getCurState() != GAME_EVENT_RUN){return;}

        let currentTime = Date.now();
        if(currentTime - this.lastAttackTime < this.attackTime){return;}
        this.lastAttackTime = currentTime;

        //if(bossBullets.length >= 70){return;}

        if(this.attackMode <= 0.45) 
        {
            let createbulletCount = 20;
            for(let i = 0; i < createbulletCount; i++)
            {
                const bossBullet = document.createElement('img');
                bossBullet.src = './src/img/boss_bullet2.png';
                bossBullet.className = 'bullet';
                let bulletObj = new GameObject(bossBullet);
                let bullet = new Bullet(bulletObj);
                bullet.GameObj.setLeft(this.getLeftNum() + '%');
                bullet.GameObj.setTop(this.getTopNum() + '%');
                // bossBullet.style.left = this.getLeftNum() + '%';
                // bossBullet.style.top = this.getTopNum() + '%';
                const horizontalSpeed = Math.cos(i / createbulletCount * 2 * Math.PI) * 0.25 * 2 * 60;
                const verticalSpeed = Math.sin(i / createbulletCount * 2 * Math.PI) * 0.16 * 2 * 60;

                gameContainer.appendChild(bossBullet);

                bullet.setSpeed(verticalSpeed,horizontalSpeed);
                bullet.addCollisionEventAndFuncs(this._bulletColEvent);

                // bossBullets.push({
                //     element: bossBullet,
                //     top: this.getTopNum(),
                //     left: this.getLeftNum(),
                //     horizontalSpeed: horizontalSpeed,
                //     verticalSpeed: verticalSpeed
                // });
            }
        }
        else if(this.attackMode <= 0.9)
        {
            let createBulletCount = 20;
            for(let i = 0; i < createBulletCount; i++)
            {
                const bossBullet = document.createElement('img');
                bossBullet.src = './src/img/boss_bullet2.png';
                bossBullet.className = 'bullet';
                let bulletObj = new GameObject(bossBullet);
                let bullet = new Bullet(bulletObj);
                bullet.GameObj.setLeft(this.getLeftNum() + '%');
                bullet.GameObj.setTop(this.getTopNum() + '%');
                const horizontalSpeed = Math.cos(i / createBulletCount * 0.5 * Math.PI + this.Angle/2 * Math.PI) * 0.25 * 2 * 60;
                const verticalSpeed = Math.sin(i / createBulletCount * 0.5 * Math.PI + this.Angle/2 * Math.PI) * 0.16 * 2 * 60;

                gameContainer.appendChild(bossBullet);

                bullet.setSpeed(verticalSpeed,horizontalSpeed);
                bullet.addCollisionEventAndFuncs(this._bulletColEvent);

                // bossBullets.push({
                //     element: bossBullet,
                //     top: this.getTopNum(),
                //     left: this.getLeftNum(),
                //     horizontalSpeed: horizontalSpeed,
                //     verticalSpeed: verticalSpeed
                // });
            }
            this.Angle += 1;
            this.Angle = this.Angle % 4;

        }
    }
    attackModeChange()
    {
        let currentTime = Date.now();
        if(currentTime - this.lastAttackModeChangeTime < this.attackModeChangeTime){return;}
        this.lastAttackModeChangeTime = currentTime;
        this.attackMode = Math.random();
    }

    checkHealth()
    {
        if(this._health <= 0)
        {
            this.onDie();
        }
    }

    setBulletColEvent(bulletColEvent)
    {
        this._bulletColEvent = bulletColEvent;
    }
}

//LZX-VSCode-2026-01-14-002