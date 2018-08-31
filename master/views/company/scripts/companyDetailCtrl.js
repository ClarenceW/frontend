'use strict';
angular.module('parkingApp').controller('companyDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting',
	function($scope, $state, StateName,sessionCache,Setting) {
		$scope.formData = {};
		$scope.stateGoIndex = StateName.company.index;
		var company = $state.params.company;
		company.opType = sessionCache.getCompanyOptTypesValue(company.opType);
		company.checkFlag = sessionCache.getCompanyCheckFlagValue(company.checkFlag);
		if(company.pic1){
			company.pic1=Setting.SERVER.DOWNLOAD+"?file="+company.pic1;
		}
		if(company.pic2){
			company.pic2=Setting.SERVER.DOWNLOAD+"?file="+company.pic2;
		}
		if(company.pic3){
			company.pic3=Setting.SERVER.DOWNLOAD+"?file="+company.pic3;
		}
		$scope.formData = company;
	}
]);