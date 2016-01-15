/**
 * Created by fzr on 2015/12/15.
 */
var express = require('express');
var router = express.Router();
var integralController = require('../controller/integralController');

//积分查询
router.get('/getIntegralList',integralController.getIntegralList);
//积分新增
router.post('/insertIntegral',integralController.insertIntegral);
module.exports = router;


