'use strict';

angular.module('parkingApp').controller('mouthcardListCtrl', 
	function ($rootScope, $scope, $http, $state, $uibModal, growl, Setting, customerService, mouthcardService, $log,StateName,sessionCache,$filter,$timeout,parklotsService) {

    var indexId = "#mouthcard-index";
    var tableId = indexId + " #mouthcard-table";
    var checkboxesCls = tableId + " .checkboxes";
    $scope.stateGoEdit = StateName.mouthcard.edit;
    $scope.stateGoAdd = StateName.mouthcard.add;
    var oTable = null;
    var nRow = null;
    var aData = null;
    
    $scope.statusOptions=sessionCache.getDictsByLookupName("CARD_STATUS");
    $scope.typeOptions=sessionCache.getDictsByLookupName("CARD_TYPE");
    $scope.cardChannelOptions=sessionCache.getDictsByLookupName("MONTH_CARD_CHANNEL");
    $scope.formData = {};
    $scope.formData.startTime1 = '';
    $scope.formData.endTime1 = '';
    $scope.formData.startTime2 = '';
    $scope.formData.endTime2 = '';
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    
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
    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    }

    function initTable() {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.code) {
                    data.code = $scope.formData.code;
                }
                if ($scope.formData.cardName) {
                    data.cardName = $scope.formData.cardName;
                }
                if ($scope.formData.parklotName) {
                    data.parklotName = $scope.formData.parklotName;
                }
                if($scope.formData.parklotCodes) {
                  data.parklotCodes = $scope.formData.parklotCodes;
                }
                if ($scope.formData.status) {
                    data.status = $scope.formData.status;
                }
                if ($scope.formData.cardChannel) {
                    data.cardChannel = $scope.formData.cardChannel;
                }
                if ($scope.formData.cardType) {
                    data.cardType = $scope.formData.cardType;
                }
                if ($scope.formData.startTime1) {
                    data.cardStartTime = new Date($scope.formData.startTime1).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.endTime1) {
                    data.cardEndTime = new Date($scope.formData.endTime1).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.startTime1 && $scope.formData.endTime1) {
                    if ($scope.formData.startTime1 > $scope.formData.endTime1) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                if ($scope.formData.startTime2) {
                    data.startTime = new Date($scope.formData.startTime2).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.endTime2) {
                    data.endTime = new Date($scope.formData.endTime2).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.startTime2 && $scope.formData.endTime2) {
                    if ($scope.formData.startTime2 > $scope.formData.endTime2) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                mouthcardService.reqPagination(data).then(function (resp) {
                    $log.info(resp)
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "code"},
                {"data": "cardName"},
                {"data": "cardType","render": (data,type,full) => {
                  let cardType = sessionCache.getLookupValueByLookupName('CARD_TYPE',data);
                  return cardType || '';
                }},
                {"data": "parklotName"},
                {"data": "cardChannel","render": (data,type,full) => {
                  let cardChannel = sessionCache.getLookupValueByLookupName('MONTH_CARD_CHANNEL',data);
                  return cardChannel || '';
                }},
                {"data": "price"},
                {"data": "cardSum"},
                {"data": "remainNum"}, 
                {"data": "startTime"}, 
                {"data": "endTime"}, 
                {"data": "status","render": (data,type,full) => {
                  let status = sessionCache.getLookupValueByLookupName('CARD_STATUS',data);
                  return status || '';
                }}, 
                {"data": "opUser"},
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                if(aData.status == 4) {
                  $('td:eq(10)', nRow).css('color','red');
                }
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
        $scope.formData.code = "";
        $scope.formData.cardName = "";
        $scope.formData.parklotName = "";
        $scope.formData.status = "";
        $scope.formData.cardType = "";
        $scope.formData.cardChannel = "";
        $scope.formData.startTime1 = '';
        $scope.formData.endTime1 = '';
        $scope.formData.startTime2 = '';
        $scope.formData.endTime2 = '';
        $scope.formData.parklotCodes = [];
        $timeout(() => {
          $('.selectpicker').selectpicker('render');
        },50);
        reload();
    }

    $scope.toEdit = function () {
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
          if(aData.status == "1" || aData.status == "2") {
            $state.go( $scope.stateGoEdit, {code: aData.code,status: aData.status});
          }else {
            growl.addInfoMessage("只能修改未发布或进行中的月卡信息！", {ttl: 2000});
          }
        } else {
            customerService.openEditConfirmModal();
        }
    };

    $scope.toDelete = function () {
        var count = 0;
        var aData;
        $(checkboxesCls).each(function () {//data-set="tableId+ " .checkboxes""
            if ($(this).prop("checked")) {
                nRow = $(this).parents('tr')[0];
                aData = oTable.fnGetData(nRow);
                count++;
            }
        });
        if (count === 1) {
          if(aData.status != "2"){
            customerService.modalInstance().result.then(function (message) {
              var data = {};
              data.cardCode = aData.code;
              mouthcardService.delCard(data).then(function (resp) {
                let {code,msg,data} = resp;
                if(code === Setting.ResultCode.CODE_SUCCESS){
                    growl.addInfoMessage('删除成功！', {ttl: 2000});
                    reload();
                }else{
                  growl.addErrorMessage(msg, {ttl: 2000});
                }
              }, function (msg) {
                  growl.addInfoMessage(msg, {ttl: 2000});
              });
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
          }else {
            growl.addInfoMessage("该月卡正在发布中，不能删除月卡！", {ttl: 2000});
          }
        } else {
            customerService.openDeleteConfirmModal();
        }
    }

    $scope.toStart = function () {
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
          if(aData.status == "1") {
            customerService.startcardModalInstance().result.then(function (message) {
                var data = {};
                data.cardCode = aData.code;
                mouthcardService.startCard(data).then(function (resp) {
                  let {code,msg,data} = resp;
                  if(code === Setting.ResultCode.CODE_SUCCESS){
                      growl.addInfoMessage('发布月卡成功！', {ttl: 2000});
                      reload();
                  }else{
                    growl.addErrorMessage(msg, {ttl: 2000});
                  }
                }, function (msg) {
                    growl.addInfoMessage(msg, {ttl: 2000});
                });
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
          }else if(aData.status == "2") {
            growl.addInfoMessage("该月卡已发布！", {ttl: 2000});
          }else if(aData.status == "3") {
            growl.addInfoMessage("该月卡已结束！", {ttl: 2000});
          }
        } else {
            customerService.openStartConfirmModal();
        }
    }

    $scope.toEnd = function () {
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
          if(aData.status != "3") {
            customerService.endcardModalInstance().result.then(function (message) {
                var data = {};
                data.cardCode = aData.code;
                mouthcardService.endCard(data).then(function (resp) {
                  let {code,msg,data} = resp;
                  if(code === Setting.ResultCode.CODE_SUCCESS){
                      growl.addInfoMessage('结束月卡成功！ ', {ttl: 2000});
                      reload();
                  }else{
                    growl.addErrorMessage(msg, {ttl: 2000});
                  }
                }, function (msg) {
                    growl.addInfoMessage(msg, {ttl: 2000});
                });
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
          }else {
            growl.addInfoMessage("该月卡已结束！", {ttl: 2000});
          }
        } else {
            customerService.openEndConfirmModal();
        }
    }

    initTable();
});