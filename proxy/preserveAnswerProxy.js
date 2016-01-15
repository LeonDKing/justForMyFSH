/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var preserveAnswer = models.preserveAnswer;

//新增一条回答维护
exports.addPreserveAnswer = function(entity,callback){
    var problemId = entity.problemId;
    var userId = entity.userId;
    preserveAnswer.find({psProblemId:problemId,psUserId:userId,status:1},function(err,data){
        if(!data || data.length<=0){
            var instance = new preserveAnswer();
            instance.psProblemId =problemId;
            instance.psUserId =userId;
            instance.psCreateTime = entity.createTime;
            instance.psUpdateTime = entity.createTime;
            instance.status = 1;
            instance.save(function (err, data) {
                callback(err, data);
            });
        }else{
            data[0].psUpdateTime = entity.createTime;
            data[0].save(function (err) {
                callback(err, "success");
            });
        }
    });
}
//获取我的回答的问题ID
exports.getProblemIdByUserId = function(userId,toPage,pageSize,callback){
    preserveAnswer.find({"psUserId":userId,status:1},{},{sort:'-psUpdateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
}
//获取我的回答总条数
exports.getProblemCountByUserId = function(userId,callback){
    preserveAnswer.count({psUserId:userId,status:1},callback);
}
