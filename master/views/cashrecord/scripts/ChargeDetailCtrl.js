'use strict';

angular.module('parkingApp').controller('ChargeDetailCtrl',
    function ($rootScope, $scope, $http, $state, growl, Setting, StateName, sessionCache, sentrychargeService, $timeout, $filter, $compile,passcarService,alreadypaytradeService) {

        $scope.formData = {};
        $scope.passcar = false;
        $scope.payrecord = false;
        var detailId = "#charge-detail";
        var passcarTableId = detailId + " #pass-car-table";
        var payRecordTableId = detailId + " #pay-record-table";
        $scope.stateGoCashIndex = StateName.cashrecord.index;
        $scope.stateGoCashVerifyIndex = StateName.cashrecord.havePayedIndex;
        $scope.stateGoChargeIndex = StateName.cashrecord.parkpayIndex;
        $scope.userCode =$state.params.userCode;
        sentrychargeService.reqDetail($state.params.id).then(function (dto) {
            if (dto) {
                fillForm(dto);
            }
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
        function fillForm(dto) {
            $scope.formData.plate = dto.plate;
            $scope.formData.billCode = dto.billCode;
            $scope.formData.payableMoney = dto.payableMoney;
            $scope.formData.parklotChargeType = sessionCache.getLookupValueByLookupName('PARKLOT_CHARGE_TYPE',dto.parklotChargeType);
            $scope.formData.actualMoney = dto.actualMoney;
            $scope.formData.parklotName = dto.parklotName;
            $scope.formData.discountsMoney = dto.discountsMoney;
            $scope.formData.id = dto.id;
            $scope.formData.payTime = dto.payTime;
            $scope.formData.opUser = dto.opUser;
        }

        $scope.goBack = function() {
          $state.go($scope.stateGoChargeIndex, { parklotName: $scope.formData.parklotName,chargeDate:$scope.formData.payTime,userCode:$scope.userCode});
        }

    });