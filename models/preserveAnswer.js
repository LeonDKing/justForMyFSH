/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var preserveAnswerEntity = new Schema({
    Id:{type:ObjectId},                //问题ID（主键）
    psProblemId:{type:String},      //问题id
    psUserId:{type:String},         //回答者的Id
    psCreateTime:{type:Number},     //创建时间
    psUpdateTime:{type:Number},     //修改时间
    status:{type:Number,default:1}  //数据状态  0:假删 1:存在
});

mongoose.model('preserveAnswer',preserveAnswerEntity);