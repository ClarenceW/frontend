'use strict';
angular.module('parkingApp').controller('SysuserEditCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sessionCache, roleService, userService) {

    $scope.formData = {};
    $scope.deptOptions = [];
    $scope.stateGoIndex = StateName.user.index;
    $scope.userTypeOption = sessionCache.getUserTypeGroup();
    $scope.roleNameOption = [];

    roleService.getRoleList().then(function (resp) {
        $scope.roleNameOption = resp.data;
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    userService.getUserDetail($state.params).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    $scope.submitForm = function (isValid) {
        if (isValid) {
            userService.updateSysUser($scope.formData).then(function (msg) {
                growl.addInfoMessage("用户信息修改成功！", {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        } else {
            $scope.alertDanger = true;
        }
    };

    function fillForm(dto) {
        $scope.formData.userCode = dto.userCode;
        $scope.formData.userName = dto.userName;
        $scope.formData.roleCode = dto.roleCode;
        $scope.formData.userType = dto.userType;
        $scope.formData.deptName = dto.deptName;
    }
});
