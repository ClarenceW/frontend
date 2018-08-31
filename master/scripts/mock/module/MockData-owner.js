'use strict';

(function () {

    var ownerPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/owner\/pagination/;
    var ownerPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/owner/;
    var ownerDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/owner/;
    var ownerPut = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/owner/;
    var ownerDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/owner\/detail/;
    var aaData = [
        {
            "code": "000001",
            "name": "爱华龙都",
            "address": "渝中区大坪1号长江二路86号",
            "owner": "小梁",
            "tel": "15267054464",
            "unitType": "0",
            "repairName": "银江股份有限公司",
            "repairTel": "15267054464",
            "systime": "2016-05-26 15:12:41"
        }, {
            "code": "000002",
            "name": "八一广场",
            "address": "渝中区中山二路174号",
            "owner": "梁工",
            "tel": "15267054464",
            "unitType": "0",
            "repairName": "银江股份有限公司",
            "repairTel": "15267054464",
            "systime": "2016-05-26 15:12:43"
        }, {
            "code": "000003",
            "name": "八一广场",
            "address": "渝中区中山二路174号",
            "owner": "梁工",
            "tel": "15267054464",
            "unitType": "0",
            "repairName": "银江股份有限公司",
            "repairTel": "15267054464",
            "systime": "2016-05-26 15:12:43"
        }]

    Mock.mock(ownerPaginationGet, 'get', function (options) {
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

    Mock.mock(ownerPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(ownerDelete, 'delete', function (options) {
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

    Mock.mock(ownerPut, 'put', function (options) {
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

    Mock.mock(ownerDetailGet, 'get', function (options) {
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

})();