'use strict';

angular.module('parkingApp').controller('parkpayrecordListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'parkpayrecordService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, parkpayrecordService, StateName, sessionCache,$filter,$compile,Setting,excelService,$timeout,parklotsService) {

		var indexId = "#parkpayrecord-index";
		var tableId = indexId + " #parkpayrecord-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.parkpayrecord.detail;
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.formData.sumPayableMoney = '';
    $scope.payTypeOption = sessionCache.getDictsByLookupName("PARKING_PAY_TYPE");
    $scope.chargePlatTypeOption = sessionCache.getDictsByLookupName("PARKING_PAY_PLATFORM");
    $scope.iDisplayStart = $scope.formData.start || 0;
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    
    /**  日期选择*/
    $scope.starTimeCtrl = {
        isOpen: false,
        date: new Date(),
        buttonBar: {
            show: true,
            now: {
                show: true,
                text: '现在'
            },
            today: {
                show: true,
                text: '今天'
            },
            clear: {
                show: false,
                text: 'Clear'
            },
            date: {
                show: true,
                text: '日期'
            },
            time: {
                show: true,
                text: '时间'
            },
            close: {
                show: true,
                text: '关闭'
            }
        }
    };
    $scope.endTimeCtrl = {
        isOpen: false,
        date: new Date(),
        buttonBar: {
            show: true,
            now: {
                show: true,
                text: '现在'
            },
            today: {
                show: true,
                text: '今天'
            },
            clear: {
                show: false,
                text: 'Clear'
            },
            date: {
                show: true,
                text: '日期'
            },
            time: {
                show: true,
                text: '时间'
            },
            close: {
                show: true,
                text: '关闭'
            }
        }
    };
    $scope.openStartTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.starTimeCtrl.isOpen = true;
    };
    $scope.openEndTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.endTimeCtrl.isOpen = true;
    };
    $scope.formData.startTime = new Date(params.startTime ? params.startTime : new Date().format('yyyy-MM-dd 00:00:00'));
    $scope.formData.endTime = new Date(params.endTime ? params.endTime : new Date().format('yyyy-MM-dd 23:59:59'));
    /**  日期选择结束 **/

		var reload = function() {
			// if(customerService.isDataTableExist(tableId)) {
			// 	oTable.api().ajax.reload(null, false);
      // }
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
					if($scope.formData.recordId) {
						data.recordId = $scope.formData.recordId;
					}
					if($scope.formData.traId) {
						data.traId = $scope.formData.traId;
					}
					if($scope.formData.thirdSn) {
						data.thirdSn = $scope.formData.thirdSn;
          }
					if($scope.formData.payType) {
						data.payType = $scope.formData.payType;
          }
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.chargePlat) {
						data.chargePlat = $scope.formData.chargePlat;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
					}
          if ($scope.formData.startTime) {
              var _date = $scope.formData.startTime.format("yyyy-MM-dd hh:mm:ss");
              data.startTime = _date;
          }
          if ($scope.formData.endTime) {
              var _date = $scope.formData.endTime.format("yyyy-MM-dd hh:mm:ss");
              data.endTime = _date;
          }
          if($scope.formData.startTime  && $scope.formData.endTime) {
            if($scope.formData.startTime > $scope.formData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					parkpayrecordService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#parkpayrecord-table_paginate").find("li[class='active']").removeClass('active')
              $("#parkpayrecord-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        iDisplayStart: $scope.iDisplayStart,
				"columns": [
					{ "defaultContent": "" },
					// { "data": "recordId" },
					// { "data": "traId" },
					// { "data": "thirdSn" },
					{ "data": "plate" },
          { "data": "parklotName"},
          { "data": "chargePlat","render": (data,type,full) => {
            let chargePlat = sessionCache.getLookupValueByLookupName('PARKING_PAY_PLATFORM',data);
            return chargePlat || '';
          }},
          { "data": "payableMoney"},
          { "data": "payMoney"},
          // { "data": "discountMoney"},
          { "data": "discountCoupon"},
          { "data": "payType","render": (data,type,full) => {
            let payType = sessionCache.getLookupValueByLookupName('PARKING_PAY_TYPE',data);
            return payType || '';
          }},
					{ "data": "payTime","render": (data,type,full) => {
            let payTime = new Date(data);
            return payTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "opUser"},
          { "defaultContent": "" },
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          $('td:eq(10)', nRow).html("<button type=\"button\" class=\"btn btn-default\"><span class=\"fa fa-edit\"></span>详情</button>");
					return nRow;
				},
				"drawCallback": function() {
          var buttonList = $('tbody tr .btn');
          if (buttonList && buttonList.length > 0) {
              for (var i = 0, j = buttonList.length; i < j; i++) {
                  buttonList[i].addEventListener('click', function (e) {
                    nRow = $(this).parents('tr')[0];
                    aData = oTable.fnGetData(nRow);
                    let params = $scope.formData;
                    $state.go($scope.stateGoDetail, { recordId: aData.recordId, params: params  });
                  })
              }
          }
					customerService.initUniform(tableId);
					customerService.initTitle();
				}
			}));
    }
    function getTotal() {
      let data = {};
      if($scope.formData.recordId) {
        data.recordId = $scope.formData.recordId;
      }
      if($scope.formData.traId) {
        data.traId = $scope.formData.traId;
      }
      if($scope.formData.thirdSn) {
        data.thirdSn = $scope.formData.thirdSn;
      }
      if($scope.formData.payType) {
        data.payType = $scope.formData.payType;
      }
      if($scope.formData.plate) {
        data.plate = $scope.formData.plate;
      }
      if($scope.formData.chargePlat) {
        data.chargePlat = $scope.formData.chargePlat;
      }
      if($scope.formData.parklotName) {
        data.parklotName = $scope.formData.parklotName;
      }
      if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if ($scope.formData.startTime) {
          var _date = $scope.formData.startTime.format("yyyy-MM-dd hh:mm:ss");
          data.startTime = _date;
      }
      if ($scope.formData.endTime) {
          var _date = $scope.formData.endTime.format("yyyy-MM-dd hh:mm:ss");
          data.endTime = _date;
      }
      if($scope.formData.startTime  && $scope.formData.endTime) {
        if($scope.formData.startTime > $scope.formData.endTime) {
            growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
            return;
        }
      }
      parkpayrecordService.reqTotalCharge(data).then(resp => {
        $scope.formData.sumPayableMoney = $filter("currency")(resp.sumPayableMoney);
        $scope.formData.sumPayMoney = $filter("currency")(resp.sumPayMoney);
        $scope.formData.sumChargeDeduction = $filter("currency")(resp.sumChargeDeduction);
        $scope.formData.sumDiscountCoupon = $filter("currency")(resp.sumDiscountCoupon);
        $scope.formData.sumDiscountMoney = $filter("currency")(resp.sumDiscountMoney);
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }
    

		$scope.toSearch = function() {
      reload();
      getTotal()
		};
		$scope.toReset = function() {
			$scope.formData.parklotName = "";
			$scope.formData.traId = "";
			$scope.formData.plate = "";
			$scope.formData.recordId = "";
			$scope.formData.thirdSn = "";
			$scope.formData.payType = "";
			$scope.formData.chargePlat = "";
			$scope.formData.startTime = new Date(new Date().format("yyyy-MM-dd 00:00:00"));
      $scope.formData.endTime = new Date(new Date().format("yyyy-MM-dd 23:59:59"));
      $scope.formData.parklotCodes = [];
      $scope.iDisplayStart = 0;
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      reload();
      getTotal();
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
            if ($scope.formData.parklotName) {
                data.parklotName = $scope.formData.parklotName;
            }
            if ($scope.formData.traId) {
                data.traId = $scope.formData.traId;
            }
            if ($scope.formData.plate) {
                data.plate = $scope.formData.plate;
            }
            if ($scope.formData.recordId) {
                data.recordId = $scope.formData.recordId;
            }
            if ($scope.formData.thirdSn) {
                data.thirdSn = $scope.formData.thirdSn;
            }
            if ($scope.formData.payType) {
                data.payType = $scope.formData.payType;
            }
            if ($scope.formData.chargePlat) {
                data.chargePlat = $scope.formData.chargePlat;
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
            parkpayrecordService.parkpayrecordReport(data, 1).then(function (resp) {
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
                    parkpayrecordService.parkpayrecordReport(data, 2).then(function (resp) {
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
            parkpayrecordService.parkpayrecordReport(data, 2).then(function (resp) {
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
                    '记录编号': item.recordId.toString(),
                    '车牌': item.plate,
                    '停车场': item.parklotName,
                    '收费平台': sessionCache.getLookupValueByLookupName('PARKING_PAY_PLATFORM', item.chargePlat),
                    '实收金额（元）': item.payableMoney,
                    '应收金额（元）': item.payMoney,
                    '减免金额（元）': item.discountMoney,
                    '优惠金额（元）':item.discountCoupon,
                    '支付方式': sessionCache.getLookupValueByLookupName('PARKING_PAY_TYPE', item.payType),
                    '到账时间': new Date(item.payTime).format("yyyy-MM-dd hh:mm:ss"),
                }
            });
            let excelName = '停车缴费记录';
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
    getTotal();
	}
]);