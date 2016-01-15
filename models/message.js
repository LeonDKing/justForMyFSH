/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var messageEntity = new Schema({
    ID:{type:ObjectId},                 //ID（主键）
//    msgTitle:{type:String},       //消息的标题
    msgContent:{type:String},     //消息的内容
    msgCreateTime:{type:Number},      //这条数据的创建时间
    msgUpdateTime:{type:Number},        //这条数据的修改时间
    msgUserId:{type:String},
    msgFile1:{type:String},      //预留字段
    msgFile2:{type:String},      //预留字段
    status:{type:Number}             //这条数据的状态  0:假删 1:存在
});

mongoose.model('message',messageEntity);