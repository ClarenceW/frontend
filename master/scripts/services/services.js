'use strict';
var appService = angular.module("services", ["ngResource"]);

appService.factory("customerService", function ($uibModal, Setting,$rootScope) {

    var isUndefinedOrNullOrEmpty = function (value) {
        return angular.isUndefined(value) || value == null || value == "";
    };

    var trimToEmpty = function () {
        return isUndefinedOrNullOrEmpty(value) ? "" : value;
    };

    var isDataTableExist = function (tableId) {
        return $.fn.DataTable.isDataTable(tableId);
    };
    var initUniform = function (tableId) {
        var checkboxSelector = tableId + " input[type=checkbox]:not(.toggle)";
        var tdSelector = tableId + " tbody>tr>td:not(:first-child)";
        var checkboxCls = ".checkboxes";
        Metronic.initUniform(checkboxSelector); // 渲染其它列的样式
        $(tableId).find('.group-checkable').change(function () {
            var set = $(this).attr("data-set");
            var checked = $(this).is(":checked");
            $(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                } else {
                    $(this).prop("checked", false);
                }
            });
            $.uniform.update(set);
        });
        $(tdSelector).off("click").on("click", function () {
            var checkbox = $(this).closest("tr").find(checkboxCls);
            var checked = checkbox.is(":checked");
            if (!checked) {
                checkbox.prop("checked", true);
            } else {
                checkbox.prop("checked", false);
            }
            $.uniform.update(checkbox);
        });
    };

    var initUniform2 = function (tableId) {
        var checkboxSelector = tableId + " input[type=checkbox]:not(.toggle)";
        var tdSelector = tableId + " tbody>tr>td:not(:first-child)";
        var checkboxCls = ".checkboxes";
        Metronic.initUniform(checkboxSelector); // 渲染其它列的样式
        $(tableId).find('.group-checkable').change(function () {
            var set = $(this).attr("data-set");
            var checked = $(this).is(":checked");
            $(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                } else {
                    $(this).prop("checked", false);
                }
            });
            $.uniform.update(set);
        });
    };

    var openConfirmModal = function (title) {
        $uibModal.open({
            templateUrl: 'tpls/confirmModal.html',
            controller: 'ConfirmModalInstanceCtrl',
            size: 'sm',
            resolve: {
                options: function () {
                    return {
                        title: title,
                        message: "请选择一条记录",
                        confirmMessage: "知道了",
                        mode: Setting.CONFIRM_MODE_NOTICE
                    };
                }
            }
        });
    };

    //多条选择
    var openMultiConfirmModal = function (title) {
        $uibModal.open({
            templateUrl: 'tpls/confirmModal.html',
            controller: 'ConfirmModalInstanceCtrl',
            size: 'sm',
            resolve: {
                options: function () {
                    return {
                        title: title,
                        message: "请至少选择一条记录",
                        confirmMessage: "知道了",
                        mode: Setting.CONFIRM_MODE_NOTICE
                    };
                }
            }
        });
    };

    var modalInstance = function (title, message) {
        return $uibModal.open({
            templateUrl: 'tpls/confirmModal.html',
            controller: 'ConfirmModalInstanceCtrl',
            size: 'sm',
            resolve: {
                options: function () {
                    return {
                        title: title,
                        message: message,
                        confirmMessage: "确认",
                        cancelMessage: "取消",
                        mode: Setting.CONFIRM_MODE_CONFIRM
                    };
                }
            }
        });
    };
    
    var initTitle = function(){
    	$rootScope.titles = {};
    	var firstTitle = $("a[class*='active']").attr("title");
    	if(firstTitle){
    		$rootScope.titles.firstTitle = firstTitle;
    	}else {
    		$rootScope.titles.firstTitle = "";
    	}
    	
    	var secTitle = $("li[class='ng-scope open active']").find("span[class='menu-title ng-binding']").text();
    	if(secTitle){
    		$rootScope.titles.secTitle = secTitle;
    	}else {
    		$rootScope.titles.secTitle = "";
    	}
    	var thirdTitle = $("li[class='ng-scope active']").find("a").eq(0).text();
    	
    	if(thirdTitle){
    		$rootScope.titles.thirdTitle = thirdTitle;
    	}else {
    		$rootScope.titles.thirdTitle = "";
    	}
    }

    var _handleFancyBox = function () {
        $('.fancybox-button,.fancybox').fancybox();
    }

    return {
        isUndefinedOrNullOrEmpty: function (value) {
            return isUndefinedOrNullOrEmpty(value);
        },
        trimToEmpty: function (value) {
            return trimToEmpty(value);
        },
        isDataTableExist: function (tableId) {
            return isDataTableExist(tableId);
        },
        initUniform: function (tableId) {
            initUniform(tableId);
        },
        initUniform2: function (tableId) {
            initUniform2(tableId);
        },
        openDetailConfirmModal: function () {
            openConfirmModal('查看提示');
        },
        openEditConfirmModal: function () {
            openConfirmModal('编辑提示');
        },
        openFixConfirmModal: function () {
            openConfirmModal('配置提示');
        },
        openDeleteConfirmModal: function () {
            openConfirmModal('提示');
        },
        openMultiDeleteConfirmModal: function () {
          openMultiConfirmModal('删除提示');
        },
        openCancelConfirmModal: function () {
            openConfirmModal('取消提示');
        },
        openStartConfirmModal: function () {
            openConfirmModal('发布提示');
        },
        openEndConfirmModal: function () {
            openConfirmModal('结束提示');
        },
        modalInstance: function () {
            return modalInstance("删除提示", "您确认要删除吗？");
        },
        layoutcarModalInstance: function () {
            return modalInstance("提示", "您确定要移除该布控车吗？");
        },
        blacklistcarModalInstance: function () {
            return modalInstance("提示", "您确定要移除该黑名单车吗？");
        },
        whitelistcarModalInstance: function () {
            return modalInstance("提示", "您确定要移除该白名单车吗？");
        },
        modalResetInstance: function () {
            return modalInstance("重置密码提示", "您确认要重置该用户密吗？");
        },
        enableModalInstance: function () {
            return modalInstance("启用提示", "您确认要启用该停车场吗？");
        },
        enableUserModalInstance: function () {
            return modalInstance("启用提示", "您确认要启用该收费员吗？");
        },
        unableModalInstance: function () {
            return modalInstance("停用提示", "您确认要停用该停车场吗？");
        },
        unableUserModalInstance: function () {
            return modalInstance("停用提示", "您确认要停用该收费员吗？");
        },
        cancelModalInstance: function () {
            return modalInstance("取消提示", "您确认要取消预约吗？");
        },
        startcardModalInstance: function () {
            return modalInstance("发布月卡", "发布月卡后，用户将可参与购买该月卡，确定发布该月卡吗？");
        },
        endcardModalInstance: function () {
            return modalInstance("结束月卡", "结束月卡后，用户将无法参与购买该月卡，确定结束该月卡吗？");
        },
        startactiveModalInstance: function () {
            return modalInstance("发布活动", "您确认要发布活动吗？");
        },
        endactiveModalInstance: function () {
            return modalInstance("结束活动", "您确认要结束活动吗？");
        },
        openBindConfirmModal: function () {
            openConfirmModal('绑定提示');
        },
        exlImportTips: function (title, message) {
            modalInstance(title, message)
        },
        initTitle : function(){
        	initTitle();
        },
        handleFancyBox: function () {
            _handleFancyBox();
        }
    }
});



