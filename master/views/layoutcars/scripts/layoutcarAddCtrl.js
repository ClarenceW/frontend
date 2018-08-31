'use strict';

angular.module('parkingApp').controller(
	'layoutcarAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, layoutcarService,sessionCache,StateName,companyService,$timeout) {

    var indexId = "#layoutcarAdd";
    $scope.submited = false;

    $scope.formData = {};
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.layoutcars.index;
    $scope.colorOptions=sessionCache.getDictsByLookupName("PLATE_COLOR");

    /* $scope.tempData.dt = new Date();
    $scope.tempData.dt2 = new Date();*/

    ///---datepicker-popup plugin---///
    $scope.format = "yyyy-MM-dd";

    $scope.open = function () {
        $scope.tempData.opened = true;
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

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
        if (isValid) {
            layoutcarService.addLayout($scope.formData).then(function (msg) {
                growl.addInfoMessage("新增成功", {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };
    
});