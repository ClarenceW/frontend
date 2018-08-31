'use strict';

/** **/
appService.factory("metronic", function () {

    var handleScrollers = function () {
        Metronic.initSlimScroll('.scroller');
    };

    return {
        handleScrollers: handleScrollers
    }
});
