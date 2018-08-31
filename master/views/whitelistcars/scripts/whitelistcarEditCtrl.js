'use strict';
angular.module('parkingApp').controller('whitelistcarEditCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sessionCache, whitelistcarService,parklotsService,$timeout) {

    $scope.formData = {};
    $scope.deptOptions = [];
    $scope.tempData = {};
    $scope.stateGoIndex = StateName.whitelistcars.index;
    $scope.roleNameOption = [];
    $scope.format = "yyyy-MM-dd";
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });

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
        maxDate: new Date(2050, 12, 31),
        minDate: new Date(2005, 1, 1),
        startingDay: 1
    };

    $scope.dateOptions2 = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2050, 12, 31),
        minDate: new Date(2005, 1, 1),
        startingDay: 1
    };
    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': '',
        'actionsBox':true,
      });
    },200);
    whitelistcarService.reqDetail($state.params.data).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    $('input[type=radio][name=validtime]').change(function() {
      if (this.value == 1) {
        $scope.formData.startTime = new Date();
        $scope.formData.endTime = new Date();
        $(".selectTime").hide();
      }else if(this.value == 2) {
        $scope.formData.startTime = new Date();
        $scope.formData.endTime = new Date('2030-12-31');
        $(".selectTime").hide();
      }else {
        $(".selectTime").show();
      }
    });

    $scope.submitForm = function (isValid) {
        if (isValid) {
          let data = {};
          data.plate = $scope.formData.plate;
          data.plateColor = $scope.formData.plateColor;
          data.userCode = $scope.formData.userCode;
          data.userName = $scope.formData.userName;
          data.parklotCodes = $scope.formData.parklotCodes;
          data.description = $scope.formData.description;
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
          whitelistcarService.updateWhite(data).then(function (msg) {
                growl.addInfoMessage("白名单修改成功！", {ttl: 2000});
                $scope.back();
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };

    function fillForm(dto) {
        $scope.formData.plate = dto.plate;
        $scope.formData.plateColor = dto.plateColor;
        $scope.platecolor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotCodes = dto.parklotCodes;
        $timeout(function() {
          $('.selectpicker').selectpicker({
            'selectedText': '',
            'actionsBox':true,
          });
        },200);
        $scope.formData.userName = dto.userName;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.startTime = new Date(dto.startTime);
        $scope.formData.endTime = new Date(dto.endTime);
        let timeDiff = Math.floor((new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime())/(24*3600*1000));
        if(timeDiff >= 5 * 365) {
          $('input[type=radio][name=validtime]').eq(1).attr('checked',true);
          $(".selectTime").hide();
        }else if(dto.endTime == dto.startTime) {
          $('input[type=radio][name=validtime]').eq(0).attr('checked',true);
          $(".selectTime").hide();
        }else {
          $('input[type=radio][name=validtime]').eq(3).attr('checked',true);
          $(".selectTime").show();
        }
        if(dto.description=='null') {
          $scope.formData.description = '';
        }else {
          $scope.formData.description = dto.description;
        }
    }

    $scope.back = function() {
      $state.go($scope.stateGoIndex, {params:$state.params.params,flg:1 });
    }
});
