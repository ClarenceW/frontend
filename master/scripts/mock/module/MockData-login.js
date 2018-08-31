'use strict';

(function () {

    var login = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/login/;
    var logout = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/logout/
    var data = {
        "userName": "admin", // 用户名
        "sid": "C1153F3C78819DE6B7D9F6E626F18B51",// sessionId
        "systime": "2016-06-24 14:17:47" // 登录时间
    }

    Mock.mock(login, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        var res = {}
        if (reqData.userName == "") {
            res.code = "100001";
            res.msg = "用户名不能为空";
            res.data = {};
        } else if (reqData.userName != "admin") {
            res.code = "100002";
            res.msg = "用户名不存在";
            res.data = {};
        } else if (reqData.password == "") {
            res.code = "100003";
            res.msg = "密码不能为空";
            res.data = {};
        } else if (reqData.password != "123456") {
            res.code = "100004";
            res.msg = "不告诉你密码^.^";
            res.data = {};
        } else {
            res.code = "000000";
            res.msg = "登录成功";
            res.data = data;
        }
        return res;
    });

    Mock.mock(logout, 'post', function (options) {
        var res = {}
        res.code = "000000";
        res.msg = "退出成功";
        res.data = 1;
        return res;
    });

})();