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
        this.bossHealthText = Text.createWithEleId('bossHealthValue');
        this.playerHealthText = Text.createWithEleId('playerHealthValue');
        this.fpsText = Text.createWithEleId('fpsValue');
        this.restartButton = Button.createWithEleId('restart-button');
        this.pauseButton = Button.createWithEleId('pause-button');
        this.restartButtonText = Text.createWithEleId('ButtonText');
        this.pauseButtonText = Text.createWithEleId('PauseText');
        this.gameEndText = Text.createWithEleId('gameEndMsgText');
        this.unSupportMSGText = Text.createWithEleId('UnSupportBroswerMSG');
        this.unSupportMSGText.setText("");
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
        this.bossHealthText.setText(value);
    }

    setPlayerHealth(value)
    {
        this.playerHealthText.setText(value);
    }

    setFPSVal(value)
    {
        this.fpsText.setText(value);
    }

    setRestartButtonText(value)
    {
        this.restartButtonText.setText(value);
    }

    setPauseButtonText(value)
    {
        this.pauseButtonText.setText(value);
    }

    setGameEndText(value)
    {
        this.gameEndText.setText(value);
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