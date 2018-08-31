'use strict';

(function () {

    var trafficPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/traffic\/pagination/;
    var trafficPost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/traffic/;
    var trafficDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/traffic/;
    var trafficDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/traffic\/detail/;
    var aaData = [
        {
            "id": 1,
            "title": "沪渝高速道路施工",
            "trafficType": "0",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 2,
            "title": "沪渝高速道路禁令",
            "trafficType": "1",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 3,
            "title": "沪渝高速道路单行道",
            "trafficType": "2",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 4,
            "title": "沪渝高速道路查酒驾",
            "trafficType": "3",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 5,
            "title": "沪渝高速其他",
            "trafficType": "4",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 6,
            "title": "沪渝高速道路施工",
            "trafficType": "0",
            "context": "G50沪渝高速(垫忠高速)在石滓至高安路段，道路施工，小心驾驶，预计2016年05月30日 19时恢复",
            "pubTm": "2016-06-24 14:17:47"
        },
    ];
    var id = 6;

    Mock.mock(trafficPaginationGet, 'get', function (options) {
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

    Mock.mock(trafficPost, 'post', function (options) {
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

    Mock.mock(trafficDelete, 'delete', function (options) {
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

    Mock.mock(trafficDetailGet, 'get', function (options) {
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

})();