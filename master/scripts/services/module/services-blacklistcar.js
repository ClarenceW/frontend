'use strict';

appService.factory("blacklistcarService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";
    
    var reqBlackCarPagination = function (data) {
        var reqData = {};
        reqData.plate= data.plate;
        reqData.parklotName = data.parklotName;
        reqData.parklotCodes = data.parklotCodes;
        reqData.userCode = data.userCode;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.BLACKLISTCAR.BLACKLISTCAR_PAGINATION,
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

    var delBlacklist = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.plateColor = data.plateColor;
        reqData.parklotCode = data.parklotCode;
        reqData.plate = data.plate;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.BLACKLISTCAR.BLACKLISTCAR_DEL,
            method: 'DELETE',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var addBlacklist = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.plate = data.plate;
        reqData.plateColor = data.plateColor;
        reqData.parklotCode = data.parklotCode;
        reqData.reason = data.reason;
        reqData.startTime = data.startTime.format("yyyy-MM-dd");
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.BLACKLISTCAR.BLACKLISTCAR_ADD,
            method: 'POST',
            data: reqData,
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    return {
        reqBlackCarPagination:function(data){
        	return reqBlackCarPagination(data);
        },
        delBlacklist: function(data) {
          return delBlacklist(data);
        },
        addBlacklist:function(data) {
          return addBlacklist(data);
        }
    }
});
