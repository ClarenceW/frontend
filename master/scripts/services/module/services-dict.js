'use strict';

appService.factory("dictService", function ($q, $http, Setting, $log, $sessionStorage) {

    var errorMsg = "数据加载异常...";
    var successMsg = "数据处理成功";

    /**
     * 查询数据字典并进行缓存
     * @returns 无数据则返回空map
     */
    var reqList = function () {
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.DICT.LIST,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                var mapVo = new Map();
                for (var index in resp.data.dictionaryList) {
                    var vo = {};
                    vo.lookupName = resp.data.dictionaryList[index].lookupName;
                    vo.lookupKey = resp.data.dictionaryList[index].lookupKey;
                    vo.lookupValue = resp.data.dictionaryList[index].lookupValue;
                    if (mapVo.containsKey(vo.lookupName)){
                        mapVo.get(vo.lookupName).push(vo);
                    } else {
                        mapVo.put(vo.lookupName, []);
                        mapVo.get(vo.lookupName).push(vo);
                    }
                }
                deferred.resolve(mapVo);
            } else {
                $log.error(resp.msg);
                deferred.reject(resp.msg);
            }
        }).error(function (resp) {
            $log.error(resp);
            if (resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(resp);
            }
        });
        return deferred.promise;
    };

    /**
     * 分页+搜索
     * @param data
     * @returns {*}
     */
    var reqPagination = function (data) {
        var reqData = {};
        reqData.lookupName = data.lookupName;
        reqData.lookupKey = data.lookupKey;
        reqData.draw = data.draw;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.DICT.PAGINATION,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.aaData) {
                var pageData = {};
                pageData.iTotalDisplayRecords = resp.iTotalDisplayRecords;
                pageData.iTotalRecords = resp.iTotalRecords;
                pageData.aaData = [];
                for (var index in resp.aaData) {
                    var vo = {};
                    vo.description = resp.aaData[index].description;
                    vo.lookupKey = resp.aaData[index].lookupKey;
                    vo.lookupName = resp.aaData[index].lookupName;
                    vo.lookupValue = resp.aaData[index].lookupValue;
                    vo.sysTime = resp.aaData[index].sysTime;
                    pageData.aaData.push(vo);
                }
                deferred.resolve(pageData);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    return {
        reqList: reqList,
        reqPagination: reqPagination
    }
});
