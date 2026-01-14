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

let bossObj = new GameObject(bossElement);
let boss = new Boss(bossObj);

let playerObj = new GameObject(playerElement);
let player = new Player(playerObj);



playerBulColEvent = [(bullet)=>{
                        return isColliding(bullet.GameObj.Rect, boss.GameObj.Rect);
                    },(bullet)=>{
                        boss.hurt(1);
                        MainMgr.Instance.setBossHealth(boss.Health);
                        bullet.GameObj.destroy();
                    }
                ];
player.setBulletColEvent(playerBulColEvent);

bossBulColEvent = [(bullet)=>{
                        return isColliding(bullet.GameObj.Rect, player.GameObj.Rect);
                    },(bullet)=>{
                        player.hurt(1);
                        MainMgr.Instance.setPlayerHealth(player.Health);
                        bullet.GameObj.destroy();
                    }
                ];
boss.setBulletColEvent(bossBulColEvent);


    
let hadTellPlayer = false;


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

//LZX-VSCode-2026-01-14-007