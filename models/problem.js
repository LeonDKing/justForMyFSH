/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var problemEntity = new Schema({
    ID:{type:ObjectId},                //问题ID（主键）
    pbTitle:{type:String},      //问题标题
    pbContent:{type:String},    //问题内容
    pbAuthor:{type:String},     //问题提问人
    pbLabel:{type:Array},       //问题标签
    pbStatus:{type:Number},     //问题状态    0:未解决   1:已解决   2:已关闭
    pbIntegral:{type:Number},    //问题的悬赏积分
    pbCreateTime:{type:Number},      //问题创建时间
    pbUpdateTime:{type:Number},        //问题修改时间
    pbEvaluate:{type:Number,default:0},//问题的评价
    pbOpinion:{type:String,default:''},//问题的建议
    pbUserId:{type:String},      //用户编号
    pbFile2:{type:String},      //预留字段
    status:{type:Number}             //问题状态  0:假删 1:存在
});

mongoose.model('problem',problemEntity);