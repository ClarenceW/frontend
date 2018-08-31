'use strict';

angular.module('parkingApp').controller(
	'whiteCarAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, whitelistcarService,sessionCache,StateName,companyService,$timeout,parklotsService) {

    var indexId = "#whitelistcarAdd";
    $scope.submited = false;
    $scope.selectTime = false;

    $scope.formData = {};
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.whitelistcars.index;
    $scope.colorOptions=sessionCache.getDictsByLookupName("PLATE_COLOR");
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });
    $scope.formData.startTime = new Date();
    $scope.formData.endTime = new Date();

    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': '',
        'actionsBox':true,
      });
    },200);
      

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
        minDate: new Date(2005, 1, 1),
        startingDay: 1
    };

    $scope.dateOptions2 = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2025, 12, 31),
        minDate: new Date(2005, 1, 1),
        startingDay: 1
    };

    $('input[type=radio][name=validtime]').change(function() {
        if (this.value == 1) {
          $scope.formData.startTime = new Date();
          $scope.formData.endTime = new Date();
          $(".selectTime").hide();
          $scope.selectTime = false;
        }else if(this.value == 2) {
          $scope.formData.startTime = new Date();
          $scope.formData.endTime = new Date('2030-12-31');
          $(".selectTime").hide();
          $scope.selectTime = false;
        }else {
          $(".selectTime").show();
          $scope.selectTime = true;
        }
    });

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
      if (isValid) {
        let data = {};
        data.plate = $scope.formData.plate;
        data.plateColor = $scope.formData.plateColor;
        data.userCode = $scope.formData.userCode;
        data.userName = $scope.formData.userName;
        data.parklotCode = $scope.formData.parklotCode;
        if(!$scope.formData.startTime) {
          growl.addErrorMessage("开始时间不能为空", {ttl: 2000});
          return;
        }
        if(!$scope.formData.endTime) {
          growl.addErrorMessage("结束时间不能为空", {ttl: 2000});
          return;
        }
        data.startTime = $scope.formData.startTime.format("yyyy-MM-dd");
        data.endTime = $scope.formData.endTime.format("yyyy-MM-dd");
        data.description = $scope.formData.description;
        whitelistcarService.addlist(data).then(function (msg) {
              growl.addInfoMessage('新增成功', {ttl: 2000});
              $state.go($scope.stateGoIndex);
          }, function (msg) {
              growl.addErrorMessage(msg, {ttl: 2000});
          });
      }
    };
    
});