'use strict';

appService.factory("areaService", function ($q, $http, Setting, $log) {

    var errorMsg = "数据加载异常...";

    var reqPagination = function (data) {
        var reqData = {};
        reqData.areaCode = data.areaCode;
        reqData.areaLevel = data.areaLevel;
        reqData.name = data.name;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREA.AREA_PAGINATION,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            $log.debug(resp);
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

    var addArea = function(data){
        var reqData = {};
        reqData.name = data.name;
        reqData.areaCode = data.areaCode;
        reqData.areaLevel = data.areaLevel;
        reqData.description = data.description;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREA.AREA_ADD,
            method: 'POST',
            data: reqData,
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDelete = function (areaCode) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.areaCode = areaCode;
        $http({
            url: Setting.guideUrl.AREA.AREA_DEL,
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

    var updateArea = function (data) {
        var reqData = {};
        reqData.name = data.name;
        reqData.areaCode = data.areaCode;
        reqData.areaLevel = data.areaLevel;
        reqData.description = data.description;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREA.AREA_UPDATE,
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

    var reqDetail = function (areaCode) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.areaCode = areaCode;
        $http({
            url: Setting.guideUrl.AREA.AREA_DETAIL,
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
    var reqParklotNotBound = function (data){
        var reqData = {};
        reqData.areaCode=data;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREACONFIG.PARKLOT_NOTBOUND,
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
    var reqParklotBound = function (data) {
        var reqData = {};
        reqData.areaCode =data;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREACONFIG.PARKLOT_BOUND,
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
    var reqPostInsert = function (data) {
        var reqData = {};
        reqData.areaParklotReqs= [];
        //reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.areaParklotReqs.push({
                areaCode: data[i].data.areaCode,
                parklotCode: data[i].data.parklotCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.guideUrl.AREACONFIG.PARKLOT_INSERT,
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
    var reqDeleteInsert = function (data) {
        var reqData = {};
        reqData.areaParklotReqs = [];
        //reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.areaParklotReqs.push({
                areaCode: data[i].data.areaCode,
                parklotCode: data[i].data.parklotCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: Setting.guideUrl.AREACONFIG.PARKLOT_DELETE,
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
    /****************************************路段绑定***************************************************/
    var reqSectionNotBound = function (data){
        var reqData = {};
        reqData.areaCode=data;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREACONFIG.SECTION_NOTBOUND,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS){
                deferred.resolve(resp.data);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };
    var reqSectionBound = function (data) {
        var reqData = {};
        reqData.areaCode =data;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.AREACONFIG.SECTION_BOUND,
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
    var reqPostSection = function (data) {
        var reqData = {};
        reqData.areaSectionReqs= [];
        //reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.areaSectionReqs.push({
                areaCode: data[i].data.areaCode,
                sectionCode: data[i].data.sectionCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.guideUrl.AREACONFIG.SECTION_INSERT,
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
    var reqDeleteSection = function (data) {
        var reqData = {};
        reqData.areaSectionReqs = [];
        //reqData.opUser=sessionCache.getUserCode();
        for (var i = 0; i < data.length; i++) {
            reqData.areaSectionReqs.push({
                areaCode: data[i].data.areaCode,
                sectionCode: data[i].data.sectionCode
            });
        }
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: Setting.guideUrl.AREACONFIG.SECTION_DELETE,
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
        addArea: function (data) {
            return addArea(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        updateArea: function (data) {
            return updateArea(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
        reqParklotNotBound:function (data){
            return reqParklotNotBound(data);
        },
        reqParklotBound:function (data){
            return reqParklotBound(data);
        },
        reqPostInsert:function(data){
            return reqPostInsert(data);
        },
        reqDeleteInsert:function(data){
            return reqDeleteInsert(data);
        },
        reqSectionNotBound:function (data){
            return reqSectionNotBound(data);
        },
        reqSectionBound:function (data){
            return reqSectionBound(data);
        },
        reqPostSection:function(data){
            return reqPostSection(data);
        },
        reqDeleteSection:function(data){
            return reqDeleteSection(data);
        }

    }
});
