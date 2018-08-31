'use strict';

appService.factory("yearchargeService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.parklotCodes = data.parklotCodes;
        reqData.start = data.start;
        reqData.length = data.length;
        reqData.year = data.startTime;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.YEARCHARGE_REPORT.YEARCHARGE_REPORT_PAGINATION,
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

    var reqList = function(data) {
        var reqData = {};
        reqData.parklotCodes = data.parklotCodes;
        reqData.year = data.startTime;
        reqData.start = 0;
        reqData.length = 5000;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.YEARCHARGE_REPORT.YEARCHARGE_REPORT_LIST,
            method: 'GET',
            params: reqData
        }).success(function (resp) {

            if (resp && resp.data) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise; 
    }

    var reqWalletCharge = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.parklotCodes = data.parklotCodes;
        reqData.year = data.year;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.YEARCHARGE_REPORT.YEARCHARGE_REPORT_WALLET,
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
        reqList: function(data) {
            return reqList(data);
        },
        reqWalletCharge: function(data) {
            return reqWalletCharge(data);
        }
    }
});
