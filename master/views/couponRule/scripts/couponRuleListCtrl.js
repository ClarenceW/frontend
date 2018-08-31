'use strict';

angular.module("parkingApp").controller('couponRuleListCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, couponruleService, $timeout, StateName, sessionCache) {

    var indexId = "#couponrule-index";
    var tableId = indexId + " #couponrule-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.formData = {};
    $scope.stateGoDetail = StateName.couponRule.detail;
    $scope.stateGoEdit = StateName.couponRule.edit;
    $scope.stateGoAdd = StateName.couponRule.add;
    $scope.stateGoIndex = StateName.couponRule.index;

    $scope.couponruleTypeOptions = sessionCache.getDictsByLookupName("COUPON_RULE_TYPE");
    $scope.isbindCouponOptions = sessionCache.getDictsByLookupName("IS_RELEATED_COUPON");

    var initTable = function () {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.couponRuleId) {
                    data.couponRuleId = $scope.formData.couponRuleId;
                }
                if ($scope.formData.couponRuleName) {
                    data.couponRuleName = $scope.formData.couponRuleName;
                }
                if ($scope.formData.couponRuleType) {
                    data.couponRuleType = $scope.formData.couponRuleType;
                }
                if ($scope.formData.relateCoupon) {
                    data.relateCoupon = $scope.formData.relateCoupon;
                }
                couponruleService.reqPagination(data).then(function (resp) {
                    callback(resp);
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "couponRuleId"},
                {"data": "couponRuleName"},
                {"data": "couponRuleType","render":(data,type,full) => {
                  let couponRuleType = sessionCache.getLookupValueByLookupName('COUPON_RULE_TYPE',data);
                  return couponRuleType || '';
                }},
                {"data": "couponStartTime"},
                {"data": "couponEndTime"},
                {"data": "opUser"},
                {"data": "createTime"},
                {"data": "relateCoupon","render":(data,type,full) => {
                  let relateCoupon = sessionCache.getLookupValueByLookupName('IS_RELEATED_COUPON',data);
                  return relateCoupon || '';
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
        $scope.formData.couponRuleName = '';
        $scope.formData.couponRuleId='';
        $scope.formData.couponRuleType='';
        $scope.formData.relateCoupon='';
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
            $state.go($scope.stateGoDetail, {couponRuleId: aData.couponRuleId,couponRuleType:aData.couponRuleType});
        } else {
            customerService.openDetailConfirmModal();
        }
    };

    $scope.toDelete = function () {
        
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
          if(aData.relateCoupon  != "0") {
            $state.go($scope.stateGoEdit, {couponRuleId: aData.couponRuleId,couponRuleType:aData.couponRuleType});
          }else {
            growl.addInfoMessage("该优惠规则已关联优惠券，不能修改！", {ttl: 2000});
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
        if(aData.relateCoupon  != "0"){
          customerService.modalInstance().result.then(function (message) {
            var data = aData.couponRuleId;
            couponruleService.delRule(data).then(function (resp) {
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
          growl.addInfoMessage("该优惠规则已关联优惠券，不能删除！", {ttl: 2000});
        }
      } else {
          customerService.openDeleteConfirmModal();
      }
    }

    $timeout(function () {
        initTable();
    });


});