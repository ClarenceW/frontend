'use strict';

angular.module('parkingApp').controller('ParklotsOutListCtrl', ['$scope','growl', 'customerService', 'parklotsRecordService','$filter','Setting',
	function($scope,growl, customerService, parklotsRecordService,$filter,Setting) {

		var indexId = "#outrecord-index";
		var tableId = indexId + " #outrecord-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
		$scope.formData = {};

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, true);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.outCode) {
						data.outCode = $scope.formData.outCode;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
					}
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					parklotsRecordService.reqOutPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
				"columns": [
					{ "data": "parklotCode" },
					{ "data": "parklotName" },
					{ "data": "plate" },
					{
						"data": "plateColor",
						"render": function(data, type, full) {
							if(data === '0') {
								return "蓝";
							} else if(data === '1') {
								return "黄";
							} else if(data === '2') {
								return "黑";
							} else if(data === '3') {
								return "白";
							} else if(data === '4') {
								return "其他";
							} else {
								return "";
							}
						}
					},
					{ "data": "doorNum" },
					{ "data": "wayNum" },
					{"data" : "pic1"},
					{"data" : "pic2"},
					{
						"data": "sysTime",
						"render": function(data, type, full) {
							if(data) {
								data = $filter("date")(data, "yyyy-MM-dd HH:mm:ss");
								return data;
							} else {
								return "";
							}
						}
					}
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
					if(aData.pic1){
						var url = Setting.SERVER.DOWNLOAD+"?file=" + aData.pic1;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(6)', nRow).html($img);
					}
					if(aData.pic2){
						var url = Setting.SERVER.DOWNLOAD+"?file="+ aData.pic2;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(7)', nRow).html($img);
					}
					return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
					customerService.initTitle();
					$("#outrecord-table_info").html("&nbsp;&nbsp;共16,220条记录");
				},
			}));
		}

		$scope.toSearch = function() {
			reload();
		};
		$scope.toReset = function() {
			$scope.formData.outCode = "";
			$scope.formData.parklotName = "";
			$scope.formData.plate = "";
			reload();
		};

		initTable();

	}
]);