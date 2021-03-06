import Coupon from "./interface/Coupon";
import Activity from "./interface/Activity";
import Game from "./interface/Game";
import Goods from "./goods/goods";

import Utils, { _$ } from "./utils/utils";
import Config from "./config/config";
import CookieManager from "./cookie/CookieManager";
import { CookieHandler } from "./cookie/CookieHandler";

import BabelAwardCollection from "./coupons/newBabelAwardCollection";
import WhiteCoupon from "./coupons/whtieCoupon";
import Purchase from "./coupons/purchase";
import ReceiveDayCoupon from "./coupons/receiveDayCoupon";
import SecKillCoupon from "./coupons/secKillCoupon";
import Mfreecoupon from "./coupons/mfreecoupon";
import CoinPurchase from "./coupons/coinPurchase";
import GcConvert from "./coupons/gcConvert";
import ReceiveCoupons from "./coupons/receiveCoupons";
import ReceiveCoupon from "./coupons/receiveCoupon";
import GetCouponCenter from "./coupons/getCouponCenter";
import Exchange from "./coupons/exchange";

import MonsterNian from "./activitys/MonsterNian";
// import BrandCitySpring from "./activitys/brandCitySpring";
// import Palace from "./activitys/palace";
// import ReceiveBless from "./activitys/receiveBless";
// import FeedBag from "./activitys/feedBag";


import { activityType } from "./enum/activityType";
import { couponType } from "./enum/couponType";
import { goodsType } from "./enum/goodsType";
import { gameType } from "./enum/gameType";

import BTGoose from "./game/btgoose";
// import MoneyTree from "./game/moneyTree";
import Cloudpig from "./game/cloudpig";
import signInCenter from "./game/signInCenter";
import Stall from "./activitys/stall";
import TimeMachine from "./activitys/timeMachine";
import ReceiveSeckillReward from "./coupons/receiveSeckillReward";
import StarMall from "./activitys/starMall";
import Guardianstar from "./activitys/guardianstar";

let coupon: Coupon,
    goods: Goods,
    game: Game,
    activity: Activity,
    gameMap: { [type: string]: Game } = {},
    isJDcontext = true;

const container: HTMLDivElement = document.createElement("div"),
    UATipsDiv: HTMLDivElement = document.createElement("div"),

    title: HTMLDivElement = document.createElement("div"),
    timerTittleDiv: HTMLDivElement = document.createElement("div"),
    receiveTextInput: HTMLInputElement = document.createElement("input"),
    receiveCountInput: HTMLInputElement = document.createElement("input"),
    receiveTimerBtn: HTMLButtonElement = document.createElement("button"),
    operateAreaDiv: HTMLDivElement = document.createElement("div"),
    outputTextArea: HTMLTextAreaElement = document.createElement("textarea"),
    outputTextAreaDiv: HTMLDivElement = document.createElement("div"),
    loginMsgDiv: HTMLDivElement = document.createElement("div");
UATipsDiv.setAttribute('id', "UATipsDiv");
let getLoginMsg = function (res: any) {
    if (res.base.nickname) {
        loginMsgDiv.innerHTML = "???????????????????????????" + res.base.nickname;
    }
}, krapnik = function (res: any) {
};


function buildOperate() {
    operateAreaDiv.setAttribute("style", "border: 1px solid #000;margin: 10px 0;");
    operateAreaDiv.innerHTML = "<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;padding: 0 25vw 5px;'>?????????</h3>";
    if (coupon) {
        buildTimerControl();
    }
    loginMsgDiv.innerHTML = "?????????????????????<a href='https://plogin.m.jd.com/login/login' target='_blank'>????????????</a>";
    operateAreaDiv.append(loginMsgDiv);
    container.append(operateAreaDiv);
    buildOutput();
}

function buildOutput() {
    outputTextAreaDiv.style.display = "none";
    outputTextArea.setAttribute("style", "width: 90vw;height: 40vw;border: 1px solid #868686;border-radius: 10px;overflow-y: scroll;margin:5px auto;");
    outputTextArea.setAttribute("disabled", "disabled");
    let clearOutLogBtn: HTMLButtonElement = document.createElement("button");
    clearOutLogBtn.innerHTML = "????????????";
    clearOutLogBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px;");
    clearOutLogBtn.addEventListener("click", () => {
        outputTextArea.value = "";
    })
    outputTextAreaDiv.append(outputTextArea);
    outputTextAreaDiv.append(clearOutLogBtn);
    operateAreaDiv.append(outputTextAreaDiv);
}

function buildTimerControl() {
    const receiveDiv: HTMLDivElement = document.createElement("div"),
        receiveAreaDiv: HTMLDivElement = document.createElement("div"),
        receiveTipsDiv: HTMLDivElement = document.createElement("div"),
        receiveAllBtn: HTMLButtonElement = document.createElement("button"),
        timerTextInput: HTMLInputElement = document.createElement("input"),
        timerResetBtn: HTMLButtonElement = document.createElement("button"),
        spanTextInput: HTMLInputElement = document.createElement("input"),
        // spanResetBtn: HTMLButtonElement = document.createElement("button"),
        timerDiv: HTMLDivElement = document.createElement("div");
    timerTextInput.type = "text";
    timerTextInput.placeholder = "????????????????????????????????????????????????";
    timerTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
    timerResetBtn.innerHTML = "??????????????????";
    timerResetBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;");
    timerResetBtn.addEventListener("click", () => {
        const span = Math.trunc(+timerTextInput.value);
        if (!span) {
            alert("?????????????????????????????????????????????(???????????????0?????????)");
            return false;
        }
        Config.intervalSpan = span;
        window.clearInterval(Config.intervalId);
        Config.intervalId = window.setInterval(getTime, Config.intervalSpan);
    });
    receiveTipsDiv.innerHTML = `<h3>???????????????????????????+24?????????</h3><p style="color:red">????????????????????????<br>????????????:500 | ???????????????2020-01-01 23:59:59:490<br>tips:?????????????????????????????????</p>`;
    receiveTextInput.type = "text";
    receiveTextInput.placeholder = "???????????????????????????:2020-01-01 09:59:59:950???";
    receiveTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px;");
    receiveCountInput.type = "text";
    receiveCountInput.placeholder = "??????????????????????????????1??????";
    receiveCountInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px;");
    spanTextInput.type = "text";
    spanTextInput.placeholder = "????????????????????????????????????????????????500?????????";
    spanTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
    receiveTimerBtn.innerHTML = "??????????????????";
    receiveTimerBtn.addEventListener("click", () => {
        Config.postSpan = parseInt(spanTextInput.value) > 0 ? parseInt(spanTextInput.value) : 500;
        Config.postCount = parseInt(receiveCountInput.value) > 0 ? parseInt(receiveCountInput.value) : 1;
        const time = Utils.formateTime(receiveTextInput.value);
        if (!time || time < 0) {
            alert("???????????????????????????????????????????????????");
            return false;
        } else {
            Config.timingFlag = !Config.timingFlag;
            Config.startTime = time;
            receiveTextInput.disabled = Config.timingFlag;
            receiveCountInput.disabled = Config.timingFlag;
            if (Config.timingFlag) {
                receiveTimerBtn.innerHTML = "??????????????????";
                Utils.outPutLog(outputTextArea, `?????????????????????????????????????????????${receiveTextInput.value}`);
            } else {
                receiveTimerBtn.innerHTML = "??????????????????";
                Utils.outPutLog(outputTextArea, `?????????????????????`);
            }
        }

    });
    receiveAllBtn.addEventListener("click", () => {
        if (coupon) {
            coupon.send(outputTextArea);
        }
    });
    receiveTimerBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px;");
    receiveAllBtn.innerHTML = "??????????????????";
    receiveAllBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px;");
    operateAreaDiv.append(timerDiv);
    timerDiv.append(timerTittleDiv);
    timerDiv.append(timerTextInput);
    timerDiv.append(timerResetBtn);
    timerDiv.append(spanTextInput);
    // timerDiv.append(spanResetBtn);
    operateAreaDiv.append(receiveDiv);
    receiveDiv.append(receiveTipsDiv);
    receiveDiv.append(receiveTextInput);
    receiveDiv.append(receiveCountInput);
    receiveDiv.append(spanTextInput);
    receiveDiv.append(receiveAreaDiv);
    receiveAreaDiv.append(receiveAllBtn);
    receiveAreaDiv.append(receiveTimerBtn);
}

function buildTips() {
    const tips = document.createElement('h4');
    tips.innerHTML = '<h4>??????????????????????????????????????????</h4><p>????????????????????????????????????????????????????????????</p><p>?????????????????????????????????????????????<a href="tencent://message/?uin=708873725Menu=yes" target="_blank" title="??????QQ??????">????????????</a>??????~</p><a style="color:red" onclick=Utils.copyText(Config.NetdiskURL)>????????????????????????</a>'
    title.append(tips);
}

function buildTitle() {
    const html: HTMLElement = _$('html') as HTMLElement;
    html.style.fontSize = "18px";
    document.body.innerHTML = "";
    document.body.style.overflow = "scroll";
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.textAlign = "center";
    document.body.style.maxWidth = "100vw";
    container.setAttribute("style", "border: 1px solid #000;margin: 10px 0;padding: 5px;margin: 5px;");
    title.innerHTML = `<h1 style="font-weight:700">${Config.title} ${Config.version}</h1>
                        <h3>author:${Config.author}</h3>
                        <div style="display: flex;flex-direction: row;justify-content: center;">
                        <iframe src="https://ghbtns.com/github-btn.html?user=krapnikkk&repo=JDCouponAssistant&type=star&count=true" frameborder="0" scrolling="0" width="90px" height="21px"></iframe>
                        <a href="tencent://message/?uin=708873725Menu=yes" target="_blank" title="??????QQ??????"><img src="http://bizapp.qq.com/webimg/01_online.gif" alt="QQ" style="margin:0px;"></a>
                        </div>
                        <button style="font-size:18px;font-weight:bold;color:#000;position:relative;width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">
                            ???????????????????????????
                            <a style="font-size:0px;width:200px;height:30px;display:inline-block;position:absolute;left:0;top:0;" href="javascript:!function(){function c(){var d=document.getElementById("loadJs"),e=document.createElement("script");d&&document.getElementsByTagName("head")[0].removeChild(d),e.id="loadJs",e.type="text/javascript",e.onerror=function(){return b==a.length-1?(alert("%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%E6%BA%90%E4%BB%A3%E7%A0%81%E5%8A%A0%E8%BD%BD%E5%BC%82%E5%B8%B8%EF%BC%81%E8%AF%B7%E6%A3%80%E6%9F%A5%E7%BD%91%E7%BB%9C%E6%83%85%E5%86%B5%EF%BC%81"),void 0):(b++,c(),void 0)},e.src=a[b],document.getElementsByTagName("head")[0].appendChild(e)}var a=["https://krapnik.coding.net/p/JD/d/JDCouponAssistant/git/raw/master/bundle.js","https://gitee.com/krapnik/codes/o9nwsxjuy6crftdi824aq79/raw?blob_name=JDCouponAssistant.js","https://raw.githubusercontent.com/krapnikkk/JDCouponAssistant/master/dist/bundle.js"],b=0;c()}();">
                                ??????????????????
                            </a>
                        </button>`;
    container.append(title);
    document.body.append(container);
}

function buildActivity() {
    const activityArea: HTMLDivElement = document.createElement("div");
    activityArea.setAttribute("style", "padding: 5px;border: 1px solid #000");
    activityArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>????????????</h3>
    <p style="padding: 5px;color:red;font-weight:bold;">
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html#/land" target="_blank">???????????????????????????</a>
    <br>
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/3DDunaJMLDamrmGwu73QbqtGtbX1/index.html" target="_blank">???????????????</a>
    <br>
    <a style="color:red" href="https://urvsaggpt.m.jd.com/static/index.html#/?starId=meiditongliya" target="_blank">???????????????</a>
    <br>
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/4DEZi5iUgrNLD9EWknrGZhCjNv7V/index.html#/" target="_blank">?????????????????????</a>
    <br>
    <a style="color:red" onclick=Utils.copyText("https://u.jd.com/tbFM0kn")>??????????????????????????????</a>
    </p>`;
    // https://u.jd.com/toUGpaC
    container.append(activityArea);
}

function buildRecommend() {
    const recommandArea: HTMLDivElement = document.createElement("div");
    recommandArea.setAttribute("style", "border: 1px solid #000;margin: 10px 0;");
    recommandArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>????????????</h3>
    <p style="color:red;font-weight:bold;">
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html#/land" target="_blank">???????????????????????????</a>
    <br>
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/3DDunaJMLDamrmGwu73QbqtGtbX1/index.html" target="_blank">???????????????</a>
    <br>
    <a style="color:red" href="https://urvsaggpt.m.jd.com/static/index.html#/?starId=meiditongliya" target="_blank">???????????????</a>
    <br>
    <a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/4DEZi5iUgrNLD9EWknrGZhCjNv7V/index.html#/" target="_blank">?????????????????????</a>
    </p>`;
    container.append(recommandArea);
}

function buildPromotion() {
    const promotionArea: HTMLDivElement = document.createElement("div");
    promotionArea.setAttribute("style", "border: 1px solid #000;margin: 10px 0;");
    promotionArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>?????????</h3>
    <p style="color:red;font-weight:bold;"><a style="color:red" href="http://krapnik.cn/project/jd/dayTask.html" target="_blank">????????????????????????</a></p>`;
    container.append(promotionArea);
}


function buildUAarea() {
    UATipsDiv.innerHTML = `<div style="border: 1px solid #000;margin: 10px 0;font-weight:bold"><h2>?????????????????????user-Agent?????????APP</h2><p><a style="color:red" onclick=Utils.copyText(Config.NetdiskURL)>????????????????????????</a></p><p>??????????????????????????????UA?????????????????????????????????</p><p>????????????????????????</p><button style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block" onclick=Utils.copyText(Config.JDAppUA)>??????????????????User-Agent</button></div>`;
    container.append(UATipsDiv);
}

function hideUAArea() {
    if (container && UATipsDiv) {
        container.removeChild(UATipsDiv);
    }
}

function buildSensorArea() {
    let sensorArea: HTMLDivElement = document.createElement("div");
    sensorArea.innerHTML = `<div style="border: 1px solid #000;margin: 10px 0;font-weight:bold"><h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;padding: 0 25vw 5px;'>???????????????</h3>
    <p style="color:red;font-weight:bold;">???????????????????????????????????????</p>
    <div><button style="width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;" onclick="Utils.copyText(Config.NetdiskURL)">????????????</button>
    <button class="toggle" style="width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;">????????????</button></div>
    <div class="sensorAreaTabDiv" style="display:none"><ul class="list" style="display:flex;justify-content: space-around;list-style:none;margin-bottom: 10px;"><li class="account">????????????</li><li class="activity">????????????</li></ul>
    <hr style="margin: 10px;">
    <div class="extensionDiv"></div></div>`;
    container.append(sensorArea);
    let account: HTMLDivElement = document.createElement("div");
    account.innerHTML = `<p>??????ck???????????????----ck</p><p style="color:red;">?????????????????????????????????</p>
    <button style="width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block" onclick="Utils.copyText(document.cookie)">??????Cookie</button>
    <button id="import" style="width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">???????????????</button></div>`;

    let activity: HTMLDivElement = document.createElement("div");
    activity.innerHTML = `<ul class="activity-list" style="display:flex;justify-content: space-around;list-style:none;margin-bottom: 10px;">
    <li class="pig">?????????</li>
    <li class="goose">??????</li>
    <li class="moneyTree">?????????</li>
    <li class="signInCenter">????????????</li>
    </ul>
    <hr style="margin: 10px;"><div class="activityExtensionDiv"></div>`;
    let extensionDiv = _$(".extensionDiv") as HTMLDivElement, sensorAreaTabDiv = _$(".sensorAreaTabDiv") as HTMLDivElement;
    extensionDiv.append(account);
    extensionDiv.append(activity);
    activity.style.display = "none";
    _$(".list").addEventListener("click", (e: MouseEvent) => {
        let target = <HTMLElement>e.target!;
        if (target.getAttribute("class") == "account") {
            account.style.display = "block";
            activity.style.display = "none";
        } else {
            account.style.display = "none";
            activity.style.display = "block";
        }
    });

    _$(".toggle").addEventListener("click", (e: MouseEvent) => {
        let target = <HTMLElement>e.target!;
        if (sensorAreaTabDiv.style.display == "block") {
            sensorAreaTabDiv.style.display = "none";
            target.innerHTML = "????????????";
        } else {
            sensorAreaTabDiv.style.display = "block";
            target.innerHTML = "????????????";
        }
    })

    _$("#import").addEventListener('click', () => {
        Utils.importFile("text/plain").then(async (ck) => {
            Config.multiFlag = false;
            Config.importFlag = false;
            CookieManager.parseCK(<string>ck);
            if (Config.importFlag) {
                CookieManager.outPutLog(outputTextArea);
                Promise.all(
                    CookieManager.cookieArr.map((item) => {
                        return CookieManager.checkLogin(outputTextArea, item);
                    })
                ).then((data) => {
                    if (data.every((res) => {
                        return res;
                    })) {
                        Utils.outPutLog(outputTextArea, "??????ck??????????????????????????????????????????!");
                        Config.multiFlag = true;
                    } else {
                        CookieHandler.clearAllCookie();
                        Utils.outPutLog(outputTextArea, "??????ck????????????,???????????????????????????!?????????ck?????????!");
                    }

                })
            }

        });
    })

    let activityExtensionDiv = _$(".activityExtensionDiv") as HTMLDivElement
    _$(".activity-list").addEventListener("click", (e: MouseEvent) => {
        let target = <HTMLElement>e.target!;
        let nodes = activityExtensionDiv.childNodes;
        nodes.forEach((node) => {
            (<HTMLDivElement>node).style.display = "none";
        })
        if (target.getAttribute("class") == "pig") {
            if (!gameMap.Cloudpig) {
                gameMap.Cloudpig = new Cloudpig(null, activityExtensionDiv, outputTextArea);
                gameMap.Cloudpig.get();
            } else {
                gameMap.Cloudpig.content.style.display = "block";
            }

        } else if (target.getAttribute("class") == "goose") {
            if (!gameMap.BTGoose) {
                gameMap.BTGoose = new BTGoose(null, activityExtensionDiv, outputTextArea);
                gameMap.BTGoose.get();
            } else {
                gameMap.BTGoose.content.style.display = "block";
            }
        } else if (target.getAttribute("class") == "moneyTree") {
            alert("??????????????????????????????????????????~");
            // if (!gameMap.MoneyTree) {
            //     gameMap.MoneyTree = new MoneyTree(null, activityExtensionDiv, outputTextArea);
            //     gameMap.MoneyTree.get();
            // } else {
            //     gameMap.MoneyTree.content.style.display = "block";
            // }
        } else if (target.getAttribute("class") == "signInCenter") {
            if (!gameMap.signInCenter) {
                gameMap.signInCenter = new signInCenter(null, activityExtensionDiv, outputTextArea);
                gameMap.signInCenter.get();
            } else {
                gameMap.signInCenter.content.style.display = "block";
            }
        }
        else {
            alert("??????????????????????????????????????????~");
        }
    });

}

function buildTimeoutArea() {
    let timeoutDiv: HTMLDivElement = document.createElement("div"),
        timeoutInput: HTMLInputElement = document.createElement("input");
    timeoutInput.setAttribute("style", "width:80vw;height: 25px;font-size:14px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
    timeoutInput.placeholder = `?????????????????????????????????????????????:${Config.timeoutSpan}?????????`;
    timeoutDiv.innerHTML = `<p style="font-size:14px;">???????????????????????????????????????????????????????????????????????????300~500??????</p>`;
    timeoutDiv.append(timeoutInput);
    timeoutInput.onchange = () => {
        if (Utils.isNumber(+timeoutInput!.value)) {
            Config.timeoutSpan = +timeoutInput!.value || 1500;
        }
    }
    operateAreaDiv.append(timeoutDiv);
}


function getEntryType(): couponType | activityType | goodsType | gameType {
    let type: couponType | activityType | goodsType | gameType = couponType.none;
    if (!window.location.host.includes("jd.com")) {
        isJDcontext = false;
        return type;
    }

    if (Config.locationHref.includes("item.jd.com/") || Config.locationHref.includes("item.m.jd.com/product/")) {
        type = goodsType.goods;
    }

    if ((window as any).__react_data__) {
        type = couponType.newBabelAwardCollection;
    } else if ((window as any).Queries) {
        type = couponType.whiteCoupon;
    } else if (Config.locationHref.includes('gcmall/index.html#/details?pid=')) {
        type = couponType.purchase;
    } else if (Config.locationHref.includes('member/gcmall/index.html#/details?gid')) {
        type = couponType.coinPurchase;
    } else if (Config.locationHref.includes("plus.m.jd.com/coupon/")) {
        type = couponType.receiveDayCoupon
    } else if (Config.locationHref.includes("9GcConvert")) {
        type = couponType.GcConvert
    } else if ((/babelDiy\/(\S*)\/index/).test(Config.locationHref)) {
        type = couponType.secKillCoupon
    } else if (/coupons\/show.action\?key=(\S*)&roleId=(\S*)/.test(Config.locationHref)) {
        type = couponType.mfreecoupon
    } else if (Config.locationHref.includes("m.jr.jd.com/member/rightsCenter/#/white")) {
        type = couponType.ReceiveCoupons
    } else if (Config.locationHref.includes("m.jr.jd.com/consumer/baitiaom/index.html")) {
        type = couponType.ReceiveCoupon
    } else if (Config.locationHref.includes("coupon.m.jd.com/center/getCouponCenter.action")) {
        type = couponType.getCouponCenter
    } else if (Config.locationHref.includes("vip.m.jd.com/index.html?appName=fuli&id=")) {
        type = couponType.exchange
    }

    if (Config.locationHref.includes("9dkC9G9avZsJoKSvqw7EbmY8pCM")) {//??????????????????
        type = couponType.receiveSeckillReward
    } else if (Config.locationHref.includes("4PN6NLSX1vyp8xibC5sk7WZEFF5U")) {
        type = couponType.secKillCoupon
    }

    //??????APP?????????????????????
    if (Config.locationHref.includes("bunearth.m.jd.com")) {
        if (Config.locationHref.includes("2cKMj86srRdhgWcKonfExzK4ZMBy")) {
            type = activityType.monsterNian;
        } else if (Config.locationHref.includes("w6y8PYbzhgHJc8Lu1weihPReR2T")) {
            type = activityType.brandCitySpring;
        } else if (Config.locationHref.includes("21tFbS6Xm4tpon3oJnwzbnCJBo1Z")) {
            type = activityType.receiveBless;
        } else if (Config.locationHref.includes("4SJUHwGdUQYgg94PFzjZZbGZRjDd")) {
            type = activityType.stall;
        } else if (Config.locationHref.includes("3DDunaJMLDamrmGwu73QbqtGtbX1")) {
            type = activityType.timeMachine;
        } else if (Config.locationHref.includes("4DEZi5iUgrNLD9EWknrGZhCjNv7V")) {
            type = activityType.starMall;
        }
    }
    if (Config.locationHref.includes("3gSzKSnvrrhYushciUpzHcDnkYE3")) {
        type = activityType.guardianstar;
    }
    if(Config.locationHref.includes("urvsaggpt.m.jd.com")){
        type = activityType.guardianstar;
    }

    //????????????APP?????????????????????

    // if (Config.locationHref.includes("u.jr.jd.com")) {
    //     //https://u.jr.jd.com/uc-fe-wxgrowing/feedbag/cover/channelLv=syfc/
    //     if (Config.locationHref.includes("feedbag")) {
    //         type = activityType.feedBag;
    //     }
    // }

    //???????????????????????????
    // if (Config.locationHref.includes("uc-fe-wxgrowing")) {
    //     if (Config.locationHref.includes("moneytree")) {
    //         // type = gameType.moneytree;
    //     } else if (Config.locationHref.includes("cloudpig")) {
    //         type = gameType.cloudpig;
    //     }
    // }

    return type;
}

function getEntryDesc(type: couponType | activityType | goodsType | gameType) {
    buildTitle();
    // buildPromotion();

    switch (type) {
        case goodsType.goods:
            const goodsId = Config.locationHref.match(/jd.com\/(\S*).html/)![1];
            goods = new Goods(container, outputTextArea, goodsId);
            break;
        case couponType.newBabelAwardCollection:
            const activityId = Config.locationHref.match(/active\/(\S*)\/index/)![1];
            coupon = new BabelAwardCollection({ "activityId": activityId }, container, outputTextArea);
            break;
        case couponType.whiteCoupon:
            const couponBusinessId = Utils.GetQueryString("couponBusinessId");
            coupon = new WhiteCoupon({ "couponBusinessId": couponBusinessId }, container, outputTextArea);
            break;
        case couponType.purchase:
            const pid = Utils.GetQueryString("pid");
            coupon = new Purchase({ "pid": pid }, container, outputTextArea);
            break;
        case couponType.coinPurchase:
            const gid = Utils.GetQueryString("gid");
            coupon = new CoinPurchase({ "pid": gid }, container, outputTextArea);
            break;
        case couponType.receiveDayCoupon:
            coupon = new ReceiveDayCoupon(null, container, outputTextArea);
            break;
        case couponType.secKillCoupon:
            coupon = new SecKillCoupon(null, container, outputTextArea);
            break;
        case couponType.GcConvert:
            coupon = new GcConvert(null, container, outputTextArea);
            break;
        case couponType.mfreecoupon:
            const roleId = Utils.GetQueryString("roleId"),
                key = Utils.GetQueryString("key");
            coupon = new Mfreecoupon({ "roleId": roleId, "key": key }, container, outputTextArea);
            break;
        case couponType.ReceiveCoupons:
            coupon = new ReceiveCoupons(null, container, outputTextArea);
            break;
        case couponType.ReceiveCoupon:
            coupon = new ReceiveCoupon(null, container, outputTextArea);
            break;
        case couponType.getCouponCenter:
            coupon = new GetCouponCenter(null, container, outputTextArea);
            break;
        case couponType.exchange:
            const itemId = Utils.GetQueryString("id");
            coupon = new Exchange({ "itemId": itemId }, container, outputTextArea);
            break;
        case couponType.receiveSeckillReward:
            coupon = new ReceiveSeckillReward(null, container, outputTextArea);
            break

        case activityType.monsterNian:
            activity = new MonsterNian(null, container, outputTextArea);
            Config.UAFlag = true;
            break;
        // case activityType.brandCitySpring:
        //     activity = new BrandCitySpring(null, container, outputTextArea);
        //     break;
        // case activityType.palace:
        //     activity = new Palace(null, container, outputTextArea);
        //     break;
        // case activityType.receiveBless:
        //     activity = new ReceiveBless(null, container, outputTextArea);
        //     Config.UAFlag = true;
        //     break;
        case activityType.stall:
            activity = new Stall(container, outputTextArea);
            Config.UAFlag = true;
            break;
        case activityType.timeMachine:
            activity = new TimeMachine(container, outputTextArea);
            break;
        case activityType.starMall:
            Config.UAFlag = true;
            activity = new StarMall(container, outputTextArea);
            break;
        case activityType.guardianstar:
            Config.UAFlag = true;
            activity = new Guardianstar(container, outputTextArea);
            break;
        default:
            break;
    }
    if (Config.UAFlag) {
        buildUAarea();
    }
    // buildRecommend();//????????????
    // buildActivity(); // ????????????
    if (isJDcontext) {
        // buildSensorArea();
        buildOperate();
        // buildExtensionTab();
        Utils.createJsonp(`${Config.JDUserInfoURL}&callback=getLoginMsg`);
    }

    
    if (coupon) {
        Config.intervalId = window.setInterval(getTime, Config.intervalSpan);
        coupon.get();
    } else if (activity) {
        // buildActivity();
        buildTimeoutArea();
        activity.get();
    } else if (goods) {
        goods.get();
    } else if (game) {
        game.get();
    } else {
        Utils.loadCss("https://meyerweb.com/eric/tools/css/reset/reset200802.css");
        buildTips();
    }


}

function getTime() {
    fetch(Config.JDTimeInfoURL)
        .then(function (response) { return response.json() })
        .then(function (res) {
            Config.serverTime = Utils.formatDate(res.time);
            Config.localeTime = new Date(+res.time).toLocaleString() + ":" + Config.serverTime.substr(-3, 3);
            timerTittleDiv.innerHTML = `???????????????${Config.localeTime}<br/>????????????????????????????????????${Config.intervalSpan}??????`;
            if (Config.timingFlag) {
                if (Config.startTime <= +Config.serverTime) {
                    Utils.outPutLog(outputTextArea, `?????????????????????`);
                    Utils.outPutLog(outputTextArea, `??????????????????????????????${Config.localeTime}`);
                    Config.timingFlag = !Config.timingFlag;
                    if (coupon) {
                        for (let i = 0; i < Config.postCount; i++) {
                            (function (index) {
                                setTimeout(() => {
                                    Utils.outPutLog(outputTextArea, `???${index + 1}????????????`);
                                    coupon.send(outputTextArea);
                                }, index * Config.postSpan)
                            })(i)
                        }
                    }
                    receiveTextInput.disabled = Config.timingFlag;
                    receiveCountInput.disabled = Config.timingFlag;
                    receiveTimerBtn.innerHTML = "??????????????????";
                    Utils.outPutLog(outputTextArea, `????????????????????????`);
                }
            }
        });
}

function copyRights() {
    console.clear();
    if (window.console) {
        console.group('%c??????????????????', 'color:#009a61; font-size: 36px; font-weight: 400');
        console.log('%c?????????????????????????????????\n??????:krapnik \n????????????F12???????????????GitHub????????????star\ngithub:https://github.com/krapnikkk/JDCouponAssistant', 'color:#009a61');
        console.groupEnd();
    }
}

var _hmt: any = _hmt || [];

function statistical() {
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d86d4ff3f6d089df2b41eb0735194c0d";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode!.insertBefore(hm, s);
    })();
}

copyRights();
getEntryDesc(getEntryType());
statistical();

Object.assign(window, { "getLoginMsg": getLoginMsg, "krapnik": krapnik, "Utils": Utils, "Config": Config });








