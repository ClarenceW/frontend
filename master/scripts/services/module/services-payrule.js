'use strict';

appService.factory("payruleService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = data => {
      let deferred = $q.defer();
      $http({
          url: 'scripts/services/module/data/mockData-payrule.json',
          method: 'GET',
      }).success(function (aaData) {
          let name = $.trim(data.name);
          let ruleType = $.trim(data.ruleType);
          let cartype = $.trim(data.cartype);
          let start = data.start;
          let length = data.length;
          let array = [];
          aaData.forEach(function (element) {
              if (name || ruleType || cartype) {
                  if(name) {
                    if (element.name.includes(name)) {
                      array.push(element);
                    }
                  }else if(ruleType) {
                    if (element.ruleType.includes(ruleType)) {
                      array.push(element);
                    }
                  }else if(cartype) {
                    if(element.cartype.includes(cartype)) {
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
