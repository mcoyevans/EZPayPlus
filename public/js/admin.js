var adminModule = angular.module('admin', ['sharedModule']);
adminModule
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
			.state('main.profile-settings', {
				url: 'profile-settings',
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
						templateUrl: '/app/components/admin/templates/content/profile-settings-content.template.html',
					}
				}
			})
	}]);
adminModule
	.controller('mainViewController', ['$scope', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', function($scope, $state, $mdDialog, $mdSidenav, $mdToast, Helper){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-view-dashboard',
				'label': 'Dashboard',
			},
			{
				'state': 'main.hris',
				'icon': 'mdi-account-multiple',
				'label': 'HRIS',
			},
			{
				'state': 'main.payroll',
				'icon': 'mdi-currency-usd',
				'label': 'Payroll',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
			},
		];

		$scope.menu.section = [
			{
				'name':'Settings',
				'icon':'mdi-settings',
			},
		];

		$scope.menu.pages = [
			[
				{
					'label': 'Profile',
					action: function(){
						$state.go('main.profile-settings');
					}, 
				},
				{
					'label': 'HRIS',
					action: function(){
						$state.go('main.hris-settings');
					},
				},
				{
					'label': 'Time Keeping',
					action: function(){
						$state.go('main.time-keeping-settings');
					},
				},
				{
					'label': 'Payroll',
					action: function(){
						$state.go('main.payroll-settings');
					},
				},
			]
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
		
		$scope.logout = function(){
			Helper.post('/user/logout')
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	Helper.notify('Password changed.')
		    });
		}

		Helper.post('/user/check')
			.success(function(data){
				$scope.user = data;
			})

		$scope.$on('fetchAuthenticatedUser', function(){
			console.log($scope.user);
		});
	}]);
adminModule
	.controller('profileSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Profile';

		$scope.toolbar.hideSearchIcon = true;

		$scope.fab = {}

		$scope.fab.icon = 'mdi-pencil';
		$scope.fab.label = 'Edit';

		$scope.fab.dialog = {};
		
		$scope.fab.dialog.controller = 'editProfileDialogController';
		$scope.fab.dialog.template = '/app/components/admin/templates/dialogs/edit-profile-dialog.template.html';

		$scope.fab.action = function(){
			Helper.customDialog($scope.fab.dialog)
				.then(function(){
					$scope.init();
				}, function(){
					return;
				});
		}

		$scope.fab.show = true;

		$scope.init = function()
		{
			var query = {};
			query.with = ['city', 'province', 'country'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					$scope.company = data;
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.init();
	}]);
adminModule
	.controller('editProfileDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		$scope.company = {};
		$scope.company.country_id = 177; //Philippines

		$scope.city = {};
		$scope.city.items = [];

		$scope.province = {};

		$scope.busy = false;

		var busy = false;

		$scope.city.getItems = function(query){
			var request = {
				'search' : query,
			}

			Helper.post('/city/enlist', request)
				.success(function(data){
					return data;
				});
		}

		$scope.province.getItems = function(query){
			var provinces = query ? $filter('filter')($scope.provinces, query) : $scope.cities;
			return provinces;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.submit = function(){
			if($scope.companyForm.$invalid){
				angular.forEach($scope.companyForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			
			$scope.busy = true;
			Helper.put('/company/1', $scope.company)
				.success(function(duplicate){
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.init = function(){
			// Helper.get('city')
			// 	.success(function(data){
			// 		angular.forEach(data, function(item){
			// 			var toolbarItem = {};

			// 			toolbarItem.id = item.id;
			// 			toolbarItem.display = item.name;

			// 			$scope.city.items.push(toolbarItem);
			// 		})
			// 	})
			// 	.error(function(){
			// 		Preloader.error();					
			// 	})

			// Helper.get('province')
			// 	.success(function(data){
			// 		$scope.provinces = data;
			// 	})
			// 	.error(function(){
			// 		Preloader.error();					
			// 	})			
		}();
	}]);
//# sourceMappingURL=admin.js.map
