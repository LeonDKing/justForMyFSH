/**
 * Created by fzr on 2015/12/15.
 */
var problemProxy = require('../proxy').problemProxy,
    tools = require("../common/tool");
var async = require("async");
var integralProxy = require('../proxy').integralProxy;
var answerProxy = require('../proxy').answerProxy;
var messageProxy = require('../proxy').messageProxy;
var Iconv = require('iconv-lite');
var labelProxy = require('../proxy').labelProxy;

//查询问题可用来过滤查询的。
exports.getProblemList = function(req,res){
    console.log('--------000-----');
    console.log( new Date().getTime());
    var param = req.body;
    var problemMoney = param.problemMoney;       //用来作为金钱的升降序    1降序   2.升序
    var problemTime = param.problemTime;                //用来判断是时间的升降序   1降序   2.升序
    var problemTitle = param.problemTitle;
    var problemLabel = param.problemLabel;
    var problemStatus = param.problemStatus;
    var userId = param.userId;
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var result={},counts,conditions;
    console.log('--------111-----');
    console.log( new Date().getTime());
    //这个problemStatus==3没有实际意义。只是用来过滤数据而已。
    if(problemStatus == 3){
        conditions = {
            pbStatus:{"$ne":0},
            pbUserId:userId,
            status:1
        }
    }else{
        if(problemTitle == ''|| problemTitle == undefined || problemTitle == null){
            conditions = {
                pbStatus:problemStatus,
                pbUserId:userId,
                status:1
            }
        }else{
            conditions = {
                pbTitle:new RegExp(problemTitle),
                pbStatus:problemStatus,
                pbUserId:userId,
                status:1
            }
        }
    }
    //过滤条件
    for(var key in conditions){
        if(conditions[key]==""){
            delete conditions[key];
        }
    };
    async.waterfall([getProblemListBySearch,getAnswerByProblemId],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)))
    })
    //获取问题列表
    function getProblemListBySearch(cb){
        problemProxy.getProblemListBySearch(conditions,problemMoney,problemTime,toPage,pageSize,function(error,datalist){
            problemProxy.getProblemCounts(conditions,function(err,count){
                var arr = new Array();
                if(datalist == ''|| datalist == null || datalist == undefined){
                    arr = [];
                }else{
                    for(var i =0;i<datalist.length;i++){
                        arr[i]={};
                        arr[i]['id'] = datalist[i]._id;
                        arr[i]['problemTitle'] = datalist[i].pbTitle;
                        arr[i]['problemContent'] = datalist[i].pbContent;
                        arr[i]['problemCreateTime'] = datalist[i].pbCreateTime;
                        arr[i]['problemAuthor'] = datalist[i].pbAuthor;
                        arr[i]['userId'] = datalist[i].pbUserId;
                        arr[i]['problemLabel'] = datalist[i].pbLabel;
                        arr[i]['problemStatus'] = datalist[i].pbStatus;
                        arr[i]['problemIntegral'] = datalist[i].pbIntegral;
                        arr[i]['problemEvaluate'] = datalist[i].pbEvaluate;
                        arr[i]['problemOpinion'] = datalist[i].pbOpinion;
                        arr[i]['answerDate'] = [];
                    }
                }
                counts=count.transferpages(pageSize);
                cb(null,arr)
            })
        })
    };
    //获取回答
    function getAnswerByProblemId(datas,cb){
        var arrPb = new Array();
        for(var i = 0;i<datas.length;i++){
            arrPb[i] = datas[i].id;
        }
        answerProxy.getAnswerByProblemId(arrPb,function(err,answerDate){
            var answerArr = new Array();
            for(var k =0;k<answerDate.length;k++){
                answerArr[k]={};
//                answerArr[k]['id'] = answerDate[k]._id;
//                answerArr[k]['answerCreateTime'] = answerDate[k].asCreateTime;
//                answerArr[k]['answerStatus'] = answerDate[k].asAnswerStatus;
//                answerArr[k]['userId'] = answerDate[k].asUserId;
//                answerArr[k]['answerer'] = answerDate[k].asAnswerer;
//                answerArr[k]['answerContent'] = answerDate[k].asContent;
                answerArr[k]['problemId'] = answerDate[k].asProblemId;
                answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;
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
                    datas[i]['unCheckCount'] = 0;
                }else{
/*                    datas[i].answerDate.sort(function(a,b){
                            return b.answerStatus-a.answerStatus;
                    });*/
                    var unCheckCount = 0;
                    for(var l =0;l<datas[i].answerDate.length;l++){
                        if(datas[i].answerDate[l].checkStatus == 0){
                            unCheckCount++;
                        }
                    }
                    datas[i]['answerCount'] = datas[i].answerDate.length;
                    datas[i]['unCheckCount'] = unCheckCount;
                    delete datas[i].answerDate;
                    datas[i]['answerDate'] = [];
                }
            };
            result.data = datas;
            result.counts = counts;
            cb(null,result);
            console.log('-----2-----');
            console.log( new Date().getTime());
        })
    };
};
//新增问题
exports.insertProblem = function(req,res){
    var param = req.body;
    var userId = param.userId;
    var problemTitle = param.problemTitle;
    var problemContent = param.problemContent;
    param.problemCreateTime = new Date().getTime();
    var problemAuthor = param.problemAuthor;
    var problemLabel = param.problemLabel;
    var problemIntegral = param.problemIntegral;
    var status = 1;
    //新增问题
    async.waterfall([checkParam,updateIntegral,addProblem],function(error,result){
        if(error){
            res.send(JSON.parse(tools.ResponseFormat(error, result)));
        }else{
            res.send({status:200,record:'问题添加成功',integral:result});
        }
    })
    //检测参数
    function checkParam(cb){
        if(!problemTitle){
            cb("标题不能为空！",null);
            return;
        }
/*        if(!problemContent){
            cb("内容不能为空！",null);
            return;
        }*/
        if(!problemAuthor){
            cb("提问人不能为空！",null);
            return;
        }
/*        if(problemLabel.length<=0){
            cb("标签不能为空！",null);
            return;
        }*/
        if(!problemIntegral){
            cb("积分不能为空！",null);
            return
        }
        cb(null,null);
    };
    //扣积分
    function updateIntegral(datas,cb){
        integralProxy.updateIntegralByProblem(userId,problemIntegral,function(err,data){
            if(err){
                cb(err,null)
            }else{
                cb(null,data);
            }
        })
    }
    //增加问题
    function addProblem(datas,cb){
        problemProxy.addProblem(param,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,datas);
            }
        })
    };
};
//修改问题
exports.updateProblem = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var problemTitle = param.problemTitle;
    var problemContent = param.problemContent;
    var userId = param.userId;
    param.problemUpdateTime = new Date().getTime();
    var problemLabel = param.problemLabel;
    var problemIntegral = param.problemIntegral;
    var oldIntegral;
    async.waterfall([checkParam,getIntegral,updateIntegral,updateProblemById],function(error,result){
//        res.send(JSON.parse(tools.ResponseFormat(error, result)));
        if(error){
            res.send(JSON.parse(tools.ResponseFormat(error, result)));
        }else{
            res.send({status:200,record:'问题修改成功',integral:result});
        }
    });
    //检测参数。
    function checkParam(cb){
        if(!problemTitle){
            cb("标题不能为空！",null);
            return;
        }
/*        if(!problemContent){
            cb("内容不能为空！",null);
            return;
        }*/
/*        if(problemLabel.length<=0){
            cb("标签不能为空！",null);
            return;
        }*/
        if(!problemIntegral){
            cb("积分不能为空！",null);
            return
        }
        cb(null,null);
    };
    //查询原有的积分
    function getIntegral(datas,cb){
        problemProxy.getProblemByProblemId(problemId,function(err,data){
            if(data =='' || data == null || data == undefined){
                cb("找不到该问题！",null)
                return;
            }else{
                if(userId == data[0].pbUserId){
                    if(data[0].pbStatus == 2 || data[0].pbStatus == 1){
                        cb('该问题已关闭或已结束，不能回答！',null);
                        return;
                    }else{
                        oldIntegral = data[0].pbIntegral;
//                        userId = data[0].pbUserId;
                        if(err){
                            cb(err,null)
                        }else{
                            cb(null,null)
                        }
                    }
                }else{
                    cb('您没有权限修改问题',null);
                    return;
                }
            }
        })
    }
    //更新积分
    function updateIntegral(datas,cb){
        var sumIntegral = parseInt(problemIntegral)-parseInt(oldIntegral);
        if(sumIntegral<0){
            cb("现有积分不能小于原本的积分！",null);
            return
        }else{
            integralProxy.updateIntegralByProblem(userId,sumIntegral,function(err,data){
                if(err){
                    cb(err,null)
                }else{
                    cb(null,data)
                }
            })
        }
    }
    //更新问题。
    function updateProblemById(datas,cb){
        var  integral = datas
        problemProxy.updateProblemById(param,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,integral);
            }
        });
    }
};
//采纳问题
exports.updateProblemStatus = function(req,res){
    var param = req.body;
    var answerId = param.answerId;
    var problemId = param.problemId;
    var problemEvaluate = param.problemEvaluate;
    var problemOpinion = param.problemOpinion;
    var integral,userId,userName,problemAuthor;
    var createTime = new Date().getTime();
    async.waterfall([judgeProblemStatus,updateAnswerById,addIntegralByDelProblem,insertMessageByAnswer],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //检测该问题是否已解决。
    function judgeProblemStatus(cb) {
        problemProxy.judgeProblemStatus(problemId,problemEvaluate,problemOpinion,function(err,data){
            if(data == null){
                cb(err,null);
                return
            }else{
                if(data == '该问题已解决！'){
                    cb("该问题已解决！",null);
                    return;
                }else{
                    integral = data[0].pbIntegral;
                    problemAuthor = data[0].pbAuthor
                    cb(null,null);
                };
            }
            return;
        })
    }
    //更新回答状态
    function updateAnswerById(datas,cb){
        answerProxy.updateAnswerById(answerId,function(err,data){
            if(!data || data.length<=0){
                cb(err,null);
                return;
            }else{
                userId = data[0].asUserId;
                userName = data[0].asUserName;
                cb(null,data);
            }
        })
    }
    //增加积分，通过被提问人采纳。
    function addIntegralByDelProblem(datas,cb){
        integralProxy.addIntegralByDelProblem(userId,integral,function(err,data){
            cb(err,data);
        })
    }
    //新增一条消息
    function insertMessageByAnswer(datas,cb){
        var conditions = {
            problemAuthor:problemAuthor,
            userName:userName,
            createTime:createTime,
            integral:integral,
            userId:userId
        }
        messageProxy.insertMessageByAnswer(conditions,function(err,data){
            cb(err,"success");
        })
    }
};
//关闭问题
exports.closeProblem = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var userId = param.userId;
    var integral ;
    async.waterfall([closeProblem,addIntegralByCloseProblem],function(error,result){
        if(error){
            res.send(JSON.parse(tools.ResponseFormat(error, result)));
        }else{
            res.send({status:200,record:'问题关闭成功',integral:result});
        }
//        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    function closeProblem(cb){
        problemProxy.closeProblem(problemId,function(err,data){
            if(err){
                cb(err,null);
                return;
            }else{
                if(data[0].pbUserId == userId){
                    integral = data[0].pbIntegral;
                    cb(null,integral);
                }else{
                    cb("您没有权限修改关闭此问题！",null);
                    return;
                }
            }
        })
    };
    //关闭问题，返回积分。
    function addIntegralByCloseProblem(datas,cb){
        var integral = datas;
        integralProxy.addIntegralByDelProblem(userId,integral,function(err,data){
//            var integralCount = data;
            if(err){
                cb(err,null);
            }else{
                cb(null,data);
            }
        });
    }
};
//某个用户下的问题进行中，关闭的条数
exports.getProblemStatusCount = function(req,res){
    var param = req.query
    var userId = param.userId;
    problemProxy.getProblemGoingCount(userId,function(err,goingCount){
       problemProxy.getProblemCloseCount(userId,function(err,closeCount){
           var data = {
               goingCount:goingCount,
               closeCount:closeCount
           }
           res.send(JSON.parse(tools.ResponseFormat(err,data)));
        })
    });

};
//搜索问题与标签
exports.getProblemAndLabel = function(req,res){
    var param = req.query ;
    var title = Iconv.decode(param.title,'UTF-8').toString();
    console.log(title);
    var toPage = param.toPage;
    var pageSize = param.pageSize;
    var sumCount;
    var conditions = {};
    conditions['pbTitle'] = new RegExp(title);
    conditions['status'] = 1;
    console.log(conditions);
    async.waterfall([getProblemByTitle,getAnswerCount],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //通过标题模糊搜索问题
    function getProblemByTitle(cb){
        problemProxy.getProblemByTitle(conditions,toPage,pageSize,function(err,data){
            problemProxy.getProblemByTitleCount(conditions,function(err,count){
                sumCount = count;
                var arrPb = new Array();
                for(var i = 0;i<data.length;i++){
                    arrPb[i] = {};
                    arrPb[i]['id'] = data[i]._id;
                    arrPb[i]['problemTitle'] = data[i].pbTitle;
                    arrPb[i]['problemContent'] = data[i].pbContent;
                    arrPb[i]['problemCreateTime'] = data[i].pbCreateTime;
                    arrPb[i]['problemAuthor'] = data[i].pbAuthor;
                    arrPb[i]['userId'] = data[i].pbUserId;
                    arrPb[i]['problemLabel'] = data[i].pbLabel;
                    arrPb[i]['problemStatus'] = data[i].pbStatus;
                    arrPb[i]['problemIntegral'] = data[i].pbIntegral;
                    arrPb[i]['problemEvaluate'] = data[i].pbEvaluate;
                    arrPb[i]['problemOpinion'] = data[i].pbOpinion;
                    arrPb[i]['answerDate'] = [];
                }
                cb(null,arrPb)
            })
        })
//        cb('',arrLb);
    }
    //查询问题的回答数
    function getAnswerCount(datas,cb){
        var arr = new Array();
        for(var i = 0;i<datas.length;i++){
            arr[i] = datas[i].id;
        }
        answerProxy.getAnswerByProblemId(arr,function(err,answerDate){
            var answerArr = new Array();
            for(var k =0;k<answerDate.length;k++){
                answerArr[k]={};
                answerArr[k]['problemId'] = answerDate[k].asProblemId;
                answerArr[k]['checkStatus'] = answerDate[k].asCheckStatus;
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
                }else{
                    datas[i]['answerCount'] = datas[i].answerDate.length;
                    delete datas[i].answerDate;
                    datas[i]['answerDate'] = [];
                }
            };
            var result = {};
            result.data = datas;
            result.counts = sumCount.transferpages(pageSize);
            result.sumCount = sumCount;
            cb(null,result);
        })
    }
};
//某个问题的详情
exports.getProblemDetails = function(req,res){
    var param = req.query;
    var problemId = param.problemId;
    problemProxy.getProblemByProblemId(problemId,function(err,data){
        var conditions = {
            asProblemId:problemId,
            status:1
        };
        answerProxy.getAnswerCountByProblemId(conditions,function(err,count){
            var pbArr = new Array();
            if(!data || data.length<=0){
                res.send({status:500,exception:"找不到该问题"});
            }else{
                pbArr[0] = {};
                pbArr[0]['id'] = data[0]._id;
                pbArr[0]['problemCreateTime'] = data[0].pbCreateTime;
                pbArr[0]['problemStatus'] = data[0].pbStatus;
                pbArr[0]['problemIntegral'] = data[0].pbIntegral;
                pbArr[0]['problemLabel'] = data[0].pbLabel;
                pbArr[0]['problemAuthor'] = data[0].pbAuthor;
                pbArr[0]['problemContent'] = data[0].pbContent;
                pbArr[0]['problemTitle'] = data[0].pbTitle;
                pbArr[0]['userId'] = data[0].pbUserId;
                pbArr[0]['problemEvaluate'] = data[0].pbEvaluate;
                pbArr[0]['problemOpinion'] = data[0].pbOpinion;
                pbArr[0]['answerDate'] = [];
                var result = {};
                result.data = pbArr;
                result.answerCount = count;
                res.send({status:200,record:result});
            }
        })
    });
/*    var toPage = param.toPage;
    var pageSize = param.pageSize;
    async.waterfall([getProblemDetailByProblemId,getAnswerByProblemId],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    })
    //获取问题详情
    function getProblemDetailByProblemId(cb){
        problemProxy.getProblemByProblemId(problemId,function(err,data){
            console.log(data);
            console.log(data[0].pbLabel);
            var pbArr = new Array();
            if(!data || data.length<=0){
                cb("找不到该问题，请核对！",null);
                return;
            }else{
                pbArr[0] = {};
                pbArr[0]['id'] = data[0]._id;
                pbArr[0]['problemCreateTime'] = data[0].pbCreateTime;
                pbArr[0]['problemStatus'] = data[0].pbStatus;
                pbArr[0]['problemIntegral'] = data[0].pbIntegral;
                pbArr[0]['problemLabel'] = data[0].pbLabel;
                pbArr[0]['problemAuthor'] = data[0].pbAuthor;
                pbArr[0]['problemContent'] = data[0].pbContent;
                pbArr[0]['problemTitle'] = data[0].pbTitle;
                pbArr[0]['userId'] = data[0].pbUserId;
                pbArr[0]['problemEvaluate'] = data[0].pbEvaluate;
                pbArr[0]['problemOpinion'] = data[0].pbOpinion;
                pbArr[0]['answerDate'] = [];
                cb(null,pbArr);
            }
            console.log(pbArr);
        });
    }
    //获取回答列表通过问题ID
    function getAnswerByProblemId(datas,cb){
        answerProxy.findAnswerByProblemId(problemId,toPage,pageSize,function(err,data){
            answerProxy.findAnswerCountByProblemId(problemId,function(err,count){
                console.log(data);
                for(var i=0;i<data.length;i++){
                    datas[0].answerDate[i] = {};
                    datas[0].answerDate[i]['id'] = data[i]._id;
                    datas[0].answerDate[i]['answerStatus'] = data[i].asAnswerStatus;
                    datas[0].answerDate[i]['answerCreateTime'] = data[i].asCreateTime;
                    datas[0].answerDate[i]['replyId'] = data[i].asReplyId;
                    datas[0].answerDate[i]['replyName'] = data[i].asReplyName;
                    datas[0].answerDate[i]['userId'] = data[i].asUserId;
                    datas[0].answerDate[i]['userName'] = data[i].asUserName;
                    datas[0].answerDate[i]['answerContent'] = data[i].asContent;
                }
                var result = {};
                result.data = datas;
                result.count = count.transferpages(pageSize);
                cb(null,result);
            })
        })
    }*/
};
//删除问题，通过ID
exports.deleteProblemById = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var integral,userId,problemStatus;
    async.waterfall([getProblemById,deleteProblemById,addIntegralByDeleteProblem],function(error,result){
//        res.send(JSON.parse(tools.ResponseFormat(error,result)));
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    });
    //获取问题
    function getProblemById(cb){
        problemProxy.getProblemByProblemId(problemId,function(err,data){
            if(!data || data.length<=0){
                cb('找不到该问题，请核对！',null);
                return;
            }else{
                integral = data[0].pbIntegral;
                userId = data[0].pbUserId;
                problemStatus = data[0].pbStatus;
                cb(null,null);
            }
        });
    };
    //删除问题
    function deleteProblemById(datas,cb){
        problemProxy.deleteProblemById(problemId,function(err,data){
            if(err){
                cb(err,null);
                return;
            }else{
                cb(null,null);
            }
        });
    };
    function addIntegralByDeleteProblem(datas,cb){
        if(problemStatus !=1){
            integralProxy.addIntegralByDelProblem(userId,integral,function(err,data){
                if(err){
                    cb(err,null);
                }else{
                    cb(null,'success');
                }
            })
        }else{
            cb(null,'success');
        }
    }
}
/*//删除问题
exports.deleteProblem = function(req,res){
    var param = req.body;
    var problemId = param.problemId;
    var userId;
    var problemIntegral;
    async.waterfall([getProblemByProblemId,getAnswerCountByProblemId,delProblem,addIntegralByDelProblem],function(error,result){
        res.send(JSON.parse(tools.ResponseFormat(error, result)));
    })
    //判断该问题是否存在！
    function getProblemByProblemId(cb){
        problemProxy.getProblemByProblemId(problemId,function(err,data){
            if (!data.length || data.length <= 0) {
                cb("没有找到该问题，请核对！", null);
                return;
            } else {
                if(data[0].pbUserId == param.userId){
                    problemIntegral = data[0].pbIntegral;
                    userId = data[0].pbUserId
                    cb(null, null);
                }else{
                    cb('您没有权限删除这个问题',null);
                    return;
                }
            }
        })
    }
    //判断该问题是否有回答。
    function getAnswerCountByProblemId(datas,cb){
        //这里有做修改
        answerProxy.getAnswerCountByProblemId(problemId,function(err,data){
            if (!data.length || data.length <= 0) {
                cb(null, null);
            } else {
                cb("该问题已有回答，不能删除该问题！", null);
                return;
            }
        })
    };
    //删除问题
    function delProblem(datas,cb){
        problemProxy.deleteProblem(problemId,function(err,data){
            if(err){
                cb(err,null);
            } else{
                cb(null,"问题删除成功！");
            }
        });
    }
    //删除问题之后，把积分还回去。
    function addIntegralByDelProblem(datas,cb){
        integralProxy.addIntegralByDelProblem(userId,problemIntegral,function(err,data){
            if(err){
                cb(err,null);
            }else{
                cb(null,"问题删除成功！");
            }
        });
    }
};*/
