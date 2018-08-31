'use strict';
angular.module('parkingApp').controller('lotparkingDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','lotparkingService','$compile','customerService',
	function($scope, $state, StateName,sessionCache,Setting,lotparkingService,$compile,customerService) {
		$scope.formData = {};
		$scope.stateGoIndex = StateName.lotparking.index;
    lotparkingService.reqDetail($state.params.id).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.plate = dto.plate;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.parklotFloor = dto.parklotFloor;
        $scope.formData.parklotArea = dto.parklotArea;
        $scope.formData.berthCode = dto.berthCode;
        $scope.formData.passTime = dto.passTime;
        $scope.formData.laneName = dto.laneName;
        if(dto.pic) {
          let url1 = Setting.SERVER.DOWNLOAD+"?file=" + dto.pic;
          let imgTemplate1 = "<a href=\""+url1+"\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:60px !important;height:auto;margin:auto;\"></a>";
          let compileFn1 = $compile(imgTemplate1);
          let $dom1 = compileFn1($scope);
          customerService.handleFancyBox();
          $('tr:eq(9) td:eq(1)').html($dom1);
        }else {
          $('tr:eq(9) td:eq(1)').html('');
        }
        
    }

    $scope.back = function() {
        $state.go($scope.stateGoIndex, {params:$state.params.params,flg:1 });
    }
		
	}
]);