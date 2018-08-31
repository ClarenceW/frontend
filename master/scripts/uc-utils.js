var UcUtils = function() {
	return {
		getTableDefaultOptions : function() {
			return {
				"autoWidth" : false, // 不自动计算列宽
				"lengthMenu" : [ [ 10, 30, 50 ], [ 10, 30, 50 ] // change per page values here
				],
				// set the initial value
				"processing" : false, // 加载数据时显示正在加载数据
				"searching" : false, // 不使用过滤
				"ordering" : false, // 排序
        "pageLength" : 10,
        // "stateSave" : true,
				"serverSide" : true, // 从服务端加载数据
				"dom" : "<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-6 col-sm-12'li><'col-md-6 col-sm-12'p>>",
				"pagingType" : "bootstrap_full_number",
				"language" : {
					"lengthMenu" : "_MENU_ 条/页",
					"paginate" : {
						"first" : "<<",
						"previous" : "<",
						"next" : ">",
						"last" : ">>"
					},
					"info" : "&nbsp;&nbsp;共_TOTAL_条记录",
					"processing" : "正在加载数据...",
					"infoEmpty" : "",
					"emptyTable" : "没有数据",
					"zeroRecords" : "空匹配"
				},
				"classes" : {
					"sInfo" : "uc_dataTables_info",
				}
			};
		}
	};
}();

(function($) {
	$.getWebRootPath = function() {
		var webroot = document.location.href;
		webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
		webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
		webroot = webroot.substring(0, webroot.indexOf('/'));
		var rootpath = null;
		if (webroot == "") {
			rootpath = "";
		} else {
			rootpath = "/" + webroot;
		}
		return rootpath;
	};
})(jQuery);

