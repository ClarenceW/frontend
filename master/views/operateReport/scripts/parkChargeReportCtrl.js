'use strict';

angular.module('parkingApp').controller('parkChargeReportCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'operateChargeReportService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, operateChargeReportService, StateName, sessionCache,$filter,$compile,Setting,excelService,parklotsService) {

		var indexId = "#pkcharge-report-index";
		var tableId = indexId + " #pkcharge-report-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.formData = {};
    $scope.formData.startTime = '';
    $scope.formData.endTime = '';
    $scope.parklotNameOption = [];
    parklotsService.reqList().then(resp => {
      $scope.parklotCodeOption = resp;
    });
    
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

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.parklotCode) {
						data.parklotCode = $scope.formData.parklotCode;
					}
          if ($scope.formData.startTime) {
              var _date = $scope.formData.startTime.format("yyyy-MM-dd");
              data.startTime = _date;
          }
          if ($scope.formData.endTime) {
              var _date = $scope.formData.endTime.format("yyyy-MM-dd");
              data.endTime = _date;
          }
          if($scope.formData.startTime  && $scope.formData.endTime) {
            if($scope.formData.startTime > $scope.formData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					operateChargeReportService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "statisticsDate" },
          { "data": "parklotName"},
          { "data": "berthNumber"},
          { "data": "statisticsMoney"},
          { "data": "averageMoney"},
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

		$scope.toSearch = function() {
			reload();
		};
		$scope.toReset = function() {
			$scope.formData.parklotCode = "";
			$scope.formData.startTime = "";
			$scope.formData.endTime = "";
			reload();
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
            if ($scope.formData.parklotCode) {
                data.parklotCode = $scope.formData.parklotCode;
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
            operateChargeReportService.reqReport(data, 1).then(function (resp) {
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
                    operateChargeReportService.reqReport(data, 2).then(function (resp) {
                        if (resp.aaData.length > 0) {
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
            operateChargeReportService.reqReport(data, 2).then(function (resp) {
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
                    '报表日期': item.statisticsDate,
                    '停车场名称': item.parklotName,
                    '运营泊位总数': item.berthNumber,
                    '收费总额（元）': item.statisticsMoney,
                    '泊位平均收费（元）': item.averageMoney,
                }
            });
            let excelName = '停车收费报表';
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
    
		initTable();

	}
]);