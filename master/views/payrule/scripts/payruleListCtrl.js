'use strict';

angular.module('parkingApp').controller('payruleListCtrl', 
	function ($rootScope, $scope, $http, $state, $uibModal, growl, Setting, customerService, payruleService, $log,StateName,sessionCache,$filter) {

    var indexId = "#payrule-index";
    var tableId = indexId + " #payrule-table";
    var checkboxesCls = tableId + " .checkboxes";
    // $scope.stateGoDetail = StateName.rule.detail;
    // $scope.stateGoEdit = StateName.rule.edit;
    // $scope.stateGoAdd = StateName.rule.add;
    // $scope.stateGoBind = StateName.rule.bind;
    var oTable = null;
    var nRow = null;
    var aData = null;
    $scope.payRuleOptions = sessionCache.getDictsByLookupName('RULE_TYPE');
    $scope.carTypeOptions = sessionCache.getDictsByLookupName('VEHICLE_TYPE');
    $scope.formData = {};
    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, true);
        }
    }

    function initTable() {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.name) {
                    data.name = $scope.formData.name;
                }
                if ($scope.formData.ruleType) {
                    data.ruleType = $scope.formData.ruleType;
                }
                if ($scope.formData.cartype) {
                    data.cartype = $scope.formData.cartype;
                }
                payruleService.reqPagination(data).then(function (resp) {
                    $log.info(resp)
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "code"},
                {"data": "name"},
                {"data": "ruleType","render":(data,type,full) => {
                    return sessionCache.getLookupValueByLookupName('RULE_TYPE',data);
                }},
                {"data": "sectionCount","render":(data,type,full) => {
                	return $filter('number')(data, 0);
                }},
                {"data": "cartype","render":(data,type,full) => {
                  return sessionCache.getLookupValueByLookupName('VEHICLE_TYPE',data);
                }},
                {"data": "opUser"},
                {"data": "createTime"}, 
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
    $scope.toReset = function(){
        $scope.formData.name = "";
        $scope.formData.ruleType = "";
        $scope.formData.cartype = "";
        reload();
    }

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
            $state.go($scope.stateGoDetail, {rule: aData});
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
            $state.go( $scope.stateGoEdit, {rule: aData});
        } else {
            customerService.openEditConfirmModal();
        }
    };
    
    $scope.toBind = function(){
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
            $state.go( $scope.stateGoBind, {rule: aData});
        } else {
            customerService.openEditConfirmModal();
        }
    }

    $scope.toDelete = function () {
        var count = 0;
        var aData;
        $(checkboxesCls).each(function () {//data-set="tableId+ " .checkboxes""
            if ($(this).prop("checked")) {
                nRow = $(this).parents('tr')[0];
                aData = oTable.fnGetData(nRow);
                count++;
            }
        });
        if (count === 1) {
            customerService.modalInstance().result.then(function (message) {
                var data = {};
                data.ruleCode = aData.code;
                payruleService.reqDelete(data).then(function (resp) {
                	let {code,msg,data} = resp;
                	if(code === Setting.ResultCode.CODE_SUCCESS){
	                    growl.addInfoMessage(msg, {ttl: 2000});
	                    reload();
	                }else{
	                	growl.addErrorMessage(msg, {ttl: 2000});
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
    }

    initTable();
});