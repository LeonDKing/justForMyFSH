/**
 * config
 */

//var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    db: 'mongodb://127.0.0.1/TWSTH',//测试库的fzr
    db_name: 'test',
    port: 3000
};

module.exports = config;
