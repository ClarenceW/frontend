'use strict';

appService.factory("parkingChargeReportService", function ($q, $http, Setting, $log) {

    let errorMsg = "数据加载异常...";
    let successMsg = "数据处理成功";

    let reqParkingReportPagination = data => {
        let deferred = $q.defer();
        $http({
            url: 'scripts/services/module/data/mockData-parkingCharge-report.json',
            method: 'GET',
        }).success(function (aaData) {
            let parkingName = $.trim(data.parkingName);
            let companyName = $.trim(data.companyName);
            let start = data.start;
            let length = data.length;
            let array = [];
            aaData.forEach(function (element) {
                if (parkingName || companyName) {
                    if(parkingName && companyName){
                        if (element.parkingName.includes(parkingName) && element.companyName.includes(companyName)) {
                            array.push(element);
                        }
                    }else if(parkingName && !companyName){
                        if (element.parkingName.includes(parkingName)) {
                            array.push(element);
                        }
                    }else if(companyName && !parkingName){
                        if (element.companyName.includes(companyName)) {
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
            }
            deferred.resolve(respData);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    };

    let exportData = data => {
        let deferred = $q.defer();
        $http({
            url: 'scripts/services/module/data/mockData-parkingCharge-report.json',
            method: 'GET',
        }).success(function (aaData) {
            let parkingName = data.parkingName;
            let companyName = data.companyName;
            let array = [];
            aaData.forEach(function (element) {
                if (parkingName || companyName) {
                    if(parkingName && companyName){
                        if (element.parkingName.includes(parkingName) && element.companyName.includes(companyName)) {
                            array.push(element);
                        }
                    }else if(parkingName && !companyName){
                        if (element.parkingName.includes(parkingName)) {
                            array.push(element);
                        }
                    }else if(companyName && !parkingName){
                        if (element.companyName.includes(companyName)) {
                            array.push(element);
                        }
                    }
                } else {
                    array.push(element);
                }
            });
            deferred.resolve(array);
        }).error(function () {
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    }


    return {
        reqParkingReportPagination: function (data) {
            return reqParkingReportPagination(data);
        },
        exportData: function (data) {
            return exportData(data);
        }
    }
});
