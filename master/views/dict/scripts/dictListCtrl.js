'use strict';

angular.module("parkingApp").controller('DictListCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, dictService, $timeout, StateName) {

    var indexId = "#dict-index";
    var tableId = indexId + " #dict-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.formData = {};
    $scope.stateGoDetail = StateName.dict.detail;
    $scope.stateGoEdit = StateName.dict.edit;
    $scope.stateGoAdd = StateName.dict.add;
    $scope.stateGoIndex = StateName.dict.index;

    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    };

    var initTable = function () {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, setting) {
                if ($scope.formData.lookupname || $scope.formData.lookupkey) {
                    data.lookupName = $scope.formData.lookupname;
                    data.lookupKey = $scope.formData.lookupkey;
                }
                dictService.reqPagination(data).then(function (resp) {
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                //{"defaultContent": ""},
                {"data": "lookupName"},
                {"data": "lookupKey"},
                {"data": "lookupValue"},
                {"data": "description"},
                {"data": "sysTime"},
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                // $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
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
        $scope.formData.lookupname = '';
        $scope.formData.lookupkey = '';
        reload();
    };

    //$scope.toDetail = function () {
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
    //        $state.go($scope.stateGoDetail, {lookupName: aData.lookupName, lookupKey: aData.lookupKey});
    //    } else {
    //        customerService.openDetailConfirmModal();
    //    }
    //};
    //
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
    //        $state.go($scope.stateGoEdit, {lookupName: aData.lookupName, lookupKey: aData.lookupKey});
    //    } else {
    //        customerService.openEditConfirmModal();
    //    }
    //};
    //
    //$scope.toDelete = function () {
    //    var count = 0;
    //    var aData;
    //    $(checkboxesCls).each(function () {//data-set="tableId+ " .checkboxes""
    //        if ($(this).prop("checked")) {
    //            nRow = $(this).parents('tr')[0];
    //            aData = oTable.fnGetData(nRow);
    //            count++;
    //        }
    //    });
    //    if (count === 1) {
    //        customerService.modalInstance().result.then(function (message) {
    //            var data = {};
    //            data.lookupKey = aData.lookupKey;
    //            data.lookupName = aData.lookupName;
    //            dictService.reqDelete(data).then(function (msg) {
    //                growl.addInfoMessage(msg, {ttl: 2000});
    //                reload();
    //            }, function (msg) {
    //                growl.addInfoMessage(msg, {ttl: 2000});
    //            });
    //        }, function () {
    //            $log.debug('Modal dismissed at: ' + new Date());
    //        });
    //    } else {
    //        customerService.openDeleteConfirmModal();
    //    }
    //}
    
    $timeout(function () {
        initTable();
    }, 0);

});