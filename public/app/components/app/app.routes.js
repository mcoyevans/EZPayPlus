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