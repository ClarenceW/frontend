'use strict';

parkingApp.controller('AppController', function ($scope, $rootScope, $state, Setting, $log, dictService, $timeout) {
	try{
		$timeout(function () {
	        Metronic.init(); // init metronic core components
	    }, 500);
	}catch(e){}
    
    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
    });

});

/* Setup Modal Instance Controller */
parkingApp.controller('ConfirmModalInstanceCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'Setting', 'options', function ($scope, $rootScope, $uibModalInstance, Setting, options) {
    $scope.title = options.title;
    $scope.showOK = options.confirmMessage != null;
    $scope.confirmMessage = options.confirmMessage;
    $scope.showCancel = options.cancelMessage != null;
    $scope.cancelMessage = options.cancelMessage;
    $scope.message = options.message;

    $scope.ok = function () {
        $uibModalInstance.close($scope.message);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);