'use strict';

// Mock.mockjax(angular.module('parkingApp'));

var MockUtil = function () {
    return {
        fromUrl: function (url, parameterName) {
            var startStr = parameterName + "=";
            var startIndex = url.indexOf(startStr);
            if (startIndex != -1) {
                startIndex += startStr.length
            } else {
                return "";
            }
            var tempUrl = url.substring(startIndex, url.length).trim();
            var endIndex = tempUrl.indexOf("&");
            if (endIndex != -1) {
                return decodeURIComponent(tempUrl.substring(0, endIndex));
            }
            return decodeURIComponent(tempUrl.substring(0, tempUrl.length));
        },
        fromJson: function (body) {
            return angular.fromJson(body);
        },
        isUndefinedOrNullOrEmpty: function (value) {
            return angular.isUndefined(value) || value == null || value == "";
        }
    };
}();


