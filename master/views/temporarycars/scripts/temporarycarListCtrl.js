'use strict';

angular.module('parkingApp').controller('temporarycarListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'temporarycarService', 'StateName', 'sessionCache','$filter','$timeout',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, temporarycarService, StateName, sessionCache,$filter,$timeout) {

		var indexId = "#temporarycar-index";
		var tableId = indexId + " #temporarycar-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
			aData = null;
    $scope.formData = {};
    $scope.formData.startTime = '';
    $scope.formData.endTime = '';
    $scope.formData.parkNum = '';
    $scope.formData.consumeMoney = '';
    $scope.myModal = "";
    
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

		var reload = function() {
			if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, false);
			}
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
				"ajax": function(data, callback, settings) {
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
          }
          if($scope.formData.parkNum == 1) {
            data.parkingNumMin = 0;
            data.parkingNumMax = 5;
          }else if($scope.formData.parkNum == 2) {
            data.parkingNumMin = 6;
            data.parkingNumMax = 15;
          }else if($scope.formData.parkNum == 3) {
            data.parkingNumMin = 16;
            data.parkingNumMax = 30;
          }else if($scope.formData.parkNum == 4) {
            data.parkingNumMin = 31;
          }
          if($scope.formData.consumeMoney == 1) {
            data.parkingMoneyMin = 0;
            data.parkingMoneyMax = 30;
          }else if($scope.formData.consumeMoney == 2) {
            data.parkingMoneyMin = 31;
            data.parkingMoneyMax = 50;
          }else if($scope.formData.consumeMoney == 3) {
            data.parkingMoneyMin = 51;
            data.parkingMoneyMax = 100;
          }else if($scope.formData.consumeMoney == 4) {
            data.parkingMoneyMin = 101;
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
					temporarycarService.reqPagination(data).then(function(resp) {
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
          { "data": "parkingNum" },
          { "data": "parkingMoney" },
					{ "data": "updateTime","render":(data,type,full) => {
            let updateTime = new Date(data);
            return updateTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          {"defaultContent": ""}
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          let btnDom = $("<button type=\"button\" data-toggle=\"modal\" data-target=\"#myModal\" class=\"btn btn-default\"><span class=\"fa fa-file-text-o\"></span>停车分析</button>").bind('click',{aData:aData},function(event) {
            $scope.myModal = "myModal";
            $timeout(function() {
              $scope.myModal = "";
            },300);
            let dataArr = [];
            $scope.plate = event.data.aData.plate;
            $scope.arrLength = event.data.aData.analyzeDtoList.length;
            dataArr = $.map(event.data.aData.analyzeDtoList,function(i) {
              let dataObj = {};
              dataObj.value = i.parkingMoney;
              dataObj.name = i.parklotName + "(" + i.parkingNum + "次)"
              return dataObj;
            });
            let dom = document.getElementById('parkAnalyze');
            let myChart = echarts.init(dom);
            let option = {
              title : {
                  text: $scope.plate + '停车分析',
                  x:'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : ￥{c} ({d}%)"
              },
              series : [
                  {
                      name: '停车分析',
                      type: 'pie',
                      radius : '65%',
                      center: ['50%', '50%'],
                      data:dataArr,
                      itemStyle: {
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      }
                  }
              ]
            };
            myChart.setOption(option,true);
          })
          $('td:eq(6)', nRow).html(btnDom);
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
			$scope.formData.plate = "";
			$scope.formData.parkNum = "";
			$scope.formData.consumeMoney = "";
			$scope.formData.startTime = '';
			$scope.formData.endTime = '';
			reload();
		};
		initTable();

	}
]);