'use strict';

angular.module('parkingApp').controller('parklotopeManListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'parklotopeManService', 'StateName', 'sessionCache','$filter',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, parklotopeManService, StateName, sessionCache,$filter) {

		var indexId = "#parklotopeMan-index";
		var tableId = indexId + " #parklotopeMan-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		$scope.stateGoDetail = StateName.parklotopeMan.detail;
    $scope.formData = {};
    
		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
					}
					parklotopeManService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "parklotCode" },
					{ "data": "parklotName" },
					{ "data": "isUploadPayRule","render":(data,type,full) => {
            let isUploadPayRule = sessionCache.getLookupValueByLookupName("IS_UPDLOAD_PAY_RULE",data);
            return isUploadPayRule || '';
          }},
					{ "data": "opUser" },
					{ "data": "updateTime","render": function(data, type, full) {
							if(data){
								data = $filter("date")(data,"yyyy-MM-dd HH:mm:ss");
								return data;
							}else{
								return "";
              }}
          }
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
				$state.go($scope.stateGoDetail, { id: aData.id });
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
		        $state.go($scope.stateGoEdit, {id: aData.id});
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
					parklotsService.reqDelete(data).then(function(msg) {
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