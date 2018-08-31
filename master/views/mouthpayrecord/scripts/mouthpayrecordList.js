'use strict';

angular.module('parkingApp').controller('mouthpayrecordList', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'mouthpayrecordService', 'StateName', 'sessionCache','$filter',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, mouthpayrecordService, StateName, sessionCache,$filter) {

		var indexId = "#mouthpayrecord-index";
		var tableId = indexId + " #mouthpayrecord-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.stateGoDetail = StateName.mouthpayrecord.detail;
    let params = $state.params.params || {}
    $scope.formData = params;
    $scope.formData.startTime = params.startTime ? new Date(new Date(params.startTime).format("yyyy-MM-dd hh:mm:ss")) : '';
    $scope.formData.endTime = params.endTime ? new Date(new Date(params.endTime).format("yyyy-MM-dd hh:mm:ss")) : '';
    $scope.formData.status = params.status ? params.status : '20';
    $scope.statusOption = sessionCache.getDictsByLookupName("ORDER_STATUS");
    $scope.paySrcOption = sessionCache.getDictsByLookupName("CARD_ORDER_SRC");
    $scope.payTypeOption = sessionCache.getDictsByLookupName("MONTHCARD_PAY_TYPE");
    $scope.iDisplayStart = $scope.formData.start || 0;
    
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
					if($scope.formData.orderCode) {
						data.orderCode = $scope.formData.orderCode;
					}
					if($scope.formData.payType) {
						data.payType = $scope.formData.payType;
					}
					if($scope.formData.transactionCode) {
						data.transactionCode = $scope.formData.transactionCode;
					}
					if($scope.formData.thirdCode) {
						data.thirdCode = $scope.formData.thirdCode;
          }
					if($scope.formData.cardCode) {
						data.cardCode = $scope.formData.cardCode;
					}
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.paySrc) {
						data.paySrc = $scope.formData.paySrc;
					}
					if($scope.formData.status) {
						data.status = $scope.formData.status;
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
					mouthpayrecordService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#mouthpayrecord-table_paginate").find("li[class='active']").removeClass('active')
              $("#mouthpayrecord-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        iDisplayStart: $scope.iDisplayStart,
				"columns": [
					{ "defaultContent": "" },
					{ "data": "thirdCode" },
					{ "data": "cardCode" },
					{ "data": "cardName" },
					{ "data": "parklotName" },
					{ "data": "plate" },
					{ "data": "payType","render": (data,type,full) => {
            let payType = sessionCache.getLookupValueByLookupName('MONTHCARD_PAY_TYPE',data);
            return payType || '';
          }},
					{ "data": "paySrc","render": (data,type,full) => {
            let paySrc = sessionCache.getLookupValueByLookupName('CARD_ORDER_SRC',data);
            return paySrc || '';
          }},
          { "data": "orderMoney"},
					{ "data": "createTime","render": (data,type,full) => {
            let createTime = new Date(data);
            return createTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "status","render": (data,type,full) => {
            let status = sessionCache.getLookupValueByLookupName('ORDER_STATUS',data);
            return status || '';
          }},
          { "defaultContent": "" },
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          if(aData.thirdCode) {
            let str = aData.thirdCode.substring(0,5) + '...';
            $('td:eq(1)', nRow).html(`<div style="max-width:300px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.thirdCode}">${str}</div>`)
          }else {
            $('td:eq(1)', nRow).html('');
          }
          if(aData.parklotName) {
            let str = aData.parklotName.substring(0,7) + '...';
            $('td:eq(4)', nRow).html(`<div style="max-width:300px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.parklotName}">${str}</div>`)
          }else {
            $('td:eq(4)', nRow).html('');
          }
          $('td:eq(11)', nRow).html("<button type=\"button\" class=\"btn btn-default\"><span class=\"fa fa-edit\"></span>详情</button>");
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
                    $state.go($scope.stateGoDetail, { orderCode: aData.orderCode, params: params  });
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
      if($scope.formData.orderCode) {
        data.orderCode = $scope.formData.orderCode;
      }
      if($scope.formData.transactionCode) {
        data.transactionCode = $scope.formData.transactionCode;
      }
      if($scope.formData.thirdCode) {
        data.thirdCode = $scope.formData.thirdCode;
      }
      if($scope.formData.cardCode) {
        data.cardCode = $scope.formData.cardCode;
      }
      if($scope.formData.payType) {
        data.payType = $scope.formData.payType;
      }
      if($scope.formData.plate) {
        data.plate = $scope.formData.plate;
      }
      if($scope.formData.paySrc) {
        data.paySrc = $scope.formData.paySrc;
      }
      if($scope.formData.status) {
        data.status = $scope.formData.status;
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
      mouthpayrecordService.reqTotalCharge(data).then(resp => {
        $scope.formData.sumMoney = $filter("currency")(resp.sumMoney);
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }

		$scope.toSearch = function() {
      reload();
      getTotal()
		};
		$scope.toReset = function() {
			$scope.formData.orderCode = "";
			$scope.formData.plate = "";
			$scope.formData.transactionCode = "";
			$scope.formData.thirdCode = "";
			$scope.formData.cardCode = "";
			$scope.formData.paySrc = "";
			$scope.formData.status = "20";
			$scope.formData.payType = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.iDisplayStart = 0;
      reload();
      getTotal()
    };
    
		initTable();
    getTotal();
	}
]);