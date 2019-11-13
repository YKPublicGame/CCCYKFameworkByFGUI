import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
import { ResMgr } from "../ResMgr/ResMgr";
import { NetMgr } from "../Net/NetMgr";
import { SceneMgr } from "../SceneMgr/SceneMgr";
import { ModeMgr } from "../ModeMgr/ModeMgr";
const { ccclass, property } = cc._decorator;

export class UIConfig {
    public static modalLayerColor = new cc.Color(0, 0, 0, 0.4 * 255)  //默认显示背景颜色
    public static globalModalWaiting: any = null    //等待界面
    public static autoCloseWaitingTime: number = 10 //自动关闭等待界面的时间
    
}

@ccclass
export class UIMgr extends DispatchEventNode {
    private mWinds: Map<any, BaseUI> = new Map<any, BaseUI>()
    private modalWaitPane: BaseUI = null
    private static mInstance: UIMgr = null

    public static get Instance(): UIMgr {
        if (this.mInstance == null) {
            this.mInstance = cc.Canvas.instance.addComponent(UIMgr)
        }
        return this.mInstance
    }

    /**
     * 获取所有窗口
     */
    public GetAllWinds(): Array<fgui.Window> {
        let array: Array<fgui.Window> = new Array<fgui.Window>()

        for (var index = 0; index < fgui.GRoot.inst.numChildren; index++) {
            var element: fgui.GObject = fgui.GRoot.inst.getChildAt(index)
            if (element instanceof fgui.Window) {
                array.push(element)
            }
        }
        return array
    }

    /**
     * 寻找窗口
     * @param type 类型
     */
    public FindWind(type: any) {
        let array = this.GetAllWinds()
        return array.find((value: fgui.Window, index: number,
            obj: Array<fgui.Window>) => {
            return value instanceof type
        })
    }

    /**
     * 显示界面
     * @param type 界面类型
     * @param param 界面数据
     */
    public ShowWind(type: any, param = null) {
        console.log("ShowWind 1")
        let wind = this.FindWind(type)
        if (wind == null) {
            wind = new type()
        }
        wind.data = param

        fgui.GRoot.inst.showWindow(wind)
    }

    public HideWind(type: any) {
        // let wind: BaseUI = this.mWinds.get(type)
        // if (wind != null)
        // {
        //     wind.Hide()
        // }
        let wind = this.FindWind(type)
        if (wind != null) {
            fgui.GRoot.inst.hideWindow(wind)
        }
    }

    public GetAllWind(isShow = false, containDotDel = true): Array<any> {
        let keys = new Array<fgui.Window>()

        let array = this.GetAllWinds()

        array.forEach(((value: fgui.Window, key: any, map: Array<fgui.Window>) => {
            if (!isShow || value.isShowing) {
                if (value instanceof BaseUI) {
                    let wind: BaseUI = value as BaseUI
                    if (!value.dontDel || containDotDel) {
                        keys.push(value)
                    }
                }
                else {
                    keys.push(value)
                }
            }
        }));

        return keys
    }

    /**
     * 隐藏所有
     * @param dispose 销毁
     * @param containDotDel 是否包含不能删除的
     */
    public HideAllWind(dispose = false, containDotDel = false) {
        let winds = this.GetAllWind(false, containDotDel)
        winds.forEach(element => {
            if (dispose)
                element.dispose()
            else
                fgui.GRoot.inst.hideWindowImmediately(element)
        });

        fgui.GRoot.inst.hidePopup()
    }

    /**
     * 显示等待
     * @param msg 消息
     */
    public ShowModalWait(msg: string = null) {
        fgui.GRoot.inst.showModalWait(msg)
        console.log("msg =" + msg)
    }

    /**
     * 关闭等待界面
     */
    public CloseModalWait(): void {
        fgui.GRoot.inst.closeModalWait()
    }

}

export abstract class BaseUI extends fgui.Window {
    protected packName = ""
    protected resName = "Main"
    public eventMgr: InterchangeableEventListenerMgr = null;

    protected btnCloseNodeName: string = "BtnClose"
    public modal: boolean = false
    public dontDel: boolean = false
    public UIObj: Map<string, any> = new Map<string, any>()
    public UICtrls: Map<string, fgui.Controller> = new Map<string, fgui.Controller>()
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false


    public constructor() {
        super();
        console.log("wind init")
    }

    protected onInit() {
        super.onInit()
        console.log("OnInit")
        this.eventMgr = new InterchangeableEventListenerMgr(this, this.OnHandler)
        if (this.contentPane == null) {
            let windObj = fgui.UIPackage.createObject(this.packName, this.resName);
            windObj.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
            this.contentPane = windObj.asCom
        }
        this.center()
        this.UIObj.clear();
        this.UICtrls.clear();
        for (var index = 0; index < this.contentPane.numChildren; index++)
        {
            var element = this.contentPane.getChildAt(index);
            if (element.name.startsWith(this.btnNameStartsWith))
            {
                console.log("Base element.name="+element.name)
                if (element.name == this.btnCloseNodeName)
                {
                    element.onClick(this.OnBtnClose, this)
                }
                else
                {
                    let c = element
                    element.onClick(() =>
                    {
                        this.OnBtnClick(c as fairygui.GButton)
                    },this)
                }
            }
            this.UIObj.set(element.name, element)
        }
        this.contentPane.controllers.forEach(element =>
        {
            this.UICtrls.set(element.name, element)
        });

        this.setPivot(0.5, 0.5)
        this.OnInitWind()
    }

    protected onHide()
    {
        this.data = null
        this.eventMgr.RemoveAll()
        this.OnHideWind()
    }

    protected OnHandler(ev: EventData) {

    }

    
    protected doHideAnimation()
    {
        console.log("doHideAnimation");
        if(!this.isNeedHideAnimation)
        {
            super.doHideAnimation()
        }
        else
        {
            //需要关闭效果
            fgui.GTween.to(this.scaleX, 0, 0.3)
            .onUpdate((v: fgui.GTweener) => 
            {
                this.setScale(v.value.x, v.value.x)
            }, this)
            .onComplete(() =>
            {
                super.doHideAnimation()
            }, this)
            
            
        }
    }

    protected doShowAnimation()
    {
        console.log("doShowAnimation");
        if(!this.isNeedShowAnimation)
        {
            super.doShowAnimation()
        }
        else
        {
            this.scaleX = 0
            this.scaleY = 0
            fgui.GTween.to(this.scaleX, 1, 0.3)
                .setEase(fgui.EaseType.BounceOut)
                .onUpdate((v: fgui.GTweener) => 
                {
                    this.setScale(v.value.x, v.value.x)
                }, this)
                .onComplete(() =>
                {
                    super.doShowAnimation()
                }, this)
        }
    }

    protected OnBtnClick(ev: fgui.GButton)
    {

    }

    protected OnBtnClose()
    {
        console.log("点击了关闭按钮===222")
        this.hide()
        //super.hide()
        //UIMgr.Instance.HideWind();
    }

    protected onShown()
    {
        super.onShown()
        this.OnShowWind()
    }


    protected abstract OnInitWind()

    protected abstract OnShowWind()

    protected abstract OnHideWind()
}
