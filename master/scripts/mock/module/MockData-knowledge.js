'use strict';

(function () {

    var knowledgePaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/knowledge\/pagination/;
    var knowledgeDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/knowledge\/detail/;
    var knowledgePost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/knowledge/;
    var knowledgeDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/knowledge/;

    var aaData = [
        {
            "id": 1,
            "title": "夏季高温需防爆胎",
            "context": "夏天气温高，轮胎温度随着增高，橡胶易软化，严重时会出现烧胎现象。车辆高速行驶中遇到坚硬物极易爆胎。在行车中要随时检查轮胎气压，发现轮胎过热，气压过高，应将车停在阴凉处降温，不可用冷水泼冲，也不要放气，否则会导致途中爆胎和轮胎的早期损坏。",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 2,
            "title": "夏季高温需防缺水",
            "context": "高温天气行车，水箱内的水蒸发加快，要时刻注意检查冷却水量，注意水温表。发现缺水时要立即停车，但不可马上加水，而应等怠速运转降温后再补充水，并注意不要马上打开散热器盖，以防被烫伤。",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 3,
            "title": "夏季高温需防打滑",
            "context": "经常检查水泵工作情况和风扇皮带张紧力，风扇皮带不可沾油，防止风扇皮带打滑。经常注意水泵漏水情况，同时，要注意将百叶窗开足。",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 4,
            "title": "夏季高温需防气阻",
            "context": "由于夏天气温高，散热速度受到限制，汽车行驶途中行驶速度慢，发动机转速高，散热困难，易出现行驶“气阻”，有时发动机稍停熄几分钟就难以启动，使供应油中断。一旦发生气阻，驾驶员应立即停车降温，排除故障，如果你的车是液压制动，在高温高速下行驶，制动液易出现空气“气阻”，使得制动器突然失灵造成事故。",
            "pubTm": "2016-06-24 14:17:47"
        },
    ];
    var id = 5;

    Mock.mock(knowledgePaginationGet, 'get', function (options) {
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
        })
        return {
            "iTotalRecords": array.length,
            "iTotalDisplayRecords": array.length,
            "aaData": array.length > length ? array.slice(start, start + length) : array
        }
    });

    Mock.mock(knowledgeDetailGet, 'get', function (options) {
        var id = MockUtil.fromUrl(options.url, "id");
        var data;
        for (var index in aaData) {
            if (aaData[index].id == id) {
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

    Mock.mock(knowledgePost, 'post', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        reqData.pubTm = new Date().format();
        reqData.id = ++id;
        aaData.unshift(reqData);
        return {
            "code": "000000",
            "msg": "Post Mock Success",
            "data": 1
        }
    });

    Mock.mock(knowledgeDelete, 'delete', function (options) {
        var reqData = MockUtil.fromJson(options.body);
        for (var index in aaData) {
            if (aaData[index].id == reqData.id) {
                aaData.splice(index, 1);
            }
        }
        return {
            "code": "000000",
            "msg": "Delete Mock Success",
            "data": 1
        }
    });


})();