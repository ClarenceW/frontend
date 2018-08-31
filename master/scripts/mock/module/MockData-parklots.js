'use strict';

(function () {

    var parklotsPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots\/pagination/;
    var parklotsDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots\/detail/;
    var optionGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots\/option/;
    var parklotsPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots/;
    var parklotsDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots/;
    var parklotsPut = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklots/;
    var parklotsStatusPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsStatus\/pagination/;
    var parklotsStatusToggleCtrlWorkPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/parklotsStatus\/toggleCtrlWork/;

    var aaData = [
        {
            "parklotsCode": "33",
            "parklotsName": "沧白路停车库",
            "parklotsAddress": "沧白路75-1号，顺风123对面-重庆永旺提供",
            "parklotsCoor": "106.587595,29.567954",
            "parklotsNum": 105,
            "districtCode": "500103",
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }, {
            "parklotsCode": "34",
            "parklotsName": "渝海七星停车库",
            "parklotsAddress": "民生路318号，渝海七星家具城楼下！",
            "parklotsCoor": "106.575562,29.563626",
            "parklotsNum": 300,
            "districtCode": 500103,
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }, {
            "parklotsCode": "35",
            "parklotsName": "得意世界停车场",
            "parklotsAddress": "较场口88号负二楼，共2个进出口，分别在702和429车站斜对面！",
            "parklotsCoor": "106.581307,29.5588",
            "parklotsNum": 600,
            "districtCode": 500103,
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }, {
            "parklotsCode": "36",
            "parklotsName": "女人广场停车场",
            "parklotsAddress": "大同路12号,402车站旁边",
            "parklotsCoor": "106.579353,29.563595",
            "parklotsNum": 229,
            "districtCode": "500103",
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }, {
            "parklotsCode": "38",
            "parklotsName": "时代广场停车场",
            "parklotsAddress": "美美时代广场,青年路1号！轻轨2号线临江门站",
            "parklotsCoor": "106.583809,29.564789",
            "parklotsNum": 260,
            "districtCode": 500103,
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }, {
            "parklotsCode": "39",
            "parklotsName": "地王广场停车场",
            "parklotsAddress": "民族路168号,江家巷王府井商场楼下！",
            "parklotsCoor": "106.581307,29.5588",
            "parklotsNum": 486,
            "districtCode": 500103,
            "payruleCode": "000001",
            "ownerCode": "000003",
            "systime": "2016-06-17 17:57:04"
        }];

    var statusData = [
        {
            "parklotsCode": "33",
            "parklotsName": "沧白路停车库",
            "parklotsNum": 105,
            "ctrlWork": "0"
        }, {
            "parklotsCode": "34",
            "parklotsName": "渝海七星停车库",
            "parklotsNum": 600,
            "ctrlWork": "1"
        }, {
            "parklotsCode": "35",
            "parklotsName": "得意世界停车场",
            "parklotsNum": 299,
            "ctrlWork": "0"
        }, {
            "parklotsCode": "36",
            "parklotsName": "女人广场停车场",
            "parklotsNum": 229,
            "ctrlWork": "1"
        }, {
            "parklotsCode": "38",
            "parklotsName": "时代广场停车场",
            "parklotsNum": 260,
            "ctrlWork": "1"
        }, {
            "parklotsCode": "39",
            "parklotsName": "地王广场停车场",
            "parklotsNum": 486,
            "ctrlWork": "1"
        }, {
            "parklotsCode": "40",
            "parklotsName": "合景聚融停车场",
            "parklotsNum": 100,
            "ctrlWork": "1"
        }];

    var optionData = [
        {
            "code": "01",
            "name": "八一广场停车场"
        }, {
            "code": "88",
            "name": "雨田大厦停车库"
        }, {
            "code": "89",
            "name": "大都会广场停车库"
        }, {
            "code": "23",
            "name": "测试停车场"
        }, {
            "code": "66",
            "name": "测试停车场2"
        }]

    Mock.mock(parklotsPaginationGet, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (parklotsName) {
                if (element.parklotsName.indexOf(parklotsName) != -1) {
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

    Mock.mock(parklotsDetailGet, 'get', function (options) {
        var parklotsCode = MockUtil.fromUrl(options.url, "parklotsCode");
        var data;
        for (var index in aaData) {
            if (aaData[index].parklotsCode == parklotsCode) {
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

    Mock.mock(parklotsStatusPaginationGet, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        statusData.forEach(function (element) {
            if (parklotsName) {
                if (element.parklotsName.indexOf(parklotsName) != -1) {
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

    Mock.mock(parklotsStatusToggleCtrlWorkPost, 'post', function (options) {
        //var reqData = MockUtil.fromJson(options.body);
        //reqData.systime = new Date().format();
        //aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    //Mock.mock(parklotsGet, 'get', function (options) {
    //    var array = [];
    //    aaData.forEach(function (element) {
    //        array.push({"parklotsCode": element.parklotsCode, "parklotsName": element.parklotsName});
    //    });
    //    return array;
    //});

    Mock.mock(parklotsPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(parklotsDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].parklotsCode == reqData.parklotsCode) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });

    Mock.mock(parklotsPut, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.systime = new Date().format();
        for (var index in aaData) {
            if (aaData[index].parklotsCode == reqData.parklotsCode) {
                aaData[index] = reqData;
            }
        }
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });

    Mock.mock(optionGet, 'get', function (options) {
        return {
            "code": "000000",
            "msg": "option Mock Success",
            "data": optionData
        }
    });

})();