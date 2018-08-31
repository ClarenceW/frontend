'use strict';

angular.module("parkingApp").controller('couponUseRecordListCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, couponuserecordService, $timeout, StateName, sessionCache) {

    var indexId = "#couponuserecord-index";
    var tableId = indexId + " #couponuserecord-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.formData = {};
    $scope.cashData = {};
    $scope.stateGoIndex = StateName.couponUseRecord.index;

    $scope.couponTypeStatusOptions = sessionCache.getDictsByLookupName("COUPON_RULE_TYPE");
    $scope.tempData = {};
    $scope.formData.reciveStartTime = '';
    $scope.formData.reciveEndTime = '';
    $scope.tempBeginData = {};
		$scope.tempEndData = {};
    $scope.format = "yyyy-MM-dd";
    $scope.couponActOptions = [];
    couponuserecordService.reqList().then(function(resp) {
      resp.forEach((item) => {
        let obj = {};
        obj.couponActivityType = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_RELATE_TYPE',item.couponActivityType);
        obj.activityListDtoList = item.activityListDtoList;
        $scope.couponActOptions.push(obj);
      });
    });

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
    var initTable = function () {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.userCode) {
                    data.userCode = $scope.formData.userCode;
                }
                if ($scope.formData.couponActivityName) {
                    data.couponActivityName = $scope.formData.couponActivityName;
                }
                if ($scope.formData.couponType) {
                    data.couponType = $scope.formData.couponType;
                }
                if ($scope.formData.reciveStartTime) {
                    data.reciveStartTime = new Date($scope.formData.reciveStartTime).format("yyyy-MM-dd 00:00:00");
                }
                if ($scope.formData.reciveEndTime) {
                    data.reciveEndTime = new Date($scope.formData.reciveEndTime).format("yyyy-MM-dd 23:59:59");
                }
                if ($scope.formData.reciveStartTime && $scope.formData.reciveEndTime) {
                    if ($scope.formData.reciveStartTime > $scope.formData.reciveEndTime) {
                        growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
                        return;
                    }
                }
                couponuserecordService.reqPagination(data).then(function (resp) {
                    callback(resp);
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "couponCode"},
                {"data": "userCode"},
                {"data": "couponType","render":(data,type,full) => {
                  let couponType = sessionCache.getLookupValueByLookupName('COUPON_RULE_TYPE',data);
                  return couponType || '';
                }},
                {"data": "couponActivityId"},
                {"data": "couponActivityName"},
                {"data": "couponReciveTime"},
                {"data": "couponStatus","render":(data,type,full) => {
                  let couponStatus = sessionCache.getLookupValueByLookupName('COUPON_STATUS',data);
                  return couponStatus || '';
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
        $scope.formData.userCode = '';
        $scope.formData.couponActivityName='';
        $scope.formData.couponType='';
        $scope.formData.reciveStartTime = '';
        $scope.formData.reciveEndTime = '';
        reload();
    }
    $scope.toPublic = function () {
      $scope.cashData = {};
      $scope.myModal = "myModal";
      $timeout(function() {
        $scope.myModal = "";
      },300);
    }
    $scope.confirmPublic = function () {
      let reg = /^0?1[3|4|5|7|8|9][0-9]\d{8}$/;
        if(!$scope.cashData.userCode) {
          growl.addErrorMessage("请输入用户手机号", {ttl: 2000});
          return;
        }else if(!reg.test($scope.cashData.userCode)) {
          growl.addErrorMessage("手机号格式错误", {ttl: 2000});
          return;
        }
        if(!$scope.cashData.couponActivityId) {
          growl.addErrorMessage("请选择优惠活动", {ttl: 2000});
          return;
        }
        if(!$scope.cashData.reciveCount) {
          growl.addErrorMessage("请输入赠送张数", {ttl: 2000});
          return;
        }else if($scope.cashData.reciveCount < 0 || $scope.cashData.reciveCount > 10) {
          growl.addErrorMessage("最多赠送10张", {ttl: 2000});
          return;
        }
        couponuserecordService.addCoupon($scope.cashData).then(function (msg) {
            $("#confirm").attr("data-dismiss","modal");
            growl.addInfoMessage("发放优惠券完成", {ttl: 2000});
            reload();
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
    }

    $timeout(function () {
        initTable();
    });


});