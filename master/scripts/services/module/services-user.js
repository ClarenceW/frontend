'use strict';
appService.factory("userService", function ($q, $http, Setting, sessionCache) {
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
            url: Setting.authUrl.USER.SYSUSER_PAGINATION,
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
                    itemVo.userCode = resp.aaData[index].userCode;
                    itemVo.roleCode = resp.aaData[index].roleCode;
                    itemVo.roleName = resp.aaData[index].roleName;
                    itemVo.userType = resp.aaData[index].userType;
                    itemVo.userName = resp.aaData[index].userName;
                    itemVo.deptName = resp.aaData[index].deptName;
                    itemVo.registerTime = resp.aaData[index].registerTime;
                    itemVo.createUser = resp.aaData[index].createUser;
                    itemVo.pwdChangeTime = resp.aaData[index].pwdChangeTime;
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

    /**
     * 删除用户(取消授权)
     * @param data
     * @returns {*}
     */
    var delSysUser = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        $http({
            url: Setting.authUrl.USER.SYSUSER_DEL,
            method: 'DELETE',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            deferred.resolve(resp);
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

    /**
     * 重置密码
     */
    var resetPwd = function (data) {
      var deferred = $q.defer();
      var reqData = {};
      reqData.userCode = data.userCode;
      reqData.resetPwd = data.resetPwd;
      $http({
          url: Setting.authUrl.USER.SYSUSER_RESET,
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

    /**
     * 校验用户是否存在
     * @param data
     * @returns {*}
     */
    var getUserCheck = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        $http({
            url: Setting.authUrl.USER.CHECK,
            method: 'get',
            params: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function (resp) {
            if (resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用户授权
     * @param data
     * @returns {*}
     */
    var grantUser = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.roleCode = data.roleCode;
        $http({
            url: Setting.authUrl.USER.GRANT,
            method: 'POST',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.msg);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function (resp) {
            if (resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    /**
     * 用户注册
     * @param data
     * @returns {*}
     */
    var registerUser = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.userCode = data.userCode;
        reqData.roleCode = data.roleCode;
        reqData.pwd = $.md5(data.pwd);
        reqData.userType = "2";
        reqData.userName = data.userName;
        reqData.deptName = data.deptName;
        reqData.createUser = sessionCache.getUserCode();
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.authUrl.USER.SYSUSER_ADD,
            method: 'POST',
            data: reqData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.msg);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function (resp) {
            if (resp.msg) {
                deferred.reject(resp.msg);
            } else {
                deferred.reject(errorMsg);
            }
        });
        return deferred.promise;
    };

    return {
        reqUserPagination: function (data) {
            return reqUserPagination(data);
        },
        delSysUser: function (data) {
            return delSysUser(data);
        },
        getUserDetail: function (data) {
            return getUserDetail(data);
        },
        updateSysUser: function (data) {
            return updateSysUser(data);
        },
        resetPwd: function (data) {
            return resetPwd(data);
        },
        getUserCheck: function (data) {
            return getUserCheck(data);
        },
        grantUser: function (data) {
            return grantUser(data);
        },
        registerUser: function (data) {
            return registerUser(data);
        }
    }
});

