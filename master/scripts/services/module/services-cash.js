'use strict';

appService.factory("cashService",
    function ($q, $http, Setting, $log, sessionCache) {
        var errorMsg = "数据加载异常...";

        /*现金对账-收费记录*/
        var reqCachPagination = function (data) {
            var reqData = {};
            reqData.type = data.type;
            reqData.userCode = data.userCode;
            reqData.startTime = data.startTime;
            reqData.endTime = data.endTime;
            reqData.start = data.start;
            reqData.length = data.length;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CHARGE_PAGINATION,
                method: 'GET',
                params: reqData
            }).success(function (resp) {
                if (resp && resp.aaData) {
                    deferred.resolve(resp);
                } else {
                    deferred.reject(errorMsg);
                }
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }

        /*现金对账-收费记录列表*/
        var reqCachList = function (data) {
            var reqData = {};
            reqData.cashVerifyId = data;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CHARGE_LIST,
                method: 'GET',
                params: reqData
            }).success(function (resp) {
                if (resp && resp.aaData) {
                    deferred.resolve(resp);
                } else {
                    deferred.reject(errorMsg);
                }
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }

        /*收费记录*/
        var reqChargePagination = function (data) {
            var reqData = {};
            reqData.scheduleDate = data.scheduleDate;
            reqData.orderCode = data.orderCode;
            reqData.recordCode = data.recordCode;
            reqData.pdaUserCode = data.pdaUserCode;
            reqData.pkPlate = data.pkPlate;
            reqData.orderType = data.orderType;
            reqData.start = data.start;
            reqData.length = data.length;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CHARGE_PAGINATION,
                method: 'GET',
                params: reqData
            }).success(function (resp) {
                if (resp && resp.aaData) {
                    deferred.resolve(resp);
                } else {
                    deferred.reject(errorMsg);
                }
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }
        /*收费记录-详情*/
        var reqChargeDetail = function (data) {
            var reqData = {};
            reqData.code = data;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CHARGE_DETAIL,
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
        }
        /*收费记录-取证记录详情*/
        var reqEvidenceChargeDetail = function (data) {
            var reqData = {};
            reqData.parkingRecordCode = data;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.EVIDENCE_CHARGE_DETAIL,
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
        }
        /*收费记录-停车记录详情*/
        var reqParkingChargeDetail = function (data) {
            var reqData = {};
            reqData.parkingRecordCode = data;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.PARKING_CHARGE_DETAIL,
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
        }

        /*差额对账*/
        var reqChargeDiffPagination = function (data) {
            var reqData = {};
            reqData.userCode = data.userCode;
            reqData.startTime = data.startTime;
            reqData.endTime = data.endTime;
            reqData.start = data.start;
            reqData.length = data.length;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CASHVERIFY_PAGINATION,
                method: 'GET',
                params: reqData
            }).success(function (resp) {
                if (resp && resp.aaData) {
                    deferred.resolve(resp);
                } else {
                    deferred.reject(errorMsg);
                }
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }
        /*差额对账-详情*/
        var reqDiffDetail = function (id) {
            var deferred = $q.defer();
            var reqData = {};
            reqData.id = id;
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CASHVERIFY_DETAIL,
                method: 'get',
                params: reqData
            }).success(function (resp) {
                deferred.resolve(resp);
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }

        /*新增交账记录*/
        var reqAddcashverify = function (data) {
            var reqData = {};
            reqData.userCode = data.userCode;
            reqData.cashId = data.cashId;
            reqData.payMoney = data.payMoney;
            reqData.payableMoney = data.payableMoney;
            reqData.descritption = data.descritption;
            reqData.opUser = data.opUser;
            reqData.startChargeDate = data.startTime;
            reqData.endChargeDate = data.endTime;
            var deferred = $q.defer();
            $http({
                url: Setting.lotUrl.CASHRECORD.ORDER_CASHVERIFY_ADD,
                method: 'POST',
                data: reqData,
            }).success(function (resp) {
                if (resp && resp.data) {
                    deferred.resolve(resp);
                } else {
                    deferred.reject(errorMsg);
                }
            }).error(function () {
                deferred.reject(errorMsg);
            });
            return deferred.promise;
        }


        /* 现金对账-收费记录-excel导出 */
        let chargeReportExcel = function (data, index) {
            let reqData = {};
            reqData.type = data.type;
            reqData.userCode = data.userCode;
            reqData.startTime = data.startTime;
            reqData.endTime = data.endTime;
            let url = '';
            if (index === 1) {
                reqData.start = 0;
                reqData.length = 10;
                url = Setting.lotUrl.CASHRECORD.ORDER_CHARGE_EXCEL_COUNT;
            } else if (index === 2) {
                reqData.start = data.start;
                reqData.length = data.length;
                url = Setting.lotUrl.CASHRECORD.ORDER_CHARGE_EXCEL;
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

        /* 现金对账-交账记录-excel导出 */
        let verifyRecordExcel = function (data, index) {
            let reqData = {};
            reqData.userCode = data.userCode;
            reqData.startTime = data.startTime;
            reqData.endTime = data.endTime;
            let url = '';
            if (index === 1) {
                reqData.start = 0;
                reqData.length = 10;
                url = Setting.lotUrl.CASHRECORD.ORDER_CASHVERIFY_EXCEL_COUNT;
            } else if (index === 2) {
                reqData.start = data.start;
                reqData.length = data.length;
                url = Setting.lotUrl.CASHRECORD.ORDER_CASHVERIFY_EXCEL;
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

        return {
            /*现金对账*/
            reqCachPagination: function (data) {
                return reqCachPagination(data);
            },
            /*现金对账-收费记录列表*/
            reqCachList: function (data) {
                return reqCachList(data);
            },

            /*差额记录*/
            reqChargeDiffPagination: function (data) {
                return reqChargeDiffPagination(data);
            },
            /*差额记录-详情*/
            reqDiffDetail: function (data) {
                return reqDiffDetail(data);
            },
            /*收费记录*/
            reqChargePagination: function (data) {
                return reqChargePagination(data);
            },
            /*收费记录-详情*/
            reqChargeDetail: function (data) {
                return reqChargeDetail(data);
            },
            /*收费记录-详情-取证记录*/
            reqEvidenceChargeDetail: function (data) {
                return reqEvidenceChargeDetail(data);
            },
            /*收费记录-详情-停车记录*/
            reqParkingChargeDetail: function (data) {
                return reqParkingChargeDetail(data);
            },
            /*新增交账记录*/
            reqAddcashverify: function (data) {
                return reqAddcashverify(data);
            },

            /**excel导出 **/
            /* 现金对账-收费记录*/
            chargeReportExcel: function (data, index) {
                return chargeReportExcel(data, index);
            },
            /* 现金对账-交账记录*/
            verifyRecordExcel: function (data, index) {
                return verifyRecordExcel(data, index);
            },
        }
    });
