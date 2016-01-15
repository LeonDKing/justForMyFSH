var mongoose = require('mongoose');
var config = require('../config');


mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
    }
});
mongoose.connection.on('error', function (err) {
    console.log(err);
});


require('./userEntity');
require('./problem');
require('./answer');
require('./integral');
require('./message');
require('./feedback');
require('./label');
require('./preserveAnswer');
//require('./files');

exports.userEntity = mongoose.model('userEntity');
exports.problem = mongoose.model('problem');
exports.answer = mongoose.model('answer');
exports.integral = mongoose.model('integral');
exports.message = mongoose.model('message');
exports.feedback = mongoose.model('feedback');
exports.label = mongoose.model('label');
exports.preserveAnswer = mongoose.model('preserveAnswer');
//exports.files = mongoose.model('files');
