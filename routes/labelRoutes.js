var express = require('express');
var router = express.Router();
var labelController =require('../controller/labelController');

//标签的查询
router.get('/getLabelList',labelController.getLabelList)
//增加标签
router.post('/insertLabel',labelController.insertLabel);
//修改
router.post('/updateLabel',labelController.updateLabel);
//删除标签
router.get('/deleteLabel',labelController.deleteLabel);

module.exports = router;
