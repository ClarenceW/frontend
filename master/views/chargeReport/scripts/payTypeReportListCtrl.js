'use strict';
angular.module("parkingApp").controller('PayTypeReportListCtrl',
    function ($rootScope, $scope, $state, growl, Setting, $log, customerService, PayTypeReportService, StateName, $filter, excelService) {
        var indexId = "#payType-charge-index";
        var tableId = indexId + " #payType-charge-table";
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
                    PayTypeReportService.reqParkingReportPagination(data).then(resp => {
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
                        "data": "aliPayMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "weChatMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "walletMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "cashMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "unionPayMoney", "render": function (data, type, full) {
                        return $filter('currency')(data / 100);
                    }
                    },
                    {
                        "data": "virtualMoney", "render": function (data, type, full) {
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
            PayTypeReportService.exportData(data).then(resp => {
                if (resp && resp.length === 0) {
                    growl.addWarnMessage('暂无数据导出！', {ttl: 2000});
                    return;
                }
                let excelData = resp.map(function (item) {
                    return {
                        '报表日期': item.reportDate,
                        '运营公司名称': item.companyName,
                        '停车场名称': item.parkingName,
                        '收费总额(元)': (item.totalMoney / 100).toFixed(2),
                        '支付宝总额(元)': (item.aliPayMoney / 100).toFixed(2),
                        '微信总额(元)': (item.weChatMoney / 100).toFixed(2),
                        '钱包总额(元)': (item.walletMoney / 100).toFixed(2),
                        '现金总额(元)': (item.cashMoney / 100).toFixed(2),
                        '银联总额(元)': (item.unionPayMoney / 100).toFixed(2),
                        '虚拟车卡总额(元)': (item.virtualMoney / 100).toFixed(2),
                    }
                });
                let excelName = '收费-支付渠道报表';
                excelService.exportExcel(excelData, excelName);
            });
        }


        initTable();


    });