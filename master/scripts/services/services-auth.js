'use strict';
(function () {
    /**
     *   用户服务
     */
    appService.factory("authenticationSvc", function ($rootScope, $http, $state, $q, Setting, $log, StateName, sessionCache, menuService, dictService,$cookieStore) {

        var errorMsg = "数据加载异常...";
        var menuErrorMsg = "权限菜单为空...";
        var dicEmptyMsg = "加载的数据字典为空...";

        var login = function (username, password,remember) {
            var reqData = {};
            reqData.userCode = username;
            reqData.pwd = $.md5(password);
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: Setting.authUrl.LOGIN,
                data: reqData,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                var result = response.data;
                if (result && result.data && result.code === Setting.ResultCode.CODE_SUCCESS && result.data.sid) {
                    var userData = result.data;
                    if (userData && userData.roleCode) {
                        sessionCache.initUser(userData);
                        menuService.reqList(userData).then(function (menuMapVo) {
                            if (menuMapVo && menuMapVo.size() > 0) {
                                dictService.reqList().then(function (dictMapVo) {
                                    if (dictMapVo && dictMapVo.size() > 0) {
                                        sessionCache.initDicts(dictMapVo);
                                    } else {
                                        $log.warn("dict is empty...")
                                    }
                                    sessionCache.initMenus(menuMapVo);
                                    if(remember){
                                    	$cookieStore.put("lremember",true);
                                    	$cookieStore.put("lname",username);
                                    	$cookieStore.put("lpassword",password);
                                    }else{
                                    	$cookieStore.put("lremember",false);
                                    	$cookieStore.remove("lname");
                                    	$cookieStore.remove("lrpassword");
                                    }
                                    $state.go(StateName.home);
                                }, function (msg) {
                                    deferred.reject(msg);
                                });
                            } else {
                                deferred.reject(menuErrorMsg);
                            }
                        }, function (msg) {
                            deferred.reject(msg);
                        });
                    }
                } else {
                    deferred.reject(result.msg);
                }
            }, function errorCallback(response) {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        };

        var logout = function (usercode) {
            var reqData = {};
            reqData.userCode = usercode;
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: Setting.authUrl.LOGOUT,
                data: reqData,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                var result = response.data;
                if (result && result.code === Setting.ResultCode.CODE_SUCCESS) {
                    deferred.resolve(result.msg);
                } else {
                    deferred.reject(result.msg);
                }
            }, function errorCallback(response) {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        };

        var modifyPwd = function(data){
            var reqData = {};
            reqData.userCode = data.userCode;
            reqData.oldPwd =  $.md5(data.oldPwd);
            reqData.newPwd =  $.md5(data.newPwd);
            reqData.checkPwd =  $.md5(data.checkPwd);
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: Setting.authUrl.USER.MODIFYPWD,
                data: reqData,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function successCallback(response) {
                var result = response.data;
                if (result && result.code === Setting.ResultCode.CODE_SUCCESS) {
                    deferred.resolve(result.data);
                } else {
                    deferred.reject(result.msg);
                }
            }, function errorCallback(response) {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        };

        return {
            login: login,
            logout: logout,
            modifyPwd:modifyPwd
        };
    });

})();