'use strict';
angular.module('parkingApp').controller('unusualpassDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','unusualpassService','customerService','$compile','$timeout','growl','$filter',
	function($scope, $state, StateName,sessionCache,Setting,unusualpassService,customerService,$compile,$timeout,growl,$filter) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.unusualpass.index;
    $scope.passcar = false;
    var detailId = "#unusualpass-detail";
    var passcarTableId = detailId + " #pass-car-table";
    unusualpassService.reqDetail($state.params.id).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.plate = dto.plate;
        $scope.formData.id = dto.id;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.parkDirection = dto.parkDirection;
        $scope.formData.parkdirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION',dto.parkDirection);
        $scope.formData.terminalNo = dto.terminalNo;
        $scope.formData.passTime = dto.passTime;
        $scope.formData.reason = dto.reason;
        $scope.formData.laneName = dto.laneName;
        $scope.formData.parklotRecordId = dto.parklotRecordId;
        $scope.formData.opUser = dto.opUser;
        $scope.formData.shouldPay = $filter('currency')(dto.shouldPay/100);
        let url1 = Setting.SERVER.DOWNLOAD+"?file=" + dto.pic;
        let imgTemplate1 = "<a href=\""+url1+"\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img class=\"img-circle\" src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
        let compileFn1 = $compile(imgTemplate1);
        let $dom1 = compileFn1($scope);
        customerService.handleFancyBox();
        $('tr:eq(11) td:eq(1)').html($dom1);
    }

    $scope.toPasscarRecord = function () {
      var oTable = null;
      var initTable = function () {
          oTable = $(passcarTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
              "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
              "ajax": function (data, callback, settings) {
                unusualpassService.reqPasscar($scope.formData.parklotRecordId).then(function (resp) {
                    callback(resp)
                  }, function (msg) {
                      growl.addErrorMessage(msg, {ttl: 2000});
                  });
              },
              "columns": [
                  {"data": "recordId"},
                  {"data": "plate"},
                  {"data": "parklotName"},
                  {"data": "laneName"},
                  {
                      "data": "parkDirection", "render": function (data, type, full) {
                      var parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION', data);
                          return parkDirection;
                  }
                  },
                  {
                      "data": "passType",
                      "render": function (data, type, full) {
                          var passType = sessionCache.getLookupValueByLookupName('PASS_TYPE', data);
                          return passType;
                      }
                  },
                  { "defaultContent": "" },
                  {
                      "data": "passTime", "render": function (data, type, full) {
                      if (data) {
                          var _date = new Date(data);
                          return _date.format("yyyy-MM-dd hh:mm:ss");
                      } else {
                          return "";
                      }
                  },
                  },
              ],
              "rowCallback": function(nRow, aData, iDisplayIndex) {
                if (aData.pic) {
                  let url1 = Setting.SERVER.DOWNLOAD + "?file=" + aData.pic;
                  let imgTemplate1 = "<a href=\"" + url1 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
                  let compileFn1 = $compile(imgTemplate1);
                  let $dom1 = compileFn1($scope);
                  customerService.handleFancyBox();
                  $('td:eq(6)', nRow).html($dom1);
                } else {
                  $('td:eq(6)', nRow).html('');
                }
                return nRow;
              },
          }));
      };
      if ($scope.passcar === true) {
          $scope.passcar = false;
      } else {
          $scope.passcar = true;
          $timeout(function () {
              initTable();
          });
      }
    };
    $scope.back = function() {
        $state.go($scope.stateGoIndex, {params:$state.params.params,flg:1 });
    }
		
	}
]);