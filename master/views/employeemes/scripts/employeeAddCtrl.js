'use strict';
angular.module('parkingApp').controller('PdaUserAddCtrl', [
	'$rootScope', '$scope', '$http', '$state', 'growl', 'Setting', '$log', 'StateName','pdauserService','sessionCache','postService','deptService',
		function ($rootScope, $scope, $http, $state, growl, Setting, $log, StateName,pdauserService,sessionCache,postService,deptService) {
	
	    $scope.formData = {};
	    $scope.tempData = {};
	    $scope.alertDanger;
	    $scope.stateGoIndex = StateName.pdauser.index;
	    $scope.groupsOptions = [];
	    $scope.formData.roleType = 1;
	    
	    $scope.alertClose = function () {
	        $scope.alertDanger = false;
	    };
	
	    $scope.sexTypes = sessionCache.getDictArrayByLookname('USER_SEX');
	    
	    $scope.positionsOptions = [];
	    postService.getPostList().then( res => {
	    	$scope.positionsOptions = res;
	    })
	    
	    $scope.submitForm = function (isValid) {
	        if (isValid) {
	            pdauserService.addPdauser($scope.formData).then( res => {
	                if(res && res.code === Setting.ResultCode.CODE_SUCCESS)
	                    growl.addInfoMessage("员工新增成功！", {ttl: 2000});
	                else
	                    growl.addInfoMessage("员工新增失败！", {ttl: 2000});
	                $state.go($scope.stateGoIndex);
	            }, msg => {
	                growl.addErrorMessage(msg, {ttl: 2000});
	            });
	        } else {
	            $scope.alertDanger = true;
	        }
	    };
	    
	    
	    var treeId = "#dept_tree";
		
	    deptService.reqDeptTree().then(function(res){
	    	initTree(res.data);
	    });
	    
	    $scope.pdaUserOptions = [];
	    
		function initTree(nodeList) {
	    	$("#munu_tree_container").empty();
	    	$("#munu_tree_container").append($("<div>").addClass("scroller").attr("data-height","500px").append($("<div>").attr("id","permission_tree").addClass("tree-demo")))
	        var permissionArray = new Array();
	        if (typeof nodeList) {
	            $(nodeList).each(function (i) {
	                var node = {
	                    id: nodeList[i].deptcode,
	                    text: nodeList[i].deptname,
	                    parent: nodeList[i].parentcode,
	                    state: {
	                        opened: true,
	                        selected: false
	                    },
	                    children: []
	                }
	                permissionArray.push(node);
	            })
	        }
	        $(treeId).jstree({
	            "core": {
	                "themes": {
	                    "responsive": false
	                },
	                'data': permissionArray,
	                'check_callback': function (operation, node, node_parent, node_position, more) {
	                    return true;
	                }
	            },
	            "types": {
	                "default": {
	                    "icon": "fa fa-folder icon-state-warning icon-lg"
	                },
	                "file": {
	                    "icon": "fa fa-file icon-state-warning icon-lg"
	                }
	            },
	            "plugins": ["types"]
	        });
	    }
		
	    $scope.selDept = function(){
			var treeObj = $(treeId).jstree();
			var nodes = treeObj.get_selected(true);
			if(nodes && nodes.length > 0){
				var node = nodes[0];
				var deptcode = node.id;
				var depename = node.text;
				$scope.tempData.depename = depename;
				$scope.formData.deptcode = deptcode;
				$("#cancelModelBtn").trigger("click");
			}else{
				$("#modal-footer").children("div").remove();
				$("<div>").addClass("error pull-left").append($("<i>").addClass("glyphicon glyphicon-remove-sign error")).append("  请选择部门!")
				.appendTo("#modal-footer")
			    $timeout(function(){
					$("#modal-footer").children("div").remove();
				},2000);
			}
		}
}]);