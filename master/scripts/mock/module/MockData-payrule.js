'use strict';

(function () {

    var paginationGetUrl = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/payrule\/pagination/;
    var detailGetUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/payrule\/detail/;
    var postUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/payrule/;
    var deleteUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/payrule/;
    var putUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/payrule/;

    var aaData = [
        {
            "code": "000001",
            "name": "重庆收费标准",
            "areaType": "1",
            "freeTime": "30",
            "hourRate": "5",
            "limit": "20",
            "startTime": "09:00",
            "endTime": "17:00",
            "operation": "admin",
            "systime": "2016-07-13 20:55",
        }, {
            "code": "000002",
            "name": "重庆收费标准2",
            "areaType": "2",
            "freeTime": "30",
            "hourRate": "5",
            "limit": "20",
            "startTime": "09:00",
            "endTime": "17:00",
            "operation": "admin",
            "systime": "2016-07-13 20:55",
        }, {
            "code": "000003",
            "name": "重庆收费标准3",
            "areaType": "3",
            "freeTime": "30",
            "hourRate": "5",
            "limit": "20",
            "startTime": "09:00",
            "endTime": "17:00",
            "operation": "admin",
            "systime": "2016-07-13 20:55",
        }];

    Mock.mock(paginationGetUrl, 'get', function (options) {
        var name = MockUtil.fromUrl(options.url, "name");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (name) {
                if (element.name.indexOf(name) != -1) {
                    array.push(element);
                }
            } else {
                array.push(element);
            }
        })
        return {
            "iTotalRecords": array.length,
            "iTotalDisplayRecords": array.length,
            "aaData": array.length > length ? array.slice(start, start + length) : array
        }
    });

    Mock.mock(detailGetUrl, 'get', function (options) {
        var code = MockUtil.fromUrl(options.url, "code");
        var data;
        for (var index in aaData) {
            if (aaData[index].code == code) {
                data = aaData[index];
                break;
            }
        }
        return {
            "code": "000000",
            "msg": "Detail Mock Success",
            "data": data
        }
    });

    Mock.mock(postUrl, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(deleteUrl, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].code == reqData.code) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });

    Mock.mock(putUrl, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        for (var index in aaData) {
            if (aaData[index].code == reqData.code) {
                aaData[index] = reqData;
            }
        }
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });


})();