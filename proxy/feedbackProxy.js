/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var feedback = models.feedback;

//新增反馈信息
exports.insertFb = function (entity, callback) {
    var instance = new feedback();
    instance.fbContent = entity.feedbackContent;
    instance.fbAuthor = entity.feedbackAuthor;
    instance.fbUserId = entity.userId;
    instance.fbCreateTime = entity.feedbackCreateTime;
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
};

//获取反馈列表。（后期可扩张搜索功能）
exports.getFeedbackListBySearch = function (conditions,toPage,pageSize,callback) {
    feedback.find(conditions,{},{sort:'-fbCreateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback);
};
//获取反馈列表总量
exports.getFeedbackCounts = function (conditions,callback) {
    feedback.count(conditions,callback);
};
