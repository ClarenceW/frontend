'use strict';

appService.factory("membercarService", ['$q', '$http', 'Setting', '$log','sessionCache',
	function($q, $http, Setting, $log,sessionCache) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.vehicleOwnName = data.vehicleOwnName;
			reqData.vipVehicleStatus = data.vipVehicleStatus;
			reqData.userCode = data.userCode;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MEMBERCAR.MEMBERCAR_PAGINATION,
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
    
    var reqPull = function (data) {
        var reqData = {};
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MEMBERCAR.MEMBERCAR_PULL,
            method: 'GET',
            params:reqData,
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp.data);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqDelete = function (data) {
        var reqData = [];
        reqData = data;
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: Setting.lotUrl.MEMBERCAR.MEMBERCAR_DELETE,
            data: reqData,
            headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("删除成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqStatus = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.vehicleOwnName = data.vehicleOwnName;
			reqData.vipVehicleStatus = data.vipVehicleStatus;
			reqData.userCode = data.userCode;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MEMBERCAR.MEMBERCAR_STATUS_COUNT,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				$log.debug(resp);
				if(resp && resp.data) {
					deferred.resolve(resp.data);
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
      reqPull: function (data) {
          return reqPull(data);
      },
      reqDelete: function (data) {
          return reqDelete(data);
      },
      reqStatus: function (data) {
          return reqStatus(data);
      },
		}
	}
]);