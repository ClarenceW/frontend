'use strict';

var parkingApp = angular.module('parkingApp', [
    "ui.router",
    "ui.bootstrap",
    "angular-growl",
    "oc.lazyLoad",
    "ngSanitize",
    "ngAnimate",
    "coding",
    "app.elements",
    "angularMoment",
    "frapontillo.bootstrap-switch",
    "ngFileUpload"
]);

angular.module("constants", []);
angular.module("directives", []);
angular.module("coding", ["constants", "directives", "services","ngCookies"]);

/**=========================================================
 * 2016.07.12 xhh ����blockUI���
 *
 *
 *
 *
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.elements', ["oitozero.ngSweetAlert","blockUI","ngStorage"]);
})();



