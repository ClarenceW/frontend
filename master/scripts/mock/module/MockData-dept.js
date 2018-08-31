'use strict';

(function () {

    var paginationGetUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept\/pagination/;
    var detailGetUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept\/detail/;
    var optionGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept\/option/;
    var postUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept/;
    var deleteUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept/;
    var putUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/dept/;

    var aaData = [
        {
            "deptCode": "00001",
            "deptName": "交警支队",
            "pubAddress": "人和镇双桥11社188号",
            "pubContact": "张三",
            "pubTel": "023-88888888",
            "pubCoor": "105.566797,28.55525",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00000",
            "parentDeptName": "交警总队", // 根节点
        },
        {
            "deptCode": "00002",
            "deptName": "渝中区交巡警支队",
            "pubAddress": "人和镇双桥11社188号",
            "pubContact": "李四",
            "pubTel": "023-67638882",
            "pubCoor": "105.560797,28.55925",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00001",
            "parentDeptName": "交警支队"
        },
        {
            "deptCode": "00003",
            "deptName": "重庆市交管局车管所江北分所",
            "pubAddress": "人和镇双桥11社199号",
            "pubContact": "王五",
            "pubTel": "023-67639692",
            "pubCoor": "106.560797,29.55925",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00002",
            "parentDeptName": "渝中区交巡警支队"
        },
        {
            "deptCode": "00004",
            "deptName": "重庆市交管局车管所江南分所",
            "pubAddress": "人和镇双桥11社200号",
            "pubContact": "乔六",
            "pubTel": "023-67639112",
            "pubCoor": "107.560797,30.55925",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00002",
            "parentDeptName": "渝中区交巡警支队"
        },
        {
            "deptCode": "00005",
            "deptName": "重庆市交管局车管所江西分所",
            "pubAddress": "人和镇双桥11社211号",
            "pubContact": "王二麻子",
            "pubTel": "023-67639455",
            "pubCoor": "109.560797,32.55925",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00002",
            "parentDeptName": "渝中区交巡警支队"
        },
        {
            "deptCode": "00009",
            "deptName": "重庆市交管局车管所江北分所",
            "pubAddress": "人和镇双桥11社199号",
            "pubContact": "王五",
            "pubTel": "023-67639692",
            "pubCoor": "106.560797,29.55925",
            "pubTm": "2016-05-26 10:05:45",
            "parentDeptCode": "00007",
            "parentDeptName": "渝中区城管支队1"
        }
    ];

    var optionData = [
        {
            "code": "00000",
            "name": "交警总队",
        },
        {
            "code": "00001",
            "name": "交警支队",
        }, {
            "code": "00002",
            "name": "渝中区交巡警支队",
        }, {
            "code": "00003",
            "name": "渝中区交巡警1大队",
        }, {
            "code": "00004",
            "name": "渝中区交巡警2大队",
        }, {
            "code": "00005",
            "name": "渝中区交巡警3大队",
        }, {
            "code": "00006",
            "name": "城管支队",
        }, {
            "code": "00007",
            "name": "渝中区城管支队",
        }, {
            "code": "00008",
            "name": "渝中区城管1大队",
        }, {
            "code": "00009",
            "name": "渝中区城管2大队",
        }
    ];

    Mock.mock(paginationGetUrl, 'get', function (options) {
        var deptName = MockUtil.fromUrl(options.url, "deptName");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (deptName) {
                if (element.deptName.indexOf(deptName) != -1) {
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
        var deptCode = MockUtil.fromUrl(options.url, "deptCode");
        var data;
        for (var index in aaData) {
            if (aaData[index].deptCode == deptCode) {
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

    Mock.mock(optionGet, 'get', function (options) {
        return {
            "code": "000000",
            "msg": "Option Mock Success",
            "data": optionData
        }
    });

    Mock.mock(postUrl, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.parentDeptName = "测试支队-新增";
        reqData.pubTm = new Date().format();
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
            if (aaData[index].deptCode == reqData.deptCode) {
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
        reqData.parentDeptName = "测试支队-修改";
        reqData.pubTm = new Date().format();
        for (var index in aaData) {
            if (aaData[index].deptCode == reqData.deptCode) {
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