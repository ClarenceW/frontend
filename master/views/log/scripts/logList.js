'use strict';

angular.module("parkingApp").controller('LogListController', function ($timeout, $rootScope, $scope, $http, $state, $uibModal, Setting, customerService, $log, logService, growl, sessionCache) {

    var indexId = "#log_index";
    var tableId = indexId + " #log_table";
    var checkboxesCls = tableId + " .checkboxes";

    var oTable = null;
    var nRow = null, aData = null;
    $scope.formData = {};
    $scope.tempData = {};
    $scope.dt = null;
    $scope.tempData.dt = new Date();
    $scope.logTypeOptions = [
      {
        "lookupKey":"1",
        "lookupValue":"登录"
      },
      {
        "lookupKey":"2",
        "lookupValue":"登出"
      }
    ];

    $scope.format = "yyyy-MM-dd";

    $scope.open = function () {
        $scope.tempData.opened = true;
    };

    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return false;
    }

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2025, 12, 31),
        minDate: new Date(2015, 1, 1),
        startingDay: 1
    };

    function initTable() {
        var table = $("#log_table");
        oTable = table.dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.tempData.logType) {
                    data.logType = $scope.tempData.logType;
                }
                if ($scope.tempData.dt) {
                    data.opTime = $scope.tempData.dt.formatDay();
                }
                logService.reqPagination(data).then(function (resp) {
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"data": "logMessage"},
                {"data": "logType","render":(data,type,full) => {
                  return $scope.logTypeOptions[data-1].lookupValue;
                }},
                {"data": "opUser"},
                {"data": "opTime"},
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                // $('td:eq(1)', nRow).html(sessionCache.getLogType(aData.logType));
                return nRow;
            },
            "drawCallback": function () {
                customerService.initUniform(tableId);// 渲染其它列的样式
            }
        }));
    }

    //搜索
    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    };

    $scope.toSearch = function () {
        reload();
    };

    $scope.toReset = function () {
        $scope.tempData.logType = "";
        $scope.tempData.dt = new Date();
        reload();
    };

    initTable();

});