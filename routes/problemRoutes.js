/**
 * Created by fzr on 2015/10/29.
 */

var express = require('express');
var router = express.Router();
var problemController =require('../controller/problemController');

//问题列表查询
router.post('/getProblemList',problemController.getProblemList);
//问题增加
router.post('/insertProblem',problemController.insertProblem);
//问题修改
router.post('/updateProblem',problemController.updateProblem);
//问题删除
router.post('/deleteProblem',problemController.deleteProblemById);
//改变问题的状态(采纳)
router.post('/updateProblemStatus',problemController.updateProblemStatus);
//关闭问题
router.post('/closeProblem',problemController.closeProblem);
//获取某个用户的问题状态条数
router.get('/getProblemStatusCount',problemController.getProblemStatusCount);
//搜索问题
router.get('/getProblemAndLabel',problemController.getProblemAndLabel);
//某个问题的详情
router.get('/getProblemDetails',problemController.getProblemDetails);

module.exports = router;