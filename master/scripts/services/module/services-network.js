'use strict';

appService.factory("networkMonitorService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.name= data.name;
        reqData.parklotCode = data.parklotCode;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: 'scripts/services/module/data/network.json',
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
    
    var reqBlackCarPagination = function (data) {
        var reqData = {};
        reqData.name= data.name;
        reqData.parklotCode = data.parklotCode;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: 'scripts/services/module/data/blackcar.json',
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



    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        reqBlackCarPagination:function(data){
        	return reqBlackCarPagination(data);
        }
    }
});
