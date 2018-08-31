'use strict';
angular.module("parkingApp").controller('ChargeOrderList',
    function ($rootScope, $scope, growl, $log, customerService, Setting, sentrychargeService, $state, StateName, sessionCache, $http, $compile, excelService, $filter) {
        var indexId = "#charge-index";
        var tableId = indexId + " #charge-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.formData = {};
        $scope.formData.startTime = $state.params.chargeDate;
        $scope.formData.endTime = $state.params.chargeDate;
        // $scope.formData.pdaUserCode = $state.params.pdaUserCode || $rootScope.pdaUserCode;
        // $scope.formData.scheduleDate = $state.params.scheduleDate || $rootScope.scheduleDate;
        $scope.fromVerify = $state.params.fromVerify;
        $scope.stateGoCashIndex = StateName.cashrecord.index;
        $scope.stateGoCashVerifyIndex = StateName.cashrecord.havePayedIndex;
        $scope.stateGoChargeDetail = StateName.cashrecord.parkpaydetail;
        $scope.userCode =$state.params.userCode;

        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        }
        
        var initTable = function () {
          oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function(data, callback, settings) {
              if($scope.formData.billCode) {
                data.billCode = $scope.formData.billCode;
              }
              if($scope.formData.plate) {
                data.plate = $scope.formData.plate;
              }
              if ($scope.formData.startTime) {
                  var _date = new Date($scope.formData.startTime).format("yyyy-MM-dd");
                  data.startTime = _date;
              }
              if ($scope.formData.endTime) {
                  var _date = new Date($scope.formData.endTime).format("yyyy-MM-dd");
                  data.endTime = _date;
              }
              data.userCode = $scope.userCode;
              data.parklotChargeType = "1";
              sentrychargeService.reqPagination(data).then(function(resp) {
                callback(resp)
              }, function(msg) {
                growl.addErrorMessage(msg, { ttl: 2000 });
              });
            },
            "columns": [
              { "defaultContent": "" },
              { "data": "billCode" },
              { "data": "parklotName" },
              { "data": "plate" },
              { "data": "actualMoney","render" : (data,type,full) => {
                return $filter("number")(data,2);
              }},
              { "data": "discountsMoney","render" : (data,type,full) => {
                return $filter("number")(data,2);
              }},
              { "data": "parklotChargeType","render": (data,type,full) => {
                let parklotChargeType = sessionCache.getLookupValueByLookupName('PARKLOT_CHARGE_TYPE',data);
                return parklotChargeType || '';
              }},
              { "data": "payTime","render": (data,type,full) => {
                let payTime = new Date(data);
                return payTime.format("yyyy-MM-dd hh:mm:ss");
              }},
            ],
            "rowCallback": function(nRow, aData, iDisplayIndex) {
              $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
              return nRow;
            },
            "drawCallback": function() {
              customerService.initUniform(tableId);
              customerService.initTitle();
            }
          }));
        }

        $scope.toReset = function () {
            $scope.formData.billCode = "";
            $scope.formData.plate = "";
            $scope.formData.parklotName = "";
            reload();
        };

        $scope.toDetail = function() {
          var count = 0;
          var aData;
          $(checkboxesCls).each(function() {
            if($(this).prop("checked")) {
              nRow = $(this).parents('tr')[0];
              aData = oTable.fnGetData(nRow);
              count++;
            }
          });
          if(count === 1) {
            $state.go($scope.stateGoChargeDetail, { id: aData.id ,userCode:$scope.userCode});
          } else {
            customerService.openDetailConfirmModal();
          }
        };

        $scope.toSearch = function () {
            reload();
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
            data.type = 0;
            data.parklotChargeType = "1";
            if ($state.params.parklotName) {
                data.parklotName = $state.params.parklotName;
            }
            if ($scope.formData.plate) {
                data.plate = $scope.formData.plate;
            }
            if ($scope.formData.billCode) {
                data.billCode = $scope.formData.billCode;
            }
            if ($state.params.chargeDate) {
                data.startTime = new Date($state.params.chargeDate).format("yyyy-MM-dd");
            }
            if ($state.params.chargeDate) {
                data.endTime = new Date($state.params.chargeDate).format("yyyy-MM-dd");
            }
            return data;
        }

        /** 请求导出数据总数 **/
        $scope.toExport = function () {
            let data = {};
            data = retrieval();
            sentrychargeService.reqReport(data, 1).then(function (resp) {
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
                            sentrychargeService.reqReport(data, 2).then(function (resp) {
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
            data.start = item.start - 1;
            data.length = $scope.baseNumber;
            sentrychargeService.reqReport(data, 2).then(function (resp) {
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
                    '记录编号': item.billCode,
                    '停车场': item.parklotName,
                    '车牌': item.plate,
                    '实收金额（元）': $filter("number")(item.actualMoney,2),
                    '减免金额（元）': $filter("number")(item.discountsMoney,2),
                    '收费类型': sessionCache.getLookupValueByLookupName('PARKLOT_CHARGE_TYPE', item.parklotChargeType),
                    '到账时间': new Date(item.payTime).format("yyyy-MM-dd hh:mm:ss"),
                }
            });
            let excelName = '岗亭收费记录';
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