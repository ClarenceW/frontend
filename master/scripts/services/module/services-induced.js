'use strict';

appService.factory("inducedService", function (sessionCache, $q, $http, Setting, $log) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.ledCode = data.ledCode;
        reqData.simCode = data.simCode;
        reqData.ctrlCode = data.ctrlCode;
        reqData.attrLevel = data.attrLevel;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.INDUCED.INDUCED_PAGINATION,
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

    var addSection = function (data) {
        var reqData = {};
        reqData.ledCode = data.ledCode;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.simCode = data.simCode;
        reqData.ctrlCode = data.ctrlCode;
        reqData.attrLevel = data.attrLevel;
        reqData.description = data.description;
        reqData.lat = data.lat;
        reqData.lng = data.lng;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.INDUCED.INDUCED_ADD,
            method: 'post',
            data: reqData
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDelete = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.ledCode = data.ledCode;
        $http({
            url: Setting.guideUrl.INDUCED.INDUCED_DEL,
            method: 'DELETE',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var updateSection = function (data) {
        var reqData = {};
        reqData.ledCode = data.ledCode;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.simCode = data.simCode;
        reqData.ctrlCode = data.ctrlCode;
        reqData.attrLevel = data.attrLevel;
        reqData.description = data.description;
        reqData.lat = data.lat;
        reqData.lng = data.lng;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.INDUCED.INDUCED_UPDATE,
            method: 'PUT',
            data: reqData
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDetail = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.ledCode = data.ledCode;
        $http({
            url: Setting.guideUrl.INDUCED.INDUCED_DETAIL,
            method: 'get',
            params: reqData
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    var reqBpcNotBound = function (data){
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.INDUCED.BPC_NOTBOUND,
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

    var reqBpcBound = function (data) {
        var reqData = {};
        reqData.ledCode = data.ledCode;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.INDUCED.BPC_BOUND,
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
    var reqPostBpc = function (data) {
        var reqData = {};
        reqData.ledCtrlUnitReqList= [];
        reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.ledCtrlUnitReqList.push({
                ledCode: data[i].data.ledCode,
                ctrlUnitCode: data[i].data.ctrlUnitCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.guideUrl.INDUCED.BPC,
            data: reqData,
            headers: {'Content-Type': 'application/json'}
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDeleteBpc = function (data) {
        var reqData = {};
        reqData.ledCtrlUnitReqList = [];
        reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.ledCtrlUnitReqList.push({
                ledCode: data[i].data.ledCode,
                ctrlUnitCode: data[i].data.ctrlUnitCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.guideUrl.INDUCED.BPC_NO,
            data: reqData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp.msg);
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
        addSection: function (data) {
            return addSection(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        updateSection: function (data) {
            return updateSection(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
        reqPostBpc: function (data) {
            return reqPostBpc(data);
        },
        reqDeleteBpc: function (data) {
            return reqDeleteBpc(data);
        },
        reqBpcNotBound:function(data){
            return reqBpcNotBound(data);
        },
        reqBpcBound:function(data){
            return reqBpcBound(data);
        }
    }
});
