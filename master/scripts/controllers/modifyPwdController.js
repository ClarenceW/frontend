'use strict';
angular.module('parkingApp').controller('ModifyPwdController', function ($scope, sessionCache,authenticationSvc,growl) {
	$scope.formData = {};
	$scope.formData.userCode = sessionCache.getUserCode();
	/*关闭*/
    $scope.cancel = function(){
    	$("[class*=modal-backdrop],[class*=modal-dialog]").remove();
    	$("#top-switch-icon").parent("a").trigger("click");
    };
    
    /*保存*/
    $scope.savePwd = function(){
    	if(!$scope.formData.oldPwd){
    		growl.addErrorMessage("请输入旧密码！", {ttl: 2000});
    		return ;
    	}
    	if(!$scope.formData.newPwd){
    		growl.addErrorMessage("请输入新密码！", {ttl: 2000});
    		return ;
    	}
    	if(!$scope.formData.checkPwd){
    		growl.addErrorMessage("请输入确认新密码！", {ttl: 2000});
    		return ;
    	}
    	if($scope.formData.checkPwd!=$scope.formData.newPwd){
    		growl.addErrorMessage("确认新密码与新密码不一致，请确认！", {ttl: 2000});
    		return ;
    	}
    	authenticationSvc.modifyPwd($scope.formData).then(function (msg){
           if(msg==1){
           		growl.addInfoMessage("密码修改成功！", {ttl: 2000});
           		$scope.cancel();
           }else{
           		growl.addErrorMessage("密码修改失败！", {ttl: 2000});
           }
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
    }
});