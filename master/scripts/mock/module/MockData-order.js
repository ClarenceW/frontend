'use strict';

(function () {

    var orderLsPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/orderls\/pagination/;
    var orderLs = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/orderls/;
    var orderSetGet = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/orderset/;
    var orderSetPost = /http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/orderset/;
    var aaData = [
        {
            "id": 1,
            "parklotsCode": "000001",
            "vehUserCode": "13858014263",
            "status": "1",
            "orderStart": "2016-05-26 15:00:00",
            "orderEnd": "2016-05-26 16:00:00",
            "statusTm": "2016-05-26 15:12:41",
            "systime": "2016-05-26 15:12:41"
        }, {
            "id": 2,
            "parklotsCode": "000001",
            "vehUserCode": "13858014263",
            "status": 1,
            "orderStart": "2016-05-26 15:00:00",
            "orderEnd": "2016-05-26 16:00:00",
            "statusTm": "2016-05-26 15:12:41",
            "systime": "2016-05-26 15:12:41"
        }, {
            "id": 3,
            "parklotsCode": "000002",
            "vehUserCode": "15678908721",
            "status": "1",
            "orderStart": "2016-05-26 15:00:00",
            "orderEnd": "2016-05-26 16:00:00",
            "statusTm": "2016-05-26 15:12:41",
            "systime": "2016-05-26 15:12:41"
        }]
    var orderSetData = [
        {
            "parklotsCode": "01",
            "startTm": "2016-07-16 00:00",
            "endTm": "2016-07-16 23:59",
        }, {
            "parklotsCode": "88",
            "startTm": "2016-07-16 00:00",
            "endTm": "2016-07-16 23:59",
        }, {
            "parklotsCode": "89",
            "startTm": "2016-07-16 00:00",
            "endTm": "2016-07-16 23:59",
        }]

    Mock.mock(orderLsPaginationGet, 'get', function (options) {
        var vehUserCode = MockUtil.fromUrl(options.url, "vehUserCode");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (vehUserCode) {
                if (element.vehUserCode.indexOf(vehUserCode) != -1) {
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

    Mock.mock(orderLs, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].id == reqData.id) {
                aaData[index].status = '0';
                aaData[index].systime = new Date().format();
            }
        }
        return {
            "code": "000000",
            "msg": "Cancel Mock Success",
            "data": 1
        }
    });

    Mock.mock(orderSetGet, 'get', function (options) {
        return {
            "code": "000000",
            "msg": "OrderSetData Mock Success",
            "data": orderSetData
        }
    });

    Mock.mock(orderSetPost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        var isExit;
        for (var index in orderSetData) {
            if (orderSetData[index].parklotsCode == reqData.parklotsCode) {
                orderSetData[index].startTm = reqData.startTm;
                orderSetData[index].endTm = reqData.endTm;
                isExit = true;
                break;
            }
        }
        if (!isExit) {
            orderSetData[orderSetData.length] = reqData;
        }
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });
    //
    //Mock.mock(ownerDelete, 'delete', function (options) {
    //    var reqData = MockUtil.fromJson(options.body);
    //    for (var index in aaData) {
    //        if (aaData[index].code == reqData.code) {
    //            aaData.splice(index, 1);
    //        }
    //    }
    //    return {
    //        "code": "000000",
    //        "msg": "Delete Mock Success",
    //        "data": 1
    //    }
    //});
    //
    //Mock.mock(ownerPut, 'put', function (options) {
    //    var reqData = MockUtil.fromJson(options.body);
    //    reqData.systime = new Date().format();
    //    for (var index in aaData) {
    //        if (aaData[index].code == reqData.code) {
    //            aaData[index] = reqData;
    //        }
    //    }
    //    return {
    //        "code": "000000",
    //        "msg": "Put Mock Success",
    //        "data": 1
    //    }
    //});
    //


})();