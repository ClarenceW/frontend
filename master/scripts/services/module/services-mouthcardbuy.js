'use strict';

appService.factory("mouthcardBuyService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = function(data) {
			let reqData = {};
			reqData.userCode = data.userCode;
			reqData.plate = data.plate;
			reqData.cardCode = data.cardCode;
			reqData.status = data.status;
			reqData.userName = data.userName;
			reqData.terminal = data.terminal;
			reqData.parklotCodes = data.parklotCodes;
			reqData.type = data.type;
			reqData.buyStartTime = data.buyStartTime;
			reqData.buyEndTime = data.buyEndTime;
			reqData.effectStartTime = data.effectStartTime;
			reqData.effectEndTime = data.effectEndTime;
			reqData.start = data.start;
			reqData.length = data.length;
			let deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_PAGINATION,
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
        reqData.recordCode = data;
        $http({
            url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_DETAIL,
            method: 'get',
            params: reqData
        }).success(function (resp) {
            deferred.resolve(resp);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    let addCard = function (data) {
        let deferred = $q.defer();
        let reqData = {};
        reqData.cardName = data.cardName;
        reqData.userName = data.userName;
        reqData.plate = data.plate;
        reqData.plateColor = data.plateColor;
        reqData.cardCode = data.cardCode;
        reqData.validTime = data.validTime;
        reqData.phoneNum = data.phoneNum;
        reqData.vehicleOwn = data.vehicleOwn;
        reqData.cardType = data.cardType;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_ADD,
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

    let reqList = function(data) {
      var reqData = {};
      var deferred = $q.defer();
      reqData.cardCode = data;
      $http({
          url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_LIST,
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
    }

    let reqcarOwnList = function(data) {
      var deferred = $q.defer();
      $http({
          url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_CAROWN_LIST,
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
    }

    let reqAddcarOwn = function(data) {
      var reqData = {};
      var deferred = $q.defer();
      reqData.vehicleOwnName = data;
      $http({
          url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_ADD_CAROWN,
          method: 'POST',
          data: reqData
      }).success(function (resp) {
          if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
              deferred.resolve(resp);
          } else {
              deferred.reject(resp.msg);
          }
      }).error(function () {
          deferred.reject(errorMsg)
      });
      return deferred.promise;
    }

    var reqCountAdd = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.excelReqList = data.excelReqList;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            method: 'POST',
            url: Setting.lotUrl.MOUTHCARDBUY.MOUTHCARDBUY_ADD_COUNT,
            data: reqData,
        }).success(function (resp) {
            if (resp && resp.data) {
                deferred.resolve(resp);
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
        addCard: function (data) {
            return addCard(data);
        },
        reqList: function (data) {
            return reqList(data);
        },
        reqcarOwnList: function (data) {
            return reqcarOwnList(data);
        },
        reqAddcarOwn: function (data) {
            return reqAddcarOwn(data);
        },
        reqCountAdd: function (data) {
            return reqCountAdd(data);
        },
    }
});
