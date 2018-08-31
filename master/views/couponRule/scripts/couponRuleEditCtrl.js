'use strict';

angular.module('parkingApp').controller(
	'couponRuleEditCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, couponruleService,sessionCache,StateName,companyService,$timeout) {
    $scope.formData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.couponRule.index;
    $scope.formData.couponRuleType = $state.params.couponRuleType;
    $scope.ruleOptions = sessionCache.getDictsByLookupName("COUPON_RULE_TYPE");
    $scope.submited = false;

    couponruleService.reqDetail($state.params.couponRuleId).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.couponRuleId = dto.couponRuleId;
        $scope.formData.freeNum = dto.freeNum;
        $scope.formData.couponRuleName = dto.couponRuleName;
        $scope.formData.ruleType = sessionCache.getLookupValueByLookupName('COUPON_RULE_TYPE',dto.couponRuleType);
        $scope.formData.couponStartTime = new Date(dto.couponStartTime).format("yyyy-MM-dd hh:mm:ss");
        $scope.formData.couponEndTime = new Date(dto.couponEndTime).format("yyyy-MM-dd hh:mm:ss");
        $scope.formData.couponMoney = dto.couponMoney;
        $scope.formData.couponDesc = dto.couponDesc;
        $scope.formData.relateCoupon = sessionCache.getLookupValueByLookupName('IS_RELEATED_COUPON',dto.relateCoupon);
    }

    $scope.submitForm = function (isValid) {
      $scope.submited = true;
      if(!$scope.formData.couponStartTime) {
        growl.addErrorMessage("请选择起始日期", {ttl: 2000});
        return;
      }
      if(!$scope.formData.couponEndTime) {
        growl.addErrorMessage("请选择结束日期", {ttl: 2000});
        return;
      }
      if (isValid) {
        let data = {};
        data.couponRuleId = $scope.formData.couponRuleId;
        data.couponRuleType = $scope.formData.couponRuleType;
        data.couponRuleName = $scope.formData.couponRuleName;
        data.couponPrice = $scope.formData.couponMoney;
        data.couponDesc = $scope.formData.couponDesc;
        if ($scope.formData.couponStartTime && $scope.formData.couponEndTime) {
          if ($scope.formData.couponStartTime > $scope.formData.couponEndTime) {
              growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
              return;
          }
        }
        data.couponStartTime = $scope.formData.couponStartTime;
        data.couponEndTime = $scope.formData.couponEndTime;
        couponruleService.updateRule(data).then(function (msg) {
              growl.addInfoMessage('修改成功', {ttl: 2000});
              $state.go($scope.stateGoIndex);
          }, function (msg) {
              growl.addErrorMessage(msg, {ttl: 2000});
          });
      }
    };

    $scope.addrule1 = function() {
      $("rule1").eq(0).after($("rule1").eq(0).clone());
      $("rule1").find('img').attr('src','img/jianhao.png');
      $("rule1").eq(0).find('img').attr('src','img/jiahao.png');
      $("rule1").each(function() {
        $(this).find('img').click(function() {
          var str = $(this).attr("src");
          if(str.indexOf('jianhao') >= 0) {
            $(this).parent().parent().parent().parent().remove();
          }
        })
      })
    }
    $scope.addrule5 = function() {
      $("rule5").eq(0).after($("rule5").eq(0).clone());
      $("rule5").find('img').attr('src','img/jianhao.png');
      $("rule5").eq(0).find('img').attr('src','img/jiahao.png');
      $("rule5").each(function() {
        $(this).find('img').click(function() {
          var str = $(this).attr("src");
          if(str.indexOf('jianhao') >= 0) {
            $(this).parent().parent().parent().remove();
          }
        })
      })
    }
    
});

angular.module('parkingApp').directive('rule1',function () {
  return {
      restrict:'ECMA',
      templateUrl:'rule1'
  };
});
angular.module('parkingApp').directive('rule2',function () {
  return {
      restrict:'ECMA',
      templateUrl:'rule2'
  };
});
angular.module('parkingApp').directive('rule3',function () {
  return {
      restrict:'ECMA',
      templateUrl:'rule3'
  };
});
angular.module('parkingApp').directive('rule4',function () {
  return {
      restrict:'ECMA',
      templateUrl:'rule4'
  };
});
angular.module('parkingApp').directive('rule5',function () {
  return {
      restrict:'ECMA',
      templateUrl:'rule5'
  };
});