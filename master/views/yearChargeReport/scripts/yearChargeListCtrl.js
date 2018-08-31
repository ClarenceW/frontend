'use strict';

angular.module('parkingApp').controller('yearChargeListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'yearchargeService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService','parklotsService','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, yearchargeService, StateName, sessionCache,$filter,$compile,Setting,excelService,parklotsService,$timeout) {

		var indexId = "#yearchargeReport-index";
		var tableId = indexId + " #yearchargeReport-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.formData = {};
    $scope.format = "yyyy";
    $scope.formData.startTime = new Date().format("yyyy");
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

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
          if($scope.formData.startTime) {
						data.startTime = $scope.formData.startTime.replace(/-/g,"");
					}
					yearchargeService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        destroy:true,
				"columns": [
					{ "defaultContent": "" },
					{ "data": "parklotName"},
          { "data": "janMoney"},
          { "data": "febMoney"},
          { "data": "marMoney"},
          { "data": "aprMoney"},
          { "data": "mayMoney"},
          { "data": "junMoney"},
          { "data": "julMoney"},
          { "data": "augMoney"},
          { "data": "sepMoney"},
          { "data": "octMoney"},
          { "data": "novMoney"},
          { "data": "decMoney"},
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
    
    function walletCharge() {
      let data = {};
      data.year = $scope.formData.startTime.replace(/-/g,"");
      data.parklotCodes = $scope.formData.parklotCodes;
      yearchargeService.reqWalletCharge(data).then(resp => {
        $scope.chargeArr = resp.monthDtoList;
        $scope.sumMoney = resp.sumMoney;
      },msg => {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }

		$scope.toSearch = function() {
      reload();
      walletCharge()
		};
		$scope.toReset = function() {
			$scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			$scope.format = "yyyy";
      $scope.formData.startTime = new Date().format("yyyy");
      initTable();
      walletCharge()
			reload();
    };

     /****   excel导出代码开始     ******/
     $scope.downloadExcel = function () {
			let reqData = {};
			if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.startTime) {
        reqData.startTime = $scope.formData.startTime.replace(/-/g,"");
      }
			yearchargeService.reqList(reqData).then( resp => {
				if(resp && resp.length > 0){
					let excelData = [];
					let number = 1;
					excelData = resp.map(function (item) {
						return {
							'停车场': item.parklotName,
							'1月': item.janMoney,
							'2月': item.febMoney,
							'3月': item.marMoney,
							'4月': item.aprMoney,
							'5月': item.mayMoney,
							'6月': item.junMoney,
							'7月': item.julMoney,
							'8月': item.augMoney,
							'9月': item.sepMoney,
							'10月': item.octMoney,
							'11月': item.novMoney,
							'12月': item.decMoney,
						}
					});
					let excelName = '年度收费报表';
					excelService.exportExcel(excelData, excelName);
				}else{
					growl.addWarnMessage("没有符合条件数据导出，请确认！", {ttl: 2000});
				}
			})       
    };
    
		initTable();
    walletCharge();
	}
]);