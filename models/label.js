/**
 * Created by fzr on 2015/12/24.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var labelEntity = new Schema({
    id:{type:ObjectId},                //ID（主键）
    lbLabelTitle:{type:String},         //标签名
    lbCreateTime:{type:Number},      //这条数据的创建时间
    lbUpdateTime:{type:Number},        //这条数据的修改时间
    status:{type:Number}             //这条数据的状态  0:假删 1:存在
});

mongoose.model('label',labelEntity);