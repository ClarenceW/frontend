'use strict';

parkingApp.controller('TopbarController', function ($scope, $state, $timeout) {

    $timeout(function () {
        Layout.initHeader();
    }, 500);
    // $scope.hasSidebar = false;
    if($("body").hasClass("sidebar-hidden")) {
      $scope.hasSidebar = true;
    }else {
      $scope.hasSidebar = false;
    }
    $scope.sideFirstMenu = function() {
        document.querySelector('body').classList.toggle('sidebar-hidden');
        var templateWith = window.innerWidth - 180;
        var templateMaxWith = window.innerWidth - 65;
        $scope.hasSidebar = $("body").hasClass("sidebar-hidden");
        if ($scope.hasSidebar) {
            $('#berthTemplate').width(templateMaxWith);
            $('#sensorTemplate').width(templateMaxWith);
        } else {
            $('#berthTemplate').width(templateWith);
            $('#sensorTemplate').width(templateWith);
        }
    }

});