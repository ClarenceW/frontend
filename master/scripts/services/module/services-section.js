'use strict';

appService.factory("sectionService", function (sessionCache, $q, $http, Setting, $log) {

    var errorMsg = "数据加载异常...";

    /**
     * 用于路段管理分页搜索
     * @param data
     * @returns {*}
     */
    var reqPagination = function (data) {
        var reqData = {};
        reqData.sectionCode = data.sectionCode;
        reqData.name = data.name;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.guideUrl.SECTION.SECTION_PAGINATION,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.aaData) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function (resp) {
            if (resp && resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用于路段管理新增操作
     * @param data
     * @returns {*}
     */
    var addSection = function (data) {
        var reqData = {};
        reqData.sectionCode = data.sectionCode;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.lat = data.lat;
        reqData.lng= data.lng;
        reqData.berthNum = data.berthNum;
        reqData.districtCode = data.districtCode;
        reqData.areaCode = data.areaCode;
        reqData.companyCode = data.companyCode;
        reqData.isOp = data.isOp;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.roadUrl.SECTION.SECTION_ADD,
            method: 'post',
            data: reqData
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp);
            }
        }).error(function (resp) {
            if (resp && resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用于路段管理删除操作
     * @param data
     * @returns {*}
     */
    var reqDelete = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.sectionCode = data.sectionCode;
        $http({
            url: Setting.roadUrl.SECTION.SECTION_DEL,
            method: 'DELETE',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function (resp) {
            if (resp && resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用于路段管理编辑操作
     * @param data
     * @returns {*}
     */
    var updateSection = function (data) {
        var reqData = {};
        reqData.sectionCode = data.sectionCode;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.lat = data.lat;
        reqData.lng= data.lng;
        reqData.berthNum = data.berthNum;
        reqData.districtCode = data.districtCode;
        reqData.areaCode = data.areaCode;
        reqData.companyCode = data.companyCode;
        reqData.isOp = data.isOp;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.roadUrl.SECTION.SECTION_UPDATE,
            method: 'PUT',
            data: reqData
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function (resp) {
            if (resp && resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用于路段管理编辑操作中的获取详情
     * @param data
     * @returns {*}
     */
    var reqDetail = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.sectionCode = data.sectionCode;
        $http({
            url: Setting.guideUrl.SECTION.SECTION_DETAIL,
            method: 'get',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function (resp) {
            if (resp && resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    ///**
    // * 地图态势-地磁(先查出所有有效路段)
    // * @returns {*}
    // */
    //var reqList = function () {
    //    var deferred = $q.defer();
    //    var reqData = {};
    //    $http({
    //        url: Setting.HttpUrl.SECTION.SECTION_LIST,
    //        method: 'get',
    //        params: reqData,
    //    }).success(function (resp) {
    //        if (resp && resp.data) {
    //            var arrayVo = [];
    //            resp.data.forEach(function (element) {
    //                var itemVo = {};
    //                itemVo.sectionCode = element.sectionCode; // 路段编号
    //                itemVo.name = element.name; // 名称
    //                itemVo.lat = element.lat; // 纬度
    //                itemVo.lng = element.lng; // 经度
    //                itemVo.abnormalSum = element.abnormalSum; // 电量低或者掉线的异常地磁总数
    //                arrayVo.push(itemVo);
    //            });
    //            deferred.resolve(arrayVo);
    //        } else if (resp && resp.msg) {
    //            deferred.reject(resp.msg);
    //        } else {
    //            deferred.reject(errorMsg);
    //        }
    //    }).error(function (resp) {
    //        if (resp && resp.msg) {
    //            deferred.reject(resp.msg);
    //        } else {
    //            deferred.reject(errorMsg);
    //        }
    //    });
    //    return deferred.promise;
    //}

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
        }
        //reqList: function () {
        //    return reqList();
        //}

    }
});
