'use strict';
angular.module("parkingApp").controller('berthOrderReportListCtrl',
    function ($rootScope, $scope, $state, growl, Setting, $log, customerService, berthOrderReportService, StateName, $filter, excelService) {
        var indexId = "#berthOrder-report-index";
        var tableId = indexId + " #berthOrder-report-table";
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
                    berthOrderReportService.reqParkingReportPagination(data).then(resp => {
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
                    {"data": "berthOrderNum"},
                    {
                        "data": "berthOrderMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {"data": "berthOrderTimes"},
                    {"data": "actualTimes"},
                    {"data": "berthOrderRate"},
                    {"data": "actualRate"},


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
            berthOrderReportService.exportData(data).then(resp => {
                if (resp && resp.length === 0) {
                    growl.addWarnMessage('暂无数据导出！', {ttl: 2000});
                    return;
                }
                let excelData = resp.map(function (item) {
                    return {
                        '报表日期': item.reportDate,
                        '运营公司名称': item.companyName,
                        '停车场名称': item.parkingName,
                        '运营预约泊位总数': item.berthOrderNum,
                        '运营收费总额(元)': (item.berthOrderMoney / 100).toFixed(2),
                        '预约次数': item.berthOrderTimes,
                        '实际驶入次数': item.actualTimes,
                        '预约率（%）': item.berthOrderRate,
                        '预约驶入率（%）': item.actualRate,
                    }
                });
                let excelName = '运营-泊位预约报表';
                excelService.exportExcel(excelData, excelName);
            });
        }


        initTable();


    });