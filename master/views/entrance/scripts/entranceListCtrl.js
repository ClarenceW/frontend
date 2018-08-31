'use strict';

angular.module('parkingApp').controller('entranceListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'entranceService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, entranceService, StateName, sessionCache,$filter,$timeout,parklotsService) {

		var indexId = "#entrance-index";
		var tableId = indexId + " #entrance-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.formData = {};
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.laneName) {
						data.laneName = $scope.formData.laneName;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
					}
					entranceService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "laneId" },
					{ "data": "laneName" },
					{ "data": "laneType","render": (data,type,full) => {
            let laneType = sessionCache.getLookupValueByLookupName('LANE_TYPE',data);
            return laneType || '';
          }},
					{ "data": "parklotName"},
					{ "data": "updateTime"},
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
      $scope.formData.laneName = "";
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			reload();
		};
		initTable();

	}
]);