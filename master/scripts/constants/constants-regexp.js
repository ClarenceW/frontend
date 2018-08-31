'use strict';

angular.module("constants").constant("RegExp", {
    // 只拦截数据交互请求
    authUrl: /[a-z]{1,20}_auth-frontend-inf($|\/).*/,
    roadUrl: /[a-z]{1,20}_dcroad-frontend-inf($|\/).*/,
    lotUrl: /[a-z]{1,20}_dclot-frontend-inf($|\/).*/,
    guideUrl: /[a-z]{1,20}_guide-frontend-inf($|\/).*/
});