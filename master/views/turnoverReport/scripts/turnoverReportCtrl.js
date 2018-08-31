'use strict';

angular.module('parkingApp').controller('turnoverReportCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'turnoverService', 'StateName', 'sessionCache','$filter','$compile','Setting','excelService','parklotsService','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, turnoverService, StateName, sessionCache,$filter,$compile,Setting,excelService,parklotsService,$timeout) {

		var indexId = "#turnoverReport-index";
		var tableId = indexId + " #turnoverReport-table";
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
					turnoverService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        destroy:true,
				"columns": [
					{ "defaultContent": "" },
					{ "data": "date","render":(data,type,full) => {
            let selDateFlg = $scope.selDateFlg;
            if(selDateFlg === 3) {
              data = data.substring(0,7);
            }
						return data;
					}},
          { "data": "parklotName"},
          { "data": "totalBerthNum"},
          { "data": "turnoverMoney"},
          { "data": "parkingFeeMoney"},
          { "data": "monthCardMoney"},
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
			$scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
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
        $scope.formData.endTime = new Date().format("yyyy-MM");
      }else if(index === 3){
        $("#selDateShow").text('报表月份');
        $scope.formData.startTime = new Date().format("yyyy");
        $scope.formData.endTime = new Date().format("yyyy");
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
			turnoverService.reqList(reqData).then( resp => {
				if(resp && resp.length > 0){
					let excelData = [];
					let number = 1;
					excelData = resp.map(function (item) {
						return {
							[title]: item.date,
							'停车场名称': item.parklotName,
							'车位总数（个）': item.totalBerthNum,
							'营业额（元）': item.turnoverMoney,
							'停车收费（元）': item.parkingFeeMoney,
							'购买月卡（元）': item.monthCardMoney,
						}
					});
					let excelName = '营业额报表';
					excelService.exportExcel(excelData, excelName);
				}else{
					growl.addWarnMessage("没有符合条件数据导出，请确认！", {ttl: 2000});
				}
			})       
    };
    
		initTable(1);

	}
]);