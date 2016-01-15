/**
 * Created by fzr on 2015/12/24.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var replyEntity = new Schema({
    id:{type:ObjectId},                //ID（主键）
    rpAnswerId:{type:String},           //回答的Id
    rpUserId:{type:String},             //回复人的Id
    rpUserName:{type:String},           //回复人的名称
    rpCreateTime:{type:Number},        //这条数据的创建时间
    rpUpdateTime:{type:Number},        //这条数据的修改时间
    status:{type:Number}             //这条数据的状态  0:假删 1:存在
});

mongoose.model('reply',replyEntity);