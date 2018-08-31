'use strict';

appService.factory("whitelistcarService", ['$q', '$http', 'Setting', '$log','sessionCache',
	function($q, $http, Setting, $log,sessionCache) {

		var errorMsg = "数据加载异常...";
		var reqPagination = function(data) {
			var reqData = {};
			reqData.plate = data.plate;
			reqData.parklotCode = data.parklotCode;
			reqData.userCode = data.userCode;
			reqData.userName = data.userName;
			reqData.startTime = data.startTime;
			reqData.endTime = data.endTime;
			reqData.start = data.start;
			reqData.length = data.length;
			var deferred = $q.defer();
			$http({
				url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_PAGINATION,
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
    
    var addlist = function (data) {
      var deferred = $q.defer();
      var reqData = {};
      reqData.userCode = data.userCode;
      reqData.userName = data.userName;
      reqData.plate = data.plate;
      reqData.plateColor = data.plateColor;
      reqData.parklotCode = data.parklotCode;
      reqData.startTime = data.startTime;
      reqData.endTime = data.endTime;
      reqData.description = data.description;
      reqData.opUser = sessionCache.getUserCode();
      $http({
          url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_ADD,
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

    var reqDetail = function (data) {
      var reqData = {};
      reqData.plate = data.plate;
      reqData.plateColor = data.plateColor;
      var deferred = $q.defer();
      $http({
          url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_DETAIL,
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

    let updateWhite = function (data) {
      var reqData = {};
      reqData.userCode = data.userCode;
      reqData.userName = data.userName;
      reqData.plate = data.plate;
      reqData.plateColor = data.plateColor;
      reqData.parklotCodes = data.parklotCodes;
      reqData.startTime = data.startTime;
      reqData.endTime = data.endTime;
      reqData.description = data.description;
      reqData.opUser = sessionCache.getUserCode();
      let deferred = $q.defer();
      $http({
          url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_EDIT,
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

    var delWhite = function(data){
      var deferred = $q.defer();
      var reqData = [];
      reqData = data;
      $http({
          url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_DELETE,
          method: 'DELETE',
          data: reqData,
          headers: { 'Content-Type': 'application/json; charset=UTF-8'}
      }).success(function (resp) {
          deferred.resolve(resp);
      }).error(function () {
          deferred.reject(errorMsg);
      });
      return deferred.promise;
    };

    var reqCountAdd = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.vehicleInsertList = data.vehicleInsertList;
        reqData.opUser = sessionCache.getUserCode();
        $http({
            method: 'POST',
            url: Setting.lotUrl.WHITELISTCAR.WHITELISTCAR_COUNT_ADD,
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
			reqPagination: function(data) {
				return reqPagination(data);
			},
			reqDetail: function(data) {
				return reqDetail(data);
			},
			addlist: function(data) {
				return addlist(data);
			},
			updateWhite: function(data) {
				return updateWhite(data);
			},
			delWhite: function(data) {
				return delWhite(data);
			},
			reqCountAdd: function(data) {
				return reqCountAdd(data);
			},
		}
	}
]);