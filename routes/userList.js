/**
 * Created by fzr on 2015/11/19.
 */
//
var express = require('express');
var router = express.Router();
var userController =require('../controller/userController');

//获取用户列表
router.post('/getUserList',userController.getUserList);
module.exports = router;