'use strict';

appService.factory("parklotuserMesService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.userCode= data.userCode;
        reqData.parklotCodes= data.parklotCodes;
        reqData.userName = data.userName;
        reqData.status = data.status;
        reqData.enable = data.enable;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_PAGINATION,
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

    var reqAddParkLotuser = function (data) {
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.userPhone = data.userPhone;
        reqData.userPasswd =$.md5(data.userPasswd);
        reqData.parklotCodes = data.parklotCodes;
        reqData.description = data.description;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_ADD,
            data: reqData,
            // headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("收费员新增成功！");
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
        reqData.userCode = data.userCode;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_DELETE,
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("删除成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqClose = function (data) {
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_CLOSE,
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
        reqData.userCode = data.userCode;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_OPEN,
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
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.userPhone = data.userPhone;
        reqData.userPasswd =$.md5(data.userPasswd);
        reqData.parklotCodes = data.parklotCodes;
        reqData.description = data.description;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_UPDATE,
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
        reqData.userCode = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_DETAIL,
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

    var reqPull = function () {
        var reqData = {};
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKLOTUSERMES.PARKLOTUSERMES_PULL,
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
        reqAddParkLotuser: function (data) {
            return reqAddParkLotuser(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        reqClose: function (data) {
            return reqClose(data);
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
        reqPull: function () {
            return reqPull();
        },
    }
});
