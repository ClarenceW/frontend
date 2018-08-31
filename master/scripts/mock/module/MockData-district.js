'use strict';


(function () {

    var optionUrl = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/district\/option/;
    var districtInit = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/district\/init/;
    var districtGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/district/;
    var districtPut = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/district/;
    var districtData = [
        {
            id: "11",
            name: "北京市",
            regionType: "2"
        },
        {
            id: "12",
            name: "天津市",
            regionType: "2"
        },
        {
            id: "13",
            name: "河北省",
            regionType: "1"
        },
        {
            id: "14",
            name: "山西省",
            regionType: "1"
        },
        {
            id: "15",
            name: "内蒙古自治区",
            regionType: "1"
        },
        {
            id: "21",
            name: "辽宁省",
            regionType: "1"
        },
        {
            id: "22",
            name: "吉林省",
            regionType: "1"
        },
        {
            id: "23",
            name: "黑龙江省",
            regionType: "1"
        },
        {
            id: "31",
            name: "上海市",
            regionType: "2"
        },
        {
            id: "32",
            name: "江苏省",
            regionType: "1"
        },
        {
            id: "33",
            name: "浙江省",
            regionType: "1"
        },
        {
            id: "34",
            name: "安徽省",
            regionType: "1"
        },
        {
            id: "35",
            name: "福建省",
            regionType: "1"
        },
        {
            id: "36",
            name: "江西省",
            regionType: "1"
        },
        {
            id: "37",
            name: "山东省",
            regionType: "1"
        },
        {
            id: "41",
            name: "河南省",
            regionType: "1"
        },
        {
            id: "42",
            name: "湖北省",
            regionType: "1"
        },
        {
            id: "43",
            name: "湖南省",
            regionType: "1"
        },
        {
            id: "44",
            name: "广东省",
            regionType: "1"
        },
        {
            id: "45",
            name: "广西壮族自治区",
            regionType: "1"
        },
        {
            id: "46",
            name: "海南省",
            regionType: "1"
        },
        {
            id: "50",
            name: "重庆市",
            regionType: "2"
        },
        {
            id: "51",
            name: "四川省",
            regionType: "1"
        },
        {
            id: "52",
            name: "贵州省",
            regionType: "1"
        },
        {
            id: "53",
            name: "云南省",
            regionType: "1"
        },
        {
            id: "54",
            name: "西藏自治区",
            regionType: "1"
        },
        {
            id: "61",
            name: "陕西省",
            regionType: "1"
        },
        {
            id: "62",
            name: "甘肃省",
            regionType: "1"
        },
        {
            id: "63",
            name: "青海省",
            regionType: "1"
        },
        {
            id: "64",
            name: "宁夏回族自治区",
            regionType: "1"
        },
        {
            id: "65",
            name: "新疆维吾尔自治区",
            regionType: "1"
        }
    ]
    var districtData_50 = [
        {
            id: "500101",
            name: "万州区",
            regionType: "2"
        },
        {
            id: "500102",
            name: "涪陵区",
            regionType: "2"
        },
        {
            id: "500103",
            name: "渝中区",
            regionType: "2"
        },
        {
            id: "500104",
            name: "大渡口区",
            regionType: "2"
        },
        {
            id: "500105",
            name: "江北区",
            regionType: "2"
        },
        {
            id: "500106",
            name: "沙坪坝区",
            regionType: "2"
        },
        {
            id: "500107",
            name: "九龙坡区",
            regionType: "2"
        },
        {
            id: "500108",
            name: "南岸区",
            regionType: "2"
        },
        {
            id: "500109",
            name: "北碚区",
            regionType: "2"
        },
        {
            id: "500110",
            name: "綦江区",
            regionType: "2"
        },
        {
            id: "500111",
            name: "大足区",
            regionType: "2"
        },
        {
            id: "500112",
            name: "渝北区",
            regionType: "2"
        },
        {
            id: "500113",
            name: "巴南区",
            regionType: "2"
        },
        {
            id: "500114",
            name: "黔江区",
            regionType: "2"
        },
        {
            id: "500115",
            name: "长寿区",
            regionType: "2"
        },
        {
            id: "500116",
            name: "江津区",
            regionType: "2"
        },
        {
            id: "500117",
            name: "合川区",
            regionType: "2"
        },
        {
            id: "500118",
            name: "永川区",
            regionType: "2"
        },
        {
            id: "500119",
            name: "南川区",
            regionType: "2"
        }, {
            id: "500223",
            name: "潼南县",
            regionType: "2"
        },
        {
            id: "500224",
            name: "铜梁县",
            regionType: "2"
        },
        {
            id: "500226",
            name: "荣昌县",
            regionType: "2"
        },
        {
            id: "500227",
            name: "璧山县",
            regionType: "2"
        },
        {
            id: "500228",
            name: "梁平县",
            regionType: "2"
        },
        {
            id: "500229",
            name: "城口县",
            regionType: "2"
        },
        {
            id: "500230",
            name: "丰都县",
            regionType: "2"
        },
        {
            id: "500231",
            name: "垫江县",
            regionType: "2"
        },
        {
            id: "500232",
            name: "武隆县",
            regionType: "2"
        },
        {
            id: "500233",
            name: "忠县",
            regionType: "2"
        },
        {
            id: "500234",
            name: "开县",
            regionType: "2"
        },
        {
            id: "500235",
            name: "云阳县",
            regionType: "2"
        },
        {
            id: "500236",
            name: "奉节县",
            regionType: "2"
        },
        {
            id: "500237",
            name: "巫山县",
            regionType: "2"
        },
        {
            id: "500238",
            name: "巫溪县",
            regionType: "2"
        },
        {
            id: "500240",
            name: "石柱土家族自治县",
            regionType: "2"
        },
        {
            id: "500241",
            name: "秀山土家族苗族自治县",
            regionType: "2"
        },
        {
            id: "500242",
            name: "酉阳土家族苗族自治县",
            regionType: "2"
        },
        {
            id: "500243",
            name: "彭水苗族土家族自治县",
            regionType: "2"
        },

    ]
    var districtData_33 = [
        {
            id: "3301",
            name: "杭州市",
            regionType: "2"
        },
        {
            id: "3302",
            name: "宁波市",
            regionType: "2"
        },
        {
            id: "3303",
            name: "温州市",
            regionType: "2"
        },
        {
            id: "3304",
            name: "嘉兴市",
            regionType: "2"
        },
        {
            id: "3305",
            name: "湖州市",
            regionType: "2"
        },
        {
            id: "3306",
            name: "绍兴市",
            regionType: "2"
        },
        {
            id: "3307",
            name: "金华市",
            regionType: "2"
        },
        {
            id: "3308",
            name: "衢州市",
            regionType: "2"
        },
        {
            id: "3309",
            name: "舟山市",
            regionType: "2"
        },
        {
            id: "3310",
            name: "台州市",
            regionType: "2"
        },
        {
            id: "3311",
            name: "丽水市",
            regionType: "2"
        },
    ]
    var districtData_3301 = [
        {
            id: "330102",
            name: "上城区",
            regionType: "2"
        },
        {
            id: "330103",
            name: "下城区",
            regionType: "2"
        },
        {
            id: "330104",
            name: "江干区",
            regionType: "2"
        },
        {
            id: "330105",
            name: "拱墅区",
            regionType: "2"
        },
        {
            id: "330106",
            name: "西湖区",
            regionType: "2"
        },
        {
            id: "330108",
            name: "滨江区",
            regionType: "2"
        },
        {
            id: "330109",
            name: "萧山区",
            regionType: "2"
        },
        {
            id: "330110",
            name: "余杭区",
            regionType: "2"
        },
        {
            id: "330122",
            name: "桐庐县",
            regionType: "2"
        },
        {
            id: "330127",
            name: "淳安县",
            regionType: "2"
        },
        {
            id: "330182",
            name: "建德市",
            regionType: "2"
        },
        {
            id: "330183",
            name: "富阳市",
            regionType: "2"
        },
        {
            id: "330185",
            name: "临安市",
            regionType: "2"
        },
    ]
    var districtData_3302 = [
        {
            id: "330203",
            name: "海曙区",
            regionType: "2"
        },
        {
            id: "330204",
            name: "江东区",
            regionType: "2"
        },
        {
            id: "330205",
            name: "江北区",
            regionType: "2"
        },
        {
            id: "330206",
            name: "北仑区",
            regionType: "2"
        },
        {
            id: "330211",
            name: "镇海区",
            regionType: "2"
        },
        {
            id: "330212",
            name: "鄞州区",
            regionType: "2"
        },
        {
            id: "330225",
            name: "象山县",
            regionType: "2"
        },
        {
            id: "330226",
            name: "宁海县",
            regionType: "2"
        },
        {
            id: "330281",
            name: "余姚市",
            regionType: "2"
        },
        {
            id: "330282",
            name: "慈溪市",
            regionType: "2"
        },
        {
            id: "330283",
            name: "奉化市",
            regionType: "2"
        },
    ]
    var initData = ["0", "33", "3301", ["330102", "330103", "330104", "330105", "330106"]];

    Mock.mock(optionUrl, 'get', function (options) {
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            // "data": ["0", "50", ["500101", "500102", "500103"]]
            "data": initData
        }
    });

    Mock.mock(districtInit, 'get', function (options) {
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            // "data": ["0", "50", ["500101", "500102", "500103"]]
            "data": initData
        }
    });

    Mock.mock(districtGet, 'get', function (options) {
        var parentRegionId = MockUtil.fromUrl(options.url, "pid");
        var data = [];
        if (parentRegionId == "0") {
            data = districtData
        } else if (parentRegionId == "50") {
            data = districtData_50
        } else if (parentRegionId == "33") {
            data = districtData_33
        } else if (parentRegionId == "3301") {
            data = districtData_3301
        } else if (parentRegionId == "3302") {
            data = districtData_3302
        }
        return {
            "code": "000000",
            "msg": "Province Data Mock Success",
            "data": data
        }
    });

    Mock.mock(districtPut, 'put', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        initData = reqData.initData;
        return {
            "code": "000000",
            "msg": "Put Mock Success",
            "data": 1
        }
    });
})();