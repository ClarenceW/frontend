'use strict';

appService.factory("parkrecordService", function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";
    var reqPagination = function (data) {
        var reqData = {};
        reqData.name= data.name;
        reqData.parklotCode = data.parklotCode;
        reqData.isOp = data.isOp;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            // url: Setting.lotUrl.PARKLOTS.PARKLOTS_PAGINATION,
            url:'scripts/services/module/data/parkrecord.json',
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

    var reqAddParkLot = function (data) {
        var reqData = {};
        reqData.parklotCode  = data.parklotCode ;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.description = data.description;
        reqData.lat =data.lat;
        reqData.lng = data.lng;
        //reqData.districtCode = data.districtCode;
        reqData.berthNum = data.berthNum;
        reqData.companyCode = data.companyCode;
        reqData.isFree = data.isFree;
        reqData.parklotAttr = data.parklotAttr;
        reqData.parklotStyle = data.parklotStyle;
        reqData.parklotType = data.parklotType;
        reqData.pic1 = data.pic1;
        reqData.pic2 = data.pic2;
        reqData.pic3 = data.pic3;
        reqData.isOp = data.isOp;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_ADD,
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("停车场新增成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var reqDelete = function (data) {
        var reqData = {};
        reqData.parklotCode = data.parklotCode;
        var deferred = $q.defer();
        $http({
            method: 'get',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_DELETE,
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("删除成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqUpdate = function (data) {
        var reqData = {};
        reqData.parklotCode = data.parklotCode;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.berthNum = data.berthNum;
        reqData.districtCode = data.districtCode;
        reqData.companyCode = data.companyCode;
        reqData.description = data.description;
        reqData.isFree = data.isFree;
        reqData.parklotAttr = data.parklotAttr;
        reqData.parklotStyle = data.parklotStyle;
        reqData.parklotType = data.parklotType;
        reqData.pic1 = data.pic1;
        reqData.pic2 = data.pic2;
        reqData.pic3 = data.pic3;
        reqData.lat =data.lat;
        reqData.lng = data.lng;
        reqData.isOp = data.isOp;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'post',
            url: Setting.lotUrl.PARKLOTS.PARKLOTS_UPDATE,
            data: reqData,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("停车场信息修改成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqDetail = function (data) {
        var reqData = {};
        reqData.parklotCode = data.parklotCode;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.PARKLOTS.PARKLOTS_DETAIL,
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
        reqAddParkLot: function (data) {
            return reqAddParkLot(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        reqUpdate: function (data) {
            return reqUpdate(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        }
    }
});
