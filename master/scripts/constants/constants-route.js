'use strict';
angular.module("constants").constant("StateName", {
    login: "login",
    home: "dashboard.home",
    homeUseRate: "dashboard.homeUseRate",
    homeTurnRate: "dashboard.homeTurnRate",
    loadLogin:"plogin",
    /** 数据字典 **/
    dict: {
        index: "dashboard.sec.dictIndex",
        detail: "dashboard.sec.dictDetail",
        edit: "dashboard.sec.dictEdit",
        add: "dashboard.sec.dictAdd"
    },
    /** 日志管理 **/
     log:{
        index:"dashboard.sec.logIndex"
    },
    /** 路段管理 **/
    section:{
        index:"dashboard.sec.sectionIndex",
        detail:"dashboard.sec.sectionDetail",
        edit:"dashboard.sec.sectionEdit",
        add:"dashboard.sec.sectionAdd"
    },
    /** 菜单管理 **/
    menu:{
        index:"dashboard.sec.menuIndex",
        add:"dashboard.sec.menuAdd",
        edit:"dashboard.sec.menuEdit"
    },
    /** 用户管理 **/
    user:{
        index:"dashboard.sec.userIndex",
        add:"dashboard.sec.userAdd",
        edit:"dashboard.sec.userEdit"
    },
    /*角色管理*/
    role:{
        index:"dashboard.sec.roleIndex",
        add:"dashboard.sec.roleAdd",
        edit:"dashboard.sec.roleEdit"
    },
    /** 诱导屏管理 **/
    led:{
        index:"dashboard.sec.inducedIndex",
        add:"dashboard.sec.inducedAdd",
        edit:"dashboard.sec.inducedEdit",
        bind:"dashboard.sec.inducedBind"
    },
    /** 分区管理 **/
    ctrlunit:{
        index:"dashboard.sec.ctrlunitIndex",
        add:"dashboard.sec.ctrlunitAdd",
        edit:"dashboard.sec.ctrlunitEdit"
    },
    /** 区域管理 **/
    area:{
        index:"dashboard.sec.areaIndex",
        add:"dashboard.sec.areaAdd",
        edit:"dashboard.sec.areaEdit",
        bind:"dashboard.sec.areaBind"
    },
    /** 停车场管理 --基础信息**/
    parklot:{
        index:"dashboard.sec.parklotIndex",
        add:"dashboard.sec.parklotAdd",
        edit:"dashboard.sec.parklotEdit",
        detail:"dashboard.sec.parklotDetail"
    },
    /** 车场管理--收费员资料**/
    parklotuser:{
        index:"dashboard.sec.parklotuserIndex",
        add:"dashboard.sec.parklotuserAdd",
        edit:"dashboard.sec.parklotuserEdit",
        detail:"dashboard.sec.parklotuserDetail"
    },
    /** 车场管理--收费员考勤记录**/
    parklotuserCheck:{
        index:"dashboard.sec.parklotuserCheckIndex",
    },
    /** 车场管理--收费员实时考勤**/
    parklotuserRealAttend:{
        index:"dashboard.sec.parklotuserRealAttendIndex",
    },
    /** 停车场管理--运营管理 **/
    parklotopeMan:{
        index:"dashboard.sec.opeManIndex",
        edit:"dashboard.sec.opeManEdit",
        detail:"dashboard.sec.opeManDetail"
    },
    /** 停车场管理--出入口信息 **/
    entranceMes:{
        index:"dashboard.sec.entranceMesIndex",
    },
    /*运营公司管理*/
    company:{
        index:"dashboard.sec.companyIndex",
        add:"dashboard.sec.companyAdd",
        edit:"dashboard.sec.companyEdit",
        detail:"dashboard.sec.companyDetail"
    },
    /*停车场进出记录*/
    precord:{
    	indexI:"dashboard.sec.recordInIndex",
    	indexO:"dashboard.sec.recordOutIndex",
    	indexM:"dashboard.sec.monitorIndex"
    },
    /*车辆管理--会员车辆*/
    membercars:{
        index:"dashboard.sec.membercarsIndex",
    },
    /*车辆管理--临时车辆*/
    temporarycars:{
        index:"dashboard.sec.temporarycarsIndex",
    },
    /*车辆管理--白名单车辆*/
    whitelistcars:{
        index:"dashboard.sec.whitelistcarsIndex",
        add:"dashboard.sec.whitelistcarsAdd",
        edit:"dashboard.sec.whitelistcarsEdit",
        countAdd:"dashboard.sec.whitelistcarscountAdd"
    },
    /*车辆管理--黑名单车辆*/
    blacklistcars:{
        index:"dashboard.sec.blacklistcarsIndex",
        add:"dashboard.sec.blacklistcarsAdd"
    },
    /*车辆管理--布控车辆*/
    layoutcars:{
        index:"dashboard.sec.layoutcarsIndex",
        add:"dashboard.sec.layoutcarsAdd"
    },
    /*车辆管理--车辆预警*/
    warningcars:{
        index:"dashboard.sec.warningcarsIndex",
        detail:"dashboard.sec.warningcarsDetail"
    },
    /*停车场监控-停车场监控*/
    parklotmonitor:{
    	index:"dashboard.sec.parklotmonitorIndex",
    },
    /*停车场监控-过车监控*/
    passcarmonitor:{
    	index:"dashboard.sec.passcarmonitorIndex",
    },
    /*停车管理-过车记录*/
    passcarrecord:{
    	index:"dashboard.sec.passcarrecordIndex",
    	detail:"dashboard.sec.passcarrecordDetail",
    },
    /*停车管理-场内停车*/
    lotparking:{
    	index:"dashboard.sec.lotparkingIndex",
    	detail:"dashboard.sec.lotparkingDetail",
    },
    /*停车管理-订单记录*/
    parkingrecord:{
    	index:"dashboard.sec.parkingrecordIndex",
    	detail:"dashboard.sec.parkingrecordDetail",
    },
    /*停车管理-异常放行*/
    unusualpass:{
    	index:"dashboard.sec.unusualpassIndex",
    	detail:"dashboard.sec.unusualpassDetail",
    },
    /*停车管理-欠费记录*/
    arrearrecord:{
    	index:"dashboard.sec.arrearrecordIndex",
    	detail:"dashboard.sec.arrearrecordDetail",
    },
    /*停车管理-月卡购买订单*/
    mouthbuyorder:{
    	index:"dashboard.sec.cardrecordIndex",
    	detail:"dashboard.sec.cardrecordDetail",
    },
    /*财务管理-支付订单*/
    payrecord:{
    	index:"dashboard.sec.payrecordIndex",
    	detail:"dashboard.sec.payrecordDetail",
    },
    /*财务管理-停车缴费记录*/
    parkpayrecord:{
    	index:"dashboard.sec.parkpayrecordIndex",
    	detail:"dashboard.sec.parkpayrecordDetail",
    },
    /*财务管理-现金交账记录*/
    cashrecord:{
    	index:"dashboard.sec.cashrecordIndex",
    	cashdetail:"dashboard.sec.cashrecordDetail",
    	diffIndex:"dashboard.sec.diffIndex",
    	diffDetail:"dashboard.sec.diffDetail",
    	havePayedIndex:"dashboard.sec.havePayedIndex",
      parkpayIndex:"dashboard.sec.parkpayIndex",
      parkpaydetail:"dashboard.sec.parkpayDetail",
    },
    /*财务管理-包月车充值*/
    vipvehicle:{
    	index:"dashboard.sec.vipvehicleIndex",
    	detail:"dashboard.sec.vipvehicleDetail",
    },
    /*财务管理-月卡支付订单*/
    mouthpayrecord:{
    	index:"dashboard.sec.mouthpayrecordIndex",
    	detail:"dashboard.sec.mouthpayrecordDetail",
    },
    /*财务管理-岗亭收费记录*/
    sentrycharge:{
    	index:"dashboard.sec.sentrychargeIndex",
    	detail:"dashboard.sec.sentrychargeDetail",
    },
    /*财务管理-开票历史*/
    invoiceHistory:{
    	index:"dashboard.sec.invoiceHistoryIndex",
    	detail:"dashboard.sec.invoiceHistoryDetail",
    },
    /*企业管理-企业信息*/
    companymes:{
    	edit:"dashboard.sec.companymesEdit",
    },
    /** 企业管理-用户信息 **/
    user:{
        index:"dashboard.sec.userIndex",
        add:"dashboard.sec.userAdd",
        edit:"dashboard.sec.userEdit"
    },
    /** 系统管理-同步岗亭信息 **/
    sentryboxmes:{
    	index:"dashboard.sec.sentryboxmesIndex",
    },
    /*运营管理报表--月卡车充值报表*/
    mouthcardreport: {
      index:"dashboard.sec.mouthcardreportIndex",
    },
    /*报表管理--停车次数报表*/
    parkingNumreport: {
      index:"dashboard.sec.parkingNumreport",
    },
    /*报表管理--支付方式收费报表*/
    paywaychargereport: {
      index:"dashboard.sec.paywaychargereport",
    },
    /*报表管理--支付终端收费报表*/
    payterminalchargereport: {
      index:"dashboard.sec.payterminalchargereport",
    },
    
    /*****以下模块未实行服务联调数据，数据来源本地json静态数据*****/
   
    /*清分结算*/
    clearscore:{
    	/*清分结算-清算列表*/
    	index:"dashboard.sec.scoreIndex",
    	/*清分结算-异常数据*/
    	indexE:"dashboard.sec.exceptionIndex",
    	/*清分结算-搁置清单*/
    	indeD:"dashboard.sec.delayIndex",
    	/*清分结算-待结算清单*/
    	indexR:"dashboard.sec.rechargeIndex",
    	/*清分结算-已结算清单*/
    	indexRD:"dashboard.sec.rechargedIndex",
    },
    
   /*运营管理*/
    parking:{
    	/* 运营管理-停车记录*/
    	index:"dashboard.sec.parkingIndex",
    	/* 运营管理-场内车辆*/
      incars:"dashboard.sec.incarsIndex",
      /* 运营管理-场内车辆查看*/
      indetail:"dashboard.sec.incarsdetail",
    	/* 运营管理-收费管理*/
    	charge:"dashboard.sec.chargeIndex"
    },
    dept:{
    	index:"dashboard.sec.deptIndex"
    },

    /*运营报表管理*/
    operateReport: {
      /* 运营报表管理-停车收费报表*/
      indexPC:"dashboard.sec.parkChargeIndex",
      /* 运营报表管理-泊位运营报表*/
      indexBO:"dashboard.sec.berthOperateIndex",
      /* 运营报表管理-泊位预约报表*/
      indexBOR:"dashboard.sec.berthOrderIndex",
		},

		/**日报表 */
		operaterTotalDayReprot:{
			index:'dashboard.sec.operaterTotalDayReprotIndex'
		},
		/**月报表 */
		operaterTotalMouthReprot:{
			index:'dashboard.sec.operaterTotalMouthReprotIndex'
		},
		/**年报表 */
		operaterTotalYearReprot:{
			index:'dashboard.sec.operaterTotalYearReprotIndex'
    },
    /**月卡购买终端报表 */
		buyTerminalReprot:{
			index:'dashboard.sec.buyTerminalReprotIndex'
		},
    /**异常抬报表 */
		unuaualpassReprot:{
			index:'dashboard.sec.unuaualpassReprotIndex'
		},
    /**各优惠券领用报表 */
		eachCouponuseReprot:{
			index:'dashboard.sec.eachCouponuseReprot'
    },
    /* 运营报表管理-泊位运营报表*/
    berthManageReport:{
      index:'dashboard.sec.berthManageReport'
    },
    /*收费报表管理*/
    chargeReport: {
      /* 收费报表管理-停车报表*/
      indexCC:"dashboard.sec.pkChargeIndex",
      /* 收费报表管理-支付渠道报表*/
      indexPT:"dashboard.sec.payTypeIndex",
      /* 收费报表管理-支付终端报表*/
      indexPTE:"dashboard.sec.payTerminalIndex",
    },

    /*运营管理--优惠规则*/
    couponRule:{
      index:'dashboard.sec.couponRuleIndex',
      detail:'dashboard.sec.couponRuleDetail',
      edit:'dashboard.sec.couponRuleEdit',
      add:'dashboard.sec.couponRuleAdd',
    },
    /*运营管理--优惠活动*/
    couponActive:{
      index:'dashboard.sec.couponActiveIndex',
      detail:'dashboard.sec.couponActiveDetail',
      edit:'dashboard.sec.couponActiveEdit',
      add:'dashboard.sec.couponActiveAdd',
    },
    /*运营管理--优惠券领用记录*/
    couponUseRecord:{
      index:'dashboard.sec.couponUseRecordIndex',
    },
    /*系统管理--收费规则*/
    payRule:{
      index:'dashboard.sec.ruleIndex'
    },
    /*运营管理--月卡设置*/
    mouthcard:{
      index:'dashboard.sec.mouthcardIndex',
      add:'dashboard.sec.mouthcardAdd',
      edit:'dashboard.sec.mouthcardedit',
    },
    /*运营管理--月卡购买记录*/
    mouthcardbuy:{
      index:'dashboard.sec.mouthcardbuyIndex',
      add:'dashboard.sec.mouthcardbuyAdd',
      detail:'dashboard.sec.mouthcardbuyDetail',
      countAdd:'dashboard.sec.mouthcardbuycountAdd',
    },
    /*车场管理--岗亭设置*/
    sentryboxSet:{
      index:'dashboard.sec.sentryboxSetIndex'
    },
    /*系统管理--消息中心--监控告警*/
    monitorAlarm:{
      index:'dashboard.sec.monitorAlarmIndex'
    },
    /*报表管理--营业额报表*/
    turnoverReport:{
      index:'dashboard.sec.turnoverReportIndex'
    },
    /*报表管理--停车场月卡购买报表*/
    monthcardBuyReport:{
      index:'dashboard.sec.monthcardBuyReportIndex'
    },
    /*报表管理--年度收费报表*/
    yearChargeReport:{
      index:'dashboard.sec.yearChargeReportIndex'
    },

    
});