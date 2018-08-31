#dclot-frontend
#动态获取  菜单路径（如：系统管理  > 安全管理 > 角色管理)配置(参考角色管理列表)：
#控制器xxxListCtrl 调用  customerService.initTitle();
#html显示   

#		<li ng-if='titles.firstTitle'><i class="fa fa-home"></i>
#            		<a href="javascript:;">{{titles.firstTitle}}</a>
#            		<i class="fa fa-angle-right"></i>
#            </li>
#            <li ng-if='titles.secTitle'>
#            	<a href="javascript:;">{{titles.secTitle}}</a>
#            	<i class="fa fa-angle-right"></i>
#            </li>
#           <li ng-if='titles.thirdTitle'><a href="javascript:;">{{titles.thirdTitle}}</a></li>
