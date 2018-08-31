'use strict';
angular.module('parkingApp').controller('couponRuleDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','couponruleService','growl','customerService','$compile',
	function($scope, $state, StateName,sessionCache,Setting,couponruleService,growl,customerService,$compile) {
		$scope.formData = {};
		$scope.stateGoIndex = StateName.couponRule.index;
		$scope.couponRuleType = $state.params.couponRuleType;
    couponruleService.reqDetail($state.params.couponRuleId).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.couponRuleId = dto.couponRuleId;
        $scope.formData.couponRuleName = dto.couponRuleName;
        $scope.formData.couponRuleType = sessionCache.getLookupValueByLookupName('COUPON_RULE_TYPE',dto.couponRuleType);
        $scope.formData.couponStartTime = dto.couponStartTime;
        $scope.formData.couponEndTime = dto.couponEndTime;
        $scope.formData.couponMoney = dto.couponMoney;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.freeNum = dto.freeNum;
        $scope.formData.opUser = dto.opUser;
        $scope.formData.couponDesc = dto.couponDesc;
        $scope.formData.relateCoupon = sessionCache.getLookupValueByLookupName('IS_RELEATED_COUPON',dto.relateCoupon);
    }
	}
]);