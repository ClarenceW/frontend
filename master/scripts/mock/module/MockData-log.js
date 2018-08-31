'use strict';
(function(){
    var logPaginationGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/log\/pagination/;
    var logDetailGet = /^http:\/\/192.168.200.151:9080\/tcfbcq-frontend-inf\/log\/detail/
    var aaData= [
        {
            "id": 10678,
            "createTime": "2016-07-01 03:30:00",
            "message": "GET->/tcfbcq-frontend-inf/log4j/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "INFO",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id": 10677,
            "createTime": "2016-07-02 03:10:55",
            "message": "GET->/tcfbcq-frontend-inf/log4j/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "DEBUG",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id": 10676,
            "createTime": "2016-07-03 10:30:00",
            "message": "GET->/tcfbcq-frontend-inf/owner/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "ERROR",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id": 10675,
            "createTime": "2016-07-03 03:59:00",
            "message": "GET->/tcfbcq-frontend-inf/parklots/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "WARN",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id": 10674,
            "createTime": "2016-07-06 20:59:02",
            "message": "GET->/tcfbcq-frontend-inf/owner/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "MONITOR",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id":10673,
            "createTime": "2016-07-02 23:10:00",
            "message": "GET->/tcfbcq-frontend-inf/parklots/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "INFO",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        },
        {
            "id": 10672,
            "createTime": "2016-07-14 00:00:00",
            "message": "GET->/tcfbcq-frontend-inf/owner/pagination[draw=1&start=0&search={\"value\":\"\",\"regex\":false}&length=5&columns={\"data\":0,\"name\":\"\",\"searchable\":true,\"orderable\":false,\"search\":{\"value\":\"\",\"regex\":false}}]",
            "logType": "DEBUG",
            "classInfo": "tcfbcq.frontend.inf.configure.CommonInterceptor",
            "lineInfo": "79"
        }
    ]

Mock.mock(logPaginationGet, 'get', function (options) {
    var createTime= MockUtil.fromUrl(options.url, "createTime");
    var logType=MockUtil.fromUrl(options.url,"logType");
    var start = MockUtil.fromUrl(options.url, "start");
    var length = MockUtil.fromUrl(options.url, "length");
    var array = [];
    aaData.forEach(function (element) {

        if(createTime && logType){
            if((element.createTime.indexOf(createTime) != -1)&&(element.logType.indexOf(logType) !=-1)){
                array.push(element);
            }
        }else if (createTime) {
            if (element.createTime.indexOf(createTime) != -1) {
                array.push(element);
            }
        } else if(logType){
            if(element.logType.indexOf(logType) !=-1){
                array.push(element);
            }
        }else {
            array.push(element);
        }
    })
    return {
        "iTotalRecords": array.length,
        "iTotalDisplayRecords": array.length,
        "aaData": array.length > length ? array.slice(start, start + length) : array
    }
});


Mock.mock(logDetailGet, 'get', function (options) {
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