'use strict';
angular.module('parkingApp').controller('sentrychargeDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','sentrychargeService','growl','passcarService','$timeout','alreadypaytradeService','$filter',
	function($scope, $state, StateName,sessionCache,Setting,sentrychargeService,growl,passcarService,$timeout,alreadypaytradeService,$filter) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.sentrycharge.index;
    $scope.passcar = false;
    $scope.payrecord = false;
    var detailId = "#sentrycharge-detail";
    var passcarTableId = detailId + " #pass-car-table";
    var payRecordTableId = detailId + " #pay-record-table";
    sentrychargeService.reqDetail($state.params.id).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.plate = dto.plate;
        $scope.formData.billCode = dto.billCode;
        $scope.formData.payableMoney = dto.payableMoney;
        $scope.formData.parklotChargeType = sessionCache.getLookupValueByLookupName('PARKLOT_CHARGE_TYPE',dto.parklotChargeType);
        $scope.formData.actualMoney = dto.actualMoney;
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.discountsMoney = dto.discountsMoney;
        $scope.formData.id = dto.id;
        $scope.formData.payTime = dto.payTime;
        $scope.formData.opUser = dto.opUser;
    }

    $scope.toPasscarRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(passcarTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                    passcarService.reqList($scope.formData.id).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"data": "id"},
                    {"data": "plate"},
                    {"data": "parklotName"},
                    {"data": "laneName"},
                    {
                        "data": "parkDirection", "render": function (data, type, full) {
                        var parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION', data);
                            return parkDirection;
                    }
                    },
                    {
                        "data": "passType",
                        "render": function (data, type, full) {
                            var passType = sessionCache.getLookupValueByLookupName('PASS_TYPE', data);
                            return passType;
                        }
                    },
                    {
                        "data": "passTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    },
                    },
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

    $scope.toPayRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(payRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                    alreadypaytradeService.reqRecord($scope.formData.id).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"data": "traId"},
                    {"data": "parklotName"},
                    {
                        "data": "payMoney", "render": function (data, type, full) {
                        let _data = $filter("currency")(data);
                        return _data;
                    }
                    },
                    {
                        "data": "createTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }},
                    {
                        "data": "orderStatus",
                        "render": function (data, type, full) {
                            var orderStatus = sessionCache.getLookupValueByLookupName('ORDER_STATUS', data);
                            return orderStatus;
                        }
                    },
                    
                ],
            }));
        };
        if ($scope.payrecord === true) {
            $scope.payrecord = false;
        } else {
            $scope.payrecord = true;
            $timeout(function () {
                initTable();
            });
        }
    };
		
	}
]);