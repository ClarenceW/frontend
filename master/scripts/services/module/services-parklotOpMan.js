'use strict';

appService.factory("parklotopeManService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.parklotName= data.parklotName;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.OPERATEMAN.OPERATEMAN_PAGINATION,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.aaData) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqAddParkLot = function (data) {
        var reqData = {};
        reqData.parklotName = data.parklotName;
        reqData.address = data.address;
        reqData.description = data.description;
        reqData.lat =data.lat;
        reqData.lng = data.lng;
        reqData.berthNum = data.berthNum;
        reqData.attr = data.attr;
        reqData.type = data.type;
        reqData.style = data.style;
        reqData.email = data.email;
        reqData.pic1 = data.pic1;
        reqData.pic2 = data.pic2;
        reqData.contacts = data.contacts;
        reqData.contactNumber = data.contactNumber;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.lotUrl.OPERATEMAN.OPERATEMAN_ADD,
            data: reqData,
            // headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("停车场新增成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqUpdate = function (data) {
        var reqData = {};
        reqData.parklotName = data.parklotName;
        reqData.address = data.address;
        reqData.description = data.description;
        reqData.lat =data.lat;
        reqData.lng = data.lng;
        reqData.berthNum = data.berthNum;
        reqData.attr = data.attr;
        reqData.type = data.type;
        reqData.style = data.style;
        reqData.email = data.email;
        reqData.pic1 = data.pic1;
        reqData.pic2 = data.pic2;
        reqData.contacts = data.contacts;
        reqData.contactNumber = data.contactNumber;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'post',
            url: Setting.lotUrl.OPERATEMAN.OPERATEMAN_UPDATE,
            data: reqData,
            headers: {
                // 'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("停车场信息修改成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqDetail = function (data) {
        var reqData = {};
        reqData.code = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.OPERATEMAN.OPERATEMAN_DETAIL,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };



    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        reqAddParkLot: function (data) {
            return reqAddParkLot(data);
        },
        reqUpdate: function (data) {
            return reqUpdate(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
    }
});
