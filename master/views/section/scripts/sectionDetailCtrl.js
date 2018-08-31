'use strict';

angular.module('parkingApp').controller('SectionDetailCtrl',function ($rootScope, $scope, $http, $state, growl, sectionService,StateName,sessionCache) {

    $scope.formData = {};
    $scope.stateGoIndex = StateName.section.index;
    //$scope.sectionTypeOption = sessionCache.getSectionTypeGroup();
    //$scope.isOpOption=sessionCache.getIsOpGroup();

    sectionService.reqDetail($state.params).then(function (dto) {
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        var _date = new Date(dto.sysTime);
        $scope.formData.sectionCode = dto.sectionCode;
        $scope.formData.name = dto.name;
        $scope.formData.lat = dto.lat;
        $scope.formData.lng = dto.lng;
        $scope.formData.description = dto.description;
        $scope.formData.address = dto.address;
        $scope.formData.berthNum = dto.berthNum;
        $scope.formData.districtCode = dto.districtCode;
        $scope.formData.areaCode = dto.areaCode;
        $scope.formData.companyCode = dto.companyCode;
        $scope.formData.isOp = sessionCache.getIsOpType(dto.isOp);
        $scope.formData.sysTime =  _date.format("yyyy-MM-dd hh:mm:ss");
    }
});