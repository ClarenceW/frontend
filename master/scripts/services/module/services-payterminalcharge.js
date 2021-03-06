'use strict';

appService.factory("payterminalchargeReportService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.parklotCodes = data.parklotCodes;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        var url;
        if(data.index == 1) {
          reqData.dayTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_PAGINATION_DAY;
        }else if(data.index == 2){
          reqData.monthTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_PAGINATION_MOUTH;
        }else if(data.index == 3){
          reqData.yearTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_PAGINATION_YEAR;
        }
        $http({
            url: url,
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
        reqData.start = 0;
        reqData.length = 5000;
        var url;
        if(data.index == 1) {
          reqData.dayTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_LIST_DAY;
        }else if(data.index == 2){
          reqData.monthTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_LIST_MOUTH;
        }else if(data.index == 3){
          reqData.yearTime = data.startTime;
          url = Setting.lotUrl.PAYTERMINAL_CHARGE_REPORT.PAYTERMINAL_CHARGE_LIST_YEAR;
        }
        var deferred = $q.defer();
        $http({
            url: url,
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
    
    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },

        reqList: function(data) {
            return reqList(data);
        }
    }
});
