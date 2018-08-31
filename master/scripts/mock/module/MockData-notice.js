'use strict';

(function () {

    var noticePaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/notice\/pagination/;
    var noticePost = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/notice/;
    var noticeDelete = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/notice/;
    var noticeDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/notice\/detail/;
    var aaData = [
        {
            "id": 0,
            "title": "道路封堵",
            "context": "因近日连续暴雨天气，西湖景区道路封堵，禁止任何车辆及行人通行",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 1,
            "title": "污染提示",
            "context": "因近日连续暴雨天气，西湖景区道路封堵，出门做好防范措施",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 2,
            "title": "高发事故路段",
            "context": "因近日连续暴雨天气，钱江大桥道路封堵，请注意安全驾驶",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 3,
            "title": "道路封堵",
            "context": "因近日连续暴雨天气，西湖景区道路封堵，禁止任何车辆及行人通行",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 4,
            "title": "道路封堵",
            "context": "因近日连续暴雨天气，西湖景区道路封堵，禁止任何车辆及行人通行",
            "pubTm": "2016-06-24 14:17:47"
        },
        {
            "id": 5,
            "title": "道路封堵",
            "context": "因近日连续暴雨天气，西湖景区道路封堵，禁止任何车辆及行人通行",
            "pubTm": "2016-06-24 14:17:47"
        },
    ];
    var id = 5;

    Mock.mock(noticePaginationGet, 'get', function (options) {
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

    Mock.mock(noticePost, 'post', function (options) {
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

    Mock.mock(noticeDelete, 'delete', function (options) {
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

    Mock.mock(noticeDetailGet, 'get', function (options) {
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