/**
 * Created by fzr on 2015/12/15.
 */
var answerProxy = require('../proxy').answerProxy;
var tools = require('../common/tool');
var async = require('async');
var problemProxy = require('../proxy').problemProxy;
var preserveAnswerProxy = require('../proxy').preserveAnswerProxy;

//回答表增加
exports.insertAnswer = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var answerContent = param.answerContent;
    var userName = param.userName;
    var userId = param.userId;
    var answerCount;
//    var authorReply = param.authorReply;
    param.createTime = new Date().getTime();
    async.waterfall([checkParam,getProblemById,addAnswer,addPreserveAnswer,findAnswerCountByProblemId],function(error,result){
        if(error){
            res.send(JSON.parse(tools.ResponseFormat(error, result)));
        }else{
            res.send({status:200,record:result,AnswerCount:answerCount});
        }
    })
    //检测参数
    function checkParam(cb){
        if(!answerContent){
            cb("回答的内容不能为空！",null);
            return;
        }
        if(!userId){
            cb("userId不能为空！",null);
            return;
        }
        cb(null,null);
    };
    //查询对应的问题是否存在
    function getProblemById(datas,cb){
        problemProxy.getProblemByProblemId(problemId,function(err,data){
            if(data =='' || data == null || data == undefined){
                cb("找不到该问题！",null)
                return;
            }else{
                if(data[0].pbStatus == 2 || data[0].pbStatus == 1){
                    cb('该问题已关闭或已结束，不能回答！',null);
                    return;
                };
                if(err){
                    cb(err,null);
                }else{
                    cb(null,null);
                }
            }
        })
    };
    //增加回答
    function addAnswer(datas,cb){
        answerProxy.insertAnswer(param,function(err,data){
            if(err){
                cb(err,null);
                return;
            }else{
                cb(null,"success");
            }
        });
    }
    //向维护表添加一条数据
    function addPreserveAnswer(datas,cb){
        var conditions = {
            problemId:problemId,
            userId:userId,
            createTime:param.createTime
        }
        preserveAnswerProxy.addPreserveAnswer(conditions,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,'回答成功！');
            }
        })
    }
    //获取某个问题的最新回答数
    function findAnswerCountByProblemId(datas,cb){
        answerProxy.findAnswerCountByProblemId(problemId,function(err,count){
            answerCount = count
            if(err){
                cb(err,null);
            }else{
                cb(null,"success");
            }
        })
    }
};
//回答表的列表查询
exports.getAnswerList = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var userId = param.userId
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var unCheckCount = 0;
    param.createTime = new Date().getTime();
    async.waterfall([checkParam,updateCheckStatus,getUnCheckCount,getAnswerList],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测参数
    function checkParam(cb){
        if(!problemId){
            cb('问题的Id不能为空！',null);
            return;
        }else{
            cb(null,null);
        }
    }
    //判断是否需要改变回答的查看状态
    function updateCheckStatus(datas,cb){
       problemProxy.getProblemByProblemId(problemId,function(err,data){
           if(!data || data.length<=0){
               cb('未找到该问题！',null)
               return;
           }else{
               if(data[0].pbUserId == userId){
                   answerProxy.updateAnswerStatus(problemId,toPage,pageSize,function(err,data){
                       cb(null,null);
                   });
               }else{
                   cb(null,null);
               }
           }
       })
    };
    //查询未查看的回答数
    function getUnCheckCount(datas,cb){
        answerProxy.unCheckAnswerCount(problemId,function(err,count){
            unCheckCount = count;
            cb(null,null);
        });
    }
    //获取某个问题下的回答列表
    function getAnswerList(datas,cb){
//        var userId;
        var conditions = {
            asProblemId:problemId,
            asUserId:userId,
            status:1
        };
        for(var key in conditions){
            if(conditions[key] == "" || conditions[key] == undefined ||conditions[key] == null){
                delete conditions[key];
            }
        }
        answerProxy.getAnswerListByProblemId(conditions,toPage,pageSize,function(err,data){
            answerProxy.getAnswerCountByProblemId(conditions,function(err,count){
                var arr = new Array();
                if(data == ''|| data == null || data == undefined){
                    arr = [];
                }else{
                    for(var i =0;i<data.length;i++){
                        arr[i]={};
                        arr[i]['id'] = data[i]._id;
                        arr[i]['checkStatus'] = data[i].asCheckStatus;
                        arr[i]['answerStatus'] = data[i].asAnswerStatus;
                        arr[i]['answerCreateTime'] = data[i].asCreateTime;
                        arr[i]['userId'] = data[i].asUserId;
                        arr[i]['userName'] = data[i].asUserName;
                        arr[i]['answerContent'] = data[i].asContent;
                        arr[i]['problemId'] = data[i].asProblemId;
                        arr[i]['replyName'] = data[i].asReplyName;
                        arr[i]['replyId'] = data[i].asReplyId;
                    }
                }
                var result = {};
                result.data = arr;
                result.counts=count.transferpages(pageSize);
                result.answerCount = count;
                result.unCheckCount = unCheckCount
                cb(null,result);
            })
        });
    }
};
//回答表的更新
exports.updateAnswer = function(req,res){
    var param = req.body;
    var answerId = param.answerId;
    param.updateCreate = new Date().getTime();
    answerProxy.updateAnswerContentById(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err, data)));
    })
};
//回答表的删除
exports.deleteAnswer = function(req,res){
    var param = req.body;
    param.updateTime = new Date().getTime();
    answerProxy.deleteAnswerById(param,function(err,data){
        res.send(JSON.parse(tools.ResponseFormat(err, data)));
    });
};
//我的回答查询
exports.getMyAnswerList = function(req,res){
    console.log('--------7777-----');
    console.log( new Date().getTime());
    var param = req.body;
    var userId = param.userId;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var counts;
    async.waterfall([getProblemIdByUserId,getProblemById,getAnswerByProblemId],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    var conditions = {
        asUserId:userId,
        status:1
    }
    //查询问题Id通过UserId
    function getProblemIdByUserId(cb){
        preserveAnswerProxy.getProblemIdByUserId(userId,toPage,pageSize,function(err,data){
            preserveAnswerProxy.getProblemCountByUserId(userId,function(err,count){
                counts=count.transferpages(pageSize);
                var arr = new Array();
                for(var i =0;i<data.length;i++){
                    arr[i] = {};
                    arr[i]['problemId'] = data[i].psProblemId;
                    arr[i]['updateTime'] = data[i].psUpdateTime;
                }
                cb(null,arr);
            });
        })
    };
    //查询问题，通过problemId
    function getProblemById(datas,cb){
        var arrPbId = new Array();
        for(var i = 0;i<datas.length;i++){
            arrPbId[i] = datas[i].problemId;
        };
        problemProxy.getProblemByProblemIdArr(arrPbId,function(err,data){
            console.log(data);
//            var arrPb = new Array();
            if(!data || data.length<=0){
                datas = [];
                cb('没有找到我所回答的问题',null);
                return;
            }else{
                /*for(var i =0;i<datas.length;i++){
                    for(var k = 0;k<data.length;k++){
                        if(datas[i].problemId == data[k]._id){
                            console.log('---1-1-1-1-1----');
                            console.log(data);
                            arrPb[k] = {};
                            arrPb[k]['id'] = data[i]._id;
                            arrPb[k]['problemTitle'] = data[i].pbTitle;
                            arrPb[k]['problemContent'] = data[i].pbContent;
                            arrPb[k]['problemCreateTime'] = data[i].pbCreateTime;
                            arrPb[k]['problemAuthor'] = data[i].pbAuthor;
                            arrPb[k]['userId'] = data[i].pbUserId;
                            arrPb[k]['problemLabel'] = data[i].pbLabel;
                            arrPb[k]['problemStatus'] = data[i].pbStatus;
                            arrPb[k]['problemIntegral'] = data[i].pbIntegral;
                            arrPb[k]['problemEvaluate'] = data[i].pbEvaluate;
                            arrPb[k]['problemOpinion'] = data[i].pbOpinion;
                            arrPb[k]['answerDate'] = [];
                        }
                    }
                }*/
                for(var i =0;i<datas.length;i++){
                    for(var k = 0;k<data.length;k++){
                        if(datas[i].problemId == data[k]._id){
                            console.log('---1-1-1-1-1----');
                            console.log(data);
                            datas[i] = {};
                            datas[i]['id'] = data[k]._id;
                            datas[i]['problemTitle'] = data[k].pbTitle;
                            datas[i]['problemContent'] = data[k].pbContent;
                            datas[i]['problemCreateTime'] = data[k].pbCreateTime;
                            datas[i]['problemAuthor'] = data[k].pbAuthor;
                            datas[i]['userId'] = data[k].pbUserId;
                            datas[i]['problemLabel'] = data[k].pbLabel;
                            datas[i]['problemStatus'] = data[k].pbStatus;
                            datas[i]['problemIntegral'] = data[k].pbIntegral;
                            datas[i]['problemEvaluate'] = data[k].pbEvaluate;
                            datas[i]['problemOpinion'] = data[k].pbOpinion;
                            datas[i]['answerDate'] = [];
                        }
                    }
                }
            }
            console.log(datas);
            cb(null,datas)
        });
    };
    //获取回答列表通过问题Id
    function getAnswerByProblemId(datas,cb){
        var arr = new Array();
        for(var i = 0;i<datas.length;i++){
            arr[i] = datas[i].id;
        }
        answerProxy.getAnswerByProblemId(arr,function(err,answerDate){
            var answerArr = new Array();
            for(var k =0;k<answerDate.length;k++){
/*                answerArr[k]={};
                answerArr[k]['problemId'] = answerDate[k].asProblemId;
                answerArr[k]['answerStatus'] = answerDate[k].asAnswerStatus;
                answerArr[k]['userId'] = answerDate[k].asUserId;
                answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;*/
                answerArr[k]={};
                answerArr[k]['id'] = answerDate[k]._id;
                answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;
                answerArr[k]['answerStatus'] = answerDate[k].asAnswerStatus;
                answerArr[k]['replyId'] = answerDate[k].asReplyId;
                answerArr[k]['replyName'] = answerDate[k].asReplyName;
                answerArr[k]['userId'] = answerDate[k].asUserId;
                answerArr[k]['answerCreateTime'] = answerDate[k].asCreateTime;
                answerArr[k]['answerContent'] = answerDate[k].asContent;
                answerArr[k]['problemId'] = answerDate[k].asProblemId;
            }
            for(var i = 0;i<answerArr.length;i++){
                for(var j = 0;j<datas.length;j++){
                    if(datas[j].id == answerArr[i].problemId){
                        datas[j].answerDate.push(answerArr[i]);
                    }
                }
            }
            for(var i =0;i<datas.length;i++){
                if(datas[i].answerDate == null || datas[i].answerDate == ''){
                    datas[i]['answerCount'] = 0;
                    datas[i]['askPeopleReply'] = 0;
                }else{
                     datas[i].answerDate.sort(function(a,b){
                        return b.answerStatus-a.answerStatus;
                     });
                    var askPeopleReply = 0;
                    for(var l =0;l<datas[i].answerDate.length;l++){
                        if(datas[i].answerDate[l].userId == datas[i].userId){
                            askPeopleReply++;
                        }
                    }
                    datas[i]['answerCount'] = datas[i].answerDate.length;
                    datas[i]['askPeopleReply'] = askPeopleReply;        //问题提问人回复数。
                    for(var o=0;o<datas[i]['answerDate'].length;o++){
                        if(datas[i]['answerDate'][o].userId != userId){
                            datas[i]['answerDate'].splice(o,1);
                        }
                    }
                    datas[i]['myAnswerCount'] = parseInt(datas[i]['answerDate'].length);
                }
            };
            var result = {};
            result.data = datas;
            result.counts = counts;
            console.log('--------888-----');
            console.log( new Date().getTime());
            cb(null,result);
        })
    };
}


//我的回答查询
exports.getMyAnswerListGet = function(req,res){
    console.log('--------7171717-----');
    console.log( new Date().getTime());
    var param = req.query;
    var userId = param.userId;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var counts;
    async.waterfall([getProblemIdByUserId,getProblemById,getAnswerByProblemId],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    var conditions = {
        asUserId:userId,
        status:1
    }
    //查询问题Id通过UserId
    function getProblemIdByUserId(cb){
        preserveAnswerProxy.getProblemIdByUserId(userId,toPage,pageSize,function(err,data){
            preserveAnswerProxy.getProblemCountByUserId(userId,function(err,count){
                counts=count.transferpages(pageSize);
                var arr = new Array();
                for(var i =0;i<data.length;i++){
                    arr[i] = {};
                    arr[i]['problemId'] = data[i].psProblemId;
                    arr[i]['updateTime'] = data[i].psUpdateTime;
                }
                cb(null,arr);
            });
        })
    };
    //查询问题，通过problemId
    function getProblemById(datas,cb){
        var arrPbId = new Array();
        for(var i = 0;i<datas.length;i++){
            arrPbId[i] = datas[i].problemId;
        };
        problemProxy.getProblemByProblemIdArr(arrPbId,function(err,data){
            console.log(data);
            var arrPb = new Array();
            if(!data || data.length<=0){
                arrPb = [];
                cb('没有找到我所回答的问题',null);
                return;
            }else{
                for(var i =0;i<datas.length;i++){
                    for(var k = 0;k<data.length;k++){
                        if(datas[i].problemId == data[k]._id){
                            arrPb[k] = {};
                            arrPb[k]['id'] = data[i]._id;
                            arrPb[k]['problemTitle'] = data[i].pbTitle;
                            arrPb[k]['problemContent'] = data[i].pbContent;
                            arrPb[k]['problemCreateTime'] = data[i].pbCreateTime;
                            arrPb[k]['problemAuthor'] = data[i].pbAuthor;
                            arrPb[k]['userId'] = data[i].pbUserId;
                            arrPb[k]['problemLabel'] = data[i].pbLabel;
                            arrPb[k]['problemStatus'] = data[i].pbStatus;
                            arrPb[k]['problemIntegral'] = data[i].pbIntegral;
                            arrPb[k]['problemEvaluate'] = data[i].pbEvaluate;
                            arrPb[k]['problemOpinion'] = data[i].pbOpinion;
                            arrPb[k]['answerDate'] = [];
                        }
                    }
                }
            }
            cb(null,arrPb)
        });
    };
    //获取回答列表通过问题Id
    function getAnswerByProblemId(datas,cb){
        var arr = new Array();
        for(var i = 0;i<datas.length;i++){
            arr[i] = datas[i].id;
        }
        answerProxy.getAnswerByProblemId(arr,function(err,answerDate){
            var answerArr = new Array();
            for(var k =0;k<answerDate.length;k++){
                /*                answerArr[k]={};
                 answerArr[k]['problemId'] = answerDate[k].asProblemId;
                 answerArr[k]['answerStatus'] = answerDate[k].asAnswerStatus;
                 answerArr[k]['userId'] = answerDate[k].asUserId;
                 answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;*/
                answerArr[k]={};
                answerArr[k]['id'] = answerDate[k]._id;
                answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;
                answerArr[k]['answerStatus'] = answerDate[k].asAnswerStatus;
                answerArr[k]['replyId'] = answerDate[k].asReplyId;
                answerArr[k]['replyName'] = answerDate[k].asReplyName;
                answerArr[k]['userId'] = answerDate[k].asUserId;
                answerArr[k]['answerCreateTime'] = answerDate[k].asCreateTime;
                answerArr[k]['answerContent'] = answerDate[k].asContent;
                answerArr[k]['problemId'] = answerDate[k].asProblemId;
            }
            for(var i = 0;i<answerArr.length;i++){
                for(var j = 0;j<datas.length;j++){
                    if(datas[j].id == answerArr[i].problemId){
                        datas[j].answerDate.push(answerArr[i]);
                    }
                }
            }
            for(var i =0;i<datas.length;i++){
                if(datas[i].answerDate == null || datas[i].answerDate == ''){
                    datas[i]['answerCount'] = 0;
                    datas[i]['askPeopleReply'] = 0;
                }else{
                    datas[i].answerDate.sort(function(a,b){
                        return b.answerStatus-a.answerStatus;
                    });
                    var askPeopleReply = 0;
                    for(var l =0;l<datas[i].answerDate.length;l++){
                        if(datas[i].answerDate[l].userId == datas[i].userId){
                            askPeopleReply++;
                        }
                    }
                    datas[i]['answerCount'] = datas[i].answerDate.length;
                    datas[i]['askPeopleReply'] = askPeopleReply;        //问题提问人回复数。
                    for(var o=0;o<datas[i]['answerDate'].length;o++){
                        if(datas[i]['answerDate'][o].userId != userId){
                            datas[i]['answerDate'].splice(o,1);
                        }
                    }
                    datas[i]['myAnswerCount'] = parseInt(datas[i]['answerDate'].length);
                }
            };
            var result = {};
            result.data = datas;
            result.counts = counts;
            console.log('--------818181-----');
            console.log( new Date().getTime());
            cb(null,result);
        })
    };
}


