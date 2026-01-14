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

function isPhone() {
    //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
    var info = navigator.userAgent;
    //通过正则表达式的test方法判断是否包含“Mobile”字符串
    var isPhone = /mobile/i.test(info);
    //如果包含“Mobile”（是手机设备）则返回true
    return isPhone;
}

//LZX-VSCode-2026-01-14-008