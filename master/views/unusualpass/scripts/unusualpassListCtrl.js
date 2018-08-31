'use strict';

angular.module('parkingApp').controller('unusualpassListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'unusualpassService', 'StateName', 'sessionCache','$filter','Setting','$compile','$timeout','parklotsService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, unusualpassService, StateName, sessionCache,$filter,Setting,$compile,$timeout,parklotsService) {

		var indexId = "#unusualpass-index";
		var tableId = indexId + " #unusualpass-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.unusualpass.detail;
    $scope.formData = {};
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.formData.startTime = new Date(params.startTime ? params.startTime : new Date(new Date() - 1000 * 60 * 60 * 24 * 30).format('yyyy-MM-dd 00:00:00'));
    $scope.formData.endTime = new Date(params.endTime ? params.endTime : new Date().format('yyyy-MM-dd 23:59:59'));
    $scope.iDisplayStart = $scope.formData.start || 0;
    $scope.parkDirectionOptions = sessionCache.getDictsByLookupName("PARK_DIRECTION");
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    
    /**  日期选择*/
    $scope.starTimeCtrl = {
      isOpen: false,
      date: new Date(),
      buttonBar: {
          show: true,
          now: {
              show: true,
              text: '现在'
          },
          today: {
              show: true,
              text: '今天'
          },
          clear: {
              show: false,
              text: 'Clear'
          },
          date: {
              show: true,
              text: '日期'
          },
          time: {
              show: true,
              text: '时间'
          },
          close: {
              show: true,
              text: '关闭'
          }
      }
    };
    $scope.endTimeCtrl = {
        isOpen: false,
        date: new Date(),
        buttonBar: {
            show: true,
            now: {
                show: true,
                text: '现在'
            },
            today: {
                show: true,
                text: '今天'
            },
            clear: {
                show: false,
                text: 'Clear'
            },
            date: {
                show: true,
                text: '日期'
            },
            time: {
                show: true,
                text: '时间'
            },
            close: {
                show: true,
                text: '关闭'
            }
        }
    };
    $scope.openStartTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.starTimeCtrl.isOpen = true;
    };
    $scope.openEndTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.endTimeCtrl.isOpen = true;
    };

		var reload = function() {
			// if(customerService.isDataTableExist(tableId)) {
			// 	oTable.api().ajax.reload(null, false);
      // }
      initTable();
		}

		function initTable() {
			oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
        "destroy": true,
				"ajax": function(data, callback, settings) {
          let flg = $state.params.flg;
          if (flg == 1) {
            data.start = $scope.formData.start || 0;
            data.length = $scope.formData.length || 10;
            let start = data.start;
            let length = data.length;
            delete $state.params['flg'];
          } else {
            $scope.formData.start = data.start;
            $scope.formData.length = data.length;
          }
					if($scope.formData.plate) {
						data.plate = $scope.formData.plate;
					}
					if($scope.formData.parklotName) {
						data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
          if($scope.formData.parkDirection) {
            data.parkDirection = $scope.formData.parkDirection;
          }
					if($scope.formData.opUser) {
						data.opUser = $scope.formData.opUser;
					}
					if($scope.formData.reason) {
						data.reason = $scope.formData.reason;
					}
          if ($scope.formData.startTime) {
              var _date = $scope.formData.startTime.format("yyyy-MM-dd hh:mm:ss");
              data.startTime = _date;
          }
          if ($scope.formData.endTime) {
              var _date = $scope.formData.endTime.format("yyyy-MM-dd hh:mm:ss");
              data.endTime = _date;
          }
          if($scope.formData.startTime  && $scope.formData.endTime) {
            if($scope.formData.startTime > $scope.formData.endTime) {
                growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                return;
            }
          }
					unusualpassService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#unusualpass-table_paginate").find("li[class='active']").removeClass('active')
              $("#unusualpass-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
            }, 100);
						callback(resp)
					}, function(msg) {
						growl.addErrorMessage(msg, { ttl: 2000 });
					});
        },
        iDisplayStart: $scope.iDisplayStart,
				"columns": [
					{ "defaultContent": "" },
					{ "data": "plate" },
          { "data": "parklotName"},
          { "data": "parkDirection","render": (data,type,full) => {
            let parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION',data);
            return parkDirection || '';
          }},
          { "data": "laneName"},
          { "data": "reason"},
					{ "data": "passTime","render": (data,type,full) => {
            let passTime = new Date(data);
            return passTime.format("yyyy-MM-dd hh:mm:ss");
          }},
          { "data": "shouldPay","render": (data,type,full) => {
            let shouldPay = data/100;
            return shouldPay;
          }},
          {"defaultContent": ""},
          { "data": "opUser"},
          {"defaultContent": ""}
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          if (aData.pic) {
            let url1 = Setting.SERVER.DOWNLOAD + "?file=" + aData.pic;
            let imgTemplate1 = "<a href=\"" + url1 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
            let compileFn1 = $compile(imgTemplate1);
            let $dom1 = compileFn1($scope);
            customerService.handleFancyBox();
            $('td:eq(8)', nRow).html($dom1);
          } else {
            $('td:eq(8)', nRow).html('');
          }
          $('td:eq(10)', nRow).html("<button type=\"button\" class=\"btn btn-default\"><span class=\"fa fa-edit\"></span>详情</button>");
					return nRow;
				},
				"drawCallback": function() {
          var buttonList = $('tbody tr .btn');
          if (buttonList && buttonList.length > 0) {
              for (var i = 0, j = buttonList.length; i < j; i++) {
                  buttonList[i].addEventListener('click', function (e) {
                    nRow = $(this).parents('tr')[0];
                    aData = oTable.fnGetData(nRow);
                    let params = $scope.formData;
                    $state.go($scope.stateGoDetail, { id: aData.id, params: params  });
                  })
              }
          }
					customerService.initUniform(tableId);
					customerService.initTitle();
				}
			}));
    }
    
    function getTotal() {
      let data = {};
      if($scope.formData.plate) {
        data.plate = $scope.formData.plate;
      }
      if($scope.formData.parklotName) {
        data.parklotName = $scope.formData.parklotName;
      }
      if($scope.formData.parkDirection) {
        data.parkDirection = $scope.formData.parkDirection;
      }
      if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
      if($scope.formData.opUser) {
        data.opUser = $scope.formData.opUser;
      }
      if($scope.formData.reason) {
        data.reason = $scope.formData.reason;
      }
      if ($scope.formData.startTime) {
          var _date = $scope.formData.startTime.format("yyyy-MM-dd hh:mm:ss");
          data.startTime = _date;
      }
      if ($scope.formData.endTime) {
          var _date = $scope.formData.endTime.format("yyyy-MM-dd hh:mm:ss");
          data.endTime = _date;
      }
      if($scope.formData.startTime  && $scope.formData.endTime) {
        if($scope.formData.startTime > $scope.formData.endTime) {
            growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
            return;
        }
      }
      unusualpassService.reqTotalMoney(data).then(resp => {
        $scope.formData.sumPayableMoney = $filter("currency")(resp.data);
      }, function(msg) {
        growl.addErrorMessage(msg, { ttl: 2000 });
      })
    }

		$scope.toSearch = function() {
      $scope.iDisplayStart = 0;
      reload();
      getTotal();
		};
		$scope.toReset = function() {
			$scope.formData.parklotName = "";
			$scope.formData.parkDirection = "";
			$scope.formData.plate = "";
			$scope.formData.opUser = "";
			$scope.formData.reason = "";
			$scope.formData.startTime = new Date(new Date(new Date() - 1000 * 60 * 60 * 24 * 30).format("yyyy-MM-dd 23:59:59"));
      $scope.formData.endTime = new Date(new Date().format("yyyy-MM-dd 23:59:59"));
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      reload();
      getTotal();
    };
    
    initTable();
    getTotal();

	}
]);