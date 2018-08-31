'use strict';
angular.module('parkingApp').controller('parkingrecordDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','parkingrecordService','$filter','$timeout','growl',
	function($scope, $state, StateName,sessionCache,Setting,parkingrecordService,$filter,$timeout,growl) {
    $scope.formData = {};
    $scope.parkingPay = false;
    let detailId = "#parkingRecord-detail";
    let parkingPayTableId = detailId + " #parking-parkingPay-table";
		$scope.stateGoIndex = StateName.parkingrecord.index;
    parkingrecordService.reqDetail($state.params.boId).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.boId = dto.boId;
        $scope.formData.traId = dto.traId;
        $scope.formData.plate = dto.plate;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.orderType = sessionCache.getLookupValueByLookupName('STOP_ORDER_SRC',dto.orderType);
        $scope.formData.orderStatus = sessionCache.getLookupValueByLookupName('BO_ORDER_STATUS',dto.orderStatus);
        $scope.formData.payableMoney = dto.payableMoney;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.laneName = dto.laneName;
    }

    $scope.toParkingPay = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(parkingPayTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                    parkingrecordService.reqParkingPayDetail($scope.formData.boId).then(function (resp) {
                        if (resp.code === Setting.ResultCode.CODE_SUCCESS) {
                            callback(resp)
                        } else {
                            growl.addErrorMessage("请求数据错误", {ttl: 2000});
                        }
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"data": "boId"},
                    {"data": "traId","render": (data,type,full) => {
                      if(data != 'null') 
                        return data;
                      else 
                        return '';
                    }},
                    {"data": "plate"},
                    {"data": "parklotName"},
                    {
                        "data": "payMoney", "render": (data, type, full) => {
                        let _data = data.toFixed(2);
                        return $filter("currency")(_data);
                    }
                    },
                    {
                        "data": "paySrc",
                        "render": (data, type, full) => {
                            var paySrc = sessionCache.getLookupValueByLookupName('PAY_SRC', data);
                            return paySrc || '';
                        }
                    },
                    {
                        "data": "payTime", "render": (data, type, full) => {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                      },
                    },
                    { 
                      "data": "orderStatus",
                      "render": (data, type, full) => {
                          var orderStatus = sessionCache.getLookupValueByLookupName('ORDER_STATUS', data);
                          return orderStatus || '';
                      }
                    },
                ],
            }));
        };
        if ($scope.parkingPay === true) {
            $scope.parkingPay = false;
        } else {
            $scope.parkingPay = true;
            $timeout(function () {
                initTable();
            });
        }
    };
		
	}
]);