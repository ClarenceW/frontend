'use strict';

appService.factory("couponruleService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = function(data) {
			let reqData = {};
			reqData.couponRuleId = data.couponRuleId;
			reqData.couponRuleName = data.couponRuleName;
			reqData.couponRuleType = data.couponRuleType;
			reqData.relateCoupon = data.relateCoupon;
			reqData.start = data.start;
			reqData.length = data.length;
			let deferred = $q.defer();
			$http({
				url: Setting.lotUrl.COUPONRULE.COUPONRULE_PAGINATION,
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
        reqData.couponRuleId = data;
        $http({
            url: Setting.lotUrl.COUPONRULE.COUPONRULE_DETAIL,
            method: 'get',
            params: reqData
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    let addRule = function (data) {
        let deferred = $q.defer();
        let reqData = {};
        reqData.couponRuleType = data.couponRuleType;
        reqData.couponRuleName = data.couponRuleName;
        reqData.couponPrice = data.couponPrice;
        reqData.couponStartTime = data.couponStartTime;
        reqData.couponEndTime = data.couponEndTime;
        reqData.couponDesc = data.couponDesc;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.COUPONRULE.COUPONRULE_ADD,
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

    let updateRule = function (data) {
      let reqData = {};
      reqData.couponRuleId = data.couponRuleId;
      reqData.couponRuleType = data.couponRuleType;
      reqData.couponRuleName = data.couponRuleName;
      reqData.couponPrice = data.couponPrice;
      reqData.couponStartTime = data.couponStartTime;
      reqData.couponEndTime = data.couponEndTime;
      reqData.couponDesc = data.couponDesc;
      reqData.opUser = sessionCache.getUserCode();
      let deferred = $q.defer();
      $http({
          url: Setting.lotUrl.COUPONRULE.COUPONRULE_EDIT,
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

    let delRule = function (data) {
      let deferred = $q.defer();
      let reqData = {};
      reqData.couponRuleId = data;
      $http({
          url: Setting.lotUrl.COUPONRULE.COUPONRULE_DEL,
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

    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
        reqDetail: function (data) {
            return reqDetail(data);
        },
        addRule: function (data) {
            return addRule(data);
        },
        updateRule: function (data) {
            return updateRule(data);
        },
        delRule: function (data) {
            return delRule(data);
        },
    }
});
