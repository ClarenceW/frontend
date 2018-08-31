'use strict';

angular.module("parkingApp").controller('couponactiveListCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, couponactiveService, $timeout, StateName, sessionCache,parklotsService) {

    var indexId = "#couponactive-index";
    var tableId = indexId + " #couponactive-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.formData = {};
    $scope.stateGoDetail = StateName.couponActive.detail;
    $scope.stateGoEdit = StateName.couponActive.edit;
    $scope.stateGoAdd = StateName.couponActive.add;
    $scope.stateGoIndex = StateName.couponActive.index;

    $scope.couponactiveStatusOptions = sessionCache.getDictsByLookupName("COUPON_ACTIVITY_STATUS");
    $scope.tempData = {};
    $scope.formData.startTime = '';
    $scope.formData.endTime = '';
    $scope.formData.couponActivityStartTime = '';
    $scope.formData.couponActivityEndTime = '';
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
    $scope.format = "yyyy-MM-dd";
    $scope.tempBeginData1 = {};
		$scope.tempEndData1 = {};
    $scope.tempBeginData2 = {};
		$scope.tempEndData2 = {};
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

    var initTable = function () {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.couponActivityId) {
                    data.couponActivityId = $scope.formData.couponActivityId;
                }
                if ($scope.formData.couponActivityRange) {
                    data.couponActivityRange = $scope.formData.couponActivityRange;
                }
                if($scope.formData.parklotCodes) {
                  data.parklotCodes = $scope.formData.parklotCodes;
                }
                if ($scope.formData.couponActivityName) {
                    data.couponActivityName = $scope.formData.couponActivityName;
                }
                if ($scope.formData.couponActivityStatus) {
                    data.couponActivityStatus = $scope.formData.couponActivityStatus;
                }
                if ($scope.formData.startTime) {
                    data.startTime = new Date($scope.formData.startTime).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.endTime) {
                    data.endTime = new Date($scope.formData.endTime).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.startTime && $scope.formData.endTime) {
                    if ($scope.formData.startTime > $scope.formData.endTime) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                if ($scope.formData.couponActivityStartTime) {
                    data.couponActivityStartTime = new Date($scope.formData.couponActivityStartTime).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.couponActivityEndTime) {
                    data.couponActivityEndTime = new Date($scope.formData.couponActivityEndTime).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.couponActivityStartTime && $scope.formData.couponActivityEndTime) {
                    if ($scope.formData.couponActivityStartTime > $scope.formData.couponActivityEndTime) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                couponactiveService.reqPagination(data).then(function (resp) {
                    callback(resp);
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "couponActivityId"},
                {"data": "couponActivityName"},
                {"data": "couponActivityRange"},
                {"data": "couponActivityStartTime"},
                {"data": "couponActivityEndTime"},
                {"data": "createTime"},
                {"data": "opUser"},
                {"data": "couponActivityStatus","render":(data,type,full) => {
                  let couponActivityStatus = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_STATUS',data);
                  return couponActivityStatus || '';
                }},
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                if(aData.couponActivityRange) {
                  let str = aData.couponActivityRange.substring(0,7) + '...';
                  $('td:eq(3)', nRow).html(`<div style="max-width:300px; overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" data-toggle="tooltip" data-placement="bottom" title="${aData.couponActivityRange}">${str}</div>`)
                }else {
                  $('td:eq(3)', nRow).html('');
                }
                return nRow;
            },
            "drawCallback": function () {
                customerService.initUniform(tableId);
                customerService.initTitle();
                $("[data-toggle='tooltip']").tooltip();
            }
        }));
    };

    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    }

    $scope.toSearch = function () {
        reload();
    };
    $scope.toReset = function () {
        $scope.formData.couponActivityId = '';
        $scope.formData.couponActivityRange='';
        $scope.formData.couponActivityName='';
        $scope.formData.couponActivityStatus='';
        $scope.formData.startTime = '';
        $scope.formData.endTime = '';
        $scope.formData.couponActivityEndTime = '';
        $scope.formData.couponActivityStartTime = '';
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
            $state.go($scope.stateGoDetail, {couponActivityId: aData.couponActivityId,couponActivityType: aData.couponActivityType});
        } else {
            customerService.openDetailConfirmModal();
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
        if(aData.couponActivityStatus != "1"){
          customerService.modalInstance().result.then(function (message) {
            var data = aData.couponActivityId;
            couponactiveService.delActive(data).then(function (resp) {
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
        }else{
          growl.addInfoMessage("该优惠活动进行中，不能删除！", {ttl: 2000});
        }
      } else {
          customerService.openDeleteConfirmModal();
      }
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
        if(aData.couponActivityStatus  == "0") {
          $state.go($scope.stateGoEdit, {couponActivityId: aData.couponActivityId,couponActivityType: aData.couponActivityType});
        }else if(aData.couponActivityStatus  == "1"){
          growl.addInfoMessage("该优惠活动进行中，不能编辑！", {ttl: 2000});
        }else {
          growl.addInfoMessage("该优惠活动已结束，不能编辑！", {ttl: 2000});
        }
      } else {
          customerService.openEditConfirmModal();
      }
    };

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
        if(aData.couponActivityStatus == "0") {
          customerService.startactiveModalInstance().result.then(function (message) {
              var data = {};
              data.couponActivityId = aData.couponActivityId;
              couponactiveService.startActive(data).then(function (resp) {
                let {code,msg,data} = resp;
                if(code === Setting.ResultCode.CODE_SUCCESS){
                    growl.addInfoMessage('发布优惠活动成功！', {ttl: 2000});
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
        }else if(aData.couponActivityStatus == "1") {
          growl.addInfoMessage("该优惠活动进行中！", {ttl: 2000});
        }else if(aData.couponActivityStatus == "2") {
          growl.addInfoMessage("该优惠活动已结束！", {ttl: 2000});
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
        if(aData.status != "2") {
          customerService.endactiveModalInstance().result.then(function (message) {
              var data = {};
              data.couponActivityId = aData.couponActivityId;
              couponactiveService.endActive(data).then(function (resp) {
                let {code,msg,data} = resp;
                if(code === Setting.ResultCode.CODE_SUCCESS){
                    growl.addInfoMessage('结束活动成功！ ', {ttl: 2000});
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
          growl.addInfoMessage("该优惠活动已结束！", {ttl: 2000});
        }
      } else {
          customerService.openEndConfirmModal();
      }
    }

    $timeout(function () {
        initTable();
    });


});