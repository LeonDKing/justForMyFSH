/**
 * Created by dell on 2015/6/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userEntity = new Schema({
    Id:{type:ObjectId},         //ID
    uUserPhone:{type:String},     //用户电话
    uUserName:{type:String},     //用户名称
    uPassword:{type:String},     //用户密码
    uUserEmail:{type:String},   //用户邮箱
    uCreateTime:{type:Number},      //创建时间
    uUpdateTime:{type:Number},        //修改时间
    uRelativePath:{type:String,default:1},     //用户图片
    status:{type:Number,default:1}             //用户状态  0:假删 1:存在
});

mongoose.model('userEntity', userEntity);