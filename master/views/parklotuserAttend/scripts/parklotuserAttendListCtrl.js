'use strict';

angular.module('parkingApp').controller('parklotuserAttendListCtrl', ['$scope', '$http',  'growl', 'customerService', 'parklotuserAttendService', 'StateName', 'sessionCache','$compile','Setting','excelService','parklotsService','$timeout',
	function($scope, $http, growl, customerService, parklotuserAttendService, StateName, sessionCache,$compile,Setting,excelService,parklotsService,$timeout) {

		var indexId = "#parklotuserAttend-index";
		var tableId = indexId + " #parklotuserAttend-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.formData = {};
    $scope.formData.startTime ='';
    $scope.formData.endTime = '';
    
    $scope.tempBeginData = {};
		$scope.tempEndData = {};
    $scope.format = "yyyy-MM-dd";
    //停车场列表
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

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
					if($scope.formData.userName) {
						data.userName = $scope.formData.userName;
					}
					if($scope.formData.userCode) {
						data.userCode = $scope.formData.userCode;
					}
					if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
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
					parklotuserAttendService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
				"columns": [
					{ "defaultContent": "" },
					{ "data": "userCode" },
					{ "data": "userName" },
					{ "data": "parklotName"},
          { "data": "startTime"},
          { "data": "endTime"}
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
			$scope.formData.userName = "";
			$scope.formData.userCode = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
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

    /** 请求导出数据总数 **/
    $scope.toExport = function () {
        let data = {};
        data.userCode = $scope.formData.userCode;
        data.userName = $scope.formData.userName;
        data.parklotCodes = $scope.formData.parklotCodes;
        data.startTime = $scope.formData.startTime;
        data.endTime = $scope.formData.endTime;
        if (data.startTime && data.endTime) {
            if (data.startTime > data.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
        }
        parklotuserAttendService.attendenceReport(data, 1).then(function (resp) {
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
                parklotuserAttendService.attendenceReport(data, 2).then(function (resp) {
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
        data.userCode = $scope.formData.userCode;
        data.userName = $scope.formData.userName;
        data.parklotCodes = $scope.formData.parklotCodes;
        data.startTime = $scope.formData.startTime;
        data.endTime = $scope.formData.endTime;
        if (data.startTime && data.endTime) {
            if (data.startTime > data.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
        }
        data.start = item.start - 1;
        data.length = $scope.baseNumber;
        parklotuserAttendService.attendenceReport(data, 2).then(function (resp) {
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
                '收费员账号': item.userCode + '',
                '收费员姓名': item.userName,
                '所属收费停车场': item.parklotName,
                '登入时间': item.startTime,
                '登出时间': item.endTime
            }
        });
        let excelName = '收费员考勤';
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