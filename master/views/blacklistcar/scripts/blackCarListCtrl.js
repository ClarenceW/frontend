'use strict';

angular.module('parkingApp').controller('blackCarListCtrl', ['$scope', 'growl', 'customerService', 'blacklistcarService', '$filter','Setting','StateName','sessionCache','$log','$timeout','parklotsService',
	function($scope, growl, customerService, blacklistcarService, $filter,Setting,StateName,sessionCache,$log,$timeout,parklotsService) {
		var indexId = "#blackcar-index";
		var tableId = indexId + " #blackcar-table";
    var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.stateGoAdd = StateName.blacklistcars.add;
    $scope.formData = {};
    $scope.carTypeOption = sessionCache.getDictsByLookupName("BLACK_VEHICLE_CAR_TYPE");
    $scope.formData.endTime = "";
    $scope.formData.startTime = "";
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
				oTable.api().ajax.reload(null, true);
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
					blacklistcarService.reqBlackCarPagination(data).then(function(resp) {
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
					{ "data": "startTime","render": (data,type,full) => {
            let startTime = new Date(data);
            return startTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "reason" },
          { "data": "opUser" },
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
			$scope.formData.endTime = "";
			$scope.formData.startTime = "";
			$scope.formData.userCode = "";
			$scope.formData.parklotName = "";
      $scope.formData.plate = "";
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			reload();
    };
  
    $scope.toRemove = function () {
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
        customerService.blacklistcarModalInstance().result.then(function (message) {
            var data = {};
            data.plate = aData.plate;
            data.plateColor = aData.plateColor;
            data.parklotCode = aData.parklotCode;
            blacklistcarService.delBlacklist(data).then(function (msg) {
                if (msg) {
                    growl.addInfoMessage("移除成功！", {ttl: 2000});
                    reload();
                } else {
                    growl.addInfoMessage("移除失败！", {ttl: 2000});
                }
            }, function (msg) {
                growl.addInfoMessage(msg, {ttl: 2000});
            });
        }, function () {
            $log.debug('Modal dismissed at: ' + new Date());
        });
      } else {
        customerService.openDeleteConfirmModal();
      }
    };

		initTable();

	}
]);