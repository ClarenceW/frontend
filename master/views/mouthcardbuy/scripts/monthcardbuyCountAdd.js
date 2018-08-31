'use strict';
angular.module('parkingApp').controller('monthcardbuyCountAdd',
    function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName, sessionCache, $sessionStorage, Upload, $timeout, mouthcardBuyService, customerService, excelService) {

        $scope.formData = {};
        $scope.formData.file = null;
        $scope.stateGoIndex = StateName.mouthcardbuy.index;

        $scope.formData.file = "";


        //文件上传
        $scope.uploadFiles = function (file, errFiles) {
            try {
                //获取文件格式：后缀
                var preff = file.name.slice(file.name.lastIndexOf("."));
                // console.log(preff);
                if (preff != '.xls' && preff != '.xlsx') {
                    customerService.exlImportTips('导入提示', '请选择xls或者xlsx格式文件');
                    return;
                }
                $scope.file = file;
                if (file) {
                    $scope.excelNameDisplay = true;
                }
            } catch (e) {
            }
        };
        $scope.submitExcel = function () {
            Exl_to_Json($scope.file, 13);
        };

        /**
         * 将表格内容转成json格式
         * obj:表格文件
         * range: 导入起始行
         * */
        function Exl_to_Json(obj, range) { //导入
            var wb = null;//读取完成的数据
            var rABS = false; //是否将文件读取为二进制字符串
            if (obj.files) {
                return;
            }
            var file = obj;
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                // console.log(data);
                if (rABS) {
                    wb = XLSX.read(btoa(excelService.fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                if (wb.SheetNames[0] != '批量购买月卡') {
                    customerService.exlImportTips('导入提示', '导入表格名称有误,请确认表格是否正确！');
                    return;
                }
                var excelData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],
                    {
                        header: ['phoneNum','plate', 'plateColor', 'userName','cardCode','vehicleOwn','validTime'],
                        range: range,
                        raw: false,
                        defval: null
                    });
                if (excelData) {
                  let excelArr = [];
                  for(let i = 0;i < excelData.length;i++) {
                    if(excelData[i].phoneNum && excelData[i].plate) {
                      let option = {};
                      option.phoneNum = excelData[i].phoneNum;
                      option.plate = excelData[i].plate;
                      option.plateColor = excelData[i].plateColor;
                      option.userName = excelData[i].userName;
                      option.cardCode = excelData[i].cardCode;
                      option.vehicleOwn = excelData[i].vehicleOwn;
                      option.validTime = excelData[i].validTime;
                      excelArr.push(option);
                    }
                  }
                  let data = {};
                  data.excelReqList = excelArr;
                  mouthcardBuyService.reqCountAdd(data).then(function (msg) {
                        if (msg.code === Setting.ResultCode.CODE_SUCCESS) {
                            growl.addSuccessMessage(excelArr.length + '条月卡成功', {ttl: 2000});
                            $state.go($scope.stateGoIndex);
                        } else {
                            growl.addErrorMessage(excelArr.length + '条月卡失败，' + msg.msg, {ttl: 2000});
                            var failData = [];
                            failData = msg.data.failData.map(function (item) {
                                return {
                                    '车主手机号': item.phoneNum,
                                    '车牌': item.plate,
                                    '车牌颜色编号': item.plateColor,
                                    '车主姓名': item.userName,
                                    '月卡编号': item.cardCode,
                                    '车辆归属': item.vehicleOwn,
                                    '生效日期': item.validTime
                                }
                            });
                            setTimeout(function () {
                                downloadExl(failData);
                            }, 1000);
                        }

                    }, function (msg) {
                        growl.addErrorMessage(msg, {ttl: 2000});
                    });
                }
            };
            if (rABS) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsBinaryString(file);
            }
        };

        /**
         * 导出excel表格
         * data: 导出表格数据，json数组
         * */
        const wopts = {bookType: 'xlsx', bookSST: true, type: 'binary'};//这里的数据是用来定义导出的格式类型
        function downloadExl(data, type) {
            const wb = {SheetNames: ['批量购买月卡'], Sheets: {}, Props: {}};
            //通过json_to_sheet转成单页(Sheet)数据
            wb.Sheets[wb.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {});
            excelService.saveAs(new Blob([excelService.s2ab(XLSX.write(wb, wopts))],
                {type: "application/octet-stream"}),
                "批量购买月卡内容" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType),
                {bookSST: true}
            );
        }
    });
