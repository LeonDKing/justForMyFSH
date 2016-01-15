/**
 * Created by fzr on 2015/10/29.
 */

var express = require('express');
var router = express.Router();
var userController =require('../controller/userController');

//用户登录
router.post('/userLogin', userController.userLogin);
//用户注册
router.post('/insertUser',userController.insertUser);
//修改用户密码
router.post('/updateUserPwd',userController.updateUserPwd);
//修改信息
router.post('/updateUserInfo',userController.updateUserInfo);
//获取用户列表
router.get('/getUserList',userController.getUserList);

/*//用户退出
router.post('/loginOut',userController.userLoginOut);

//获取用户列表。
router.post('/getUserList',userController.getUserList);*/
module.exports = router;