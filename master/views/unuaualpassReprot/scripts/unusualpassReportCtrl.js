'use strict';

angular.module('parkingApp').controller('unusualpassReportCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'unusualpassReportService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService','parklotsService','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, unusualpassReportService, StateName, sessionCache,$filter,$compile,Setting,excelService,parklotsService,$timeout) {

		var indexId = "#unusualpassReport-index";
		var tableId = indexId + " #unusualpassReport-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.formData = {};
    $scope.selDateFlg = 1;
    var yesterday = new Date().setTime(new Date().getTime() -24*60*60*1000);
    $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
    $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
    
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

		function initTable(index) {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
          if($scope.formData.startTime) {
						data.startTime = $scope.formData.startTime.replace(/-/g,"");
					}
          if($scope.formData.endTime) {
						data.endTime = $scope.formData.endTime.replace(/-/g,"");
					}
          data.index = index;
					unusualpassReportService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        destroy:true,
				"columns": [
					{ "defaultContent": ""},
					{ "data": "date","render":(data,type,full) => {
						let selDateFlg = $scope.selDateFlg;
						if(selDateFlg === 2){
							// data = data.substring(0,7)
						}else if(selDateFlg === 3) {
              data = data.substring(0,7)
            }
						return data;
					}},
          { "data": "parklotName"},
          { "data": "totalNum"},
          { "data": "extNum"},
          { "data": "extMoney"},
          { "data": "extRate"},
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
					$('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
					return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
					customerService.initTitle();
				}
			}));
		}

		$scope.toSearch = function() {
			reload();
		};
		$scope.toReset = function() {
			$scope.selDateFlg = 1;
			$scope.format = "yyyy-MM-dd";
      $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
      $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      initTable(1);
			reload();
    };
    $scope.selDate = function(index){
			$scope.selDateFlg = index;
			if(index === 1){
        $("#selDateShow").text('报表日期');
        $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
        $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
			}else if(index === 2){
        $("#selDateShow").text('报表日期');
        $scope.formData.startTime = new Date().format("yyyy-MM");
      }else if(index === 3){
        $("#selDateShow").text('报表月份');
        $scope.formData.startTime = new Date().format("yyyy");
      }
      initTable(index);
		}

     /****   excel导出代码开始     ******/
     $scope.downloadExcel = function () {
			let reqData = {};
			let selDateFlg = $scope.selDateFlg;
			let title = '报表日期';
			if(selDateFlg === 2){
				title = '报表日期';
			}else if(selDateFlg === 3) {
        title = '报表月份';
      }
			if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.startTime) {
        reqData.startTime = $scope.formData.startTime.replace(/-/g,"");
      }
      if($scope.formData.endTime) {
        reqData.endTime = $scope.formData.endTime.replace(/-/g,"");
      }
      reqData.index = selDateFlg;
			unusualpassReportService.reqList(reqData).then( resp => {
				if(resp && resp.length > 0){
					let excelData = [];
					let number = 1;
					excelData = resp.map(function (item) {
						return {
							[title]: item.date,
							'停车场名称': item.parklotName,
							'驶出次数': item.totalNum,
							'异常抬杆次数': item.extNum,
							'异常抬杆应收总额（元）': item.extMoney,
							'异常抬杆（%）': item.extRate,
						}
					});
					let excelName = '异常抬杆报表';
					excelService.exportExcel(excelData, excelName);
				}else{
					growl.addWarnMessage("没有符合条件数据导出，请确认！", {ttl: 2000});
				}
			})       
  };
        /****   excel导出代码结束     ******/
    
		initTable(1);

	}
]);