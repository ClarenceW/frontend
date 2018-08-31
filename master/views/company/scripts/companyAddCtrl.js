'use strict';

angular.module('parkingApp').controller('companyAddCtrl', [
	'$rootScope', '$scope', '$http', '$state', 'growl', 'companyService','districtService', 'sessionCache', 'StateName','Upload','$timeout','Setting',
	function($rootScope, $scope, $http, $state, growl, companyService,districtService, sessionCache, StateName,Upload,$timeout,Setting) {

		var indexId = "#companyAdd";
		var mapOpenBtn = indexId + " #mapOpenBtn";
		var mapBtnSpan = indexId + " #mapBtnSpan";
		var mapWrapper = indexId + " #mapWrapper";
		var mapContainerId = "mapContainer";
		var MAP_STATUS_COLLAPSE = "collapse";
		var MAP_STATUS_EXPAND = "expand";
		var mapStatus = MAP_STATUS_COLLAPSE; // collapse or expand
		var mapRange = { width: 450, height: 350 };
		$scope.formData = {};
		$scope.alertDanger;
		$scope.stateGoIndex = StateName.company.index;
		$scope.stateGoEdit = StateName.company.edit;
		$scope.stateGoAdd = StateName.company.add;
		$scope.formData.districtCode="";
		$scope.companyOptTypesOptions = sessionCache.getCompanyOptTypesGroup();
		$scope.companyCheckFlagOptions = sessionCache.getCompanyCheckFlagGroup();
		$scope.districtCodeOptions = [];
		
		districtService.reqList().then(function(res){
			$scope.districtCodeOptions = res;
		})

		$scope.alertClose = function() {
			$scope.alertDanger = false;
		}

		$scope.submitForm = function(isValid) {
			if(isValid) {
				companyService.reqAddCompany($scope.formData).then(function(msg) {
					growl.addInfoMessage("运营公司新增成功", { ttl: 2000 });
					$state.go($scope.stateGoIndex);
				}, function(msg) {
					growl.addErrorMessage(msg, { ttl: 2000 });
				});
			} else {
				$scope.alertDanger = true;
			}
		};

		// 创建地图
		var map = new AMap.Map(mapContainerId, {
			resizeEnable: true,
			center: Setting.MAP_CENTER,
			zoom: 12, //地图显示的缩放级别
			keyboardEnable: false
		});

		var marker = new AMap.Marker({
			map: map,
			bubble: true
		});

		map.on('click', function(e) {
			$scope.formData.lat = e.lnglat.getLat();
			$scope.formData.lng = e.lnglat.getLng();
			marker.setPosition(e.lnglat);
			$scope.$digest();
		});

		AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {

			// 由于搜索功能的下拉选项div在每次加载controller时主页面会重复加载.amap-sug-result
			$(".amap-sug-result").remove();

			var autoOptions = {
				city: "盐城", //城市，默认全国
				input: "keyword" //使用联想输入的input的id
			};
			var autocomplete = new AMap.Autocomplete(autoOptions);
			var placeSearch = new AMap.PlaceSearch({
				city: '盐城',
			});
			AMap.event.addListener(autocomplete, "select", function(e) {
				placeSearch.search(e.poi.name, function(status, result) {
					if(status === 'complete' && result.info === 'OK') {
						var poiList = result.poiList;
						if(poiList && poiList.pois && poiList.pois.length > 0) {
							var poi = poiList.pois[0];
							if(poi && poi.location && poi.location.lat && poi.location.lng) {
								marker.setPosition([poi.location.lng, poi.location.lat]);
								map.setCenter([poi.location.lng, poi.location.lat]);
								map.setZoom(12);
								$scope.formData.lat = poi.location.lat;
								$scope.formData.lng = poi.location.lng;
								$scope.$digest();
							}
						} else {
							growl.addErrorMessage("搜索无匹配数据...", { ttl: 2000 });
							$log.warn(result);
						}
					} else {
						growl.addErrorMessage("搜索返回失败...", { ttl: 2000 });
						$log.error(result);
					}
				});
			});
		});

		//展示地图
		$scope.mapClose = function() {
			$scope.mapShow = false;
			mapStatus = MAP_STATUS_COLLAPSE;
		}
		$scope.mapContainerStyle = { width: mapRange.width + "px", height: mapRange.height + "px" };
		$scope.openMap = function($event) {
			$scope.mapShow = true;
			$scope.mapContainerStyle.top = getMapTop($event.offsetY, $event.clientY);
			$scope.mapContainerStyle.left = getMapLeft($event.offsetX, $event.clientX, $event.currentTarget.clientWidth);
			mapStatus = MAP_STATUS_EXPAND;

			//if($scope.formData.parklotsCoor != null && $scope.formData.parklotsCoor.indexOf(",") > 0) {
			//    var coors = $scope.formData.lat.split(",");
			//    map.setCenter(new AMap.LngLat(coors[0], coors[1]));
			//    map.setZoom(16);
			//}
		};

		//点击其它区域隐藏地图
		$(document).off("click.section.add").on("click.section.add", function(e) {
			var sourceEle = $(e.target);
			var mapContainerDiv = document.querySelector("#" + mapContainerId);
			var amapSugResultDiv = document.querySelector(".amap-sug-result");
			var mapBtnSpanDom = document.querySelector(mapBtnSpan);
			if(mapContainerDiv != null && ($.contains(mapContainerDiv, sourceEle.get(0)) || $.contains(amapSugResultDiv, sourceEle.get(0)))) { //点击地图区域，此处不处理
				return;
			} else if(mapBtnSpanDom != null && $.contains(mapBtnSpanDom, sourceEle.get(0))) { //点击打开地图按钮区域，此处不处理，交给mapOpen处理
				return;
			} else if(mapStatus === MAP_STATUS_EXPAND) { //点击其他区域，且地图已打开，则关闭地图
				mapStatus = MAP_STATUS_COLLAPSE;
				$scope.mapShow = false;
				$scope.$digest();
			} else {
				return;
			}
		});

		function getMapTop(offsetY, clientY, clientHeight) {
			var top = clientY - offsetY - mapRange.height;
			if(top < 0) {
				mapRange.height + 50;
			}
			return top;
		}

		function getMapLeft(offsetX, clientX, clientWidth) {
			return clientX + (clientWidth - offsetX) + 5;
		}
		
		
		$scope.formData.pic1 = "";
	    $scope.formData.pic2 = "";
	    $scope.formData.pic3 = "";
	    
	    $scope.formData.default = "img/zhtc.png";
	    
	    $scope.delPic = function(index){
	    	if(index===1){
	    		$scope.formData.pic1 = "";
	            $scope.formData.picUrl1 = "";
	    	}
	    	
	    	if(index===2){
	    		$scope.formData.pic2 = "";
	    		$scope.formData.picUrl2 = "";
	    	}
	    	
	    	if(index===3){
	    		$scope.formData.pic3 = "";
	    		$scope.formData.picUrl3 = "";
	    	}
	    }
      //文件上传
	    $scope.uploadFiles = function(file, errFiles,index){
	        $scope.f = file;
	        //运营公司-图片规则： 00+YYMMDDHHmmss+3+（1|2|3）
	        var time = (new Date()).format("yyMMddhhmmss");
	        var preff = file.name.slice(file.name.lastIndexOf("."));
	        var prev = "00";
	        var newName = prev+time +"3" + index + preff;
	        Upload.rename(file,newName);
	        $scope.errFile = errFiles && errFiles[0];
	        if (file) {
	            file.upload = Upload.upload({
	                url: Setting.SERVER.UPLOAD,
	                data: {file: file}
	            });
	            file.upload.then(function (response) {
	            	//debugger;
	                $timeout(function () {
	                    file.result = response.data;
	                    if(index === 1){
	                    	$scope.formData.picUrl1=Setting.SERVER.DOWNLOAD+"?file="+newName;
	                    	$scope.formData.pic1 = newName;
	                    }else if(index === 2){
	                    	$scope.formData.picUrl2=Setting.SERVER.DOWNLOAD+"?file="+newName;
	                    	$scope.formData.pic2 = newName;
	                    }else if(index === 3){
	                    	$scope.formData.picUrl3=Setting.SERVER.DOWNLOAD+"?file="+newName;
	                    	$scope.formData.pic3 = newName;
	                    }
	                });
	            }, function (response) {
	                if (response.status > 0)
	                    $scope.errorMsg = response.status + ': ' + response.data;
	            }, function (evt) {
	                file.progress = Math.min(100, parseInt(100.0 *
	                    evt.loaded / evt.total));
	            });
	        }
	    }
	}
]);