'use strict';
angular.module('parkingApp').controller('passcarrecordDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','passcarService','growl','customerService','$compile',
	function($scope, $state, StateName,sessionCache,Setting,passcarService,growl,customerService,$compile) {
		$scope.formData = {};
		$scope.stateGoIndex = StateName.passcarrecord.index;
    passcarService.reqDetail($state.params.id).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });
    $scope.nopicUrl = 'img/nopic.png';
    $scope.noplateUrl = 'img/nopalte.png';

    function fillForm(dto) {
        $scope.formData.id = dto.id;
        $scope.formData.plate = dto.plate;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION',dto.parkDirection);
        $scope.formData.laneName = dto.laneName;
        $scope.formData.terminalNo = dto.terminalNo;
        $scope.formData.passType = sessionCache.getLookupValueByLookupName('PASS_TYPE',dto.passType);;
        $scope.formData.passTime = dto.passTime;
        $scope.formData.opUser = dto.opUser;
        let url1 = dto.pic ? Setting.SERVER.DOWNLOAD+"?file=" + dto.pic : $scope.nopicUrl;
        let imgTemplate1 = "<a href=\""+url1+"\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img class=\"\" src=\"" + url1 + "\" style=\"width:80px !important;height:auto;margin:auto;\"></a>";
        let compileFn1 = $compile(imgTemplate1);
        let $dom1 = compileFn1($scope);
        $('tr:eq(11) td:eq(1)').html($dom1);
        let url2 = dto.platePic ? Setting.SERVER.DOWNLOAD+"?file=" + dto.platePic : $scope.noplateUrl;
        let imgTemplate2 = "<a href=\""+url2+"\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img class=\"\" src=\"" + url2 + "\" style=\"width:80px !important;height:auto;margin:auto;\"></a>";
        let compileFn2 = $compile(imgTemplate2);
        let $dom2 = compileFn2($scope);
        customerService.handleFancyBox();
        $('tr:eq(12) td:eq(1)').html($dom2);
    }

    $scope.back = function() {
        $state.go($scope.stateGoIndex, {params:$state.params.params,flg:1 });
    }
		
	}
]);