'use strict';

appService.factory("sentrychargeService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.billCode = data.billCode;
			reqData.parklotChargeType = data.parklotChargeType;
			reqData.userCode = data.userCode;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.SENTRYCHARGE.SENTRYCHARGE_PAGINATION,
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
            url: Setting.lotUrl.SENTRYCHARGE.SENTRYCHARGE_DETAIL,
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

    /* 导出 */
    let reqReport = function (data, type) {
        let reqData = {};
        reqData.plate = data.plate;
        reqData.parklotName = data.parklotName;
        reqData.billCode = data.billCode;
        reqData.userCode = data.userCode;
        reqData.parklotChargeType = data.parklotChargeType;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.SENTRYCHARGE.SENTRYCHARGE_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.SENTRYCHARGE.SENTRYCHARGE_EXCEL;
        }
        let deferred = $q.defer();
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
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
			reqReport: function(data,type) {
				return reqReport(data,type);
			},
		}
	}
]);