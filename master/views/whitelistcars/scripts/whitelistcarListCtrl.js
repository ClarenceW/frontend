'use strict';

angular.module('parkingApp').controller('whitelistcarListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'whitelistcarService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService','$log',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, whitelistcarService, StateName, sessionCache,$filter,$timeout,parklotsService,$log) {

		var indexId = "#whitelistcar-index";
		var tableId = indexId + " #whitelistcar-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoAdd = StateName.whitelistcars.add;
    $scope.stateGoEdit = StateName.whitelistcars.edit;
    $scope.stateGoCountAdd = StateName.whitelistcars.countAdd;
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.iDisplayStart = $scope.formData.start || 0;
    $scope.formData.startTime =params.startTime ? new Date(params.startTime) : '';
    $scope.formData.endTime = params.endTime ? new Date(params.endTime) : '';
    $scope.formData.parklotCode = [];
    
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
			// if(customerService.isDataTableExist(tableId)) {
			// 	oTable.api().ajax.reload(null, false);
      // }
      initTable();
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
        "destroy": true,
				"ajax": function(data, callback, settings) {
          let flg = $state.params.flg;
          if (flg == 1) {
            data.start = $scope.formData.start || 0;
            data.length = $scope.formData.length || 10;
            let start = data.start;
            let length = data.length;
            delete $state.params['flg'];
          } else {
            $scope.formData.start = data.start;
            $scope.formData.length = data.length;
          }
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.parklotCode) {
						data.parklotCode = $scope.formData.parklotCode;
					}
					if($scope.formData.userName) {
						data.userName = $scope.formData.userName;
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
					whitelistcarService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#whitelistcar-table_paginate").find("li[class='active']").removeClass('active')
              $("#whitelistcar-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
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
					{ "data": "parklotName"},
					{ "data": "userCode" },
					{ "data": "userName" },
					{ "data": "startTime","render": (data,type,full) => {
            let startTime = new Date(data);
            return startTime.format("yyyy-MM-dd");
          }},
					{ "data": "endTime","render": (data,type,full) => {
            let endTime = new Date(data);
            return endTime.format("yyyy-MM-dd");
          }},
          { "data": "opUser" },
          { "data": "regTime","render": (data,type,full) => {
            let regTime = new Date(data);
            return regTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "description","render": (data,type,full) => {
            let description;
            if(data == 'null') {
              description = '';
            }else {
              description = data;
            }
            return description;
          }},
        ],
        iDisplayStart: $scope.iDisplayStart,
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          let parklotName = '';
          if(aData.parklotName.split('/').length > 1) {
            parklotName = aData.parklotName.split('/')[0] + ' ...';
          }else {
            parklotName = aData.parklotName;
          }
          $('td:eq(3)', nRow).html(`<div style="max-width:600px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.parklotName}">${parklotName}</div>`);
					return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
          customerService.initTitle();
          $("[data-toggle='tooltip']").tooltip();
				},
			}));
		}

		$scope.toSearch = function() {
			reload();
		};
		$scope.toReset = function() {
			$scope.formData.parklotCode = [];
			$scope.formData.userCode = "";
			$scope.formData.userName = "";
			$scope.formData.plate = "";
			$scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.iDisplayStart = 0;
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			reload();
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
        $state.go( $scope.stateGoEdit, {data: aData, params: params });
      } else {
          customerService.openEditConfirmModal();
      }
    };
    $scope.toDelete = function () {
      var count = 0;
      var aData = [];
      $(checkboxesCls).each(function () {
        if ($(this).prop("checked")) {
          nRow = $(this).parents('tr')[0];
          aData.push(oTable.fnGetData(nRow));
          count++;
        }
      });
      if (count != 0) {
        customerService.whitelistcarModalInstance().result.then(function (message) {
          var data = [];
          data = Array.from(aData,item => {
            let obj = {};
            obj.parklotCode = item.parklotCode;
            obj.plate = item.plate;
            obj.plateColor = item.plateColor;
            return obj;
          })
            whitelistcarService.delWhite(data).then(function (msg) {
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
    $scope.toCountAdd = function () {
      $state.go($scope.stateGoCountAdd);
    };
    initTable();

	}
]);