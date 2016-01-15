/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var answer = models.answer;

//新增回答
exports.insertAnswer = function(entity,callback){
    var instance = new answer();
    instance.asProblemId =entity.problemId;
    instance.asContent =entity.answerContent;
    instance.asUserName = entity.userName;
    instance.asUserId = entity.userId;
    instance.asReplyName = entity.replyName;
    instance.asReplyId = entity.replyId;
    instance.asCreateTime = entity.createTime;
    instance.asUpdateTime = entity.createTime;
    instance.asAnswerStatus = 0;
    instance.status = 1;
    instance.asCheckStatus = 0;
    instance.save(function (err, data) {
        callback(err, data);
    });
}
//获取回答列表
exports.getAnswerListByProblemId = function(conditions,toPage,pageSize,callback){
    answer.find(conditions,{},{sort:'asCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback)
}
//获取某个问题的回答数
exports.getAnswerCountByProblemId = function (conditions,callback) {
    answer.count(conditions,function(err,data){
        callback(err,data);
    })
};
//改变回答的状态
exports.updateAnswerById = function(answerId,callback){
    answer.find({_id:answerId,"status":1},function(err,row){
        if (row == '' || row ==undefined || row == null) {
            callback("未找到该条回答！", null);
        } else {
            row[0].asAnswerStatus = 1;
            row[0].save(function (err) {
                callback(err,row);
            });
        }
    })
}
//查询某个问题下的所有回答
exports.getAnswerByProblemId = function(arrDate,callback){
    answer.find({"asProblemId":{"$in":arrDate},"status":1},callback);
}
//修改回答
exports.updateAnswerContentById = function(param,callback){
    answer.find({_id:param.answerId,status:1},function(err,row){
        if(row == ''|| row == null || row == undefined){
            callback('未找到该回答，请核对！',null)
            return
        }else{
            if(row[0].asAnswerStatus == 1){
                callback('该问题已被采纳，不能修改内容！',null);
                return;
            }
            if(row[0].asUserId == param.userId){
                row[0].asContent = param.answerContent;
                row[0].asUpdateTime = param.updateCreate;
                row[0].save(function (err) {
                    callback(err,'修改回答成功！');
                });
            }else{
                callback('您没有权限修改该问题！',null)
            }
        }
    });
}
//删除回答
exports.deleteAnswerById = function(param,callback){
    answer.find({_id:param.answerId,status:1},function(err,row){
        if(row == ''|| row == null || row == undefined){
            callback('未找到该回答，请核对！',null)
            return
        }else{
            if(row[0].asUserId == param.userId){
                if(row[0].asAnswerStatus == 1){
                    callback('该回答已被采纳，不能删除该回答!',null)
                }else{
                    row[0].status = 0;
                    row[0].asUpdateTime = param.updateTime;
                    row[0].save(function (err) {
                        callback(err,'删除成功！');
                    });
                }
            }else{
                callback('您没有权限删除该问题！',null)
            }
        }
    })
}
//改变回答的查看状态
exports.updateAnswerStatus = function(problemId,toPage,pageSize,callback){
    answer.find({asProblemId:problemId,status:1},{},{sort:'asCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},function(err,row){
        if(row == ''|| row == null || row == undefined){
            callback('未找到该问题，请核对！',null)
            return
        }else{
            var temp=0;
            for(var i=0;i<row.length;i++){
                row[i].asCheckStatus = 1;
//                row[i].asUpdateTime = param.updateTime;
                row[i].save(function(err){
                    temp++;
                    if(temp==row.length){
                        callback(err,"success");
                    }
                });
            }
        }
    })
}
//查看某个问题下未读的条数。
exports.unCheckAnswerCount = function(problemId,callback){
    answer.count({asProblemId:problemId,asCheckStatus:0,status:1},callback);
}
//查询某个问题下的所有回答
exports.findAnswerByProblemId = function(problemId,toPage,pageSize,callback){
    answer.find({asProblemId:problemId,status:1},{},{sort:'asCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
}
//查询某个问题下的所有回答的条数
exports.findAnswerCountByProblemId = function(problemId,callback){
    answer.count({asProblemId:problemId,status:1},callback);
}

