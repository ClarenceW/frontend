'use strict';

angular.module('parkingApp').controller('employeeListCtrl',[
	'$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'employeeService','StateName','sessionCache','$filter'
	,function ($rootScope, $scope, $http, $state, $uibModal, growl, customerService, employeeService,StateName,sessionCache,$filter) {

    var indexId = "#employee-index";
    var tableId = indexId + " #employee-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.stateGoEdit = StateName.employeemes.edit;
    $scope.stateGoAdd = StateName.employeemes.add;
    $scope.formData = {};

    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, false);
        }
    }

    function initTable() {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.code) {
                    data.code = $scope.formData.code;
                }
                if ($scope.formData.name) {
                    data.name = $scope.formData.name;
                }
                if ($scope.formData.deptName) {
                    data.deptName = $scope.formData.deptName;
                }
                if ($scope.formData.phoneNumber) {
                    data.phoneNumber = $scope.formData.phoneNumber;
                }
                employeeService.reqPagination(data).then(function (resp) {
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "code"},
                {"data": "phoneNumber"},
                {"data": "name"},
                {"data": "deptName"},
                {"data": "roleName"},
                {"data": "opUser"},
                {"data": "createTime","render":function(data, type, full){
                    if(data){
                    	data =  $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                    	return data;
                    }else{
                    	return "";
                    }
                }},
            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
            	$('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
              return nRow;
            },
            "drawCallback": function () {
                customerService.initUniform(tableId);
                customerService.initTitle();
            },
        }));
    }

    $scope.toSearch = function () {
        reload();
    };
    $scope.toReset = function () {
        $scope.formData.name = "";
        $scope.formData.code = "";
        $scope.formData.deptName = "";
        $scope.formData.phoneNumber = "";
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
              $state.go($scope.stateGoEdit, {code: aData.code});
          } else {
              customerService.openEditConfirmModal();
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
                  data.code = aData.code;
                  companyService.reqDelete(data).then(function (msg) {
                      growl.addInfoMessage(msg, {ttl: 2000});
                      reload();
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

}]);