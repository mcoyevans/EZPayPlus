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
						controller: 'dashboardContentContainerController',
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
						templateUrl: '/app/components/app/templates/content/dashboard-content.template.html',
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
			.state('main.payroll', {
				url: 'payroll',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
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
						controller: 'payrollContentContainerController',
					},
					'toolbar@main.payroll': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollToolbarController',
					},
					'left-sidenav@main.payroll': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll': {
						templateUrl: '/app/components/payroll/templates/subheaders/payroll-subheader.template.html',
						controller: 'payrollSubheaderController',
					},
					'content@main.payroll':{
						templateUrl: '/app/components/payroll/templates/content/payroll-content.template.html',
					}
				}
			})
			.state('main.payroll-process', {
				url: 'payroll-process/{payrollProcessID}',
				params: {payrollProcessID:null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
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
						controller: 'payrollProcessContentContainerController',
					},
					'toolbar@main.payroll-process': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollProcessToolbarController',
					},
					'left-sidenav@main.payroll-process': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll-process': {
						templateUrl: '/app/components/payroll/templates/subheaders/payroll-process-subheader.template.html',
					},
					'content@main.payroll-process':{
						templateUrl: '/app/components/payroll/templates/content/payroll-process-content.template.html',
					}
				}
			})
			.state('main.payroll-entry', {
				url: 'payroll-process/{payrollProcessID}/payroll-entry/{payrollEntryID}',
				params: {'payrollEntryID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
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
						controller: 'payrollEntryContentContainerController',
					},
					'toolbar@main.payroll-entry': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollEntryToolbarController',
					},
					'left-sidenav@main.payroll-entry': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.payroll-entry':{
						templateUrl: '/app/components/payroll/templates/content/payroll-entry-content.template.html',
					}
				}
			})
			.state('main.thirteenth-month-pay-process', {
				url: 'thirteenth-month-pay-process/{thirteenthMonthPayProcessID}',
				params: {'thirteenthMonthPayProcessID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
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
						controller: 'thirteenthMonthPayProcessContentContainerController',
					},
					'toolbar@main.thirteenth-month-pay-process': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'thirteenthMonthPayProcessToolbarController',
					},
					'left-sidenav@main.thirteenth-month-pay-process': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.thirteenth-month-pay-process': {
						templateUrl: '/app/components/payroll/templates/subheaders/payroll-process-subheader.template.html',
					},
					'content@main.thirteenth-month-pay-process':{
						templateUrl: '/app/components/payroll/templates/content/thirteenth-month-pay-process-content.template.html',
					}
				}
			})
			.state('main.thirteenth-month-pay-entry', {
				url: 'thirteenth-month-pay-process/{thirteenthMonthPayProcessID}/thirteenth-month-pay-entry/{thirteenthMonthPayEntryID}',
				params: {'thirteenthMonthPayProcessID':null, 'thirteenthMonthPayEntryID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
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
						controller: 'thirteenthMonthPayEntryContentContainerController',
					},
					'toolbar@main.thirteenth-month-pay-entry': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.thirteenth-month-pay-entry': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.thirteenth-month-pay-entry':{
						templateUrl: '/app/components/payroll/templates/content/thirteenth-month-pay-entry-content.template.html',
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
			.state('main.business-partners', {
				url: 'bookkeeping/business-partners',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'businessPartnersContentContainerController',
					},
					'toolbar@main.business-partners': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'businessPartnersToolbarController',
					},
					'left-sidenav@main.business-partners': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.business-partners': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/business-partners-subheader.template.html',
						controller: 'businessPartnersSubheaderController',
					},
					'content@main.business-partners':{
						templateUrl: '/app/components/bookkeeping/templates/content/business-partners-content.template.html',
					}
				}
			})
			.state('main.manage-customer', {
				url: 'customer/{customerID}',
				params: {'customerID':null},
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
						controller: 'manageCustomerContentContainerController',
					},
					'toolbar@main.manage-customer': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.manage-customer': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.manage-customer':{
						templateUrl: '/app/components/bookkeeping/templates/content/manage-customer-content.template.html',
					}
				}
			})
			.state('main.financials', {
				url: 'bookkeeping/financials',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'financialsContentContainerController',
					},
					'toolbar@main.financials': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'financialsToolbarController',
					},
					'left-sidenav@main.financials': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.financials': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/financials-subheader.template.html',
						controller: 'financialsSubheaderController',
					},
					'content@main.financials':{
						templateUrl: '/app/components/bookkeeping/templates/content/financials-content.template.html',
					}
				}
			})
			.state('main.inventory', {
				url: 'bookkeeping/inventory',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'inventoryContentContainerController',
					},
					'toolbar@main.inventory': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'inventoryToolbarController',
					},
					'left-sidenav@main.inventory': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.inventory': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/inventory-subheader.template.html',
						controller: 'inventorySubheaderController',
					},
					'content@main.inventory':{
						templateUrl: '/app/components/bookkeeping/templates/content/inventory-content.template.html',
					}
				}
			})
			.state('main.sales', {
				url: 'bookkeeping/sales',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'salesContentContainerController',
					},
					'toolbar@main.sales': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'salesToolbarController',
					},
					'left-sidenav@main.sales': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.sales': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/sales-subheader.template.html',
						controller: 'salesSubheaderController',
					},
					'content@main.sales':{
						templateUrl: '/app/components/bookkeeping/templates/content/sales-content.template.html',
					}
				}
			})
			.state('main.purchasing', {
				url: 'bookkeeping/purchasing',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'purchasingContentContainerController',
					},
					'toolbar@main.purchasing': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'purchasingToolbarController',
					},
					'left-sidenav@main.purchasing': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.purchasing': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/purchasing-subheader.template.html',
						controller: 'purchasingSubheaderController',
					},
					'content@main.purchasing':{
						templateUrl: '/app/components/bookkeeping/templates/content/purchasing-content.template.html',
					}
				}
			})
			.state('main.banking', {
				url: 'bookkeeping/banking',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/4')
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
						controller: 'bankingContentContainerController',
					},
					'toolbar@main.banking': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'bankingToolbarController',
					},
					'left-sidenav@main.banking': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.banking': {
						templateUrl: '/app/components/bookkeeping/templates/subheaders/banking-subheader.template.html',
						controller: 'bankingSubheaderController',
					},
					'content@main.banking':{
						templateUrl: '/app/components/bookkeeping/templates/content/banking-content.template.html',
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
			.state('main.payroll-settings', {
				url: 'settings/payroll',
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
						controller: 'payrollSettingsContentContainerController',
					},
					'toolbar@main.payroll-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollSettingsToolbarController',
					},
					'left-sidenav@main.payroll-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/payroll-settings-subheader.template.html',
						controller: 'payrollSettingsSubheaderController',
					},
					'content@main.payroll-settings':{
						templateUrl: '/app/components/settings/templates/content/payroll-settings-content.template.html',
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