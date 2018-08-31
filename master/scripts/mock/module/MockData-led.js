'use strict';

(function () {

    var ledPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/led\/pagination/;
    var ledPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/led/;
    var ledDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/led/;
    var ledPut = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/led/;
    var ledDetailGet = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/led\/detail/;
    var ledBaseCtrlSet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/ctrlLed\/basectrl\/set/;
    var ledBaseCtrlReset = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/ctrlLed\/ctrl\/reset/;
    var ledCtrlNumSetPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/ctrlLed\/numled\/set/;
    var ledCtrlWordSetPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/ctrlLed\/wordled\/set/;
    var allLedsGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/ctrlLed\/led\/all/;

    var aaData = [
        {
            "ledCode": "00112201",
            "ledName": "诱导屏01",
            "ledShortname": "诱导屏01",
            "ledDescription": "测试诱导屏",
            "ledManufactor": "优橙科技",
            "ledRepairunit": "优橙科技",
            "ledRepairtel": "58863996",
            "ledLocation": "余杭区文一西路1001号",
            "ledVersion": "V1.0.0",
            "ledIp": "192.168.107.2",
            "ledPort": "7001",
            "ledCoor": "120.325689,30.145278",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场"
        }, {
            "ledCode": "00112202",
            "ledName": "诱导屏02",
            "ledShortname": "诱导屏02",
            "ledDescription": "测试诱导屏",
            "ledManufactor": "优橙科技",
            "ledRepairunit": "优橙科技",
            "ledRepairtel": "58863996",
            "ledLocation": "余杭区文一西路1001号",
            "ledVersion": "V1.0.0",
            "ledIp": "192.168.107.3",
            "ledPort": "7001",
            "ledCoor": "120.325689,30.145278",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场"
        }, {
            "ledCode": "00112203",
            "ledName": "诱导屏03",
            "ledShortname": "诱导屏03",
            "ledDescription": "测试诱导屏",
            "ledManufactor": "优橙科技",
            "ledRepairunit": "优橙科技",
            "ledRepairtel": "58863996",
            "ledLocation": "余杭区文一西路1001号",
            "ledVersion": "V1.0.0",
            "ledIp": "192.168.107.4",
            "ledPort": "7001",
            "ledCoor": "120.325689,30.145278",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场"
        }];

    Mock.mock(ledPaginationGet, 'get', function (options) {
        var title = MockUtil.fromUrl(options.url, "title");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (title) {
                if (element.title.indexOf(title) != -1) {
                    array.push(element);
                }
            } else {
                array.push(element);
            }
        });
        return {
            "iTotalRecords": array.length,
            "iTotalDisplayRecords": array.length,
            "aaData": array.length > length ? array.slice(start, start + length) : array
        }
    });

    Mock.mock(ledDetailGet, 'get', function (options) {
        var ledCode = MockUtil.fromUrl(options.url, "ledCode");
        var data;
        for (var index in aaData) {
            if (aaData[index].ledCode == ledCode) {
                data = aaData[index];
            }
        }
        return {
            "code": "000000",
            "msg": "Detail Mock Success",
            "data": data
        }
    });

    //添加诱导屏接口
    Mock.mock(ledPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.parklotsCode = "00101001";
        reqData.parklotsName = "爱华龙都停车场";
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    //删除诱导屏数据
    Mock.mock(ledDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].ledCode == reqData.ledCode) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });

    //修改诱导屏
    Mock.mock(ledPut, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.parklotsCode = "00101001";
        reqData.parklotsName = "爱华龙都停车场";
        for (var index in aaData) {
            if (aaData[index].ledCode == reqData.ledCode) {
                aaData[index] = reqData;
            }
        }
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });

    //所有诱导屏数据
    Mock.mock(allLedsGet, 'get', function (options) {
        var array = [];
        aaData.forEach(function (element) {
            array.push(element);
        })
        return {
            "code": "000000",
            "msg": "GET Mock Success",
            "data": array
        }
    });

    //诱导屏发布-数字设置
    Mock.mock(ledCtrlNumSetPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        console.debug("POST led num set:");
        console.debug(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });
    //诱导屏发布-文字设置
    Mock.mock(ledCtrlWordSetPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        console.debug("POST led word set:");
        console.debug(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });
    //诱导屏参数设置-初始设置
    Mock.mock(ledBaseCtrlSet, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        console.debug("POST led base ctrl set:");
        console.debug(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });
    //诱导屏参数设置-重置参数
    Mock.mock(ledBaseCtrlReset, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        console.debug("POST led base ctrl reset:");
        console.debug(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });
})();