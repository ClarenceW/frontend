'use strict';

angular.module('parkingApp').controller('MenusEditCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, menuService) {

    var indexId = "#menuEditIndex";
    $scope.formData = {};
    $scope.stateGoIndex = StateName.menu.index;

    menuService.reqDetail($state.params).then(function (res) {
        fillForm(res.data);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });
    $scope.submitForm = function (isValid) {
        if (isValid) {
            menuService.updateSection($scope.formData).then(function (resp) {
                if (resp.data) {
                    growl.addInfoMessage("菜单修改成功", {ttl: 2000});
                    $state.go($scope.stateGoIndex);
                } else {
                    growl.addErrorMessage(resp.msg, {ttl: 2000});
                }
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        } else {
            $scope.alertDanger = true;
        }
    };

    function fillForm(dto) {
        $scope.formData.menuCode = dto.menuCode;
        $scope.formData.menuName = dto.menuName;
        $scope.formData.menuUrl = dto.menuUrl;
        $scope.formData.menuIcon = dto.menuIcon;
        $scope.formData.menuSort = dto.menuSort;
        $scope.formData.parentCode = dto.parentCode;
    }

});
