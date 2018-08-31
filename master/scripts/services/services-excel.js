'use strict';
(function () {
    /**
     *   表格导出
     */
    appService.factory("excelService", function ($rootScope, $http, $state, $timeout) {


        //如果使用 FileSaver.js 就不要同时使用以下函数
        function saveAs(obj, fileName) {        //当然可以自定义简单的下载文件实现方式
            var tmpa = document.createElement("a");
            tmpa.download = fileName || "下载";
            tmpa.href = URL.createObjectURL(obj);   //绑定a标签
            tmpa.click();                       //模拟点击实现下载
            setTimeout(function () {            //延时释放
                URL.revokeObjectURL(obj);       //用URL.revokeObjectURL()来释放这个object URL
            }, 100);
        };

        function s2ab(s) {
            if (typeof ArrayBuffer !== 'undefined') {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            } else {
                var buf = new Array(s.length);
                for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
        }

        //文件流转BinaryString
        function fixdata(data) {
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l)
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        };

        /**
         * 导出excel表格
         * data: 导出表格数据，json数组
         * name: 表格名
         * */
            //这里的数据是用来定义导出的格式类型
        const wopts = {bookType: 'xlsx', bookSST: true, type: 'binary'};
        var exportExcel = function (data, name) {
            let exportStatus = true;
            const wb = {SheetNames: [name], Sheets: {}, Props: {}};
            //通过json_to_sheet转成单页(Sheet)数据
            wb.Sheets[wb.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {});
            saveAs(new Blob([s2ab(XLSX.write(wb, wopts))],
                {type: "application/octet-stream"}),
                name + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType),
                {bookSST: true}
            );
            return exportStatus;
        };


        function excelCompute(totalCount) {
            let baseNumber = 5000; // 每次导出数据条数
            let excelNumber = 0; //导出表格个数
            let lastExcelNumber = null; // 最后一张表格数据条数
            let excelOptions = [];  //用于存放所有表格数
            let slittingShow = false;  //超过导出上限显示
            let loadStep = [];  //导出状态数组

            let total = totalCount;
            // 数据小于导出上限
            if (total <= baseNumber) {
                lastExcelNumber = total;
                excelOptions[excelNumber] = {
                    "start": 1 + baseNumber * (excelNumber),
                    "end": baseNumber * (excelNumber) + lastExcelNumber
                };
                slittingShow = false;
            } else {
                //数据大于上限，分条导出
                excelNumber = Math.floor(total / baseNumber);
                lastExcelNumber = total % baseNumber;
                for (let i = 0; i < excelNumber; i++) {
                    excelOptions[i] = {
                        "start": 1 + baseNumber * i,
                        "end": baseNumber * (i + 1)
                    }
                }
                excelOptions[excelNumber] = {
                    "start": 1 + baseNumber * excelNumber,
                    "end": baseNumber * excelNumber + lastExcelNumber
                };
                slittingShow = true;
            }
            for (let i = 0; i < excelOptions.length; i++) {
                loadStep.push(1);
            }
            let resp = {
                "baseNumber": baseNumber,
                "excelNumber": excelNumber,
                "lastExcelNumber": lastExcelNumber,
                "excelOptions": excelOptions,
                "slittingShow": slittingShow,
                "loadStep": loadStep,
            };
            return resp;
        }

        return {
            exportExcel: function (data, name) {
                return exportExcel(data, name);
            },
            excelCompute: function (totalCount) {
                return excelCompute(totalCount);
            },
            saveAs: function (obj, fileName) {
                return saveAs(obj, fileName)
            },
            s2ab: function (obj, fileName) {
                return s2ab(obj, fileName)
            },
            fixdata: function (obj, fileName) {
                return fixdata(obj, fileName)
            },
        }

    });
})();