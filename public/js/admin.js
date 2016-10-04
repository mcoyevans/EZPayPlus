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
			.state('main.admin-settings', {
				url: 'admin-settings',
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'profileSettingsContentContainerController',
					},
					'toolbar@main.admin-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.admin-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.admin-settings': {
						templateUrl: '/app/components/admin/templates/subheaders/dashboard-subheader.template.html',
					},
					'content@main.admin-settings':{
						templateUrl: '/app/components/admin/templates/content/admin-settings-content.template.html',
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
						templateUrl: '/app/shared/templates/content/profile-settings-content.template.html',
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
					'label': 'Admin',
					action: function(){
						$state.go('main.admin-settings');
					},
				},
				{
					'label': 'HRIS',
					action: function(){
						$state.go('main.hris-settings');
					},
				},
				{
					'label': 'Payroll',
					action: function(){
						$state.go('main.payroll-settings');
					},
				},
				{
					'label': 'Profile',
					action: function(){
						$state.go('main.profile-settings');
					}, 
				},
				{
					'label': 'Time Keeping',
					action: function(){
						$state.go('main.time-keeping-settings');
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
	.controller('editProfileDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		$scope.company = {};
		$scope.company.country_id = 177; //Philippines

		$scope.busy = false;

		var busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkCity = function(){
			var query = {};
			query.search = $scope.company.city;
			query.strict_search = true;

			Helper.post('/city/enlist', query)
				.success(function(data){
					$scope.cities = data;
					$scope.showError = data.length ? false : true;

					if($scope.company.province_id)
					{
						$scope.checkProvince();
					}
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.company)
				.success(function(data){
					$scope.provinces = data;
				})
		}

		$scope.checkProvince = function(){
			var query = {};
			query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $scope.company.province_id
				}
			];
			query.city = $scope.company.city;
			query.result = 'first';

			Helper.post('/province/enlist', query)
				.success(function(data){
					$scope.noMatches = data.cities.length ? false : true;
				})
		}

		$scope.formatPagIBIG = function(){
			if($scope.companyForm.PagIBIG.$valid)
			{
				var first = $scope.pagibig.slice(0,4);
				var second = $scope.pagibig.slice(4,8);
				var third = $scope.pagibig.slice(8,12);

				$scope.company.pagibig = first + '-' + second + '-' + third;
			}
		}

		$scope.formatPhilHealth = function(){
			if($scope.companyForm.PhilHealth.$valid)
			{
				var first = $scope.philhealth.slice(0,2);
				var second = $scope.philhealth.slice(2,11);
				var third = $scope.philhealth.slice(11,12);

				$scope.company.philhealth = first + '-' + second + '-' + third;
			}
		}

		$scope.formatSSS = function(){
			if($scope.companyForm.SSS.$valid)
			{
				var first = $scope.sss.slice(0,2);
				var second = $scope.sss.slice(2,9);
				var third = $scope.sss.slice(9,10);

				$scope.company.sss = first + '-' + second + '-' + third;
			}
		}	

		$scope.formatTIN = function(){
			if($scope.companyForm.TIN.$valid)
			{
				var first = $scope.tin.slice(0,3);
				var second = $scope.tin.slice(3,6);
				var third = $scope.tin.slice(6,9);

				$scope.company.tin = first + '-' + second + '-' + third;
			}
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
					Helper.stop();
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.init = function()
		{
			var query = {};

			query.with = ['city'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					data.city = data.city.name;

					$scope.pagibig = data.pagibig.replace(/-/g, '');
					$scope.philhealth = data.philhealth.replace(/-/g, '');
					$scope.sss = data.sss.replace(/-/g, '');
					$scope.tin = data.tin.replace(/-/g, '');

					$scope.company = data;

					$scope.checkCity();
					$scope.fetchProvinces();
				})
		}();
	}]);
//# sourceMappingURL=admin.js.map
