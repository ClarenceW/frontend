'use strict';

appService.factory("districtService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.DISTRICT.DISTRICT_PAGINATION,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				$log.debug(resp);
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

		var reqList = function() {
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.DISTRICT.DISTRICT_LIST,
				method: 'GET'
			}).success(function(resp) {
				$log.debug(resp);
				if(resp && resp.data) {
					var aaData = resp.data;
					var distArr = [];
					angular.forEach(aaData, function(district) {
						var dist = {};
						dist.code = district.districtCode;
						dist.name = district.name;
						distArr.push(dist);
					});
					deferred.resolve(distArr);
				} else {
					deferred.reject(errorMsg);
				}
			}).error(function() {
				deferred.reject(errorMsg);
			});
			return deferred.promise;
		};

		return {
			reqPagination: function(data) {
				return reqPagination(data);
			},
			reqList: function() {
				return reqList();
			}
		}
	}
]);