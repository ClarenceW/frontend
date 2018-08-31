'use strict';

appService.factory("monitorAlarmService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.laneCode= data.laneCode;
        reqData.parklotName = data.parklotName;
        reqData.laneName = data.laneName;
        reqData.alarmType = data.alarmType;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MONITORALARM.MONITORALARM_PAGINATION,
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
    }
});
