'use strict';

appService.factory("parklotuserRealAttendService", ['$q', '$http', 'Setting', '$log','sessionCache',
	function($q, $http, Setting, $log,sessionCache) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.userCode = data.userCode;
			reqData.userName = data.userName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKLOTUSERREALATTEND.PARKLOTUSERREALATTEND_PAGINATION,
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
    let attendenceReport = function (data, type) {
        let reqData = {};
        reqData.userCode = data.userCode;
        reqData.userName = data.userName;
        reqData.parklotCodes = data.parklotCodes;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.PARKLOTUSERREALATTEND.PARKLOTUSERREALATTEND_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.PARKLOTUSERREALATTEND.PARKLOTUSERREALATTEND_EXCEL;
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

    //登入记录
    let reqEnterRecord = function(data) {
      var reqData = {};
			reqData.userCode = data.userCode;
      reqData.parklotCode = data.parklotCode;
      reqData.opTime = data.opTime;
      var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKLOTUSERREALATTEND.PARKLOTUSERREALATTEND_ENTER_RECORD,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				// $log.debug(resp);
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
			reqPagination: function(data) {
				return reqPagination(data);
			},
			attendenceReport: function(data,type) {
				return attendenceReport(data,type);
      },
			reqEnterRecord: function(data) {
				return reqEnterRecord(data);
      }
		}
	}
]);