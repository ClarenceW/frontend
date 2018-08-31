'use strict';
angular.module('parkingApp').controller('HomeCtrl', function ($rootScope, $scope, homeService,menuVariables,Setting,$timeout,$sessionStorage,StateName,parklotsService,$filter,$interval,$element,$state) {
	
  let defualtUiSref = $sessionStorage.defualtUiSref;
  $scope.stateGoUseRateDetail = StateName.homeUseRate;
  $scope.stateGoTurnRateDetail = StateName.homeTurnRate;
	if(StateName.home === defualtUiSref){
		$("#home_index").css("visibility","visible");
  }
  $scope.emptydata = false;
  $scope.emptyRechargeway = false;
  $scope.formData = {};
  $scope.parkCharge = 1;
  $scope.chargesort = 1;
  $scope.berthuserate = 1;
  $scope.berthturnrate = 1;
  $scope.sortFive = 0;
  $scope.sortNum = 0;
  $scope.isSort = true;
  const LOOPTIME = 60 * 1000;
	/*累计营业额（元）*/
	$scope.totalChargeFee = 0;
	/*累计充值总额（元）*/
	$scope.totalRechargeFee = 0;
	/*当天营业额*/
	$scope.todayChargeFee = 0;
	/*本月营业额*/
	$scope.mouthChargeFee = 0;
	/*累计车辆总数*/
	$scope.totalCarsNum = 0;
	/*会员车*/
	$scope.vipCarsNum = 0;
	/*临时车*/
	$scope.tempCarsNum = 0;
	/*当天停车*/
	$scope.currentParkingNum = 0;
	/*累计停车*/
	$scope.totalParkingNum = 0;
	/*当天收费总额*/
	$scope.currentChargeAll = 0;
	/*当天充值总额*/
	$scope.currentRechargeAll = 0;
  //获取停车场列表
  function parklotList() {
    parklotsService.reqList().then(resp => {
      $scope.parklotOption = resp;
      if(resp.length > 0 && resp.length <= 9) {
        $scope.isSort = false;
        $scope.sortFive = 0;
        $scope.sortNum = resp.length;
      }else {
        $scope.isSort = true;
        $scope.sortNum = 5;
      }
      $scope.chargeSort(1);
    })
  }
  parklotList();


  /*数据循环*/
  // var timer = $interval(function() {
  //    reqblockdata();
  //    parkcharge();
  // }, LOOPTIME);

  var intervalID = window.setInterval( () => {
    reqblockdata();
    parkcharge();
  },LOOPTIME)

  //数据看板数据
  var reqblockdata = () => {
    /*数据看板--营业额*/
    homeService.reqBlockAlreadypay().then(resp => {
      $scope.totalChargeFee = resp.data.yearAlreadyPayMoney;
      $scope.todayChargeFee = resp.data.todayAlreadyPayMoney;
      $scope.mouthChargeFee = resp.data.monthAlreadyPayMoney;
      $scope.lastDayAlreadyPayMoney = resp.data.lastDayAlreadyPayMoney;
    });
    /*数据看板--停车数--当天*/
    homeService.reqBlockParkingDay().then(resp => {
      $scope.parkingCountDay = resp.data.totalParkingCount;
    });
    /*数据看板--停车数--昨天*/
    homeService.reqBlockParkingYes().then(resp => {
      $scope.parkingCountYes = resp.data.totalParkingCount;
    });
    /*数据看板--停车数--当月*/
    homeService.reqBlockParkingMonth().then(resp => {
      $scope.parkingCountMonth = resp.data.totalParkingCount;
    });
    /*数据看板--订单*/
    homeService.reqBlockOrder().then(resp => {
      $scope.offLineNumber = resp.data.offLineNumber;
      $scope.onLineNumber = resp.data.onLineNumber;
    });
    /*数据看板--会员车/绑定车*/
    homeService.reqBlockVipTemp().then(resp => {
      $scope.vipVehicleNumber = resp.data.vipVehicleNumber;
      $scope.bindVehicleNumber = resp.data.bindVehicleNumber;
    });
    /*数据看板--异常抬杆次数*/
    homeService.reqBlockExtPass().then(resp => {
      $scope.parkingExtCount = resp.data.parkingExtCount;
    });
    /*数据看板--累计停车次数*/
    homeService.reqBlockParkingAll().then(resp => {
      $scope.totalParkingNum = resp.data.totalParkingCount;
    });
  }
  reqblockdata();
  
  var parkcharge = ()=> {
    /*停车收费--收费方式/收费渠道*/
    homeService.reqParkChargeAll().then(resp => {
      $scope.currentChargeAll = resp.data.totalFee;
      let paysrclist = [];
      let paytypelist = [],colorArr1 = [],colorArr2 = [];
      if(resp && resp.data.srcList.length>0 &&resp.data.typeList.length>0) 
        paysrclist = resp.data.srcList.map(item => {
          let paysrc = {};
          let tooltip = {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c}笔 ({d}%)"
          }
          if(item.srcName == '闸口支付') {
            colorArr1.push('#a182f0')
          }else if(item.srcName == '线上支付') {
            colorArr1.push('#ffcc4f')
          }
          paysrc.value = item.paySrcSum;
          paysrc.name = item.srcName;
          paysrc.tooltip = tooltip;
          return paysrc;
        });
        paytypelist = resp.data.typeList.map(item => {
          let paytype = {};
          let tooltip = {
              trigger: 'item',
              formatter: "{a} <br/>{b}: ￥{c} ({d}%)"
          }
          if(item.typeName == '支付宝') {
            colorArr2.push('#5ac9e9')
          }else if(item.typeName == '微信') {
            colorArr2.push('#2acd99')
          }else if(item.typeName == '钱包') {
            colorArr2.push('#6288e8')
          }else if(item.typeName == '现金') {
            colorArr2.push('#39e2c9')
          }else {
            colorArr2.push('#f9a304')
          }
          paytype.value = item.money;
          paytype.name = item.typeName;
          paytype.tooltip = tooltip;
          return paytype;
        });
      if(paysrclist.length == 0 || paytypelist.length ==0)
        $scope.emptydata = true;
      showChart2(paysrclist,paytypelist,colorArr1,colorArr2);
    })
    
    function showChart2(array1,array2,colorArr1,colorArr2){
      $element.find('#container03container').html(` <div class="chart1" id="container03"></div>`);
      let dom = document.getElementById('container03');
      if(!dom){
        console.log('clear timer')
        clearInterval(intervalID);
        return ;
      }
      let myChart = echarts.init(dom);
      let option = {
          title:{
            show:true,
            text:"收费方式分布图",
            x:'left',
            y:'top',
            textStyle:{
              fontSize:20,
              color:'#666666',
              fontWeight: 'normal'
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
              {
                  name:'支付渠道',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '40%'],
                  label: {
                      normal: {
                          position: 'inner',
                          textStyle:{
                            color:'#333333',
                            fontSize:15
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:array1,
                  color:colorArr1
              },
              {
                  name:'支付方式',
                  type:'pie',
                  radius: ['50%', '75%'],
                  label: {
                      normal: {
                          textStyle:{
                            color:'#333333',
                            fontSize:15
                          }
                      }
                  },
                  data:array2,
                  color:colorArr2
              }
          ]
      };
      myChart.setOption(option,true);
    }

    /*停车收费--充值方式/充值渠道*/
    homeService.reqParkRechargeAll().then(resp => {
      $scope.currentRechargeAll = resp.data.totalFee;
      let rechargesrclist = [];
      let rechargetypelist = [],colorArr1 = [],colorArr2 = [];
      if(resp && resp.data.srcList.length>0 &&resp.data.typeList.length>0) 
        rechargesrclist = resp.data.srcList.map(item => {
          let rechargesrc = {};
          if(item.srcName == '线下购买') {
            colorArr1.push('#a182f0')
          }else if(item.srcName == '线上购买') {
            colorArr1.push('#ffcc4f')
          }
          rechargesrc.value = item.money;
          rechargesrc.name = item.srcName;
          rechargesrc.itemStyle = item.itemStyle;
          return rechargesrc;
        });
        rechargetypelist = resp.data.typeList.map(item => {
          let rechargetype = {};
          if(item.typeName == '支付宝') {
            colorArr2.push('#5ac9e9')
          }else if(item.typeName == '微信') {
            colorArr2.push('#2acd99')
          }else if(item.typeName == '钱包') {
            colorArr2.push('#6288e8')
          }else if(item.typeName == '现金') {
            colorArr2.push('#39e2c9')
          }else {
            colorArr2.push('#f9a304')
          }
          rechargetype.value = item.money;
          rechargetype.name = item.typeName;
          return rechargetype;
        });
      if(resp.data.srcList.length == 0 || resp.data.typeList.length == 0)
        $scope.emptyRechargeway = true;
      showChart3(rechargesrclist,rechargetypelist,colorArr1,colorArr2);
    })

    function showChart3(array1,array2,colorArr1,colorArr2){
      $element.find('#container01container').html(` <div class="chart1" id="container01"></div>`);
      let dom = document.getElementById('container01');
      if(!dom){
        clearInterval(intervalID);
        return ;
      }
      let myChart = echarts.init(dom);
      let option = {
          title:{
            show:true,
            text:"购买方式/购买渠道分布图",
            x:'left',
            y:'top',
            textStyle:{
              fontSize:20,
              color:'#666666',
              fontWeight: 'normal'
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: ￥{c} ({d}%)"
          },
          series: [
              {
                  name:'购买渠道',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '40%'],

                  label: {
                      normal: {
                          position: 'inner',
                          textStyle:{
                            color:'#333333',
                            fontSize:15
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:array1,
                  color:colorArr1
              },
              {
                  name:'购买方式',
                  type:'pie',
                  radius: ['50%', '75%'],
                  label: {
                      normal: {
                          textStyle:{
                            color:'#333333',
                            fontSize:15
                          }
                      }
                  },
                  data:array2,
                  color:colorArr2
              }
          ]
      };
      myChart.setOption(option,true);
    }
  }
  parkcharge();

  // 不同时段停车收费趋势图
  $scope.parkingcharge = index => {
    $scope.parkCharge = index;
    let data = {};
    data.index = index;
    data.parklotCode = $scope.formData.parklotCodeChargeTime;
    reqparkingcharge(data);
  }

  $scope.$watch('formData.parklotCodeChargeTime', function (newValue, oldValue) {
    let data = {};
    data.index = $scope.parkCharge;
    data.parklotCode = $scope.formData.parklotCodeChargeTime;
    reqparkingcharge(data);
  }, true);

  function reqparkingcharge(data) {
    homeService.reqParkChargeTimes(data).then(resp => {
      let xArr = [],yArr = [];
      if(resp.data.length > 0) {
        xArr = resp.data.map(item => {
          if($scope.parkCharge == 1) 
            return item.listNo+":00";
          else if($scope.parkCharge ==2)
            return item.listNo+"日";
        });
        yArr = resp.data.map(item => {
          let money = item.money.toFixed(2)+"";
          return money;
        });
      }else {
        if($scope.passnum == 1) {
          xArr = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'];
          return xArr;
        }else if($scope.passnum ==2)
          xArr = ['1日','3日','5日','7日','9日','11日','13日','15日','17日','19日','21日','23日','25日','27日','29日','31日'];
          return xArr;
      }
      showChart4(xArr,yArr);
    })
  }
  $scope.parkingcharge(1);

  function showChart4(array1,array2){
    let dom = document.getElementById('chart01');
    let myChart = echarts.init(dom);
    let option = {
      title:{
        show:true,
        text:'不同时段停车收费趋势图',
        x:'left',
        y:'top'
      },
      textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
      },
      grid: {
        left: '0%',
        right: '3%',
        top: '12%',
        bottom: '5%',
        containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          formatter: '时间：{b}<br />收费总额： ￥{c}',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        },
        axisTick:{
          interval:0,
        },
        data: array1,
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        splitLine: {
          show: false,
        },
      },
      series: [{
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
          normal: {
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(242, 97, 194, 1.0)',
              }, {
                offset: 1,
                color: 'rgba(242, 97, 194, 0.2)',
              }],
              globalCoord: false
            },
          }
        },
        data: array2
      }]
    };
    myChart.setOption(option,true);
  }

  // 收费总额排名
  $scope.chargeSort = index => {
    $scope.chargesort = index;
    let data = {};
    data.sortType = $scope.formData.sortFive;
    data.sortNum = $scope.sortNum;
    data.index = index;
    reqchangesort(data);
  }

  $scope.$watch('formData.sortFive', function (newValue, oldValue) {
    let data = {};
    data.sortType = $scope.formData.sortFive;
    data.sortNum = $scope.sortNum;
    data.index = $scope.chargesort;
    reqchangesort(data);
  }, true);

  function reqchangesort(data) {
    homeService.reqParkChargeSort(data).then(resp => {
      let xArr = [],yArr = [];
      if(resp.data.length > 0) 
        xArr = resp.data.map(item => {
          return item.parklotName;
        });
        yArr = resp.data.map(item => {
          let money = item.money.toFixed(2)+"";
          return money;
        });
      showChart5(xArr,yArr);
    })
  }
  
  function showChart5(array1,array2){
    // console.log(typeof 10589.00);
    let dom = document.getElementById('chart02');
    let myChart = echarts.init(dom);
    let option = {
        title:{
          show:true,
          text:'收费总额排名',
          x:'left',
          y:'top'
        },
        grid: {
          left: '5%',
          right: '3%',
          top: '12%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: '停车场：{b}<br />收费总额: ￥{c}',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
        xAxis : [
          {
            type : 'category',
            data : array1,
            axisLabel:{
              rotate:10,
              interval:0
            }
          }
        ],
        yAxis : [
            {
                type : 'value',
                name : '总额/排名',
                axisLabel : {
                    formatter: '{value}'
                }
            }
        ],
        series : [
            {
              name:'告警数/排名',
              type:'bar',
              barGap:'50%',
              barWidth:'40px',
              /*设置柱状图颜色*/
              itemStyle: {
                  normal: {
                      color: function(params) {
                          // build a color map as your need.
                          let colorList = [
                            '#448aca','#448aca','#448aca','#448aca','#448aca'
                          ];
                          return colorList[params.dataIndex]
                      },
                      /*信息显示方式*/
                      label: {
                          show: false,
                          position: 'top',
                          formatter: '{b}\n{c}',
                          
                      }
                  }
              },
              data:array2
          },
          {
              name:'折线',
              type:'line',
              itemStyle : {  /*设置折线颜色*/
                  normal : {
                      color:'#448aca'
                  }
              },
              data:array2
          }
        ]
    };
    myChart.setOption(option,true);
  }

  $scope.toUseRateDetail = ()=> {
    $state.go($scope.stateGoUseRateDetail);
  }
  // 泊位利用率
  $scope.berthUseRate = index => {
    $scope.berthuserate = index;
    let data = {};
    data.index = index;
    data.parklotCodeList = $scope.formData.parklotCodeUseRate;
    reqberthuserate(data);
  }
  $scope.$watch('formData.parklotCodeUseRate', function (newValue, oldValue) {
    let data = {};
    data.index = $scope.berthuserate;
    data.parklotCodeList = $scope.formData.parklotCodeUseRate;
    reqberthuserate(data);
  }, true);
  function reqberthuserate(data) {
    homeService.reqBerthUseRate(data).then(resp => {
      let twoArr = false;
      $scope.userate = $filter("number")(resp.data[0].curWeekRatio,1);
      let xArr = [],yArr = [],lastyArr = [];
      xArr = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
      yArr = resp.data[0].curRatioList.map(item => {
        if(item != null) {
          twoArr = true;
        }
        return item;
      });
      lastyArr = resp.data[0].lastRatioList.map(item => {
        return item;
      });
      if(twoArr) {
        showChartBerthRate(xArr,yArr,lastyArr);
      }else {
        showChartBerthRate2(xArr,yArr,lastyArr);
      }
    })
  }
  $scope.berthUseRate(1);

  function showChartBerthRate(array1,array2,array3){
    let dom = document.getElementById('chartBerthUseRate');
    let myChart = echarts.init(dom);
    let option = {
      title:{
        show:true,
        text:'各停车场泊位利用率',
        x:'left',
        y:'top'
      },
      textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
      },
      grid: {
        left: '0%',
        right: '5%',
        top: '12%',
        bottom: '2%',
        containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          // formatter: '时间：{b}<br />泊位利用率： {c}%',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        data: array1,
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
          formatter:'{value} %',
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        splitLine: {
          show: false,
        },
      },
      series: [{
        name:'本周',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol:'circle',
        symbolSize:6,
        itemStyle: {
          normal: {
            color:'rgb(249, 166, 13)',
            lineStyle: {
              color: 'rgb(249, 166, 13)'
            }
          }
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(249, 166, 13, 1.0)',
              }, {
                offset: 1,
                color: 'rgba(249, 166, 13, 0.2)',
              }],
              globalCoord: false
            },
          }
        },
        data: array2
      },{
        name:'上周',
        type:'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: 'rgb(249, 166, 13)',
              type:'dashed'
            }
          }
        },
        data:array3
    }]
    };
    myChart.setOption(option,true);
  }

  function showChartBerthRate2(array1,array2,array3){
    let dom = document.getElementById('chartBerthUseRate');
    let myChart = echarts.init(dom);
    let option = {
      title:{
        show:true,
        text:'各停车场泊位利用率',
        x:'left',
        y:'top'
      },
      textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
      },
      grid: {
        left: '0%',
        right: '5%',
        top: '12%',
        bottom: '2%',
        containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          // formatter: '时间：{b}<br />泊位利用率： {c}%',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        data: array1,
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
          formatter:'{value} %',
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        splitLine: {
          show: false,
        },
      },
      series: [{
        name:'上周',
        type:'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: 'rgb(249, 166, 13)',
              type:'dashed'
            }
          }
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(249, 166, 13, 1.0)',
              }, {
                offset: 1,
                color: 'rgba(249, 166, 13, 0.2)',
              }],
              globalCoord: false
            },
          }
        },
        data:array3
    }]
    };
    myChart.setOption(option,true);
  }

  // 泊位周转率
  $scope.toTurnRateDetail = ()=> {
    $state.go($scope.stateGoTurnRateDetail);
  }
  $scope.berthTurnRate = index => {
    $scope.berthturnrate = index;
    let data = {};
    data.index = index;
    data.parklotCodeList = $scope.formData.parklotCodeTurnRate;
    reqberthturnrate(data);
  }
  $scope.$watch('formData.parklotCodeTurnRate', function (newValue, oldValue) {
    let data = {};
    data.index = $scope.berthturnrate;
    data.parklotCodeList = $scope.formData.parklotCodeTurnRate;
    reqberthturnrate(data);
  }, true);
  function reqberthturnrate(data) {
    homeService.reqBerthTurnRate(data).then(resp => {
      let twoArr = false;
      $scope.turnrate = $filter("number")(resp.data[0].curWeekRatio,1);
      let xArr = [],yArr = [],lastyArr = [];
      xArr = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
      yArr = resp.data[0].curRatioList.map(item => {
        if(item != null) {
          twoArr = true;
        }
        return item;
      });
      lastyArr = resp.data[0].lastRatioList.map(item => {
        return item;
      });
      if(twoArr) {
        showChartBerthTurn(xArr,yArr,lastyArr);
      }else {
        showChartBerthTurn2(xArr,yArr,lastyArr);
      }
      
    })
  }
  $scope.berthTurnRate(1);

  function showChartBerthTurn(array1,array2,array3){
    let dom = document.getElementById('chartBerthTurn');
    let myChart = echarts.init(dom);
    let option = {
      title:{
        show:true,
        text:'各停车场泊位周转率',
        x:'left',
        y:'top'
      },
      textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
      },
      grid: {
        left: '0%',
        right: '5%',
        top: '12%',
        bottom: '2%',
        containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          // formatter: '时间：{b}<br />周转率： {c}次',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        data: array1,
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        splitLine: {
          show: false,
        },
      },
      series: [{
        name:'本周',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol:'circle',
        symbolSize:6,
        itemStyle: {
          normal: {
            color:'rgb(99, 222, 241)',
            lineStyle: {
              color: 'rgb(99, 222, 241)'
            }
          }
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(99, 222, 241, 1.0)',
              }, {
                offset: 1,
                color: 'rgba(99, 222, 241, 0.2)',
              }],
              globalCoord: false
            },
          }
        },
        data: array2
      },{
        name:'上周',
        type:'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: 'rgb(99, 222, 241)',
              type:'dashed'
            }
          }
        },
        data:array3
    }]
    };
    myChart.setOption(option,true);
  }

  function showChartBerthTurn2(array1,array2,array3){
    let dom = document.getElementById('chartBerthTurn');
    let myChart = echarts.init(dom);
    let option = {
      title:{
        show:true,
        text:'各停车场泊位周转率',
        x:'left',
        y:'top'
      },
      textStyle: {
        fontSize: '14',
        fontWeight: 'normal',
        color: '#ffffff'
      },
      grid: {
        left: '0%',
        right: '5%',
        top: '12%',
        bottom: '2%',
        containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          // formatter: '时间：{b}<br />周转率： {c}次',
          axisPointer: {
            lineStyle: {
                color: '#999999',
                type:'dashed'
            }
        }
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        data: array1,
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
            textStyle: {
                color: '#999999',
                fontSize:'15'
            },
        }, 
        splitLine: {
          show: false,
        },
      },
      series: [{
        name:'上周',
        type:'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: 'rgb(99, 222, 241)',
              type:'dashed'
            }
          }
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(99, 222, 241, 1.0)',
              }, {
                offset: 1,
                color: 'rgba(99, 222, 241, 0.2)',
              }],
              globalCoord: false
            },
          }
        },
        data:array3
    }]
    };
    myChart.setOption(option,true);
  }

  function reqberthmes(data) {
    homeService.reqBlockBerthMes(data).then(resp => {
      $scope.emptyBerth = resp.data.emptyBerthNumber;
      $scope.totalBerth = resp.data.totalBerthNumber;
    });
  }
  // 泊位变化
  $scope.berthChange = index => {
    $scope.berthchange = index;
    let data = {};
    data.index = index;
    data.parklotCode = $scope.formData.parklotCodeChange;
    reqberthchange(data);
    reqberthmes(data);
  }
  $scope.$watch('formData.parklotCodeChange', function (newValue, oldValue) {
    let data = {};
    data.index = $scope.berthchange;
    data.parklotCode = $scope.formData.parklotCodeChange;
    reqberthchange(data);
    reqberthmes(data);
  }, true);
  function reqberthchange(data) {
    homeService.reqBerthChange(data).then(resp => {
      let xArr = [],parkingArr = [],emptyArr = [],totalNum;
      if(resp.data.length > 0) {
        xArr = resp.data.map(item => {
            return item.listNo;
        });
        parkingArr = resp.data.map(item => {
          return item.parkingNum;
        });
        emptyArr = resp.data.map(item => {
          totalNum = item.totalNum;
          return item.emptyNum;
        });
      }else {
        if($scope.berthchange == 1) {
          xArr = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'];
          return xArr;
        }else if($scope.berthchange ==2) {
          let nowTime = new Date();
          let days = nowTime.getDate();
          for(let i = 1;i <= days;i++) {
            xArr.push(i+"日");
          }
          return xArr;
        }
      }
      berthChangeTimes(xArr,parkingArr,emptyArr,totalNum);
    })
  }
  $scope.berthChange(1);
  
  function berthChangeTimes(array1,array2,array3,n) {
    $('#chartBerthChange').highcharts({
      chart: {
          type: 'column',
          marginRight:0
      },
      title: {
          text: '各停车场泊位变化',
          align:'left'
      },
      credits:{
        enabled:false
      },
      legend: {
        align:'left',
        verticalAlign: 'top', //垂直方向位置
        x: 0, //距离x轴的距离
        y: 20 //距离Y轴的距离
      },
      xAxis: {
          categories: array1,
      },
      yAxis: {
          min: 0,
          max:n,
          ceiling:n,
          tickPixelInterval:10,
          title:{
            enabled:false
          }
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              maxPointWidth:30
          }
      },
      series: [{
          name: '占用',
          color:'#448aca',
          data: array2
      }, {
          name: '空闲',
          color:'#9eca4c',
          data: array3
      }]
    });
  }

  // 车流量变化
  $scope.passCarNum = index => {
    $scope.passnum = index;
    let data = {};
    data.index = index;
    data.parklotCode = $scope.formData.parklotCodePassNum;
    reqpasscarnum(data);
  }
  $scope.$watch('formData.parklotCodePassNum', function (newValue, oldValue) {
    let data = {};
    data.index = $scope.passnum;
    data.parklotCode = $scope.formData.parklotCodePassNum;
    reqpasscarnum(data);
  }, true);
  function reqpasscarnum(data) {
    homeService.reqPassNum(data).then(resp => {
      let xArr = [],parkingInArr = [],parkingOutArr = [];
      $scope.totalInNum = resp.data.totalInNum;
      $scope.totalOutNum = resp.data.totalOutNum;
      if(resp.data.detailList.length > 0) {
        xArr = resp.data.detailList.map(item => {
          if($scope.passnum == 2){
            return item.listNo+"日";
          }else if($scope.passnum == 1) {
            return item.listNo;
          }
        });
        parkingInArr = resp.data.detailList.map(item => {
          return item.parkingInNum;
        });
        parkingOutArr = resp.data.detailList.map(item => {
          return item.parkingOutNum * (-1);
        });
      }else {
        if($scope.passnum == 1) {
          xArr = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'];
          return xArr;
        }else if($scope.passnum ==2) {
          let nowTime = new Date();
          let days = nowTime.getDate();
          for(let i = 1;i <= days;i++) {
            xArr.push(i+"日");
          }
          return xArr;
        }
      }
      flowChange(xArr,parkingInArr,parkingOutArr);
    })
  }
  $scope.passCarNum(1);

  function flowChange(array1,array2,array3) {
    $('#chartFlowChange').highcharts({
          chart: {
              type: 'bar'
          },
          credits:{
            enabled:false
          },
          legend: {
            align:'left',
            verticalAlign: 'top', //垂直方向位置
            x: 0, //距离x轴的距离
            y: 20 //距离Y轴的距离
          },
          title: {
              text: '各停车场车流量变化',
              align:'left'
          },
          xAxis: [{
              categories: array1,
              reversed: false,
              labels: {
                  step: 1
              }
          }],
          yAxis: {
              title: {
                  text: null
              },
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              },
          },
          plotOptions: {
              series: {
                  stacking: 'normal',
                  maxPointWidth:30
              }
          },
          tooltip: {
              formatter: function () {
                  return '<b>车辆数: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
              }
          },
          series: [{
              name: '驶出',
              color:'#f9a304',
              data: array3
          }, {
              name: '驶入',
              color:'#6fbfd6',
              data: array2
          }]
      });
  }

  $("[data-toggle='tooltip']").tooltip({
      html: true,
      //delay: { show: 500, hide: 1003333333 }
  });
    
});