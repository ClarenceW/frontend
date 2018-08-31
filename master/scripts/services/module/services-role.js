'use strict';
appService.factory("roleService", function ($q, $http, Setting, sessionCache, $log) {
    var errorMsg = "报错了...";
    var reqRolePagination = function (data) {
        var reqData = {};
        reqData.roleName = data.roleName;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.ROLE.ROLE_PAGINATION,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.aaData) {
                var vo = {};
                vo.iTotalDisplayRecords = resp.iTotalDisplayRecords;
                vo.iTotalRecords = resp.iTotalRecords;
                vo.aaData = [];
                for (var index in resp.aaData) {
                    var itemVo = {};
                    itemVo.roleCode  = resp.aaData[index].roleCode ;
                    itemVo.roleName  = resp.aaData[index].roleName ;
                    itemVo.menuNames  = resp.aaData[index].menuNames ;
                    itemVo.roleStatus  = resp.aaData[index].roleStatus ;
                    itemVo.memo  = resp.aaData[index].memo ;
                    itemVo.opUser = resp.aaData[index].opUser;
                    itemVo.sysTime = resp.aaData[index].sysTime;
                    vo.aaData.push(itemVo);
                }
                deferred.resolve(vo);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    var addRole = function (data) {
        var reqData = {};
        reqData.roleName = data.roleName;
        reqData.roleStatus = data.roleStatus;
        reqData.memo = data.memo;
        reqData.menuCodes = data.menuCodes;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.ROLE.ROLE_ADD,
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
    var updateRole = function(data){
        var reqData = {};
        reqData.roleCode = data.roleCode;
        reqData.roleName = data.roleName;
        reqData.roleStatus = data.roleStatus;
        reqData.memo = data.memo;
        reqData.menuCodes = data.menuCodes;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.ROLE.ROLE_EDIT,
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
    var getRoleByCode = function(data){
        var deferred = $q.defer();
        var reqData = {};
        reqData.roleCode = data;
        $http({
            url: Setting.authUrl.ROLE.ROLE_DETAIL,
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
    var delRole = function(roleCode){
        var deferred = $q.defer();
        var reqData = {};
        reqData.roleCode = roleCode;
        $http({
            url: Setting.authUrl.ROLE.ROLE_DELETE,
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
    var getSysMenu = function(){
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.MENU.MENU_ALL_TREE,
            method: 'GET'
            //params: reqData
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

    var getRoleList = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.USER.ROLE_LIST,
            method: 'GET'
        }).success(function (resp) {
            if (resp.data) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    var getPermissionByCode = function(data){
        var deferred = $q.defer();
        var reqData = {};
        reqData.roleCode = data;
        $http({
            url: Setting.authUrl.ROLE.ROLE_PERMISSION,
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

    var updatePermission = function(data){
        var reqData = {};
        reqData.roleCode = data.roleCode;
        reqData.parklotPermission = data.parklotPermission;
        reqData.parklotCodes = data.parklotCodes;
        var deferred = $q.defer();
        $http({
            url: Setting.authUrl.ROLE.ROLE_PERMISSION_UPDATE,
            method: 'POST',
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

    return {
        reqRolePagination:function(data){
            return reqRolePagination(data);
        },
        addRole:function(data){
            return addRole(data);
        },
        updateRole:function(data){
          return updateRole(data);
        },
        getRoleList: function () {
            return getRoleList();
        },
        delRole:function(data){
            return delRole(data);
        },
        getSysMenu:function(){
            return getSysMenu();
        },
        getRoleByCode:function(data){
            return getRoleByCode(data);
        },
        getPermissionByCode:function(data){
            return getPermissionByCode(data);
        },
        updatePermission:function(data){
            return updatePermission(data);
        },
    }
});

