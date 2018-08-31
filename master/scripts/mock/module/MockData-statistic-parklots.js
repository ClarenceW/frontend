'use strict';

(function () {

    var parklotsBerthHistoryList = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/statisticPark\/history/;
    var parklotsGuideGet = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/statisticPark\/guide/;
    var parklotsBerthsGet = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/statisticPark\/berths/;

    var berthHistoryData = [
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 101, "berthFullNum": 4, "updateTime": "2016-07-18 06:20"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 100, "berthFullNum": 5, "updateTime": "2016-07-18 06:25"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 92, "berthFullNum": 13, "updateTime": "2016-07-18 06:30"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 92, "berthFullNum": 13, "updateTime": "2016-07-18 06:35"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 89, "berthFullNum": 16, "updateTime": "2016-07-18 06:40"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 91, "berthFullNum": 14, "updateTime": "2016-07-18 06:45"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 90, "berthFullNum": 15, "updateTime": "2016-07-18 06:50"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 86, "berthFullNum": 19, "updateTime": "2016-07-18 06:55"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 87, "berthFullNum": 18, "updateTime": "2016-07-18 07:00"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 91, "berthFullNum": 14, "updateTime": "2016-07-18 07:05"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 85, "berthFullNum": 20, "updateTime": "2016-07-18 07:10"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 83, "berthFullNum": 22, "updateTime": "2016-07-18 07:15"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 86, "berthFullNum": 19, "updateTime": "2016-07-18 07:20"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 85, "berthFullNum": 20, "updateTime": "2016-07-18 07:25"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 83, "berthFullNum": 22, "updateTime": "2016-07-18 07:30"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 80, "berthFullNum": 25, "updateTime": "2016-07-18 07:35"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 76, "berthFullNum": 29, "updateTime": "2016-07-18 07:40"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 71, "berthFullNum": 34, "updateTime": "2016-07-18 07:45"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 70, "berthFullNum": 35, "updateTime": "2016-07-18 07:50"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 63, "berthFullNum": 42, "updateTime": "2016-07-18 08:00"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 56, "berthFullNum": 49, "updateTime": "2016-07-18 08:05"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 51, "berthFullNum": 54, "updateTime": "2016-07-18 08:10"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 42, "berthFullNum": 63, "updateTime": "2016-07-18 08:15"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 37, "berthFullNum": 68, "updateTime": "2016-07-18 08:20"},
        {"parklotsCode": "33", "parklotsName": "沧白路停车库", "berthEmptyNum": 39, "berthFullNum": 66, "updateTime": "2016-07-18 08:25"}
    ];
    var parklotsGuideData = [
        {
            "parklotsCode": "33",
            "parklotsName": "沧白路停车库",
            "address": "沧白路75-1号，顺风123对面-重庆永旺提供",
            "coor": [106.587595, 29.567954],
            "berthEmptyNum": 2,
            "berthTotalNum": 105,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "34",
            "parklotsName": "渝海七星停车库",
            "address": "民生路318号，渝海七星家具城楼下！",
            "coor": [106.575562, 29.563626],
            "berthEmptyNum": 0,
            "berthTotalNum": 300,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "35",
            "parklotsName": "得意世界停车库",
            "address": "较场口88号负二楼，共2个进出口，分别在702和429车站斜对面！",
            "coor": [106.581307, 29.5588],
            "berthEmptyNum": 6,
            "berthTotalNum": 600,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "36",
            "parklotsName": "女人广场停车库",
            "address": "大同路12号,402车站旁边",
            "coor": [106.579353, 29.563595],
            "berthEmptyNum": 184,
            "berthTotalNum": 229,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "38",
            "parklotsName": "时代广场停车库",
            "address": "美美时代广场,青年路1号！轻轨2号线临江门站",
            "coor": [106.583809, 29.564789],
            "berthEmptyNum": 5,
            "berthTotalNum": 260,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "39",
            "parklotsName": "地王广场停车场",
            "address": "民族路168号,江家巷王府井商场楼下！",
            "coor": [106.585345,29.566053],
            "berthEmptyNum": 109,
            "berthTotalNum": 486,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "40",
            "parklotsName": "合景聚融停车场",
            "address": "民权路58号，好乐迪KTV旁边！轻轨较场口站附近",
            "coor": [106.580642,29.560556],
            "berthEmptyNum": 5,
            "berthTotalNum": 100,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "41",
            "parklotsName": "渝海南区停车场",
            "address": "德兴里329号，渝海七星家具城对面！",
            "coor": [106.575374,29.563304],
            "berthEmptyNum": 5,
            "berthTotalNum": 260,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "43",
            "parklotsName": "爱华龙都停车场",
            "address": "渝中区大坪1号长江二路86号",
            "coor": [106.526946,29.547081],
            "berthEmptyNum": 293,
            "berthTotalNum": 500,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "44",
            "parklotsName": "文化宫停车场",
            "address": "渝中区中山二路174号",
            "coor": [106.556693,29.562103],
            "berthEmptyNum": 19,
            "berthTotalNum": 585,
            "statusTime": "2016-07-11 07:57:04"
        },
        {
            "parklotsCode": "45",
            "parklotsName": "八一广场停车场",
            "address": "渝中区解放碑八一路238号",
            "coor": [106.583602,29.561298],
            "berthEmptyNum": 311,
            "berthTotalNum": 400,
            "statusTime": "2016-07-11 07:57:04"
        }
    ];

    //停车场泊位历史数据统计
    Mock.mock(parklotsBerthHistoryList, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var array = [];
        var startTime = moment().minutes(0).seconds(0);
        var count = berthHistoryData.length;
        startTime.subtract(10 * (count + 1), "minutes")
        berthHistoryData.forEach(function (element, index) {
            element.updateTime = startTime.add(10, "minutes").format("YYYY-MM-DD HH:mm");
            array.push(element);
        })
        return array;
    });

    //停车场数据，用于诱导
    Mock.mock(parklotsGuideGet, 'get', function (options) {
        var array = [];
        var startTime = moment().seconds(0);
        parklotsGuideData.forEach(function (element, index) {
            element.statusTime = startTime.format("YYYY-MM-DD HH:mm:ss");
            array.push(element);
        })
        return array;
    });

    //停车场泊位统计
    Mock.mock(parklotsBerthsGet, 'get', function (options) {
        var parklotsName = MockUtil.fromUrl(options.url, "parklotsName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        parklotsGuideData.forEach(function (element) {
            if (parklotsName) {
                if (element.parklotsName.indexOf(parklotsName) != -1) {
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
        };
    });
})();