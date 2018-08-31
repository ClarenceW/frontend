'use strict';

appService.factory("mapService", function ($q, $http, Setting, $log) {

    var errorMsg = "数据加载异常...";

    var reqList = function (data) {
        var reqData = {};
        reqData.dclotName = data.dclotName;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MAP.MAP_PARKLOT,
            method: 'GET'
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
    /**
     *加载停车场数据
     */
    var reqParklotByCode = function (data) {
        var reqData = {};
        reqData.dclotCode = data.dclotCode;
        $log.debug("GET:/gateway/detail " + angular.toJson(reqData));
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MAP.MAP_PARKLOT_DETAIL,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function (resp) {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    return {
        reqList: function (data) {
            return reqList(data);
        },
        reqParklotByCode:function(data){
            return reqParklotByCode(data);
        }
    }
});