'use strict';

appService.factory('userInterceptor', function ($rootScope, $q, Setting, $log, sessionCache, Result, RegExp, Event) {
    return {
        request: function (config) {
            if (config.url.match(RegExp.authUrl)
                || config.url.match(RegExp.roadUrl)
                || config.url.match(RegExp.lotUrl)
                || config.url.match(RegExp.guideUrl)) {
                if (!config.params) {
                    config.params = {}
                }
                var code = sessionCache.getUserCode();
                var token = sessionCache.getUserSid();
                if (code && token) {
                    var timestamp = new Date().formatDay2();
                    var signature = Sha1.signature(code, timestamp, token);
                    config.headers["X-Token"] = `code=${code};timestamp=${timestamp};signature=${signature};`;
                    //config.headers["X-Token"] = "code=" + code + ";" + "timestamp=" + timestamp + ";token=" + token + ";signature=" + signature + ";";
                }
            }
            return config;
        },
        response: function (response) {
            // $log.debug("############################## response:" + response.config.url);
            if (response.config.url.match(RegExp.authUrl)
                || response.config.url.match(RegExp.roadUrl)
                || response.config.url.match(RegExp.lotUrl)
                || response.config.url.match(RegExp.guideUrl)) {
                if (response.data["code"] == Result.code.notLogin || response.data["code"] == Result.code.sessionTimeout) {
                    $rootScope.$emit(Event.login, response.data["msg"]);
                }
            }
            return response;
        },
        responseError: function (response) {
            // $log.debug("############################## responseError:" + response.config.url);
            return $q.reject(response);
        }
    };
});




