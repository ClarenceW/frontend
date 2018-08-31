'use strict';
angular.module('parkingApp').controller('vipvehicleDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','vipvehicleService','growl','customerService','$compile','$timeout',
	function($scope, $state, StateName,sessionCache,Setting,vipvehicleService,growl,customerService,$compile,$timeout) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.vipvehicle.index;
    $scope.passcar = false;
    var detailId = "#vipvehicle-detail";
    var passcarRecordTableId = detailId + " #pass-car-table";
    vipvehicleService.reqDetail($state.params.orderCode).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.orderCode = dto.orderCode;
        $scope.formData.plate = dto.plate;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.cardType = sessionCache.getLookupValueByLookupName('CARD_TYPE',dto.cardType);
        $scope.formData.parklotNames = dto.parklotNames;
        $scope.formData.phoneNum = dto.phoneNum;
        $scope.formData.paySrc = sessionCache.getLookupValueByLookupName('MONTHCARD_PAY_TYPE',dto.payType);
        $scope.formData.channel = sessionCache.getLookupValueByLookupName('MONTH_CARD_PAY_SRC',dto.channel);
        $scope.formData.payMoney = dto.payMoney+"元";
        $scope.formData.opUser = dto.opUser;
        $scope.formData.rechargeTime = dto.rechargeTime;
    }

    $scope.toParkingRecord = function () {
      var oTable = null;
      var initTable = function () {
          oTable = $(passcarRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
              "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
              "ajax": function (data, callback, settings) {
                vipvehicleService.reqList($scope.formData.orderCode).then(function (resp) {
                    callback(resp)
                  }, function (msg) {
                      growl.addErrorMessage(msg, {ttl: 2000});
                  });
              },
              destroy:true,
              "columns": [
                  {"data": "orderCode"},
                  {"data": "cardCode"},
                  {"data": "payMoney"},
                  {"data": "createTime", "render": function (data, type, full) {
                      if (data) {
                          var _date = new Date(data);
                          return _date.format("yyyy-MM-dd hh:mm:ss");
                      } else {
                          return "";
                      }
                  }},
                  {"data": "status","render": (data, type, full) => {
                      var status = sessionCache.getLookupValueByLookupName('BO_ORDER_STATUS', data);
                      return status;
                  }},
              ],
          }));
      };
      if ($scope.passcar === true) {
          $scope.passcar = false;
      } else {
          $scope.passcar = true;
          $timeout(function () {
              initTable();
          });
      }
    };
    $scope.back = function() {
      $state.go($scope.stateGoIndex, {params:$state.params.params,flg:1 });
    }
		
	}
]);