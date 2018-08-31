'use strict';
angular.module('parkingApp').controller('alreadypaytradeDetailCtrl', ['$scope', '$state', 'StateName','sessionCache','Setting','alreadypaytradeService','passcarService','growl','$timeout','$compile','customerService',
	function($scope, $state, StateName,sessionCache,Setting,alreadypaytradeService,passcarService,growl,$timeout,$compile,customerService) {
		$scope.formData = {};
    $scope.stateGoIndex = StateName.payrecord.index;
    $scope.passcar = false;
    var detailId = "#payRecord-detail";
    var passcarRecordTableId = detailId + " #pass-car-table";
    alreadypaytradeService.reqDetail($state.params.traId).then(function (res) {
        var dto = res;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.boId = dto.boId;
        $scope.formData.traId = dto.traId;
        $scope.formData.parkingInId = dto.parkingInId;
        $scope.formData.userCode = dto.userCode;
        $scope.formData.payType = sessionCache.getLookupValueByLookupName('PARKING_PAY_TYPE',dto.payType);
        $scope.formData.thirdSn = dto.thirdSn;
        $scope.formData.plate = dto.plate;
        $scope.formData.createTime = dto.createTime;
        $scope.formData.paySrc = sessionCache.getLookupValueByLookupName('STOP_ORDER_SRC',dto.paySrc);
        $scope.formData.plateColor = sessionCache.getLookupValueByLookupName('PLATE_COLOR',dto.plateColor);
        $scope.formData.parklotName = dto.parklotName;
        $scope.formData.payMoney = dto.payMoney;
        $scope.formData.status = sessionCache.getLookupValueByLookupName('ORDER_STATUS',dto.orderStatus);
    }

    $scope.toParkingRecord = function () {
        var oTable = null;
        var initTable = function () {
            oTable = $(passcarRecordTableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
                "dom": "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'>>",
                "ajax": function (data, callback, settings) {
                    passcarService.reqList($scope.formData.parkingInId).then(function (resp) {
                      callback(resp)
                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                },
                destroy:true,
                "columns": [
                    {"data": "id"},
                    {"data": "plate"},
                    {"data": "parklotName"},
                    {"data": "laneName"},
                    {"data": "parkDirection","render": (data, type, full) => {
                        var parkDirection = sessionCache.getLookupValueByLookupName('PARK_DIRECTION', data);
                        return parkDirection;
                    }},
                    {"data": "passType","render": (data, type, full) => {
                        var passType = sessionCache.getLookupValueByLookupName('PASS_TYPE', data);
                        return passType;
                    }},
                    {"data": "passTime", "render": function (data, type, full) {
                        if (data) {
                            var _date = new Date(data);
                            return _date.format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }},
                    { "defaultContent": "" },
                ],
                "rowCallback": function(nRow, aData, iDisplayIndex) {
                  if (aData.passPic) {
                    let url1 = Setting.SERVER.DOWNLOAD + "?file=" + aData.passPic;
                    let imgTemplate1 = "<a href=\"" + url1 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
                    let compileFn1 = $compile(imgTemplate1);
                    let $dom1 = compileFn1($scope);
                    customerService.handleFancyBox();
                    $('td:eq(7)', nRow).html($dom1);
                  } else {
                    $('td:eq(7)', nRow).html('');
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