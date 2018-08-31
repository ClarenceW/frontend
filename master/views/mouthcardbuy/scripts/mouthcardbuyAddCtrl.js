'use strict';

angular.module('parkingApp').controller(
	'mouthcardbuyAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, mouthcardBuyService,sessionCache,StateName,companyService,$timeout) {

    var indexId = "#mouthcardbuyAdd";
    $scope.submited = false;
    $scope.stateGoAdd = StateName.mouthcardbuy.add;

    $scope.formData = {};
    $scope.formData.money =0;
    $scope.tempData = {};
    $scope.dt = null;

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
    function getInvalidTime() {
      let thirdyDay = '';
      function getDays(param) {
          var myDate = new Date(param).getTime();
          var lw = myDate + 1000 * 60 * 60 * 24 * 30;
          lw = timestampToTime(lw);
          return lw;
      }
      function timestampToTime(timestamp) {
          var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate();
          return Y+M+D;
      }
      let nowDay = new Date().format("yyyy-MM-dd")
      thirdyDay = getDays(nowDay);
      return thirdyDay;
    }
    let aa = getInvalidTime();
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(aa),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.stateGoIndex = StateName.mouthcardbuy.index;
    $scope.colorOptions=sessionCache.getDictsByLookupName("PLATE_COLOR");
    let data = '';
    mouthcardBuyService.reqList(data).then(function (res) {
      $scope.cardCodeOptions = res;
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    mouthcardBuyService.reqcarOwnList().then(function (res) {
      $scope.vehicleOwnOptions = res;
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    $scope.addcarOwn = function() {
      if($scope.formData.carOwn) {
        let vehicleOwnName = $scope.formData.carOwn;
        mouthcardBuyService.reqAddcarOwn(vehicleOwnName).then(function (res) {
          growl.addInfoMessage('车辆归属新增成功！', {ttl: 2000});
          mouthcardBuyService.reqcarOwnList().then(function (res) {
            $scope.vehicleOwnOptions = res;
          }, function (msg) {
              growl.addErrorMessage(msg, {ttl: 2000});
          });
          $scope.formData.carOwn = '';
        }, function (msg) {
          growl.addErrorMessage(msg, {ttl: 2000});
        });
      }else {
        growl.addInfoMessage('请输入车辆归属！', {ttl: 2000});
      }
    };

    $scope.$watch('formData.cardCode',function(newValue,oldValue) {
      if(newValue) {
        mouthcardBuyService.reqList(newValue).then(function (res) {
          $scope.formData.money = res[0].price;
          $scope.formData.cardName = res[0].cardName;
          $scope.formData.cardType = sessionCache.getLookupValueByLookupName('CARD_TYPE',res[0].type);
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
      }
    }, true);

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
      if (isValid) {
        let data = {};
        data.plate = $scope.formData.plate;
        data.validTime = new Date($scope.formData.validTime).format("yyyy-MM-dd");
        data.plateColor = $scope.formData.plateColor;
        data.userName = $scope.formData.userName;
        data.cardCode = $scope.formData.cardCode;
        data.cardName = $scope.formData.cardName;
        data.opUser = $scope.formData.opUser;
        data.phoneNum = $scope.formData.phoneNum;
        data.vehicleOwn = $scope.formData.vehicleOwn;
        for(var i = 0;i < $scope.cardCodeOptions.length;i++) {
          if(data.cardCode == $scope.cardCodeOptions[i].cardCode) {
            data.cardType = $scope.cardCodeOptions[i].type;
          }
        }
        mouthcardBuyService.addCard(data).then(function (msg) {
              growl.addInfoMessage('新增成功', {ttl: 2000});
              // $scope.formData = {};
              $state.reload($scope.stateGoAdd);
          }, function (msg) {
              growl.addErrorMessage(msg, {ttl: 2000});
          });
      }
    };
    
});