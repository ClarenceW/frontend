'use strict';
angular.module("parkingApp").controller('parkingChargeListCtrl',
    function ($rootScope, $scope, $state, growl, Setting, $log, customerService, parkingChargeReportService, StateName, $filter, excelService) {
        var indexId = "#parking-charge-index";
        var tableId = indexId + " #parking-charge-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.formData = {};
        $scope.tempData = {};


        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        };

        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, setting) {
                    if ($scope.formData.parkingName) {
                        data.parkingName = $scope.formData.parkingName;
                    }
                    if ($scope.formData.companyName) {
                        data.companyName = $scope.formData.companyName;
                    }
                    parkingChargeReportService.reqParkingReportPagination(data).then(resp => {
                        callback(resp)
                    }, msg => {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "reportDate"},
                    {"data": "companyName"},
                    {"data": "parkingName"},
                    {
                        "data": "totalMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "parkTotalMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "reserveMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                ],
                "rowCallback": function (nRow, aData, iDisplayIndex) {
                    $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                    return nRow;
                },
                "drawCallback": function () {
                    customerService.initUniform(tableId);
                    customerService.initTitle();
                }
            }));
        }

        $scope.toSearch = function () {
            reload();
        };

        $scope.toReset = function () {
            $scope.formData.parkingName = '';
            $scope.formData.companyName = '';
            reload();
        };

        $scope.exportData = () => {
            let data = {};
            if ($scope.formData.parkingName) {
                data.parkingName = $scope.formData.parkingName;
            }
            if ($scope.formData.companyName) {
                data.companyName = $scope.formData.companyName;
            }
            parkingChargeReportService.exportData(data).then(resp => {
                if (resp && resp.length === 0) {
                    growl.addWarnMessage('暂无数据导出！', {ttl: 2000});
                    return;
                }
                let excelData = resp.map(function (item) {
                    return {
                        '报表日期': item.reportDate,
                        '运营公司名称': item.companyName,
                        '停车场名称': item.parkingName,
                        '收费总额': (item.totalMoney / 100).toFixed(2),
                        '停车收费总额': (item.parkTotalMoney / 100).toFixed(2),
                        '预约收费总额': (item.reserveMoney / 100).toFixed(2),
                    }
                });
                let excelName = '收费-停车场收费报表';
                excelService.exportExcel(excelData, excelName);
            });
        }


        initTable();


    });