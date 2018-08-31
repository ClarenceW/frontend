'use strict';

parkingApp.run(function ($templateCache, $http, $log, $rootScope, $sessionStorage, $state, StateName, Event, authenticationSvc, sessionCache, $uibModal, growl) {
    $rootScope.$storage = $sessionStorage;
    $rootScope.$on(Event.$stateChangeStart, function (e, toState, toParams, fromState, fromParams) {
        if (toState && toState.name) {
            if (toState.name != StateName.login && toState.name != StateName.loadLogin) {
                if (sessionCache.inValid()) {
                    e.preventDefault();
                    $rootScope.$emit(Event.login);
                }
            }
        }
    });
    /** 跳转至登录页面 **/
    $rootScope.$on(Event.login, function (e, msg) {
        sessionCache.clean();
        $state.go(StateName.login, { msg: msg });
    });
    /** 退出事件 **/
    $rootScope.$on(Event.logout, function (e, userData) {
        try {
            authenticationSvc.logout(sessionCache.getUserCode());
            sessionCache.clean();
        } catch (e) { }

        $state.go(StateName.login);
    });
    /* 修改密码 */
    $rootScope.$on(Event.modifyPwd, function (e, userData) {
        $uibModal.open({
            templateUrl: 'tpls/pwd.html',
            controller: 'ModifyPwdController',
            size: 'lg'
        });
    });
});

/* blockUIConfig */
parkingApp.config(function (blockUIConfig, RegExp) {
    blockUIConfig.delay = 0;
    blockUIConfig.autoBlock = true;
    blockUIConfig.autoInjectBodyBlock = false;
    blockUIConfig.templateUrl = 'tpls/block-ui-overlay.html';
    blockUIConfig.requestFilter = function (config) {
        if (!(config.url.match(RegExp.authUrl)
            || config.url.match(RegExp.roadUrl)
            || config.url.match(RegExp.lotUrl)
            || config.url.match(RegExp.guideUrl))) {
            return false;
        }
        var message;
        switch (config.method) {
            case 'GET':
                message = 'Getting ...';
                break;
            case 'POST':
                message = 'Posting ...';
                break;
            case 'DELETE':
                message = 'Deleting ...';
                break;
            case 'PUT':
                message = 'Putting ...';
                break;
        }
        return message;
    };
});

/* 注册http拦截器 */
parkingApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('userInterceptor');
});

/* 日志级别 */
parkingApp.config(function ($logProvider) {
    $logProvider.debugEnabled(true)
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
parkingApp.config(function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
});

/* AngularJS v1.3.x workaround for old style controller declarition in HTML */
parkingApp.config(function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
});

/**
 * Only unique messages
 */
//parkingApp.config(['growlProvider', function (growlProvider) {
//    growlProvider.onlyUniqueMessages(true);
//}]);

parkingApp.config(function ($stateProvider, $urlRouterProvider, StateName) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state(StateName.login, { // 登陆页面
            url: "/login",
            templateUrl: 'views/_fragment/login/login.html',
            controller: 'LoginCtrl',
            params: { 'msg': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/_fragment/login/css/login.css',
                            'views/_fragment/login/scripts/loginCtrl.js',
                        ]
                    });
                }]
            }
        })
        .state(StateName.loadLogin, { // 大平台直接登录
            url: "/plogin",
            templateUrl: 'views/_fragment/login/loading.html',
            controller: 'preLoginCtrl',
            params: { 'msg': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/util/url-params.js',
                            'views/_fragment/login/scripts/loadLoginCtrl.js',
                        ]
                    });
                }]
            }
        })
        .state("dashboard", {
            views: {
                "": {
                    abstract: true,
                    controller: 'AppController',
                    templateUrl: 'views/_fragment/dashboard/dashboard.html'
                },
                "topbar@dashboard": {
                    controller: 'TopbarController',
                    templateUrl: 'views/_fragment/dashboard/topbar/topbar.html'
                },
                "sidebar@dashboard": {
                    controller: 'SidebarController',
                    templateUrl: 'views/_fragment/dashboard/sidebar/sidebar.html'
                },
                "content@dashboard": {}
            },
            params: { ucFirstMenuCode: null }
        })
        .state("dashboard.map", {  // 地图模块
            url: "/map",
            views: {
                "content@dashboard": {
                    controller: 'MapCtrl',
                    templateUrl: 'views/_fragment/dashboard/sidebar/map/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'views/_fragment/dashboard/sidebar/map/css/icon/iconfont.css',
                                    'views/_fragment/dashboard/sidebar/map/css/map.css',
                                    'views/_fragment/dashboard/sidebar/map/scripts/mapCtrl.js'
                                ]
                            });
                        }]
                    }
                }
            }
        })
        .state(StateName.home, {// 首页模块
            url: "/home",
            views: {
                "content@dashboard": {
                    controller: 'HomeCtrl',
                    templateUrl: 'views/_fragment/dashboard/sidebar/home/home.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    //'js!http://webapi.amap.com/maps?v=1.3&key=5dc6072d227ca8f3511c77eb421f37c2',
                                    'vender/highcharts/js/highcharts.js',
                                    'vender/echarts/dist/echarts.min.js',
                                    'views/_fragment/dashboard/sidebar/home/home.css',
                                    'views/_fragment/dashboard/sidebar/home/scripts/homeCtrl.js'
                                ]
                            });
                        }]
                    }
                }
            }
        })
        .state(StateName.homeUseRate, {// 首页泊位利用率详情
            views: {
                "content@dashboard": {
                    controller: 'HomeUserRateCtrl',
                    templateUrl: 'views/_fragment/dashboard/sidebar/home/useRateDetail.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'vender/highcharts/js/highcharts.js',
                                    'vender/echarts/dist/echarts.min.js',
                                    'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                                    'vender/selectbox/css/selectbox.1.css',
                                    'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                                    'views/_fragment/dashboard/sidebar/home/scripts/useRateDetailCtrl.js'
                                ]
                            });
                        }]
                    }
                }
            }
        })
        .state(StateName.homeTurnRate, {// 首页泊位周转率详情
            views: {
                "content@dashboard": {
                    controller: 'HomeTurnRateCtrl',
                    templateUrl: 'views/_fragment/dashboard/sidebar/home/turnRateDetail.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'vender/highcharts/js/highcharts.js',
                                    'vender/echarts/dist/echarts.min.js',
                                    'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                                    'vender/selectbox/css/selectbox.1.css',
                                    'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                                    'views/_fragment/dashboard/sidebar/home/scripts/turnRateDetail.js'
                                ]
                            });
                        }]
                    }
                }
            }
        })
        .state("dashboard.sec", {
            views: {
                "content@dashboard": {
                    controller: 'SidebarSecController',
                    templateUrl: 'views/_fragment/dashboard/sidebar/sidebarsec.html'
                }
            },
            params: { "ucFirstMenuCode": null, "ucSecMenuCode": null }
        })
        /** 系统管理-数据字典 **/
        .state(StateName.dict.index, {
            templateUrl: "views/dict/list.html",
            controller: "DictListCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/util/dateUtil.convert.js',
                            'vender/angle/app.css',
                            'views/dict/scripts/dictListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 路段管理 **/
        .state(StateName.section.index, {
            templateUrl: "views/section/list.html",
            controller: 'SectionListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/section/scripts/sectionListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 路段管理-新增 **/
        .state(StateName.section.add, {
            templateUrl: "views/section/add.html",
            controller: 'SectionAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/DatePicker/WdatePicker.js',
                            'views/section/css/section.css',
                            'views/section/scripts/sectionAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 路段管理-编辑 **/
        .state(StateName.section.edit, {
            templateUrl: "views/section/edit.html",
            controller: 'SectionEditCtrl',
            params: { 'sectionCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/section/css/section.css',
                            'views/section/scripts/sectionEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 路段管理-详情 **/
        .state(StateName.section.detail, {
            templateUrl: "views/section/detail.html",
            controller: 'SectionDetailCtrl',
            params: { 'sectionCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/section/css/section.css',
                            'views/section/scripts/sectionDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 系統管理-菜单管理 **/
        .state(StateName.menu.index, {
            templateUrl: "views/menus/list.html",
            controller: 'MenusListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/menus/scripts/menusListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 菜单管理-新增 **/
        .state(StateName.menu.add, {
            templateUrl: "views/menus/add.html",
            controller: 'MenusAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/DatePicker/WdatePicker.js',
                            'views/menus/scripts/menusAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 菜单管理-编辑 **/
        .state(StateName.menu.edit, {
            templateUrl: "views/menus/edit.html",
            controller: 'MenusEditCtrl',
            params: { 'menuCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/menus/scripts/menusEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 停车场管理 --基础信息**/
        .state(StateName.parklot.index, {
            templateUrl: "views/parklots/list.html",
            controller: 'ParklotsListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/parklots/scripts/parklotsListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 基础信息-新增 **/
        .state(StateName.parklot.add, {
            templateUrl: "views/parklots/add.html",
            controller: 'ParklotsAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parklots/css/parklots.css',
                            'vender/util/dateUtil.convert.js',
                            //'vender/textAngular/dist/textAngular.css',
                            'views/parklots/scripts/parklotsAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 基础信息-编辑 **/
        .state(StateName.parklot.edit, {
            templateUrl: "views/parklots/edit.html",
            controller: 'ParklotsEditCtrl',
            params: { code: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/util/dateUtil.convert.js',
                            'views/parklots/css/parklots.css',
                            'views/parklots/scripts/parklotsEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 基础信息-详情 **/
        .state(StateName.parklot.detail, {
            templateUrl: "views/parklots/detail.html",
            controller: 'ParklotsDetailCtrl',
            params: { code: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parklots/css/parklots.css',
                            'views/parklots/scripts/parklotsDetailCtrl.js'
                        ]
                    });
                }]
            }
        })

        /** 基础信息-编辑 **/
        .state(StateName.parklotopeMan.edit, {
            templateUrl: "views/parklotopeMan/edit.html",
            controller: 'parklotopeManEditCtrl',
            params: { code: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/util/dateUtil.convert.js',
                            'views/parklotopeMan/css/parklots.css',
                            'views/parklotopeMan/scripts/parklotopeManEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 基础信息-详情 **/
        .state(StateName.parklotopeMan.detail, {
            templateUrl: "views/parklotopeMan/detail.html",
            controller: 'parklotopeManDetailCtrl',
            params: { code: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parklotopeMan/css/parklots.css',
                            'views/parklotopeMan/scripts/parklotopeManDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 停车场管理 --运营信息**/
        // .state(StateName.parklotopeMan.index, {
        //     templateUrl: "views/parklotopeMan/list.html",
        //     controller: 'parklotopeManListCtrl',
        //     resolve: {
        //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 files: [
        //                     'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
        //                     'vender/datatables/all.min.js',
        //                     'views/parklotopeMan/scripts/parklotopeManListCtrl.js'
        //                 ]
        //             });
        //         }]
        //     }
        // })
        /** 停车场管理 --运营信息**/
        .state(StateName.entranceMes.index, {
            templateUrl: "views/entrance/list.html",
            controller: 'entranceListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/entrance/scripts/entranceListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 场内停车**/
        .state(StateName.parking.incars, {
            templateUrl: "views/lotcars/list.html",
            controller: 'lotcarListCtrl',
            params: { parklot: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/lotcars/scripts/lotcarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 停车记录**/
        .state(StateName.parking.index, {
            templateUrl: "views/parkrecord/list.html",
            controller: 'parkrecordListCtrl',
            params: { parklot: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parkrecord/scripts/parkrecordListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 收费管理**/
        .state(StateName.parking.charge, {
            templateUrl: "views/parkcharge/list.html",
            controller: 'parkchargeListCtrl',
            params: { parklot: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parkcharge/scripts/parkchargeListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 企业信息-编辑 **/
        .state(StateName.companymes.edit, {
            templateUrl: "views/company/edit.html",
            controller: 'companyEditCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/company/css/parklots.css',
                            'vender/util/dateUtil.convert.js',
                            'views/company/scripts/companyEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /** 企业管理--用户信息 **/
        .state(StateName.user.index, {
            templateUrl: "views/sysuser/list.html",
            controller: 'SysuserListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/sysuser/scripts/sysuserListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /**  企业管理--用户信息-新增 **/
        .state(StateName.user.add, {
            templateUrl: "views/sysuser/add.html",
            controller: 'SysuserAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/DatePicker/WdatePicker.js',
                            'views/sysuser/scripts/sysuserAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /**  企业管理--用户管理-编辑 **/
        .state(StateName.user.edit, {
            templateUrl: "views/sysuser/edit.html",
            controller: 'SysuserEditCtrl',
            params: { 'userCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/sysuser/scripts/sysuserEditCtrl.js'
                        ]
                    });
                }]
            }
        })

        /* 系統管理-角色管理*/
        .state(StateName.role.index, {
            templateUrl: "views/role/list.html",
            controller: 'roleListController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'views/role/scripts/roleListController.js',
                        ]
                    });
                }]
            }
        })
        .state(StateName.role.add, {
            templateUrl: "views/role/add.html",
            controller: 'roleAddController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/DatePicker/WdatePicker.js',
                            'views/role/scripts/roleAddController.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.role.edit, {
            templateUrl: "views/role/edit.html",
            controller: 'roleEditController',
            params: { 'roleCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'views/role/scripts/roleEditController.js'
                        ]
                    });
                }]
            }
        })
        /** 日志管理 **/
        .state(StateName.log.index, {
            templateUrl: "views/log/list.html",
            controller: 'LogListController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/angle/app.css',
                            'views/log/scripts/logList.js'
                        ]
                    });
                }]
            }
        })
        /* 系統管理-同步岗亭信息*/
        .state(StateName.sentryboxmes.index, {
            templateUrl: "views/sentrybox/list.html",
            controller: 'sentryboxListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/sentrybox/scripts/sentryboxListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车场停车记录*/
        .state(StateName.precord.indexI, {
            templateUrl: "views/precord/list-in-record.html",
            controller: 'ParklotsInListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/precord/scripts/parklotsInListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.precord.indexO, {
            templateUrl: "views/precord/list-out-record.html",
            controller: 'ParklotsOutListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/precord/scripts/parklotsOutListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.parklotmonitor.index, {
            templateUrl: "views/precord/list-monitor-record.html",
            controller: 'ParklotsMonitorListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/precord/scripts/parklotsMonitorListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.passcarmonitor.index, {
            templateUrl: "views/precord/list-passcar-monitor.html",
            controller: 'passcarMonitorCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/precord/scripts/passcarMonitorCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*车辆管理-会员车辆*/
        .state(StateName.membercars.index, {
            templateUrl: "views/membercars/list.html",
            controller: 'membercarListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/membercars/scripts/membercarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-临时车辆*/
        .state(StateName.temporarycars.index, {
            templateUrl: "views/temporarycars/list.html",
            controller: 'temporarycarListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/echarts/dist/echarts.min.js',
                            'views/temporarycars/scripts/temporarycarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-白名单车辆*/
        .state(StateName.whitelistcars.index, {
            templateUrl: "views/whitelistcars/list.html",
            controller: 'whitelistcarListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            // 'vender/selectbox/css/selectbox.1.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'views/whitelistcars/scripts/whitelistcarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.whitelistcars.edit, {
            templateUrl: "views/whitelistcars/edit.html",
            controller: 'whitelistcarEditCtrl',
            params: { 'data': null ,'params':null},
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'views/whitelistcars/scripts/whitelistcarEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-白名单车辆--新增*/
        .state(StateName.whitelistcars.add, {
            templateUrl: "views/whitelistcars/add.html",
            controller: 'whiteCarAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'views/whitelistcars/scripts/whitelistcarAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-白名单车辆--批量导入*/
        .state(StateName.whitelistcars.countAdd, {
            templateUrl: "views/whitelistcars/countAdd.html",
            controller: 'whitelistcarCountAdd',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/whitelistcars/scripts/whitelistcarCountAdd.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-黑名单车辆*/
        .state(StateName.blacklistcars.index, {
            templateUrl: "views/blacklistcar/list-blackcar.html",
            controller: 'blackCarListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/blacklistcar/scripts/blackCarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-黑名单车辆--新增*/
        .state(StateName.blacklistcars.add, {
            templateUrl: "views/blacklistcar/add.html",
            controller: 'blackCarAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/blacklistcar/scripts/blackCarAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-布控车辆--列表*/
        .state(StateName.layoutcars.index, {
            templateUrl: "views/layoutcars/list.html",
            controller: 'layoutcarListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/layoutcars/scripts/layoutcarListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-布控车辆--新增*/
        .state(StateName.layoutcars.add, {
            templateUrl: "views/layoutcars/add.html",
            controller: 'layoutcarAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/layoutcars/scripts/layoutcarAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车辆管理-车辆预警--列表*/
        .state(StateName.warningcars.index, {
            templateUrl: "views/carsalarm/list.html",
            controller: 'carsalarmListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/carsalarm/scripts/carsalarmListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-过车记录--列表*/
        .state(StateName.passcarrecord.index, {
            templateUrl: "views/passcarrecord/list.html",
            controller: 'passcarrecordListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/passcarrecord/scripts/passcarrecordListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-过车记录--详情*/
        .state(StateName.passcarrecord.detail, {
            templateUrl: "views/passcarrecord/detail.html",
            controller: 'passcarrecordDetailCtrl',
            params: { 'id': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/passcarrecord/scripts/passcarrecordDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-场内停车--列表*/
        .state(StateName.lotparking.index, {
            templateUrl: "views/lotparking/list.html",
            controller: 'lotparkingListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/lotparking/scripts/lotparkingListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-场内停车--详情*/
        .state(StateName.lotparking.detail, {
            templateUrl: "views/lotparking/detail.html",
            controller: 'lotparkingDetailCtrl',
            params: { 'id': null, params: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/lotparking/scripts/lotparkingDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-停车记录--列表*/
        .state(StateName.parkingrecord.index, {
            templateUrl: "views/orderrecord/list.html",
            controller: 'parkingrecordListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/orderrecord/scripts/parkingrecordListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-停车记录--详情*/
        .state(StateName.parkingrecord.detail, {
            templateUrl: "views/orderrecord/detail.html",
            controller: 'parkingrecordDetailCtrl',
            params: { 'boId': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/orderrecord/scripts/parkingrecordDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-月卡购买订单--列表*/
        .state(StateName.mouthbuyorder.index, {
            templateUrl: "views/mouthbuyorder/list.html",
            controller: 'mouthbuyorderListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/mouthbuyorder/scripts/listCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-异常放行--列表*/
        .state(StateName.unusualpass.index, {
            templateUrl: "views/unusualpass/list.html",
            controller: 'unusualpassListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/unusualpass/scripts/unusualpassListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*停车管理-异常放行--详情*/
        .state(StateName.unusualpass.detail, {
            templateUrl: "views/unusualpass/detail.html",
            controller: 'unusualpassDetailCtrl',
            params: { 'id': null, params: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/unusualpass/scripts/unusualpassDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-订单记录--列表*/
        .state(StateName.payrecord.index, {
            templateUrl: "views/alreadypaytrade/list.html",
            controller: 'alreadypaytradeListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/alreadypaytrade/scripts/alreadypaytradeListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-订单记录--详情*/
        .state(StateName.payrecord.detail, {
            templateUrl: "views/alreadypaytrade/detail.html",
            controller: 'alreadypaytradeDetailCtrl',
            params: { 'traId': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/alreadypaytrade/scripts/alreadypaytradeDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-停车缴费记录--列表*/
        .state(StateName.parkpayrecord.index, {
            templateUrl: "views/parkpayrecord/list.html",
            controller: 'parkpayrecordListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/parkpayrecord/scripts/parkpayrecordListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-停车缴费记录--详情*/
        .state(StateName.parkpayrecord.detail, {
            templateUrl: "views/parkpayrecord/detail.html",
            controller: 'parkpayrecordDetailCtrl',
            params: { 'recordId': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/parkpayrecord/scripts/parkpayrecordDetailCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*财务管理-现金对账-现金交账记录*/
        .state(StateName.cashrecord.index, {
            templateUrl: "views/cashrecord/list-cash.html",
            controller: 'CashOrderList',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/CashOrderList.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-现金对账-差额记录*/
        .state(StateName.cashrecord.diffIndex, {
            templateUrl: "views/cashrecord/list-cashdiff.html",
            controller: 'CashDiffOrderList',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/CashDiffOrderList.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-现金对账-差额记录详情*/
        .state(StateName.cashrecord.diffDetail, {
            templateUrl: "views/cashrecord/list-diffdetail.html",
            controller: 'DiffDetailCtrl',
            params: { 'id': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/DiffDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-现金对账-已确认到账记录*/
        .state(StateName.cashrecord.havePayedIndex, {
            templateUrl: "views/cashrecord/list-cashverify.html",
            controller: 'CashVerifyOrderList',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/CashVerifyOrderList.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-现金对账-已确认到账记录--停车缴费记录*/
        .state(StateName.cashrecord.parkpayIndex, {
            templateUrl: "views/cashrecord/list-charge.html",
            controller: 'ChargeOrderList',
            params: { 'chargeDate': null, 'userCode': null, 'fromVerify': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/ChargeOrderList.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-现金对账-已确认到账记录--停车缴费记录--详情*/
        .state(StateName.cashrecord.parkpaydetail, {
            templateUrl: "views/cashrecord/list-chargedetail.html",
            controller: 'ChargeDetailCtrl',
            params: { 'id': null, 'userCode': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/cashrecord/scripts/ChargeDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-包月车充值*/
        .state(StateName.vipvehicle.index, {
            templateUrl: "views/vipvehicle/list.html",
            controller: 'vipvehicleListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/vipvehicle/scripts/vipvehicleListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-包月车充值--详情*/
        .state(StateName.vipvehicle.detail, {
            templateUrl: "views/vipvehicle/detail.html",
            controller: 'vipvehicleDetailCtrl',
            params: { 'orderCode': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/vipvehicle/scripts/vipvehicleDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-岗亭收费记录*/
        .state(StateName.sentrycharge.index, {
            templateUrl: "views/sentrychargerecord/list.html",
            controller: 'sentrychargeListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/sentrychargerecord/scripts/sentrychargeListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-岗亭收费记录--详情*/
        .state(StateName.sentrycharge.detail, {
            templateUrl: "views/sentrychargerecord/detail.html",
            controller: 'sentrychargeDetailCtrl',
            params: { 'id': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/sentrychargerecord/scripts/sentrychargeDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-月卡支付订单*/
        .state(StateName.mouthpayrecord.index, {
            templateUrl: "views/mouthpayrecord/list.html",
            controller: 'mouthpayrecordList',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-ui-datetime-picker/datetime-picker.js',
                            'views/mouthpayrecord/scripts/mouthpayrecordList.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-月卡支付订单--详情*/
        .state(StateName.mouthpayrecord.detail, {
            templateUrl: "views/mouthpayrecord/detail.html",
            controller: 'mouthpayrecordDetail',
            params: { 'orderCode': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/mouthpayrecord/scripts/mouthpayrecordDetail.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-开票历史*/
        .state(StateName.invoiceHistory.index, {
            templateUrl: "views/invoiceHistory/list.html",
            controller: 'invoiceHistoryListCtrl',
            params: { params: null, flg: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/invoiceHistory/scripts/invoiceHistoryListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*财务管理-开票历史--详情*/
        .state(StateName.invoiceHistory.detail, {
            templateUrl: "views/invoiceHistory/detail.html",
            controller: 'invoiceHistoryDetailCtrl',
            params: { 'recordCode': null, 'params': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/invoiceHistory/scripts/invoiceHistoryDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*运营报表-月卡充值报表*/
        .state(StateName.mouthcardreport.index, {
            templateUrl: "views/operateReport/list-mouthcard-report.html",
            controller: 'mouthcardListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/operateReport/scripts/mouthcardReportListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-停车次数报表*/
        .state(StateName.parkingNumreport.index, {
            templateUrl: "views/parkingnumReport/list.html",
            controller: 'parkingnumListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/parkingnumReport/scripts/parkingnumListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-支付方式收费报表*/
        .state(StateName.paywaychargereport.index, {
            templateUrl: "views/paywaychargeReport/list.html",
            controller: 'paywaychargeListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/paywaychargeReport/scripts/paywaychargeListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-支付方式收费报表*/
        .state(StateName.payterminalchargereport.index, {
            templateUrl: "views/payterminalchargeReport/list.html",
            controller: 'payterminalchargeListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/payterminalchargeReport/scripts/payterminalchargeListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*以下为mock数据*/

        /*运营报表-停车场停车收费报表*/
        .state(StateName.operateReport.indexPC, {
            templateUrl: "views/operateReport/list-charge-report.html",
            controller: 'parkChargeReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/operateReport/scripts/parkChargeReportCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*运营管理报表-泊位预约报表*/
        .state(StateName.operateReport.indexBOR, {
            templateUrl: "views/operateReport/list-berthOrder-report.html",
            controller: 'berthOrderReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/operateReport/scripts/berthOrderReportListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*收费报表-停车场收费报表*/
        .state(StateName.chargeReport.indexCC, {
            templateUrl: "views/chargeReport/list-parkingCharge-report.html",
            controller: 'parkingChargeListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/chargeReport/scripts/parkingChargeListCtrl.js',

                        ]
                    });
                }]
            }
        })
        /*收费报表-支付渠道报表*/
        .state(StateName.chargeReport.indexPT, {
            templateUrl: "views/chargeReport/list-payType-report.html",
            controller: 'PayTypeReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/chargeReport/scripts/payTypeReportListCtrl.js',

                        ]
                    });
                }]
            }
        })
        /*收费报表-支付终端报表*/
        .state(StateName.chargeReport.indexPTE, {
            templateUrl: "views/chargeReport/list-payTerminal-report.html",
            controller: 'payTerminalReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/chargeReport/scripts/payTerminalReportListCtrl.js',

                        ]
                    });
                }]
            }
        })

        /*清分结算-清算列表*/
        .state(StateName.clearscore.index, {
            templateUrl: "views/clearscore/list-score.html",
            controller: 'ScoreListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/clearscore/scripts/scoreListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*清分结算-异常数据*/
        .state(StateName.clearscore.indexE, {
            templateUrl: "views/clearscore/list-exception.html",
            controller: 'ExceptionListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/clearscore/scripts/exceptionListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*清分结算-搁置清单*/
        .state(StateName.clearscore.indeD, {
            templateUrl: "views/clearscore/list-delay.html",
            controller: 'DelayListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/clearscore/scripts/delayListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*清分结算-待结算清单*/
        .state(StateName.clearscore.indexR, {
            templateUrl: "views/clearscore/list-recharge.html",
            controller: 'RechargeListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/clearscore/scripts/rechargeListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*清分结算-已结算清单*/
        .state(StateName.clearscore.indexRD, {
            templateUrl: "views/clearscore/list-recharged.html",
            controller: 'RechargedListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/clearscore/scripts/rechargedListCtrl.js'
                        ]
                    });
                }]
            }
        })

        /*运营管理-优惠规则*/
        .state(StateName.couponRule.index, {
            templateUrl: "views/couponRule/list.html",
            controller: 'couponRuleListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/couponRule/scripts/couponRuleListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponRule.add, {
            templateUrl: "views/couponRule/add.html",
            controller: 'couponRuleAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/couponRule/scripts/couponRuleAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponRule.edit, {
            templateUrl: "views/couponRule/edit.html",
            controller: 'couponRuleEditCtrl',
            params: { 'couponRuleId': null, 'couponRuleType': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/couponRule/scripts/couponRuleEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponRule.detail, {
            templateUrl: "views/couponRule/detail.html",
            controller: 'couponRuleDetailCtrl',
            params: { 'couponRuleId': null, 'couponRuleType': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/couponRule/scripts/couponRuleDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*运营管理-优惠活动*/
        .state(StateName.couponActive.index, {
            templateUrl: "views/couponActive/list.html",
            controller: 'couponactiveListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/couponActive/scripts/couponactiveListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponActive.add, {
            templateUrl: "views/couponActive/add.html",
            controller: 'couponActiveAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/couponActive/scripts/couponactiveAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponActive.edit, {
            templateUrl: "views/couponActive/edit.html",
            controller: 'couponactiveEditCtrl',
            params: { 'couponActivityId': null, 'couponActivityType': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/couponActive/scripts/couponactiveEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.couponActive.detail, {
            templateUrl: "views/couponActive/detail.html",
            controller: 'couponactiveDetailCtrl',
            params: { 'couponActivityId': null, 'couponActivityType': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/couponActive/scripts/couponactiveDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*运营管理-优惠券领用记录*/
        .state(StateName.couponUseRecord.index, {
            templateUrl: "views/couponUseRecord/list.html",
            controller: 'couponUseRecordListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/couponUseRecord/scripts/couponUseRecordListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*运营管理-月卡设置*/
        .state(StateName.mouthcard.index, {
            templateUrl: "views/mouthcard/list.html",
            controller: 'mouthcardListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/mouthcard/scripts/mouthcardListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.mouthcard.add, {
            templateUrl: "views/mouthcard/add.html",
            controller: 'mouthcardAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/mouthcard/scripts/mouthcardAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.mouthcard.edit, {
            templateUrl: "views/mouthcard/edit.html",
            controller: 'mouthcardEditCtrl',
            params: { 'code': null, 'status': null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.min.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.min.js',
                            'views/mouthcard/scripts/mouthcardEditCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*运营管理-月卡购买记录*/
        .state(StateName.mouthcardbuy.index, {
            templateUrl: "views/mouthcardbuy/list.html",
            controller: 'mouthcarduseCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/mouthcardbuy/scripts/mouthcarduseCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.mouthcardbuy.detail, {
            templateUrl: "views/mouthcardbuy/detail.html",
            controller: 'mouthcardbuyDetailCtrl',
            params: { recordCode: null },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/mouthcardbuy/scripts/mouthcardbuyDetailCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.mouthcardbuy.add, {
            templateUrl: "views/mouthcardbuy/add.html",
            controller: 'mouthcardbuyAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/mouthcardbuy/scripts/mouthcardbuyAddCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*批量购买月卡*/
        .state(StateName.mouthcardbuy.countAdd, {
            templateUrl: "views/mouthcardbuy/countAdd.html",
            controller: 'monthcardbuyCountAdd',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/mouthcardbuy/scripts/monthcardbuyCountAdd.js'
                        ]
                    });
                }]
            }
        })
        /*车场管理-岗亭设置*/
        .state(StateName.sentryboxSet.index, {
            templateUrl: "views/sentryboxSet/list.html",
            controller: 'sentryboxSetCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/sentryboxSet/scripts/sentryboxSetCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*收费规则*/
        .state(StateName.payRule.index, {
            templateUrl: "views/payrule/list.html",
            controller: 'payruleListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/payrule/scripts/payruleListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.operaterTotalDayReprot.index, {
            templateUrl: "views/operateTotalDayReport/list.html",
            controller: 'operateTotalDayReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/laydate/theme/default/laydate.css',
                            'vender/laydate/laydate.js',
                            'views/operateTotalDayReport/scripts/operateTotalDayReportListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.operaterTotalMouthReprot.index, {
            templateUrl: "views/operateTotalMouthReport/list.html",
            controller: 'operateTotalMouthReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/laydate/theme/default/laydate.css',
                            'vender/laydate/laydate.js',
                            'views/operateTotalMouthReport/scripts/operateTotalMouthReportListCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state(StateName.operaterTotalYearReprot.index, {
            templateUrl: "views/operateTotalYearReport/list.html",
            controller: 'operateTotalReportListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'vender/laydate/theme/default/laydate.css',
                            'vender/laydate/laydate.js',
                            'views/operateTotalYearReport/scripts/operateTotalReportListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理--月卡购买终端报表*/
        .state(StateName.buyTerminalReprot.index, {
            templateUrl: "views/buyterminalReport/list.html",
            controller: 'buyterminalReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/buyterminalReport/scripts/buyterminalReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理--异常抬报表*/
        .state(StateName.unuaualpassReprot.index, {
            templateUrl: "views/unuaualpassReprot/list.html",
            controller: 'unusualpassReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/unuaualpassReprot/scripts/unusualpassReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理--各优惠券领用报表*/
        .state(StateName.eachCouponuseReprot.index, {
            templateUrl: "views/eachCouponuseReprot/list.html",
            controller: 'eachCouponuseReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/eachCouponuseReprot/scripts/eachCouponuseReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-泊位运营报表*/
        .state(StateName.berthManageReport.index, {
            templateUrl: "views/operateReport/list-berth-report.html",
            controller: 'berthOperateReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/operateReport/scripts/berthOperateReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-营业额报表*/
        .state(StateName.turnoverReport.index, {
            templateUrl: "views/turnoverReport/list.html",
            controller: 'turnoverReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/turnoverReport/scripts/turnoverReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*报表管理-停车场月卡购买报表*/
        .state(StateName.monthcardBuyReport.index, {
            templateUrl: "views/monthcarbuyReport/list.html",
            controller: 'monthcardbuyReportCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                            'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                            'vender/datatables/all.min.js',
                            'views/monthcarbuyReport/scripts/monthcardbuyReportCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*系统管理-消息中心--监控告警*/
        .state(StateName.monitorAlarm.index, {
            templateUrl: "views/monitorAlarm/list.html",
            controller: 'monitorAlarmListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'vender/datatables/all.min.js',
                            'views/monitorAlarm/scripts/monitorAlarmListCtrl.js'
                        ]
                    });
                }]
            }
        })
        /*车场管理-收费员资料*/
        .state(StateName.parklotuser.index, {
          templateUrl: "views/parklotuserMes/list.html",
          controller: 'parklotuserMesListCtrl',
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      files: [
                          'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                          'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                          'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                          'vender/datatables/all.min.js',
                          'views/parklotuserMes/scripts/parklotuserMesListCtrl.js'
                      ]
                  });
              }]
          }
      })
      .state(StateName.parklotuser.add, {
        templateUrl: "views/parklotuserMes/add.html",
        controller: 'parklotuserMesAddCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                        'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                        'views/parklotuserMes/scripts/parklotuserMesAddCtrl.js'
                    ]
                });
            }]
        }
    })
    .state(StateName.parklotuser.edit, {
        templateUrl: "views/parklotuserMes/edit.html",
        controller: 'parklotuserMesEditCtrl',
        params: { userCode: null },
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                        'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                        'vender/datatables/all.min.js',
                        'views/parklotuserMes/scripts/parklotuserMesEditCtrl.js'
                    ]
                });
            }]
        }
    })
    /*车场管理-收费员考勤记录*/
    .state(StateName.parklotuserCheck.index, {
        templateUrl: "views/parklotuserAttend/list.html",
        controller: 'parklotuserAttendListCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                        'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                        'vender/datatables/all.min.js',
                        'views/parklotuserAttend/scripts/parklotuserAttendListCtrl.js'
                    ]
                });
            }]
        }
    })
    /*车场管理-收费员实时考勤*/
    .state(StateName.parklotuserRealAttend.index, {
        templateUrl: "views/parklotuserRealAttend/list.html",
        controller: 'parklotuserRealListCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                        'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                        'vender/datatables/all.min.js',
                        'views/parklotuserRealAttend/scripts/parklotuserRealListCtrl.js'
                    ]
                });
            }]
        }
    })
    /*报表管理-年度收费报表*/
    .state(StateName.yearChargeReport.index, {
        templateUrl: "views/yearChargeReport/list.html",
        controller: 'yearChargeListCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'vender/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'vender/bootstrap-3.3.6/css/bootstrap-select.css',
                        'vender/bootstrap-3.3.6/js/bootstrap-select.js',
                        'vender/datatables/all.min.js',
                        'views/yearChargeReport/scripts/yearChargeListCtrl.js'
                    ]
                });
            }]
        }
    })

});

