/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var integral = models.integral;

//查询积分
exports.getIntegralListBySearch = function (conditions,toPage,pageSize,callback){
    integral.find(conditions,{},{sort:'-igUpdateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
}
//查询积分的条数
exports.getIntegralCounts = function (conditions,callback) {
    integral.count(conditions,callback);
};
//通过创建用户，创建积分表
exports.insertIntegralByAddUser = function(entity,callback){
    var instance = new integral();
    instance.igUserId = entity.userId;
//    instance.igUserCode =entity.userCode;
    instance.igIntegral = entity.integral;
    instance.igCreateTime = entity.createTime;
    instance.igUpdateTime = entity.createTime;
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
}
//通过提问问题，修改积分。
exports.updateIntegralByProblem = function(userId,problemInterval,callback){
    integral.find({igUserId: userId, "status": 1}, function (err, row) {
        if (row == '') {
            callback("未找到该用户！", null);
        } else {
            var integral = row[0].igIntegral;
            if(parseInt(integral) - parseInt(problemInterval)<0){
                callback("用户积分不够，请充值！",null)
            }else{
                row[0].igIntegral = parseInt(integral) - parseInt(problemInterval);
                row[0].igUpdateTime = new Date().getTime();
                row[0].save(function (err) {
                    callback(err, row[0].igIntegral);
                });
            }
        }
    })
}
//通过删除问题，修改积分。(回答问题)
exports.addIntegralByDelProblem = function(userId,problemIntegral,callback){
    integral.find({igUserId: userId, "status": 1}, function (err, row) {
        if (row == '' || row == null || row == undefined) {
            callback("未找到该用户！", null);
        } else {
            var integral = row[0].igIntegral;
            row[0].igIntegral = parseInt(integral) + parseInt(problemIntegral);
            row[0].igUpdateTime = new Date().getTime();
            row[0].save(function (err) {
                callback(err, row[0].igIntegral);
            });
        }
    })
}
//通过充值，修改积分
exports.updateIntegralByRecharge = function(userId,Integral,callback){
    integral.find({igUserId:userId,"status":1},function(err,row){
        if(!row || row.length<=0){
            callback("未找到该用户！", null);
        }else{
            var integral = row[0].igIntegral;
            row[0].igIntegral = parseInt(integral) + parseInt(Integral);
            row[0].igUpdateTime = new Date().getTime();
            row[0].save(function (err) {
                callback(err, "success");
            });
        }
    })
}
//通过用户唯一标识码获取积分
exports.getIntegralByUserId = function(userId,callback){
    integral.find({igUserId:userId,"status":1},callback);
}
//获取积分列表
exports.getIntegral = function(arr,callback){
    integral.find({igUserId:{$in:arr},status:1},callback);
}
