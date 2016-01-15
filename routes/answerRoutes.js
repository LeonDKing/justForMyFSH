/**
 * Created by fzr on 2015/12/15.
 */
var express = require('express');
var router = express.Router();
var answerController = require('../controller/answerController');

//插入一条回答
router.post('/insertAnswer',answerController.insertAnswer);
//回答表的列表查询
router.post('/getAnswerList',answerController.getAnswerList);
//修改回答
router.post('/updateAnswer',answerController.updateAnswer);
//删除回答
router.post('/deleteAnswer',answerController.deleteAnswer);
/*//改变回答的查看状态
router.post('/updateAnswerLabel',answerController.updateAnswerLabel);*/
//查询我的回答
router.post('/getMyAnswerList',answerController.getMyAnswerList);
router.get('/getMyAnswerListGet',answerController.getMyAnswerListGet);

module.exports = router;
