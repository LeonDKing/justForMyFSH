/**
 * Created by fzr on 2015/12/15.
 */
var messageProxy = require('../proxy').messageProxy;
var tools = require('../common/tool');
var async = require('async');

//查询积分
exports.getMessageList = function(req,res){
//    var param = req.body;
    var param = req.query;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var userId = param.userId;
    var conditions = {
        msgUserId:userId,
        status:1
    };
    //过滤条件
    for(var key in conditions){
        if(conditions[key]==""){
            delete conditions[key];
        }
    }
    messageProxy.getMessageListBySearch(conditions,toPage,pageSize,function(error,datalist){
        messageProxy.getMessageCounts(conditions,function(err,count){
            var arr = new Array();
            for(var i =0;i<datalist.length;i++){
                arr[i]={};
                arr[i]['id'] = datalist[i]._id;
                arr[i]['messageContent'] = datalist[i].msgContent;
                arr[i]['messageCreateTime'] = datalist[i].msgCreateTime;
                arr[i]['messageUpdateTime'] = datalist[i].msgUpdateTime;
            }
            var result = {};
            result.data = arr;
            result.counts=count.transferpages(pageSize);
            res.send(JSON.parse(tools.ResponseFormat(error,result)));
        })
    })
}


