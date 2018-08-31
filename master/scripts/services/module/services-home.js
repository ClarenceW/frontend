'use strict';
appService.factory("homeService", function ($q, $http, Setting, $log) {
    var errorMsg = "数据加载异常...";
    /*数据看板--营业额*/
    var reqBlockAlreadypay = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_ALREADYPAY_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    /*数据看板--泊位*/
    var reqBlockRacharge = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_BERTH_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*数据看板--当前泊位信息*/
    var reqBlockBerthMes = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.parklotCode= data.parklotCode;
        $http({
            url: Setting.lotUrl.HOME.PARK_OPERATE_BERTHCHANGE,
            method: 'GET',
            params:reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*数据看板--订单*/
    var reqBlockOrder = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_PAYOREDER_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*数据看板--会员车/绑定车*/
    var reqBlockVipTemp = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_VIP_BIND,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*数据看板--异常抬杆*/
    var reqBlockExtPass = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_EXT_PASS,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*数据看板--累计停车*/
    var reqBlockParkingAll = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_PARKING_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    /*数据看板--当日停车*/
    var reqBlockParkingDay = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_PARKING_DAY,
            method: 'GET'
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    /*数据看板--昨日停车*/
    var reqBlockParkingYes = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_PARKING_YES,
            method: 'GET'
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };
    /*数据看板--当月停车*/
    var reqBlockParkingMonth = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.BLOCK_PARKING_MOUTH,
            method: 'GET'
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--当天收费总额*/
    var reqParkChargeAll = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.PARK_CHARGE_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--当天充值总额*/
    var reqParkRechargeAll = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.PARK_RECHARGE_ALL,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--收费方式/收费渠道*/
    var reqParkChargeWay = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.PARK_CHARGE_WAY,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--充值方式/充值渠道*/
    var reqParkRechargeWay = function () {
        var deferred = $q.defer();
        $http({
            url: Setting.lotUrl.HOME.PARK_RECHARGE_WAY,
            method: 'GET'
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--不同时段停车收费趋势图*/
    var reqParkChargeTimes = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.parklotCode= data.parklotCode;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_CHARGE_TIMES_DAY;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_CHARGE_TIMES_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车收费--收费总额排名*/
    var reqParkChargeSort = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.sortType= data.sortType;
        reqData.sortNum= data.sortNum;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_CHARGE_SORT_DAY;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_CHARGE_SORT_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--泊位利用率*/
    var reqBerthUseRate = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.parklotCodeList= data.parklotCodeList;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_USERATE_WEEK;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_USERATE_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--泊位周转率*/
    var reqBerthTurnRate = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.parklotCodeList= data.parklotCodeList;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHTURN_WEEK;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHTURN_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--泊位变化*/
    var reqBerthChange = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.parklotCode= data.parklotCode;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHCHANGE_DAY;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHCHANGE_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--过车数量*/
    var reqPassNum = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        var url;
        reqData.parklotCode= data.parklotCode;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_PASSNUM_DAY;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_PASSNUM_MON;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
             if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                 deferred.resolve(resp);
             } else {
                 deferred.reject(errorMsg);
             }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--泊位利用率--详情*/

    var reqBerthUseDetail = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.parklotCodeList= data.parklotCodeList;
        var url;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_USERATE_DETAIL_WEEK;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_USERATE_DETAIL_MONTH;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                deferred.resolve(resp);
            } else {
                deferred.reject(errorMsg);
            }
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    /*停车运营--泊位周转率--详情*/
    var reqBerthTurnDetail = function (data) {
        var deferred = $q.defer();
        var reqData = {};
        reqData.parklotCodeList= data.parklotCodeList;
        var url;
        if(data.index == 1) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHTURN_DETAIL_WEEK;
        }else if(data.index == 2) {
          url = Setting.lotUrl.HOME.PARK_OPERATE_BERTHTURN_DETAIL_MONTH;
        }
        $http({
            url: url,
            method: 'GET',
            params: reqData
        }).success(function (resp) {
            if (resp && resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
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
        reqBlockAlreadypay : function(){
            return reqBlockAlreadypay();
        },
        reqBlockRacharge : function(){
            return reqBlockRacharge();
        },
        reqBlockBerthMes : function(data){
            return reqBlockBerthMes(data);
        },
        reqBlockOrder : function(){
            return reqBlockOrder();
        },
        reqBlockVipTemp : function(){
            return reqBlockVipTemp();
        },
        reqBlockParkingAll : function(){
            return reqBlockParkingAll();
        },
        reqBlockParkingDay : function(){
            return reqBlockParkingDay();
        },
        reqBlockParkingYes : function(){
            return reqBlockParkingYes();
        },
        reqBlockParkingMonth : function(){
            return reqBlockParkingMonth();
        },
        reqParkChargeAll : function(){
            return reqParkChargeAll();
        },
        reqParkRechargeAll : function(){
            return reqParkRechargeAll();
        },
        reqParkChargeWay : function(){
            return reqParkChargeWay();
        },
        reqParkRechargeWay : function(){
            return reqParkRechargeWay();
        },
        reqParkChargeTimes : function(data){
            return reqParkChargeTimes(data);
        },
        reqParkChargeSort : function(data){
            return reqParkChargeSort(data);
        },
        reqBerthUseRate : function(data){
            return reqBerthUseRate(data);
        },
        reqBerthTurnRate : function(data){
            return reqBerthTurnRate(data);
        },
        reqBerthChange : function(data){
            return reqBerthChange(data);
        },
        reqPassNum : function(data){
            return reqPassNum(data);
        },
        reqBerthUseDetail : function(data){
            return reqBerthUseDetail(data);
        },
        reqBerthTurnDetail : function(data){
            return reqBerthTurnDetail(data);
        },
        reqBlockExtPass : function(){
            return reqBlockExtPass();
        },
    }
});
