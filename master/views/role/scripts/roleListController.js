'use strict';

angular.module("parkingApp").controller('roleListController',
    //["$rootScope", "$scope", "$http", "$state", "growl", "Setting", "$log", "customerService", "roleService"],
    function ($rootScope, $scope, $http, $state, growl, Setting, $log, customerService, roleService, StateName,$timeout,parklotsService,sessionCache) {

        var indexId = "#role-index";
        var tableId = indexId + " #role-table";
        var checkboxesCls = tableId + " .checkboxes";
        var oTable = null;
        var nRow = null, aData = null;
        $scope.formData = {};
        $scope.stateGoDetail = StateName.role.detail;
        $scope.stateGoEdit = StateName.role.edit;
        $scope.stateGoAdd = StateName.role.add;
        $scope.parklotOption = sessionCache.getDictsByLookupName("DCLOT_OP");
        $scope.formData.parklotPermission = false;
        $scope.formData.roleCode = '';

        parklotsService.reqListAll().then(function(resp) {
          $scope.parklotCodeOptions = resp;
        });

        var reload = function () {
            if (customerService.isDataTableExist(tableId)) {
                oTable.api().ajax.reload(null, false);
            }
        }

        var initTable = function () {
            oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "ajax": function (data, callback, settings) {
                    if ($scope.formData.roleName) {
                        data.roleName = $scope.formData.roleName;
                    }
                    roleService.reqRolePagination(data).then(function (resp) {
                        callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                "columns": [
                    {"defaultContent": ""},
                    {"data": "roleName"},
                    {"data": "menuNames"},
                    {"data": "opUser"},
                    {"data": "memo"},
                    {"data": "sysTime","render":function(data, type, full){
                        var _date = new Date(data);
                        return _date.format("yyyy-MM-dd");
                    }},
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
        }

        $scope.toSearch = function () {
            reload();
        };
        $scope.toReset = function () {
            $scope.formData.roleName = "";
            reload();
        }

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
                    var roleCode = aData.roleCode;
                    roleService.delRole(roleCode).then(function (resp) {
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
                $state.go($scope.stateGoEdit, {roleCode: aData.roleCode});
            } else {
                customerService.openDetailConfirmModal();
            }
        };

        $scope.toConfirm = function () {
          var data = {};
          data.roleCode = $scope.formData.roleCode;
          data.parklotCodes = $scope.formData.parklotCodes;
          if($scope.formData.parklotCodes.length == $scope.parklotCodeOptions.length) {
            $scope.formData.parklotPermission = true;
          }else {
            $scope.formData.parklotPermission = false;
          }
          data.parklotPermission = $scope.formData.parklotPermission;
          roleService.updatePermission(data).then(function (resp) {
              if (resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                  growl.addInfoMessage("配置成功！", {ttl: 2000});
              } else {
                  growl.addInfoMessage(resp.msg, {ttl: 2000});
              }
          }, function (msg) {
              growl.addInfoMessage(msg, {ttl: 2000});
          });
        };

        $scope.toFixpermission = function () {
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
                var roleCode = aData.roleCode;
                $scope.formData.roleCode = aData.roleCode;
                roleService.getPermissionByCode(roleCode).then(function (resp) {
                    if (resp.data && resp.code === Setting.ResultCode.CODE_SUCCESS) {
                      $scope.formData.parklotPermission = resp.data.parklotPermission;
                      if(!resp.data.parklotPermission) {
                        $scope.formData.parklotCodes = resp.data.parklotCodes;
                      }
                      $timeout(function() {
                        if(resp.data.parklotPermission) {
                          $('.selectpicker').selectpicker('selectAll');
                        }
                        $('.selectpicker').selectpicker({
                          'selectAllText':'全选',
                          'deselectAllText':'取消全选'
                        }).selectpicker('render');
                      },300);
                    } else {
                        growl.addInfoMessage(resp.msg, {ttl: 2000});
                    }
                }, function (msg) {
                    growl.addInfoMessage(msg, {ttl: 2000});
                });
                $scope.myModal = "myModal";
                $timeout(function() {
                  $scope.myModal = "";
                },300);
            } else {
                customerService.openFixConfirmModal();
            }
        };
        initTable();
    });