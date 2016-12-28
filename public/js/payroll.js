var payroll = angular.module('payroll', []);
payroll
	.controller('payrollContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');
		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			var current = Helper.fetch();

			$scope.subheader.current = current;
			$scope.isLoading = true;
			$scope.init(current);
			$scope.$broadcast('close');
			$scope.showInactive = false;

			$scope.view = function(data){
				$scope.subheader.current.view(data);
			}

			$scope.edit = function(data){
				$scope.subheader.current.menu[0].action(data);
			}

			$scope.delete = function(data){
				$scope.subheader.current.menu[1].action(data);
			}
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			if($scope.subheader.current.label == 'Payroll Processes')
			{
				data.payroll_period.start_cut_off = new Date(data.payroll_period.start_cut_off);
				data.payroll_period.end_cut_off = new Date(data.payroll_period.end_cut_off);
				data.payroll_period.payout = new Date(data.payroll_period.payout);
			}
		}

		$scope.init = function(query, refresh){
			$scope.type = {};
			$scope.type.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.type.page = 2;

			Helper.post(query.url, query.request)
				.success(function(data){
					$scope.type.details = data;
					$scope.type.items = data.data;
					$scope.type.show = true;

					$scope.fab.label = query.label;
					$scope.fab.action = function(){
						Helper.set(query.fab);

						Helper.customDialog(query.fab)
							.then(function(){
								Helper.notify(query.fab.message);
								$scope.refresh();
							}, function(){
								return;
							});
					}
					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.type.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.type.busy || ($scope.type.page > $scope.type.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.type.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post(query.url + '?page=' + $scope.type.page, query.request)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.type.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.type.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.type.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.type.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);
payroll
	.controller('payrollEntryContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var payrollProcessID = $stateParams.payrollProcessID;

		$scope.form = {}

		$scope.payroll_entry = {};

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};


		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.payrollEntryForm.$invalid){
				angular.forEach($scope.form.payrollEntryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				Helper.alert('Oops!', 'Kindly check form for errors.');

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				Helper.preload();

				if(!$stateParams.payrollEntryID)
				{
					Helper.post('/payroll-entry', $scope.payroll_entry)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.payroll-process', {'payrollProcessID': payrollProcessID});
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
				else
				{
					Helper.put('/payroll-entry/' + $stateParams.payrollEntryID, $scope.payroll_entry)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.payroll-process', {'payrollProcessID': $stateParams.payrollProcessID});
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
			}
		}

		$scope.init = function(){
			Helper.get('/branch')
				.success(function(data){
					$scope.branches = data;
				})

			Helper.get('/cost-center')
				.success(function(data){
					$scope.cost_centers = data;
				})			

			var payroll_process_query = {
				'with': [
					{
						'relation': 'batch',
						'withTrashed': false,
					},
					{
						'relation': 'payroll',
						'withTrashed': false,
					},
					{
						'relation': 'payroll_period',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': payrollProcessID,
					}
				],
				'first': true,
			}

			Helper.post('/payroll-process/enlist', payroll_process_query)
				.success(function(data){
					data.payroll_period.start_cut_off = new Date(data.payroll_period.start_cut_off);
					data.payroll_period.end_cut_off = new Date(data.payroll_period.end_cut_off);
					data.payroll_period.payout = new Date(data.payroll_period.payout);

					$scope.payroll_process = data;

					var employee_query = {
						'with': [
							{
								'relation': 'allowance_types',
								'withTrashed': false,
							},
							{
								'relation': 'deduction_types',
								'withTrashed': false,
							},
						],
						'where': [
							{
								'label': 'batch_id',
								'condition': '=',
								'value': $scope.payroll_process.batch_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation': 'payroll_entries',
								'where': [
									{
										'label': 'payroll_process_id',
										'condition': '=',
										'value': $scope.payroll_process.id,
									},
								],
							},
						],
					}

					Helper.post('/employee/enlist', employee_query)
						.success(function(data){
							$scope.employees = data;
						})
				})
				.error(function(){
					Helper.error();
				})
		}();
	}]);
payroll
	.controller('payrollProcessContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		var payrollProcessID = $stateParams.payrollProcessID;

		var query = {
			'with': [
				{
					'relation': 'payroll',
					'withTrashed': true,
				},
				{
					'relation': 'payroll_period',
					'withTrashed': false,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value' : payrollProcessID,
				}
			],
			'first' : true,
		}

		Helper.post('/payroll-process/enlist', query)
			.success(function(data){
				if(!data)
				{
					return $state.go('page-not-found');
				}

				$scope.payroll_process = data;

				$scope.toolbar.parentState = data.payroll.name;
				$scope.toolbar.childState = new Date(data.payroll_period.start_cut_off).toLocaleDateString() + ' - ' + new Date(data.payroll_period.end_cut_off).toLocaleDateString();

			})

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Payroll Entry';

		$scope.fab.action = function(){
			$state.go('main.payroll-entry', {'payrollProcessID': payrollProcessID});
		}

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/payroll-entry/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/birthday/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.paginate = 20;

		$scope.request.with = [
			{
				'relation':'employee',
				'withTrashed': false,
			},
		];	

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
payroll
	.controller('payrollProcessDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll_process = {};

		if($scope.config.action == 'create')
		{
			$scope.fetchPayrollPeriod = function(){
				if($scope.payroll_process.batch_id)
				{
					var query = {
						'where': [
							{
								'label': 'payroll_id',
								'condition': '=',
								'value': $scope.payroll_process.payroll_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation':'payroll_process',
								'where': [
									{
										'label': 'batch_id',
										'condition': '=',
										'value': $scope.payroll_process.batch_id,
									},
								],
							},
						],
						'orderBy': [
							{
								'column': 'start_cut_off',
								'order': 'desc',
							}
						],
					}

					Helper.post('/payroll-period/enlist', query)
						.success(function(data){
							angular.forEach(data, function(item){
								item.start_cut_off = new Date(item.start_cut_off);
								item.end_cut_off = new Date(item.end_cut_off);
							});

							$scope.payroll_periods = data;
						})
				}
			}
		}

		else if($scope.config.action == 'edit')
		{
			$scope.fetchPayrollPeriod = function(){
				if($scope.payroll_process.batch_id)
				{
					var query = {
						'where': [
							{
								'label': 'payroll_id',
								'condition': '=',
								'value': $scope.payroll_process.payroll_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation':'payroll_process',
								'where': [
									{
										'label': 'batch_id',
										'condition': '=',
										'value': $scope.payroll_process.batch_id,
									},
								],
							},
						],
						'orWhere':[
							{
								'label': 'id',
								'condition': '=',
								'value': $scope.payroll_process.id,
							},
						],
						'orderBy': [
							{
								'column': 'start_cut_off',
								'order': 'desc',
							}
						],
					}

					Helper.post('/payroll-period/enlist', query)
						.success(function(data){
							angular.forEach(data, function(item){
								item.start_cut_off = new Date(item.start_cut_off);
								item.end_cut_off = new Date(item.end_cut_off);
							});

							$scope.payroll_periods = data;
						})
				}
			}

			var query = {
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first': true,
			}

			Helper.post('/payroll-process/enlist', query)
				.success(function(data){
					$scope.payroll_process = data;
					$scope.fetchPayrollPeriod();
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/payroll-process/check-duplicate', $scope.payroll_process)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.payrollProcessForm.$invalid){
				angular.forEach($scope.payrollProcessForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/payroll-process', $scope.payroll_process)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				if($scope.config.action == 'edit')
				{
					Helper.put('/payroll-process/' + $scope.config.id, $scope.payroll_process)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}

		Helper.get('/payroll')
			.success(function(data){
				$scope.payrolls = data;
			})

		Helper.get('/batch')
			.success(function(data){
				$scope.batches = data;
			})
	}]);
payroll
	.controller('payrollSubheaderController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Payroll Process
			{
				'label':'Payroll Processes',
				'url': '/payroll-process/enlist',
				'request' : {
					'with' : [
						{
							'relation':'batch',
							'withTrashed': false,
						},
						{
							'relation':'payroll',
							'withTrashed': false,
						},
						{
							'relation':'payroll_period',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollProcessDialogController',
					'template':'/app/components/payroll/templates/dialogs/payroll-process-form-dialog.template.html',
					'message': 'Payroll process saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll-process',
					'label': 'Payroll process',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll-process';
							data.label = 'Payroll process';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollProcessDialogController';
							dialog.template = '/app/components/payroll/templates/dialogs/payroll-process-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll process updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + new Date(data.payroll_period.start_cut_off).toLocaleDateString() + ' - ' + new Date(data.payroll_period.end_cut_off).toLocaleDateString() + ' payroll process?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll-process/' + data.id)
										.success(function(){
											Helper.notify('Payroll process deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				view: function(data){
					$state.go('main.payroll-process', {payrollProcessID: data.id});
				},
				action: function(current){
					setInit(current);
				},
			},
			// 13th Month Pay Process
			{
				'label':'Payroll Configuration',
				'url': '/payroll/enlist',
				'request' : {
					'with': [
						{
							'relation': 'government_contributions',
							'withTrashed': false
						},
						{
							'relation': 'time_interpretation',
							'withTrashed': false
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollConfigurationDialogController',
					'template':'/app/components/settings/templates/dialogs/payroll-configuration-dialog.template.html',
					'message': 'Payroll configuration saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Payroll Configuration',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll';
							data.label = 'Payroll Configuration';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollConfigurationDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/payroll-configuration-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll configuration updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' payroll configuration?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll/' + data.id)
										.success(function(){
											Helper.notify('Payroll configuration deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				action: function(current){
					setInit(current);
				},
			},
			// Payroll Period
			{
				'label':'Payroll Period',
				'url': '/payroll-period/enlist',
				'request' : {
					'with': [
						{
							'relation': 'payroll',
							'withTrashed': true,
						}
					],
					'orderBy': [
						{
							'column': 'start_cut_off',
							'order': 'asc'
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollPeriodDialogController',
					'template':'/app/components/settings/templates/dialogs/payroll-period-dialog.template.html',
					'message': 'Payroll period saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Payroll Period',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll-period';
							data.label = 'Payroll Period';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollPeriodDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/payroll-period-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll Period updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + new Date(data.start_cut_off).toLocaleDateString() + ' to ' + new Date(data.end_cut_off).toLocaleDateString() + ' payroll period?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll-period/' + data.id)
										.success(function(){
											Helper.notify('Payroll period deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				'sort': [
					{
						'label': 'Start Cut Off',
						'type': 'start_cut_off',
						'sortReverse': false,
					},
					{
						'label': 'End Cut Off',
						'type': 'end_cut_off',
						'sortReverse': false,
					},
					{
						'label': 'Payout',
						'type': 'payout',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
				action: function(current){
					setInit(current);
				},
			},
			// Holidays
			{
				'label':'Holidays',
				'url': '/holiday/enlist',
				'request' : {
					'withTrashed': true,
					'with': [
						{		
							'relation': 'branches',
							'withTrashed': true,
						},
						{		
							'relation': 'cost_centers',
							'withTrashed': true,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'holidayDialogController',
					'template':'/app/components/settings/templates/dialogs/holiday-dialog.template.html',
					'message': 'Holiday saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Holiday',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/holiday';
							data.label = 'Holiday';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'holidayDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/holiday-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Holiday updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.description + ' holiday?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/holiday/' + data.id)
										.success(function(){
											Helper.notify('Holiday deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				'sort': [
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'Date',
						'type': 'date',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);
payroll
	.controller('payrollEntryToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Payroll Entry';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.hideSearchIcon = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
			$scope.showInactive = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
payroll
	.controller('payrollProcessToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
payroll
	.controller('payrollToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Payroll';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.type.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.type.page = 1;
				$scope.type.no_matches = false;
				$scope.type.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
//# sourceMappingURL=payroll.js.map
