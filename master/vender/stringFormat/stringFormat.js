'use strict';

/**=========================================================
 * 表单中每行最多显示的字符串个数多出的用省略号表示
 * 默认为60的字符
 * 例子：
 *  new String("abcdefg").ellipsis(5) ==> abcde...
 * "abcdefg".ellipsis(5) ==> abcde...
 =========================================================*/

(function () {
    String.prototype.ellipsis = function (length) {
        var returnStrLength = length;
        if (typeof(returnStrLength) == "undefined") {
            returnStrLength = 60;
        }
        if (this.length > returnStrLength) {
            return this.substring(0, returnStrLength) + "...";
        }
        return this.substring(0, returnStrLength);
    }

    /** yyyy-MM-dd HH:mm格式时调用 **/
    String.prototype.parseDate = function () {
        //var  endLogTime = "2012-05-22 17:10:46"
        //var startLogTime = "2012-05-22 17:10:46"
        //var endLogTimeDate = new Date(Date.parse(endLogTime.replace(/-/g, "/")));
        //var  startLogTimeDate = new Date(Date.parse(startLogTime.replace(/-/g, "/")));
        //endLogTimeDate .getYear();        //获取当前年份(2位)
        //endLogTimeDate .getFullYear();    //获取完整的年份(4位,1970-????)
        //endLogTimeDate .getMonth();       //获取当前月份(0-11,0代表1月)
        //endLogTimeDate .getDate();        //获取当前日(1-31)
        //endLogTimeDate .getDay();         //获取当前星期X(0-6,0代表星期天)
        //endLogTimeDate .getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
        //endLogTimeDate .getHours();       //获取当前小时数(0-23)
        //endLogTimeDate .getMinutes();     //获取当前分钟数(0-59)
        //endLogTimeDate .getSeconds();     //获取当前秒数(0-59)
        //endLogTimeDate .getMilliseconds();    //获取当前毫秒数(0-999)
        //endLogTimeDate .toLocaleDateString();     //获取当前日期
        //var mytime=endLogTimeDate .toLocaleTimeString();     //获取当前时间
        //endLogTimeDate .toLocaleString( );        //获取日期与时间
        //return new Date(Date.parse(this.replace(/-/g, "/")));
    }

    /** HH:mm格式时调用 **/
    String.prototype.parseHour = function () {
        var day = new Date().format("yyyy-MM-dd");
        var date = day + " " + this;
        return new Date(Date.parse(date.replace(/-/g, "/")));
    }
})();