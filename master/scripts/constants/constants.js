'use strict';
(function () {
    // var baseUrlAuth = "http://192.168.200.153:2080/xiasha_auth-frontend-inf";
    // var baseUrl = "http://192.168.200.153:2080/xiasha_dclot-frontend-inf";
    // var baseUrlLot = "http://192.168.200.153:2080/xiasha_dclot-frontend-inf";
    // var fileUploadUrl = "http://192.168.200.153:2080/xiasha_file-srv";

    var baseUrlAuth = "/xiasha_auth-frontend-inf";
    var baseUrl = "/xiasha_dclot-frontend-inf";
    var baseUrlLot = "/xiasha_dclot-frontend-inf";
    var fileUploadUrl = "/xiasha_file-srv";

    angular.module("constants").constant("Setting", {
        SERVER: {
            UPLOAD: fileUploadUrl + "/upload.do",
            DOWNLOAD: fileUploadUrl + "/download.do",
            UPLOADOUT: fileUploadUrl + "/upload.do",
            DOWNLOADOUT: fileUploadUrl + "/download.do"
        },
        authUrl: {
            LOGIN: baseUrlAuth + "/dclot/login",
            LOGOUT: baseUrlAuth + "/dclot/logout",
            /** 菜单管理 **/
            MENU: {
                LIST: baseUrlAuth + "/dclot/role_menu",
                MENU_PAGINATION: baseUrlAuth + "/dclot/menu_pagination",
                MENU_ADD: baseUrlAuth + "/dclot/menu_insert",
                MENU_DEL: baseUrlAuth + "/dclot/menu_delete",
                MENU_UPDATE: baseUrlAuth + "/dclot/menu_update",
                MENU_DETAIL: baseUrlAuth + "/dclot/menu_detail",
                MENU_ALL_LIST: baseUrlAuth + "/dclot/menu_list",
                MENU_ALL_TREE: baseUrlAuth + "/dclot/menu_tree",
            },
            /** 用户管理 **/
            USER: {
                SYSUSER_PAGINATION: baseUrlAuth + "/dclot/user_pagination",
                SYSUSER_ADD: baseUrlAuth + "/dclot/user_insert",
                SYSUSER_USERDETAIL: baseUrlAuth + "/dclot/user_detail",
                SYSUSER_UPDATEUSER: baseUrlAuth + "/dclot/user_update",
                SYSUSER_RESET: baseUrlAuth + "/dclot/user_reset_pwd",
                ROLE_LIST: baseUrlAuth + "/dclot/role_info",
                SYSUSER_DEL: baseUrlAuth + "/dclot/user_delete",
                MODIFYPWD: baseUrlAuth + "/dclot/user_pwdchange",
                CHECK: baseUrlAuth + "/dclot/user_check",
                GRANT: baseUrlAuth + "/dclot/user_grant"
            },
            /** 角色管理 ***/
            ROLE: {
                ROLE_PAGINATION: baseUrlAuth + "/dclot/role_pagination",
                ROLE_ADD: baseUrlAuth + "/dclot/role_insert",
                ROLE_EDIT: baseUrlAuth + "/dclot/role_update",
                ROLE_DETAIL: baseUrlAuth + "/dclot/role_detail",
                ROLE_DELETE: baseUrlAuth + "/dclot/role_delete",
                ROLE_PERMISSION: baseUrlAuth + "/dclot/role_permission",
                ROLE_PERMISSION_UPDATE: baseUrlAuth + "/dclot/role_permission/update"
            },
            /** 日志管理 **/
            LOG: {
                LOG_PAGINATION: baseUrlAuth + "/dclot/log_pagination"
            }
        },
        lotUrl: {
            /** 首页 **/
            HOME: {
                /** 数据看板--营业额 **/
                BLOCK_ALREADYPAY_ALL: baseUrl + "/home/dataview/turnover",
                /** 数据看板--支付订单数 **/
                BLOCK_PAYOREDER_ALL: baseUrl + "/home/dataview/paysuccesscount",
                /** 数据看板--泊位数 **/
                BLOCK_BERTH_ALL: baseUrl + "/home/dataview/berthcount",
                /** 数据看板--会员车/绑定车 **/
                BLOCK_VIP_BIND: baseUrl + "/home/dataview/vehiclecount",
                /** 数据看板--异常抬杆 **/
                BLOCK_EXT_PASS: baseUrl + "/home/dataview/parking_ext_count",
                /** 数据看板--累计停车次数 **/
                BLOCK_PARKING_ALL: baseUrl + "/home/dataview/parkinghis_year_count",
                BLOCK_PARKING_DAY: baseUrl + "/home/dataview/parkinghis_day_count",
                BLOCK_PARKING_MOUTH: baseUrl + "/home/dataview/parkinghis_month_count",
                BLOCK_PARKING_YES: baseUrl + "/home/dataview/parkinghis_yesterday_count",
                /** 停车收费--当天收费总额 **/
                PARK_CHARGE_ALL: baseUrl + "/home/parkingfee/todayparkingfee",
                /** 停车收费--累计购买月卡金额 **/
                PARK_RECHARGE_ALL: baseUrl + "/home/parkingfee/payvip",
                /** 停车收费--收费方式/收费渠道 **/
                PARK_CHARGE_WAY: baseUrl + "/home_manage/parking_paymoney_manage/pay_src_type",
                /** 停车收费--充值方式/充值渠道 **/
                PARK_RECHARGE_WAY: baseUrl + "/home_manage/parking_paymoney_manage/recharge_src_type",
                /** 停车收费--不同时段停车收费趋势--日**/
                PARK_CHARGE_TIMES_DAY: baseUrl + "/home/parkingfee/alreadypay_time_day",
                /** 停车收费--不同时段停车收费趋势--月**/
                PARK_CHARGE_TIMES_MON: baseUrl + "/home/parkingfee/alreadypay_time_month",
                /** 停车收费--收费总额排名--日**/
                PARK_CHARGE_SORT_DAY: baseUrl + "/home/parkingfee/alreadypay_sort_day",
                /** 停车收费--收费总额排名--月**/
                PARK_CHARGE_SORT_MON: baseUrl + "/home/parkingfee/alreadypay_sort_month",
                /** 停车运营--泊位利用率--周**/
                PARK_OPERATE_USERATE_WEEK: baseUrl + "/home/useratio/week",
                /** 停车运营--泊位利用率--月**/
                PARK_OPERATE_USERATE_MON: baseUrl + "/home/useratio/month",
                /** 停车运营--泊位利用率--详情表格--周**/
                PARK_OPERATE_USERATE_DETAIL_WEEK: baseUrl + "/home/useratio/week/list",
                /** 停车运营--泊位利用率--详情表格--月**/
                PARK_OPERATE_USERATE_DETAIL_MONTH: baseUrl + "/home/useratio/month/list",
                /** 停车运营--泊位周转率--周**/
                PARK_OPERATE_BERTHTURN_WEEK: baseUrl + "/home/rotationratio/week",
                /** 停车运营--泊位周转率--月**/
                PARK_OPERATE_BERTHTURN_MON: baseUrl + "/home/rotationratio/month",
                /** 停车运营--泊位周转率--详情表格--周**/
                PARK_OPERATE_BERTHTURN_DETAIL_WEEK: baseUrl + "/home/rotationratio/week/list",
                /** 停车运营--泊位周转率--详情表格--月**/
                PARK_OPERATE_BERTHTURN_DETAIL_MONTH: baseUrl + "/home/rotationratio/month/list",
                /** 停车运营--泊位变化--日**/
                PARK_OPERATE_BERTHCHANGE_DAY: baseUrl + "/home_manage/parking_operation_manage/berth_status_day",
                /** 停车运营--泊位变化--月**/
                PARK_OPERATE_BERTHCHANGE_MON: baseUrl + "/home_manage/parking_operation_manage/berth_status_month",
                PARK_OPERATE_BERTHCHANGE: baseUrl + "/home_manage/parking_operation_manage/berthnumber",
                /** 停车运营--过车数量--日**/
                PARK_OPERATE_PASSNUM_DAY: baseUrl + "/home_manage/parking_operation_manage/parking_pass_day",
                /** 停车运营--过车数量--月**/
                PARK_OPERATE_PASSNUM_MON: baseUrl + "/home_manage/parking_operation_manage/parking_pass_month",
            },
            /**地图 **/
            MAP: {
                MAP_PARKLOT: baseUrl + "/map/parklot_list",
                MAP_PARKLOT_DETAIL: baseUrl + "/map/parklot_detail"
            },
            /** 停车场管理--停车场基础信息 **/
            PARKLOTS: {
                PARKLOTS_ADD: baseUrl + "/parklot_manage/parklot",
                PARKLOTS_UPDATE: baseUrl + "/parklot_manage/parklot",
                PARKLOTS_PAGINATION: baseUrl + "/parklot_manage/parklot_pagination",
                PARKLOTS_DETAIL: baseUrl + "/parklot_manage/parklot",
                PARKLOTS_CLOSE: baseUrl + "/parklot_manage/parklot_close",
                PARKLOTS_OPEN: baseUrl + "/parklot_manage/parklot_open",
                PARKLOTS_LIST: baseUrl + "/parklot_manage/parklot_list",
                PARKLOTS_LIST_ALL: baseUrl + "/parklot_manage/parklot_list_all",
                PARKLOTS_PULL: baseUrl + "/system_manage/synbase_parklot"
            },
            /** 停车场管理--运营信息 **/
            OPERATEMAN: {
                OPERATEMAN_ADD: baseUrl + "/parklot_manage/operation_payrule",
                OPERATEMAN_UPDATE: baseUrl + "/parklot_manage/operation_payrule",
                OPERATEMAN_PAGINATION: baseUrl + "/parklot_manage/operation/pagination",
                OPERATEMAN_DETAIL: baseUrl + "/parklot_manage/operation_payrule",
            },
            /** 停车场管理--收费员资料 **/
            PARKLOTUSERMES: {
                PARKLOTUSERMES_ADD: baseUrl + "/parklotuser/insert",
                PARKLOTUSERMES_UPDATE: baseUrl + "/parklotuser/update",
                PARKLOTUSERMES_PAGINATION: baseUrl + "/parklotuser/pagination",
                PARKLOTUSERMES_OPEN: baseUrl + "/parklotuser/open",
                PARKLOTUSERMES_CLOSE: baseUrl + "/parklotuser/close",
                PARKLOTUSERMES_DELETE: baseUrl + "/parklotuser/delete",
                PARKLOTUSERMES_DETAIL: baseUrl + "/parklotuser/detail",
            },
            /** 停车场管理--收费员考勤记录 **/
            PARKLOTUSERATTEND: {
                PARKLOTUSERATTEND_EXCEL: baseUrl + "/parklot_user/attendance/excel",
                PARKLOTUSERATTEND_EXCEL_COUNT: baseUrl + "/parklot_user/attendance/excel_count",
                PARKLOTUSERATTEND_PAGINATION: baseUrl + "/parklot_user/attendance/day",
            },
            /** 停车场管理--收费员实时考勤 **/
            PARKLOTUSERREALATTEND: {
                PARKLOTUSERREALATTEND_EXCEL: baseUrl + "/parklot_user/attendance_real/excel",
                PARKLOTUSERREALATTEND_EXCEL_COUNT: baseUrl + "/parklot_user/attendance_real/excel_count",
                PARKLOTUSERREALATTEND_PAGINATION: baseUrl + "/parklot_user/attendance_real/page",
                PARKLOTUSERREALATTEND_ENTER_RECORD: baseUrl + "/parklot_user/attendance_real/enter",
            },
            /** 运营管理--优惠规则 **/
            COUPONRULE: {
                COUPONRULE_ADD: baseUrl + "/coupon/rule/insert",
                COUPONRULE_DEL: baseUrl + "/coupon/rule/delete",
                COUPONRULE_PAGINATION: baseUrl + "/coupon/rule/pagination",
                COUPONRULE_DETAIL: baseUrl + "/coupon/rule/detail",
                COUPONRULE_EDIT: baseUrl + "/coupon/rule/update",
            },
            /** 运营管理--优惠活动 **/
            COUPONACTIVE: {
                COUPONACTIVE_ADD: baseUrl + "/coupon/activity/insert",
                COUPONACTIVE_DEL: baseUrl + "/coupon/activity/delete",
                COUPONACTIVE_PAGINATION: baseUrl + "/coupon/activity/pagination",
                COUPONACTIVE_DETAIL: baseUrl + "/coupon/activity/detail",
                COUPONACTIVE_EDIT: baseUrl + "/coupon/activity/update",
                COUPONACTIVE_LIST: baseUrl + "/coupon/activity/coupon_rule/list",
                COUPONACTIVE_START: baseUrl + "/coupon/activity/start_activity",
                COUPONACTIVE_END: baseUrl + "/coupon/activity/end_activity",
            },
            /** 运营管理--优惠券领用记录 **/
            COUPONUSERECORD: {
                COUPONUSERECORD_PAGINATION: baseUrl + "/coupon/recive/pagination",
                COUPONUSERECORD_ACT_LIST: baseUrl + "/issue_coupon/coupon_activity/list",
                COUPONUSERECORD_ACT_ADD: baseUrl + "/issue_coupon/insert",
            },
            /** 运营管理--发布月卡 **/
            MOUTHCARD: {
                MOUTHCARD_ADD: baseUrl + "/card_manage/insert-card",
                MOUTHCARD_DEL: baseUrl + "/card_manage/delete-card",
                MOUTHCARD_PAGINATION: baseUrl + "/card_manage/card_manage_pagination",
                MOUTHCARD_DETAIL: baseUrl + "/card_manage/detail",
                MOUTHCARD_EDIT: baseUrl + "/card_manage/update-card",
                MOUTHCARD_START: baseUrl + "/card_manage/start-card",
                MOUTHCARD_END: baseUrl + "/card_manage/stop-card",
                MOUTHCARD_LOTLIST: baseUrl + "/card_manage/unbind/parklot_list",
            },
            /** 运营管理--月卡购买记录 **/
            MOUTHCARDBUY: {
                MOUTHCARDBUY_PAGINATION: baseUrl + "/card_record_manage/card_record_pagination",
                MOUTHCARDBUY_DETAIL: baseUrl + "/card_record_manage/detail",
                MOUTHCARDBUY_LIST: baseUrl + "/card_record_manage/card_list",
                MOUTHCARDBUY_ADD: baseUrl + "/card_record_manage/insert_card_record",
                MOUTHCARDBUY_CAROWN_LIST: baseUrl + "/card_record_manage/vehicle_owner_list",
                MOUTHCARDBUY_ADD_CAROWN: baseUrl + "/card_record_manage/insert_vehicle_owner",
                MOUTHCARDBUY_ADD_COUNT: baseUrl + "/card_record_manage/insert_card_record_list",
            },
            /*停车场管理--出入口信息*/
            ENTRANCEMES: {
                ENTRANCEMES_PAGINATION: baseUrl + "/parking_manage/entrance/pagination",
                ENTRANCEMES_LIST: baseUrl + "/parking_manage/entrance/parklotlanelist",
            },
            /*车辆管理--会员车辆*/
            MEMBERCAR: {
                MEMBERCAR_PAGINATION: baseUrl + "/vehicle_manage/vip_vehicle_pagination",
                MEMBERCAR_PULL: baseUrl + "/system_manage/synbase_vip_vehicle",
                MEMBERCAR_DELETE: baseUrl + "/vehicle/vip/delete",
                MEMBERCAR_STATUS_COUNT: baseUrl + "/vehicle_manage/vehicle/count",
            },
            /*车辆管理--临时车辆*/
            TEMPORARYCAR: {
                TEMPORARYCAR_PAGINATION: baseUrl + "/vehicle_manage/temp_vehicle_pagination",
            },
            /*车辆管理--白名单车辆*/
            WHITELISTCAR: {
                WHITELISTCAR_PAGINATION: baseUrl + "/vehicle_manage/white_vehicle_pagination",
                WHITELISTCAR_ADD: baseUrl + "/vehicle_manage",
                WHITELISTCAR_EDIT: baseUrl + "/vehicle_manage/update",
                WHITELISTCAR_DETAIL: baseUrl + "/vehicle_manage/details_vehicle",
                WHITELISTCAR_DELETE: baseUrl + "/vehicle_manage/delete_list",
                WHITELISTCAR_COUNT_ADD: baseUrl + "/vehicle_manage/insert_white_list",
            },
            /*车辆管理--黑名单车辆*/
            BLACKLISTCAR: {
                BLACKLISTCAR_PAGINATION: baseUrl + "/vehicle_manage/black_vehicle_pagination",
                BLACKLISTCAR_DEL: baseUrl + "/vehicle_manage/black_vehicle",
                BLACKLISTCAR_ADD: baseUrl + "/vehicle_manage/black_vehicle",
            },
            /*车辆管理--布控车辆*/
            LAYOUTCAR: {
                LAYOUTCAR_PAGINATION: baseUrl + "/vehicle_manage/monitoring_vehicle_pagination",
                LAYOUTCAR_DEL: baseUrl + "/vehicle_manage/monitoring_vehicle",
                LAYOUTCAR_ADD: baseUrl + "/vehicle_manage/monitoring_vehicle",
            },
            /*车辆管理--车辆预警*/
            CARSALARM: {
                CARSALARM_PAGINATION: baseUrl + "/vehicle_manage/alarm_vehicle_pagination",
            },
            /*停车管理--过车记录*/
            PASSCARRECORD: {
                PASSCARRECORD_PAGINATION: baseUrl + "/parking_manage/parking_pass_pagination",
                PASSCARRECORD_DETAIL: baseUrl + "/parking_manage/parking_pass_detail",
                PASSCARRECORD_LIST: baseUrl + "/parking_manage/parking_pass_list",
            },
            /*停车管理--场内停车*/
            LOTPARKING: {
                LOTPARKING_PAGINATION: baseUrl + "/parking_manage/parking_in_pagination",
                LOTPARKING_DETAIL: baseUrl + "/parking_manage/parking_in_detail",
            },
            /*停车管理--订单记录*/
            PARKINGRECORD: {
                PARKINGRECORD_PAGINATION: baseUrl + "/parking_manage/parking_bo_pagination",
                PARKINGRECORD_DETAIL: baseUrl + "/parking_manage/parking_bo_detail",
                PARKINGRECORD_PAY: baseUrl + "/parking_manage/parking_bo_detail/tra_record",
            },
            /*停车管理--月卡购买订单*/
            MOUTHBUYORDER: {
                MOUTHBUYORDER_PAGINATION: baseUrl + "/parking_manage/card_page",
            },
            /*停车管理--异常放行*/
            UNUSUALPASS: {
                UNUSUALPASS_PAGINATION: baseUrl + "/parking_manage/parking_ext_pagination",
                UNUSUALPASS_DETAIL: baseUrl + "/parking_manage/parking_ext_detail",
                UNUSUALPASS_PASSCAR: baseUrl + "/parking_manage/pass_record",
                UNUSUALPASS_TOTALMONEY: baseUrl + "/parking_manage/summoney",
            },
            /*财务管理--支付订单*/
            ALREADYPAYTRADE: {
                ALREADYPAYTRADE_PAGINATION: baseUrl + "/finance_manage/alreadypay_trade_pagination",
                ALREADYPAYTRADE_DETAIL: baseUrl + "/finance_manage/alreadypay_trade_detail",
                ALREADYPAYTRADE_RECORD: baseUrl + "/finance_manage/parking_alreadypay/parklot_payment_order",
                ALREADYPAYTRADE_TOTAL_CHARGE: baseUrl + "/finance_manage/alreadypay/sum_money",
            },
            /*财务管理--停车交费记录*/
            PARKPAYRECORD: {
                PARKPAYRECORD_PAGINATION: baseUrl + "/finance_manage/parking_charge/pagination",
                PARKPAYRECORD_DETAIL: baseUrl + "/finance_manage/parking_charge/detail",
                PARKPAYRECORD_EXCEL: baseUrl + "/finance_manage/excel",
                PARKPAYRECORD_EXCEL_COUNT: baseUrl + "/finance_manage/excel_count",
                PARKPAYRECORD_CHARGEALL: baseUrl + "/finance_manage/parking_charge_sum",
                PARKPAYRECORD_PASSCAR: baseUrl + "/finance_manage/parking_charge/pass",
                PARKPAYRECORD_PAYRECORD: baseUrl + "/finance_manage/parking_charge/pay_order",
                PARKPAYRECORD_COUPON: baseUrl + "/finance_manage/parking_charge/coupon_receive",
            },
            CASHRECORD: {
                /*财务管理--现金交账记录--收费记录*/
                ORDER_CHARGE_PAGINATION: baseUrl + "/finance_manage/cash_pagination",
                ORDER_CHARGE_LIST: baseUrl + "/finance_manage/cash_list",
                ORDER_CHARGE_EXCEL_COUNT: baseUrl + "/finance_manage/cash_excel_count",
                ORDER_CHARGE_EXCEL: baseUrl + "/finance_manage/cash_excel",
                /*财务管理--现金交账记录--交账记录*/
                ORDER_CASHVERIFY_PAGINATION: baseUrl + "/finance_manage/cash_verify_pagination",
                ORDER_CASHVERIFY_EXCEL_COUNT: baseUrl + "/finance_manage/cash_verify_excel_count",
                ORDER_CASHVERIFY_EXCEL: baseUrl + "/finance_manage/cash_verify_excel",
                ORDER_CASHVERIFY_DETAIL: baseUrl + "/finance_manage/cash_verify",
                ORDER_CASHVERIFY_ADD: baseUrl + "/finance_manage/cash_verify",
            },
            /*财务管理--包月车购买记录*/
            MOUTHBUYRECORD: {
                MOUTHBUYRECORD_PAGINATION: baseUrl + "/monthly_card_record/card_pagination",
                MOUTHBUYRECORD_DETAIL: baseUrl + "/monthly_card_record/detail",
                MOUTHBUYRECORD_EXCEL: baseUrl + "/monthly_card_record/card_excel",
                MOUTHBUYRECORD_EXCEL_COUNT: baseUrl + "/monthly_card_record/card_excel_count",
                MOUTHBUYRECORD_PAY_LIST: baseUrl + "/monthly_card_record/monthly_card_list",
                MOUTHBUYRECORD_SUM: baseUrl + "/monthly_card_record/card_sum",
            },
            /*财务管理--岗亭收费记录*/
            SENTRYCHARGE: {
                SENTRYCHARGE_PAGINATION: baseUrl + "/finance_manage/parking_alreadypay_parklot/pagination",
                SENTRYCHARGE_DETAIL: baseUrl + "/finance_manage/parking_alreadypay_parklot",
                SENTRYCHARGE_EXCEL: baseUrl + "/finance_manage/parking_alreadypay_parklot/excel",
                SENTRYCHARGE_EXCEL_COUNT: baseUrl + "/finance_manage/parking_alreadypay_parklot/excel_count",
            },
            /*财务管理--月卡支付记录*/
            MOUTHPAYRECORD: {
                MOUTHPAYRECORD_PAGINATION: baseUrl + "/card_payment_order/card_order_pagination",
                MOUTHPAYRECORD_DETAIL: baseUrl + "/card_payment_order/detail",
                MOUTHPAYRECORD_LIST: baseUrl + "/card_payment_order/monthly_card_list",
                MOUTHPAYRECORD_TOTAL_CHARGE: baseUrl + "/card_payment_order/sum_money",
            },
            /*财务管理--开票历史*/
            INVOICEHISTORY: {
                INVOICEHISTORY_PAGINATION: baseUrl + "/invoice_his/pagination",
                INVOICEHISTORY_DETAIL: baseUrl + "/invoice_his/detail",
                INVOICEHISTORY_EXCEL: baseUrl + "/invoice_his/excel",
                INVOICEHISTORY_EXCEL_COUNT: baseUrl + "/invoice_his/excel_count",
                INVOICEHISTORY_PAY_RECORD: baseUrl + "/invoice_his/pay_record",
                INVOICEHISTORY_CARD_RECORD: baseUrl + "/invoice_his/card_record",
            },
            /*企业管理--企业信息*/
            COMPANYS: {
                COMPANYS_UPDATE: baseUrl + "/company_manage/company",
                COMPANYS_DETAIL: baseUrl + "/company_manage/company",
            },
            /*企业管理--员工信息*/
            EMPLOYEEMES: {
                EMPLOYEEMES_ADD: baseUrl + "/company_manage/employee_manage",
                EMPLOYEEMES_UPDATE: baseUrl + "/company_manage/employee_manage",
                EMPLOYEEMES_DELETE: baseUrl + "/company_manage/employee_manage",
                EMPLOYEEMES_PAGINATION: baseUrl + "/company_manage/employee_manage/pagination",
                EMPLOYEEMES_DETAIL: baseUrl + "/company_manage/employee_manage",
            },
            /*停车场监控--过车监控*/
            PASSCARMONITOR: {
                PASSCARMONITOR_INDEX: baseUrl + "/parklot_monitor/pass_monitoring/list",
            },
            /*行政区*/
            DISTRICT: {
                DISTRICT_PAGINATION: baseUrl + "/district/pagination",
                DISTRICT_LIST: baseUrl + "/district/list"
            },
            /** 数据字典 **/
            DICT: {
                PAGINATION: baseUrl + "/dict/pagination",
                LIST: baseUrl + "/init"
            },
            /**停车场进出记录*/
            PARKLOTSRECORD: {
                PARKLOTSRECORD_IN_PAGINATION: baseUrl + "/vehicle/pagination",
                PARKLOTSRECORD_OUT_PAGINATION: baseUrl + "/vehicle/union_pagination",
                PARKLOTS_MONITOR_LIST: baseUrl + "/parklot_monitor/list"
            },
            /*运营管理报表--月卡充值报表*/
            MOUTHCARDREPORT: {
                MOUTHCARDREPORT_PAGINATION: baseUrl + "/statistics_manage/vehicle_recharge/pagination",
                MOUTHCARDREPORT_EXCEL: baseUrl + "/statistics_manage/vehicle_recharge/excel",
                MOUTHCARDREPORT_EXCEL_COUNT: baseUrl + "/statistics_manage/vehicle_recharge/excel_count",
            },
            /*运营管理报表--泊位运营报表*/
            BERTHMANREPORT: {
                BERTHMANREPORT_PAGINATION: baseUrl + "/statistics_manage/parklot_operation/pagination",
                BERTHMANREPORT_EXCEL: baseUrl + "/statistics_manage/parklot_operation/excel",
                BERTHMANREPORT_EXCEL_COUNT: baseUrl + "/statistics_manage/parklot_operation/excel_count",
            },
            /*运营管理报表--停车收费报表*/
            PARKCHARGEREPORT: {
                PARKCHARGEREPORT_PAGINATION: baseUrl + "/statistics_manage/parking_alreadypay/pagination",
                PARKCHARGEREPORT_EXCEL: baseUrl + "/statistics_manage/parking_alreadypay/excel",
                PARKCHARGEREPORT_EXCEL_COUNT: baseUrl + "/statistics_manage/parking_alreadypay/excel_count",
            },
            /*报表管理--运营总报表*/
            OPERATE_TOTAL_REPORT: {
                OPERATE_TOTAL_PAGINATION_DAY: baseUrl + "/rep/operation",
                OPERATE_TOTAL_PAGINATION_MOUTH: baseUrl + "/rep/operation/month",
                OPERATE_TOTAL_PAGINATION_YEAR: baseUrl + "/rep/operation/year",
                OPERATE_TOTAL_LIST_DAY: baseUrl + "/rep/excel",
                OPERATE_TOTAL_LIST_COUNT_DAY: baseUrl + "/rep/excel_count",
                OPERATE_TOTAL_LIST_MOUTH: baseUrl + "/rep/month/excel",
                OPERATE_TOTAL_LIST_COUNT_MOUTH: baseUrl + "/rep/month/excel_count",
                OPERATE_TOTAL_LIST_YEAR: baseUrl + "/rep/year/excel",
                OPERATE_TOTAL_LIST_COUNT_YEAR: baseUrl + "/rep/year/excel_count",
                OPERATE_TOTAL_SUM_DAY: baseUrl + "/rep/operation/sum/day",
                OPERATE_TOTAL_SUM_MONTH: baseUrl + "/rep/operation/sum/month",
                OPERATE_TOTAL_SUM_YEAR: baseUrl + "/rep/operation/sum/year",
            },
            /*报表管理--停车次数报表*/
            PARKING_NUM_REPORT: {
                PARKING_NUM_PAGINATION_DAY: baseUrl + "/rep/parklot_parking/day",
                PARKING_NUM_PAGINATION_MOUTH: baseUrl + "/rep/parklot_parking/month",
                PARKING_NUM_PAGINATION_YEAR: baseUrl + "/rep/parklot_parking/year",
                PARKING_NUM_LIST_DAY: baseUrl + "/rep/parklot_parking/day/excel",
                PARKING_NUM_LIST_COUNT_DAY: baseUrl + "/rep/parklot_parking/day/excel_count",
                PARKING_NUM_LIST_MOUTH: baseUrl + "/rep/parklot_parking/month/excel",
                PARKING_NUM_LIST_COUNT_MOUTH: baseUrl + "/rep/parklot_parking/month/excel_count",
                PARKING_NUM_LIST_YEAR: baseUrl + "/rep/parklot_parking/year/excel",
                PARKING_NUM_LIST_COUNT_YEAR: baseUrl + "/rep/parklot_parking/year/excel_count",
            },
            /*报表管理--支付方式收费报表*/
            PAYWAY_CHARGE_REPORT: {
                PAYWAY_CHARGE_PAGINATION_DAY: baseUrl + "/rep/pay_type/operation/day",
                PAYWAY_CHARGE_PAGINATION_MOUTH: baseUrl + "/rep/pay_type/operation/month",
                PAYWAY_CHARGE_PAGINATION_YEAR: baseUrl + "/rep/pay_type/operation/year",
                PAYWAY_CHARGE_LIST_DAY: baseUrl + "/rep/pay_type/excel/day",
                PAYWAY_CHARGE_LIST_COUNT_DAY: baseUrl + "/rep/pay_type/excel_count/day",
                PAYWAY_CHARGE_LIST_MOUTH: baseUrl + "/rep/pay_type/month/excel",
                PAYWAY_CHARGE_LIST_COUNT_MOUTH: baseUrl + "/rep/pay_type/month/excel_count",
                PAYWAY_CHARGE_LIST_YEAR: baseUrl + "/rep/pay_type/year/excel",
                PAYWAY_CHARGE_LIST_COUNT_YEAR: baseUrl + "/rep/pay_type/year/excel_count",
            },
            /*报表管理--支付终端收费报表*/
            PAYTERMINAL_CHARGE_REPORT: {
                PAYTERMINAL_CHARGE_PAGINATION_DAY: baseUrl + "/paysrc/operation",
                PAYTERMINAL_CHARGE_PAGINATION_MOUTH: baseUrl + "/paysrc/operation/month",
                PAYTERMINAL_CHARGE_PAGINATION_YEAR: baseUrl + "/paysrc/operation/year",
                PAYTERMINAL_CHARGE_LIST_DAY: baseUrl + "/paysrc/excel",
                PAYTERMINAL_CHARGE_LIST_COUNT_DAY: baseUrl + "/paysrc/excel_count",
                PAYTERMINAL_CHARGE_LIST_MOUTH: baseUrl + "/paysrc/month/excel",
                PAYTERMINAL_CHARGE_LIST_COUNT_MOUTH: baseUrl + "/paysrc/month/excel_count",
                PAYTERMINAL_CHARGE_LIST_YEAR: baseUrl + "/paysrc/year/excel",
                PAYTERMINAL_CHARGE_LIST_COUNT_YEAR: baseUrl + "/paysrc/year/excel_count",
            },
            /*报表管理--月卡购买终端报表*/
            BUYTERMINAL_REPORT: {
                BUYTERMINAL_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/card_pay/day",
                BUYTERMINAL_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/card_pay/month",
                BUYTERMINAL_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/card_pay/year",
                BUYTERMINAL_REPORT_LIST_DAY: baseUrl + "/frontend/rep/card_pay/day/excel",
                BUYTERMINAL_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/card_pay/day/excel_count",
                BUYTERMINAL_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/card_pay/month/excel",
                BUYTERMINAL_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/card_pay/month/excel_count",
                BUYTERMINAL_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/card_pay/year/excel",
                BUYTERMINAL_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/card_pay/year/excel_count",
            },
            /*报表管理--异常抬报表*/
            UNUSUALPASS_REPORT: {
                UNUSUALPASS_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/parking_ext/day",
                UNUSUALPASS_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/parking_ext/month",
                UNUSUALPASS_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/parking_ext/year",
                UNUSUALPASS_REPORT_LIST_DAY: baseUrl + "/frontend/rep/parking_ext/day/excel",
                UNUSUALPASS_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/parking_ext/day/excel_count",
                UNUSUALPASS_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/parking_ext/month/excel",
                UNUSUALPASS_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/parking_ext/month/excel_count",
                UNUSUALPASS_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/parking_ext/year/excel",
                UNUSUALPASS_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/parking_ext/year/excel_count",
            },
            /*报表管理--各优惠券领用报表*/
            EACHCOUPONUSE_REPORT: {
                EACHCOUPONUSE_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/coupon_used/day",
                EACHCOUPONUSE_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/coupon_used/month",
                EACHCOUPONUSE_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/coupon_used/year",
                EACHCOUPONUSE_REPORT_LIST_DAY: baseUrl + "/frontend/rep/coupon_used/day/excel",
                EACHCOUPONUSE_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/coupon_used/day/excel_count",
                EACHCOUPONUSE_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/coupon_used/month/excel",
                EACHCOUPONUSE_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/coupon_used/month/excel_count",
                EACHCOUPONUSE_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/coupon_used/year/excel",
                EACHCOUPONUSE_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/coupon_used/year/excel_count",
            },
            /*报表管理--泊位运营报表*/
            BERTHOPERATE_REPORT: {
                BERTHOPERATE_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/parking_operation/day",
                BERTHOPERATE_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/parking_operation/month",
                BERTHOPERATE_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/parking_operation/year",
                BERTHOPERATE_REPORT_LIST_DAY: baseUrl + "/frontend/rep/parking_operation/day/excel",
                BERTHOPERATE_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/parking_operation/day/excel_count",
                BERTHOPERATE_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/parking_operation/month/excel",
                BERTHOPERATE_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/parking_operation/month/excel_count",
                BERTHOPERATE_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/parking_operation/year/excel",
                BERTHOPERATE_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/parking_operation/year/excel_count",
            },
            /*报表管理--营业额报表*/
            TURNOVER_REPORT: {
                TURNOVER_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/turnover/day",
                TURNOVER_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/turnover/month",
                TURNOVER_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/turnover/year",
                TURNOVER_REPORT_LIST_DAY: baseUrl + "/frontend/rep/turnover/day/excel",
                TURNOVER_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/turnover/day/excel_count",
                TURNOVER_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/turnover/month/excel",
                TURNOVER_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/turnover/month/excel_count",
                TURNOVER_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/turnover/year/excel",
                TURNOVER_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/turnover/year/excel_count",
            },
            /*报表管理--停车场月卡购买报表*/
            MONTHCARDBUY_REPORT: {
                MONTHCARDBUY_REPORT_PAGINATION_DAY: baseUrl + "/frontend/rep/parklot_card/day",
                MONTHCARDBUY_REPORT_PAGINATION_MOUTH: baseUrl + "/frontend/rep/parklot_card/month",
                MONTHCARDBUY_REPORT_PAGINATION_YEAR: baseUrl + "/frontend/rep/parklot_card/year",
                MONTHCARDBUY_REPORT_LIST_DAY: baseUrl + "/frontend/rep/parklot_card/day/excel",
                MONTHCARDBUY_REPORT_LIST_COUNT_DAY: baseUrl + "/frontend/rep/parklot_card/day/excel_count",
                MONTHCARDBUY_REPORT_LIST_MOUTH: baseUrl + "/frontend/rep/parklot_card/month/excel",
                MONTHCARDBUY_REPORT_LIST_COUNT_MOUTH: baseUrl + "/frontend/rep/parklot_card/month/excel_count",
                MONTHCARDBUY_REPORT_LIST_YEAR: baseUrl + "/frontend/rep/parklot_card/year/excel",
                MONTHCARDBUY_REPORT_LIST_COUNT_YEAR: baseUrl + "/frontend/rep/parklot_card/year/excel_count",
            },
            /*报表管理--年度收费报表*/
            YEARCHARGE_REPORT: {
              YEARCHARGE_REPORT_PAGINATION: baseUrl + "/frontend/rep/annual_fee/year/page",
              YEARCHARGE_REPORT_LIST: baseUrl + "/frontend/rep/annual_fee/day/excel",
              YEARCHARGE_REPORT_LIST_COUNT: baseUrl + "/frontend/rep/annual_fee/year/excel_count",
              YEARCHARGE_REPORT_WALLET: baseUrl + "/frontend/rep/annual_fee/wallet/recharge",
          },
            /*监控告警*/
            MONITORALARM: {
                MONITORALARM_PAGINATION: baseUrl + "/monitor/alarm/pagination"
            }
        },
        ResultCode: {
            CODE_SUCCESS: "000000"
        },
        CONFIRM_MODE_NOTICE: "NOTICE", //通知模式
        CONFIRM_MODE_CONFIRM: "CONFIRM", //询问模式
        MAP_CENTER: [120.360, 30.302], //地图聚焦点
        ExcelMode: {
            COUNT: 1, //请求导出总数
            EXCEL: 2 //请求导出内容
        }
    });
})();