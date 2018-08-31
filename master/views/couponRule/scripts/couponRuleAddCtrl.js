'use strict';

angular.module('parkingApp').controller(
	'couponRuleAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, couponruleService,sessionCache,StateName,$timeout) {

    var indexId = "#couponRuleAdd";
    $scope.submited = false;
    $scope.selectTime = false;

    $scope.formData = {};
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.couponRule.index;
    $scope.ruleOptions = sessionCache.getDictsByLookupName("COUPON_RULE_TYPE");
    $scope.formData.couponRuleType = '1';
    $scope.formData.freenum = 1;
    $scope.formData.couponStartTime = new Date().format("yyyy-MM-dd 00:00:00");
    $scope.formData.couponEndTime = new Date().format("yyyy-MM-dd 23:59:59");

    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': ''
      });
    },200);

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
        data.couponRuleType = $scope.formData.couponRuleType;
        data.couponRuleName = $scope.formData.couponRuleName;
        data.couponPrice = $scope.formData.couponPrice;
        data.couponDesc = $scope.formData.couponDesc;
        if ($scope.formData.couponStartTime && $scope.formData.couponEndTime) {
          if ($scope.formData.couponStartTime > $scope.formData.couponEndTime) {
              growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
              return;
          }
        }
        data.couponStartTime = $scope.formData.couponStartTime;
        data.couponEndTime = $scope.formData.couponEndTime;
        couponruleService.addRule(data).then(function (msg) {
              growl.addInfoMessage('新增成功', {ttl: 2000});
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