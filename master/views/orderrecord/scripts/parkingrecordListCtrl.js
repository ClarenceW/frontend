'use strict';

angular.module('parkingApp').controller('parkingrecordListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'parkingrecordService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, parkingrecordService, StateName, sessionCache,$filter,$timeout,parklotsService) {

		var indexId = "#parkingrecord-index";
		var tableId = indexId + " #parkingrecord-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.parkingrecord.detail;
    $scope.formData = {};
    $scope.formData.startTime = new Date();
    $scope.formData.endTime = new Date();
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
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
					if($scope.formData.boId) {
						data.boId = $scope.formData.boId;
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
					parkingrecordService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "parkingInId" },
					{ "data": "boId" },
					{ "data": "plate" },
          { "data": "parklotName"},
          { "data": "createTime","render": (data,type,full) => {
            let createTime = new Date(data);
            return createTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "payableMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "orderStatus","render":(data,type,full) => {
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
			$scope.formData.parklotName = "";
			$scope.formData.boId = "";
			$scope.formData.plate = "";
			$scope.formData.startTime = new Date();
      $scope.formData.endTime = new Date();
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
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
				$state.go($scope.stateGoDetail, { boId: aData.boId });
			} else {
				customerService.openDetailConfirmModal();
			}
    };
    
		initTable();

	}
]);