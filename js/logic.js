const playerElement = document.getElementById('player');
    const bossElement = document.getElementById('boss');
    const gameContainer = document.getElementById('gameContainer');
    const bossHealthElement = document.getElementById('bossHealthValue');
    const playerHealthElement = document.getElementById('playerHealthValue');
    const fpsDisplayElement = document.getElementById('fpsValue');
    const restartButton = document.getElementById('restart-button');
    const pauseButton = document.getElementById('pause-button');
    const restartButtonTextElement = document.getElementById('ButtonText');
    const pauseButtonTextElement = document.getElementById('PauseText');
    const gameEndTextElement = document.getElementById('gameEndMsgText');

    const gameDiaLogElement = document.getElementById('gameDialogBar');

    const bgm = document.getElementById("bgMusic");

    const unSupportBroswerMSGEle = document.getElementById('UnSupportBroswerMSG');
    unSupportBroswerMSGEle.textContent = "";

    const lKeyBtn = document.getElementById('lKeyBtn');
    const rKeyBtn = document.getElementById('rKeyBtn');
    const fKeyBtn = document.getElementById('fKeyBtn');
    const bKeyBtn = document.getElementById('bKeyBtn');
    const sKeyBtn = document.getElementById('sKeyBtn');

    //const bossBulletsCount = document.getElementById('bossBulletsCount');//Debug

    let playerLeft = 50;
    let playerTop = 90;

    let bossLeft = 50;
    let bossTop = 5;

    let startBossHealth = 100; // 初始Boss血量
    let startPlayerHealth = 100; // 初始玩家血量

    let verticalSpeedRate = 1;
    let horizontalSpeedRate = 1;
    const bossVerticalSpeed = 0.25 * 60;
    const bossHorizontalSpeed = 0.16 * 60;

    const playerHorizontalSpeed = 0.625 * 60;
    const playerVerticalSpeed = 0.583 * 60;


    const bullets = [];
    const bossBullets = [];

    const keys = {};

    const keyUpFuncs = {};

    const keyDownFuncs = {
        'Escape' : pauseLogic
    };

    let isSpacePressed = false;
    const shootCooldown = 150;

    let dialogNniFrameId = null;

    const GAME_STATE_RUNNING = 0;
    const GAME_STATE_WIN = 1;
    const GAME_STATE_DIE = -1;
    const GAME_STATE_PAUSE = 2;

    const GAME_EVENT_RUN = 0;
    const GAME_EVENT_WIN = 1;
    const GAME_EVENT_DIE = -1;
    const GAME_EVENT_PAUSE = 2;
    const GAME_EVENT_RESTART = 3;

    const RUNNING = {
        "onEnter":()=>{
            pauseButtonTextElement.textContent = "暂停";
        },
        "onExit":()=>{
            
        },
        "onUpdate":()=>{
            update();
        }
    }

    const WIN = {
        "onEnter":()=>{
            dialogNniFrameId = requestAnimationFrame(winLogic);
        },
        "onExit":()=>{
            cancelDialogAni();
        },
        "onUpdate":()=>{
            
        }
    }

    const DIE = {
        "onEnter":()=>{
            dialogNniFrameId = requestAnimationFrame(dieLogic);
        },
        "onExit":()=>{
            cancelDialogAni();
        },
        "onUpdate":()=>{
             
        }
    }

    const PAUSE = {
       "onEnter":()=>{
            pauseButtonTextElement.textContent = "继续";
        },
        "onExit":()=>{
            cancelDialogAni();
        },
        "onUpdate":()=>{

        }
    }

    let gameStateMachine = new StateMachine(GAME_STATE_RUNNING);
    gameStateMachine.addState(GAME_STATE_RUNNING, RUNNING);
    gameStateMachine.addState(GAME_STATE_WIN, WIN);
    gameStateMachine.addState(GAME_STATE_DIE, DIE);
    gameStateMachine.addState(GAME_STATE_PAUSE, PAUSE);
    
    gameStateMachine.addTrans(GAME_STATE_RUNNING, GAME_STATE_WIN, GAME_EVENT_WIN);
    gameStateMachine.addTrans(GAME_STATE_RUNNING, GAME_STATE_DIE, GAME_EVENT_DIE);
    gameStateMachine.addTrans(GAME_STATE_RUNNING, GAME_STATE_PAUSE, GAME_EVENT_PAUSE);
    gameStateMachine.addTrans(GAME_STATE_PAUSE, GAME_STATE_RUNNING, GAME_EVENT_RUN);
    gameStateMachine.addTrans(GAME_STATE_DIE,GAME_STATE_RUNNING,GAME_EVENT_RESTART,reStart);
    gameStateMachine.addTrans(GAME_STATE_WIN,GAME_STATE_RUNNING,GAME_EVENT_RESTART,reStart);

    const GAME_FRAME_RATE = 60;

    let deltaTime = 1 / GAME_FRAME_RATE;

    document.addEventListener("visibilitychange", function() {
        var string = document.visibilityState
        console.log(string)
        if (string === 'hidden') {  // 当页面由前端运行在后端时，出发此代码
            console.log('网页处于后台运行')
            pauseGame();
        }
        if (string === 'visible') {   // 当页面由隐藏至显示时
            console.log('网页处于前台运行')
        }
      });
      

    document.addEventListener('keydown', (e) => {
        hideAllPhoneBtn()
        keys[e.key] = true;
        if(e.key === ' ') {
            isSpacePressed = true;
            e.preventDefault();
        }
        if(keyDownFuncs.hasOwnProperty(e.key))
        {
            keyDownFuncs[e.key]();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        if(e.key === ' ') {
            isSpacePressed = false;
        }
        if(keyUpFuncs.hasOwnProperty(e.key))
        {
            keyUpFuncs[e.key]();
        }
    });

    function bossAttackModeChangeLogic()
    {
        if(gameStateMachine.getCurState() != GAME_EVENT_RUN){return;}
        bossAttackMode = Math.random();
    }

    class Boss
    {
        constructor(element, left, top, health, verticalSpeed, horizontalSpeed, verticalSpeedRate, horizontalSpeedRate,changeDirTime, attackModeChangeTime, attackTime)
        {
            this.element = element;
            this.left = left;
            this.top = top;
            this.health = health;
            this.verticalSpeed = verticalSpeed;
            this.horizontalSpeed = horizontalSpeed;
            this.verticalSpeedRate = verticalSpeedRate;
            this.horizontalSpeedRate = horizontalSpeedRate;
            this.lastDirChangeTime = Date.now();
            this.lastAttackModeChangeTime = Date.now();
            this.lastAttackTime = Date.now();
            this.attackModeChangeTime = attackModeChangeTime;
            this.changeDirTime = changeDirTime;
            this.attackTime = attackTime;
            this.Angle = 0;
            this.attackMode = 0;
        }

        update()
        {
            this.move();
            this.attack();
        }
        

        move()
        {
            this.changeDir();
            if(this.top < 100 - (this.element.offsetHeight / gameContainer.offsetHeight) * 100 && this.verticalSpeedRate > 0)
                {
                    this.top += this.verticalSpeed * this.verticalSpeedRate * deltaTime;
                }
                if(this.top > 0 && this.verticalSpeedRate < 0)
                {
                    this.top += this.verticalSpeed* this.verticalSpeedRate * deltaTime;
                }
                if(this.left < 100 - (this.element.offsetWidth / gameContainer.offsetWidth) * 100 && this.horizontalSpeedRate > 0)
                {
                    this.left += this.horizontalSpeed* this.horizontalSpeedRate * deltaTime;
                }
                if(this.left > 0 && this.horizontalSpeedRate < 0)
                {
                    this.left += this.horizontalSpeed * this.horizontalSpeedRate * deltaTime;
                }
                // 更新boss位置
                this.element.style.left = this.left + '%';
                this.element.style.top = this.top + '%';
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
                    bossBullet.style.left = this.left + '%';
                    bossBullet.style.top = this.top + '%';
                    const horizontalSpeed = Math.cos(i / createbulletCount * 2 * Math.PI) * 0.25 * 2 * 60;
                    const verticalSpeed = Math.sin(i / createbulletCount * 2 * Math.PI) * 0.16 * 2 * 60;

                    gameContainer.appendChild(bossBullet);

                    bossBullets.push({
                        element: bossBullet,
                        top: this.top,
                        left: this.left,
                        horizontalSpeed: horizontalSpeed,
                        verticalSpeed: verticalSpeed
                    });
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
                    bossBullet.style.left = this.left + '%';
                    bossBullet.style.top = this.top + '%';
                    const horizontalSpeed = Math.cos(i / createBulletCount * 0.5 * Math.PI + this.Angle/2 * Math.PI) * 0.25 * 2 * 60;
                    const verticalSpeed = Math.sin(i / createBulletCount * 0.5 * Math.PI + this.Angle/2 * Math.PI) * 0.16 * 2 * 60;

                    gameContainer.appendChild(bossBullet);

                    bossBullets.push({
                        element: bossBullet,
                        top: this.top,
                        left: this.left,
                        horizontalSpeed: horizontalSpeed,
                        verticalSpeed: verticalSpeed
                    });
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

        setPos(top,left)
        {
            this.left = left;
            this.top = top;
        }
    }

    let boss = new Boss(bossElement, bossLeft, bossTop, startBossHealth, bossVerticalSpeed, bossHorizontalSpeed, verticalSpeedRate, horizontalSpeedRate, 150, 5000 ,1000);


    class Player
    {
        constructor(element, left, top, health, verticalSpeed, horizontalSpeed, shootCooldown)
        {
            this.element = element;
            this.left = left;
            this.top = top;
            this.health = health;
            this.verticalSpeed = verticalSpeed;
            this.horizontalSpeed = horizontalSpeed;
            this.lastShotTime = Date.now();
            this.shootCooldown = shootCooldown;
        }

        update()
        {
            this.move();
            this.attack();
        }

        setPos(top,left)
        {
            this.left = left;
            this.top = top;
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
                const bulletLeft = this.left + ((this.element.offsetWidth / 3) / gameContainer.offsetWidth) * 100 + (i * spacing);//照理说应该是this.element.offsetWidth / 2更接近角色中心，但是经过测试这里除以3更接近角色中心，不知道为什么
                bullet.style.left = bulletLeft + '%';
                bullet.style.top = this.top + '%';
    
                gameContainer.appendChild(bullet);
    
                // 为两侧子弹添加横向运动
                const horizontalSpeed = i * 0.5 * 0.125 * 60; // 子弹横向扩散速度
    
                bullets.push({
                    element: bullet,
                    top: this.top,
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
            if(keys['ArrowLeft'] && this.left > 0) {
                this.left -= this.horizontalSpeed * deltaTime;
            }
            if(keys['ArrowRight'] && this.left < 100 - this.element.offsetWidth/gameContainer.offsetWidth * 100) {
                this.left += this.horizontalSpeed * deltaTime;
            }
            if(keys['ArrowUp'] && this.top > 0) {
                this.top -= this.verticalSpeed * deltaTime;
            }
            if(keys['ArrowDown'] && this.top < 100 - this.element.offsetHeight/gameContainer.offsetHeight * 100) {
                this.top += this.verticalSpeed * deltaTime;
            }
            
            // 更新角色位置
            this.element.style.left = this.left + '%';
            this.element.style.top = this.top + '%';
            //console.log(this.element.offsetWidth/gameContainer.offsetWidth);
        }
    }

    let player = new Player(playerElement, playerLeft, playerTop, startPlayerHealth, playerVerticalSpeed, playerHorizontalSpeed, shootCooldown);

    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let lastTime = Date.now();
    function updateDeltaTime()
    {
        let currentTime = Date.now();
        deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
    }
      
    let hadTellPlayer = false;

    function updateBullets()
    {
        /*Debug End*/
        //bossBulletsCount.textContent = bossBullets.length;
        console.log("Boss bullets count:\t" + bossBullets.length);
        console.log("Player bullets count:\t" + bullets.length);
        console.log(" ");
        /*Debug End*/

        if(gameStateMachine.getCurState() != GAME_EVENT_RUN) {return;}
        // 更新子弹位置
        for(let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.top -= 120 * deltaTime; // 垂直移动速度
            bullet.left += bullet.horizontalSpeed * deltaTime; // 添加横向移动

            // 更新子弹位置
            bullet.element.style.top = bullet.top + '%';
            bullet.element.style.left = bullet.left + '%';

            // 移除超出边界的子弹
            if(bullet.top <= 0 - bullet.element.offsetHeight/gameContainer.offsetHeight * 100 || bullet.left < 0 - bullet.element.offsetWidth/gameContainer.offsetWidth * 100 || bullet.left > 100 || bullet.top > 100) {
                bullet.element.remove();
                bullets.splice(i, 1);
                continue;
            }
            if(isColliding(bullet.element.getBoundingClientRect(),bossElement.getBoundingClientRect())) 
            {
                bullet.element.remove();
                bullets.splice(i, 1);

                //bossHealth -= 1;
                boss.health -= 1;
                bossHealthElement.textContent = boss.health;
            }
            if(boss.health == startBossHealth / 2 && !hadTellPlayer)
            {
                /*for(key in keys)
                {
                    keys[key] = false;
                }
                isSpacePressed = false;
                hadTellPlayer = true;
                alert("坚持住，Boss只剩下半血了！");
                updateDeltaTime();*/
                dialogNniFrameId = requestAnimationFrame(bossHalfHealthLogic);
                hadTellPlayer = true;
            }
            if(boss.health <= 0) 
            {
                gameStateMachine.input(GAME_EVENT_WIN);
                return;
            }
        }
        // 更新敌人子弹位置
        for(let i = bossBullets.length - 1; i >= 0; i--)
        {
            const bossBullet = bossBullets[i];
            bossBullet.top += bossBullet.verticalSpeed * deltaTime; // 垂直移动速度
            bossBullet.left += bossBullet.horizontalSpeed * deltaTime; // 添加横向移动

            // 更新子弹位置
            bossBullet.element.style.top = bossBullet.top + '%';
            bossBullet.element.style.left = bossBullet.left + '%';

            // 移除超出边界的子弹
            if(bossBullet.top <= 0 - bossBullet.element.offsetHeight/gameContainer.offsetHeight * 100 || bossBullet.left < 0 - bossBullet.element.offsetWidth/gameContainer.offsetWidth * 100 || bossBullet.left > 100 || bossBullet.top > 100) {
                bossBullet.element.remove();
                bossBullets.splice(i, 1);
                continue;
            }

            if(isColliding(bossBullet.element.getBoundingClientRect(),playerElement.getBoundingClientRect()))
            {
                bossBullet.element.remove();
                bossBullets.splice(i, 1);

                player.health -= 1;
                playerHealthElement.textContent = player.health;

            }
            if(player.health <= 0) 
            {
                gameStateMachine.input(GAME_EVENT_DIE);
                return;
            }
        }

    }

    function showDialogBar(text,bottomText,textMode)
    {
        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE && bottomText == null)
        {
            restartButtonTextElement.textContent = "继续游戏";
        }
        if((gameStateMachine.getCurState() == GAME_STATE_WIN || gameStateMachine.getCurState() == GAME_STATE_DIE) && bottomText == null )
        {
            restartButtonTextElement.textContent = "重新开始";
        }

        
        gameDiaLogElement.style.bottom = "0px";
        gameDiaLogElement.style.left = "0px";

        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE && text == '')
        {
            gameEndTextElement.textContent = "游戏已暂停";
            return;
        }

        if(textMode == false)
        {
            gameEndTextElement.textContent = text;
            return;
        }

        let index = 0;

        gameEndTextElement.textContent = "";

        function typeWriter() {
            if(gameStateMachine.getCurState() == GAME_STATE_RUNNING)
            {
                return;
            }
            if (index < text.length) {
                gameEndTextElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100); // 调整速度
            }
        }

        typeWriter();
    }
    function backgroundCreateAndMoveLogic()
    {
        if(gameStateMachine.getCurState() != GAME_STATE_RUNNING)
        {
            return;
        }
        const bkImg = document.createElement('img');
        bkImg.className = "backgroundImg";
        bkImg.src = "./src/img/background_move.png";
        bkImg.style.top = "-200vh";
        let speed = 3;
        gameContainer.appendChild(bkImg);
        let top = -200;
        const interval = setInterval(() => {
            /*if(gameStateMachine.getCurState() != GAME_RUNNING)
            {
                return;
            }*/
            top += speed; // 调整速度
            bkImg.style.top = `${top}vh`;
            /*if (left > 200) { // 当弹幕移出屏幕时移除
                clearInterval(interval);
                body.removeChild(danmu);
            }*/
        }, 20);
        setTimeout(() => {
            clearInterval(interval);
            gameContainer.removeChild(bkImg);
        }, 5000);
    }

    function hideDialogBar()
    {
        gameDiaLogElement.style.bottom = "-1000px";
        gameDiaLogElement.style.left = "-1000px";
    }

    function pauseGame()
    {
        gameStateMachine.input(GAME_EVENT_PAUSE);
        showDialogBar("游戏已暂停",null,false);
        bgm.pause();
    }

    function resumeGame()
    {
        gameStateMachine.input(GAME_EVENT_RUN);
        hideDialogBar();
        bgm.play();
    }

    function pauseButtonLogic()
    {
        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE)
        {
            resumeGame();
        }
        else if(gameStateMachine.getCurState() == GAME_STATE_RUNNING)
        {
            pauseGame();
        }
    }

    function pauseLogic()
    {
        if(gameStateMachine.getCurState() == GAME_STATE_RUNNING)
        {
            pauseGame();
        }
        else if(gameStateMachine.getCurState() == GAME_STATE_PAUSE)
        {
            resumeGame();
        }
    }

    function winLogic()
    {
        bgm.pause();
        showDialogBar("你赢了!你剩余血量："+player.health);
        boss.element.src = './src/img/boss_die.png';
        //restartButton.style.bottom = '10px';
        //restartButton.style.left = '50%';
        //gameEndTextElement.textContent = "你赢了!你剩余血量："+player.health;
        
    }


    function dieLogic()
    {
        bgm.pause();
        showDialogBar("你ga了。Boss剩余血量："+boss.health);
        playerElement.src = './src/img/player_die.png';
        //restartButton.style.bottom = '10px';
        //restartButton.style.left = '50%';
        //gameEndTextElement.textContent = "你ga了。Boss剩余血量："+boss.health;
    }

    function bossHalfHealthLogic()
    {
        //gameEndTextElement.textContent = "坚持住，Boss只剩下半血了！我一定要战胜她。";
        gameStateMachine.input(GAME_EVENT_PAUSE);
        showDialogBar("坚持住，Boss只剩下半血了！我一定要战胜她。");
    }

    function update()
    {
        bgm.play().then(data=>{}).catch(err=>{});// 用户进行交互后才有bgm，别问，问就是HTML特性
        player.update();
        boss.update();
        updateBullets();
        fpsDisplayElement.textContent = (1 / deltaTime).toFixed(2);
    }

    function gameLoop() 
    {        
        updateDeltaTime();
        gameStateMachine.update();
        sleep(1 / GAME_FRAME_RATE * 1000).then(() => {requestAnimationFrame(gameLoop);});
    }

    function isPhone() {
        //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
        var info = navigator.userAgent;
        //通过正则表达式的test方法判断是否包含“Mobile”字符串
        var isPhone = /mobile/i.test(info);
        //如果包含“Mobile”（是手机设备）则返回true
        return isPhone;
    }

    if(isPhone())
    {
        alert('请将手机横过来');
    }
    else
    {
        hideAllPhoneBtn()
    }

    restartButton.addEventListener('click', function() {
        if(gameStateMachine.getCurState() == GAME_STATE_DIE || gameStateMachine.getCurState() == GAME_STATE_WIN)
        {
            gameStateMachine.input(GAME_EVENT_RESTART)
            //location.reload();
        }
        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE)
        {
            resumeGame();
        }
    });
    pauseButton.addEventListener('click',pauseButtonLogic);

    lKeyBtn.addEventListener('touchstart', function(e) {keys['ArrowLeft'] = true; e.preventDefault();},{ passive: false });
    rKeyBtn.addEventListener('touchstart', function(e) {keys['ArrowRight'] = true; e.preventDefault();},{ passive: false });
    fKeyBtn.addEventListener('touchstart', function(e) {keys['ArrowUp'] = true; e.preventDefault();},{ passive: false });
    bKeyBtn.addEventListener('touchstart', function(e) {keys['ArrowDown'] = true; e.preventDefault();},{ passive: false });

    lKeyBtn.addEventListener('touchend', function(e) {keys['ArrowLeft'] = false; });
    rKeyBtn.addEventListener('touchend', function(e) {keys['ArrowRight'] = false; });
    fKeyBtn.addEventListener('touchend', function(e) {keys['ArrowUp'] = false; });
    bKeyBtn.addEventListener('touchend', function(e) {keys['ArrowDown'] = false; });
    sKeyBtn.addEventListener('touchstart', function(e) {isSpacePressed = true; e.preventDefault();},{ passive: false });
    sKeyBtn.addEventListener('touchend', function(e) {isSpacePressed = false; });

    document.addEventListener('touchstart',function(e){showAllPhoneBtn();});

    setInterval(backgroundCreateAndMoveLogic, 3000);
    backgroundCreateAndMoveLogic();

    function hideAllPhoneBtn()
    {
        if(lKeyBtn.style.left == "-1000px")
        {
            return;
        }
        lKeyBtn.style.left = "-1000px";
        lKeyBtn.style.top = "-1000px";

        rKeyBtn.style.left = "-1000px";
        rKeyBtn.style.top = "-1000px";

        fKeyBtn.style.left = "-1000px";
        fKeyBtn.style.top = "-1000px";

        bKeyBtn.style.left = "-1000px";
        bKeyBtn.style.top = "-1000px";

        sKeyBtn.style.right = "-1000px";
        sKeyBtn.style.top = "-1000px";
    }

    function showAllPhoneBtn()
    {
        if(lKeyBtn.style.left == "50px")
        {
            return;
        }
        lKeyBtn.style.left = "50px";
        lKeyBtn.style.top = "50%";

        rKeyBtn.style.left = "150px";
        rKeyBtn.style.top = "50%";

        fKeyBtn.style.left = "100px";
        fKeyBtn.style.top = "45%";

        bKeyBtn.style.left = "100px";
        bKeyBtn.style.top = "50%";

        sKeyBtn.style.right = "50px";
        sKeyBtn.style.top = "50%";
    }

    function reStart()
    {
        //这个封装真的是。。。。当年真的是脑子瓦特了
        player.setPos(playerTop,playerLeft);
        player.health = startPlayerHealth;
        boss.setPos(bossTop,bossLeft);
        boss.health = startBossHealth;
        hideDialogBar();
        boss.element.src = './src/img/boss.gif';
        playerElement.scr = './src/img/character1.gif';
        bgm.load();
        for(let i = bullets.length - 1; i >= 0; i--) 
        {
            let bullet = bullets[i];
            bullet.element.remove();
            bullets.splice(i, 1);
        }
        for(let i = bossBullets.length - 1; i >= 0; i--) 
        {
            let bullet = bossBullets[i];
            bullet.element.remove();
            bossBullets.splice(i, 1);
        }
        bossHealthElement.textContent = boss.health;
        playerHealthElement.textContent = player.health;
    }

    function cancelDialogAni() //这个函数其实对修复游戏播放对话强制退出后，暂停一下依然会继续播放对话这个bug没什么用，但是留着也许未来有用
    {
        if(dialogNniFrameId)
        {
            cancelAnimationFrame(dialogNniFrameId);
            dialogNniFrameId = null;
        }
    }

    //setInterval(updateBullets, 10);
    
    gameLoop();

    //别看了，屎山，小时候不懂事写的
    //MD Boss类和Player类写的和shit一样
    //LZX completed this script on 2025/01/10
    //LZX-TC-VSCode-2025-01-10-001
