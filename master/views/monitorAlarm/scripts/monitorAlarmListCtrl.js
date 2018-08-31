'use strict';

angular.module('parkingApp').controller('monitorAlarmListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'monitorAlarmService', 'StateName', 'sessionCache','$filter','$log',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, monitorAlarmService, StateName, sessionCache,$filter,$log) {

		var indexId = "#monitoralarm-index";
		var tableId = indexId + " #monitoralarm-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		$scope.formData = {};
    $scope.alarmTypeOption = sessionCache.getDictsByLookupName("MONITOR_ALARM_TYPE");
    
    $scope.tempData = {};
    $scope.dt = null;
    ///---datepicker-popup plugin---///
    $scope.format = "yyyy-MM-dd";

    $scope.open = function () {
        $scope.tempData.opened = true;
    };
    $scope.open2 = function () {
        $scope.tempData.opened2 = true;
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        return false;
    }

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2025, 12, 31),
        minDate: new Date(2015, 1, 1),
        startingDay: 1
    };

    $scope.dateOptions2 = {
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
					if($scope.formData.laneCode) {
						data.laneCode = $scope.formData.laneCode;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
					if($scope.formData.laneName) {
						data.laneName = $scope.formData.laneName;
          }
					if($scope.formData.alarmType) {
						data.alarmType = $scope.formData.alarmType;
          }
          if ($scope.tempData.startTime) {
              var _date = $scope.tempData.startTime.format("yyyy-MM-dd 00:00:00");
              data.startTime = _date;
          }
          if ($scope.tempData.endTime) {
              var _date = $scope.tempData.endTime.format("yyyy-MM-dd 23:59:59");
              data.endTime = _date;
          }
          if($scope.tempData.startTime  && $scope.tempData.endTime) {
            if($scope.tempData.startTime > $scope.tempData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					monitorAlarmService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "parklotName" },
					{ "data": "laneName" },
					{ "data": "equipmentCode"},
					{ "data": "alarmType","render":(data,type,full) => {
            let alarmType = sessionCache.getLookupValueByLookupName("MONITOR_ALARM_TYPE",data);
            return alarmType || '';          
          }},
					{ "data": "alarmTime"}
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
			$scope.tempData.startTime = "";
			$scope.tempData.endTime = "";
			$scope.formData.laneCode = "";
			$scope.formData.parklotName = "";
			$scope.formData.laneName = "";
			$scope.formData.alarmType = "";
			reload();
		};

		initTable();

	}
]);