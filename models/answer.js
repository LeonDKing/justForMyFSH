/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var answerEntity = new Schema({
    ID:{type:ObjectId},                //回答的ID（主键）
    asProblemId:{type:String},         //问题的ID
    asContent:{type:String},           //回答的内容
    asUserName:{type:String},          //回答者的名称
    asUserId:{type:String},            //回答者Id
    asAnswerStatus:{type:Number},     //问题回答的采纳状态    0:未采纳  1:已采纳
    asReplyName:{type:String},        //回答下的回复人名称
    asReplyId:{type:String},          //回答下的回复人Id
    asCreateTime:{type:Number},       //回答的创建时间
    asUpdateTime:{type:Number},       //回答的修改时间
    asCheckStatus:{type:Number},      //回答的查看状态       0：未查看  1：已查看
    asFile1:{type:String},             //预留字段
    asFile2:{type:String},             //预留字段
    status:{type:Number}               //这条数据的状态  0:假删 1:存在
});

mongoose.model('answer',answerEntity);