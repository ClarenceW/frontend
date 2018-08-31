'use strict';

appService.factory("invoiceHistoryService", ['$q', '$http', 'Setting', '$log','sessionCache',
	function($q, $http, Setting, $log,sessionCache) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.userCode = data.userCode;
			reqData.recordCode = data.recordCode;
			reqData.invoiceStatus = data.invoiceStatus;
			reqData.invoiceRise = data.invoiceRise;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_PAGINATION,
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
        reqData.recordCode = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_DETAIL,
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
    let invoiveHistoryReport = function (data, type) {
        let reqData = {};
        reqData.userCode = data.userCode;
        reqData.recordCode = data.recordCode;
        reqData.invoiceStatus = data.invoiceStatus;
        reqData.invoiceRise = data.invoiceRise;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_EXCEL;
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

    var reqPayRecord = function (data) {
        var reqData = {};
        reqData.recordCode = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_PAY_RECORD,
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

    var reqCardRecord = function (data) {
        var reqData = {};
        reqData.recordCode = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.INVOICEHISTORY.INVOICEHISTORY_CARD_RECORD,
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

		return {
			reqPagination: function(data) {
				return reqPagination(data);
			},
			reqDetail: function(data) {
				return reqDetail(data);
			},
			reqPayRecord: function(data) {
				return reqPayRecord(data);
			},
			reqCardRecord: function(data) {
				return reqCardRecord(data);
			},
			invoiveHistoryReport: function(data,type) {
				return invoiveHistoryReport(data,type);
      }
		}
	}
]);