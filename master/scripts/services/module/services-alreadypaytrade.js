'use strict';

appService.factory("alreadypaytradeService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.paySrc = data.paySrc;
			reqData.payType = data.payType;
			reqData.boId = data.boId;
			reqData.traId = data.traId;
			reqData.orderStatus = data.orderStatus;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.ALREADYPAYTRADE.ALREADYPAYTRADE_PAGINATION,
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
        reqData.traId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.ALREADYPAYTRADE.ALREADYPAYTRADE_DETAIL,
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

    var reqRecord = function (data) {
        var reqData = {};
        reqData.traId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.ALREADYPAYTRADE.ALREADYPAYTRADE_RECORD,
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

    var reqTotalCharge = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.plate = data.plate;
        reqData.parklotName = data.parklotName;
        reqData.parklotCodes = data.parklotCodes;
        reqData.paySrc = data.paySrc;
        reqData.payType = data.payType;
        reqData.boId = data.boId;
        reqData.traId = data.traId;
        reqData.orderStatus = data.orderStatus;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        $http({
            url: Setting.lotUrl.ALREADYPAYTRADE.ALREADYPAYTRADE_TOTAL_CHARGE,
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

		return {
			reqPagination: function(data) {
				return reqPagination(data);
			},
			reqDetail: function(data) {
				return reqDetail(data);
			},
			reqRecord: function(data) {
				return reqRecord(data);
			},
			reqTotalCharge: function(data) {
				return reqTotalCharge(data);
			},
		}
	}
]);