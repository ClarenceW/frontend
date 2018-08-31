'use strict';

appService.factory("parkingrecordService", ['$q', '$http', 'Setting', '$log',
	function($q, $http, Setting, $log) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.boId = data.boId;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.PARKINGRECORD.PARKINGRECORD_PAGINATION,
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
        reqData.boId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKINGRECORD.PARKINGRECORD_DETAIL,
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
        reqData.boId = data;
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.PARKINGRECORD.PARKINGRECORD_PAY,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            let {code, msg, data} = resp;
            if (code === Setting.ResultCode.CODE_SUCCESS && data) {
                let vo = {};
                vo.iTotalDisplayRecords = data.length;
                vo.iTotalRecords = data.length;
                vo.code = code;
                vo.msg = msg;
                vo.aaData = [];
                for (let item of data) {
                    let itemVo = {};
                    itemVo.boId = item.boId;
                    itemVo.traId = item.traId;
                    itemVo.plate = item.plate;
                    itemVo.parklotName = item.parklotName;
                    itemVo.payMoney = item.payMoney;
                    itemVo.paySrc = item.paySrc;
                    itemVo.payTime = item.payTime;
                    itemVo.orderStatus = item.orderStatus;
                    vo.aaData.push(itemVo);
                }
                deferred.resolve(vo);
            } else {
                deferred.reject(errorMsg);
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
			reqParkingPayDetail: function(data) {
				return reqParkingPayDetail(data);
			}
		}
	}
]);