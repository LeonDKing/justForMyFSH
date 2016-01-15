/**
 * Created by rzz on 2015/8/12.
 */
var jwt = require('jsonwebtoken');
//var Dao = require('../dao');
//var userDao = new Dao.UserDao();
var constants = require('../config');

function checkToken(req, res) {
    var userInfo;
    try {
        userInfo = jwt.verify(req.headers.token, constants.tokenSecret);
    } catch (err) {
        return { 'message': err.message};
    }

    var current = new Date().getTime();
    if (current - userInfo.iat < constants.sesstionEXT && userInfo.id) {
        //if (userInfo.ip == 'mobile' || userInfo.ip == req._remoteAddress) {
            if (current - userInfo.iat > constants.sesstionEXT / 2) {
                userInfo.iat = current;
                req.token = jwt.sign(userInfo, constants.tokenSecret);
            }

            return userInfo;
        //}
    }
    return false;
}

exports.verifyRole = function (req, res, next) {
    console.log(3333333);
    console.log(req._parsedUrl.pathname);
    console.log(4444444);
    if (req._parsedUrl.pathname == '/users/userLogin' || req._parsedUrl.pathname == '/order/jinshuju'
        || req._parsedUrl.pathname == '/order/exportExcel' || req._parsedUrl.pathname == '/user/updatePassword') {
        return next();
    }

    if (req._remoteAddress == constants.OAHIP) {
        req._remoteAddress = req.headers._remoteaddress;
    }
    var userInfo = checkToken(req, res);
    if (userInfo.id) {
        req.session = {};
        req.session.userInfo = {userID: userInfo.id, userName: userInfo.un};

        var funName = req._parsedUrl.pathname;
        var arr = funName.split('/');
        funName = arr[arr.length - 1];

        userDao.checkRolePermission(userInfo.id, funName).then(function (count) {
            if (count > 0) {
                next();
            } else {
                res.send({status: 500, 'exception': '权限不足！'});
            }
        }, function (err) {
            res.send({status: 500, 'exception': err});
        });
    } else {
        res.send({status: 401, 'message': userInfo.message});
    }

}

