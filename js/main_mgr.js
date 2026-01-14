class MainMgr extends JSBehavior
{
    static instance = null;

    static get Instance()
    {
        if(!MainMgr.instance)
        {
            MainMgr.init();
        }
        return MainMgr.instance;
    }

    static init()
    {
        if(!MainMgr.instance)
        {
            MainMgr.instance = new MainMgr(GameObject.createEmpty());
        }
    }

    constructor(gameObj)
    {
        super(gameObj);
        this.bossHealthText = GameObject.createWithEleId('bossHealthValue');
        this.playerHealthText = GameObject.createWithEleId('playerHealthValue');
        this.fpsText = GameObject.createWithEleId('fpsValue');
        this.restartButton = GameObject.createWithEleId('restart-button');
        this.pauseButton = GameObject.createWithEleId('pause-button');
        this.restartButtonText = GameObject.createWithEleId('ButtonText');
        this.pauseButtonText = GameObject.createWithEleId('PauseText');
        this.gameEndText = GameObject.createWithEleId('gameEndMsgText');
        this.unSupportMSGText = GameObject.createWithEleId('UnSupportBroswerMSG');
        this.unSupportMSGText.Element.textContent = "";
        this.lKeyBtn = GameObject.createWithEleId('lKeyBtn');
        this.rKeyBtn = GameObject.createWithEleId('rKeyBtn');
        this.fKeyBtn = GameObject.createWithEleId('fKeyBtn');
        this.bKeyBtn = GameObject.createWithEleId('bKeyBtn');
        this.sKeyBtn = GameObject.createWithEleId('sKeyBtn');
        this.gameDialogBar = GameObject.createWithEleId('gameDialogBar');
        this.gameDialogBar.setBottom("0px");
        this.gameDialogBar.setLeft("0px");
        this.gameDialogBar.setVisible(false);
    }

    setBossHealth(value)
    {
        this.bossHealthText.Element.textContent = value;
    }

    setPlayerHealth(value)
    {
        this.playerHealthText.Element.textContent = value;
    }

    setFPSVal(value)
    {
        this.fpsText.Element.textContent = value;
    }

    setRestartButtonText(value)
    {
        this.restartButtonText.Element.textContent = value;
    }

    setPauseButtonText(value)
    {
        this.pauseButtonText.Element.textContent = value;
    }

    setGameEndText(value)
    {
        this.gameEndText.Element.textContent = value;
    }

    setDiaLogBarVis(vis)
    {
        this.gameDialogBar.setVisible(vis);
    }

    setAllPhoneBtnVis(vis)
    {
        this.lKeyBtn.setVisible(vis);
        this.rKeyBtn.setVisible(vis);
        this.fKeyBtn.setVisible(vis);
        this.bKeyBtn.setVisible(vis);
        this.sKeyBtn.setVisible(vis);
    }
}