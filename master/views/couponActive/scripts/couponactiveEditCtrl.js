'use strict';

angular.module('parkingApp').controller(
	'couponactiveEditCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, couponactiveService,sessionCache,StateName,companyService,$timeout,parklotsService,couponruleService,$element) {
    $scope.formData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.couponActive.index;
    $scope.formData.couponActivityType = $state.params.couponActivityType;
    $scope.conditionOptions=sessionCache.getDictsByLookupName("COUPON_ACTIVITY_RELATE_TYPE");
    $scope.ruleOptions = sessionCache.getDictsByLookupName("COUPON_RULE_TYPE");
    $scope.submited = false;

    couponactiveService.reqDetail($state.params).then(function (res) {
        var dto = res.data;
        fillForm(dto);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });
    parklotsService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });
    couponactiveService.reqList().then(function(resp) {
      let arr = resp;
      $scope.couponRuleOptions = arr;
    });

    function hindleDom(ele) {
      let aa = $(ele).parent().parent().parent().parent().attr('id');
      if(!$(ele).val()) {
        growl.addWarnMessage('请选择优惠规则', {ttl: 2000});
        return ;
      }
      couponruleService.reqDetail($(ele).val()).then((res)=>{
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

    function fillForm(dto) {
      $scope.formData.couponActivityId = dto.couponActivityId;
      $scope.formData.activityStatus = dto.activityStatus;
      $scope.formData.couponActivityName = dto.couponActivityName;
      $scope.formData.getcondition = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_RELATE_TYPE',dto.getCondition);
      $scope.formData.getCondition = dto.getCondition;
      $scope.formData.activityStatus = sessionCache.getLookupValueByLookupName('COUPON_ACTIVITY_STATUS',dto.activityStatus);
      $scope.formData.startTime = dto.startTime;
      $scope.formData.endTime = dto.endTime;
      $scope.formData.opUser = dto.opUser;
      $scope.formData.createTime = dto.createTime;
      $scope.formData.couponRuleType = dto.couponRuleType;
      $scope.formData.couponActivityDesc = dto.couponActivityDesc;
      
      if(dto.getCondition == 3) {
        $scope.couponIsLimit = dto.ruleDetailListDtos[0].couponIsLimit;
        if(!dto.ruleDetailListDtos[0].couponIsLimit) {
          $scope.formData.couponCount = 0;
          $("#rule3").find("input[name='couponIsLimit'][value='true']").attr('checked',"checked");
          $("#rule3").find("input[name='couponIsLimit'][value='false']").removeAttr("checked");
          $(".timeRange").hide();
          $(".limitNum").hide();
        }else {
          $("#rule3").find("input[name='couponIsLimit'][value='false']").attr('checked',"checked");
          $("#rule3").find("input[name='couponIsLimit'][value='true']").removeAttr("checked");
          $(".timeRange").show();
          $(".limitNum").show();
          $scope.formData.couponCount = dto.ruleDetailListDtos[0].couponCount;
        }
        if(dto.ruleDetailListDtos[0].couponRuleType == 1) {
          $("#rule3").find("input[name='couponPrice']").val(dto.ruleDetailListDtos[0].couponPrice).parent().parent().parent().show();
          $("#rule3").find("input[name='freeNum']").val(dto.ruleDetailListDtos[0].freeNum).parent().parent().parent().hide();
        }else {
          $("#rule3").find("input[name='couponPrice']").val(dto.ruleDetailListDtos[0].couponPrice).parent().parent().parent().hide();
          $("#rule3").find("input[name='freeNum']").val('1次').parent().parent().parent().show();
        }
        $("#rule3").find("select[name='couponRuleId']").val(dto.ruleDetailListDtos[0].couponRuleId);
        $("#rule3").find("select[name='rangeCode']").val(dto.ruleDetailListDtos[0].rangeCode);
        $("#rule3").find("input[name='ruleDesc']").val(dto.ruleDetailListDtos[0].ruleDesc);
        $("#rule3").find("input[name='couponvalidtime']").val(dto.ruleDetailListDtos[0].validStartTime + '~' +dto.ruleDetailListDtos[0].validEndTime);
        let dataobj = {};
        dataobj.couponRuleType = dto.ruleDetailListDtos[0].couponRuleType;
        dataobj.couponRule = dto.ruleDetailListDtos[0].couponRule;
        dataobj.couponMoney = dto.ruleDetailListDtos[0].couponPrice;
        dataobj.validEndTime = dto.ruleDetailListDtos[0].validEndTime;
        dataobj.validStartTime = dto.ruleDetailListDtos[0].validStartTime;
        dataobj.couponCount = dto.ruleDetailListDtos[0].couponCount;
        dataobj.freeNum = dto.ruleDetailListDtos[0].freeNum;
        dataobj.ruleDesc = dto.ruleDetailListDtos[0].ruleDesc;
        dataobj.couponRuleId = dto.ruleDetailListDtos[0].couponRuleId;
        $("#rule3").find("input[type='hidden']").val(JSON.stringify(dataobj));
        $timeout(function() {
          $("#rule3").find('.selectpicker').selectpicker({
            'selectedText': ''
          });
        },150);
        $("#rule3").find(".couponRuleId1").change(function(){
          hindleDom($(this));
        });
      }else {
        for(let i = 0;i < dto.ruleDetailListDtos.length;i++) {
          if(i == 0) {
            $("#firstRule").find("select[name='couponRuleId']").val(dto.ruleDetailListDtos[i].couponRuleId);
            $("#firstRule").find("select[name='rangeCode']").val(dto.ruleDetailListDtos[i].rangeCode);
            $("#firstRule").find("input[name='couponPrice']").val(dto.ruleDetailListDtos[i].couponPrice);
            $("#firstRule").find("input[name='freeNum']").val(dto.ruleDetailListDtos[i].freeNum);
            $("#firstRule").find("input[name='ruleDesc']").val(dto.ruleDetailListDtos[i].ruleDesc);
            $("#firstRule").find("input[name='couponvalidtime']").val(dto.ruleDetailListDtos[i].validStartTime + '~' +dto.ruleDetailListDtos[0].validEndTime);
            $("#firstRule").find("input[name='couponIsLimit']").val(dto.ruleDetailListDtos[i].couponRecMax );
            let dataobj = {};
            dataobj.couponRuleType = dto.ruleDetailListDtos[i].couponRuleType;
            dataobj.couponRule = dto.ruleDetailListDtos[i].couponRule;
            dataobj.couponMoney = dto.ruleDetailListDtos[i].couponPrice;
            dataobj.validEndTime = dto.ruleDetailListDtos[i].validEndTime;
            dataobj.validStartTime = dto.ruleDetailListDtos[i].validStartTime;
            dataobj.couponRecMax = dto.ruleDetailListDtos[i].couponRecMax;
            dataobj.freeNum = dto.ruleDetailListDtos[i].freeNum;
            dataobj.ruleDesc = dto.ruleDetailListDtos[i].ruleDesc;
            dataobj.couponRuleId = dto.ruleDetailListDtos[i].couponRuleId;
            $("#firstRule").find("input[type='hidden']").val(JSON.stringify(dataobj));
            $timeout(function() {
              $("#firstRule").find('.selectpicker').selectpicker({
                'selectedText': ''
              });
            },150);
            $("#firstRule").find(".couponRuleId").change(function(){
              hindleDom($(this));
            });
          }else {
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
            $timeout(() => {
              $(cloneAct).find("select[name='couponRuleId']").val(dto.ruleDetailListDtos[i].couponRuleId);
              $(cloneAct).find("select[name='rangeCode']").val(dto.ruleDetailListDtos[i].rangeCode);
              $(cloneAct).find("input[name='couponPrice']").val(dto.ruleDetailListDtos[i].couponPrice);
              $(cloneAct).find("input[name='freeNum']").val(dto.ruleDetailListDtos[i].freeNum);
              $(cloneAct).find("input[name='ruleDesc']").val(dto.ruleDetailListDtos[i].ruleDesc);
              $(cloneAct).find("input[name='couponvalidtime']").val(dto.ruleDetailListDtos[i].validStartTime + '~' +dto.ruleDetailListDtos[0].validEndTime);
              $(cloneAct).find("input[name='couponIsLimit']").val(dto.ruleDetailListDtos[i].couponRecMax );
            },50);
            let dataobj = {};
            dataobj.couponRuleType = dto.ruleDetailListDtos[i].couponRuleType;
            dataobj.couponRule = dto.ruleDetailListDtos[i].couponRule;
            dataobj.couponMoney = dto.ruleDetailListDtos[i].couponPrice;
            dataobj.validEndTime = dto.ruleDetailListDtos[i].validEndTime;
            dataobj.validStartTime = dto.ruleDetailListDtos[i].validStartTime;
            dataobj.couponRecMax = dto.ruleDetailListDtos[i].couponRecMax;
            dataobj.freeNum = dto.ruleDetailListDtos[i].freeNum;
            dataobj.ruleDesc = dto.ruleDetailListDtos[i].ruleDesc;
            dataobj.couponRuleId = dto.ruleDetailListDtos[i].couponRuleId;
            $(cloneAct).find("input[type='hidden']").val(JSON.stringify(dataobj));
            $timeout(function() {
              $(cloneAct).find('.selectpicker').selectpicker({
                'selectedText': ''
              });
            },150);
            $(cloneAct).find("select[name='couponRuleId']").bind('change',function() {
              hindleDom($(this));
            });
            $(cloneAct).append(delRule);
            $(".avtivityBox").append(cloneAct);
          }
        }
      }
    };

    $(document).on('change',"input[type='radio'][name='couponIsLimit']",function(){
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
        //优惠规则下拉框事件监听
        $(cloneAct).find("select[name='couponRuleId']").bind('change',function() {
          hindleDom($(this));
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
      if(!$scope.formData.startTime) {
        growl.addErrorMessage("请选择起始日期", {ttl: 2000});
        return;
      }
      if(!$scope.formData.endTime) {
        growl.addErrorMessage("请选择结束日期", {ttl: 2000});
        return;
      }
      if ($scope.formData.startTime && $scope.formData.endTime) {
        if ($scope.formData.startTime > $scope.formData.endTime) {
            growl.addErrorMessage("起始日期不得晚于结束日期", {ttl: 2000});
            return;
        }
      }
      if (isValid) {
        let data = {};
        data.couponActivityName = $scope.formData.couponActivityName;
        data.getCondition = $scope.formData.getCondition;
        data.startTime = $scope.formData.startTime;
        data.couponActivityId = $scope.formData.couponActivityId;
        data.activityStatus = $scope.formData.activityStatus;
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
          if(!$scope.couponIsLimit) {
            obj.couponCount=0;
          }else {
            obj.couponCount = $scope.formData.couponCount;
          }
          obj.validEndTime = JSON.parse(ggg).validEndTime.substring(0,10);
          obj.validStartTime = JSON.parse(ggg).validStartTime.substring(0,10);
          data.ruleListInsertReqList.push(obj);
        }
        couponactiveService.updateActive(data).then(function (msg) {
            growl.addInfoMessage('修改成功', {ttl: 2000});
            $state.go($scope.stateGoIndex);
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
      }else {
        growl.addErrorMessage('请输入完整信息', {ttl: 2000});
      }
    };
}).directive('editrule1',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template1.html'
  };
}).directive('editrule2',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template2.html'
  };
}).directive('editrule3',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template3.1.html'
  };
}).directive('editrule4',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template4.html'
  };
}).directive('editrule5',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/template5.html'
  };
}).directive('editrulecommon',function () {
  return {
      restrict:'ECMA',
      templateUrl:'views/couponActive/templateCommon.html'
  };
});