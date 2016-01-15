/**
 * Created by fzr on 2015/10/29.
 */

var models = require('../models');
var userEntity = models.userEntity;

//添加用户
exports.insertUser = function (entity, callback) {
    var instance = new userEntity();
//    instance.uUserCode = entity.userCode;
    instance.uUserName = entity.userName;
    instance.uUserPhone = entity.userPhone;
    instance.uUserEmail = entity.userEmail;
    instance.uPassword = entity.password;
    instance.uCreateTime = entity.createTime;
    instance.uUpdateTime = entity.createTime;
    instance.uStatus = 1;
    instance.save(function (err, data) {
        callback(err, data);
    });
};
//修改用户密码
exports.updateUserPwd = function (param,callback){
    userEntity.findOne({_id:param.userId,status:1},function(error,row){
        if(!row){
            callback("找不到该用户！","");
        }else{
            row["uPassword"]=param.password;
            row["uUpdateTime"]=param.createTime;
            row.save(function(err){
                callback(err,"用户密码修改成功！");
            });
        }
    })
};
//查找用户
exports.userFind = function (conditions,callback) {
    userEntity.find(conditions,function(err,data){
        callback(err,data);
    });
};
//查找用户通过userName
exports.getUserByUserName = function(userName,callback){
  userEntity.find({uUserName:userName,status:1},function(err,data){
      callback(err,data);
  })
};
//修改用户信息
exports.updateUserInfo = function(param,callback){
    userEntity.find({_id:param.userId,status:1},function(err,data){
        if(data[0] == ''|| data[0] == null ){
            callback('未找到该用户，请核对！',null);
        }else{
            data[0].uUserEmail = param.userEmail;
            data[0].uUserPhone = param.userPhone;
            data[0].uUpdateTime=new Date().getTime();
            data[0].save(function(err){
                callback(err,"用户信息修改成功！");
            });
        }
    })
}
//查找用户，通过userId
exports.getUserByUserId = function(userId,callback){
    userEntity.find({_id:userId,status:1},callback);
};
//获取用户列表
exports.getUserList = function(conditions,toPage,pageSize,callback){
  userEntity.find(conditions,{},{limit:pageSize,skip:(toPage-1)*pageSize},callback);
};
//获取用户列表总条数
exports.getUserListCount = function(conditions,callback){
    userEntity.count(conditions,callback);
}
