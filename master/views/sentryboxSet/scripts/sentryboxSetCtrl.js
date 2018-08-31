'use strict';

angular.module('parkingApp').controller('sentryboxSetCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'sentryboxsetService', 'StateName', 'sessionCache','$filter','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, sentryboxsetService, StateName, sessionCache,$filter,$timeout) {

		var indexId = "#sentryboxset-index";
		var tableId = indexId + " #sentryboxset-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.formData = {};

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.sentryboxName) {
						data.sentryboxName = $scope.formData.sentryboxName;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
					}
					sentryboxsetService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "sentryboxId" },
					{ "data": "sentryboxName" },
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
			$scope.formData.sentryboxName = "";
			reload();
		};
    initTable();
    
    $scope.setSentrybox = () => {
      var count = 0;
      var aData;
      $(checkboxesCls).each(function () {
        if ($(this).prop("checked")) {
          nRow = $(this).parents('tr')[0];
          aData = oTable.fnGetData(nRow);
          count++;
        }
      });
      if (count === 1) {
        $scope.myModal = 'myModal';
        $timeout(function() {
          $scope.myModal = '';
        },300);
      }else {
        customerService.openDetailConfirmModal();
      }
    }

	}
]);