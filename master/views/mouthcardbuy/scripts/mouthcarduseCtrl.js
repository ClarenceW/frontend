'use strict';

angular.module('parkingApp').controller('mouthcarduseCtrl', 
	function ($rootScope, $scope, $http, $state, $uibModal, growl, Setting, customerService, mouthcardBuyService, $log,StateName,sessionCache,$filter,parklotsService,$timeout) {

    var indexId = "#mouthcarduse-index";
    var tableId = indexId + " #mouthcarduse-table";
    var checkboxesCls = tableId + " .checkboxes";
    $scope.stateGoDetail = StateName.mouthcardbuy.detail;
    $scope.stateGoAdd = StateName.mouthcardbuy.add;
    $scope.stateGoCountAdd = StateName.mouthcardbuy.countAdd;
    var oTable = null;
    var nRow = null;
    var aData = null;
    $scope.statusOptions = sessionCache.getDictsByLookupName("USER_CARD_STATUS");
    $scope.typeOptions=sessionCache.getDictsByLookupName("CARD_TYPE");
    $scope.terminalOptions=sessionCache.getDictsByLookupName("CARD_ORDER_SRC");
    $scope.formData = {};
    $scope.formData.startTime1 = '';
    $scope.formData.endTime1 = '';
    $scope.formData.startTime2 = '';
    $scope.formData.endTime2 = '';
    
    $scope.tempBeginData1 = {};
		$scope.tempEndData1 = {};
    $scope.tempBeginData2 = {};
		$scope.tempEndData2 = {};
		$scope.format = "yyyy-MM-dd";

		$scope.open1 = function (type) {
			if (type == 'begin') {
				$scope.tempBeginData1.opened = true;
			} else if (type == 'end') {
				$scope.tempEndData1.opened = true;
			}
		};
		$scope.open2 = function (type) {
			if (type == 'begin') {
				$scope.tempBeginData2.opened = true;
			} else if (type == 'end') {
				$scope.tempEndData2.opened = true;
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
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    }

    function initTable() {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.userCode) {
                    data.userCode = $scope.formData.userCode;
                }
                if ($scope.formData.plate) {
                    data.plate = $scope.formData.plate;
                }
                if ($scope.formData.cardCode) {
                    data.cardCode = $scope.formData.cardCode;
                }
                if ($scope.formData.status) {
                    data.status = $scope.formData.status;
                }
                if ($scope.formData.type) {
                    data.type = $scope.formData.type;
                }
                if ($scope.formData.userName) {
                    data.userName = $scope.formData.userName;
                }
                if ($scope.formData.parklotCodes) {
                    data.parklotCodes = $scope.formData.parklotCodes;
                }
                if ($scope.formData.terminal) {
                    data.terminal = $scope.formData.terminal;
                }
                if ($scope.formData.startTime1) {
                    data.buyStartTime = new Date($scope.formData.startTime1).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.endTime1) {
                    data.buyEndTime = new Date($scope.formData.endTime1).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.startTime1 && $scope.formData.endTime1) {
                    if ($scope.formData.startTime1 > $scope.formData.endTime1) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                if ($scope.formData.startTime2) {
                    data.effectStartTime = new Date($scope.formData.startTime2).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.endTime2) {
                    data.effectEndTime = new Date($scope.formData.endTime2).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.startTime2 && $scope.formData.endTime2) {
                    if ($scope.formData.startTime2 > $scope.formData.endTime2) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                mouthcardBuyService.reqPagination(data).then(function (resp) {
                    $log.info(resp)
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "cardCode"},
                {"data": "type","render": (data,type,full) => {
                  let cardtype = sessionCache.getLookupValueByLookupName('CARD_TYPE',data);
                  return cardtype || '';
                }},
                {"data": "parklotName"},
                {"data": "plate"},
                {"data": "plateColor","render": (data,type,full) => {
                  let plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',data);
                  return plateColor || '';
                }},
                {"data": "userCode"},
                {"data": "userName"},
                {"data": "terminal","render": (data,type,full) => {
                  let terminal = sessionCache.getLookupValueByLookupName('CARD_ORDER_SRC',data);
                  return terminal || '';
                }},
                {"data": "buyTime"},
                {"data": "effectStartTime"},
                {"data": "effectEndTime"},
                {"data": "status","render": (data,type,full) => {
                  let status = sessionCache.getLookupValueByLookupName('USER_CARD_STATUS',data);
                  return status || '';
                }}, 
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                return nRow;
            },
            "drawCallback": function () {
                customerService.initUniform(tableId);
                customerService.initTitle();
            }
        }));
    }

    $scope.toSearch = function () {
        reload();
    };
    $scope.toReset = function(){
        $scope.formData.userCode = "";
        $scope.formData.plate = "";
        $scope.formData.cardCode = "";
        $scope.formData.status = "";
        $scope.formData.userName = "";
        $scope.formData.type = "";
        $scope.formData.startTime1 = '';
        $scope.formData.endTime1 = '';
        $scope.formData.startTime2 = '';
        $scope.formData.endTime2 = '';
        $scope.formData.terminal = '';
        $scope.formData.parklotCodes = [];
        $timeout(() => {
          $('.selectpicker').selectpicker('render');
        },50);
        reload();
    }

    $scope.toDetail = function () {
        var count = 0;
        var aData;
        $(checkboxesCls).each(function () {
            if ($(this).prop("checked")) {
                nRow = $(this).parents('tr')[0];
                aData = oTable.fnGetData(nRow);
                count++;
            }
        });
        if (count === 1) {
            $state.go( $scope.stateGoDetail, {recordCode: aData.orderCode});
        } else {
            customerService.openEditConfirmModal();
        }
    };

    $scope.toCountAdd = function () {
      $state.go($scope.stateGoCountAdd);
    };

    initTable();
});