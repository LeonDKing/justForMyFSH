/**
 * Created by fzr on 2015/12/15.
 */
var labelProxy = require('../proxy').labelProxy;
var tools = require('../common/tool');
var async = require('async');
//var problemProxy = require('../proxy').problemProxy;

//标签列表查询
exports.getLabelList = function(req,res){
    var param = req.query;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var conditions = {
        status:1
    }
    labelProxy.getLabelList(conditions,toPage,pageSize,function(err,data){
        var arr = new Array();
        for(var i =0;i<data.length;i++){
            arr[i] = {};
            arr[i]['labelId'] = data[i]._id;
            arr[i]['labelCreateTime'] = data[i].lbCreateTime;
            arr[i]['labelTitle'] = data[i].lbLabelTitle;
        }
        res.send(JSON.parse(tools.ResponseFormat(err,arr)));
    })
}
//标签的增加
exports.insertLabel = function(req,res){
    var param = req.body;
    var labelTitle = param.labelTitle;
    param.createTime = new Date().getTime();
    async.waterfall([getLabelTitle,insertLabel],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测参数
    function getLabelTitle(cb){
        labelProxy.getLabelTitle(labelTitle,function(err,data){
            if(!data || data.length<=0){
                cb(null,null);
            }else{
                cb('该标签已存在！',null);
                return;
            }
        });
    }
    //增加标签
    function insertLabel(datas,cb){
        labelProxy.insertLabel(param,function(err,data){
            var labelData = {};
            labelData['labelId'] = data._id;
            labelData['labelTitle'] = data.lbLabelTitle;
            labelData['createTime'] = data.lbCreateTime;
            res.send(JSON.parse(tools.ResponseFormat(err, labelData)));
        })
    }
};
//标签的修改
exports.updateLabel = function(req,res){
    var param =req.body;
    param.updateTime = new Date().getTime();
    labelProxy.updateLabel(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err,data)));
    })
}
//标签的删除
exports.deleteLabel = function(req,res){
    var param = req.query;
    var labelId = param.labelId;
    param.updateTime = new Date().getTime();
    labelProxy.deleteLabel(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err,data)));
    })
}
//回答表的更新
exports.updateAnswer = function(req,res){
    var param = req.body;
    var answerId = param.answerId;
    var userCode = param.answerId;
    param.updateCreate = new Date().getTime();
    answerProxy.updateAnswerContentById(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err, data)));
    })
};
//回答表的删除
exports.deleteAnswer = function(req,res){
    var param = req.body;
    param.updateTime = new Date().getTime();
    answerProxy.deleteAnswerById(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err, data)));
    });
};
//改变回答的查看状态
exports.updateAnswerLabel = function(req,res){
    var param = req.body;
    param.updateTime = new Date().getTime();
    var problemId = param.problemId;
    answerProxy.updateAnswerLabel(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err, data)));
    })
};
/*//我的回答查询
exports.getMyAnswerList = function(req,res){
    var param = req.body;
    var userCode = param.userCode;
    var authorReply = param.authorReply;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    async.waterfall([getProblemIdByUserCode,getProblemById],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    var conditions = {
        asUserCode:userCode,
        asAuthorReply:authorReply,
        status:1
    }
    //查询问题Id,通过userCode
    function getProblemIdByUserCode(cb){
        answerProxy.getProblemIdByUserCode(conditions,toPage,pageSize,function(err,data){
            console.log(data);
            var arr = new Array();
//            arr = data;
            for(var i = 0;i<data.length;i++){
                arr[i] = data[i].asProblemId;
            };
            cb(null,data);
        })
    };
    //查询问题，通过problemId
    function getProblemById(arr,cb){
        console.log(arr);
        problemProxy.getProblemById(arr,function(err,data){
           console.log(data);

        });
    };
}*/


