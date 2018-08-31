'use strict';

(function () {
    var parklotsLedPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsLed\/pagination/;
    var ledTreeGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsLed\/ledTree/;
    var parklotsTreeGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsLed\/parklotsTree/;
    var parklotsLedPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsLed/;
    var parklotsLedDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsLed/;

    var aaData = [
        {
            "ledCode": "00112201",
            "ledName": "诱导屏01",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场",
            "systime": '2016-07-18 10:25:20'
        }, {
            "ledCode": "00112202",
            "ledName": "诱导屏02",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场",
            "systime": '2016-07-18 10:25:20'
        }, {
            "ledCode": "00112203",
            "ledName": "诱导屏03",
            "parklotsCode": "00101001",
            "parklotsName": "爱华龙都停车场",
            "systime": '2016-07-18 10:25:20'
        }];
    var ledTreeData = [{
        "id": "00112210",
        "text": "诱导屏10",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00112211",
        "text": "诱导屏11",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00112212",
        "text": "诱导屏12",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00112213",
        "text": "诱导屏13",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }
    ];
    var parklotsTreeData = [{
        "id": "00101010",
        "text": "停车场10",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00101011",
        "text": "停车场11",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00101012",
        "text": "停车场12",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }, {
        "id": "00101013",
        "text": "停车场13",
        "icon": null,
        "state": {"opened": false, "selected": false},
        "children": null
    }
    ];

    Mock.mock(parklotsLedPaginationGet, 'get', function (options) {
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

    Mock.mock(ledTreeGet, 'get', function (options) {
        var array = [];
        ledTreeData.forEach(function (element) {
            array.push(element);
        });
        return array;
    });
    Mock.mock(parklotsTreeGet, 'get', function (options) {
        var array = [];
        parklotsTreeData.forEach(function (element) {
            array.push(element);
        });
        return array;
    });

    //新增停车场诱导屏关系数据
    Mock.mock(parklotsLedPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        //aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    //删除停车场诱导屏关系数据
    Mock.mock(parklotsLedDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].ledCode == reqData.ledCode && aaData[index].parklotsCode == reqData.parklotsCode) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Parklots Led Success",
            "data": 1
        }
    });
}());