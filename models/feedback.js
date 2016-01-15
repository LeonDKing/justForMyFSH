/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var feedbackEntity = new Schema({
    ID:{type:ObjectId},                 //ID（主键）
    fbTitle:{type:String},       //反馈的标题
    fbContent:{type:String},     //反馈的内容
    fbAuthor:{type:String},      //反馈者
    fbCreateTime:{type:Number},   //这条数据的创建时间
    fbUpdateTime:{type:Date,default:Date.now},        //这条数据的修改时间
    fbUserId:{type:String},     //用户编号
    fbFile1:{type:String},      //预留字段
    fbFile2:{type:String},      //预留字段
    status:{type:Number}             //这条数据的状态  0:假删 1:存在
});

mongoose.model('feedback',feedbackEntity);