'use strict';

appService.factory("operateChargeReportService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.parklotCode = data.parklotCode;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKCHARGEREPORT.PARKCHARGEREPORT_PAGINATION,
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

    /* 导出 */
    let reqReport = function (data, type) {
        let reqData = {};
        reqData.parklotCode = data.parklotCode;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.PARKCHARGEREPORT.PARKCHARGEREPORT_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.PARKCHARGEREPORT.PARKCHARGEREPORT_EXCEL;
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
			reqReport: function(data,type) {
				return reqReport(data,type);
			},
		}
	}
]);