angular.module('parkingApp').controller('preLoginCtrl', 
	function ($scope,$timeout, $rootScope, $state,$location, Setting,StateName, growl, $http, authenticationSvc, $log, $sessionStorage,$cookieStore) {
		var url = $location.$$url;
		var decodeParam = url.substring(url.indexOf('?')+1,url.indexOf('='));
		var params = window.atob(decodeParam);
		var userObj = GetRequest(params)
		var userCode = '';
		var password = '';
		if(userObj){
			userCode = userObj.userCode;
			password = userObj.password;
		}
	    $log.info("userCode:["+userCode+"],password:["+password+"]");
	    if(!userCode || !password){
	    	 $state.go(StateName.login);
	    	 return ;
	    }
	    $("body").css("background-color","#10121e !important")  
	    authenticationSvc.login(userCode, password,false).then(function (greeting) {
	        $log.debug(greeting);
	    },function(){
	    	$state.go(StateName.login);
	    });
	    
});