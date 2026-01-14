function updateAllJSBehavior()
{
    for(var i in JSBehaviors)
    {
        try
        {
            if(JSBehaviors[i].Active)
            {
                JSBehaviors[i].update();
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
}

function fixUpdateAllJSBehavior()
{
    for(var i in JSBehaviors)
    {
        try
        {
            if(JSBehaviors[i].Active)
            {
                JSBehaviors[i].fixUpdate();
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
}

function lateUpdateAllJSBehavior()
{
    for(var i in JSBehaviors)
    {
        try
        {
            if(JSBehaviors[i].Active)
            {
                JSBehaviors[i].lateUpdate();
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
}


function update()
{
    bgm.play().then(data=>{}).catch(err=>{});// 用户进行交互后才有bgm，别问，问就是HTML特性
    updateAllJSBehavior();
    lateUpdateAllJSBehavior;
}
//engine running time
function gameLoop() 
{        
    updateDeltaTime();
    gameStateMachine.update();
    sleep(1 / GAME_FRAME_RATE * 1000).then(() => {requestAnimationFrame(gameLoop);});
}

setInterval(fixUpdateAllJSBehavior, 1 / 30 * 1000);
gameLoop();

//别看了，屎山，小时候不懂事写的
//MD Boss类和Player类写的和shit一样
//LZX completed this script on 2025/01/10
//LZX-TC-VSCode-2025-01-10-001
