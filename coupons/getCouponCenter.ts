import Coupon from "../interface/Coupon";
import Utils from "../utils/utils";
import fj from "../utils/fetch-jsonp";
type couponDetails = {
    ckey: string
    actId: string
    quota: string
    batchId: string
    discount: string
    title: string
    flag: boolean
}

export default class getCouponCenter implements Coupon {
    url: string = "https://s.m.jd.com/activemcenter/mcouponcenter/receivecoupon?coupon={actId},{ckey}&batchid={batchid}&sceneval=2&g_login_type=1";
    detailurl: string = "https://api.m.jd.com/client.action?functionId=getCcFeedInfo&clientVersion=8.4.6&client=android&uuid=869782023101754-c40bcb2a081c&st=1580274952976&sign=5e8edb6a1063a25d2a8d98b537974329&sv=120";
    couponList: couponDetails[] = [];
    couponParams: any;
    container: HTMLDivElement;
    outputTextarea: HTMLTextAreaElement;
    constructor(couponParams: any, containerDiv: HTMLDivElement, outputTextarea: HTMLTextAreaElement) {
        this.couponParams = couponParams;
        this.container = containerDiv;
        this.outputTextarea = outputTextarea;
    }

    get(): void {
        this.couponList = [];
        fetch(this.detailurl, {
            method: "POST",
            body: "body=" + encodeURIComponent(`{"categoryId":118,"childActivityUrl":"openapp.jdmobile://virtual?params={\\"category\\":\\"jump\\",\\"des\\":\\"couponCenter\\"}","eid":"eidA34d08122basezJhsrmQRRxmKprHoj2C/qsyYbh5TyzlV40H/a8UVc9Mwqf5fJ3ez02Ja/n0hNrG4CqlQNZ5J5VyfpzABj6gCzqhlaRbPfZI81+d1","monitorRefer":"appClient","monitorSource":"ccfeed_android_index_feed","pageClickKey":"Coupons_GetCenter","pageNum":1,"pageSize":20,"shshshfpb":"hJFvGjgPo+Yfm06tQPQBhVa8JMvNh0ofLojzHNpvuXWBm0H7FUSxeyfZMVsrL7YOK"}`),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((res) => { return res.json() })
            .then((json) => {
                if (json.success) {
                    const data = json["result"]["couponList"];
                    for (let i = 0; i < data.length; i++) {
                        let coupon = data[i];
                        this.couponList.push({
                            ckey: coupon.ckey,
                            title: coupon.title,
                            quota: coupon.quota,
                            discount: coupon.discount,
                            actId: coupon.actId,
                            batchId: coupon["batchId"],
                            flag: false
                        });
                    }
                    this.list();
                } else {
                    alert("??????????????????????????????????????????");
                }
            });
    }

    list(): void {
        const content = document.createElement("div");
        content.innerHTML = "<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin-top: 5px;padding: 0 37.5vw 5px;'>?????????</h3><p style='margin: 5px 0;color:red'>???????????????????????????????????????<br>?????????????????????APP???-???????????????</p>";
        content.setAttribute('style', 'display:flex;flex-direction:column;padding: 5px;margin-top: 5px;border: 1px solid #000;');
        for (let i = 0; i < this.couponList.length; i++) {
            const item = this.couponList[i],
                itemDiv = document.createElement("div");
            itemDiv.setAttribute('style', ';margin-top:5px;padding:10px 0;border:1px solid #999');
            itemDiv.setAttribute('data-item', "coupon");
            itemDiv.innerHTML = `
                    <p style="margin-bottom:10px">?????????${item.title}<br>?????????${item.quota}<br>?????????${item.discount}<br></p>
                    <button  data-id=${i} style="width: 80px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0; color:#fff">????????????</button>`
            content.appendChild(itemDiv);
            itemDiv.addEventListener("click", (evt) => {
                const target = evt.target as HTMLElement;
                if (target.getAttribute('data-item') || (target.parentNode == itemDiv && target.tagName != "BUTTON")) {
                    if (!item.flag) {
                        itemDiv.style.border = "3px solid red";
                    } else {
                        itemDiv.style.border = "1px solid gray";
                    }
                    item.flag = !item.flag;
                } else if (target.getAttribute("data-id")) {
                    this.singleSend(+target.getAttribute("data-id")!);
                }
            });
        }
        this.container.appendChild(content);
    }

    send(): void {
        for (let i = 0; i < this.couponList.length; i++) {
            let item = this.couponList[i], url = this.url.replace("{actId}", item.actId).replace("{ckey}", item.ckey).replace("{batchid}", item.batchId);
            if (item.flag) {
                fj.fetchJsonp(url).then(function (response) {
                    return response.json()
                }).then((res) => {
                    Utils.outPutLog(this.outputTextarea, `????????????:${JSON.stringify(res)}`);
                })
            }
        }
    }

    singleSend(i: number): void {
        let item = this.couponList[i], url = this.url.replace("{actId}", item.actId).replace("{ckey}", item.ckey).replace("{batchid}", item.batchId);
        fj.fetchJsonp(url).then(function (response) {
            return response.json()
        }).then((res) => {
            Utils.outPutLog(this.outputTextarea, `????????????:${JSON.stringify(res)}`);
        })
    }
}