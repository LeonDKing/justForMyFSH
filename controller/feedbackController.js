/**
 * Created by fzr on 2015/12/15.
 */
var feedbackProxy = require('../proxy').feedbackProxy;
var tools = require('../common/tool');
var async = require('async');


//新增反馈信息
exports.insertFeedback = function(req,res){
    var param = req.body;
    param['feedbackCreateTime']= new Date().getTime();
    async.waterfall([checkParam, insertFb], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测参数
    function checkParam(cb) {
        if(!param.feedbackContent){
            cb("内容不能为空！",null);
            return;
        }
        cb(null,null);
    }
    //插入数据库。
    function insertFb(datas, cb) {
        feedbackProxy.insertFb(param, function(err,data){
            if(err){
                cb("插入失败！",null);
            }else{
                cb(null,"成功！");
            }
        });
    }
}
//查询反馈信息列表
exports.getFeedbackList = function(req,res){
    var options = req.body;
    var toPage = options.toPage;
    var pageSize = options.pageSize;
    var conditions = {
        status:1
}
    //查询数据。
    feedbackProxy.getFeedbackListBySearch(conditions,toPage,pageSize,function(error,dateList){
        feedbackProxy.getFeedbackCounts(conditions,function(err,count){
            var result={};
            var arr = [];
            for (var i = 0; i < dateList.length; i++) {
                arr[i] = {};
                arr[i]["_id"] = dateList[i]._id;
                arr[i]["feedbackCreateTime"] = dateList[i].fbCreateTime;
                arr[i]["feedbackAuthor"] = dateList[i].fbAuthor;
                arr[i]["feedbackContent"] = dateList[i].fbContent;
                arr[i]["userId"] = dateList[i].fbUserId;
            }
            result.data=arr;
            result.counts=count.transferpages(pageSize);
            res.send(JSON.parse(tools.ResponseFormat(error,result)));
        })
    })
}

/*//查询反馈信息内容
exports.getFeedbackContent = function(req,res){
    var options = req.body;
    var conditions = {
        feedbackTitle:options.feedbackTitle,
        feedbackContent:options.feedbackContent,
        feedbackAuthor:options.feedbackAuthor,
        status:1
    }
}*/
