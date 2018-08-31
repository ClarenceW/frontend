'use strict';
angular.module("parkingApp").controller('sentryboxListCtrl',
    function ($rootScope, $scope, growl, $log, customerService, Setting, membercarService, StateName, $state, sessionCache, $timeout, $http, $compile, $filter,parklotsService) {
        $scope.parklotData = {};
        $scope.parklotData.pullTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        $scope.vipData = {};
        $scope.vipData.pullTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        $scope.myModal = "";


        /**  日期选择*/
        $scope.vipData.startTime = new Date();
        $scope.vipData.endTime = new Date();
        $scope.tempBeginData = {};
        $scope.tempEndData = {};
        $scope.format = "yyyy-MM-dd";

        $scope.open = function (type) {
          if (type == 'begin') {
            $scope.tempBeginData.opened = true;
          } else if (type == 'end') {
            $scope.tempEndData.opened = true;
          }
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
        /**  日期选择结束 **/
        
        $scope.toPullparklot = function () {
            parklotsService.reqPull().then(function (msg) {
                growl.addInfoMessage('<div>指令发送成功！</div><div>请于一分钟后刷新页面，查看更新后的数据。</div>', {ttl: 2000});
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }

        $scope.toPullvip = function () {
            var data = {};
            if($scope.vipData.startTime) {
              data.startTime = new Date($scope.vipData.startTime).format("yyyy-MM-dd");
            }
            if($scope.vipData.endTime) {
              data.endTime = new Date($scope.vipData.endTime).format("yyyy-MM-dd");
            }
            membercarService.reqPull(data).then(function (msg) {
                growl.addInfoMessage('<div>指令发送成功！</div><div>请于一分钟后刷新页面，查看更新后的数据。</div>', {ttl: 2000});
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }

    });