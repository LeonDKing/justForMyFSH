var express = require('express');
var router = express.Router();
var feedbackController = require('../controller/feedbackController');

//反馈信息新增
router.post('/insertFeedback',feedbackController.insertFeedback);
//反馈信息列表查询
router.post('/getFeedbackList',feedbackController.getFeedbackList);


/*//反馈信息内容查询
router.get('/getFeedbackContent',feedbackController.getFeedbackContent);*/

module.exports = router;

