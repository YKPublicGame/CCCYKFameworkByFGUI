import { BaseUI, UIMgr } from "../YK/core/UIMgr/UIMgr"
import { EventData } from "../YK/core/EventMgr/DispatchEventNode"
import { TestWind } from "./TestWind"

export class LoadingWind extends BaseUI
{
    protected packName = "Loading"
    protected resName = "Loading"
    public modal: boolean = false
    public dontDel: boolean = true
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false


    protected OnInitWind()
    {
        // this.mlabelProgress = this.UIObj.get("labelProgress")
        // this.mlablMsg = this.UIObj.get("lablMsg")
        // this.mlabelProgress.text = "0%"

    }

    protected OnShowWind()
    {
        // this.eventMgr.addUIEvent(LoadingProgressEvenet.EventID)

        // this.mProgress = 0
        // this.mShowInfoString = "正在加载..."
        // this.mlabelProgress.text = this.mProgress.toFixed() + "%"
    }

    protected OnHideWind()
    {

    }
    protected OnHandler(ev: EventData)
    {
        // switch (ev.cmd)
        // {
        //     case LoadingProgressEvenet.EventID:
        //         this.RefreshInfo(ev as LoadingProgressEvenet)
        //         break;
        // }
    }

    protected OnBtnClick(ev: fgui.GButton)
    {
        super.OnBtnClick(ev)
        console.log("OnBtnClick="+ev.name)
        if(ev.name == "BtnTest")
        {
            UIMgr.Instance.ShowWind(TestWind)
        }
    }
}