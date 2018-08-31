'use strict';

angular.module('parkingApp').controller(
	'mouthcardEditCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, mouthcardService,sessionCache,StateName,companyService,$timeout,parklotsService) {

    var indexId = "#mouthcardEdit";
    $scope.submited = false;
    $scope.totalBerth = 0;

    $scope.formData = {};
    $scope.formData.parklotCodes = [];
    $scope.formData.parklotNames = [];
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.mouthcard.index;
    $scope.formData.status = $state.params.status;
    $scope.typeOptions=sessionCache.getDictsByLookupName("CARD_TYPE");
    $scope.cardChannelOptions=sessionCache.getDictsByLookupName("MONTH_CARD_CHANNEL");
    if($state.params.status == 2) {
      $("input[name='cardName']").attr('readonly',true);
      $("input[name='price']").attr('readonly',true);
    }

    mouthcardService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });
    $scope.formData.cardCode = $state.params.code;

    mouthcardService.reqDetail($state.params.code).then(function(resp) {
      fillForm(resp.data);
    }, function (msg) {
        growl.addErrorMessage(msg, {ttl: 2000});
    });

    function fillForm(dto) {
        $scope.formData.cardName = dto.cardName;
        $scope.formData.type = dto.type;
        $scope.formData.cardType = sessionCache.getLookupValueByLookupName('CARD_TYPE',dto.type);
        $scope.formData.price = dto.price;
        $scope.formData.cardSum = dto.cardSum;
        $scope.formData.cardChannel = dto.cardChannel;
        $scope.formData.parklotCodeList = dto.parklotCodeList;
        $timeout(function() {
          $.each(dto.parklotCodeList,(index,value) => {
            $("input:checkbox[name='checkItem']").each(function() {
              if(value.parklotCode == $(this).val()) {
                $(this).attr('checked',true);
                $(this).parent().parent().addClass('warning');
              }
            });
            $scope.totalBerth = $scope.totalBerth + value.berthNum;
          });
          $('.berthnum').html("已选"+$scope.totalBerth +"个车位" );
        },100);
        
    }

    $scope.submitForm = function (isValid) {
        $scope.submited = true;
        if($scope.formData.price < 0) {
          growl.addErrorMessage("购买金额不能小于0元！", {ttl: 2000});
          return ;
        }
        if($scope.formData.cardSum < 0) {
          growl.addErrorMessage("发行数量不能小于0！", {ttl: 2000});
          return ;
        }
        if (isValid) {
          let totalBerth = 0;
          $("input:checkbox[name='checkItem']:checked").parent().next().find('span:eq(1)').each(function() {
            totalBerth = totalBerth+ parseInt($(this).html());
          });
          // if($scope.formData.cardSum > totalBerth) {
          //   growl.addErrorMessage("发行数量不得大于泊位总数！", {ttl: 2000});
          //   return ;
          // }
          $("input:checkbox[name='checkItem']:checked").each(function() {
            $scope.formData.parklotCodes.push($(this).val());
            $scope.formData.parklotNames.push($(this).parent().next().find('span:eq(0)').html());
          });
          if($scope.formData.parklotCodes.length == 0) {
            growl.addErrorMessage("请选择停车场！", {ttl: 2000});
            return ;
          }
          mouthcardService.updateCard($scope.formData).then(function (resp) {
              let {code,msg,data} = resp;
              if(code === Setting.ResultCode.CODE_SUCCESS) {
                growl.addInfoMessage('修改成功', {ttl: 2000});
                $state.go($scope.stateGoIndex);
              }else {
                growl.addErrorMessage(msg, {ttl: 2000});
              }
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };

    $(function() {
      function initTableCheckbox() {
        var $thr = $('table thead tr');
        var $checkAllTh = $('table thead tr th:eq(0)');
        var $checkAll = $thr.find('input');
        $checkAll.click(function(event) {
          $scope.totalBerth = 0;
          $tbr.find('input').prop('checked', $(this).prop('checked'));
          if($(this).prop('checked')) {
            $('table tbody tr').each(function() {
              $scope.totalBerth = $scope.totalBerth + parseInt($(this).find("span:eq(1)").html());
            });
            $tbr.find('input').parent().parent().addClass('warning');
          } else {
            $scope.totalBerth = 0;
            $tbr.find('input').parent().parent().removeClass('warning');
          }
          $('.berthnum').html("已选"+$scope.totalBerth +"个车位" );
          event.stopPropagation();
        });
        $checkAllTh.click(function() {
          $(this).find('input').click();
        });
        var $tbr = $('table tbody tr');
        $tbr.find('input').click(function(event) {
          if($(this).prop('checked')) {
            $scope.totalBerth = $scope.totalBerth + parseInt($(this).parent().next().find('span:eq(1)').html());
          }else {
            $scope.totalBerth = $scope.totalBerth - parseInt($(this).parent().next().find('span:eq(1)').html());
            if($scope.totalBerth < 0 || $scope.totalBerth == 0) {
              $scope.totalBerth = 0;
            }
          }
          $('.berthnum').html("已选"+$scope.totalBerth +"个车位" );
          $(this).parent().parent().toggleClass('warning');
          $checkAll.prop('checked', $tbr.find('input:checked').length == $('table tbody tr').length ? true : false);
          event.stopPropagation();
        });
        $tbr.click(function() {
          $(this).find('input').click();
        });
      }
      $timeout(function() {
        initTableCheckbox();
      },300)
      
    });
    
});