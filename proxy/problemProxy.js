/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var problem = models.problem;

//新增问题
exports.addProblem = function(entity,callback){
    var instance = new problem();
    instance.pbUserId =entity.userId;
    instance.pbTitle = entity.problemTitle;
    instance.pbContent = entity.problemContent;
    instance.pbAuthor = entity.problemAuthor;
    instance.pbLabel = entity.problemLabel;
    instance.pbIntegral = entity.problemIntegral;
    instance.pbCreateTime = entity.problemCreateTime;
    instance.pbUpdateTime = entity.problemCreateTime;
    instance.pbStatus = 0;
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
}
//查询问题
exports.getProblemListBySearch = function (conditions,problemMoney,problemTime,toPage,pageSize,callback){
    var pbStatus = conditions.pbStatus;
    var pbTitle = conditions.pbTitle;
    if(pbTitle == ''|| pbTitle == undefined || pbTitle == null){
        if(pbStatus == undefined || pbStatus == '' || pbStatus == null){
            if(problemMoney == ''|| problemMoney == undefined || problemMoney ==null){
                if(problemTime == 1){
                    problem.find(conditions,{},{sort:'-pbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }else if(problemTime == 2){
                    problem.find(conditions,{},{sort:'pbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }else{
                    problem.find(conditions,{},{sort:'-pbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }
            }else{
                if(problemMoney == 1){
                    problem.find(conditions,{},{sort:'-pbIntegral',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }else if(problemMoney == 2){
                    problem.find(conditions,{},{sort:'pbIntegral',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }else{
                    problem.find(conditions,{},{sort:'-pbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
                }
            }
        }else{
            problem.find(conditions,{},{sort:'-pbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
        }
    }else{
        problem.find(conditions,{},{limit:pageSize,skip:(toPage-1)*pageSize},callback);
    }
}
//查询问题的条数
exports.getProblemCounts = function (conditions,callback) {
    problem.count(conditions,callback);
};
//查询问题通过problemId
exports.getProblemByProblemId = function(problemId,callback){
    problem.find({_id:problemId,status:1},callback)
}
//删除问题
exports.deleteProblem = function(problemId,callback){
    problem.find({_id: problemId, "status": 1}, function (err, row) {
        row[0].status = 0;
        row[0].save(function (err) {
            callback(err, "success");
        });
    })
}
//修改问题
exports.updateProblemById = function(param,callback){
    problem.find({_id:param.problemId,"status":1},function(err,row){
        if(row[0] == ''){
            callback("未找到该问题！", null);
        }else{
            row[0].pbTitle = param.problemTitle;
            row[0].pbContent = param.problemContent;
            row[0].pbLabel = param.problemLabel;
            row[0].pbIntegral = param.problemIntegral;
            row[0].pbUpdateTime = param.problemUpdateTime;
            row[0].save(function (err) {
                callback(err, row);
            });
        }
    })
}
//判断问题时候解决
exports.judgeProblemStatus = function(problemId,problemEvaluate,problemOpinion,callback){
    problem.find({_id:problemId,"status":1},function(err,row){
//    problem.find({_id:'567e2857edfa43f010270837',"status":1},function(err,row){
        console.log(row);
        if(row == '' || row == undefined || row == null){
            callback("未找到该问题！", null);
        }else{
            if(row[0].pbStatus == 1){
                    callback(err,"该问题已解决！");
            }else{
                row[0].pbStatus = 1;
                row[0].pbEvaluate = problemEvaluate;
                row[0].pbOpinion = problemOpinion;
                row[0].save(function (err) {
                    callback(err, row);
                });
            }
        }
    })
}
//改变问题的回答状态。
exports.updateProblemStatusById = function(problemId,callback){
    problem.find({_id:problemId,"status":1},function(err,row){
        row[0].pbStatus = 1;
        row[0].save(function (err) {
            callback(err, "success");
        });
    })
}
//查询问题，通过ID
exports.getProblemById = function(arrDate,callback){
    problem.find({"_id":{"$in":arrDate},"status":1},callback);
}
//关闭问题
exports.closeProblem = function(problemId,callback){
    problem.find({"_id":problemId,status:1},function(err,data){
        if(!data || data.length<=0){
            callback('未找到该问题，请核对！',null);
        }else{
            if(data[0].pbStatus == 1){
                callback('该问题已解决！',null);
            }else if(data[0].pbStatus == 2){
                callback('该问题已关闭！',null);
            }else{
                data[0].pbStatus = 2;
                data[0].save(function (err) {
                    callback(err, data);
                });
            }
        }
    })
}
//查询某个问题下的所有回答
exports.getProblemByProblemIdArr = function(arrDate,callback){
    problem.find({"_id":{"$in":arrDate},"status":1},callback);
}
//查询某个用户下问题进行中的条数
exports.getProblemGoingCount = function(userId,callback){
    problem.count({pbUserId:userId,status:1,pbStatus:0},callback);
}
//查询某个用户下问题结束的条数
exports.getProblemCloseCount = function(userId,callback){
    problem.count({pbUserId:userId,status:1,pbStatus:{$ne:0}},callback);
}
//模糊查询问题通过问题标题
exports.getProblemByTitle = function(query,toPage,pageSize,callback){
    problem.find(query,{},{limit:pageSize,skip:(toPage-1)*pageSize},callback);
}
//模糊查询问题通过问题标题条数
exports.getProblemByTitleCount = function(query,callback){
    problem.count(query,callback);
}
//查询标签
exports.getLabelCountByTitleArr = function(query,callback){
    console.log(query);
    problem.count(query,callback)
//    problem.count({'pbLabel':{"$in":[dd]}},callback);
//    problem.find(conditions,function(err,data){
//        console.log(err);
//        console.log(data);
//        callback(err,data);
//    });
//    answer.find({"asProblemId":{"$in":arrDate},"status":1},{},{sort:'-asAnswerStatus,-asCreateTime'},callback);
//    problem.find(conditions,callback);
}
//删除问题
exports.deleteProblemById = function(problemId,callback){
    problem.remove({_id:problemId},callback);
}