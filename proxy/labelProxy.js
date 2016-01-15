/**
 * Created by fzr on 2015/12/15.
 */
var models = require('../models');
var label = models.label;

//新增回答
exports.insertLabel = function(entity,callback){
    var instance = new label();
    instance.lbLabelTitle =entity.labelTitle;
    instance.lbCreateTime =entity.createTime;
    instance.lbUpdateTime = entity.createTime;
    instance.status = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
}
//查询某个标签
exports.getLabelTitle = function(labelTitle,callback){
    label.find({lbLabelTitle:labelTitle,status:1},callback);
}
//查询标签列表
exports.getLabelList = function(conditions,toPage,pageSize,callback){
    label.find(conditions,{},{sort:'-pbUpdateTime',limit:pageSize,skip:(toPage-1)*pageSize},callback)
}
//标签修改
exports.updateLabel = function(param,callback){
    label.find({_id:param.labelId,status:1},function(err,data){
        if (!data || data.length<=0) {
            callback("未找到该标签！", null);
        } else {
            data[0].lbLabelTitle = param.labelTitle;
            data[0].lbUpdateTime = param.updateTime;
            data[0].save(function (err) {
                callback(err, "修改成功！");
            });
        }
    })
}
//标签删除
exports.deleteLabel = function(param,callback){
    label.find({_id:param.labelId,status:1},function(err,data){
        if (!data || data.length<=0) {
            callback("未找到该标签！", null);
        } else {
            data[0].status = 0;
            data[0].lbUpdateTime = param.updateTime;
            data[0].save(function (err) {
                callback(err, "删除成功！");
            });
        }
    })
}
//模糊搜索
exports.getLabelByTitle = function(query,callback){
    label.find(query,callback);
}
