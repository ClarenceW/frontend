'use strict';
angular.module('parkingApp').controller('mouthpayrecordDetail', ['$scope', '$state', 'StateName','sessionCache','Setting','mouthpayrecordService','passcarService','growl','$timeout',
	function($scope, $state, StateName,sessionCache,Setting,mouthpayrecordService,passcarService,growl,$timeout) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.mouthpayrecord.index;
    $scope.passcar = false;
    var detailId = "#mouthpayrecord-detail";
    var passcarRecordTableId = detailId + " #pass-car-table";
    mouthpayrecordService.reqDetail($state.params.orderCode).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.orderCode = dto.orderCode;
        $scope.formData.thirdSn = dto.thirdSn;
        $scope.formData.transactionCode = dto.transactionCode;
        $scope.formData.cardCode = dto.cardCode;
        $scope.formData.phoneNum = dto.phoneNum;
        $scope.formData.plate = dto.plate;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.payType = sessionCache.getLookupValueByLookupName('MONTHCARD_PAY_TYPE',dto.payType);
        $scope.formData.paySrc = sessionCache.getLookupValueByLookupName('CARD_ORDER_SRC',dto.paySrc);
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.orderMoney = dto.orderMoney;
        $scope.formData.status = sessionCache.getLookupValueByLookupName('ORDER_STATUS',dto.status);
    }

    $scope.toParkingRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(passcarRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                  mouthpayrecordService.reqRecord($scope.formData.transactionCode).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                destroy:true,
                "columns": [
                    {"data": "orderCode"},
                    {"data": "plate"},
                    {"data": "cardCode"},
                    {"data": "sourceTerminal","render": (data, type, full) => {
                        var sourceTerminal = sessionCache.getLookupValueByLookupName('MONTH_CARD_PAY_SRC', data);
                        return sourceTerminal;
                    }},
                    {"data": "phoneNum"},
                    {"data": "createTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }},
                    {"data": "status","render": (data, type, full) => {
                        var passType = sessionCache.getLookupValueByLookupName('ORDER_STATUS', data);
                        return passType;
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