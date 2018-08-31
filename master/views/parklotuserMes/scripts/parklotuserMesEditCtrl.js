'use strict';
angular.module('parkingApp').controller('parklotuserMesEditCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sessionCache, parklotsService, parklotuserMesService,$timeout) {

    $scope.formData = {};
    $scope.deptOptions = [];
    $scope.stateGoIndex = StateName.parklotuser.index;
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });
    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': '',
        'actionsBox':true,
      });
    },200);

    parklotuserMesService.reqDetail($state.params.userCode).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    $scope.submitForm = function (isValid) {
        if (isValid) {
          parklotuserMesService.reqUpdate($scope.formData).then(function (msg) {
                growl.addInfoMessage("收费员资料修改成功！", {ttl: 2000});
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
        $scope.formData.userPhone = dto.userPhone;
        $scope.formData.userPasswd = dto.userPasswd;
        $scope.formData.pwdconfirm = dto.userPasswd;
        $scope.formData.parklotCodes = dto.parklotCodes;
        $scope.formData.enable = dto.enable;
        $scope.formData.status = dto.status;
        $scope.formData.description = dto.description;
        $timeout(function() {
          $('.selectpicker').selectpicker({
            'selectedText': '',
            'actionsBox':true,
          });
        },200);
    }
});
