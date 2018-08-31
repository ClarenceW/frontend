'use strict';

appService.factory("parkpayrecordService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.recordId = data.recordId;
			reqData.traId = data.traId;
			reqData.thirdSn = data.thirdSn;
			reqData.payType = data.payType;
			reqData.chargePlat = data.chargePlat;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_PAGINATION,
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
        reqData.recordId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_DETAIL,
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

    var reqTotalCharge = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.plate = data.plate;
        reqData.parklotName = data.parklotName;
        reqData.parklotCodes = data.parklotCodes;
        reqData.recordId = data.recordId;
        reqData.traId = data.traId;
        reqData.thirdSn = data.thirdSn;
        reqData.payType = data.payType;
        reqData.chargePlat = data.chargePlat;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_CHARGEALL,
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

    var reqParkingPayDetail = function (data) {
        var reqData = {};
        reqData.recordId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_PAY,
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
    let parkpayrecordReport = function (data, type) {
        let reqData = {};
        reqData.traId = data.traId;
        reqData.plate = data.plate;
        reqData.recordId = data.recordId;
        reqData.thirdSn = data.thirdSn;
        reqData.payType = data.payType;
        reqData.chargePlat = data.chargePlat;
        reqData.parklotName = data.parklotName;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        let url = '';
        if (type === 1) {
            reqData.start = 0;
            reqData.length = 10;
            url = Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_EXCEL_COUNT;
        } else if (type === 2) {
            reqData.start = data.start;
            reqData.length = data.length;
            url = Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_EXCEL;
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

    var reqPasscarrecord = function (data) {
        var reqData = {};
        reqData.recordId = data.recordId;
        reqData.payType = data.payType;
        reqData.payPlat = data.chargePlat;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_PASSCAR,
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

    var reqPayRecord = function (data) {
        var reqData = {};
        reqData.traId = data.traId;
        reqData.payPlat = data.chargePlat;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_PAYRECORD,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                var vo = {};
                vo.iTotalDisplayRecords = resp.data.length;
                vo.iTotalRecords = resp.data.length;
                vo.aaData = [];
                vo.aaData = resp.data;
                deferred.resolve(vo);
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqCouponRecord = function (data) {
        var reqData = {};
        reqData.recordId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKPAYRECORD.PARKPAYRECORD_COUPON,
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
			reqTotalCharge: function(data) {
				return reqTotalCharge(data);
			},
			reqParkingPayDetail: function(data) {
				return reqParkingPayDetail(data);
			},
			parkpayrecordReport: function(data,type) {
				return parkpayrecordReport(data,type);
			},
			reqPasscarrecord: function(data) {
				return reqPasscarrecord(data);
			},
			reqPayRecord: function(data) {
				return reqPayRecord(data);
			},
			reqCouponRecord: function(data) {
				return reqCouponRecord(data);
			},
		}
	}
]);