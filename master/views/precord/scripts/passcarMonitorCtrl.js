'use strict';

angular.module('parkingApp').controller('passcarMonitorCtrl', ['$scope', 'growl', 'customerService', 'parklotsRecordService', 'Setting','$timeout','parklotsService',
	function($scope, growl, customerService, parklotsRecordService, Setting,$timeout,parklotsService) {
		var indexId = "#mrecord-index";
		var tableId = indexId + " #mrecord-table";
		var oTable = null;
		$scope.formData = {};
		$scope.mockDatas = [];
		$scope.picBaseUrl = Setting.SERVER.DOWNLOAD+"?file=";
		$scope.haveData = false;
		$scope.defaultNoCar = "img/passcarmonitor.png"
		$timeout(() => {
      customerService.initTitle();
      customerService.handleFancyBox();
    },50)
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });
		
		var initData = () => {
			var data = {};
			if ($scope.formData.parklotName) {
          data.parklotName = $scope.formData.parklotName;
      }
      if($scope.formData.parklotCodes) {
        data.parklotCodes = $scope.formData.parklotCodes;
      }
			parklotsRecordService.passcarMonitorPagination(data).then(res => {
        $scope.parkOptions = res;
        if($scope.parkOptions.length == 0) {
          $scope.haveData = true;
        }else {
          $scope.haveData = false;
        }
			})
		}
		initData();
		$scope.toSearch = () => {
			initData();
		}
		
		$scope.toReset = () => {
      $scope.formData.parklotName = "";
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
			initData();
    }
    $scope.open = (event) => {
      $(event.target).parent().next().toggle('1000');
      let str = $(event.target).html();
      let openStatus = str == "展开" ? "收起" : "展开";
      $(event.target).html(openStatus);
    }
	}
]);