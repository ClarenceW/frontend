/**
 * Created by Administrator on 2016/8/1.
 */

'use strict';

angular.module('parkingApp').controller('MenusAddCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, menuService, StateName) {

    var indexId = "#menuAddIndex";
    var mapOpenBtn = indexId + " #mapOpenBtn";
    var mapBtnSpan = indexId + " #mapBtnSpan";
    var mapWrapper = indexId + " #mapWrapper";
    var mapContainerId = "mapContainer";
    var MAP_STATUS_COLLAPSE = "collapse";
    var MAP_STATUS_EXPAND = "expand";
    var mapStatus = MAP_STATUS_COLLAPSE; // collapse or expand
    var mapRange = {width: 350, height: 300};

    $scope.formData = {};
    $scope.alertDanger;
    $scope.stateGoIndex = StateName.menu.index;
    var msg = "加载数据错误。。。。";
    $scope.alertClose = function () {
        $scope.alertDanger = false;
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            menuService.addSection($scope.formData).then(function (resp) {
                if (resp.data > 0) {
                    growl.addInfoMessage("菜单新增成功", {ttl: 2000});
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

});

