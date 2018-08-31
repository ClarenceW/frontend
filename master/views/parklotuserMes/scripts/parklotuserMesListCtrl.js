'use strict';

angular.module('parkingApp').controller('parklotuserMesListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'parklotsService', 'StateName', 'sessionCache','$filter','$log','$timeout','parklotuserMesService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, parklotsService, StateName, sessionCache,$filter,$log,$timeout,parklotuserMesService) {

		var indexId = "#parklotusermes-index";
		var tableId = indexId + " #parklotusermes-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		$scope.stateGoDetail = StateName.parklotuser.detail;
		$scope.stateGoEdit = StateName.parklotuser.edit;
		$scope.stateGoAdd = StateName.parklotuser.add;
		$scope.formData = {};
    $scope.enableOption = sessionCache.getDictsByLookupName("PARKLOT_USER_ENABLE");
    $scope.formData.enable = '1';
    
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
					if($scope.formData.userCode) {
						data.userCode = $scope.formData.userCode;
					}
					if($scope.formData.userName) {
						data.userName = $scope.formData.userName;
					}
					if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
					}
					if($scope.formData.enable) {
						data.enable = $scope.formData.enable;
          }
					parklotuserMesService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "userCode" },
					{ "data": "userName" },
					{ "data": "parklotNames"},
					{ "data": "description" },
					{ "data": "opUser" },
					{ "data": "opTime","render": function(data, type, full) {
							if(data){
								data = $filter("date")(data,"yyyy-MM-dd HH:mm:ss");
								return data;
							}else{
								return "";
              }}
          },
					{ "data": "enable","render":(data,type,full) => {
            let enable = sessionCache.getLookupValueByLookupName("PARKLOT_USER_ENABLE",data);
            return enable || '';          
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
			$scope.formData.userCode = "";
			$scope.formData.userName = "";
			$scope.formData.enable = "1";
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			reload();
		};
		$scope.toEnable = function() {
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
				if(aData.enable == 0) {
          customerService.enableUserModalInstance().result.then(function(message) {
            var data = {};
            data.userCode = aData.userCode;
            parklotuserMesService.reqEnable(data).then(function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
              reload();
            }, function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
            });
          }, function() {
            $log.debug('Modal dismissed at: ' + new Date());
          });
        }else {
          growl.addInfoMessage("该收费员已启用！", { ttl: 2000 });
        }
			} else {
				customerService.openEditConfirmModal();
			}
    };
    
    $scope.toDetail = function () {
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
            $state.go($scope.stateGoDetail, {userCode: aData.userCode});
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
		        $state.go($scope.stateGoEdit, {userCode: aData.userCode});
		    } else {
		        customerService.openDetailConfirmModal();
		    }
		};

		$scope.toClose = function() {
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
        if(aData.enable == 1) {
          customerService.unableUserModalInstance().result.then(function(message) {
            var data = {};
            data.userCode = aData.userCode;
            parklotuserMesService.reqClose(data).then(function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
              reload();
            }, function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
            });
          }, function() {
            $log.debug('Modal dismissed at: ' + new Date());
          });
        }else {
          growl.addInfoMessage("该收费员已停用！", { ttl: 2000 });
        }
				
			} else {
				customerService.openDeleteConfirmModal();
			}
    }
    
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
        if(aData.enable == 0) {
          customerService.modalInstance().result.then(function(message) {
            var data = {};
            data.userCode = aData.userCode;
            parklotuserMesService.reqDelete(data).then(function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
              reload();
            }, function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
            });
          }, function() {
            $log.debug('Modal dismissed at: ' + new Date());
          });
        }else {
          growl.addInfoMessage("该收费员已启用，不能删除！", { ttl: 2000 });
        }
				
			} else {
				customerService.openDeleteConfirmModal();
			}
		}

		initTable();

	}
]);