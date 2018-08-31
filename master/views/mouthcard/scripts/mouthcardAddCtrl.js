'use strict';

angular.module('parkingApp').controller(
	'mouthcardAddCtrl', function ($rootScope, $scope, $http,Setting, $state, growl, mouthcardService,sessionCache,StateName,companyService,$timeout,parklotsService) {

    var indexId = "#mouthcardAdd";
    $scope.submited = false;
    $scope.totalBerth = 0;

    $scope.formData = {};
    $scope.formData.parklotCodes = [];
    $scope.formData.parklotNames = [];
    $scope.tempData = {};
    $scope.dt = null;
    $scope.stateGoIndex = StateName.mouthcard.index;
    $scope.typeOptions=sessionCache.getDictsByLookupName("CARD_TYPE");
    $scope.cardChannelOptions=sessionCache.getDictsByLookupName("MONTH_CARD_CHANNEL");
    $scope.formData.cardChannel = '0';
    mouthcardService.reqList().then(function(resp) {
      $scope.parklotCodeOptions = resp;
    });

    $timeout(function() {
      $('#parklot').selectpicker({
        'selectedText': 'cat',
        'actionsBox':true,
      });
      $('#parklot').selectpicker('refresh');  
      $('#parklot').selectpicker('render'); 
    },100);

    $scope.submitForm = function (isValid) {
        $scope.submited = true;
        if($scope.formData.price < 0 || $scope.formData.price == 0) {
          growl.addErrorMessage("购买金额必须大于0元！", {ttl: 2000});
          return ;
        }
        if($scope.formData.cardSum < 0 || $scope.formData.cardSum == 0) {
          growl.addErrorMessage("发行数量必须大于0！", {ttl: 2000});
          return ;
        }
        if (isValid) {
          // $("input:checkbox[name='checkItem']:checked").parent().next().find('span:eq(1)').each(function() {
          //   $scope.totalBerth = $scope.totalBerth+ parseInt($(this).html());
          // });
          // if($scope.formData.cardSum > $scope.totalBerth) {
          //   $scope.formData.parklotCodes = [];
          //   $scope.formData.parklotNames = [];
          //   $('table thead tr').find('input').prop('checked', '');
          //   growl.addErrorMessage("发行数量不得大于泊位总数！", {ttl: 2000});
          //   return ;
          // }
          if($scope.formData.parklotCodes.length ==0 && $scope.formData.parklotNames==0) {
            $("input:checkbox[name='checkItem']:checked").each(function() {
              $scope.formData.parklotCodes.push($(this).val());
              $scope.formData.parklotNames.push($(this).parent().next().find('span:eq(0)').html());
            });
            if($scope.formData.parklotCodes.length == 0) {
              growl.addErrorMessage("请选择停车场！", {ttl: 2000});
              return ;
            }
          }
          mouthcardService.addCard($scope.formData).then(function (msg) {
                growl.addInfoMessage('新增成功', {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
            });
        }
    };

    $(function() {
      function initTableCheckbox() {
        var $thr = $('table thead tr');
        var $checkAllTh = $('table thead tr th:eq(0)');
        /*“全选/反选”复选框*/
        var $checkAll = $thr.find('input');
        $checkAll.click(function(event) {
          /*将所有行的选中状态设成全选框的选中状态*/
          $tbr.find('input').prop('checked', $(this).prop('checked'));
          $scope.totalBerth = 0;
          /*并调整所有选中行的CSS样式*/
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
          /*阻止向上冒泡，以防再次触发点击操作*/
          event.stopPropagation();
        });
        /*点击全选框所在单元格时也触发全选框的点击操作*/
        $checkAllTh.click(function() {
          $(this).find('input').click();
        });
        var $tbr = $('table tbody tr');
        /*点击每一行的选中复选框时*/
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
          /*调整选中行的CSS样式*/
          $(this).parent().parent().toggleClass('warning');
          /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
          $checkAll.prop('checked', $tbr.find('input:checked').length == $('table tbody tr').length ? true : false);
          /*阻止向上冒泡，以防再次触发点击操作*/
          event.stopPropagation();
        });
        /*点击每一行时也触发该行的选中操作*/
        $tbr.click(function() {
          $(this).find('input').click();
        });
      }
      $timeout(function() {
        initTableCheckbox();
      },300)
      
    });
    
});