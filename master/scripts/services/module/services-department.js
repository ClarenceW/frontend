'use strict';
appService.factory("departmentService", function ($q, $http, Setting, sessionCache) {
    var errorMsg = "报错了...";
    /**
     * 获取用户列表
     * @param data
     * @returns {*}
     */
    var reqUserPagination = function (data) {
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            // url: Setting.lotUrl.PARKLOTS.PARKLOTS_PAGINATION,
            url:'scripts/services/module/data/department.json',
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

    /**
     * 获取用户详情
     * @param data
     * @returns {*}
     */
    var getUserDetail = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        $http({
            url: Setting.authUrl.USER.SYSUSER_USERDETAIL,
            method: 'get',
            params: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /**
     * 更新用户信息
     * @param data
     * @returns {*}
     */
    var updateSysUser = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.roleCode = data.roleCode;
        reqData.userType = "2";
        reqData.deptName = data.deptName;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.authUrl.USER.SYSUSER_UPDATEUSER,
            method: 'PUT',
            data: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };


    return {
        reqUserPagination: function (data) {
            return reqUserPagination(data);
        },
        getUserDetail: function (data) {
            return getUserDetail(data);
        },
        updateSysUser: function (data) {
            return updateSysUser(data);
        }
    }
});

