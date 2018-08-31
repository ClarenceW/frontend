'use strict';

(function () {

    var orderLsPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/statisticOrder\/pagination/;
    var orderLsAllGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/statisticOrder\/all/;
    var aaData = [
        {
            "id": "1",
            "parklotsCode": "33",
            "parklotsName": "沧白路停车库",
            "orderTotal": 35,
            "orderSuccessNum": 28,
            "orderFailNum": 7,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "2",
            "parklotsCode": "34",
            "parklotsName": "渝海七星停车库",
            "orderTotal": 61,
            "orderSuccessNum": 45,
            "orderFailNum": 16,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "3",
            "parklotsCode": "35",
            "parklotsName": "得意世界停车场",
            "orderTotal": 26,
            "orderSuccessNum": 24,
            "orderFailNum": 2,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "4",
            "parklotsCode": "36",
            "parklotsName": "女人广场停车场",
            "orderTotal": 37,
            "orderSuccessNum": 33,
            "orderFailNum": 4,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "5",
            "parklotsCode": "38",
            "parklotsName": "时代广场停车场",
            "orderTotal": 21,
            "orderSuccessNum": 19,
            "orderFailNum": 2,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "6",
            "parklotsCode": "39",
            "parklotsName": "地王广场停车场",
            "orderTotal": 49,
            "orderSuccessNum": 47,
            "orderFailNum": 2,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "7",
            "parklotsCode": "40",
            "parklotsName": "合景聚融停车场",
            "orderTotal": 16,
            "orderSuccessNum": 15,
            "orderFailNum": 1,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "8",
            "parklotsCode": "41",
            "parklotsName": "渝海南区停车场",
            "orderTotal": 9,
            "orderSuccessNum": 9,
            "orderFailNum": 0,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "9",
            "parklotsCode": "43",
            "parklotsName": "爱华龙都停车场",
            "orderTotal": 35,
            "orderSuccessNum": 30,
            "orderFailNum": 5,
            "updateTime": "2016-07-20 12:10:00"
        }, {
            "id": "10",
            "parklotsCode": "44",
            "parklotsName": "文化宫停车场",
            "orderTotal": 41,
            "orderSuccessNum": 30,
            "orderFailNum": 11,
            "updateTime": "2016-07-20 12:10:00"
        }];

    Mock.mock(orderLsPaginationGet, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        var startTime = moment().seconds(0);
        aaData.forEach(function (element) {
            element.updateTime = startTime.format("YYYY-MM-DD HH:mm");
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

    //预约统计
    Mock.mock(orderLsAllGet, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var array = [];
        var startTime = moment().seconds(0);
        var count = aaData.length;
        aaData.forEach(function (element, index) {
            element.updateTime = startTime.format("YYYY-MM-DD HH:mm");
            array.push(element);
        })
        return array;
    });

})();