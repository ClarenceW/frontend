'use strict';

angular.module('parkingApp').controller('ParklotsInListCtrl', ['$scope', 'growl', 'customerService', 'parklotsRecordService', '$filter','Setting',
	function($scope, growl, customerService, parklotsRecordService, $filter,Setting) {
		var indexId = "#inrecord-index";
		var tableId = indexId + " #inrecord-table";
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
					parklotsRecordService.reqInPagination(data).then(function(resp) {
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
					{ "data": "inTime" },
					{ "data": "inPic1" },
					{ "data": "inPic2" },
					{ "data": "outTime" },
					{ "data": "outPic1" },
					{ "data": "outPic2" },
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
					if(aData.inPic1){
						var url = Setting.SERVER.DOWNLOAD+"?file=" + aData.inPic1;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(5)', nRow).html($img);
					}
					if(aData.inPic2){
						var url = Setting.SERVER.DOWNLOAD+"?file="+ aData.inPic2;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(6)', nRow).html($img);
					}
					if(aData.outPic1){
						var url = Setting.SERVER.DOWNLOAD+"?file=" + aData.outPic1;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(8)', nRow).html($img);
					}
					if(aData.outPic2){
						var url = Setting.SERVER.DOWNLOAD+"?file="+ aData.outPic2;
						var $img = $("<img>").attr({"src":url}).css({"width":"50px","height":"auto"}).addClass("img-circle")
						$('td:eq(9)', nRow).html($img);
					}
					return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
					customerService.initTitle();
					$("#inrecord-table_info").html("&nbsp;&nbsp;共15,789条记录");
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