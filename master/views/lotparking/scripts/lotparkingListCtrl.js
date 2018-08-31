'use strict';
angular.module('parkingApp').controller('lotparkingListCtrl', ['$rootScope', '$scope', '$http', '$state', '$uibModal', 'growl', 'customerService', 'lotparkingService', 'StateName', 'sessionCache', '$filter', 'Setting', '$compile','$timeout','parklotsService',
  function ($rootScope, $scope, $http, $state, $uibModal, growl, customerService, lotparkingService, StateName, sessionCache, $filter, Setting, $compile,$timeout,parklotsService) {
    var indexId = "#lotparking-index";
    var tableId = indexId + " #lotparking-table";
    var checkboxesCls = tableId + " .checkboxes";
    var oTable = null;
    var nRow = null,
      aData = null;
    $scope.stateGoDetail = StateName.lotparking.detail;
    let params = $state.params.params || {}
    $scope.formData = params;
    $scope.formData.startTime = params.startTime ? new Date(new Date(params.startTime).format("yyyy-MM-dd hh:mm:ss")) : '';
    $scope.formData.endTime = params.endTime ? new Date(new Date(params.endTime).format("yyyy-MM-dd hh:mm:ss")) : '';
    $scope.formData.parkTime = '';
    $scope.iDisplayStart = $scope.formData.start || 0;
    
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
      $timeout(function() {
        $('.selectpicker').selectpicker({
          'selectedText': '',
          'actionsBox':true,
        });
      },50);
    });

    /**  日期选择*/
    $scope.starTimeCtrl = {
      isOpen: false,
      date: new Date(),
      buttonBar: {
          show: true,
          now: {
              show: true,
              text: '现在'
          },
          today: {
              show: true,
              text: '今天'
          },
          clear: {
              show: false,
              text: 'Clear'
          },
          date: {
              show: true,
              text: '日期'
          },
          time: {
              show: true,
              text: '时间'
          },
          close: {
              show: true,
              text: '关闭'
          }
      }
    };
    $scope.endTimeCtrl = {
      isOpen: false,
      date: new Date(),
      buttonBar: {
          show: true,
          now: {
              show: true,
              text: '现在'
          },
          today: {
              show: true,
              text: '今天'
          },
          clear: {
              show: false,
              text: 'Clear'
          },
          date: {
              show: true,
              text: '日期'
          },
          time: {
              show: true,
              text: '时间'
          },
          close: {
              show: true,
              text: '关闭'
          }
      }
    };
    $scope.openStartTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.starTimeCtrl.isOpen = true;
    };
    $scope.openEndTime = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.endTimeCtrl.isOpen = true;
    };
    var reload = function () {
      $scope.formData.start = 0;
      // if (customerService.isDataTableExist(tableId)) {
      //   oTable.api().ajax.reload(null, false);
      // }
      initTable();
    }
    function initTable() {
      oTable = $(tableId).dataTable($.extend(UcUtils.getTableDefaultOptions(), {
        "destroy": true,
        "ajax": function (data, callback, settings) {
          let flg = $state.params.flg;
          if (flg == 1) {
            data.start = $scope.formData.start || 0;
            data.length = $scope.formData.length || 10;
            let start = data.start;
            let length = data.length;
            delete $state.params['flg'];
            let index = start / length + 2
            setTimeout(function () {
              $("#lotparking-table_paginate").find("li[class='active']").removeClass('active')
              $("#lotparking-table_paginate").find("li").eq(index).addClass('active');
            }, 100);
          } else {
            $scope.formData.start = data.start;
            $scope.formData.length = data.length;
          }
          if ($scope.formData.plate) {
            data.plate = $scope.formData.plate;
          }
          if ($scope.formData.parklotName) {
            data.parklotName = $scope.formData.parklotName;
          }
          if($scope.formData.parklotCodes) {
            data.parklotCodes = $scope.formData.parklotCodes;
          }
          if($scope.formData.parkTime == 1) {
            data.stopTimeMin = 0;
            data.stopTimeMax = 5;
          }else if($scope.formData.parkTime == 2) {
            data.stopTimeMin = 6;
            data.stopTimeMax = 10;
          }else if($scope.formData.parkTime == 3) {
            data.stopTimeMin = 11;
            data.stopTimeMax = 15;
          }else if($scope.formData.parkTime == 4) {
            data.stopTimeMin = 16;
            data.stopTimeMax = 20;
          }else if($scope.formData.parkTime == 5) {
            data.stopTimeMin = 21;
            data.stopTimeMax = 24;
          }else if($scope.formData.parkTime == 6) {
            data.stopTimeMin = 25;
          }
          if ($scope.formData.startTime) {
            var _date = $scope.formData.startTime.format("yyyy-MM-dd hh:mm:ss");
            data.startTime = _date;
          }
          if ($scope.formData.endTime) {
            var _date = $scope.formData.endTime.format("yyyy-MM-dd hh:mm:ss");
            data.endTime = _date;
          }
          if ($scope.formData.startTime && $scope.formData.endTime) {
            if ($scope.formData.startTime > $scope.formData.endTime) {
              growl.addErrorMessage("起始日期不得晚于结束日期", { ttl: 2000 });
              return;
            }
          }
          lotparkingService.reqPagination(data).then(function (resp) {
            callback(resp)
          }, function (msg) {
            growl.addErrorMessage(msg, { ttl: 2000 });
          });
        },
        iDisplayStart: $scope.iDisplayStart,
        "columns": [
          { "defaultContent": "" },
          { "data": "plate" },
          { "data": "parklotName" },
          {
            "data": "passTime", "render": (data, type, full) => {
              let passTime = new Date(data);
              return passTime.format("yyyy-MM-dd hh:mm:ss");
            }
          },
          { "data": "stopTime" },
          { "defaultContent": "" },
        ],
        "rowCallback": function (nRow, aData, iDisplayIndex) {
          $('td:eq(0)', nRow).html("<input type=\"checkbox\" class=\"checkboxes\" value=\"1\"/>");
          if (aData.pic) {
            let url1 = Setting.SERVER.DOWNLOAD + "?file=" + aData.pic;
            let imgTemplate1 = "<a href=\"" + url1 + "\" class=\"fancybox\" rel=\"edit-newest-group\" style=\"float: left;\"><img src=\"" + url1 + "\" style=\"width:50px !important;height:auto;margin:auto;\"></a>";
            let compileFn1 = $compile(imgTemplate1);
            let $dom1 = compileFn1($scope);
            customerService.handleFancyBox();
            $('td:eq(5)', nRow).html($dom1);
          } else {
            $('td:eq(5)', nRow).html('');
          }

          return nRow;
        },
        "drawCallback": function () {
          customerService.initUniform(tableId);
          customerService.initTitle();
        }
      }));
    }
    $scope.toSearch = function () {
      $scope.iDisplayStart = 0;
      reload();
    };
    $scope.toReset = function () {
      $scope.formData.parklotName = "";
      $scope.formData.plate = "";
      $scope.formData.parkTime = "";
      $scope.formData.startTime = '';
      $scope.formData.endTime = '';
      $scope.formData.parklotCodes = [];
      $timeout(() => {
        $('.selectpicker').selectpicker('render');
      },50);
      if(customerService.isDataTableExist(tableId)) {
				oTable.api().ajax.reload(null, true);
      }
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
        let params = $scope.formData;
        $state.go($scope.stateGoDetail, { id: aData.id, params: params });
      } else {
        customerService.openDetailConfirmModal();
      }
    };

    initTable();
  }
]);