import { BaseUI } from "../YK/core/UIMgr/UIMgr"
import { EventData } from "../YK/core/EventMgr/DispatchEventNode"

export class TestWind extends BaseUI
{
    protected packName = "Loading"
    protected resName = "TestWind"
    public modal: boolean = true
    public dontDel: boolean = true
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = true
    protected isNeedHideAnimation: boolean = true


    protected OnInitWind()
    {

    }

    protected OnShowWind()
    {

    }

    protected OnHideWind()
    {

    }
    protected OnHandler(ev: EventData)
    {

    }

    protected OnBtnClick(ev: fgui.GButton)
    {
        super.OnBtnClick(ev)
        this.hide()
        
        console.log("hiede OnBtnClick="+ev.name)
    }
}