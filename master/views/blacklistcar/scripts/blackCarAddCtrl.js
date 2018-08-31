'use strict';

angular.module('parkingApp').controller(
	'blackCarAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, blacklistcarService,sessionCache,StateName,companyService,$timeout,parklotsService) {

    var indexId = "#blacklistcarAdd";
    $scope.submited = false;

    $scope.formData = {};
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.blacklistcars.index;
    $scope.colorOptions=sessionCache.getDictsByLookupName("PLATE_COLOR");
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });

    /* $scope.tempData.dt = new Date();
    $scope.tempData.dt2 = new Date();*/

    ///---datepicker-popup plugin---///
    $scope.format = "yyyy-MM-dd";

    $scope.open = function () {
        $scope.tempData.opened = true;
    };
    $scope.open2 = function () {
        $scope.tempData.opened2 = true;
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        return false;
    }

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2025, 12, 31),
        minDate: new Date(2015, 1, 1),
        startingDay: 1
    };

    $scope.dateOptions2 = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2025, 12, 31),
        minDate: new Date(2015, 1, 1),
        startingDay: 1
    };

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
        if (isValid) {
            blacklistcarService.addBlacklist($scope.formData).then(function (msg) {
                growl.addInfoMessage('新增成功', {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };
    
});