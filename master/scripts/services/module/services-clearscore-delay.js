'use strict';

appService.factory("clearScoreDelayService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqInPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.inCode = data.inCode;
			reqData.length = data.length;
			reqData.start = data.start;
			var deferred = $q.defer();
			$http({
				url: "scripts/services/module/data/list-delay.json",
				// url: Setting.lotUrl.PARKLOTSRECORD.PARKLOTSRECORD_IN_PAGINATION,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				if(resp && resp.aaData) {
					deferred.resolve(resp);
				} else {
					deferred.reject(errorMsg);
				}
			}).error(function() {
				deferred.reject(errorMsg);
			});
			return deferred.promise;
		};

		var reqOutPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.outCode = data.outCode;
			reqData.length = data.length;
			reqData.start = data.start;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKLOTSRECORD.PARKLOTSRECORD_OUT_PAGINATION,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				if(resp && resp.aaData) {
					deferred.resolve(resp);
				} else {
					deferred.reject(errorMsg);
				}
			}).error(function() {
				deferred.reject(errorMsg);
			});
			return deferred.promise;
		};
		
		
		var monitorParkingPagination = function(data){
			var reqData = {};
			reqData.name = data.name;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKLOTSRECORD.PARKLOTS_MONITOR_LIST,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				if(resp && resp.data) {
					deferred.resolve(resp.data);
				} else {
					deferred.reject(errorMsg);
				}
			}).error(function() {
				deferred.reject(errorMsg);
			});
			return deferred.promise;
		}

		return {
			reqInPagination: function(data) {
				return reqInPagination(data);
			},
			reqOutPagination: function(data) {
				return reqOutPagination(data);
			},
			monitorParkingPagination:function(data){
				return monitorParkingPagination(data);
			}
		}
	}
]);