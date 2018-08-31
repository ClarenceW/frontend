'use strict';
angular.module('parkingApp').controller('mouthcardbuyDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','mouthcardBuyService','growl','customerService','$compile',
	function($scope, $state, StateName,sessionCache,Setting,mouthcardBuyService,growl,customerService,$compile) {
		$scope.formData = {};
		$scope.stateGoIndex = StateName.mouthcardbuy.index;
    mouthcardBuyService.reqDetail($state.params.recordCode).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.recordCode = dto.recordCode;
        $scope.formData.plate = dto.plate;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.cardType = sessionCache.getLookupValueByLookupName('CARD_TYPE',dto.type);
        $scope.formData.terminal = sessionCache.getLookupValueByLookupName('CARD_ORDER_SRC',dto.terminal);
        $scope.formData.cardCode = dto.cardCode;
        $scope.formData.cardName = dto.cardName;
        $scope.formData.payMoney = dto.payMoney+"元";
        $scope.formData.validTime = dto.validTime;
        $scope.formData.invalidTime = dto.invalidTime;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.remainTime = dto.remainTime+'天';
        $scope.formData.phoneNum = dto.phoneNum;
        $scope.formData.vehicleOwnName = dto.vehicleOwnName;
        $scope.formData.status = sessionCache.getLookupValueByLookupName('USER_CARD_STATUS',dto.status);
    }
		
	}
]);