/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var message = models.message;

//查询消息
exports.getMessageListBySearch = function (conditions,toPage,pageSize,callback){
    message.find(conditions,{},{sort:'-msgUpdateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
}
//查询消息的条数
exports.getMessageCounts = function (conditions,callback) {
    message.count(conditions,callback);
};
//通过充值积分新增一条消息
exports.insertMessageByRechargeIntegral = function(entity,callback){
    var instance = new message();
    instance.msgContent =entity.userName+"充值了"+entity.integral+"积分";
    instance.msgCreateTime = entity.createTime;
    instance.msgUpdateTime = entity.createTime;
    instance.msgUserId = entity.userId
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
}
//通过回答呗采纳新增一条消息
exports.insertMessageByAnswer = function(entity,callback){
    var instance = new message();
    instance.msgContent =entity.problemAuthor+"采纳了你的回答,收到了"+entity.integral+"金币";
//    instance.msgContent ="我的回答被采纳，增加了"+entity.integral+"金币";
    instance.msgCreateTime = entity.createTime;
    instance.msgUpdateTime = entity.createTime;
    instance.msgUserId = entity.userId;
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
}