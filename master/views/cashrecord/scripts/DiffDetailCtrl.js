'use strict';

angular.module('parkingApp').controller('DiffDetailCtrl',
    function ($rootScope, $scope, $http, $state, growl, Setting, StateName, sessionCache, $timeout,$filter,cashService) {

    $scope.formData = {};
    $scope.parkingRecord = false;
    $scope.evidenceRecord = false;
    var detailId = "#diff-detail";
    // var parkingRecordTableId = detailId + " #diff-parking-table";
    var evidenceRecordTableId = detailId + " #diff-evidence-table";

    $scope.stateGoCashIndex = StateName.cashrecord.indexY;
    $scope.stateGoDiffIndex = StateName.cashrecord.diffIndex;

    cashService.reqDiffDetail($state.params.id).then(function (dto) {
        fillForm(dto.data);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.userCode = dto.userCode ;
        $scope.formData.payableMoney = $filter('currency')(dto.payableMoney);
        $scope.formData.payMoney = $filter('currency')(dto.payMoney); 
        $scope.formData.diffMoney = $filter('currency')(dto.diffMoney);
        $scope.formData.startChargeDate = dto.startChargeDate;
        $scope.formData.endChargeDate = dto.endChargeDate ;
        $scope.formData.opUser = dto.opUser;
        $scope.formData.opTime = dto.opTime;
    };

    $scope.toEvidence = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(evidenceRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                // "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                    var data = {};
                    data.type = 1;
                    data.userCode = $scope.formData.userCode;
                    data.parklotName = $scope.formData.parklotName;
                    data.startTime = $scope.formData.startChargeDate;
                    data.endTime = $scope.formData.endChargeDate;
                    data.start = 0;
                    data.length = 10;
                    cashService.reqCachPagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"data": "userCode"},
                    {"data": "receivableMoney",'render':function (data, type, full) {
                        return $filter('currency')(data);
                    }},
                    {"data": "actualMoney",'render':function (data, type, full) {
                        return $filter('currency')(data);
                    }},
                    {"data": "chargeDate"},
                    {"data": "status",'render':function (data, type, full) {
                       return sessionCache.getLookupValueByLookupName('CASH_STATUS',data);
                    }},
                    {"data": "opUser"},
                    {
                      "data": "opTime", "render": function (data, type, full) {
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
        if ($scope.evidenceRecord === true) {
            $scope.evidenceRecord = false;

        } else {
            $scope.evidenceRecord = true;
            $timeout(function () {
                initTable();
            });
        }
    };

});