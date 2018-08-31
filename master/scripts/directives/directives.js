'use strict';

//angular.module("parkingApp").directive("contextMenu", function ($rootScope, $http, $state, menuService, growl) {
//    return {
//        scope: {
//            module: "=",
//            currentApp: "=",
//            needConfirmEmail: "&",
//            user: "="
//        },
//        restrict: "EA",
//        replace: !0,
//        templateUrl: "views/_fragment/dashboard/sidebar/sidebar.html",
//        link: function (scope, element, attrs) {
//        },
//        controller: function ($scope, $sessionStorage) {
//
//            $scope.menus = [];
//
//            if ($sessionStorage.menus[0]) {
//                $scope.menus = $sessionStorage.menus[0];
//                $scope.firstActiveMenu = $sessionStorage.firstActiveMenu;
//            }
//
//            $scope.triggerActive = function (menu) {
//                $sessionStorage.firstActiveMenu = menu;
//                $scope.firstActiveMenu = menu;
//            };
//
//        }
//    }
//});
//
//
//
