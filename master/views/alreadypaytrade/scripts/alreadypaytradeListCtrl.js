'use strict';

angular.module('parkingApp').controller('alreadypaytradeListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'alreadypaytradeService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, alreadypaytradeService, StateName, sessionCache,$filter,$timeout,parklotsService) {

		var indexId = "#alreadypaytrade-index";
		var tableId = indexId + " #alreadypaytrade-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.stateGoDetail = StateName.payrecord.detail;
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.formData.startTime = new Date(params.startTime ? params.startTime : new Date().format('yyyy-MM-dd 00:00:00'));
    $scope.formData.endTime = new Date(params.endTime ? params.endTime : new Date().format('yyyy-MM-dd 23:59:59'));
    $scope.statusOption = sessionCache.getDictsByLookupName("ORDER_STATUS");
    $scope.paySrcOption = sessionCache.getDictsByLookupName("STOP_ORDER_SRC");
    $scope.payTypeOption = sessionCache.getDictsByLookupName("PARKING_PAY_TYPE");
    $scope.formData.orderStatus = params.orderStatus ? params.orderStatus : '20';
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
					if($scope.formData.boId) {
						data.boId = $scope.formData.boId;
					}
					if($scope.formData.traId) {
						data.traId = $scope.formData.traId;
					}
					if($scope.formData.orderStatus) {
						data.orderStatus = $scope.formData.orderStatus;
          }
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
					}
					if($scope.formData.paySrc) {
						data.paySrc = $scope.formData.paySrc;
					}
					if($scope.formData.payType) {
						data.payType = $scope.formData.payType;
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
					alreadypaytradeService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#alreadypaytrade-table_paginate").find("li[class='active']").removeClass('active')
              $("#alreadypaytrade-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        iDisplayStart: $scope.iDisplayStart,
				"columns": [
					{ "defaultContent": "" },
					{ "defaultContent": "" },
					{ "data": "plate" },
          { "data": "parklotName"},
          { "data": "payType","render": (data,type,full) => {
            let payType = sessionCache.getLookupValueByLookupName('PARKING_PAY_TYPE',data);
            return payType || '';
          }},
          { "data": "paySrc","render": (data,type,full) => {
            let paySrc = sessionCache.getLookupValueByLookupName('STOP_ORDER_SRC',data);
            return paySrc || '';
          }},
          { "data": "payMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "createTime","render": (data,type,full) => {
            let createTime = new Date(data);
            return createTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "orderStatus","render": (data,type,full) => {
            let orderStatus = sessionCache.getLookupValueByLookupName('ORDER_STATUS',data);
            return orderStatus || '';
          }},
          { "defaultContent": "" },
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          if(aData.thirdSn) {
            let str = aData.thirdSn.substring(0,5) + '...';
            $('td:eq(1)', nRow).html(`<div style="max-width:300px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.thirdSn}">${str}</div>`)
          }else {
            $('td:eq(1)', nRow).html('');
          }
          if(aData.parklotName) {
            let str = aData.parklotName.substring(0,7) + '...';
            $('td:eq(3)', nRow).html(`<div style="max-width:300px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.parklotName}">${str}</div>`)
          }else {
            $('td:eq(3)', nRow).html('');
          }
          $('td:eq(9)', nRow).html("<button type=\"button\" class=\"btn btn-default\"><span class=\"fa fa-edit\"></span>详情</button>");
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
                    $state.go($scope.stateGoDetail, { traId: aData.traId, params: params  });
                  })
              }
          }
					customerService.initUniform(tableId);
          customerService.initTitle();
          $("[data-toggle='tooltip']").tooltip();
				}
			}));
    }
    
    function getTotal() {
      let data = {};
      if($scope.formData.boId) {
        data.boId = $scope.formData.boId;
      }
      if($scope.formData.traId) {
        data.traId = $scope.formData.traId;
      }
      if($scope.formData.orderStatus) {
        data.orderStatus = $scope.formData.orderStatus;
      }
      if($scope.formData.plate) {
        data.plate = $scope.formData.plate;
      }
      if($scope.formData.parklotName) {
        data.parklotName = $scope.formData.parklotName;
      }
      if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.paySrc) {
        data.paySrc = $scope.formData.paySrc;
      }
      if($scope.formData.payType) {
        data.payType = $scope.formData.payType;
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
      alreadypaytradeService.reqTotalCharge(data).then(resp => {
        $scope.formData.sumMoney = $filter("currency")(resp.sumMoney);
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }

		$scope.toSearch = function() {
      reload();
      getTotal();
		};
		$scope.toReset = function() {
			$scope.formData.parklotName = "";
			$scope.formData.plate = "";
			$scope.formData.boId = "";
			$scope.formData.traId = "";
			$scope.formData.paySrc = "";
			$scope.formData.payType = "";
			$scope.formData.orderStatus = "20";
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
    
		initTable();
    getTotal();
	}
]);