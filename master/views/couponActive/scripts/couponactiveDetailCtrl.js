'use strict';
angular.module('parkingApp').controller('couponactiveDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','couponactiveService','growl','customerService','$compile',
	function($scope, $state, StateName,sessionCache,Setting,couponactiveService,growl,customerService,$compile) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.couponActive.index;
    $scope.couponActivityType = $state.params.couponActivityType;
    couponactiveService.reqDetail($state.params).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.couponActivityId = dto.couponActivityId;
        $scope.formData.couponActivityName = dto.couponActivityName;
        $scope.formData.getCondition = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_RELATE_TYPE',dto.getCondition);
        $scope.formData.couponRecLimit = dto.couponRecLimit;
        $scope.formData.activityStatus = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_STATUS',dto.activityStatus);
        $scope.formData.startTime = dto.startTime;
        $scope.formData.endTime = dto.endTime;
        $scope.formData.opUser = dto.opUser;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.couponRuleType = dto.couponRuleType;
        $scope.formData.couponActivityDesc = dto.couponActivityDesc;
        $scope.formData.couponIsLimit = dto.couponIsLimit;
        
        for(let i = 0;i < dto.ruleDetailListDtos.length;i++) {
          if(!dto.ruleDetailListDtos[i].ruleDesc) {
            dto.ruleDetailListDtos[i].ruleDesc = '';
          }
          if(dto.getCondition == 3) {
            if(!dto.ruleDetailListDtos[i].couponIsLimit) {
              dto.ruleDetailListDtos[i].couponCount = '无限制';
            }
          }
          let actContent = `
          <table class="table table-bordered table-hover" width="100%" border="0" cellspacing="0" cellpadding="0" id="actContent">
          <tbody>
            <tr>
              <td width="25%" align="right"><font class="font-blue-deep"><strong>优惠规则</strong></font></td>
              <td width="75%">${dto.ruleDetailListDtos[i].couponRule}</td>
            </tr>
            <tr ng-if='${dto.ruleDetailListDtos[i].couponRuleType} == 1'>
              <td align="right"><font class="font-blue-deep"><strong>优惠金额</strong></font></td>
              <td>${dto.ruleDetailListDtos[i].couponPrice} 元</td>
            </tr>
            <tr ng-if='${dto.ruleDetailListDtos[i].couponRuleType} == 2'>
              <td align="right"><font class="font-blue-deep"><strong>免费次数</strong></font></td>
              <td>1 次</td>
            </tr>
            <tr>
              <td align="right"><font class="font-blue-deep"><strong>优惠券有效时间</strong></font></td>
              <td>${dto.ruleDetailListDtos[i].validStartTime} ~ ${dto.ruleDetailListDtos[i].validEndTime}</td>
            </tr>
            <tr>
              <td width="25%" align="right"><font class="font-blue-deep"><strong>规则描述</strong></font></td>
              <td width="75%">${dto.ruleDetailListDtos[i].ruleDesc}</td>
            </tr>
            <tr>
              <td width="25%" align="right"><font class="font-blue-deep"><strong>活动范围</strong></font></td>
              <td width="75%">${dto.ruleDetailListDtos[i].rangeName}</td>
            </tr>
            <tr>
              <td width="25%" align="right" ng-if='${dto.getCondition} == 3'><font class="font-blue-deep"><strong>发行数量</strong></font></td>
              <td width="25%" align="right" ng-if='${dto.getCondition} == 1 || ${dto.getCondition} == 4'><font class="font-blue-deep"><strong>赠送数量</strong></font></td>
              <td width="75%" ng-if='${dto.getCondition} == 3'>${dto.ruleDetailListDtos[i].couponCount} 张</td>
              <td width="75%" ng-if='${dto.getCondition} == 1 || ${dto.getCondition} == 4'>${dto.ruleDetailListDtos[i].couponRecMax} 张</td>
            </tr>
            </tbody>
          </table>`;
          let compileAct = $compile(actContent);
          let ActDom = compileAct($scope);
          $("#actBox").append(ActDom);
        }
        
    }
	}
]);