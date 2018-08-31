'use strict';
angular.module('parkingApp').controller('invoiceHistoryDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','invoiceHistoryService','growl','customerService','$compile','$timeout',
	function($scope, $state, StateName,sessionCache,Setting,invoiceHistoryService,growl,customerService,$compile,$timeout) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.invoiceHistory.index;
    $scope.chargerecord = false;
    $scope.monthcardrecord = false;
    var detailId = "#invoiceHistory-detail";
    var chargeRecordTableId = detailId + " #chargerecord-table";
    var monthCardRecordTableId = detailId + " #monthcardrecord-table";
    invoiceHistoryService.reqDetail($state.params.recordCode).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.recordCode = dto.recordCode;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.invoiceRise = dto.invoiceRise;
        $scope.formData.invoiceTfn = dto.invoiceTfn;
        $scope.formData.invoicestatus = dto.invoiceStatus;
        $scope.formData.invoiceStatus = sessionCache.getLookupValueByLookupName('INVOICE_STATUS',dto.invoiceStatus);
        $scope.formData.invoicePrice = dto.invoicePrice+"元";
        $scope.formData.invoiceInfo = dto.invoiceInfo;
        $scope.formData.recvEmail = dto.recvEmail;
        $scope.formData.applicationTime = dto.applicationTime;
        $scope.formData.invoiceTime = dto.invoiceTime;
        $scope.formData.reason = dto.reason;
    };

    $scope.toChargeRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(chargeRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                  invoiceHistoryService.reqPayRecord($scope.formData.recordCode).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                destroy:true,
                "columns": [
                    {"data": "recordCode"},
                    {"data": "plate"},
                    {"data": "parklotName"},
                    {"data": "payMoney"},
                    {"data": "opTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }}
                ],
            }));
        };
        if ($scope.chargerecord === true) {
            $scope.chargerecord = false;
        } else {
            $scope.chargerecord = true;
            $timeout(function () {
                initTable();
            });
        }
    };

    $scope.toMonthCardRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(monthCardRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                  invoiceHistoryService.reqCardRecord($scope.formData.recordCode).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                destroy:true,
                "columns": [
                    {"data": "traId"},
                    {"data": "plate"},
                    {"data": "cardCode"},
                    {"data": "payMoney"},
                    {"data": "opTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }}
                ],
            }));
        };
        if ($scope.monthcardrecord === true) {
            $scope.monthcardrecord = false;
        } else {
            $scope.monthcardrecord = true;
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