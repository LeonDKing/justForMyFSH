/**
 * Created by fzr on 2015/12/15.
 */
var integralProxy = require('../proxy').integralProxy;
var tools = require('../common/tool');
var async = require('async');
var userProxy = require('../proxy').userProxy;
var messageProxy = require('../proxy').messageProxy;

//查询积分列表列表
exports.getIntegralList = function(req,res){
    var param = req.query;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var conditions = {
        status:1
    }
    integralProxy.getIntegralListBySearch(conditions,toPage,pageSize,function(error,datalist){
        integralProxy.getIntegralCounts(conditions,function(err,count){
            var arr = new Array();
            for(var i =0;i<datalist.length;i++){
                arr[i]={};
                arr[i]['id'] = datalist[i]._id;
                arr[i]['integralCreateTime'] = datalist[i].igCreateTime;
                arr[i]['integralUpdateTime'] = datalist[i].igUpdateTime;
                arr[i]['integral'] = datalist[i].igIntegral;
                arr[i]['userId'] = datalist[i].igUserId;
            }
            var result = {};
            result.data = arr;
            result.counts=count.transferpages(pageSize);
            res.send(JSON.parse(tools.ResponseFormat(error,result)));
        })
    })
}
//新增积分
exports.insertIntegral = function(req,res){
    var param = req.body;
    var userId = param.userId;
    var integral = param.integral;
    param.createTime = new Date().getTime();
    var userName;
    async.waterfall([checkParam, getUsersByUserId,updateIntegralByRecharge,insertMessageByRechargeIntegral], function (error, data) {
        res.send(JSON.parse(tools.ResponseFormat(error,data)));
    });
    //检测参数
    function checkParam(cb){
        if(!userId){
            cb("请输入用户Id！",null);
            return;
        }
        if(!integral){
            cb('请输入要充值的积分数！',null);
            return;
        }
        cb(null,null);
    };
    //判断用户是否存在
    function getUsersByUserId(datas,cb){
        userProxy.getUserByUserId(userId,function(err,data){
            if(!data.length || data.length <= 0){
                cb("未找到该用户，请核查！",null);
                return;
            }else{
                param.userName = data[0].uUserName;
                userName = data[0].uUserName;
                cb(null,userName);
            }
        });
    };
    //新增积分通过充值
    function updateIntegralByRecharge(datas,cb){
        integralProxy.updateIntegralByRecharge(userId,integral,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,"success");
            }
        });
    }
    //新增消息通过充值积分
    function insertMessageByRechargeIntegral(datas,cb){
        messageProxy.insertMessageByRechargeIntegral(param,function(err,data){
            cb(err,'success');
        })
    }
};