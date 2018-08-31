'use strict';

angular.module('parkingApp').controller('passcarrecordListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'passcarService', 'StateName', 'sessionCache','$filter','$timeout','parklotsService','Setting','$compile','entranceService',
	function($rootScope, $scope, $http, $state, $uibModal, growl, customerService, passcarService, StateName, sessionCache,$filter,$timeout,parklotsService,Setting,$compile,entranceService) {

		var indexId = "#passcarrecord-index";
		var tableId = indexId + " #passcarrecord-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.passcarrecord.detail;
    let params = $state.params.params || {};
    $scope.formData = params;
    $scope.parkDirectionOption = sessionCache.getDictsByLookupName("PARK_DIRECTION");
    $scope.iDisplayStart = $scope.formData.start || 0;
    $scope.nopicUrl = 'img/nopic.png';
    $scope.noplateUrl = 'img/noplate.png';
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    entranceService.reqList().then(function(resp) {
      $scope.laneIdOption = resp;
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
    $scope.formData.startTime = new Date(params.startTime ? params.startTime : new Date().format('yyyy-MM-dd 00:00:00'));
    $scope.formData.endTime = new Date(params.endTime ? params.endTime : new Date().format('yyyy-MM-dd 23:59:59'));

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
          }else {
            $scope.formData.start = data.start;
            $scope.formData.length = data.length;
          }
					if($scope.formData.parkDirection) {
						data.parkDirection = $scope.formData.parkDirection;
					}
					if($scope.formData.laneId) {
						data.laneId = $scope.formData.laneId;
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
					passcarService.reqPagination(data).then(function(resp) {
            let index = $scope.formData.start / $scope.formData.length +1;
            setTimeout(function () {
              $("#passcarrecord-table_paginate").find("li[class='active']").removeClass('active')
              $("#passcarrecord-table_paginate").find(":contains('"+index+"')").parent().addClass('active');
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
          { "data": "laneName"},
          { "data": "parkDirection","render": (data,type,full) => {
            let parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION',data);
            return parkDirection || '';
          }},
          { "data": "passType","render": (data,type,full) => {
            let passType = sessionCache.getLookupValueByLookupName('PASS_TYPE',data);
            return passType || '';
          }},
          { "defaultContent": "" },
          { "defaultContent": "" },
          { "data": "opUser"},
					{ "data": "passTime","render": (data,type,full) => {
            let passTime = new Date(data);
            return passTime.format("yyyy-MM-dd hh:mm:ss");
          }},
				],
				"rowCallback": function(nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          let url1 = '',url2 = '';
          if(aData.plate == '无车牌') {
            url1 = $scope.noplateUrl;
          }else {
            if (aData.platePicName) {
              url1 = Setting.SERVER.DOWNLOAD + "?file=" + aData.platePicName;
            } else {
              url1 = $scope.nopicUrl;
            }
          }
          let imgTemplate1 = "<a href=\"" + url1 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
          let compileFn1 = $compile(imgTemplate1);
          let $dom1 = compileFn1($scope);
          $('td:eq(6)', nRow).html($dom1);
          if (aData.vehPicName) {
            url2 = Setting.SERVER.DOWNLOAD + "?file=" + aData.vehPicName;
          } else {
            url2 = $scope.nopicUrl;
          }
          let imgTemplate2 = "<a href=\"" + url2 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url2 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
          let compileFn2 = $compile(imgTemplate2);
          let $dom2 = compileFn2($scope);
          customerService.handleFancyBox();
          $('td:eq(7)', nRow).html($dom2);
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
			$scope.formData.laneId = "";
			$scope.formData.parklotName = "";
			$scope.formData.userCode = "";
			$scope.formData.plate = "";
			$scope.formData.parkDirection = "";
			$scope.formData.startTime = new Date(new Date().format("yyyy-MM-dd 00:00:00"));
      $scope.formData.endTime = new Date(new Date().format("yyyy-MM-dd 23:59:59"));
      $scope.formData.parklotCodes = [];
      $scope.iDisplayStart = 0;
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      reload();
    };
    
    $scope.toDetail = function() {
			var count = 0;
			var aData;
			$(checkboxesCls).each(function() {
				if($(this).prop("checked")) {
					nRow = $(this).parents('tr')[0];
					aData = oTable.fnGetData(nRow);
					count++;
				}
			});
			if(count === 1) {
        let params = $scope.formData;
				$state.go($scope.stateGoDetail, { id: aData.id , params: params });
			} else {
				customerService.openDetailConfirmModal();
			}
    };
    
		initTable();

	}
]);