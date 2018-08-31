'use strict';

angular.module('parkingApp').controller('buyterminalReportCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'buyterminalReportService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, buyterminalReportService, StateName, sessionCache,$filter,$compile,Setting,excelService) {

		var indexId = "#buyterminalReport-index";
		var tableId = indexId + " #buyterminalReport-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.formData = {};
    $scope.selDateFlg = 1;
    var yesterday = new Date().setTime(new Date().getTime() -24*60*60*1000);
    $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
    $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable(index) {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.cardCode) {
						data.cardCode = $scope.formData.cardCode;
					}
					if($scope.formData.cardName) {
						data.cardName = $scope.formData.cardName;
					}
          if($scope.formData.startTime) {
						data.startTime = $scope.formData.startTime.replace(/-/g,"");
					}
          if($scope.formData.endTime) {
						data.endTime = $scope.formData.endTime.replace(/-/g,"");
					}
          data.index = index;
					buyterminalReportService.reqPagination(data).then(function(resp) {
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
          { "data": "cardName"},
          { "data": "cardCode"},
          { "data": "releaseTime"},
          { "data": "payMoney"},
          { "data": "actualApp"},
          { "data": "actualWx"},
          { "data": "actualAlipay"},
          { "data": "actualFrontend"},
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
			$scope.formData.cardCode = "";
			$scope.formData.cardName = "";
			$scope.selDateFlg = 1;
			$scope.format = "yyyy-MM-dd";
      $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
      $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
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
			if($scope.formData.cardCode) {
        reqData.cardCode = $scope.formData.cardCode;
      }
      if($scope.formData.cardName) {
        reqData.cardName = $scope.formData.cardName;
      }
      if($scope.formData.startTime) {
        reqData.startTime = $scope.formData.startTime.replace(/-/g,"");
      }
      if($scope.formData.endTime) {
        reqData.endTime = $scope.formData.endTime.replace(/-/g,"");
      }
      reqData.index = selDateFlg;
			buyterminalReportService.reqList(reqData).then( resp => {
				if(resp && resp.length > 0){
					let excelData = [];
					let number = 1;
					excelData = resp.map(function (item) {
						return {
							[title]: item.date,
							'月卡名称': item.cardName,
							'月卡编号': item.cardCode,
							'发布时间': item.releaseTime,
							'购买总额（元）': item.payMoney,
							'APP（元）': item.actualApp,
							'微信端公众号（元）': item.actualWx,
							'支付宝生活号（元）': item.actualAlipay,
							'线下（元）': item.actualFrontend,
						}
					});
					let excelName = '购买终端报表';
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