'use strict';

angular.module('parkingApp').controller('ParklotsListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'parklotsService', 'StateName', 'sessionCache','$filter','$log','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, parklotsService, StateName, sessionCache,$filter,$log,$timeout) {

		var indexId = "#parklots-index";
		var tableId = indexId + " #parklots-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		$scope.stateGoDetail = StateName.parklot.detail;
		$scope.stateGoEdit = StateName.parklot.edit;
		$scope.stateGoAdd = StateName.parklot.add;
		$scope.formData = {};
    $scope.isOpOption = sessionCache.getDictsByLookupName("DCLOT_OP");
    $scope.formData.isOp = '1';
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    
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
					if($scope.formData.name) {
						data.name = $scope.formData.name;
					}
					if($scope.formData.parklotCodes) {
						data.parklotCodes = $scope.formData.parklotCodes;
					}
					if($scope.formData.isOp) {
						data.isOp = $scope.formData.isOp;
          }
          if ($scope.tempData.startTime) {
              var _date = $scope.tempData.startTime.format("yyyy-MM-dd");
              data.startTime = _date;
          }
          if ($scope.tempData.endTime) {
              var _date = $scope.tempData.endTime.format("yyyy-MM-dd");
              data.endTime = _date;
          }
          if($scope.tempData.startTime  && $scope.tempData.endTime) {
            if($scope.tempData.startTime > $scope.tempData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					parklotsService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "name" },
					{ "data": "berthNum" },
					{ "data": "address"},
					{ "data": "contacts" },
					{ "data": "contactNumber" },
					{ "data": "updateTime","render": function(data, type, full) {
							if(data){
								data = $filter("date")(data,"yyyy-MM-dd HH:mm:ss");
								return data;
							}else{
								return "";
              }}
          },
					{ "data": "isOp","render":(data,type,full) => {
            let isOp = sessionCache.getLookupValueByLookupName("DCLOT_OP",data);
            return isOp || '';          
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
			$scope.tempData.startTime = "";
			$scope.tempData.endTime = "";
			$scope.formData.name = "";
      $scope.formData.isOp = "";
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
				if(aData.isOp == 0) {
          customerService.enableModalInstance().result.then(function(message) {
            var data = {};
            data.code = aData.code;
            parklotsService.reqEnable(data).then(function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
              reload();
            }, function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
            });
          }, function() {
            $log.debug('Modal dismissed at: ' + new Date());
          });
        }else {
          growl.addInfoMessage("该停车场已启用！", { ttl: 2000 });
        }
			} else {
				customerService.openEditConfirmModal();
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
		        $state.go($scope.stateGoEdit, {code: aData.code});
		    } else {
		        customerService.openDetailConfirmModal();
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
        if(aData.isOp == 1) {
          customerService.unableModalInstance().result.then(function(message) {
            var data = {};
            data.code = aData.code;
            parklotsService.reqDelete(data).then(function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
              reload();
            }, function(msg) {
              growl.addInfoMessage(msg, { ttl: 2000 });
            });
          }, function() {
            $log.debug('Modal dismissed at: ' + new Date());
          });
        }else {
          growl.addInfoMessage("该停车场已停用！", { ttl: 2000 });
        }
				
			} else {
				customerService.openDeleteConfirmModal();
			}
		}

		initTable();

	}
]);