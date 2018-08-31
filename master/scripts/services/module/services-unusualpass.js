'use strict';

appService.factory("unusualpassService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.reason = data.reason;
			reqData.opUser = data.opUser;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.parkDirection = data.parkDirection;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.UNUSUALPASS.UNUSUALPASS_PAGINATION,
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
    
    var reqDetail = function (data) {
        var reqData = {};
        reqData.id = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.UNUSUALPASS.UNUSUALPASS_DETAIL,
            method: 'GET',
            params: reqData
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

    var reqPasscar = function (data) {
        var reqData = {};
        reqData.parklotRecordId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.UNUSUALPASS.UNUSUALPASS_PASSCAR,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
              var vo = {};
              vo.iTotalDisplayRecords = resp.data.length;
              vo.iTotalRecords = resp.data.length;
              vo.aaData = resp.data.map(item => {
                return item;
              });
              
              deferred.resolve(vo);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqTotalMoney = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.reason = data.reason;
			reqData.opUser = data.opUser;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.parkDirection = data.parkDirection;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.UNUSUALPASS.UNUSUALPASS_TOTALMONEY,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				$log.debug(resp);
				if(resp && resp.code == Setting.ResultCode.CODE_SUCCESS) {
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
			reqDetail: function(data) {
				return reqDetail(data);
			},
			reqPasscar: function(data) {
				return reqPasscar(data);
			},
			reqTotalMoney: function(data) {
				return reqTotalMoney(data);
			},
		}
	}
]);