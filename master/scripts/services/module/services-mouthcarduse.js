'use strict';

appService.factory("mouthcarduseService", function ($q, $http, Setting, $log,sessionCache) {

    let errorMsg = "数据加载异常...";

    let reqPagination = data => {
      let deferred = $q.defer();
      $http({
          url: 'scripts/services/module/data/mockData-mouthcarduse.json',
          method: 'GET',
      }).success(function (aaData) {
          let cardName = $.trim(data.cardName);
          let contactNumber = $.trim(data.contactNumber);
          let cardtype = $.trim(data.cardtype);
          let start = data.start;
          let length = data.length;
          let array = [];
          aaData.forEach(function (element) {
              if (cardName || contactNumber || cardtype) {
                  if(cardName) {
                    if (element.cardName.includes(cardName)) {
                      array.push(element);
                    }
                  }else if(contactNumber) {
                    if (element.contactNumber.includes(contactNumber)) {
                      array.push(element);
                    }
                  }else if(cardtype) {
                    if(element.cardtype.includes(cardtype)) {
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
