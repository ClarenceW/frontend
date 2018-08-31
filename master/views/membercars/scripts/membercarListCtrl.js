'use strict';

angular.module('parkingApp').controller('membercarListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'membercarService', 'StateName', 'sessionCache','$filter','mouthcardBuyService','$timeout','parklotsService','$log',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, membercarService, StateName, sessionCache,$filter,mouthcardBuyService,$timeout,parklotsService,$log) {

		var indexId = "#membercar-index";
		var tableId = indexId + " #membercar-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.formData = {};
    $scope.formData.startTime = '';
    $scope.formData.endTime = '';
    $scope.vipVehicleStatusOptions = sessionCache.getDictsByLookupName("VIP_VEHICLE_STATUS");
    
    $scope.tempBeginData = {};
		$scope.tempEndData = {};
    $scope.format = "yyyy-MM-dd";
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

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
    
    mouthcardBuyService.reqcarOwnList().then(function (res) {
      $scope.vehicleOwnNameOptions = res;
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

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
					if($scope.formData.vehicleOwnName) {
						data.vehicleOwnName = $scope.formData.vehicleOwnName;
          }
					if($scope.formData.vipVehicleStatus) {
						data.vipVehicleStatus = $scope.formData.vipVehicleStatus;
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
					membercarService.reqPagination(data).then(function(resp) {
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
					{ "data": "parklotName" },
					{ "data": "userCode" },
					{ "data": "userName" },
					{ "data": "vehicleOwnName" },
					{ "data": "startTime"},
					{ "data": "endTime"},
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
    
    function getStatus() {
      let data = {};
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
      if($scope.formData.vehicleOwnName) {
        data.vehicleOwnName = $scope.formData.vehicleOwnName;
      }
      if($scope.formData.vipVehicleStatus) {
        data.vipVehicleStatus = $scope.formData.vipVehicleStatus;
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
      membercarService.reqStatus(data).then(function(resp) {
        $scope.vipVehicleStatusOptions = resp;
        $timeout(()=> {
          $(".statusBtn").eq(0).addClass('btn-success');
          $(".statusBtn").eq(1).addClass('btn-warning');
          $(".statusBtn").eq(2).addClass('btn-danger');
        },10)
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      });
    }

    $scope.toReqStatus = status => {
      $scope.formData.vipVehicleStatus = status;
      reload();
    }

		$scope.toSearch = function() {
      reload();
      getStatus();
		};
		$scope.toReset = function() {
			$scope.formData.parklotName = "";
			$scope.formData.vehicleOwnName = "";
			$scope.formData.userCode = "";
			$scope.formData.plate = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.formData.vipVehicleStatus = '';
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      reload();
      getStatus();
    };
    
    $scope.toDelete = function() {
			var count = 0;
			var aData = [];
			$(checkboxesCls).each(function() {
				if($(this).prop("checked")) {
					nRow = $(this).parents('tr')[0];
					aData.push(oTable.fnGetData(nRow));
					count++;
				}
			});
			if(count != 0) {
        customerService.modalInstance().result.then(function(message) {
          var data = [];
          data = Array.from(aData,item => {
            let obj = {};
            obj.parklotCode = item.parklotCode;
            obj.plate = item.plate;
            obj.plateColor = item.plateColor;
            obj.opUser = sessionCache.getUserCode();
            return obj;
          })
          membercarService.reqDelete(data).then(function(msg) {
            growl.addInfoMessage(msg, { ttl: 2000 });
            reload();
          }, function(msg) {
            growl.addInfoMessage(msg, { ttl: 2000 });
          });
        }, function() {
          $log.debug('Modal dismissed at: ' + new Date());
        });
			} else {
				customerService.openMultiDeleteConfirmModal();
			}
		}

		initTable();
    getStatus();
	}
]);