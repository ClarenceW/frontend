'use strict';

(function () {

    var dictPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dict\/pagination/;
    var dictPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dict/;
    var dictDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dict/;
    var dictPut = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dict/;
    var dictDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dict\/detail/;
    var aaData = [
        {
            "lookupName": "ADDRESS_TYPE",
            "lookupKey": "2",
            "lookupValue": "城市",
            "description": "Our vicar is always raising money for one cause or another,but he has never managed to get enough money to have the church clock repaired.",
            "systime": "2016-06-24 14:17:47"
        },
        {
            "lookupName": "dfdf",
            "lookupKey": "dfdf",
            "lookupValue": "dd",
            "description": "The big clock whitch used to strike the hours day and night was damaged many years ago and has been silent ever since.",
            "systime": "2016-06-24 13:14:52"
        },
        {
            "lookupName": "were",
            "lookupKey": "were",
            "lookupValue": "af",
            "description": "One night ,however,our vicar woke up with up with a start the clock was striking the hours ! Looking at this watch,he saw that it was one o'clock,but the bell struck thirteen times before it stopped.",
            "systime": "2016-06-24 13:14:27"
        },
        {
            "lookupName": "ADDRESS_TYPE",
            "lookupKey": "0",
            "lookupValue": "省份 11",
            "description": "Armed with a torch ,the vicar went up into the clock tower to see what was going on.",
            "systime": "2016-06-24 13:12:55"
        },
        {
            "lookupName": "ADDRESS_TYPE",
            "lookupKey": "1",
            "lookupValue": "城市",
            "description": "In the torchlight ,he caught sight of a figure whom he immediately recognized as Bil Wilkins,our local grocer .",
            "systime": "2016-06-24 13:12:18"
        },
        {
            "lookupName": "ADDRESS_TYPE",
            "lookupKey": "0",
            "lookupValue": "省份 11",
            "description": " 'Whatever are you doing up here Bill?'asked the vicar in surprise. ",
            "systime": "2016-06-24 13:12:55"
        }
    ];

    Mock.mock(dictPaginationGet, 'get', function (options) {
        var lookupName = MockUtil.fromUrl(options.url, "lookupName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (lookupName) {
                if (element.lookupName.indexOf(lookupName) != -1) {
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

    Mock.mock(dictPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(dictDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].lookupName == reqData.lookupName && aaData[index].lookupKey == reqData.lookupKey) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });

    Mock.mock(dictPut, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        for (var index in aaData) {
            if (aaData[index].lookupName == reqData.lookupName && aaData[index].lookupKey == reqData.lookupKey) {
                aaData[index] = reqData;
            }
        }
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });

    Mock.mock(dictDetailGet, 'get', function (options) {
        var lookupName = MockUtil.fromUrl(options.url, "lookupName");
        var lookupKey = MockUtil.fromUrl(options.url, "lookupKey");
        var data;
        for (var index in aaData) {
            if (aaData[index].lookupName == lookupName && aaData[index].lookupKey == lookupKey) {
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