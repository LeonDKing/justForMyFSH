/**
 * Created by fzr on 2015/12/18.
 */
var dd = 123;
var bb = 234;
console.log(parseInt(dd)-parseInt(bb))

var data ={
    "message" : "success",
    "statusCode" : "0000",
    "addDatas" : {
        "resultlist" : [ {
            "id" : 50,
            "topTypeId" : 4,
            "typeId" : 12,
            "goodId" : 156,
            "brandId" : 19,
            "title" : "六福珠宝足金玉髓貔貅硬金黄金手链手串定价GMA1S60002",
            "introduce" : "",
            "price" : 3299,
            "blimits" : true,
            "limitCount" : 0,
            "maxYun" : 100,
            "bstop" : false,
            "picPath" : "http://yiya-goods1.oss-cn-hangzhou.aliyuncs.com/a86679f0-6518-44da-a6fc-c4b9b8148670?Expires=1452207079&OSSAccessKeyId=1VNy1NDoUhZvRZ1g&Signature=9%2BSeg9nNLcN%2Brxauhn1el5SjC%2BQ%3D",
            "yunCount" : 1,
            "curYunCount" : 1,
            "nstatus" : 1,
            "needCount" : 3299,
            "currCount" : 7,
            "startTime" : null,
            "endTime" : null
        }, {
            "id" : 53,
            "topTypeId" : 4,
            "typeId" : 12,
            "goodId" : 151,
            "brandId" : 19,
            "title" : "六福珠宝10克福字投资金条G01G80005F-C",
            "introduce" : "",
            "price" : 2699,
            "blimits" : true,
            "limitCount" : 0,
            "maxYun" : 100,
            "bstop" : false,
            "picPath" : "http://yiya-goods1.oss-cn-hangzhou.aliyuncs.com/af10932f-d9fe-49e6-8b53-b6afb7276545?Expires=1452149812&OSSAccessKeyId=1VNy1NDoUhZvRZ1g&Signature=stqy2CEBN1h33cPXjZzOndgRl5c%3D",
            "yunCount" : 1,
            "curYunCount" : 1,
            "nstatus" : 1,
            "needCount" : 2699,
            "currCount" : 9,
            "startTime" : null,
            "endTime" : null
        },  {
            "id" : 47,
            "topTypeId" : 4,
            "typeId" : 15,
            "goodId" : 167,
            "brandId" : 17,
            "title" : "天梭(TISSOT)手表 时尚系列石英女士手表T084.210.11.117.01",
            "introduce" : "白色珍珠母贝表盘，日历显示，条字 阿拉伯数字刻度，石英机芯，个性独立优雅的女士佩戴！",
            "price" : 2799,
            "blimits" : true,
            "limitCount" : 0,
            "maxYun" : 100,
            "bstop" : false,
            "picPath" : "http://yiya-goods1.oss-cn-hangzhou.aliyuncs.com/4f6bd03e-eb9e-4952-afb3-3014eea228a4?Expires=1452208228&OSSAccessKeyId=1VNy1NDoUhZvRZ1g&Signature=y9R791eV7YefdqdT0xAlMKT/OWY%3D",
            "yunCount" : 1,
            "curYunCount" : 1,
            "nstatus" : 1,
            "needCount" : 2799,
            "currCount" : 0,
            "startTime" : null,
            "endTime" : null
        } ],
        "totalrecord" : 45,
        "count" : 20
    }
}
console.log(data.addDatas.resultlist)