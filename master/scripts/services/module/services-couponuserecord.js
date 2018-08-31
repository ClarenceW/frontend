'use strict';

appService.factory("couponuserecordService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = function(data) {
			let reqData = {};
			reqData.userCode = data.userCode;
			reqData.couponActivityName = data.couponActivityName;
			reqData.couponType = data.couponType;
			reqData.reciveStartTime	 = data.reciveStartTime	;
			reqData.reciveEndTime	 = data.reciveEndTime	;
			reqData.start = data.start;
			reqData.length = data.length;
			let deferred = $q.defer();
			$http({
				url: Setting.lotUrl.COUPONUSERECORD.COUPONUSERECORD_PAGINATION,
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

    var reqList = function () {
      var reqData = {};
      var deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONUSERECORD.COUPONUSERECORD_ACT_LIST,
          method: 'GET',
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

    let addCoupon = function (data) {
      let deferred = $q.defer();
      let reqData = {};
      reqData.userCode = data.userCode;
      reqData.couponActivityId = data.couponActivityId;
      reqData.reciveCount = data.reciveCount;
      reqData.opUser = sessionCache.getUserCode();
      $http({
          url: Setting.lotUrl.COUPONUSERECORD.COUPONUSERECORD_ACT_ADD,
          method: 'POST',
          data: reqData,
      }).success(function (resp) {
          if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
              deferred.resolve(resp);
          } else {
              deferred.reject(resp.msg);
          }
      }).error(function () {
          deferred.reject(errorMsg);
      });
      return deferred.promise;
  };

    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        reqList: function () {
            return reqList();
        },
        addCoupon: function (data) {
            return addCoupon(data);
        }
    }
});
