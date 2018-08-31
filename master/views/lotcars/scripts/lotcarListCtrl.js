'use strict';

angular.module('parkingApp').controller('lotcarListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'lotcarService', 'StateName', 'sessionCache','$filter',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, lotcarService, StateName, sessionCache,$filter) {

		var indexId = "#lotcar-index";
		var tableId = indexId + " #lotcar-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		// $scope.stateGoDetail = StateName.parking.indetail;
		// $scope.stateGoEdit = StateName.parklot.edit;
		$scope.formData = {};
    $scope.isOpOption = sessionCache.getIsOpGroup();
    
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
    if ($state.params.searchConditions){
       if ($state.params.searchConditions.plate) {
            $scope.formData.searchHphm = $state.params.searchConditions.plate
       }
       if ($state.params.searchConditions.crossCode) {
            $scope.formData.crossCode = $state.params.searchConditions.crossCode
       }
       if ($state.params.searchConditions.startVioTime) {
            $scope.beginDate.dt = new Date($state.params.searchConditions.startVioTime)
        }
        if ($state.params.searchConditions.endVioTime) {
            $scope.endDate.dt = new Date($state.params.searchConditions.endVioTime)
        }
   }

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.parklotCode) {
						data.parklotCode = $scope.formData.parklotCode;
					}
					if($scope.formData.name) {
						data.name = $scope.formData.name;
					}
					if($scope.formData.isOp) {
						data.isOp = $scope.formData.isOp;
					}
					lotcarService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "plate" },
					{ "data": "platecolor" },
					{ "data": "carowername" },
					{ "data": "account" },
					{ "data": "parklotname" },
					{ "data": "companyname" },
					{ "data": "carintime" },
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
			$scope.formData.parklotCode = "";
			$scope.formData.name = "";
			$scope.formData.isOp = "";
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
				$state.go($scope.stateGoDetail, { parklot: aData });
			} else {
				customerService.openDetailConfirmModal();
			}
		};

		$scope.toEdit = function () {
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
		        $state.go($scope.stateGoEdit, {parklot: aData});
		    } else {
		        customerService.openEditConfirmModal();
		    }
		};

		$scope.toDelete = function() {
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
				customerService.modalInstance().result.then(function(message) {
					var data = {};
					data.parklotCode = aData.parklotCode;
					lotcarService.reqDelete(data).then(function(msg) {
						growl.addInfoMessage(msg, { ttl: 2000 });
						reload();
					}, function(msg) {
						growl.addInfoMessage(msg, { ttl: 2000 });
					});
				}, function() {
					$log.debug('Modal dismissed at: ' + new Date());
				});
			} else {
				customerService.openDeleteConfirmModal();
			}
		}

		initTable();

	}
]);