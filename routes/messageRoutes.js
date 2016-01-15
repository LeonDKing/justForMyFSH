/**
 * Created by fzr on 2015/12/15.
 */
var express = require('express');
var router = express.Router();
var messageController = require('../controller/messageController');

//信息查询
router.get('/getMessageList',messageController.getMessageList);
/*//信息插入
router.post('/insertMessage',messageController.insertMessage);*/
module.exports = router;
