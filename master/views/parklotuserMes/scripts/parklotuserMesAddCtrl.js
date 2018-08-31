'use strict';

angular.module('parkingApp').controller(
	'parklotuserMesAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, parklotsService,sessionCache,StateName,companyService,$timeout,parklotuserMesService) {

    $scope.submited = false;

    $scope.formData = {};
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

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
        if (isValid) {
          parklotuserMesService.reqAddParkLotuser($scope.formData).then(function (msg) {
                growl.addInfoMessage(msg, {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };
});