'use strict';

appService.factory("parklotsService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.name= data.name;
        reqData.parklotCodes= data.parklotCodes;
        reqData.isOp = data.isOp;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_PAGINATION,
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
        reqData.name = data.name;
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
        reqData.ruleDesc = data.ruleDesc;
        reqData.contacts = data.contacts;
        reqData.contactNumber = data.contactNumber;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_ADD,
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

    var reqDelete = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_CLOSE,
            data: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("停用成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqEnable = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_OPEN,
            data: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("启用成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqUpdate = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.name = data.name;
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
        reqData.ruleDesc = data.ruleDesc;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_UPDATE,
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
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_DETAIL,
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

    var reqList = function () {
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_LIST,
            method: 'GET',
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

    var reqListAll = function () {
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_LIST_ALL,
            method: 'GET',
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

    var reqPull = function () {
        var reqData = {};
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_PULL,
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
        reqDelete: function (data) {
            return reqDelete(data);
        },
        reqEnable: function (data) {
            return reqEnable(data);
        },
        reqUpdate: function (data) {
            return reqUpdate(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
        reqList: function () {
            return reqList();
        },
        reqListAll: function () {
            return reqListAll();
        },
        reqPull: function () {
            return reqPull();
        },
    }
});
