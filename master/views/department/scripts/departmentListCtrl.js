'use strict';
angular.module("parkingApp").controller('departmentListCtrl',
    //["$rootScope", "$scope", "$http", "$state", "growl", "Setting", "$log", "customerService", "roleService"]
    function ($timeout, $rootScope, $scope, $http, $state, growl, Setting, $log, customerService, StateName, sessionCache, departmentService) {
        var indexId = "#department-index";
        var tableId = indexId + " #department-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.formData = {};
        $scope.stateGoDetail = StateName.user.detail;
        $scope.stateGoEdit = StateName.user.edit;
        // $scope.stateGoAdd = StateName.user.add;
        $scope.stateGoIndex = StateName.user.index;

        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, true);
            }
        };

        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, settings) {
                    if ($scope.formData.userCode) {
                        data.userCode = $scope.formData.userCode;
                    }
                    departmentService.reqUserPagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "departmentnum"},
                    {"data": "departmentname"},
                    {"data": "updepartment"},
                    {"data": "mark"},
                    {"data": "createtime"}
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
            $scope.formData.userCode = "";
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
                $state.go($scope.stateGoDetail, {userCode: aData.userCode});
            } else {
                customerService.openDetailConfirmModal();
            }
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
                $state.go($scope.stateGoEdit, {userCode: aData.userCode});
            } else {
                customerService.openDetailConfirmModal();
            }
        };

        $scope.toDelete = function () {
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
                customerService.modalInstance().result.then(function (message) {
                    var data = {};
                    data.userCode = aData.userCode;
                    userService.delSysUser(data).then(function (msg) {
                        if (msg) {
                            growl.addInfoMessage("删除成功！", {ttl: 2000});
                            reload();
                        } else {
                            growl.addInfoMessage("删除失败！", {ttl: 2000});
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