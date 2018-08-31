##自定义插件-日期格式化
   .state("dashboard.operation.test", {  // 运营
            url: "/test",
            templateUrl: "views/angle/spinners.html",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'vender/angle/app.css',
                            'vender/whirl/dist/whirl.css',
                            'vender/loaders.css/loaders.css',
                            'vender/spinkit/css/spinkit.css',
                        ]
                    });
                }]
            }
        })