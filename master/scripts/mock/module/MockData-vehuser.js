'use strict';

(function () {

    var paginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/vehuser\/pagination/;
    var detailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/vehuser\/detail/;
    var aaData = [
        {
            "code": "18703625696",
            "name": "Tom",
            "sex": "0",
            "address":"杭州市余杭区文一西路1001号衢海大厦A栋7楼",
            "systime": "2016-06-24 14:17:47"
        },
        {
            "code": "15381045696",
            "name": "lucy",
            "sex": "1",
            "address":"杭州市余杭区五常街道西溪北苑北区88栋",
            "systime": "2016-06-24 14:17:47"
        },
        {
            "code": "15905602420",
            "name": "Lily",
            "sex": "1",
            "address":"杭州市滨江区长河街道春波小区9栋2单元602",
            "systime": "2016-06-24 14:17:47"
        },
        {
            "code": "1355206458",
            "name": "Jack",
            "sex": "0",
            "address":"北京市海淀区双清路183号国家自然科学基金委员会",
            "systime": "2016-06-24 14:17:47"
        },
        {
            "code": "18668153250",
            "name": "Rose",
            "sex": "0",
            "address":"杭州市滨江区滨盛路1806号华业科技园华业大厦1906室",
            "systime": "2016-06-24 14:17:47"
        }
    ];

    Mock.mock(paginationGet, 'get', function (options) {
        var code = MockUtil.fromUrl(options.url, "code");
        var start = MockUtil.fromUrl(options.url, "start");
        var length = MockUtil.fromUrl(options.url, "length");
        var array = [];
        aaData.forEach(function (element) {
            if (code) {
                if (element.code.indexOf(code) != -1) {
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


    Mock.mock(detailGet, 'get', function (options) {
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