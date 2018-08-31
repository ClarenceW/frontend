'use strict';

angular.module('parkingApp').controller('blackCarListCtrl', ['$scope', 'growl', 'customerService', 'networkMonitorService', '$filter','Setting',
	function($scope, growl, customerService, networkMonitorService, $filter,Setting) {
		var indexId = "#blackcar-index";
		var tableId = indexId + " #blackcar-table";
		var oTable = null;
		$scope.formData = {};

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, true);
			}
		}
		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.inCode) {
						data.inCode = $scope.formData.inCode;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
					}
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					networkMonitorService.reqBlackCarPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "plate" },
					{ "data": "plateColor" },
					{ "data": "userCode" },
					{ "data": "fee","render":function(data,type,full){
						data = $filter("currency")(data);
						return data;
					}},
					{ "data": "plotName" },
					{ "data": "inTime" },
					{ "data": "inPic" },
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
					$('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
					var url = aData.inPic;//'scripts/services/module/data/car.jpg';
					var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(7)', nRow).html($img);
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
			$scope.formData.inCode = "";
			$scope.formData.parklotName = "";
			$scope.formData.plate = "";
			reload();
		};

		initTable();

	}
]);