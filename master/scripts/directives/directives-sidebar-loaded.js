'use strict';

angular.module("parkingApp").directive("sidebarLoaded", function ($rootScope, $http, $state, menuService, growl) {
    return {
        restrict: "EA",
        replace: !0,
        link: function (scope, element, attrs) {
            Layout.initSidebar();
        },
        controller: function ($scope) {

        }
    }
});



