'use strict';

angular.module('parkingApp').controller('mouthbuyorderListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'mouthbuyorderService', 'StateName', 'sessionCache','$filter',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, mouthbuyorderService, StateName, sessionCache,$filter) {

		var indexId = "#mouthbuyorder-index";
		var tableId = indexId + " #mouthbuyorder-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.stateGoDetail = StateName.mouthbuyorder.detail;
    $scope.formData = {};
    $scope.formData.startTime = new Date();
    $scope.formData.endTime = new Date();
    $scope.orderSrcOption = sessionCache.getDictsByLookupName("CARD_ORDER_SRC");
    $scope.orderStatusOption = sessionCache.getDictsByLookupName("BO_ORDER_STATUS");
    
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
					if($scope.formData.id) {
						data.id = $scope.formData.id;
					}
					if($scope.formData.orderSrc) {
						data.orderSrc = $scope.formData.orderSrc;
					}
					if($scope.formData.userCode) {
						data.userCode = $scope.formData.userCode;
          }
					if($scope.formData.cardCode) {
						data.cardCode = $scope.formData.cardCode;
					}
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.orderStatus) {
						data.orderStatus = $scope.formData.orderStatus;
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
					mouthbuyorderService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "id" },
					{ "data": "cardCode" },
          { "data": "plateColor","render": (data,type,full) => {
            let plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',data);
            return plateColor || '';
          }},
          { "data": "plate" },
					{ "data": "orderSrc","render": (data,type,full) => {
            let orderSrc = sessionCache.getLookupValueByLookupName('CARD_ORDER_SRC',data);
            return orderSrc || '';
          }},
          { "data": "userCode"},
					{ "data": "createTime","render": (data,type,full) => {
            let createTime = new Date(data);
            return createTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "payMoney"},
          { "data": "orderStatus","render": (data,type,full) => {
            let orderStatus = sessionCache.getLookupValueByLookupName('BO_ORDER_STATUS',data);
            return orderStatus || '';
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
			$scope.formData.id = "";
			$scope.formData.plate = "";
			$scope.formData.orderSrc = "";
			$scope.formData.userCode = "";
			$scope.formData.cardCode = "";
			$scope.formData.orderStatus = "";
			$scope.formData.startTime = new Date();
			$scope.formData.endTime = new Date();
			reload();
    };
    
    // $scope.toDetail = function() {
		// 	var count = 0;
		// 	var aData;
		// 	$(checkboxesCls).each(function() {
		// 		if($(this).prop("checked")) {
		// 			nRow = $(this).parents('tr')[0];
		// 			aData = oTable.fnGetData(nRow);
		// 			count++;
		// 		}
		// 	});
		// 	if(count === 1) {
		// 		$state.go($scope.stateGoDetail, { id: aData.id });
		// 	} else {
		// 		customerService.openDetailConfirmModal();
		// 	}
    // };
    
		initTable();

	}
]);