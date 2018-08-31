'use strict';

angular.module('parkingApp').controller('companyListCtrl',[
	'$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'companyService','StateName','sessionCache','$filter'
	,function ($rootScope, $scope, $http, $state, $uibModal, growl, customerService, companyService,StateName,sessionCache,$filter) {

    var indexId = "#company-index";
    var tableId = indexId + " #company-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null, aData = null;
    $scope.stateGoDetail = StateName.company.detail;
    $scope.stateGoEdit = StateName.company.edit;
    $scope.stateGoAdd = StateName.company.add;
    $scope.formData = {};

    var reload = function () {
        if (customerService.isDataTableExist(tableId)) {
            oTable.api().ajax.reload(null, false);
        }
    }

    function initTable() {
        oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
            "ajax": function (data, callback, settings) {
                if ($scope.formData.name) {
                    data.name = $scope.formData.name;
                }
                companyService.reqPagination(data).then(function (resp) {
                    callback(resp)
                }, function (msg) {
                    growl.addErrorMessage(msg, {ttl: 2000});
                });
            },
            "columns": [
                {"defaultContent": ""},
                {"data": "code"},
                {"data": "name"},
                {"data": "contacts"},
                {"data": "contactNumber"},
                {"data": "districtName"},
                {"data": "opType"},
                {"data": "checkFlag"},
                {"data": "address"},
                {"data": "createUser"},
                {"data": "sysTime","render":function(data, type, full){
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
                $('td:eq(6)', nRow).html(sessionCache.getCompanyOptTypesValue(aData.opType));
                $('td:eq(7)', nRow).html(sessionCache.getCompanyCheckFlagValue(aData.checkFlag));
                
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
            $state.go($scope.stateGoDetail, {company: aData});
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
              $state.go($scope.stateGoEdit, {company: aData});
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
                  data.companyCode = aData.code;
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