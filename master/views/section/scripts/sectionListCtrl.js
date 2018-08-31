'use strict';

angular.module("parkingApp").controller('SectionListCtrl',
    function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, sectionService, StateName, sessionCache, $timeout) {
        var indexId = "#section-index";
        var tableId = indexId + " #section-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.stateGoDetail = StateName.section.detail;
        $scope.stateGoEdit = StateName.section.edit;
        $scope.stateGoAdd = StateName.section.add;
        $scope.stateGoBind = StateName.section.bind;
        $scope.formData = {};

        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        };

        //$scope.sectionTypeOption = sessionCache.getSectionTypeGroup();
        //$scope.bindingStatusOption = sessionCache.getBindingStatusGroup();

        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, settings) {
                    if ($scope.formData.sectionCode) {
                        data.sectionCode = $scope.formData.sectionCode;
                    }
                    if ($scope.formData.name) {
                        data.name = $scope.formData.name;
                    }
                    sectionService.reqPagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "sectionCode"},
                    {"data": "name"},
                    {"data": "address"},
                    {"data": "lat"},
                    {"data": "lng"},
                    {"data": "berthNum"},
                    {"data": "isOp"},
                    {"data": "sysTime","render":function(data, type, full){
                        var _date = new Date(data);
                        return _date.format("yyyy-MM-dd hh:mm:ss");
                    }}
                ],
                "rowCallback": function (nRow, aData, iDisplayIndex) {
                    $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                    $('td:eq(7)', nRow).html(sessionCache.getIsOpType(aData.isOp));
                    return nRow;
                },
                "drawCallback": function () {
                    customerService.initUniform(tableId);
                }
            }));
        };

        $scope.toSearch = function () {
            reload();

        };
        $scope.toReset = function () {
            $scope.formData.sectionCode = "";
            $scope.formData.name = "";
            reload();
        };

        $scope.toDetail = function () {
            var count = 0;
            var aData;
            $(checkboxesCls).each(function () {
                if ($(this).prop("checked")) {
                    nRow = $(this).parents('tr')[0];
                    aData = oTable.fnGetData(nRow);
                    count++;
                }
            });
            if (count === 1) {
                $state.go($scope.stateGoDetail, {sectionCode: aData.sectionCode});
            } else {
                customerService.openDetailConfirmModal();
            }
        };

        //$scope.toEdit = function () {
        //    var count = 0;
        //    var aData;
        //    $(checkboxesCls).each(function () {
        //        if ($(this).prop("checked")) {
        //            nRow = $(this).parents('tr')[0];
        //            aData = oTable.fnGetData(nRow);
        //            count++;
        //        }
        //    });
        //    if (count === 1) {
        //        $state.go($scope.stateGoEdit, {sectionCode: aData.sectionCode});
        //    } else {
        //        customerService.openDetailConfirmModal();
        //    }
        //};

        //$scope.toDelete = function () {
        //    var count = 0;
        //    var aData = {};
        //    $(checkboxesCls).each(function () {
        //        if ($(this).prop("checked")) {
        //            nRow = $(this).parents('tr')[0];
        //            aData = oTable.fnGetData(nRow);
        //            count++;
        //        }
        //    });
        //    if (count === 1) {
        //        customerService.modalInstance().result.then(function (message) {
        //            var data = {};
        //            data.sectionCode = aData.sectionCode;
        //            sectionService.reqDelete(data).then(function (resp) {
        //                if (resp.data) {
        //                    growl.addInfoMessage("删除成功！", {ttl: 2000});
        //                    reload();
        //                } else {
        //                    growl.addInfoMessage(resp.msg, {ttl: 2000});
        //                }
        //            }, function (msg) {
        //                growl.addInfoMessage(msg, {ttl: 2000});
        //            });
        //        }, function () {
        //            $log.debug('Modal dismissed at: ' + new Date());
        //        });
        //    } else {
        //        customerService.openDeleteConfirmModal();
        //    }
        //};

        $timeout(function () {
            initTable();
        }, 0);

    });
