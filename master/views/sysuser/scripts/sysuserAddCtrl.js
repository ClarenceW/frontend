'use strict';

angular.module('parkingApp').controller('SysuserAddCtrl',
    function ($timeout, $rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sessionCache, roleService, userService) {

        $scope.formData = {};
        $scope.deptOptions = [];
        $scope.alertDanger;
        $scope.stateGoIndex = StateName.user.index;
        $scope.userTypeOption = sessionCache.getUserTypeGroup();
        $scope.register = false;
        $scope.grant = false;
        $scope.role = false;
        $scope.userCodeRegexpValid = true;
        $scope.roleNameOption = [];
        $scope.submited = false;

        roleService.getRoleList().then(function (resp) {
            $scope.roleNameOption = resp.data;
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });

        $scope.alertClose = function () {
            $scope.alertDanger = false;
        };

        $scope.grantUser = function (isValid) {
            if (isValid) {
                userService.grantUser($scope.formData).then(function (msg) {
                    growl.addInfoMessage("用户授权成功！", {ttl: 2000});
                    $state.go($scope.stateGoIndex);
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            } else {
                $scope.alertDanger = true;
            }
        };

        $scope.registerUser = function (isValid) {
          $scope.submited = true;
            if (isValid) {
                userService.registerUser($scope.formData).then(function (msg) {
                    growl.addInfoMessage("用户新增成功！", {ttl: 2000});
                    $state.go($scope.stateGoIndex);
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            } else {
                $scope.alertDanger = true;
            }
        };

        $scope.$watch('formData.userCode', function (newValue, oldValue, scope) {
            if (/^[1][3458][0-9]{9}$/.test(newValue)) {
                userService.getUserCheck({userCode: newValue}).then(function (retData) {
                    if (retData == 1) {
                        $scope.grant = false;
                        $scope.register = false;
                        $scope.role = false;
                        growl.addWarnMessage("用户已存在...", {ttl: 2000});
                    } else if (retData == -1) {
                        $scope.grant = true;
                        $scope.register = false;
                        $scope.role = true;
                        growl.addInfoMessage("用户未授权...", {ttl: 2000});
                    } else {
                        $scope.grant = false;
                        $scope.register = true;
                        $scope.role = true;
                        growl.addInfoMessage("用户可注册...", {ttl: 2000});
                    }
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
                $scope.userCodeRegexpValid = true;
            } else {
                $scope.grant = false;
                $scope.register = false;
                $scope.role = false;
                $scope.userCodeRegexpValid = false;
            }
        });

    });
