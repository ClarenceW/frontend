'use strict';

appService.factory("logService", function ($q, $http, Setting, $log) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.opTime = data.opTime;
        reqData.logType = data.logType;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.LOG.LOG_PAGINATION,
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
        }
    }
});
