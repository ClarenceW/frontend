'use strict';

appService.factory("ctrlunitService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.ctrlUnitCode = data.ctrlUnitCode;
        reqData.name = data.name;
        reqData.ledCode = data.ledCode;
        reqData.areaCode = data.areaCode;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.CTRLUNIT.CTRLUNIT_PAGINATION,
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

    var addUnit = function(data){
        var reqData = {};
        reqData.ctrlUnitCode = data.ctrlUnitCode;
        reqData.name = data.name;
        reqData.ledCode = data.ledCode;
        reqData.areaCode = data.areaCode;
        reqData.originX = data.originX;
        reqData.originY = data.originY;
        reqData.height = data.height;
        reqData.width = data.width;
        reqData.wordEmsize = data.wordEmsize;
        reqData.wordColor = data.wordColor;
        reqData.description=data.description;
        reqData.opUser=sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.CTRLUNIT.CTRLUNIT_ADD,
            method: 'post',
            data: reqData,
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDelete = function (ctrlUnitCode) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.ctrlUnitCode = ctrlUnitCode;
        $http({
            url: Setting.guideUrl.CTRLUNIT.CTRLUNIT_DEL,
            method: 'DELETE',
            data: reqData,
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var updateUnit = function (data) {
        var reqData = {};
        reqData.ctrlUnitCode = data.ctrlUnitCode;
        reqData.name = data.name;
        reqData.ledCode = data.ledCode;
        reqData.areaCode = data.areaCode;
        reqData.originX = data.originX;
        reqData.originY = data.originY;
        reqData.height = data.height;
        reqData.width = data.width;
        reqData.wordEmsize = data.wordEmsize;
        reqData.wordColor = data.wordColor;
        reqData.description=data.description;
        reqData.opUser=sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.CTRLUNIT.CTRLUNIT_EDIT,
            method: 'PUT',
            data: reqData
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDetail = function (ctrlUnitCode) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.ctrlUnitCode = ctrlUnitCode;
        $http({
            url: Setting.guideUrl.CTRLUNIT.CTRLUNIT_DETAIL,
            method: 'get',
            params: reqData,
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        addUnit: function (data) {
            return addUnit(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        updateUnit: function (data) {
            return updateUnit(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        }

    }
});
