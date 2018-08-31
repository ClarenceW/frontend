'use strict';

angular.module('parkingApp').controller('SectionEditCtrl', function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sectionService, sessionCache) {

    var indexId = "#sectionEditIndex";
    var mapOpenBtn = indexId + " #mapOpenBtn";
    var mapBtnSpan = indexId + " #mapBtnSpan";
    var mapWrapper = indexId + " #mapWrapper";
    var mapContainerId = "mapContainer";
    var MAP_STATUS_COLLAPSE = "collapse";
    var MAP_STATUS_EXPAND = "expand";
    var mapStatus = MAP_STATUS_COLLAPSE; // collapse or expand
    var mapRange = {width: 450, height: 350};

    $scope.formData = {};
    $scope.cantonOptions = [];
    $scope.areaOptions = [];
    $scope.stateGoIndex = StateName.section.index;

    $scope.sectionTypeOption = sessionCache.getSectionTypeGroup();
    $scope.isOpOption=sessionCache.getIsOpGroup();

    sectionService.reqDetail($state.params).then(function (dto) {
        fillForm(dto.data);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    $scope.submitForm = function (isValid) {
        if (isValid) {
            sectionService.updateSection($scope.formData).then(function (msg) {
                growl.addInfoMessage("路段信息修改成功！", {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        } else {
            $scope.alertDanger = true;
        }
    };

    function fillForm(dto) {
        $scope.formData.sectionCode = dto.sectionCode;
        $scope.formData.name = dto.name;
        $scope.formData.lat = dto.lat;
        $scope.formData.lng = dto.lng;
        $scope.formData.description = dto.description;
        $scope.formData.address = dto.address;
        $scope.formData.berthNum = dto.berthNum;
        $scope.formData.districtCode = dto.districtCode;
        $scope.formData.areaCode = dto.areaCode;
        $scope.formData.companyCode = dto.companyCode;
        $scope.formData.isOp = dto.isOp + "";
    }

    // 创建地图
    var map = new AMap.Map(mapContainerId, {
        resizeEnable: true,
        center: [120.13, 33.38],
        zoom: 12,//地图显示的缩放级别
        keyboardEnable: false
    });

    var marker = new AMap.Marker({
        map: map,
        bubble: true
    });

    map.on('click', function (e) {
        $scope.formData.lat = e.lnglat.getLat();
        $scope.formData.lng = e.lnglat.getLng();
        marker.setPosition(e.lnglat);
        $scope.$digest();
    });

    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {

        // 由于搜索功能的下拉选项div在每次加载controller时主页面会重复加载.amap-sug-result
        $(".amap-sug-result").remove();

        var autoOptions = {
            city: "盐城", //城市，默认全国
            input: "keyword"//使用联想输入的input的id
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            city: '盐城',
        });
        AMap.event.addListener(autocomplete, "select", function (e) {
            placeSearch.search(e.poi.name, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    var poiList = result.poiList;
                    if (poiList && poiList.pois && poiList.pois.length > 0) {
                        var poi = poiList.pois[0];
                        if (poi && poi.location && poi.location.lat && poi.location.lng) {
                            marker.setPosition([poi.location.lng, poi.location.lat]);
                            map.setCenter([poi.location.lng, poi.location.lat]);
                            map.setZoom(12);
                            $scope.formData.lat = poi.location.lat;
                            $scope.formData.lng = poi.location.lng;
                            $scope.$digest();
                        }
                    } else {
                        growl.addErrorMessage("搜索无匹配数据...", {ttl: 2000});
                        $log.warn(result);
                    }
                } else {
                    growl.addErrorMessage("搜索返回失败...", {ttl: 2000});
                    $log.error(result);
                }
            });
        });
    });

    //展示地图
    $scope.mapClose = function () {
        $scope.mapShow = false;
        mapStatus = MAP_STATUS_COLLAPSE;
    };
    $scope.mapContainerStyle = {width: mapRange.width + "px", height: mapRange.height + "px"};
    $scope.openMap = function ($event) {
        $scope.mapShow = true;
        $scope.mapContainerStyle.top = getMapTop($event.offsetY, $event.clientY);
        $scope.mapContainerStyle.left = getMapLeft($event.offsetX, $event.clientX, $event.currentTarget.clientWidth);
        if ($scope.formData.lng && $scope.formData.lat) {
            marker.setPosition([$scope.formData.lng, $scope.formData.lat]);
        }
        mapStatus = MAP_STATUS_EXPAND;
        //if($scope.formData.parklotsCoor != null && $scope.formData.parklotsCoor.indexOf(",") > 0) {
        //    var coors = $scope.formData.lat.split(",");
        //    map.setCenter(new AMap.LngLat(coors[0], coors[1]));
        //    map.setZoom(16);
        //}
    };

    //点击其它区域隐藏地图
    $(document).off("click.section.add").on("click.section.add", function (e) {
        var sourceEle = $(e.target);
        var mapContainerDiv = document.querySelector("#" + mapContainerId);
        var amapSugResultDiv = document.querySelector(".amap-sug-result");
        var mapBtnSpanDom = document.querySelector(mapBtnSpan);
        if (mapContainerDiv != null && ($.contains(mapContainerDiv, sourceEle.get(0)) || $.contains(amapSugResultDiv, sourceEle.get(0)))) { //点击地图区域，此处不处理
            return;
        } else if (mapBtnSpanDom != null && $.contains(mapBtnSpanDom, sourceEle.get(0))) { //点击打开地图按钮区域，此处不处理，交给mapOpen处理
            return;
        } else if (mapStatus === MAP_STATUS_EXPAND) { //点击其他区域，且地图已打开，则关闭地图
            mapStatus = MAP_STATUS_COLLAPSE;
            $scope.mapShow = false;
            $scope.$digest();
        } else {
            return;
        }
    });

    function getMapTop(offsetY, clientY, clientHeight) {
        var top = clientY - offsetY - mapRange.height;
        if (top < 0) {
            mapRange.height + 50;
        }
        return top;
    }

    function getMapLeft(offsetX, clientX, clientWidth) {
        return clientX + (clientWidth - offsetX) + 5;
    }

});
