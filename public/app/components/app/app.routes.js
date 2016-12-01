app
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						// controller: 'dashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					// 'subheader@main': {
					// 	templateUrl: '/app/shared/templates/subheaders/dashboard-subheader.template.html',
					// },
					'content@main':{
						// templateUrl: '/app/shared/templates/content/dashboard-content.template.html',
					}
				}
			})
			.state('main.hris', {
				url: 'hris',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/2')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'hrisContentContainerController',
					},
					'toolbar@main.hris': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'hrisToolbarController',
					},
					'left-sidenav@main.hris': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.hris': {
						templateUrl: '/app/components/hris/templates/subheaders/hris-subheader.template.html',
						controller: 'hrisSubheaderController',
					},
					'content@main.hris':{
						templateUrl: '/app/components/hris/templates/content/hris-content.template.html',
					}
				}
			})
			.state('main.manage-employee', {
				url: 'employee/{employeeID}',
				params: {'employeeID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/2')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'manageEmployeeContentContainerController',
					},
					'toolbar@main.manage-employee': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'manageEmployeeToolbarController',
					},
					'left-sidenav@main.manage-employee': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.manage-employee':{
						templateUrl: '/app/components/hris/templates/content/manage-employee-content.template.html',
					}
				}
			})
			.state('main.admin-settings', {
				url: 'settings/admin',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'adminSettingsContentContainerController',
					},
					'toolbar@main.admin-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'adminSettingsToolbarController',
					},
					'left-sidenav@main.admin-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.admin-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/admin-settings-subheader.template.html',
						controller: 'adminSettingsSubheaderController',
					},
					'content@main.admin-settings':{
						templateUrl: '/app/components/settings/templates/content/admin-settings-content.template.html',
					}
				}
			})
			.state('main.hris-settings', {
				url: 'settings/hris',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'hrisSettingsContentContainerController',
					},
					'toolbar@main.hris-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'hrisSettingsToolbarController',
					},
					'left-sidenav@main.hris-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.hris-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/hris-settings-subheader.template.html',
						controller: 'hrisSettingsSubheaderController',
					},
					'content@main.hris-settings':{
						templateUrl: '/app/components/settings/templates/content/hris-settings-content.template.html',
					}
				}
			})
			// .state('main.timekeeping-settings', {
			// 	url: 'settings/timekeeping',
			// 	resolve:{
			// 		authorization: ['Helper', '$state', function(Helper, $state){
			// 			Helper.get('/module/4')
			// 				.success(function(data){
			// 					return;
			// 				})
			// 				.error(function(){
			// 					return $state.go('page-not-found');
			// 				});
			// 		}],
			// 	},
			// 	views: {
			// 		'content-container': {
			// 			templateUrl: '/app/shared/views/content-container.view.html',
			// 			controller: 'timekeepingSettingsContentContainerController',
			// 		},
			// 		'toolbar@main.timekeeping-settings': {
			// 			templateUrl: '/app/shared/templates/toolbar.template.html',
			// 			controller: 'timekeepingSettingsToolbarController',
			// 		},
			// 		'left-sidenav@main.timekeeping-settings': {
			// 			templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
			// 		},
			// 		'subheader@main.timekeeping-settings': {
			// 			templateUrl: '/app/components/settings/templates/subheaders/timekeeping-settings-subheader.template.html',
			// 			controller: 'timekeepingSettingsSubheaderController',
			// 		},
			// 		'content@main.timekeeping-settings':{
			// 			templateUrl: '/app/components/settings/templates/content/timekeeping-settings-content.template.html',
			// 		}
			// 	}
			// })
			.state('main.profile-settings', {
				url: 'settings/profile',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'profileSettingsContentContainerController',
					},
					'toolbar@main.profile-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.profile-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.profile-settings':{
						templateUrl: '/app/shared/templates/content/profile-settings-content.template.html',
					}
				}
			})
	}]);