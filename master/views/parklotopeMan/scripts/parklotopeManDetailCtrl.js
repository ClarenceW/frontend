'use strict';

angular.module('parkingApp').controller('parklotopeManDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting',
	function($scope, $state, StateName,sessionCache,Setting) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.parklotopeMan.index;
    $scope.stateGoEdit = StateName.parklotopeMan.edit;
    $scope.attrOptions=sessionCache.getDictsByLookupName("DCLOT_ATTR");
    $scope.typeOptions=sessionCache.getDictsByLookupName("DCLOT_TYPE");
    $scope.isOpOptions = sessionCache.getDictsByLookupName("DCLOT_OP");
    $scope.styleOptions = sessionCache.getDictsByLookupName("DCLOT_STYLE");
    
    parklotsService.reqDetail($state.params.id).then(function(resp) {
        fillForm(resp);
    })

    function fillForm(dto) {
        $scope.formData.name = dto.name;
        $scope.formData.berthNum = dto.berthNum;
        $scope.formData.address = dto.address;
        $scope.formData.pic1 = dto.pic1;
        $scope.formData.picUrl1 = Setting.SERVER.DOWNLOAD+"?file="+dto.pic1;
        $scope.formData.pic2 = dto.pic2;
        $scope.formData.picUrl2 = Setting.SERVER.DOWNLOAD+"?file="+dto.pic2;
        $scope.formData.lat = dto.lat;
        $scope.formData.lng = dto.lng;
        $scope.formData.contacts = dto.contacts;
        $scope.formData.contactNumber = dto.contactNumber;
        $scope.formData.email = dto.email;
        $scope.formData.description = dto.description;
        $scope.formData.attr = dto.attr;
        $scope.formData.type = dto.type;
        $scope.formData.style = dto.style;
        $scope.formData.updateTime = dto.updateTime;
        $scope.formData.isOp = sessionCache.getLookupValueByLookupName("DCLOT_OP",dto.isOp);
    }
	}
]);