'use strict';
angular.module("parkingApp").controller('CashVerifyOrderList',
    function ($rootScope, $scope, growl, $log, customerService, Setting, cashService, StateName, $state, $http, $compile, excelService, $filter,sessionCache) {
        var indexId = "#cashverify-index";
        var tableId = indexId + " #cashverify-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.formData = {};
        $scope.stateGoCashIndex = StateName.cashrecord.index;
        $scope.stateGoCharge = StateName.cashrecord.parkpayIndex;
        // $scope.stateGoCashNo = StateName.cashrecord.indexN;

        /**  日期选择*/
        $scope.formData.startTime = '';
        $scope.formData.endTime = '';
        $scope.tempBeginData = {};
        $scope.tempEndData = {};
        $scope.format = "yyyy-MM-dd";

        $scope.open = function (type) {
          if (type == 'begin') {
            $scope.tempBeginData.opened = true;
          } else if (type == 'end') {
            $scope.tempEndData.opened = true;
          }
        };

        function disabled(data) {
          var date = data.date,
            mode = data.mode;
          return false;
        }

        $scope.dateOptions = {
          dateDisabled: disabled,
          formatYear: 'yy',
          maxDate: new Date(2025, 12, 31),
          minDate: new Date(2015, 1, 1),
          startingDay: 1
        };
        /**  日期选择结束 **/

        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        }
        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, settings) {
                    if ($scope.formData.userCode) {
                        data.userCode = $scope.formData.userCode;
                    }
                    if ($scope.formData.startTime) {
                        data.startTime = new Date($scope.formData.startTime).format("yyyy-MM-dd");
                    }
                    if ($scope.formData.endTime) {
                        data.endTime = new Date($scope.formData.endTime).format("yyyy-MM-dd");
                    }
                    if ($scope.formData.startTime && $scope.formData.endTime) {
                        if ($scope.formData.startTime > $scope.formData.endTime) {
                            growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                            return;
                        }
                    }
                    data.type = 1;
                    cashService.reqCachPagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "userCode"},
                    {
                        "data": "receivableMoney", "render": function (data, type, full) {
                            return data.toFixed(2);
                    }
                    },
                    {
                        "data": "actualMoney", "render": function (data, type, full) {
                        return data.toFixed(2);
                    }
                    },
                    {"data": "chargeDate"},
                    {
                        "data": "status", "render": function (data, type, full) {
                            return sessionCache.getLookupValueByLookupName('CASH_STATUS',data);
                    }
                    },
                    {"data": "opUser"},
                    {
                        "data": "opTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
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

        $scope.toReset = function () {
            $scope.formData.userCode = "";
            $scope.formData.startTime = '';
            $scope.formData.endTime = '';
            reload();
        };

        $scope.toSearch = function () {
            reload();
        };

        $scope.toDetail = function () {
            var count = 0;
            var aData;
            $(checkboxesCls).each(function () {
                if ($(this).prop("checked")) {
                    nRow = $(this).parents('tr')[0];
                    aData = oTable.fnGetData(nRow);
                    count++;
                }
            });
            if (count === 1) {
                $state.go($scope.stateGoCharge, {
                    chargeDate: aData.chargeDate,
                    userCode: aData.userCode,
                    fromVerify: true
                });
            } else {
                customerService.openDetailConfirmModal();
            }
        };

        initTable();


        Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            symbol = symbol !== undefined ? symbol : "$";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var number = this,
                negative = number < 0 ? "-" : "";
            var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
            var j = 0;
            j = (j = i.length) > 3 ? j % 3 : 0;
            return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        };


        /****   excel导出代码开始     ******/

        let templateUrl = 'tpls/excelExport.html';
        $http.get(templateUrl).success(function (template) {
            let compileFn = $compile(template);
            let $dom = compileFn($scope);
            $dom.appendTo('.excel');
        }).error(function () {
            growl.addErrorMessage("导出模板请求失败", {ttl: 2000});
        });
        function retrieval() {
            let data = {};
            data.type = 1;
            if ($scope.formData.userCode) {
                data.userCode = $scope.formData.userCode;
            }
            if ($scope.formData.startTime) {
                data.startTime = new Date($scope.formData.startTime).format("yyyy-MM-dd");
            }
            if ($scope.formData.endTime) {
                data.endTime = new Date($scope.formData.endTime).format("yyyy-MM-dd");
            }
            return data;
        }

        /** 请求导出数据总数 **/
        $scope.toExport = function () {
            let data = {};
            data = retrieval();
            if (data.startTime && data.endTime) {
                if (data.startTime > data.endTime) {
                    growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                    return;
                }
            }
            cashService.chargeReportExcel(data, 1).then(function (resp) {
                if (resp.code === Setting.ResultCode.CODE_SUCCESS) {
                    if (resp.data) {
                        $scope.totalCount = resp.data;
                        let returnData = excelService.excelCompute($scope.totalCount);
                        $scope.baseNumber = returnData.baseNumber;// 每次导出数据条数
                        $scope.lastExcelNumber = returnData.lastExcelNumber; // 最后一张表格数据条数
                        $scope.excelNumber = returnData.excelNumber; //导出表格个数
                        $scope.excelOptions = returnData.excelOptions;  //用于存放所有表格数
                        $scope.slittingShow = returnData.slittingShow;  //超过导出上限显示
                        $scope.loadStep = returnData.loadStep;  //导出状态数组
                        if ($scope.totalCount >= $scope.baseNumber) {
                            $('#excelModal').modal('show');
                        } else {
                            data.start = 0;
                            data.length = $scope.totalCount;
                            cashService.chargeReportExcel(data, 2).then(function (resp) {
                                if (resp.aaData.length) {
                                    let excelData = resp.aaData;
                                    downloadExcel(excelData);
                                }
                            }, function (msg) {
                                growl.addErrorMessage(msg, {ttl: 2000});
                            });
                        }
                    } else {
                        growl.addInfoMessage("没有数据", {ttl: 2000});
                    }
                } else {
                    growl.addErrorMessage("请求数据错误", {ttl: 2000});
                }
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });

        };
        /** 分条导出 **/
        $scope.exportExcel = function (item, index) {
            $scope.loadStep[index] = 2;
            let data = {};
            data = retrieval();
            if (data.startTime && data.endTime) {
                if (data.startTime > data.endTime) {
                    growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                    return;
                }
            }
            data.start = item.start - 1;
            data.length = $scope.baseNumber;
            cashService.chargeReportExcel(data, 2).then(function (resp) {
                if (resp.aaData) {
                    let excelData = resp.aaData;
                    downloadExcel(excelData, item, index);
                }
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        };

        function downloadExcel(data, excelItem, index) {
            let excelData = [];
            let number = 1;
            if (excelItem)
                number = excelItem.start;
            excelData = data.map(function (item) {
                return {
                    '序号': number++,
                    '收费员编号': item.userCode,
                    '应上交金额（元）': item.receivableMoney,
                    '实际上交金额（元）': item.actualMoney,
                    '收费日期': item.chargeDate,
                    '状态': sessionCache.getLookupValueByLookupName('CASH_STATUS', item.status),
                    '确认人': item.opUser,
                    '确认时间': item.opTime,
                }
            });
            let excelName = '已确认到账记录';
            excelService.exportExcel(excelData, excelName);
            if (excelItem)
                $scope.loadStep[index] = 3;
        };
        $scope.closeModal = function () {
            $scope.totalCount = '';
            $scope.excelNumber = 0; //导出表格个数
            $scope.lastExcelNumber = null; // 最后一张表格数据条数
            $scope.excelOptions = [];  //用于存放所有表格数
        };

        /****   excel导出代码结束     ******/
    });