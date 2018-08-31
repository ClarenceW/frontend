'use strict';
parkingApp.controller('SidebarController', function ($rootScope,$scope, sessionCache, $timeout, $state, $stateParams, $log,menuVariables) {
    $timeout(function () {
        Layout.initSidebar(); // init sidebar
        var objs = $("a[name='firstMenu']");
        if(objs.length>0 && !$rootScope.clicked){
        	var obj = objs[0];
        	var fCode = $(obj).attr('code');
        	var defaultFirstMenuCode = menuVariables.defaultFirstMenuCode;
        	if(fCode !== defaultFirstMenuCode){
        		$(obj).trigger("click");
        	}
        }
        $rootScope.clicked = true;
    }, 500);
    $scope.menus = [];
    $scope.defaultFirstMenuCode = menuVariables.defaultFirstMenuCode; // 默认首选菜单
    var firstMenus = sessionCache.getFirstMenus();
    if (firstMenus) {
        $scope.menus = firstMenus;
    }
    $scope.clickFirstMenu = function (menu) {
        // 解决多次点击同一个一级菜单,二级菜单没有自动定位到菜单首选项的问题
        $state.go(menu.uiSref, {ucFirstMenuCode: menu.code + "|" + new Date(), "ucSecMenuCode": null}); // 保持时时刷新
    };

    if ($stateParams.ucFirstMenuCode) {
        var arrayObject = $stateParams.ucFirstMenuCode.split("|");
        if (arrayObject[0]) {
            $scope.defaultFirstMenuCode = arrayObject[0];
        }
    }
    //$log.log("SidebarController>>>");
    //$log.log($stateParams);
});
parkingApp.controller('SidebarSecController', function ($scope, sessionCache, $stateParams, $timeout, $log) {
    $timeout(function () {
        Layout.initSecondaryMenu(); // init layout
    }, 500);
    $scope.menus = [];
    $scope.defaultSecMenuCode = "";
    if ($stateParams.ucFirstMenuCode) {
        var arrayObject = $stateParams.ucFirstMenuCode.split("|");
        var firstMenuParam = arrayObject[0];
        if (firstMenuParam) {
            var secMenus = sessionCache.getSecMenus(firstMenuParam);
            if (secMenus) {
                secMenus.forEach(function (item, index) {
                    if (index == 0) {
                        $scope.defaultSecMenuCode = item.code; // 默认二级菜单选中项
                    }
                    var menu = {};
                    menu.code = item.code;
                    menu.name = item.name;
                    menu.icon = item.icon;
                    menu.sort = item.sort;
                    menu.uiSref = item.uiSref;
                    menu.children = [];
                    var thirdMenus = sessionCache.getThirdMenus(item.code);
                    if (thirdMenus && thirdMenus instanceof Array && thirdMenus.length > 0) {
                        menu.children = thirdMenus;
                    }
                    $scope.menus.push(menu);
                });
                // 二级菜单选中项
                if ($stateParams.ucSecMenuCode) {
                    $scope.defaultSecMenuCode = $stateParams.ucSecMenuCode;
                }
            }
        }
    }
    //$log.log("SidebarSecController>>>");
    //$log.log($stateParams);
    $scope.appSidebarSecondToggler = function() {
        document.querySelector('body').classList.toggle('sidebar-second-hidden');
        
    }

});