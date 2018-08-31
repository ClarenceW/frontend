'use strict';
/* Setup App Login Controller */
angular.module('parkingApp').controller('LoginCtrl', function ($scope, $rootScope, $state, Setting, growl, $http, authenticationSvc, $log, $sessionStorage,$cookieStore) {
    var loginForm;
    var alertDanger;
    var smpkContentCls = ".smpk-content";
    var smpkContentmainCls = ".smpk-content-main";
    var smpkLogoCls = ".smpk-logo";
    var smpkFormCls = ".smpk-form";
    var loginFormInputCss = ".login-form input";
    var date = new Date();
    $scope.year = date.getFullYear();

    $scope.formData = {};
    $scope.formData.username = "";
    $scope.formData.password = "";

    var setDangerContent = function (message) {
        alertDanger.show();
        $("span", alertDanger).text(message);
    };

    var initWidthHeight = function () {
        $(smpkContentCls).parent("div").css("height", "100%");
        $(smpkContentmainCls).css("margin-left", -($(smpkContentmainCls).width() / 2));
        $(smpkContentmainCls).css("margin-top", -($(smpkContentmainCls).height() / 2));
        $(smpkLogoCls).css("margin-left", -($(smpkLogoCls).width() + 55));
        $(smpkLogoCls).css("margin-top", -($(smpkFormCls).height() / 2));
        $(smpkFormCls).css("margin-left", 55);
        $(smpkFormCls).css("margin-top", -($(smpkFormCls).height() / 2));
        
        var lremember = $cookieStore.get("lremember");
        if(lremember){
        	var lname = $cookieStore.get("lname");
        	var lpassword = $cookieStore.get("lpassword");
        	$scope.formData.lusername = lname;
        	$scope.formData.lpassword = lpassword;
        	$("input[type='checkbox'][name='lremember']").trigger("click");
        }else{
        	$("input[type='checkbox'][name='lremember']").prop("checked",null);
        }
    };

    var handleLogin = function () {
        loginForm.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                var username = $.trim($scope.formData.lusername);
                var password = $.trim($scope.formData.lpassword);
                if (username == "" || password == "") {
                    setDangerContent("用户名或密码不能为空.");
                    return false;
                }
                var remember = $("input[type='checkbox'][name='lremember']").prop("checked");
                authenticationSvc.login(username, password,remember).then(function (greeting) {
                    $log.debug(greeting);
                }, function (reason) {
                    setDangerContent(reason);
                });
                return false;
            }
        });
        $(loginFormInputCss).keypress(function (e) {
            if (e.which == 13) {
                if (loginForm.validate().form()) {
                    loginForm.submit();
                }
                return false;
            }
        });
    };

    var initValue = function () {
        loginForm = $(smpkContentCls + " .login-form");
        alertDanger = $(".alert-danger", loginForm);
    };

    var initView = function () {
    	try{
    		Metronic.initUniform(smpkContentCls + " input[type=checkbox]:not(.toggle)"); // 渲染其它列的样式
	        if ($state.params.msg) {
	            setDangerContent($state.params.msg);
	        } else {
	            alertDanger.hide();
	        }
	        initWidthHeight();
	        $(smpkContentCls).backstretch(["img/login_bg.png","img/login_bg.png"], {fade: 1000, duration: 5000});
	        //$(smpkContentCls).backstretch(["img/login_bg.jpg","img/login_bg2.jpg"], {fade: 1000, duration: 5000});
    	}catch(e){
    		window.location.reload();
    	}
        
    };

    var initEvent = function () {
        handleLogin();
    };

    initValue();
    initView();
    initEvent();

});
