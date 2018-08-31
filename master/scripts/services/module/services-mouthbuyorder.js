'use strict';

appService.factory("mouthbuyorderService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.id = data.id;
			reqData.orderSrc = data.orderSrc;
			reqData.userCode = data.userCode;
			reqData.cardCode = data.cardCode;
			reqData.orderStatus = data.orderStatus;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MOUTHBUYORDER.MOUTHBUYORDER_PAGINATION,
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

		return {
			reqPagination: function(data) {
				return reqPagination(data);
			},
		}
	}
]);