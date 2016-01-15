/**
 * Created by fzr on 2015/10/29.
 */

var userProxy = require('../proxy').userProxy,
    config = require('../config');
    tools = require("../common/tool");
var async = require("async");
var jwt = require('jsonwebtoken');
var integralProxy = require('../proxy').integralProxy;


//用户登陆
exports.userLogin = function (req, res,callback) {
    var options = req.body;
    var password = options.password;
    var userName = options.userName;
    var status = 1;
    var conditions = {
        status:status,
        uUserName:userName,
        uPassword:password
    }
//    console.log(conditions);
    async.waterfall([getUserInfoByUserName,getIntegralByUserId], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //获取用户信息
    function getUserInfoByUserName(cb){
        userProxy.userFind(conditions, function (error, data) {
            console.log(data);
/*            var token = jwt.sign(
//                {'id':data._id,'un':data.userName,ip: req._remoteAddress,iat:new Date().getTime()},config.tokenSecret);
                {'id':data._id,'un':data.userName,ip: req._remoteAddress,iat:new Date().getTime()},"^&*skyRoam!@#");
            console.log(token);
            console.log(jwt.sign({'id':data._id,'un':data.userName,ip: req._remoteAddress,iat:new Date().getTime()},"^&*TWSTH!@#"))
            req.token = token;
            console.log(req.token);*/
            if(!data|| data.length<=0){
                cb("用户名、密码错误",null);
                return;
            }else{
                cb(null,data);
            }
        })
    }
    //获取积分
    function getIntegralByUserId(datas,cb){
        var userId = datas[0]._id;
        integralProxy.getIntegralByUserId(userId,function(err,igData){
            cb(null, {userName:datas[0].uUserName,userId: datas[0]._id,integral:igData[0].igIntegral});
        })
    }



    /*userProxy.userFind(conditions, function (error, data) {
        console.log(data);
        console.log()
        var userId = data[0]._id
        async.waterfall([checkParam, getIntegralByUserId], function (error, result) {
            res.send(JSON.parse(tools.ResponseFormat(error, result)));
        });
        //检测参数
        function checkParam(cb) {
            var body = req.body;
            if (!data || data.length <= 0) {
                cb("用户名、密码错误", "");
            } else {
                //登录成功
                cb(null, "setSession");
            }
        }

        //session绑定
        function setSession(datas, cb) {
//            req.session.user = data[0].userCode;
//            req.session.Access_tokenS1 =  new Date().getTime();
            cb(null, {userCode: data[0].uUserCode});
        }
        //获取积分
        function getIntegralByUserId(datas,cb){
            integralProxy.getIntegralByUserId(userId,function(err,igData){
                console.log(igData);
                cb(null, {userName:data[0].uUserName,userId: data[0]._id,integral:igData[0].igIntegral});
            })
        }
    });*/
};
//添加用户
exports.insertUser = function (req, res) {
    var param = req.body;
    param.createTime = new Date().getTime();
    async.waterfall([checkParam,checkNoRepeat,insertIntoMongoDB,insertIntegral], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测参数
    function checkParam(cb) {
        if (!param.userName) {
            cb("用户名不能为空！", null);
            return;
        }
        if (!param.password) {
            cb("密码不能为空！", null);
            return;
        }
        if (!param.userPhone) {
            cb("userPhone不能为空！", null);
            return;
        }
        if (!param.userEmail) {
            cb("userEmail不能为空！", null);
            return;
        }
        cb(null, null);
    }
    //检测编号是否重复
    function checkNoRepeat(datas, cb) {
        userProxy.getUserByUserName(param.userName, function (err, data) {
            if (!data.length || data.length <= 0) {
                cb(null, null);
            } else {
                cb("userName已存在！", null);
                return;
            }
        })
    }
    //插入数据库
    function insertIntoMongoDB(datas, cb) {
        userProxy.insertUser(param, function (err, data) {
            if (err) {
                cb("插入失败", null);
            }
            if (data) {
                cb(null, data);
            }
        });
    };
    function insertIntegral(datas,cb){
        var conditions = {
            integral:500,
            userId:datas._id,
            createTime:new Date().getTime()
    }
        integralProxy.insertIntegralByAddUser(conditions,function(err,data){
            if(err){
                cb("创建积分表失败！",null);
            }else{
                cb(null,"成功！");
            }
        })
    }
};
//修改用户密码
exports.updateUserPwd = function (req, res) {
    var param = req.body;
    param.createTime = new Date().getTime();
    var conditions = {
        status:1,
        _id:param.userId,
        uPassword:param.oldPassword
    }
/*    userProxy.updateUserPwd(param,function(err,data){
        cb(err,data);
    });*/
    async.waterfall([getUserInfoByUserName, modPwdOfMongo], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //获取用户信息
    function getUserInfoByUserName(cb){
        console.log(conditions);
        userProxy.userFind(conditions, function (error, data) {
            console.log(data);
            if(!data|| data.length<=0){
                cb("你输入的旧密码有错！",null);
                return;
            }else{
                cb(null,data);
            }
        })
    }
    //修改数据库用户密码
    function modPwdOfMongo(datas, cb) {
        userProxy.updateUserPwd(param,function(err,data){
            cb(err,data);
        });
    }
};
//修改用户信息
exports.updateUserInfo = function(req,res){
    var param = req.body;
    async.waterfall([checkParam, updateUserInfo], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测参数
    function checkParam(cb){
        if(param.userPhone == ''||param.userPhone == null || param.userPhone == undefined){
            cb('用户电话不能为空！',null);
            return;
        }
        if(param.userEmail == "" || param.userEmail == null || param.userEmail == undefined){
            cb('用户邮箱不能为空！',null);
            return;
        }
        cb(null,null);
    }
    function updateUserInfo(datas,cb){
        userProxy.updateUserInfo(param,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,data);
            }
        })
    }
};
//获取用户列表
exports.getUserList = function (req,res){
    var param = req.query;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var counts;
    async.waterfall([getUserList,getIntegral],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    })
    //获取用户列表
    function getUserList(cb){
        var conditions = {
            status:1
        }
        userProxy.getUserList(conditions,toPage,pageSize,function(err,data){
            userProxy.getUserListCount(conditions,function(err,count){
                counts = count.transferpages(pageSize);
                var userArr = new Array();
                for(var i = 0;i<data.length;i++){
                    userArr[i] = {};
                    userArr[i].userName = data[i].uUserName;
                    userArr[i].userId = data[i]._id;
                    userArr[i].userCreateTimme = data[i].uCreateTime
                }
                cb(null,userArr);
            })
        });
    }
    function getIntegral(datas,cb){
        var arr = new Array()
        for(var i = 0;i<datas.length;i++){
            arr[i] = {};
            arr[i] = datas[i].userId;
        };
        integralProxy.getIntegral(arr,function(err,data){
            for(var i = 0;i<datas.length;i++){
                for(var j = 0;j<data.length;j++){
                    if(datas[i].userId == data[j].igUserId){
                        datas[i]['integral'] = data[j].igIntegral;
                    }
                }
            };
            var result = {};
            result.data = datas;
            result.counts = counts;
            cb(null,result);
        })
    }
}


/*

//用户退出
exports.userLoginOut = function (req, res) {
    async.waterfall([checkParam, delSession], function (error, result) {
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //参数检测
    function checkParam(cb) {
        if (req.session.user != null) {
            cb(null, "delSession");
        } else {
            cb("未登录", "");
        }
    }

    //session绑定
    function delSession(datas, cb) {
        delete req.session.user;
        cb(null, "清除成功！");
    }
};
//通过userCode查找用户
exports.findUserByUserCode = function (req, res) {
    var options = req.body;
    var userCode = req.session.user;
    var status = options.status ? options.status : 1;
    var conditions = {
        userCode: userCode,
        status: status
    };
    async.waterfall([checkParam, findUser], function (error, result) {
        result['userType'] = 1;
        res.send(tools.ResponseFormat(error, result));
    });
    //检测参数
    function checkParam(cb) {
        if (!userCode) {
            cb("用户不存在！", "");
            return;
        }
        cb(null, null);
    }

    //查找用户
    function findUser(datas, cb) {
        userProxy.findUser(conditions, cb);
    }
};

//获取用户列表
exports.getUserList = function(req,res){
    var token = req.body.token;
    var lllw = sessionData.getSessionData();
    if(token == ''||token == undefined || token == 'null'){
        res.send(JSON.stringify({status:500,record:'您没有权限访问！S2'}));
    }else{
        res.send(JSON.stringify({status:200,record:'获取用户列表！S2'}));
    }
}*/
