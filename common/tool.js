//响应格式
exports.ResponseFormat = function (err, data) {
    var responseData = {};
    if (err) {
        responseData = {
            status: 500,
            exception: err
        }
    } else {
        if (typeof data == "object" && data.length) {
            responseData = {
                status: 200,
                recordset: data
            }
        } else {
            responseData = {
                status: 200,
                record: data
            }
        }
    }
    return JSON.stringify(JSON.stringify(responseData));
}
//时间初始化
Date.prototype.Format = function (fmt) { //author: meizz
    if (!fmt) {
        fmt = "yyyy-MM-dd hh:mm:ss"
    }
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//设置下载报文头
String.prototype.setHeadOfDownload = function (userAgent) {
    var filename = this;
    var str = "";
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        str = 'attachment; filename=' + encodeURIComponent(filename)
    } else if (userAgent.indexOf('firefox') >= 0) {
        str = 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename) + '"'
    } else {
        str = 'attachment; filename=' + new Buffer(filename).toString('binary')
        /* safari等其他非主流浏览器只能自求多福了 */
    }
    return str;
}

//转化成页数
Number.prototype.transferpages = function (pagesize) {
    var page = 0;
    var pages = parseInt(this);
    if (!pagesize) {
        pagesize = 1;
    }
    if (pages == 0) {
        return 1;
    }
    if (pages <= pagesize) {
        page = 1;
    } else if (pages % pagesize == 0) {
        page = pages / pagesize;
    } else {
        page = parseInt(pages / pagesize) + 1
    }
    return page;
}


