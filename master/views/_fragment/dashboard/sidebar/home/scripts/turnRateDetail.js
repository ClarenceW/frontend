'use strict';
angular.module('parkingApp').controller('HomeTurnRateCtrl', ['$scope', '$state', 'StateName', 'sessionCache', 'Setting', 'homeService', '$compile', 'customerService','$filter','parklotsService','$timeout','growl',
  function ($scope, $state, StateName, sessionCache, Setting, homeService, $compile, customerService,$filter,parklotsService,$timeout,growl) {
		var tableId = "#turnRate-table";
		var checkboxesCls = tableId + " .checkboxes";
		var oTable = null;
		var nRow = null;
    var aData = null;
    $scope.formData = {};
    $scope.stateGoHome = StateName.home;
    $scope.haslot = false;
    $scope.berthturnrate = 1;
    //获取停车场列表
    function parklotList() {
      parklotsService.reqList().then(resp => {
        $scope.parklotOption = resp;
      })
    }
    parklotList();
    $timeout(function() {
      $('.selectpicker').selectpicker({
        'selectedText': '',
        'maxOptions':3
      });
    },200);
    // 泊位利用率
    $scope.berthTurnRate = index => {
      $scope.berthturnrate = index;
      let data = {};
      data.index = index;
      data.parklotCodeList = $scope.formData.parklotCodes;
      reqberthturnrate(data);
      detailTable(data);
    }
    $scope.$watch('formData.parklotCodes', function (newValue, oldValue) {
      if(newValue && newValue.length > 3) {
        growl.addInfoMessage("最多只能选择三个停车场", { ttl: 2000 });
        return ;
      }
      let data = {};
      data.index = $scope.berthturnrate;
      data.parklotCodeList = $scope.formData.parklotCodes;
      reqberthturnrate(data);
      detailTable(data);
    }, true);
    function reqberthturnrate(data) {
      let arrs = false;
      homeService.reqBerthTurnRate(data).then(resp => {
        $scope.turnrate = $filter("number")(resp.data[0].curWeekRatio, 1) + "次";
        let xArr = [], yArr = [],lastyArr = [],lotArr1 = [],lotArrLast1 = [],lotArr2 = [],lotArrLast2 = [],lotArr3 = [],lotArrLast3 = [];
        if (resp.data.length > 0) {
          if (resp.data.length > 1) {
            $scope.haslot = true;
          }else {
            $scope.haslot = false;
          }
          xArr = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
          let lotObj1 = {},lotObj2 = {},lotObj3 = {};
          if(resp.data[0]) {
            if(resp.data[0].parklotName == null) {
              lotObj1.parklotName = '全部停车场';
            }else {
              lotObj1.parklotName = resp.data[0].parklotName;
            }
            lotObj1.lotArr = resp.data[0].curRatioList;
            if(resp.data[0].curRatioList[0] != null) {
              arrs = true;
            }
            lotObj1.lotArrLast = resp.data[0].lastRatioList;
          }
          if(resp.data[1]) {
            lotObj2.parklotName = resp.data[1].parklotName;
            lotObj2.lotArr = resp.data[1].curRatioList;
            lotObj2.lotArrLast = resp.data[1].lastRatioList;
          }
          if(resp.data[2]) {
            lotObj3.parklotName = resp.data[2].parklotName;
            lotObj3.lotArr = resp.data[2].curRatioList;
            lotObj3.lotArrLast = resp.data[2].lastRatioList;
          }
          if(arrs) {
            showChartBerthRate(xArr, lotObj1, lotObj2, lotObj3);
          }else {
            showChartBerthRate2(xArr, lotObj1, lotObj2, lotObj3);
          }
        }
      })
    }
    $scope.berthTurnRate(1);

    function detailTable(data) {
      homeService.reqBerthTurnDetail(data).then(resp => {
        if(resp.data && resp.data.length > 0) {
          $(`table tbody tr`).remove();
          var newDom,newDom1;
          for(let i = 0;i < resp.data.length;i++) {
            newDom = $(`<tr></tr>`).append($(`<td></td>`).html(resp.data[i].parklotName).attr('rowspan',2));
            newDom1 = $(`<tr></tr>`);
            for(let j = 0;j < resp.data[i].curRatioList.length;j++) {
              $(newDom).append($(`<td></td>`).html(resp.data[i].curRatioList[j]));
            }
            for(let j = 0;j < resp.data[i].lastRatioList.length;j++) {
              $(newDom1).append($(`<td></td>`).html(resp.data[i].lastRatioList[j]));
            }
            $(`table tbody`).append($(newDom));
            $(`table tbody`).append($(newDom1));
          }
        }
      })
    }

    function showChartBerthRate(array1, obj1,obj2,obj3) {
      let dom = document.getElementById('berthturnrateDetail');
      let myChart = echarts.init(dom);
      let option = {
        title: {
          show: true,
          text: '各停车场泊位周转率',
          x: 'left',
          y: 'top'
        },
        textStyle: {
          fontSize: '14',
          fontWeight: 'normal',
          color: '#ffffff'
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '12%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#999999',
              type: 'dashed'
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
              fontSize: '15'
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
              fontSize: '15'
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [{
          name:obj1.parklotName + ' 本周',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: 'rgb(99, 222, 241)',
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
          data: obj1.lotArr
        },{
          name:obj1.parklotName + ' 上周',
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
          data:obj1.lotArrLast
        },
        {
          name:obj2.parklotName + ' 本周',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: 'rgb(123, 25, 241)',
              lineStyle: {
                color: 'rgb(123, 25, 241)'
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
                  color: 'rgba(123, 25, 241, 1.0)',
                }, {
                  offset: 1,
                  color: 'rgba(123, 25, 241, 0.2)',
                }],
                globalCoord: false
              },
            }
          },
          data: obj2.lotArr
        },{
          name:obj2.parklotName + ' 上周',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgb(123, 25, 241)',
                type:'dashed'
              }
            }
          },
          data:obj2.lotArrLast
        },
        {
          name:obj3.parklotName + ' 本周',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: 'rgb(25, 231, 153)',
              lineStyle: {
                color: 'rgb(25, 231, 153)'
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
                  color: 'rgba(25, 231, 153, 1.0)',
                }, {
                  offset: 1,
                  color: 'rgba(25, 231, 153, 0.2)',
                }],
                globalCoord: false
              },
            }
          },
          data: obj3.lotArr
        },{
          name:obj3.parklotName + ' 上周',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgb(25, 231, 153)',
                type:'dashed'
              }
            }
          },
          data:obj3.lotArrLast
        }
      ]
      };
      myChart.setOption(option, true);
    }

    function showChartBerthRate2(array1, obj1,obj2,obj3) {
      let dom = document.getElementById('berthturnrateDetail');
      let myChart = echarts.init(dom);
      let option = {
        title: {
          show: true,
          text: '各停车场泊位周转率',
          x: 'left',
          y: 'top'
        },
        textStyle: {
          fontSize: '14',
          fontWeight: 'normal',
          color: '#ffffff'
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '12%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#999999',
              type: 'dashed'
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
              fontSize: '15'
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
              fontSize: '15'
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [{
          name:obj1.parklotName + ' 上周',
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
          data:obj1.lotArrLast
        },{
          name:obj2.parklotName + ' 上周',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgb(123, 25, 241)',
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
                  color: 'rgba(123, 25, 241, 1.0)',
                }, {
                  offset: 1,
                  color: 'rgba(123, 25, 241, 0.2)',
                }],
                globalCoord: false
              },
            }
          },
          data:obj2.lotArrLast
        },{
          name:obj3.parklotName + ' 上周',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: 'rgb(25, 231, 153)',
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
                  color: 'rgba(25, 231, 153, 1.0)',
                }, {
                  offset: 1,
                  color: 'rgba(25, 231, 153, 0.2)',
                }],
                globalCoord: false
              },
            }
          },
          data:obj3.lotArrLast
        }
      ]
      };
      myChart.setOption(option, true);
    }

    $scope.back = function () {
      $state.go($scope.stateGoHome);
    };

    $("[data-toggle='tooltip']").tooltip({
        html: true,
    });

  }
]);