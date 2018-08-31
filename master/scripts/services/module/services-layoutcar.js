'use strict';

appService.factory("layoutcarService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";
    
    var reqPagination = function (data) {
        var reqData = {};
        reqData.plate= data.plate;
        reqData.userCode = data.userCode;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.LAYOUTCAR.LAYOUTCAR_PAGINATION,
				    // url: "scripts/services/module/data/membercar.json",
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

    var dellayout = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.plateColor = data.plateColor;
        reqData.plate = data.plate;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.LAYOUTCAR.LAYOUTCAR_DEL,
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

    var addLayout = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.plate = data.plate;
        reqData.plateColor = data.plateColor;
        reqData.reason = data.reason;
        reqData.startTime = data.startTime;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.LAYOUTCAR.LAYOUTCAR_ADD,
            method: 'POST',
            data: reqData
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
        reqPagination:function(data){
        	return reqPagination(data);
        },
        dellayout: function(data) {
          return dellayout(data);
        },
        addLayout:function(data) {
          return addLayout(data);
        }
    }
});
