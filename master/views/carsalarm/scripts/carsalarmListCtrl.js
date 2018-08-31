'use strict';

angular.module('parkingApp').controller('carsalarmListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'carsalarmService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, carsalarmService, StateName, sessionCache,$filter,$timeout,parklotsService) {

		var indexId = "#carsalarm-index";
		var tableId = indexId + " #carsalarm-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.alarmTypeOption = sessionCache.getDictsByLookupName("ALARM_TYPE");
    $scope.formData = {};
    $scope.formData.startTime = '';
    $scope.formData.endTime = '';
    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': '',
        'actionsBox':true,
      });
    },200);
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
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
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
					if($scope.formData.userCode) {
						data.userCode = $scope.formData.userCode;
          }
					if($scope.formData.alarmType) {
						data.alarmType = $scope.formData.alarmType;
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
					carsalarmService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "plate" },
					{ "data": "plateColor","render": (data,type,full) => {
            let plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',data);
            return plateColor || '';
          }},
          { "data": "alarmType","render": (data,type,full) => {
            let alarmType = sessionCache.getLookupValueByLookupName('ALARM_TYPE',data);
            return alarmType || '';
          }},
					{ "data": "userCode" },
          { "data": "parklotName"},
					
					{ "data": "parkDirection","render": (data,type,full) => {
            let parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION',data);
            return parkDirection || '';
          }},
					{ "data": "entranceName"},
					{ "data": "alarmTime","render": (data,type,full) => {
            let endTime = new Date(data);
            return endTime.format("yyyy-MM-dd hh:mm:ss");
          }},
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
					$('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
					return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
					customerService.initTitle();
				},
			}));
		}

		$scope.toSearch = function() {
			reload();
		};
		$scope.toReset = function() {
      $scope.formData.parklotName = "";
			$scope.formData.userCode = "";
			$scope.formData.alarmType = "";
			$scope.formData.plate = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			reload();
		};
		initTable();

	}
]);