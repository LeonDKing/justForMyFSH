/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var integralEntity = new Schema({
    ID:{type:ObjectId},                //ID（主键）
//    igUserCode:{type:String},  //用户编号
    igIntegral:{type:Number},  //用户积分
    igCreateTime:{type:Number},      //这条数据的创建时间
    igUpdateTime:{type:Number},        //这条数据的修改时间
    igFile1:{type:String},      //预留字段
    igFile2:{type:String},      //预留字段
    status:{type:Number},             //这条数据的状态  0:假删 1:存在
    igUserId:{type:String}      //唯一标识。
});

mongoose.model('integral',integralEntity);