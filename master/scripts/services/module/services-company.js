'use strict';

appService.factory("companyService",['$q', '$http', 'Setting', '$log','sessionCache', 
	function ($q, $http, Setting, $log,sessionCache) {

    var errorMsg = "数据加载异常...";
    var updateCompany = function (data) {
        var reqData = {};
        reqData.code = data.code;
        reqData.name = data.name;
        reqData.address = data.address;
        reqData.description = data.description;
        reqData.lat =data.lat;
        reqData.lng = data.lng;
        reqData.legalPerson = data.legalPerson;
        reqData.opType = data.opType;
        reqData.buisnessLicPic = data.buisnessLicPic;
        reqData.contacts = data.contacts;
        reqData.contactNumber = data.contactNumber;
        reqData.email = data.email;
        reqData.opUser = sessionCache.getUserCode();
        var deferred = $q.defer();
        $http({
            method: 'put',
            url: Setting.lotUrl.COMPANYS.COMPANYS_UPDATE,
            data: reqData,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve("运营公司修改成功！");
            } else {
                deferred.reject(resp.msg);
            }
        }).error(function () {
            deferred.reject(errorMsg)
        });
        return deferred.promise;
    };

    var reqDetail = function () {
        var reqData = {};
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.COMPANYS.COMPANYS_DETAIL,
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
        updateCompany: function (data) {
            return updateCompany(data);
        },
        reqDetail: function () {
            return reqDetail();
        }
    }
}]);
