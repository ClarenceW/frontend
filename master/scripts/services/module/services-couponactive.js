'use strict';

appService.factory("couponactiveService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = function(data) {
			let reqData = {};
			reqData.couponActivityId = data.couponActivityId;
			reqData.couponActivityRange = data.couponActivityRange;
			reqData.parklotCodes = data.parklotCodes;
			reqData.couponActivityName = data.couponActivityName;
			reqData.couponActivityStatus = data.couponActivityStatus;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.couponActivityStartTime = data.couponActivityStartTime;
			reqData.couponActivityEndTime = data.couponActivityEndTime;
			reqData.start = data.start;
			reqData.length = data.length;
			let deferred = $q.defer();
			$http({
				url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_PAGINATION,
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

    let reqDetail = function (data) {
        let deferred = $q.defer();
        let reqData = {};
        reqData.couponActivityId = data.couponActivityId;
        reqData.couponActivityType = data.couponActivityType;
        $http({
            url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_DETAIL,
            method: 'get',
            params: reqData
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    let addActive = function (data) {
        let deferred = $q.defer();
        let reqData = {};
        reqData.ruleListInsertReqList = data.ruleListInsertReqList;
        reqData.couponActivityName = data.couponActivityName;
        reqData.getCondition = data.getCondition;
        reqData.startTime = data.startTime;
        reqData.endTime = data.endTime;
        reqData.activityDesc = data.activityDesc;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_ADD,
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

    let updateActive = function (data) {
      let reqData = {};
      reqData.couponActivityId = data.couponActivityId;
      reqData.activityStatus = data.activityStatus;
      reqData.ruleListInsertReqList = data.ruleListInsertReqList;
      reqData.couponActivityName = data.couponActivityName;
      reqData.getCondition = data.getCondition;
      reqData.startTime = data.startTime;
      reqData.endTime = data.endTime;
      reqData.activityDesc = data.activityDesc;
      reqData.opUser = sessionCache.getUserCode();
      let deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_EDIT,
          method: 'PUT',
          data: reqData
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

    let delActive = function (data) {
      let deferred = $q.defer();
      let reqData = {};
      reqData.couponActivityId = data;
      $http({
          url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_DEL,
          method: 'DELETE',
          data: reqData,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
      }).success(function (resp) {
          deferred.resolve(resp);
      }).error(function () {
          deferred.reject(errorMsg);
      });
      return deferred.promise;
    };

    let startActive = function (data) {
      let reqData = {};
      reqData.couponActivityId = data.couponActivityId;
      let deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_START,
          method: 'PUT',
          data: reqData
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

    let endActive = function (data) {
      let reqData = {};
      reqData.couponActivityId = data.couponActivityId;
      let deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_END,
          method: 'PUT',
          data: reqData
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

    var reqList = function () {
      var reqData = {};
      var deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONACTIVE.COUPONACTIVE_LIST,
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

    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
        addActive: function (data) {
            return addActive(data);
        },
        updateActive: function (data) {
            return updateActive(data);
        },
        delActive: function (data) {
            return delActive(data);
        },
        startActive: function (data) {
            return startActive(data);
        },
        endActive: function (data) {
            return endActive(data);
        },
        reqList: function (data) {
            return reqList(data);
        },
    }
});
