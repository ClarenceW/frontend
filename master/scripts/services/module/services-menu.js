'use strict';

appService.factory("menuService", function (sessionCache, $q, $http, Setting, $log,menuVariables) {

    var errorMsg = "数据加载异常...";

    /**
     * 根据登录角色返回所有的权限菜单
     * @param data
     * @returns {*}
     */
    var reqList = function (data) {
        var reqData = {};
        reqData.roleCode = data.roleCode;
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.MENU.LIST,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
        	
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS && angular.isArray(resp.data)) {
            	var menus = menuVariables.menus;
            	for(let item of menus){
            		resp.data.push(item);
            	}
                var mapVo = new Map();
                resp.data.forEach(function (element) {
                    var item = {
                        code: element.menuCode,
                        name: element.menuName,
                        icon: element.menuIcon,
                        uiSref: element.menuUrl,
                        menuSort: element.menuSort
                    };
                    console.log(element.menuName)
                    if (mapVo.containsKey(element.parentCode)) {
                        mapVo.get(element.parentCode).push(item);
                    } else {
                        mapVo.put(element.parentCode, []);
                        mapVo.get(element.parentCode).push(item);
                    }
                });
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

    var reqPagination = function (data) {
        var reqData = {};
        reqData.menuName = data.menuName;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.MENU.MENU_PAGINATION,
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

    var addSection = function (data) {
        var reqData = {};
        reqData.menuName = data.menuName;
        reqData.menuUrl = data.menuUrl;
        reqData.menuIcon = data.menuIcon;
        reqData.menuSort = data.menuSort;
        reqData.parentCode = data.parentCode;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.MENU.MENU_ADD,
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
        reqData.menuCode = data.menuCode;
        $http({
            url: Setting.authUrl.MENU.MENU_DEL,
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
        reqData.menuCode = data.menuCode;
        //reqData.menuName = data.menuName;
        //reqData.menuUrl = data.menuUrl;
        //reqData.parentCode = data.parentCode;
        reqData.menuIcon = data.menuIcon;
        reqData.menuSort = data.menuSort;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.MENU.MENU_UPDATE,
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
        reqData.menuCode = data.menuCode;
        $http({
            url: Setting.authUrl.MENU.MENU_DETAIL,
            method: 'get',
            params: reqData
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
        reqList: function (data) {
            return reqList(data);
        }
    }
});
