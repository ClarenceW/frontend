'use strict';

angular.module('parkingApp').controller('invoiceHistoryListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'invoiceHistoryService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, invoiceHistoryService, StateName, sessionCache,$filter,$compile,Setting,excelService) {

		var indexId = "#invoicehistory-index";
		var tableId = indexId + " #invoicehistory-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.invoiceHistory.detail;
    $scope.invoiceStatusOption = sessionCache.getDictsByLookupName("INVOICE_STATUS");
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.iDisplayStart = $scope.formData.start || 0;
    $scope.formData.startTime =params.startTime ? new Date(params.startTime) : '';
    $scope.formData.endTime = params.endTime ? new Date(params.endTime) : '';
    
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
      initTable();
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
        "destroy": true,
				"ajax": function(data, callback, settings) {
          let flg = $state.params.flg;
          if (flg == 1) {
            data.start = $scope.formData.start || 0;
            data.length = $scope.formData.length || 10;
            let start = data.start;
            let length = data.length;
            delete $state.params['flg'];
          } else {
            $scope.formData.start = data.start;
            $scope.formData.length = data.length;
          }
					if($scope.formData.recordCode) {
						data.recordCode = $scope.formData.recordCode;
					}
					if($scope.formData.userCode) {
						data.userCode = $scope.formData.userCode;
					}
					if($scope.formData.invoiceRise) {
						data.invoiceRise = $scope.formData.invoiceRise;
					}
					if($scope.formData.invoiceStatus) {
						data.invoiceStatus = $scope.formData.invoiceStatus;
					}
          if ($scope.formData.startTime) {
              var _date = $scope.formData.startTime.format("yyyy-MM-dd 00:00:00");
              data.startTime = _date;
          }
          if ($scope.formData.endTime) {
              var _date = $scope.formData.endTime.format("yyyy-MM-dd 23:59:59");
              data.endTime = _date;
          }
          if($scope.formData.startTime  && $scope.formData.endTime) {
            if($scope.formData.startTime > $scope.formData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					invoiceHistoryService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#invoicehistory-table_paginate").find("li[class='active']").removeClass('active')
              $("#invoicehistory-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        iDisplayStart: $scope.iDisplayStart,
				"columns": [
					{ "defaultContent": "" },
					{ "data": "recordCode" },
					{ "data": "userCode" },
					{ "data": "invoicePrice" },
					{ "data": "invoiceType","render": (data,type,full) => {
            let invoiceType = sessionCache.getLookupValueByLookupName('INVOICE_TYPE',data);
            return invoiceType || '';
          }},
          { "data": "invoiceRise"},
					{ "data": "applicationTime","render": (data,type,full) => {
            let applicationTime = new Date(data);
            return applicationTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "invoiceStatus","render": (data,type,full) => {
            let invoiceStatus = sessionCache.getLookupValueByLookupName('INVOICE_STATUS',data);
            return invoiceStatus || '';
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

		$scope.toSearch = function() {
      reload();
		};
		$scope.toReset = function() {
			$scope.formData.recordCode = "";
			$scope.formData.userCode = "";
			$scope.formData.invoiceStatus = "";
			$scope.formData.invoiceRise = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.iDisplayStart = 0;
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
				$state.go($scope.stateGoDetail, { recordCode: aData.recordCode, params: params });
			} else {
				customerService.openDetailConfirmModal();
			}
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
            if ($scope.formData.recordCode) {
                data.recordCode = $scope.formData.recordCode;
            }
            if ($scope.formData.userCode) {
                data.userCode = $scope.formData.userCode;
            }
            if ($scope.formData.invoiceRise) {
                data.invoiceRise = $scope.formData.invoiceRise;
            }
            if ($scope.formData.invoiceStatus) {
                data.invoiceStatus = $scope.formData.invoiceStatus;
            }
            if ($scope.formData.startTime) {
                data.startTime = new Date($scope.formData.startTime).format("yyyy-MM-dd 00:00:00");
            }
            if ($scope.formData.endTime) {
                data.endTime = new Date($scope.formData.endTime).format("yyyy-MM-dd 23:59:59");
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
            invoiceHistoryService.invoiveHistoryReport(data, 1).then(function (resp) {
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
                    invoiceHistoryService.invoiveHistoryReport(data, 2).then(function (resp) {
                        if (resp.data.length > 0) {
                            let excelData = resp.data;
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
            invoiceHistoryService.invoiveHistoryReport(data, 2).then(function (resp) {
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
                    '记录编号': item.recordCode + '',
                    '手机号': item.userCode,
                    '申领发票金额（元）': item.invoicePrice,
                    '发票类型': sessionCache.getLookupValueByLookupName('INVOICE_TYPE',item.invoiceType),
                    '发票抬头': item.invoiceRise,
                    '申请时间': new Date(item.applicationTime).format("yyyy-MM-dd hh:mm:ss"),
                    '状态': sessionCache.getLookupValueByLookupName('INVOICE_STATUS',item.invoiceStatus)
                }
            });
            let excelName = '开票历史';
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