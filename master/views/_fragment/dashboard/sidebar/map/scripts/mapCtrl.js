'use strict';
angular.module('parkingApp').controller('MapCtrl', function ($timeout, sessionCache, growl, $rootScope, $scope, $compile, $http, Setting, mapService, $log, metronic) {
    var NUM_PER_SLIDE = 9;
    var BERTH_STATE_FULL = 1;
    var BERTH_STATE_EMPTY = 0;
    var SENSOR_STATE_OK = 0;
    var SENSOR_STATE_EXCEPTION = 1;
    var GATEWAY_STATE_OK = 0;
    var GATEWAY_STATE_EXCEPTION = 1;
    var TREE_STATUS_COLLAPSE = "collapse";
    var TREE_STATUS_EXPAND = "expand";
    var treeStatus = TREE_STATUS_COLLAPSE; // collapse or expand
    var subHandBarBox = "#subHandBarBox";
    var imgInfoSharpUrl = "views/_fragment/dashboard/sidebar/map/img/sharp.png";
    var imgMarkerParkingInfo = "views/_fragment/dashboard/sidebar/map/img/marker_parking_green.png";
    var imgMarkerParkingWarn = "views/_fragment/dashboard/sidebar/map/img/marker_parking_yellow.png";
    var imgMarkerParkingError = "views/_fragment/dashboard/sidebar/map/img/marker_parking_red.png";
    //var imgIconParkingInfo = "views/_fragment/dashboard/sidebar/map/img/icon_parking_blue.png";
    //var imgIconParkingWarn = "views/_fragment/dashboard/sidebar/map/img/icon_parking_yellow.png";
    //var imgIconParkingError = "views/_fragment/dashboard/sidebar/map/img/icon_parking_red.png";

    var mapIndexDiv = "#map_index";
    var parklotsDiv = "#parklots_div";
    var markerArray = [];
    var zoomLevel = 14;

    $scope.formData = {};
    $scope.formData.ledData = [];
    $scope.closeInfoWindow = closeInfoWindow;
    $(".wrapper").css("background-color","#E2E7ED");
    function setInitWidthAndHeight() {
        var targetHeight = $("#map_box").height();

        $("#container").height(targetHeight);
    }

    /** 地图相关变量定义 **/
    var map = new AMap.Map('container', {
        resizeEnable: true,
        mapStyle:'fresh',
        zoom: zoomLevel,
        center: Setting.MAP_CENTER
    });

    /**
     * 事件.清除地图上的信息窗体
     */
    function closeInfoWindow() {
        map.clearInfoWindow();
         $(".amap-marker").find("img").removeClass("bigShow");
    }

    /**
     * 实例化信息窗体
     * @type {AMap.InfoWindow}
     */
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: "waitting...",
        offset: new AMap.Pixel(255,0)
    });
    /***********************加载停车场信息****************************************/
    function loadParklotMark(){
        var data = {};
        data.dclotName = "";
        mapService.reqList(data).then(function(parklotList){
            if(parklotList.length > 0) {
                //var j=0;
                //for(var i=0;i<parklotList.length;i++){
                //    if(parklotList[i].berthNum){
                //        j++
                //    }
                //}
                //growl.addInfoMessage("成功加载[" + j + "]个停车场...", {ttl:2000});
                growl.addInfoMessage("成功加载[" + parklotList.length + "]个停车场...", {ttl:2000});
            }else {
                growl.addWarnMessage("无法匹配有效停车场...", {ttl:2000});
            }
            drawParklotMark(parklotList);
        }, function(msg){
            growl.addErrorMessage(msg, {ttl: 2000});
        });
        $scope.berthShow=true;
    }
    $scope.closeShow=function(){
        $scope.berthShow=false;
    }
    /** 绘制停车场marker **/
    function drawParklotMark(parklotList) {
        for (var i = 0; i < parklotList.length; i++) {
            var parklot = parklotList[i];
            var emptyNum = parklotList[i].emptyBerthNum;
            var berthNum = parklotList[i].totalBerthNum;
            var parkingMarker = getParklotMarkerStyle(emptyNum);
            if (parklot && parklot.lng && parklot.lat) {
                var marker = createParklotIconMarker(parkingMarker, 76, 100, [parklot.lng, parklot.lat], parklot.dclotName,parklot);
                marker.parklot = parklot;
                marker.on('click', markerParklotClick); //给Marker绑定单击事件
            }
        }
        map.setFitView("zoom:12");
    }

    /** 创建停车场标注 */
    function createParklotIconMarker(iconUrl, width, length, lngLat, name,parklot) {
        var icon = new AMap.Icon({
            image: iconUrl,//24px*24px
            //image : 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png',//24px*24px
            //icon可缺省，缺省时为默认的蓝色水滴图标，
            size: new AMap.Size(width, length)
        });
        var marker = new AMap.Marker({
            icon: icon,
            position: lngLat,
            title:name,
            extData:parklot
        });
       
        marker.setMap(map);
        return marker;
    }
    /** 根据停车场编号查看停车场详情 **/
    function markerParklotClick(e) {
        var marker = e.target;
        var parklot = marker.parklot;
        mapService.reqParklotByCode({"dclotCode": parklot.dclotCode}).then(function (dto) {
            var berthNum  = dto.totalBerthNum;
            var emptyNum  = dto.emptyBerthNum;
            // 先关闭打开的窗体
            $scope.closeInfoWindow();
            // 窗体加载数据
            drawParklotInfoWindow(parklot, dto, e.target.getPosition());
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
    }

    /**
     * 停车场详情窗口
     */
    function drawParklotInfoWindow(parklot, parklotInfo, position) {
        $scope.parklot = parklot;
        $scope.parklotInfo = parklotInfo;
        /** 窗体对象 **/
        var info = document.createElement("div");
        info.className = "map-info";
        // 创建窗体对象
        var top = $($("#parklotViewTopTemplate").html());
        var topLink = $compile(top);
        var topNode = topLink($scope);
        $(info).append(topNode);
        // 定义中部内容
        // 创建窗体对象-内容
        var ul = $($("#parklotSnapTemplate").html());
        var link = $compile(ul);
        var node = link($scope);
        $(info).append(node);
        // 定义底部内容
        //var bottom = document.createElement("div");
        //bottom.className = "map-info-bottom";
        //bottom.style.position = 'relative';
        //bottom.style.top = '0px';
        //bottom.style.margin = '0 auto';
        //var sharp = document.createElement("img");
        //sharp.src = imgInfoSharpUrl;
        //bottom.appendChild(sharp);
        //info.appendChild(bottom);
        infoWindow.setContent(info);
        infoWindow.open(map, position);
    }
    /** 停车场marker **/
    function getParklotMarkerStyle(emptyNum) {
        var parkingMarker = imgMarkerParkingInfo;
        if (emptyNum<6 && emptyNum > 0) {
            parkingMarker = imgMarkerParkingWarn;
        } else if(emptyNum > 5){
            parkingMarker = imgMarkerParkingInfo;
        }else if(emptyNum == 0){
            parkingMarker = imgMarkerParkingError;
        }
        return parkingMarker;
    }
    /** 停车场lable **/
    $scope.getParklotStyle = function (parklot) {
        var vehicleStyle = "imgIconParkingInfo";
        if (parklot.emptyNum < 6 && parklot.emptyNum > 0) {
            vehicleStyle = "imgIconParkingWarn";
        } else if(parklot.emptyNum == 0){
            vehicleStyle = "imgIconParkingError";
        }else if(parklot.emptyNum > 5){
            vehicleStyle = "imgIconParkingInfo";
        }
        return vehicleStyle;
    }
    /**
     * 搜索
     */
    $scope.search = function () {
        $scope.treeShow = true;
        treeStatus = TREE_STATUS_EXPAND;
            var key = $scope.formData.key;
            if (key) {
                $(parklotsDiv).jstree(true).search(key);
            } else {
                growl.addWarnMessage("请先输入关键字...", {ttl: 2000});
            }
    };
    /**焦点时*/
    $(".map_search input").on("input",function(){
        $scope.treeShow = true;
        treeStatus = TREE_STATUS_EXPAND;
    })
    //$scope.focus = function () {
    //    this.value='';
    //    $scope.treeShow = true;
    //    treeStatus = TREE_STATUS_EXPAND;
    //};
    //点击其它区域隐藏地图
    $(document).off("click.map.index").on("click.map.index", function (e) {
        var sourceEle = $(e.target);
        var searchBox = document.querySelector("#search_box");
        //var amapSugResultDiv = document.querySelector(".amap-sug-result");
        //var mapBtnSpanDom = document.querySelector(mapBtnSpan);
        if (searchBox != null && ($.contains(searchBox, sourceEle.get(0)))) { //点击搜索框区域，此处不处理
            return;
        } else if (treeStatus === TREE_STATUS_EXPAND) { //点击其他区域，且地图已打开，则关闭地图
            treeStatus = TREE_STATUS_COLLAPSE;
            $scope.treeShow = false;
            $scope.$digest();
             $(".amap-marker").find("img").removeClass("bigShow");
        } else {
            return;
        }
    });
    /**供查询使用的停车场名称**/
    $scope.load_parklots = function () {
        $scope.parklotsData = [];
        var data = {};
        data.dclotName = "";
        mapService.reqList(data).then(function(parklotList){
            if (parklotList.length > 0) {
                for (var i = 0; i < parklotList.length; i++) {
                    var parklot = parklotList[i];
                    $scope.parklotsData.push({
                        id: parklot.dclotCode,
                        text: parklot.dclotName,
                        //icon: "jstree-file",
                        type:"demo",
                        state: {
                            opened: true,
                            selected: false,
                            disabled: false
                        },
                        data: {
                            lat: parklot.lat,
                            lng: parklot.lng
                        }
                    });
                }
            }
            $rootScope.parklotsNum = $scope.parklotsData.length;
            $(parklotsDiv).jstree({
                "core": {
                    "animation": 0,
                    "multiple": true,
                    "strings": {
                        "Loading ...": "Please wait ..."
                    }
                },
                "types":{
                    "demo": {
                        "icon": "iconfont icon-bianhao myColor",
                    }
                },
                "plugins": ["search", "types", "sort"]
            });
            $(parklotsDiv).off("search.jstree").on("search.jstree", function (e, data) {
                //if (data && data.res && data.res.length > 0) {
                //    growl.addInfoMessage("匹配[" + data.res.length + "]个泊位...", {ttl: 2000});
                //} else {
                //    growl.addWarnMessage("无匹配数据...", {ttl: 2000});
                //}
            });
            $(parklotsDiv).jstree(true).settings.core.data = $scope.parklotsData;
            $(parklotsDiv).jstree(true).settings.core.check_callback = true;
            $(parklotsDiv).jstree(true).refresh();
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
    };
    /**
     * 选中树节点事件
     */
    $(parklotsDiv).off("select_node.jstree").on("select_node.jstree", function (e, data) {
       
        if (data && data.node) {
            var node = data.node;
            var nodeId = node.id; // 所选节点的id属性
            var nodeText = node.text;
            var nodeData = node.data;
            if (nodeText) {
                // $("div[title='"+nodeText+"']").find("img").css({"width":"76px","height":"100px"});
                // $("div[title='"+nodeText+"']").parent().siblings().find("img").css({"width":"56px","height":"72px"});
                $("div[title='"+nodeText+"']").find("img").addClass("bigShow");
                $("div[title='"+nodeText+"']").parent().siblings().find("img").removeClass("bigShow");
                map.setZoomAndCenter(16, [nodeData.lng, nodeData.lat]);
            }
        }
         treeStatus = TREE_STATUS_COLLAPSE;
        $scope.treeShow = false;
        $scope.$digest();
    });


    $timeout(function () {
        try{
    		 metronic.handleScrollers();
    	}catch(e){
    		window.location.reload();
    	}
        $(mapIndexDiv).css("height", window.document.body.offsetHeight - 80);
        setInitWidthAndHeight();
        loadParklotMark();
        $scope.load_parklots();
    }, 0);
})
;
