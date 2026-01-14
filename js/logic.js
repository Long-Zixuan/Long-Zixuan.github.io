const playerElement = document.getElementById('player');
    const bossElement = document.getElementById('boss');
    const gameContainer = document.getElementById('gameContainer');

    const bgm = document.getElementById("bgMusic");

    MainMgr.init();

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
            MainMgr.Instance.setPauseButtonText("暂停");
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
            MainMgr.Instance.setPauseButtonText("继续");
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
        MainMgr.Instance.setAllPhoneBtnVis(false);
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

    let bossObj = new GameObject(bossElement);
    let boss = new Boss(bossObj);

    let playerObj = new GameObject(playerElement);
    let player = new Player(playerObj);
    
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

                boss.hurt(1);
                MainMgr.instance.setBossHealth(boss.Health);
            }
            if(boss.Health == startBossHealth / 2 && !hadTellPlayer)
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
            if(boss.isDead) 
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

                player.hurt(1);
                MainMgr.Instance.setPlayerHealth(player.Health);

            }
            if(player.isDead) 
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
            MainMgr.Instance.setRestartButtonText("继续游戏");
        }
        if((gameStateMachine.getCurState() == GAME_STATE_WIN || gameStateMachine.getCurState() == GAME_STATE_DIE) && bottomText == null )
        {
            MainMgr.Instance.setRestartButtonText("重新开始");
        }

        MainMgr.Instance.setDiaLogBarVis(true);

        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE && text == '')
        {
            MainMgr.Instance.setGameEndText("游戏已暂停");
            return;
        }

        if(textMode == false)
        {
            MainMgr.Instance.setGameEndText(text);
            return;
        }

        let index = 0;

        MainMgr.Instance.setGameEndText("");

        let msg = "";

        function typeWriter() {
            if(gameStateMachine.getCurState() == GAME_STATE_RUNNING)
            {
                return;
            }
            if (index < text.length) {
                msg += text.charAt(index);
                MainMgr.Instance.setGameEndText(msg);
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
        MainMgr.Instance.setDiaLogBarVis(false);
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
        showDialogBar("你赢了!你剩余血量："+player.Health);
    }


    function dieLogic()
    {
        bgm.pause();
        showDialogBar("你ga了。Boss剩余血量："+boss.Health);
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
        MainMgr.Instance.setFPSVal((1 / deltaTime).toFixed(2));
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
        MainMgr.Instance.setAllPhoneBtnVis(false);
    }

    MainMgr.Instance.restartButton.addClickListener(function() {
        if(gameStateMachine.getCurState() == GAME_STATE_DIE || gameStateMachine.getCurState() == GAME_STATE_WIN)
        {
            //gameStateMachine.input(GAME_EVENT_RESTART)
            location.reload();
        }
        if(gameStateMachine.getCurState() == GAME_STATE_PAUSE)
        {
            resumeGame();
        }
    });
    MainMgr.Instance.pauseButton.addClickListener(pauseButtonLogic);

    MainMgr.Instance.lKeyBtn.Element.addEventListener('touchstart', function(e) {keys['ArrowLeft'] = true; e.preventDefault();},{ passive: false });
    MainMgr.Instance.rKeyBtn.Element.addEventListener('touchstart', function(e) {keys['ArrowRight'] = true; e.preventDefault();},{ passive: false });
    MainMgr.Instance.fKeyBtn.Element.addEventListener('touchstart', function(e) {keys['ArrowUp'] = true; e.preventDefault();},{ passive: false });
    MainMgr.Instance.bKeyBtn.Element.addEventListener('touchstart', function(e) {keys['ArrowDown'] = true; e.preventDefault();},{ passive: false });

    MainMgr.Instance.lKeyBtn.Element.addEventListener('touchend', function(e) {keys['ArrowLeft'] = false; });
    MainMgr.Instance.rKeyBtn.Element.addEventListener('touchend', function(e) {keys['ArrowRight'] = false; });
    MainMgr.Instance.fKeyBtn.Element.addEventListener('touchend', function(e) {keys['ArrowUp'] = false; });
    MainMgr.Instance.bKeyBtn.Element.addEventListener('touchend', function(e) {keys['ArrowDown'] = false; });
    MainMgr.Instance.sKeyBtn.Element.addEventListener('touchstart', function(e) {isSpacePressed = true; e.preventDefault();},{ passive: false });
    MainMgr.Instance.sKeyBtn.Element.addEventListener('touchend', function(e) {isSpacePressed = false; });

    document.addEventListener('touchstart',function(e){MainMgr.Instance.setAllPhoneBtnVis(true);});

    setInterval(backgroundCreateAndMoveLogic, 3000);
    backgroundCreateAndMoveLogic();

    function reStart()
    {
        //这个封装真的是。。。。当年真的是脑子瓦特了
        player.setTop(playerTop + "%");
        player.setLeft(playerLeft + "%");
        player.setHealth(startPlayerHealth);
        boss.setTop(bossTop + "%");
        boss.setLeft(bossLeft + "%");
        boss.setHealth(startBossHealth);
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
        MainMgr.Instance.setBossHealth(boss.Health);
        MainMgr.Instance.setPlayerHealth(player.Health);
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
