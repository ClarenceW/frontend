
angular.module('parkingApp').controller('operateTotalDayReportListCtrl', 
  ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'operateTotalReportService', 'StateName', 'sessionCache','$filter','Setting','excelService','parklotsService','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, operateTotalReportService, StateName, sessionCache,$filter,Setting,excelService,parklotsService,$timeout) {
		var indexId = "#totalreportday-index";
		var tableId = indexId + " #totalreportday-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null;
    var aData = null;
    $scope.formData = {};
    var yesterday = new Date().setTime(new Date().getTime() -24*60*60*1000);
    $scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
    $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
    $scope.parklotNameOption = [];
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

    $scope.tempBeginData = {};
		$scope.tempEndData = {};
    $scope.format = "yyyy-MM";
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
      startingDay: 1,
    };

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		parklotsService.reqList().then(resp => {
      $scope.parklotCodeOption = resp;
    });

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				ajax: function(data, callback, settings) {
					if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
					if($scope.formData.startTime) {
						data.startTime = $scope.formData.startTime.replace(/-/g,"");
					}
					if($scope.formData.endTime) {
						data.endTime = $scope.formData.endTime.replace(/-/g,"");
					}
					data.index = 1;
					operateTotalReportService.reqPagination(data).then(function(resp) {
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
				},
        scrollX: true,
        destroy:true,
        // bLengthChange:false,
				autoWidth:"100%",
				"columns": [
					{"defaultContent": ""},
					{"defaultContent": ""},
					{ "data": "tccs" },
          { "data": "tccsFree"},
          { "data": "tccsVip"},
					{ "data": "avgPkTime"},
					{ "data": "turnoverRate"},
					{ "data": "berthAverageMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "receivableMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          
          { "data": "actualMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "offlineCashNumber"},
					{ "data": "actualCash","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "onlineAlipayNumber"},
          { "data": "onlineAlipay","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "offlineAlipayNumber"},
					{ "data": "offlineAlipay","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "actualAlipay","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "onlineWxNumber"},
          { "data": "onlineWx","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "offlineWxNumber"},
					{ "data": "offlineWx","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "actualWx","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "onlineWalletNumber"},
					{ "data": "actualWallet","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "offlineCitizenCardNumber"},
					{ "data": "actualCitizenCard","render" : (data,type,full) => {
            return $filter("currency")(data);
					}},
          { "data": "onlineOtherNumber"},
					{ "data": "actualOther","render" : (data,type,full) => {
            return $filter("currency")(data);
					}},

          { "data": "monthCardCashNumber"},
					{ "data": "monthCardCash","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "monthCardAlipayOnlineNumber"},
					{ "data": "monthCardAlipayOnline","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "monthCardWxOnlineNumber"},
					{ "data": "monthCardWxOnline","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "monthCardWalletOnlineNumber"},
					{ "data": "monthCardWalletOnline","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
					{ "data": "monthCardTotalMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          
          { "data": "discountCitizenCardNumber"},
					{ "data": "discountCitizenCard","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "discountChargingPileNumber"},
					{ "data": "discountChargingPile","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "discountCouponNumber"},
					{ "data": "discountCoupon","render" : (data,type,full) => {
            return $filter("currency")(data);
          }},
          { "data": "unpaidNumber"},
					{ "data": "unpaidMoney","render" : (data,type,full) => {
            return $filter("currency")(data);
					}},
					{ "data": "unpaidTotalMoney","render" : (data,type,full) => {
						return $filter("currency")(data);
					}},
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          if(aData.date.indexOf('至') > -1) {
            let date1 = aData.date.split('至')[0];
            let date2 = aData.date.split('至')[1];
            let dateDiv = `
              <div>${date1}<div>
              <div>至<div>
              <div>${date2}<div>
            `;
            $('td:eq(0)', nRow).html(dateDiv);
          }else {
            $('td:eq(0)', nRow).html(aData.date);
          }
          if(!aData.parklotName) {
            let parklotNameDiv = `
              <div style="width:145px;"></div>
            `;
            $('td:eq(1)', nRow).html(parklotNameDiv);
          }else {
            $('td:eq(1)', nRow).html(aData.parklotName);
          }
          
          return nRow;
				},
				"drawCallback": function() {
					customerService.initUniform(tableId);
					customerService.initTitle();
				}
			}));
      new $.fn.dataTable.FixedColumns( oTable ,{"iLeftColumns":2});
    }
    
    function getTotal() {
      let data = {};
      if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.startTime) {
        data.startTime = $scope.formData.startTime.replace(/-/g,"");
      }
      if($scope.formData.endTime) {
        data.endTime = $scope.formData.endTime.replace(/-/g,"");
      }
      data.index = 1;
      operateTotalReportService.reqTotalCharge(data).then(resp => {
        $scope.formData.totalMoney = resp.totalMoney;
        $scope.formData.parkingMoney = resp.parkingMoney;
        $scope.formData.monthcardMoney = resp.monthcardMoney;
        if(resp.rechargeMoney == null) {
          $scope.formData.rechargeMoney = 'NaN';
        }else {
          $scope.formData.rechargeMoney = '￥' + $filter('number')(resp.rechargeMoney,1);
        }
        $scope.formData.operationTotalMoney = resp.operationTotalMoney;
        $scope.formData.operationOnlineMoney = resp.operationOnlineMoney;
        $scope.formData.operationOfflineMoney = resp.operationOfflineMoney;
        $scope.formData.operatoinTotalOrderNumber = resp.operatoinTotalOrderNumber;
        $scope.formData.wxTotalOrderNumber = resp.wxTotalOrderNumber;
        $scope.formData.alipayTotalOrderNumber = resp.alipayTotalOrderNumber;
        $scope.formData.cashTotalOrderNumber = resp.cashTotalOrderNumber;
        $scope.formData.citizenCardTotalOrderNumber = resp.citizenCardTotalOrderNumber;
        $scope.formData.walletTotalOrderNumber = resp.walletTotalOrderNumber;
        $scope.formData.wxTotalMoney = resp.wxTotalMoney;
        $scope.formData.alipayTotalMoney = resp.alipayTotalMoney;
        $scope.formData.cashTotalMoney = resp.cashTotalMoney;
        $scope.formData.citizenCardTotalMoney = resp.citizenCardTotalMoney;
        $scope.formData.walletTotalMoney = resp.walletTotalMoney;
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }

		$scope.downloadExcel = function () {
			let reqData = {};
			if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.startTime) {
        reqData.startTime = $scope.formData.startTime.replace(/-/g,"");
      }
      if($scope.formData.endTime) {
        reqData.endTime = $scope.formData.endTime.replace(/-/g,"");
      }
      reqData.index = 1;
			operateTotalReportService.reqList(reqData).then( resp => {
				if(resp && resp.length > 0){
					let excelData = [];
					let number = 1;
					excelData = resp.map(function (item) {
						return {
							'报表日期': item.date,
							'停车场': item.parklotName,
							'停车次数': item.tccs,
							'15分钟内免费次数（小时/次）': item.tccsFree,
							'包月车停车次数': item.tccsVip,
							'平均停车时长': item.avgPkTime,
							'周转率': item.turnoverRate,
							'应收金额（元）': item.receivableMoney,
							'现金（元）': item.actualCash,
							'支付宝（元）': item.actualAlipay,
							'微信（元）': item.actualWx,
							'钱包（元）': item.actualWallet,
							'市民卡（元）': item.actualCitizenCard ,
							'实收合计（元）': item.actualMoney,
							'市民卡优惠（元）': item.discountCitizenCard,
							'充电抵扣（元）': item.discountChargingPile,
							'优惠券优惠（元）': item.discountCoupon,
							'异常放行金额（元）': item.unpaidMoney,
							'未收费合计（元）':item.discountMoney,
						}
					});
					let excelName = '停车场运营汇总日报表';
					excelService.exportExcel(excelData, excelName);
				}else{
					growl.addWarnMessage("没有符合条件数据导出，请确认！", {ttl: 2000});
				}
			})       
  };

		$scope.toSearch = function() {
      reload();
      getTotal()
		};

		$scope.toReset = function() {
			$scope.format = "yyyy-MM-dd";
			$scope.formData.startTime = new Date(yesterday).format("yyyy-MM-dd");
      $scope.formData.endTime = new Date(yesterday).format("yyyy-MM-dd");
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      reload();
      getTotal()
		};
    initTable();
    getTotal()
	}
]);