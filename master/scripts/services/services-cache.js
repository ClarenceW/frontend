'use strict';
(function () {
    /**
     *  缓存数据存取服务
     *  $sessionStorage.user
     *  $sessionStorage.menus
     *  $sessionStorage.dicts
     */
    appService.factory("sessionCache", function ($log, $sessionStorage,menuVariables) {
        var devStatus = "DEV_STATUS"; // 设备状态
        var sectionType = "SECTION_TYPE";// 路段类型
        var logType = "LOGTYPE"; // 日志类型
        var devType = "DEVICE_TYPE";//设备类型
        var attrLevel = "ATTRLEVEL";//诱导等级
        var areaLevel = "AREALEVEL";//区域等级
        var isOp = "ISOP";//运营情况
        var parklotAttr = "PARKLOTATTR";//停车场属性
        var parklotStyle = "PARKLOTSTYLE";//停车类型
        var parklotType = "PARKLOTTYPE";//停车类别
        var isFree = "ISFREE";//是否收费
        var userType = "USERTYPE";//用户类别
        var ledwordcolor = "LEDWORDCOLOR";//诱导屏颜色
        var companyOptType = "COMPANY_OPT_TYPE";//运营公司运营性质
        var companyCheckFlag = "COMPANY_CHECK_FLAG";//运营公司审核状态
        /**平台编号*/
        var platformCode=menuVariables.platformCode;
        /**
         *  清除缓存数据
         */
        var clean = function () {
            $sessionStorage.user = {};
            $sessionStorage.menus = {};
            $sessionStorage.dicts = {};
        };
        /**=========================================================
         * 2016.07.12 xhh 用户模块
         * initUser: 初始化本地用户缓存
         * inValid: 会话有效性,不通过返回true
         * getUserCode: 获取用户名称
         =========================================================*/
        var initUser = function (userData) {
            $sessionStorage.user = {};
            if (userData) {
                $sessionStorage.user = userData;
            }
        };

        var inValid = function () {
            return !$sessionStorage.user || !$sessionStorage.user.sid;
        };

        var getUserSid = function () {
            if ($sessionStorage.user) {
                return $sessionStorage.user.sid;
            }
            return null;
        };

        var getUserCode = function () {
            if ($sessionStorage.user) {
                return $sessionStorage.user.userCode;
            }
            return null;
        };

        var getDictsByLookupName = function(lookupName){
        	if(lookupName){
        		let dicts = $sessionStorage.dicts;
        		if(dicts){
        			return dicts.data[lookupName];
        		}else{
        			return [];
        		}
        	}else{
        		return [];
        	}
        }

        var getLookupValueByLookupName  = function(lookupName,lookupKey){
        	if(lookupName){
        		let dicts = $sessionStorage.dicts;
        		if(dicts){
        			let tmp = dicts.data[lookupName];
        			let _lookupVal = ""
        			for(let item of tmp){
        				if(item.lookupKey == lookupKey){
        					_lookupVal = item.lookupValue;
        				}
        			}
        			return _lookupVal;
        		}else{
        			return "";
        		}
        	}else{
        		return "";
        	}
        }

        /**=========================================================
         * 2016.07.12 xhh 菜单模块
         * initMenus: 初始化本地菜单缓存
         * getFirstMenus: 获取一级菜单
         * getSecMenus: 获取二级菜单
         * getThirdMenus: 获取三级菜单
         =========================================================*/
        var initMenus = function (menus) {
            $sessionStorage.menus = {};
            if (menus.size() > 0) {
                $sessionStorage.menus.data = menus.data;
                var firstMenus = getFirstMenus();
                if(firstMenus && firstMenus.length>0){
                	var m = firstMenus[0];
                	if(m /*&& m.uiSref === StateName.home*/){
                		 $sessionStorage.defualtUiSref = m.uiSref;
                	}
                }
            }
        };

        var getFirstMenus = function () {
            return $sessionStorage.menus.data[platformCode];
        };

        var getSecMenus = function (code) {
            return $sessionStorage.menus.data[code];
        };

        var getThirdMenus = function (code) {
            return $sessionStorage.menus.data[code];
        };

        /**=========================================================
         * 2016.07.12 xhh 数据字典模块
         * initDicts: 初始化本地数据字典缓存
         =========================================================*/
        var initDicts = function (dicts) {
            $sessionStorage.dicts = {};
            if (dicts.size() > 0) {
                $sessionStorage.dicts = dicts;
            }
        };

        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }
        /**设备状态组**/
        var getDevStatusGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[devStatus]) {
                return $sessionStorage.dicts.data[devStatus].sort(compare('lookupKey'));
            }
            return null;
        };

        /**设备状态值**/
        var getDevStatus = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[devStatus]) {
                var selectedItems = $sessionStorage.dicts.data[devStatus].filter(function (item) {
                    return (item.lookupName === devStatus && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        
        /**运营性质**/
        var getCompanyOptTypesGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[companyOptType]) {
                return $sessionStorage.dicts.data[companyOptType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**运营性质**/
        var getCompanyOptTypesValue = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[companyOptType]) {
                var selectedItems = $sessionStorage.dicts.data[companyOptType].filter(function (item) {
                    return (item.lookupName === companyOptType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        
         /**运营公司审核状态**/
        var getCompanyCheckFlagGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[companyCheckFlag]) {
                return $sessionStorage.dicts.data[companyCheckFlag].sort(compare('lookupKey'));
            }
            return null;
        };

        /**运营公司审核状态**/
        var getCompanyCheckFlagValue = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[companyCheckFlag]) {
                var selectedItems = $sessionStorage.dicts.data[companyCheckFlag].filter(function (item) {
                    return (item.lookupName === companyCheckFlag && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };

        /**路段类型组**/
        var getSectionTypeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[sectionType]) {
                return $sessionStorage.dicts.data[sectionType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**路段类型值**/
        var getSectionType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[sectionType]) {
                var selectedItems = $sessionStorage.dicts.data[sectionType].filter(function (item) {
                    return (item.lookupName === sectionType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };

        /**日志类型组**/
        var getLogTypeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[logType]) {
                return $sessionStorage.dicts.data[logType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**日志类型值**/
        var getLogType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[logType]) {
                var selectedItems = $sessionStorage.dicts.data[logType].filter(function (item) {
                    return (item.lookupName === logType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };

        /**设备类型组**/
        var getDevTypeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[devType]) {
                return $sessionStorage.dicts.data[devType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**设备类型值**/
        var getDevType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[devType]) {
                var selectedItems = $sessionStorage.dicts.data[devType].filter(function (item) {
                    return (item.lookupName === devType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**诱导等级组**/
        var getAttrLevelGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[attrLevel]) {
                return $sessionStorage.dicts.data[attrLevel].sort(compare('lookupKey'));
            }
            return null;
        };

        /**诱导等级值**/
        var getAttrLevelType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[attrLevel]) {
                var selectedItems = $sessionStorage.dicts.data[attrLevel].filter(function (item) {
                    return (item.lookupName === attrLevel && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**区域等级组**/
        var getAreaLevelGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[areaLevel]) {
                return $sessionStorage.dicts.data[areaLevel].sort(compare('lookupKey'));
            }
            return null;
        };

        /**区域等级值**/
        var getAreaLevelType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[areaLevel]) {
                var selectedItems = $sessionStorage.dicts.data[areaLevel].filter(function (item) {
                    return (item.lookupName === areaLevel && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**运营情况组**/
        var getIsOpGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[isOp]) {
                return $sessionStorage.dicts.data[isOp].sort(compare('lookupKey'));
            }
            return null;
        };

        /**运营情况**/
        var getIsOpType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[isOp]) {
                var selectedItems = $sessionStorage.dicts.data[isOp].filter(function (item) {
                    return (item.lookupName === isOp && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**停车场属性组**/
        var getParklotAttrGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotAttr]) {
                return $sessionStorage.dicts.data[parklotAttr].sort(compare('lookupKey'));
            }
            return null;
        };

        /**停车场属性**/
        var getParklotAttrType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotAttr]) {
                var selectedItems = $sessionStorage.dicts.data[parklotAttr].filter(function (item) {
                    return (item.lookupName === parklotAttr && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**停车场类型组**/
        var getParklotStyleGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotStyle]) {
                return $sessionStorage.dicts.data[parklotStyle].sort(compare('lookupKey'));
            }
            return null;
        };

        /**停车场类型**/
        var getParklotStyleType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotStyle]) {
                var selectedItems = $sessionStorage.dicts.data[parklotStyle].filter(function (item) {
                    return (item.lookupName === parklotStyle && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**停车场类别组**/
        var getParklotTypeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotType]) {
                return $sessionStorage.dicts.data[parklotType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**停车场类别**/
        var getParklotType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[parklotType]) {
                var selectedItems = $sessionStorage.dicts.data[parklotType].filter(function (item) {
                    return (item.lookupName === parklotType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**是否收费组**/
        var getIsFreeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[isFree]) {
                return $sessionStorage.dicts.data[isFree].sort(compare('lookupKey'));
            }
            return null;
        };

        /**是否收费**/
        var getIsFreeType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[isFree]) {
                var selectedItems = $sessionStorage.dicts.data[isFree].filter(function (item) {
                    return (item.lookupName === isFree && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };
        /**诱导屏颜色组**/
        var getLedColorGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[ledwordcolor]) {
                return $sessionStorage.dicts.data[ledwordcolor].sort(compare('lookupKey'));
            }
            return null;
        };

        /**诱导屏颜色类别**/
        var getLedColorType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[ledwordcolor]) {
                var selectedItems = $sessionStorage.dicts.data[ledwordcolor].filter(function (item) {
                    return (item.lookupName === ledwordcolor && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };

        /**用户类别组**/
        var getUserTypeGroup = function () {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[userType]) {
                return $sessionStorage.dicts.data[userType].sort(compare('lookupKey'));
            }
            return null;
        };

        /**用户类别**/
        var getUserType = function (lookupKey) {
            if ($sessionStorage.dicts.data && $sessionStorage.dicts.data[userType]) {
                var selectedItems = $sessionStorage.dicts.data[userType].filter(function (item) {
                    return (item.lookupName === userType && item.lookupKey == lookupKey);
                });
                if (selectedItems.length > 0) {
                    return selectedItems[0].lookupValue;
                }
            }
            return null;
        };


        return {
            // 全局
            clean: clean,
            // 用户
            initUser: initUser,
            inValid: inValid,
            getUserCode: getUserCode,
            getUserSid: getUserSid,
            // 菜单
            initMenus: initMenus,
            getFirstMenus: getFirstMenus,
            getSecMenus: getSecMenus,
            getThirdMenus: getThirdMenus,
            // 数字字典
            initDicts: initDicts,
            // 设备状态
            getDevStatusGroup: function () {
                return getDevStatusGroup();
            },
            getDevStatus: function (a) {
                return getDevStatus(a);
            },
            getSynMethod: function (a) {
                return getSynMethod(a);
            },
            // 路段类型返回
            getSectionTypeGroup: function () {
                return getSectionTypeGroup();
            },
            getSectionType: function (a) {
                return getSectionType(a);
            },
            // 日志类型
            getLogTypeGroup: function () {
                return getLogTypeGroup();
            },
            getLogType: function (a) {
                return getLogType(a);
            },

            //设备类型
            getDevTypeGroup: function () {
                return getDevTypeGroup();
            },
            getDevType: function (a) {
                return getDevType(a);
            },
            //诱导等级
            getAttrLevelGroup: function () {
                return getAttrLevelGroup();
            },
            getAttrLevelType: function (a) {
                return getAttrLevelType(a);
            },
            //运营情况
            getIsOpGroup:function(){
                return getIsOpGroup();
            },
            getIsOpType:function(data){
                return getIsOpType(data);
            },
            //停车场属性
            getParklotAttrGroup:function(){
                return getParklotAttrGroup();
            },
            getParklotAttrType:function(data){
                return getParklotAttrType(data);
            },
            //停车场类型
            getParklotStyleGroup:function(){
                return getParklotStyleGroup();
            },
            getParklotStyleType: function (data) {
                return getParklotStyleType(data);
            },
            //停车场类别
            getParklotTypeGroup:function(){
                return getParklotTypeGroup();
            },
            getParklotType: function (data) {
                return getParklotType(data);
            },
            //是否收费
            getIsFreeGroup:function(){
                return getIsFreeGroup();
            },
            getIsFreeType:function(data){
                return getIsFreeType(data)
            },
            //用户类别
            getUserTypeGroup:function(){
                return getUserTypeGroup();
            },
            getUserType:function(data){
                return getUserType(data);
            },
            //区域等级
            getAreaLevelGroup:function(){
                return getAreaLevelGroup();
            },
            getAreaLevelType:function(data){
                return getAreaLevelType(data)
            },
            //显示单元颜色
            getLedColorGroup:function(){
                return getLedColorGroup();
            },
            getLedColorType:function(data){
                return getLedColorType(data);
            },
            getCompanyOptTypesGroup:function(){
            	return getCompanyOptTypesGroup();
            },
            getCompanyOptTypesValue:function(data){
            	return getCompanyOptTypesValue(data);
            },
            getCompanyCheckFlagGroup:function(){
            	return getCompanyCheckFlagGroup();
            },
            getCompanyCheckFlagValue:function(data){
            	return getCompanyCheckFlagValue(data);
            },
            getDictsByLookupName:function(lookupKey){
            	return getDictsByLookupName(lookupKey);
            },
            getLookupValueByLookupName:function(lookupName,lookupKey){
            	return getLookupValueByLookupName(lookupName,lookupKey);
            },
        };
    });
})();



