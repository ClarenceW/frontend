'use strict';

appService.factory("sentryboxsetService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = data => {
      let deferred = $q.defer();
      $http({
          url: 'scripts/services/module/data/mockData-sentryboxset.json',
          method: 'GET',
      }).success(function (aaData) {
          let sentryboxName = $.trim(data.sentryboxName);
          let parklotName = $.trim(data.parklotName);
          let start = data.start;
          let length = data.length;
          let array = [];
          aaData.forEach(function (element) {
              if (sentryboxName || parklotName) {
                  if(sentryboxName) {
                    if (element.sentryboxName.includes(sentryboxName)) {
                      array.push(element);
                    }
                  }else if(parklotName) {
                    if (element.parklotName.includes(parklotName)) {
                      array.push(element);
                    }
                  }
              } else {
                  array.push(element);
              }
          });
          let respData = {
              "iTotalRecords": array.length,
              "iTotalDisplayRecords": array.length,
              "aaData": array.length > length ? array.slice(start, start + length) : array
          };
          deferred.resolve(respData);
      }).error(function () {
          deferred.reject(errorMsg);
      });
      return deferred.promise;
    };

    return {
        reqPagination: function (data) {
            return reqPagination(data);
        },
    }
});
