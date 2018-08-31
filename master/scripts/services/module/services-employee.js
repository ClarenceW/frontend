'use strict';

appService.factory("employeeService",['$q', '$http', 'Setting', '$log','sessionCache', 
	function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";
    var reqPagination = function (data) {
        var reqData = {};
        reqData.code= data.code;
        reqData.name= data.name;
        reqData.deptName= data.deptName;
        reqData.phoneNumber= data.phoneNumber;
        reqData.start = data.start;
        reqData.length = data.length;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.EMPLOYEEMES.EMPLOYEEMES_PAGINATION,
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

    var reqAddEmployee = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.name = data.name;
        reqData.phoneNumber = data.phoneNumber;
        reqData.deptCode = data.deptCode;
        reqData.roleCode =data.roleCode;
        reqData.passwd = data.passwd;
        reqData.verifyPasswd = data.verifyPasswd;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: Setting.lotUrl.EMPLOYEEMES.EMPLOYEEMES_ADD,
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.msg);
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
        reqData.code = data.code;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: Setting.lotUrl.EMPLOYEEMES.EMPLOYEEMES_DELETE,
            data: reqData
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

    var updateEmployee = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.name = data.name;
        reqData.phoneNumber = data.phoneNumber;
        reqData.deptCode = data.deptCode;
        reqData.roleCode =data.roleCode;
        reqData.passwd = data.passwd;
        reqData.verifyPasswd = data.verifyPasswd;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: Setting.lotUrl.EMPLOYEEMES.EMPLOYEEMES_UPDATE,
            data: reqData,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("运营公司修改成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqDetail = function () {
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.EMPLOYEEMES.EMPLOYEEMES_DETAIL,
            method: 'GET',
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
        reqAddEmployee: function (data) {
            return reqAddEmployee(data);
        },
        reqDelete: function (data) {
            return reqDelete(data);
        },
        updateEmployee: function (data) {
            return updateEmployee(data);
        },
        reqDetail: function () {
            return reqDetail();
        }
    }
}]);
