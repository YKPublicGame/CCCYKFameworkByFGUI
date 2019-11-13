import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
const { ccclass, property } = cc._decorator;

export class ModeMgr extends DispatchEventNode
{
    public static EventType = {
        SENDINITMSGOK: "SENDINITMSGOK"
    }
    public mModes: Map<any, IMode> = new Map<any, IMode>()
    private static mInstance: ModeMgr
    private mIsLoginSendingFlag = false

    public static get Instance()
    {
        if (this.mInstance == null)
        {
            let node = new cc.Node("ModeMgr")
            cc.game.addPersistRootNode(node);
            this.mInstance = node.addComponent(ModeMgr)
        }
        return this.mInstance
    }

    public AddMode<T extends IMode>(type: { new(): T }): T
    {
        if (!this.mModes.has(type))
        {
            console.log("not mode is add ="+type)
            this.mModes.set(type, new type())
        }
        console.log("add mode over="+type)
        return this.mModes.get(type) as T
    }

    public GetMode<T extends IMode>(type: { new(): T }): T
    {
        if (this.mModes.has(type))
            return this.mModes.get(type) as T
        else
            return null
    }

    public InitData(param: any = null)
    {
        this.mIsLoginSendingFlag = false
        this.mModes.forEach((value: IMode, key: any, map: Map<any, IMode>) =>
        {
            value.initMsgRespOk = false
            value.OnInitData(param)
        });
    }

    public SendInitMsg()
    {
        this.mIsLoginSendingFlag = true
        this.mModes.forEach((value: IMode, key: any, map: Map<any, IMode>) =>
        {
            value.OnSendInitMsg()
        });
    }

    public ClearData()
    {
        this.mModes.forEach((value: IMode, key: any, map: Map<any, IMode>) =>
        {
            value.OnClear()
        });
    }

    public onDestroy()
    {
        this.mModes.forEach((value: IMode, key: any, map: Map<any, IMode>) =>
        {
            value.OnDestroy()
        });
        this.ClearData();
    }


    public update(dt)
    {
        if (this.mIsLoginSendingFlag)
        {
            let isOk = true

            this.mModes.forEach((value: IMode, key: any, map: Map<any, IMode>) =>
            {
                if (!value.initMsgRespOk)
                {
                    isOk = false
                }
            });

            if (isOk)
            {
                this.DispatchEventByType(ModeMgr.EventType.SENDINITMSGOK)
                this.mIsLoginSendingFlag = false
            }
        }
    }
}

export abstract class IMode
{
    public eventMgr: InterchangeableEventListenerMgr
    constructor()
    {
        this.eventMgr = new InterchangeableEventListenerMgr(this, this.OnHandler)
        this.eventMgr.setNetCallback(this.OnHandler, 99)
        this.eventMgr.setModeCallback(this.OnHandler, 99)
    }

    public abstract OnInitData(param: any): void
    public OnSendInitMsg(): void
    {
        this.initMsgRespOk = true
    }

    /**
    * 处理消息
    * @param ev 参数
    */
    protected OnHandler(ev: EventData)
    {

    }
    public abstract OnClear(): void
    public OnDestroy(): void
    {
        this.eventMgr.RemoveAll()
    }
    public initMsgRespOk = false
}
