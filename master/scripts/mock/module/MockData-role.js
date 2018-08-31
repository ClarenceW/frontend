'use strict';

(function () {

    var rolePaginationGet = /^http:\/\/122.224.191.2:2081\/tcfbcq-frontend-inf\/role\/pagination/;
    var rolePost = /^http:\/\/122.224.191.2:2081\/tcfbcq-frontend-inf\/role/;
    var roleDelete = /^http:\/\/122.224.191.2:2081\/tcfbcq-frontend-inf\/role/;
    var rolePut = /^http:\/\/122.224.191.2:2081\/tcfbcq-frontend-inf\/role/;
    var roleDetailGet = /^http:\/\/122.224.191.2:2081\/tcfbcq-frontend-inf\/role\/detail/;
    var aaData = [
        {
            "rolecode": "ADDRESS_TYPE",
            "rolename": "企业管理员",
            "createuser": "admin",
            "memo": "测试.",
            "cratetime": "2016-06-24 14:17:47"
        },
        {
            "rolecode": "ADDRESS_TYPE2",
            "rolename": "企业管理员2",
            "createuser": "admin",
            "memo": "测试我问问.",
            "cratetime": "2016-06-24 14:17:47"
        }
    ];

    Mock.mock(rolePaginationGet, 'get', function (options) {
        var rolename = MockUtil.fromUrl(options.url, "rolename");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            console.log("=================")
            if (rolename) {
                if (element.rolename.indexOf(rolename) != -1) {
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

    Mock.mock(rolePost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(roleDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].rolename == reqData.rolename && aaData[index].rolecode == reqData.rolecode) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });

    Mock.mock(rolePut, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        for (var index in aaData) {
            if (aaData[index].rolename == reqData.rolename && aaData[index].rolecode == reqData.rolecode) {
                aaData[index] = reqData;
            }
        }
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });

    Mock.mock(roleDetailGet, 'get', function (options) {
        var roleName = MockUtil.fromUrl(options.url, "rolename");
        var roleCode = MockUtil.fromUrl(options.url, "rolecode");
        var data;
        for (var index in aaData) {
            if (aaData[index].rolename == rolename && aaData[index].rolecode == rolecode) {
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