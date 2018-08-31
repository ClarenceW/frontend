'use strict';
angular.module('parkingApp').controller('parkpayrecordDetailCtrl', ['$scope', '$state', 'StateName', 'sessionCache', 'Setting', 'parkpayrecordService', 'growl', 'passcarService', '$timeout', 'alreadypaytradeService', '$filter',
    function ($scope, $state, StateName, sessionCache, Setting, parkpayrecordService, growl, passcarService, $timeout, alreadypaytradeService, $filter) {
        $scope.formData = {};
        $scope.stateGoIndex = StateName.parkpayrecord.index;
        $scope.passcar = false;
        $scope.payrecord = false;
        $scope.coupon = false;
        var detailId = "#parkpayrecord-detail";
        var passcarTableId = detailId + " #pass-car-table";
        var payRecordTableId = detailId + " #pay-record-table";
        var couponRecordTableId = detailId + " #coupon-record-table";
        parkpayrecordService.reqDetail($state.params.recordId).then(function (res) {
            var dto = res;
            fillForm(dto);
        }, function (msg) {
            growl.addErrorMessage(msg, {
                ttl: 2000
            });
        });

        function fillForm(dto) {
            $scope.formData.plate = dto.plate;
            $scope.formData.opUser = dto.opUser;
            $scope.formData.userCode = dto.userCode;
            $scope.formData.recordId = dto.recordId;
            $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR', dto.plateColor);
            $scope.formData.payType = dto.payType;
            $scope.formData.paytype = sessionCache.getLookupValueByLookupName('PARKING_PAY_TYPE', dto.payType);
            $scope.formData.parklotName = dto.parklotName;
            $scope.formData.paySrc = sessionCache.getLookupValueByLookupName('PARKING_PAY_PLATFORM', dto.chargePlat);
            $scope.formData.chargePlat = dto.chargePlat;
            $scope.formData.chargeplat = sessionCache.getLookupValueByLookupName('PARKING_PAY_PLATFORM', dto.chargePlat);
            $scope.formData.thirdSn = dto.thirdSn;
            $scope.formData.traId = dto.traId;
            $scope.formData.payTime = dto.payTime;
            $scope.formData.payMoney = dto.payMoney;
            $scope.formData.payableMoney = dto.payableMoney;
            $scope.formData.discountMoney = dto.discountMoney;
            $scope.formData.discountCoupon = dto.discountCoupon;
        }

        $scope.toPasscarRecord = function () {
            var oTable = null;
            var initTable = function () {
                oTable = $(passcarTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                    "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                    "ajax": function (data, callback, settings) {
                        parkpayrecordService.reqPasscarrecord($scope.formData).then(function (resp) {
                            callback(resp)
                        }, function (msg) {
                            growl.addErrorMessage(msg, {
                                ttl: 2000
                            });
                        });
                    },
                    "columns": [{
                            "data": "recordId"
                        },
                        {
                            "data": "plate"
                        },
                        {
                            "data": "parklotName"
                        },
                        {
                            "data": "laneName"
                        },
                        {
                            "data": "parkDirection",
                            "render": function (data, type, full) {
                                var parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION', data);
                                return parkDirection;
                            }
                        },
                        {
                            "data": "passType",
                            "render": function (data, type, full) {
                                var passType = sessionCache.getLookupValueByLookupName('PASS_TYPE', data);
                                return passType;
                            }
                        },
                        {
                            "data": "passTime",
                            "render": function (data, type, full) {
                                if (data) {
                                    var _date = new Date(data);
                                    return _date.format("yyyy-MM-dd hh:mm:ss");
                                } else {
                                    return "";
                                }
                            },
                        },
                    ],
                }));
            };
            if ($scope.passcar === true) {
                $scope.passcar = false;
            } else {
                $scope.passcar = true;
                $timeout(function () {
                    initTable();
                });
            }
        };

        $scope.toPayRecord = function () {
            var oTable = null;
            var initTable = function () {
                oTable = $(payRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                    "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                    "ajax": function (data, callback, settings) {
                        parkpayrecordService.reqPayRecord($scope.formData).then(function (resp) {
                            callback(resp)
                        }, function (msg) {
                            growl.addErrorMessage(msg, {
                                ttl: 2000
                            });
                        });
                    },
                    "columns": [{
                            "data": "traId"
                        },
                        {
                            "data": "parklotName"
                        },
                        {
                            "data": "orderMoney",
                            "render": function (data, type, full) {
                                let _data = $filter("currency")(data);
                                return _data;
                            }
                        },
                        {
                            "data": "createTime",
                            "render": function (data, type, full) {
                                if (data) {
                                    var _date = new Date(data);
                                    return _date.format("yyyy-MM-dd hh:mm:ss");
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "data": "status",
                            "render": function (data, type, full) {
                                var status = sessionCache.getLookupValueByLookupName('ORDER_STATUS', data);
                                return status;
                            }
                        },

                    ],
                }));
            };
            if ($scope.payrecord === true) {
                $scope.payrecord = false;
            } else {
                $scope.payrecord = true;
                $timeout(function () {
                    initTable();
                });
            }
        };

        $scope.toCouponRecord = function () {
            var oTable = null;
            var initTable = function () {
                oTable = $(couponRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                    "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                    "ajax": function (data, callback, settings) {
                        parkpayrecordService.reqCouponRecord($scope.formData.recordId).then(function (resp) {
                            callback(resp)
                        }, function (msg) {
                            growl.addErrorMessage(msg, {
                                ttl: 2000
                            });
                        });
                    },
                    "columns": [{
                            "data": "recordId"
                        },
                        {
                            "data": "parklotName"
                        },
                        {
                            "data": "userCode"
                        },
                        {
                            "data": "couponType",
                            "render": (data, type, full) => {
                                let couponType = sessionCache.getLookupValueByLookupName('COUPON_RULE_TYPE', data);
                                return couponType || '';
                            }
                        },
                        {
                            "data": "activityName"
                        },
                        {
                            "data": "couponPrice"
                        },
                        {
                            "data": "usedTime",
                            "render": function (data, type, full) {
                                if (data) {
                                    var _date = new Date(data);
                                    return _date.format("yyyy-MM-dd hh:mm:ss");
                                } else {
                                    return "";
                                }
                            }
                        }

                    ],
                }));
            };
            if ($scope.couponrecord === true) {
                $scope.couponrecord = false;
            } else {
                $scope.couponrecord = true;
                $timeout(function () {
                    initTable();
                });
            }
        };

        $scope.back = function () {
            $state.go($scope.stateGoIndex, {
                params: $state.params.params,
                flg: 1
            });
        }

    }
]);