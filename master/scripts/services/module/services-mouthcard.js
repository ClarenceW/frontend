'use strict';

appService.factory("mouthcardService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = function(data) {
			let reqData = {};
			reqData.code = data.code;
			reqData.cardName = data.cardName;
			reqData.parklotName = data.parklotName;
			reqData.parklotCodes = data.parklotCodes;
			reqData.status = data.status;
			reqData.cardType = data.cardType;
			reqData.cardChannel = data.cardChannel;
			reqData.cardStartTime = data.cardStartTime;
			reqData.cardEndTime = data.cardEndTime;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			let deferred = $q.defer();
			$http({
				url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_PAGINATION,
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
        reqData.cardCode = data;
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_DETAIL,
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
        reqData.type = data.type;
        reqData.price = data.price;
        reqData.cardChannel = data.cardChannel;
        reqData.cardSum = data.cardSum;
        reqData.parklotCodes = data.parklotCodes;
        reqData.parklotNames = data.parklotNames;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_ADD,
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

    let updateCard = function (data) {
        let reqData = {};
        reqData.cardCode = data.cardCode;
        reqData.cardName = data.cardName;
        reqData.type = data.type;
        reqData.price = data.price;
        reqData.cardSum = data.cardSum;
        reqData.cardChannel = data.cardChannel;
        reqData.status = data.status;
        reqData.parklotCodes = data.parklotCodes;
        reqData.parklotNames = data.parklotNames;
        reqData.opUser = sessionCache.getUserCode();
        let deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_EDIT,
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

    let reqList = function () {
        let reqData = {};
        let deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_LOTLIST,
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

    let delCard = function (data) {
        let deferred = $q.defer();
        let reqData = {};
        reqData.cardCode = data.cardCode;
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_DEL,
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

    let startCard = function (data) {
        let reqData = {};
        reqData.cardCode = data.cardCode;
        let deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_START,
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

    let endCard = function (data) {
        let reqData = {};
        reqData.cardCode = data.cardCode;
        let deferred = $q.defer();
        $http({
            url: Setting.lotUrl.MOUTHCARD.MOUTHCARD_END,
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
        updateCard: function (data) {
            return updateCard(data);
        },
        reqList: function () {
            return reqList();
        },
        delCard: function (data) {
            return delCard(data);
        },
        startCard: function (data) {
            return startCard(data);
        },
        endCard: function (data) {
            return endCard(data);
        },
    }
});
