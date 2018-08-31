'use strict';

appService.factory("vipvehicleService", ['$q', '$http', 'Setting', '$log','sessionCache',
	function($q, $http, Setting, $log,sessionCache) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.orderCode = data.orderCode;
			reqData.cardCode = data.cardCode;
			reqData.plate = data.plate;
			reqData.phoneNum = data.phoneNum;
			reqData.orderSrc = data.orderSrc;
			reqData.payType = data.payType;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_PAGINATION,
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
        reqData.orderCode = data;
        reqData.opUser = sessionCache.getUserCode();;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_DETAIL,
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

    let reqList = function(data) {
      var reqData = {};
      var deferred = $q.defer();
      reqData.orderCode = data;
      $http({
          url: Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_PAY_LIST,
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
    }

    /* 导出 */
    let vipvehicleReport = function (data, type) {
        let reqData = {};
        reqData.cardCode = data.cardCode;
        reqData.plate = data.plate;
        reqData.phoneNum = data.phoneNum;
        reqData.orderCode = data.orderCode;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_EXCEL;
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

    var reqSum = function(data) {
			var reqData = {};
			reqData.orderCode = data.orderCode;
			reqData.cardCode = data.cardCode;
			reqData.plate = data.plate;
			reqData.phoneNum = data.phoneNum;
			reqData.orderSrc = data.orderSrc;
			reqData.payType = data.payType;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MOUTHBUYRECORD.MOUTHBUYRECORD_SUM,
				method: 'GET',
				params: reqData
			}).success(function(resp) {
				$log.debug(resp);
				if(resp) {
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
			vipvehicleReport: function(data,type) {
				return vipvehicleReport(data,type);
      },
      reqList: function (data) {
        return reqList(data);
      },
      reqSum: function (data) {
        return reqSum(data);
      },
		}
	}
]);