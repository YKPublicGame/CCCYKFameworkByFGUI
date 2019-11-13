import LoadingScene from "./scene/LoadingScene";
import { SceneMgr } from "../YK/core/SceneMgr/SceneMgr";
import { UIMgr } from "../YK/core/UIMgr/UIMgr";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    
    // onLoad () {}


    start () {
        console.log("开始草拟粑粑啊")
        
        fgui.addLoadHandler();
        fgui.GRoot.create();
        //fgui.UIPackage.loadPackage("UI/Loading", this.onUILoaded.bind(this));
        SceneMgr.Instance.GoToScene(LoadingScene)
    }
    // onUILoaded() {
    //     console.log("草拟粑粑")
    //     fgui.UIPackage.addPackage("UI/Loading");
    // }

    // update (dt) {}
}
