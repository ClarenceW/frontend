'use strict';

angular.module('parkingApp').controller('roleAddController', function ($timeout, $rootScope, $scope, $http, $state, growl, Setting, $log, roleService, StateName) {

    var treeId = "#permission_tree";
    $scope.formData = {};
    $scope.alertDanger;
    $scope.stateGoIndex = StateName.role.index;

    $scope.alertClose = function () {
        $scope.alertDanger = false;
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            var menucodes = getCheckedNodeIds();
            if (menucodes) {
                menucodes = menucodes.join(",");
            }
            if (!menucodes) {
                growl.addErrorMessage("请勾选权限！");
                return;
            }
            $scope.formData.menuCodes = menucodes;
            roleService.addRole($scope.formData).then(function (msg) {
                growl.addInfoMessage("角色新增成功！", {ttl: 2000});
                $state.go($scope.stateGoIndex);
            }, function (msg) {
                growl.addErrorMessage(msg, {ttl: 2000});
        });
        } else {
            $scope.alertDanger = true;
        }
    };

    $timeout(function () {
        roleService.getSysMenu().then(function (resp) {
            initTree(resp['data']);
        }, function (msg) {
            growl.addErrorMessage(msg, {ttl: 2000});
        });
    }, 0);

    function initTree(nodeList){
      var permissionArray = new Array();
      if (typeof nodeList) {
          $(nodeList).each(function (i) {
            var code = nodeList[i].menuCode;
            var selected = false;
//          	var codes = menuCodes.split(",");
              var node = {
                  id: code,
                  text: nodeList[i].menuName,
                  parent: nodeList[i].parentCode,
                  state: {
                      opened: selected,
                      selected: selected
                  },
                  children: []
              }
              
              //var contains = $.inArray(code, codes);
//              if (codes.includes(code)) {
//                  if (!nodeList[i].children) {
//                      node.state.selected = true;
//                  }
//              }
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
          "plugins": ["types", "checkbox"]
      });
  }

    function getCheckedNodeIds() {
        var funcTree = $(treeId).jstree();
        var funcSlt = funcTree.get_selected(true);
        var checkedIds = [];
        if (funcSlt != null && funcSlt.length > 0) {
            for (var i = 0; i < funcSlt.length; i++) {
                var parentsIds = funcSlt[i].parents;
                if (parentsIds) {
                    parentsIds.forEach(function (item) {
                        if (typeof item === "string" && item !== "#" && checkedIds.indexOf(item) < 0) {
                            checkedIds.push(item);
                        }
                    });
                }
                checkedIds.push(funcSlt[i].id);
            }
        }
        return checkedIds;
    }

});