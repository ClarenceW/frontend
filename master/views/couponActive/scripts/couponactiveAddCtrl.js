'use strict';

angular.module('parkingApp').controller(
	'couponActiveAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, couponactiveService,sessionCache,StateName,companyService,$timeout,parklotsService,couponruleService,$element) {

    $scope.submited = false;
    $scope.formData = {};
    $scope.tempData = {};
    $scope.couponIsLimit = false;
    $scope.stateGoIndex = StateName.couponActive.index;
    $scope.conditionOptions=sessionCache.getDictsByLookupName("COUPON_ACTIVITY_RELATE_TYPE");
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });
    couponactiveService.reqList().then(function(resp) {
      let arr = resp;
      $scope.couponRuleOptions = arr;
    });
    $scope.formData.startTime = new Date().format("yyyy-MM-dd 00:00:00");
    $scope.formData.endTime = new Date().format("yyyy-MM-dd 23:59:59");
    $scope.formData.freeNum = 1 + ' 次';
    $scope.formData.couponRuleType = 1;
    $scope.formData.getCondition = 1;
    $scope.limitDay = 1;
    $scope.limitMax = 1;
    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': ''
      });
    },150);

    //优惠规则下拉框的监听事件
    $(document).on('change','.couponRuleId',function() {
      let aa = $(this).parent().parent().parent().parent().attr('id');
      if(!$(this).val()) {
        growl.addWarnMessage('请选择优惠规则', {ttl: 2000});
        return ;
      }else {
        couponruleService.reqDetail($(this).val()).then((res)=>{
          let dataobj = {};
          dataobj.couponRuleType = res.data.couponRuleType;
          dataobj.couponRule = res.data.couponRuleName;
          if(res.data.couponRuleType == 1) {
            dataobj.couponMoney = res.data.couponMoney;
            $("#"+aa).find("input[name='couponPrice']").parent().parent().parent().show();
            $("#"+aa).find("input[name='freeNum']").parent().parent().parent().hide();
          }else {
            $("#"+aa).find("input[name='couponPrice']").parent().parent().parent().hide();
            $("#"+aa).find("input[name='freeNum']").parent().parent().parent().show();
            $("#"+aa).find("input[name='freeNum']").show();
            dataobj.couponMoney = 0;
          }
          dataobj.couponDesc = res.data.couponDesc;
          dataobj.freeNum = res.data.freeNum;
          dataobj.validStartTime = res.data.couponStartTime;
          dataobj.validEndTime = res.data.couponEndTime;
          $("#"+aa).find("input[name='couponPrice']").val(res.data.couponMoney);
          $("#"+aa).find("input[name='ruleDesc']").val(res.data.couponDesc);
          $("#"+aa).find("input[name='freeNum']").val(res.data.freeNum + '次');
          $("#"+aa).find("input[name='couponvalidtime']").val(res.data.couponStartTime + ' ~ ' + res.data.couponEndTime);
          $timeout(function() {
            $("#"+aa).find('.selectpicker').selectpicker({
              'selectedText': ''
            });
          },150);
          $("#"+aa).find("input[type='hidden']").val(JSON.stringify(dataobj));
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
      }
      
    })
    //自主领取情况下的下拉框监听事件
    $(document).on('change','.couponRuleId1',function() {
      let aa = $(this).parent().parent().parent().parent().attr('id');
      if(!$(this).val()) {
        growl.addInfoMessage('请选择优惠规则', {ttl: 2000});
        return ;
      }
      couponruleService.reqDetail($(this).val()).then((res)=>{
        let dataobj = {};
        dataobj.couponRuleType = res.data.couponRuleType;
        dataobj.couponRule = res.data.couponRuleName;
        if(res.data.couponRuleType == 1) {
          dataobj.couponMoney = res.data.couponMoney;
          $("#"+aa).find("input[name='couponPrice']").parent().parent().parent().show();
          $("#"+aa).find("input[name='freeNum']").parent().parent().parent().hide();
        }else {
          $("#"+aa).find("input[name='couponPrice']").parent().parent().parent().hide();
          $("#"+aa).find("input[name='freeNum']").parent().parent().parent().show();
          $("#"+aa).find("input[name='freeNum']").show();
          dataobj.couponMoney = 0;
        }
        dataobj.couponDesc = res.data.couponDesc;
        dataobj.freeNum = res.data.freeNum;
        dataobj.validStartTime = res.data.couponStartTime;
        dataobj.validEndTime = res.data.couponEndTime;
        $("#"+aa).find("input[name='couponPrice']").val(res.data.couponMoney);
        $("#"+aa).find("input[name='ruleDesc']").val(res.data.couponDesc);
        $("#"+aa).find("input[name='freeNum']").val(res.data.freeNum + '次');
        $("#"+aa).find("input[name='couponvalidtime']").val(res.data.couponStartTime + ' ~ ' + res.data.couponEndTime);
        $timeout(function() {
          $("#"+aa).find('.selectpicker').selectpicker({
            'selectedText': ''
          });
        },150);
        $("#"+aa).find("input[type='hidden']").val(JSON.stringify(dataobj));
      }, function (msg) {
          growl.addErrorMessage(msg, {ttl: 2000});
      });
    })
    $element.on('change',"input[type='radio'][name='couponIsLimit']",function(){
      if($(this).val() == 'false') {
        $(".timeRange").show();
        $(".limitNum").show();
        $scope.couponIsLimit = true;
      }else {
        $(".timeRange").hide();
        $(".limitNum").hide();
        $scope.couponIsLimit = false;
      }
    })
    //添加优惠规则
    $scope.addRule = ()=>{
      if($(".avtivityContent").length < 4) {
        //给每个规则添加id
        let timestamp = new Date().getTime();
        let cloneAct = $(".avtivityContent").eq(0).clone().attr("id",timestamp);
        //删除事件
        let delRule = $("<div class='delRule'><span class='fa fa-trash-o'></span></div>").bind('click',function(){
          $(this).parent().animate({height:0},'normal',function() {
            $(this).remove();
            if($(".avtivityContent").length == 4) {
              $(".addRule").attr('disabled',true);
            }else {
              $(".addRule").attr('disabled',false);
            }
          });
        });
        //清空新增活动的输入框和下拉框
        $(cloneAct).find('input,select').val('');
        $(cloneAct).find("select[name='rangeCode']").val();
        $timeout(function() {
          $(cloneAct).find(".show-tick").eq(0).remove();
          $(cloneAct).find('.selectpicker').selectpicker({
            'selectedText': ''
          }); 
          $(cloneAct).find('.selectpicker').selectpicker('render'); 
        },150);
        $(cloneAct).append(delRule);
        $(".avtivityBox").append(cloneAct);
        //添加活动按钮的控制
        if($(".avtivityContent").length == 4) {
          $(".addRule").attr('disabled',true);
        }else {
          $(".addRule").attr('disabled',false);
        }
      }else if($(".avtivityContent").length == 4) {
        $(".addRule").attr('disabled',true);
      }
    }
    //提交
    $scope.submitForm = function (isValid) {
      $scope.submited = true;
      if ($scope.formData.startTime && $scope.formData.endTime) {
        if (new Date($scope.formData.startTime) > new Date($scope.formData.endTime)) {
            growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
            return;
        }
      }
      if (isValid) {
        let data = {};
        data.couponActivityName = $scope.formData.couponActivityName;
        data.getCondition = $scope.formData.getCondition;
        data.startTime = $scope.formData.startTime;
        data.endTime = $scope.formData.endTime;
        data.activityDesc = $scope.formData.activityDesc;
        data.ruleListInsertReqList = [];
        if($scope.formData.getCondition == 1||$scope.formData.getCondition==4) {
          for(let i = 0;i < $(".avtivityContent").length;i++) {
            if($(".avtivityContent").eq(i).find("input[name='couponIsLimit']").val() < 0 || $(".avtivityContent").eq(i).find("input[name='couponIsLimit']").val() == 0 || $(".avtivityContent").eq(i).find("input[name='couponIsLimit']").val() > 10) {
              growl.addErrorMessage('赠送张数须大于0小于等于10', {ttl: 2000});
              return ;
            }
            for(let j = 0;j < data.ruleListInsertReqList.length;j++) {
              if(data.ruleListInsertReqList[j].couponRuleId == $(".avtivityContent").eq(i).find("select[name='couponRuleId']").val()) {
                growl.addErrorMessage('优惠规则重复', {ttl: 2000});
              return ;
              }
            }
            let obj = {};
            obj.couponRuleId = $(".avtivityContent").eq(i).find("select[name='couponRuleId']").val();
            obj.rangeCode = $(".avtivityContent").eq(i).find("select[name='rangeCode']").val();
            obj.couponRecMax = $(".avtivityContent").eq(i).find("input[name='couponIsLimit']").val();
            let ggg = $(".avtivityContent").eq(i).find("input[type='hidden']").val();
            if(!(obj.couponRuleId && obj.rangeCode && obj.couponRecMax && ggg)) {
              growl.addErrorMessage('请输入完整信息', {ttl: 2000});
              return ;
            }
            obj.couponRule = JSON.parse(ggg).couponRule;
            obj.couponRuleType = JSON.parse(ggg).couponRuleType;
            obj.ruleDesc = JSON.parse(ggg).couponDesc;
            obj.couponPrice = JSON.parse(ggg).couponMoney;
            obj.freeNum = JSON.parse(ggg).freeNum;
            obj.couponIsLimit = false;
            obj.validEndTime = JSON.parse(ggg).validEndTime.substring(0,10);
            obj.validStartTime = JSON.parse(ggg).validStartTime.substring(0,10);
            data.ruleListInsertReqList.push(obj);
          }
        }else {
          let obj = {};
          obj.couponRuleId = $("#rule3").find("select[name='couponRuleId']").val();
          obj.rangeCode = $("#rule3").find("select[name='rangeCode']").val();
          let ggg = $("#rule3").find("input[type='hidden']").val();
          if(!(obj.couponRuleId && obj.rangeCode && ggg)) {
            growl.addErrorMessage('请输入完整信息', {ttl: 2000});
            return ;
          }
          if($("#rule3").find("input[name='couponIsLimit']").val() < 0 || $("#rule3").find("input[name='couponIsLimit']").val() == 0) {
            growl.addErrorMessage('发行张数须大于0', {ttl: 2000});
            return ;
          }
          obj.couponRule = JSON.parse(ggg).couponRule;
          obj.couponRuleType = JSON.parse(ggg).couponRuleType;
          obj.ruleDesc = JSON.parse(ggg).couponDesc;
          obj.couponPrice = JSON.parse(ggg).couponMoney;
          obj.freeNum = JSON.parse(ggg).freeNum;
          obj.couponIsLimit = $scope.couponIsLimit;
          obj.couponCount = $scope.formData.couponCount;
          obj.validEndTime = JSON.parse(ggg).validEndTime.substring(0,10);
          obj.validStartTime = JSON.parse(ggg).validStartTime.substring(0,10);
          data.ruleListInsertReqList.push(obj);
        }
        couponactiveService.addActive(data).then(function (msg) {
            growl.addInfoMessage('新增成功', {ttl: 2000});
            $state.go($scope.stateGoIndex);
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
            return ;
        });
      }else {
        growl.addErrorMessage('请输入完整信息', {ttl: 2000});
        return ;
      }
    };
}).directive('activerule1',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template1.html'
  };
}).directive('activerule2',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template2.html'
  };
}).directive('activerule3',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template3.html'
     }
}).directive('activerule4',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template4.html'
  };
}).directive('activerule5',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template5.html'
  };
}).directive('activerulecommon',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/templateCommon.html'
  };
});