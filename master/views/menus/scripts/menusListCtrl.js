'use strict';

angular.module("parkingApp").controller('MenusListCtrl',
    function ($timeout, $rootScope, $scope, $http, $state, growl, Setting, $log, customerService, menuService, StateName, sessionCache) {
        var indexId = "#menusManage-index";
        var tableId = indexId + " #menusManage-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        var data = {};
        $scope.stateGoDetail = StateName.menu.detail;
        $scope.stateGoEdit = StateName.menu.edit;
        $scope.stateGoAdd = StateName.menu.add;
        $scope.formData = {};
        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        };

        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, settings) {
                    if ($scope.formData.menuName) {
                        data.menuName = $scope.formData.menuName;
                    }
                    menuService.reqPagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "menuName"},
                    {"data": "menuUrl"},
                    {"data": "menuIcon"},
                    {"data": "menuSort"},
                    {"data": "opUser"},
                    {"data": "sysTime"}
                ],

                "rowCallback": function (nRow, aData, iDisplayIndex) {
                    $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
                    return nRow;
                },
                "drawCallback": function () {
                    customerService.initUniform(tableId);
                    customerService.initTitle();
                }
            }));
        };

        $scope.toSearch = function () {
            reload();

        };
        $scope.toReset = function () {
            $scope.formData.menuName = "";
            reload();
        };

        $scope.toEdit = function () {
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
                $state.go($scope.stateGoEdit, {menuCode: aData.menuCode});
            } else {
                customerService.openDetailConfirmModal();
            }
        };

        $scope.toDelete = function () {
            var count = 0;
            var aData = {};
            $(checkboxesCls).each(function () {
                if ($(this).prop("checked")) {
                    nRow = $(this).parents('tr')[0];
                    aData = oTable.fnGetData(nRow);
                    count++;
                }
            });
            if (count === 1) {
                customerService.modalInstance().result.then(function (message) {
                    var data = {};
                    data.menuCode = aData.menuCode;
                    menuService.reqDelete(data).then(function (resp) {
                        if (resp.data) {
                            growl.addInfoMessage("删除成功！", {ttl: 2000});
                            reload();
                        } else {
                            growl.addInfoMessage(resp.msg, {ttl: 2000});
                        }
                    }, function (msg) {
                        growl.addInfoMessage(msg, {ttl: 2000});
                    });
                }, function () {
                    $log.debug('Modal dismissed at: ' + new Date());
                });
            } else {
                customerService.openDeleteConfirmModal();
            }
        };

        $timeout(function () {
            initTable();
        }, 0);

    });
