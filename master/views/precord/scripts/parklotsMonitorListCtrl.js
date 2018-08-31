'use strict';

angular.module('parkingApp').controller('ParklotsMonitorListCtrl', ['$scope', 'growl', 'customerService', 'parklotsRecordService', 'Setting','$timeout',
	function($scope, growl, customerService, parklotsRecordService, Setting,$timeout) {
		var indexId = "#mrecord-index";
		var tableId = indexId + " #mrecord-table";
		var oTable = null;
		$scope.formData = {};
		$scope.mockDatas = [];
		$scope.picBaseUrl = Setting.SERVER.DOWNLOAD+"?file=";
		$scope.defaultPic = "img/zhtc.png";
		$scope.defaultNoCar = "img/parklot.png"
		$timeout(function(){
			customerService.initTitle();
		},50)
		
		var initData = function(){
			var data = {};
			if ($scope.formData.name) {
                data.name = $scope.formData.name;
            }
			
			// parklotsRecordService.monitorParkingPagination(data).then(function(res){
			// 	$scope.mockDatas = res;
			// })
		}
		initData();
		$scope.toSearch = function(){
			initData();
		}
		
		$scope.toReset = function(){
			$scope.formData.name = "";
			initData();
		}
	}
]);