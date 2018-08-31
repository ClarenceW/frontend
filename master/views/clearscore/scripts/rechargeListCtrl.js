'use strict';

angular.module('parkingApp').controller('RechargeListCtrl', ['$scope', 'growl', 'customerService', 'clearScoreRechargeService', '$filter', 'Setting',
	function ($scope, growl, customerService, clearScoreRechargeService, $filter, Setting) {
		var indexId = "#list-recharge-index";
		var tableId = indexId + " #list-recharge-table";
		var oTable = null;
		$scope.formData = {};

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

		var reload = function () {
			if (customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, true);
			}
		}
		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function (data, callback, settings) {
					if ($scope.formData.name) {
						data.name = $scope.formData.name;
					}
					if ($scope.formData.clearScoreBeginTime) {
						data.clearScoreTime = $scope.formData.clearScoreBeginTime;
					}
					if ($scope.formData.clearScoreEndTime) {
						data.clearScoreTime = $scope.formData.clearScoreEndTime;
					}
					clearScoreRechargeService.reqInPagination(data).then(function (resp) {
						callback(resp)
					}, function (msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "defaultContent": "" },
					{ "data": "paymentChannel" },
					{ "data": "collectionCompany" },
					{ "data": "accountPeriod" },
					{ "data": "balanceAccount" },
					{ "data": "rate" },
					{ "data": "rechargeAccount" },
					{ "data": "balanceType" },
					{ "data": "balanceStatus" }
				],
				"rowCallback": function (nRow, aData, iDisplayIndex) {
					$('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
					return nRow;
				},
				"drawCallback": function () {
					customerService.initUniform(tableId);
					customerService.initTitle();
				},
			}));
		}

		$scope.toSearch = function () {
			reload();
		};
		$scope.toReset = function () {
			$scope.formData.name = "";
			$scope.formData.clearScoreBeginTime = "";
			$scope.formData.clearScoreEndTime = "";
			reload();
		};

		initTable();

	}
]);