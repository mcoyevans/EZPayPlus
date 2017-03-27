var settings = angular.module('settings', []);
settings
	.controller('adminSettingsContentContainerController', ['$scope', '$mdMedia', 'Helper', function($scope, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}
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

			$scope.init(current);
			$scope.$broadcast('close');
			$scope.showInactive = false;
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
			$scope.refresh();
			$scope.$broadcast('close');
		});

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current;

				// if the tab is in user groups and the data clicked has users under him
				if(data.current.label == 'User Groups' && data.users.length)
				{
					// disable the delete button
					data.current.menu[1].show = false;
				}
				// otherwise
				else if(data.current.label == 'User Groups' && !data.users.length)
				{
					// enable the delete button
					data.current.menu[1].show = true;
				}

				Helper.set(data);

				var dialog = {};
				dialog.controller = 'listItemActionsDialogController';
				dialog.template = '/app/shared/templates/dialogs/list-item-actions-dialog.template.html';

				Helper.customDialog(dialog);
			}
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);

			var item = {};

			item.display = data.name;
			item.description = data.description;
			item.gl_account = data.gl_account;

			$scope.toolbar.items.push(item);
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
						Helper.customDialog(query.fab)
							.then(function(){
								Helper.notify(query.fab.message);
								$scope.refresh();
							}, function(){
								return;
							});
					}
					$scope.fab.show = query.fab ? true : false;

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
settings
	.controller('hrisSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current;

				// condition for checking if the delete button can be allowed
				if( ((data.current.label == 'Departments' || data.current.label == 'Job Categories' || data.current.label == 'Labor Types') && data.positions.length) || (data.current.label == 'Positions' && data.employees.length) || (data.current.label == 'Batches' && data.employees.length) || (data.current.label == 'Deductions' && data.employees.length) || (data.current.label == 'Sanctions' && data.sanction_levels) )
				{
					// disable the delete button
					data.current.menu[1].show = false;
				}
				// otherwise
				else if( ((data.current.label == 'Departments' || data.current.label == 'Job Categories' || data.current.label == 'Labor Types') && !data.positions.length) || (data.current.label == 'Positions' && !data.employees.length) || (data.current.label == 'Batches' && !data.employees.length) || (data.current.label == 'Deductions' && !data.employees.length) || (data.current.label == 'Sanctions' && !data.sanction_levels) )
				{
					// enable the delete button
					data.current.menu[1].show = true;
				}

				Helper.set(data);

				var dialog = {};
				dialog.controller = 'listItemActionsDialogController';
				dialog.template = '/app/shared/templates/dialogs/list-item-actions-dialog.template.html';
				dialog.fullScreen = false;

				Helper.customDialog(dialog);
			}
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);

			var item = {};

			item.display = data.name;
			item.description = data.description;
			item.gl_account = data.gl_account;

			$scope.toolbar.items.push(item);
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
settings
	.controller('payrollSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current;

				// condition for checking if the delete button can be allowed
				if(data.current.label == 'Time Interpretations')
				{
					// disable the delete button
					data.current.menu[1].show = false;
				}
				// otherwise
				else if(!data.current.label == 'Time Interpretations')
				{
					// enable the delete button
					data.current.menu[1].show = true;
				}

				if((data.current.label == 'Payroll Configuration' || data.current.label == 'Payroll Period') && data.payroll_process_count)
				{
					Helper.alert('Notice', 'This data is locked for any modification.');
				}
				else
				{
					Helper.set(data);

					var dialog = {};
					dialog.controller = 'listItemActionsDialogController';
					dialog.template = '/app/shared/templates/dialogs/list-item-actions-dialog.template.html';
					dialog.fullScreen = false;

					Helper.customDialog(dialog);
				}

			}
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);
			data.start_cut_off = data.start_cut_off ? new Date(data.start_cut_off) : null;
			data.end_cut_off = data.end_cut_off ? new Date(data.end_cut_off) : null;
			data.payout = data.payout ? new Date(data.payout) : null;
			data.date = data.date ? new Date(data.date) : null;

			var item = {};

			if($scope.subheader.current.label == 'Payroll Period')
			{
				item.display = data.payroll.name;
			}
			else if($scope.subheader.current.label == 'Holidays')
			{
				item.display = data.description;
			}
			else{
				item.display = data.name;
				item.description = data.description;
				item.gl_account = data.gl_account;
			}


			$scope.toolbar.items.push(item);
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
					$scope.fab.show = query.label == 'Time Interpretations' ? false : true;

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
settings
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
		$scope.fab.dialog.template = '/app/components/settings/templates/dialogs/edit-profile-dialog.template.html';

		$scope.fab.action = function(){
			Helper.customDialog($scope.fab.dialog)
				.then(function(){
					Helper.preload();
					Helper.notify('Changes saved.')
						.then(function(){
							$scope.init(true);
						})
				}, function(){
					return;
				});
		}

		$scope.fab.show = true;

		$scope.init = function(refresh)
		{
			var query = {};
			query.with = ['city', 'province', 'country'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					$scope.company = data;

					if(refresh)
					{
						Helper.stop();
					}
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.init();
	}]);
settings
	.controller('timekeepingSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current;

				// condition for checking if the delete button can be allowed
				if(data.current.label == 'Time Interpretation')
				{
					// disable the delete button
					data.current.menu[1].show = false;
				}
				// otherwise
				else if(!data.current.label == 'Time Interpretation')
				{
					// enable the delete button
					data.current.menu[1].show = true;
				}

				Helper.set(data);

				var dialog = {};
				dialog.controller = 'listItemActionsDialogController';
				dialog.template = '/app/shared/templates/dialogs/list-item-actions-dialog.template.html';
				dialog.fullScreen = false;

				Helper.customDialog(dialog);
			}
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);

			var item = {};

			item.display = data.name;
			item.description = data.description;
			item.gl_account = data.gl_account;

			$scope.toolbar.items.push(item);
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
settings
	.controller('createBranchDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.branch = {};
		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/branch/check-duplicate', $scope.branch)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.branchForm.$invalid){
				angular.forEach($scope.branchForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.post('/branch', $scope.branch)
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
	}]);
settings
	.controller('createCostCenterDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.cost_center = {};
		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/cost-center/check-duplicate', $scope.cost_center)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.costCenterForm.$invalid){
				angular.forEach($scope.costCenterForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.post('/cost-center', $scope.cost_center)
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
	}]);
settings
	.controller('createGroupDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.group = {};
		$scope.group.modules = [];
		$scope.duplicate = false;

		$scope.busy = false;

		Helper.get('/module')
			.success(function(data){
				$scope.modules = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/group/check-duplicate', $scope.group)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.groupForm.$invalid){
				angular.forEach($scope.groupForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				
				Helper.post('/group', $scope.group)
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
	}]);
settings
	.controller('createHouseBankDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		$scope.house_bank = {};
		$scope.currency = {};
		$scope.duplicateBankAccountNumber = false;
		$scope.duplicateGLAccount = false;

		$scope.busy = false;

		Helper.get('/currency')
			.success(function(data){
				$scope.currencies = data;
			})

		$scope.currency.getItems = function(query){
			var results = query ? $filter('filter')($scope.currencies, query) : $scope.currencies;
			return results;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(query){
			Helper.post('/house-bank/check-duplicate', query)
				.success(function(data){
					if(query.bank_account_number)
					{
						$scope.duplicateBankAccountNumber = data;
					}
					else if(query.gl_account)
					{
						$scope.duplicateGLAccount = data;
					}
				})
		}

		$scope.submit = function(){
			if($scope.houseBankForm.$invalid){
				angular.forEach($scope.houseBankForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicateBankAccountNumber && !$scope.duplicateGLAccount)
			{
				$scope.busy = true;
				Helper.post('/house-bank', $scope.house_bank)
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
	}]);
settings
	.controller('createUserDialogController', ['$scope', 'Helper', function($scope, Helper){
		var user = Helper.authUser();

		$scope.user = {};

		$scope.duplicate = false;

		$scope.busy = false;
		
		Helper.post('/group/enlist')
			.success(function(data){
				$scope.groups = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user/check-email', $scope.user)
				.success(function(data){
					$scope.duplicate = data ? true : false;
				})
		}

		$scope.checkDuplicateUsername = function(){
			Helper.post('/user/check-username', $scope.user)
				.success(function(data){
					$scope.duplicate_username = data ? true : false;
				})
		}

		$scope.submit = function(){
			$scope.error = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate && !$scope.duplicate_username && $scope.user.password == $scope.user.confirm)
			{
				$scope.busy = true;
				Helper.post('/user', $scope.user)
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
	}]);
settings
	.controller('earningsDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/de-minimis')
			.success(function(data){
				$scope.de_minimis = data;
			})

		if($scope.config.action == 'create')
		{
			$scope.allowance_type = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.allowance_type = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.allowance_type)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.earningsForm.$invalid){
				angular.forEach($scope.earningsForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.allowance_type)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.allowance_type)
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
	}]);
settings
	.controller('editBranchDialogController', ['$scope', 'Helper', function($scope, Helper){
		var branch = Helper.fetch();

		Helper.get('/branch/' + branch.id)
			.success(function(data){
				$scope.branch = data;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/branch/check-duplicate', $scope.branch)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.branchForm.$invalid){
				angular.forEach($scope.branchForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/branch/' + $scope.branch.id, $scope.branch)
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
	}]);
settings
	.controller('editCostCenterDialogController', ['$scope', 'Helper', function($scope, Helper){
		var cost_center = Helper.fetch();

		Helper.get('/cost-center/' + cost_center.id)
			.success(function(data){
				$scope.cost_center = data;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/cost-center/check-duplicate', $scope.cost_center)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.costCenterForm.$invalid){
				angular.forEach($scope.costCenterForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/cost-center/' + $scope.cost_center.id, $scope.cost_center)
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
	}]);
settings
	.controller('editGroupDialogController', ['$scope', 'Helper', function($scope, Helper){
		var group = Helper.fetch();
		$scope.duplicate = false;

		$scope.busy = false;

		var query = {};
		query.where = [
			{
				'label':'id',
				'condition':'=',
				'value': group.id,
			}
		];
		query.first = true;

		Helper.get('/module')
			.success(function(data){
				$scope.modules = data;

				$scope.count = $scope.modules.length;
				Helper.post('/group/enlist', query)
					.success(function(data){
						$scope.group = data;
						$scope.group.modules = [];

						angular.forEach($scope.modules, function(item, key){
							$scope.group.modules.push(null);

							var query = {};
							query.with = [
								{
									'relation':'module',
									'withTrashed': false,
								},
							];
							query.where = [
								{
									'label': 'group_id',
									'condition': '=',
									'value': group.id,
								},
								{
									'label': 'module_id',
									'condition': '=',
									'value': item.id,
								},
							];
							query.first = true;

							Helper.post('/group-module/enlist', query)
								.success(function(data){
									$scope.count--;
									if(data)
									{
										$scope.group.modules.splice(key, 1, data.module);
									}
								});
						});
					});
			});
		

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/group/check-duplicate', $scope.group)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.groupForm.$invalid){
				angular.forEach($scope.groupForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				
				Helper.put('/group/' + group.id, $scope.group)
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
	}]);
settings
	.controller('editHouseBankDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		var house_bank = Helper.fetch();

		$scope.currency = {};
		$scope.duplicateBankAccountNumber = false;
		$scope.duplicateGLAccount = false;

		$scope.busy = false;

		var query = {};
		query.where = [
			{
				'label':'id',
				'condition':'=',
				'value':house_bank.id,
			}
		];
		query.with = [
			{
				'relation':'currency',
				'withTrashed':false,
			},
		];
		query.first = true;

		Helper.post('/house-bank/enlist', query)
			.success(function(data){
				$scope.house_bank = data;

				Helper.get('/currency')
					.success(function(data){
						$scope.currencies = data;
						$scope.currency.getItems();						
					})
			});

		$scope.currency.getItems = function(query){
			var results = query ? $filter('filter')($scope.currencies, query) : $scope.currencies;
			return results;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(query){
			query.id = house_bank.id;
			Helper.post('/house-bank/check-duplicate', query)
				.success(function(data){
					if(query.bank_account_number)
					{
						$scope.duplicateBankAccountNumber = data;
					}
					else if(query.gl_account)
					{
						$scope.duplicateGLAccount = data;
					}
				})
		}

		$scope.submit = function(){
			if($scope.houseBankForm.$invalid){
				angular.forEach($scope.houseBankForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicateBankAccountNumber && !$scope.duplicateGLAccount)
			{
				$scope.busy = true;
				Helper.put('/house-bank/' + $scope.house_bank.id, $scope.house_bank)
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
	}]);
settings
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
					$scope.busy = false;
					$scope.error = true;
				});
		}

		$scope.init = function()
		{
			var query = {};

			query.with = ['city'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					$scope.company = data;

					$scope.company.city = $scope.company.city.name;

					$scope.pagibig = $scope.company.pagibig.replace(/-/g, '');
					$scope.philhealth = $scope.company.philhealth.replace(/-/g, '');
					$scope.sss = $scope.company.sss.replace(/-/g, '');
					$scope.tin = $scope.company.tin.replace(/-/g, '');


					$scope.checkCity();
					$scope.fetchProvinces();
				})
		}();
	}]);
settings
	.controller('editUserDialogController', ['$scope', 'Helper', function($scope, Helper){
		var user = Helper.authUser();

		var dataUser = Helper.fetch();
		
		$scope.edit = true;

		$scope.duplicate = false;

		$scope.busy = false;

		Helper.get('/user/' + dataUser.id)
			.success(function(data){
				$scope.user = data;
			})

		Helper.post('/group/enlist')
			.success(function(data){
				$scope.groups = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user/check-email', $scope.user)
				.success(function(data){
					$scope.duplicate = data ? true : false;
				})
		}

		$scope.checkDuplicateUsername = function(){
			Helper.post('/user/check-username', $scope.user)
				.success(function(data){
					$scope.duplicate_username = data ? true : false;
				})
		}

		$scope.submit = function(){
			$scope.error = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/user/' + dataUser.id , $scope.user)
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
	}]);
settings
	.controller('holidayDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.holiday = {};

		$scope.types = ['Regular Holiday', 'Special Non-Working Holiday']

		if($scope.config.action == 'create')
		{
			$scope.holiday.date = new Date();

			$scope.holiday.branches = [];
			$scope.holiday.cost_centers = [];

			Helper.get('/branch')
				.success(function(data){
					$scope.branches = data;
				})

			Helper.get('/cost-center')
				.success(function(data){
					$scope.cost_centers = data;
				})
		}

		else if($scope.config.action == 'edit')
		{
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

			Helper.post('/holiday/enlist', query)
				.success(function(data){
					data.date = new Date(data.date);

					$scope.holiday = data;

					$scope.holiday.branches = [];
					$scope.holiday.cost_centers = [];

					Helper.get('/branch')
						.success(function(data){
							$scope.branches = data;

							$scope.branches_count = $scope.branches.length;
							angular.forEach($scope.branches, function(item, key){
								$scope.holiday.branches.push(null);

								var query = {};
								query.with = [
									{
										'relation':'branch',
										'withTrashed': false,
									},
								];
								query.where = [
									{
										'label': 'holiday_id',
										'condition': '=',
										'value': $scope.config.id,
									},
									{
										'label': 'branch_id',
										'condition': '=',
										'value': item.id,
									},
								];
								query.first = true;

								Helper.post('/branch-holiday/enlist', query)
									.success(function(data){
										$scope.branches_count--;
										if(data)
										{
											$scope.holiday.branches.splice(key, 1, data.branch);
										}
									});
							});
						})

					Helper.get('/cost-center')
						.success(function(data){
							$scope.cost_centers = data;

							$scope.cost_centers_count = $scope.cost_centers.length;
							angular.forEach($scope.cost_centers, function(item, key){
								$scope.holiday.cost_centers.push(null);

								var query = {};
								query.with = [
									{
										'relation':'cost_center',
										'withTrashed': false,
									},
								];
								query.where = [
									{
										'label': 'holiday_id',
										'condition': '=',
										'value': $scope.config.id,
									},
									{
										'label': 'cost_center_id',
										'condition': '=',
										'value': item.id,
									},
								];
								query.first = true;

								Helper.post('/cost-center-holiday/enlist', query)
									.success(function(data){
										$scope.cost_centers_count--;
										if(data)
										{
											$scope.holiday.cost_centers.splice(key, 1, data.cost_center);
										}
									});
							});
						})
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
			var back_up_date = {}

			back_up_date.date = new Date($scope.holiday.date);

			$scope.holiday.date = $scope.holiday.date.toDateString();

			Helper.post('/holiday/check-duplicate', $scope.holiday)
				.success(function(data){
					$scope.duplicate = data;

					$scope.holiday.date = new Date(back_up_date.date);
				})
		}

		$scope.submit = function(){
			if($scope.holidayForm.$invalid){
				angular.forEach($scope.holidayForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.holiday.branches, function(item){

			});

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				var back_up_date = {}

				back_up_date.date = new Date($scope.holiday.date);

				$scope.holiday.date = $scope.holiday.date.toDateString();

				if($scope.config.action == 'create')
				{
					Helper.post('/holiday', $scope.holiday)
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

							$scope.holiday.date = new Date(back_up_date.date);
						});
				}
				if($scope.config.action == 'edit')
				{
					Helper.put('/holiday/' + $scope.config.id, $scope.holiday)
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

							$scope.holiday.date = new Date(back_up_date.date);
						});
				}
			}
		}
	}]);
settings
	.controller('leaveTypeDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.leave = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.leave = data;
					$scope.leave.paid = data.paid ? true : false;
					$scope.leave.convertible = data.convertible ? true : false;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.leave)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.leaveTypeForm.$invalid){
				angular.forEach($scope.leaveTypeForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.leave)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.leave)
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
	}]);
settings
	.controller('nameDescriptionDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.model = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.model)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.model)
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
	}]);
settings
	.controller('payrollConfigurationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll = {};

		$scope.pay_frequencies = ['Semi-monthly', 'Monthly'];

		$scope.thirteenth_month_pay_basis = ['Base', 'Gross'];

		if($scope.config.action == 'create')
		{
			$scope.payroll.thirteenth_month_pay_basis = 'Base';

			$scope.payroll.government_contributions = [
				{
					'name':'Withholding Tax',
				},
				{
					'name':'SSS',
				},
				{
					'name':'Pagibig',
				},
				{
					'name':'Philhealth',
				},
			]
		}

		else if($scope.config.action == 'edit')
		{
			var query = {
				'with': [
					{
						'relation': 'government_contributions',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first': true,
			}

			Helper.post('/payroll/enlist', query)
				.success(function(data){
					angular.forEach(data.government_contributions, function(item){
						$scope.checkGovernmentContribution(item);
					})

					$scope.payroll = data;
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
			Helper.post('/payroll/check-duplicate', $scope.payroll)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.resetGovernmentContributions = function(){
			angular.forEach($scope.payroll.government_contributions, function(item){
				if($scope.payroll.pay_frequency == 'Semi-monthly')
				{
					item.third_cut_off = 0;
					item.fourth_cut_off = 0;
				}
				else if($scope.payroll.pay_frequency == 'Monthly')
				{
					item.second_cut_off = 0;
					item.third_cut_off = 0;
					item.fourth_cut_off = 0;
				}
			});
		}

		$scope.checkGovernmentContribution = function(item){
			if(item.first_cut_off || item.second_cut_off || item.third_cut_off || item.fourth_cut_off)
			{
				item.checked = true;
			}
			else{
				item.checked = false;				
			}
		}

		$scope.submit = function(){
			$scope.unchecked = false;

			if($scope.payrollForm.$invalid){
				angular.forEach($scope.payrollForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.payroll.government_contributions, function(item){
				if(!item.checked){
					$scope.unchecked = true;
				}
			});

			if(!$scope.duplicate && !$scope.unchecked)
			{
				$scope.busy = true;
				if($scope.config.action == 'create')
				{
					Helper.post('/payroll', $scope.payroll)
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
					Helper.put('/payroll/' + $scope.config.id, $scope.payroll)
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

		Helper.get('/time-interpretation')
			.success(function(data){
				$scope.time_interepretations = data;
			})
	}]);
settings
	.controller('payrollPeriodDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll_period = {};

		$scope.today = new Date();

		if($scope.config.action == 'create')
		{
			$scope.payroll_period.start_cut_off = new Date();
			$scope.payroll_period.end_cut_off = new Date();
			$scope.payroll_period.payout = new Date();
		}

		else if($scope.config.action == 'edit')
		{
			var query = {
				'with': [
					{
						'relation': 'payroll',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first': true,
			}

			Helper.post('/payroll-period/enlist', query)
				.success(function(data){
					data.start_cut_off = new Date(data.start_cut_off);
					data.end_cut_off = new Date(data.end_cut_off);
					data.payout = new Date(data.payout);

					$scope.payroll_period = data;
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

		$scope.checkCutOffs = function(date){
			if(date == 'start')
			{
				if($scope.payroll_period.start_cut_off > $scope.payroll_period.end_cut_off)
				{
					$scope.payroll_period.end_cut_off = new Date($scope.payroll_period.start_cut_off);	
				}
			}
			else if(date == 'end')
			{
				if($scope.payroll_period.end_cut_off > $scope.payroll_period.payout)
				{
					$scope.payroll_period.payout = new Date($scope.payroll_period.end_cut_off);	
				}	
			}

			if($scope.payroll_period.payroll_id)
			{
				var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

				var query = {
					'withCount': [
						{
							'relation': 'payroll_periods',
							'withTrashed': false,
							'whereBetween': months[$scope.payroll_period.start_cut_off.getMonth()],
						},
					],
					'where': [
						{
							'label': 'id',
							'condition': '=',
							'value': $scope.payroll_period.payroll_id,
						},
					],
					'first' : true,
				}

				Helper.post('/payroll/enlist', query)
					.success(function(data){
						if(data.pay_frequency == 'Weekly')
						{
							var max_cut_off = 4;
						}
						else if(data.pay_frequency == 'Semi-monthly')
						{
							var max_cut_off = 2; 
						}
						else if(data.pay_frequency == 'Monthly')
						{
							var max_cut_off = 1; 
						}

						$scope.limit = data.payroll_periods_count == max_cut_off; 
					})
					.error(function(){
						$scope.error = true
					});
			}

			$scope.checkDuplicate();
		}

		$scope.checkDuplicate = function(){
			var back_up_date = {}

			back_up_date.start_cut_off = new Date($scope.payroll_period.start_cut_off);
			back_up_date.end_cut_off = new Date($scope.payroll_period.end_cut_off);
			back_up_date.payout = new Date($scope.payroll_period.payout);

			$scope.payroll_period.start_cut_off = $scope.payroll_period.start_cut_off.toDateString();
			$scope.payroll_period.end_cut_off = $scope.payroll_period.end_cut_off.toDateString();
			$scope.payroll_period.payout = $scope.payroll_period.payout.toDateString();

			Helper.post('/payroll-period/check-duplicate', $scope.payroll_period)
				.success(function(data){
					$scope.duplicate = data;

					$scope.payroll_period.start_cut_off = new Date(back_up_date.start_cut_off);
					$scope.payroll_period.end_cut_off = new Date(back_up_date.end_cut_off);
					$scope.payroll_period.payout = new Date(back_up_date.payout);
				})
				.error(function(){
					$scope.error = true;

					$scope.payroll_period.start_cut_off = new Date(back_up_date.start_cut_off);
					$scope.payroll_period.end_cut_off = new Date(back_up_date.end_cut_off);
					$scope.payroll_period.payout = new Date(back_up_date.payout);	
				})
		}

		$scope.submit = function(){
			if($scope.payrollPeriodForm.$invalid){
				angular.forEach($scope.payrollPeriodForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate && !$scope.limit)
			{
				$scope.busy = true;

				var back_up_date = {}

				back_up_date.start_cut_off = new Date($scope.payroll_period.start_cut_off);
				back_up_date.end_cut_off = new Date($scope.payroll_period.end_cut_off);
				back_up_date.payout = new Date($scope.payroll_period.payout);

				$scope.payroll_period.start_cut_off = $scope.payroll_period.start_cut_off.toDateString();
				$scope.payroll_period.end_cut_off = $scope.payroll_period.end_cut_off.toDateString();
				$scope.payroll_period.payout = $scope.payroll_period.payout.toDateString();

				if($scope.config.action == 'create')
				{
					Helper.post('/payroll-period', $scope.payroll_period)
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

							$scope.payroll_period.start_cut_off = new Date(back_up_date.start_cut_off);
							$scope.payroll_period.end_cut_off = new Date(back_up_date.end_cut_off);
							$scope.payroll_period.payout = new Date(back_up_date.payout);
						});
				}
				if($scope.config.action == 'edit')
				{
					Helper.put('/payroll-period/' + $scope.config.id, $scope.payroll_period)
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

							$scope.payroll_period.start_cut_off = new Date(back_up_date.start_cut_off);
							$scope.payroll_period.end_cut_off = new Date(back_up_date.end_cut_off);
							$scope.payroll_period.payout = new Date(back_up_date.payout);
						});
				}
			}
		}

		Helper.get('/payroll')
			.success(function(data){
				$scope.payrolls = data;
			})
	}]);
settings
	.controller('positionDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/department')
			.success(function(data){
				$scope.departments = data;
			})

		Helper.get('/job-category')
			.success(function(data){
				$scope.job_categories = data;
			})

		Helper.get('/labor-type')
			.success(function(data){
				$scope.labor_types = data;
			})		

		if($scope.config.action == 'create')
		{
			$scope.position = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.position = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.position)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.positionForm.$invalid){
				angular.forEach($scope.positionForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.position)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.position)
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
	}]);
settings
	.controller('sanctionLevelDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/sanction-type')
			.success(function(data){
				$scope.sanctions = data;
			})

		if($scope.config.action == 'create')
		{
			$scope.sanction_level = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.sanction_level = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.sanction_level)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.sanctionLevelForm.$invalid){
				angular.forEach($scope.sanctionLevelForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.sanction_level)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.sanction_level)
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
	}]);
settings
	.controller('shiftScheduleDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.shift_schedule = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.shift_schedule = data;
					$scope.shift_schedule.paid = data.paid ? true : false;
					$scope.shift_schedule.convertible = data.convertible ? true : false;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.shift_schedule)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.shiftScheduleForm.$invalid){
				angular.forEach($scope.shiftScheduleForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.shift_schedule)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.shift_schedule)
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
	}]);
settings
	.controller('timeInterpretationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.time_interpretation = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.regular_working_hours = data.regular_working_hours;
					$scope.night_differential = data.night_differential;
					$scope.overtime = data.overtime;
					$scope.overtime_night_differential = data.overtime_night_differential;
					$scope.rest_day_rate = data.rest_day_rate;
					$scope.rest_day_night_differential = data.rest_day_night_differential;
					$scope.rest_day_overtime = data.rest_day_overtime;
					$scope.rest_day_overtime_night_differential = data.rest_day_overtime_night_differential;

					$scope.special_holiday_rate = data.special_holiday_rate;
					$scope.special_holiday_night_differential = data.special_holiday_night_differential;
					$scope.special_holiday_overtime = data.special_holiday_overtime;
					$scope.special_holiday_overtime_night_differential = data.special_holiday_overtime_night_differential;
					$scope.special_holiday_rest_day_rate = data.special_holiday_rest_day_rate;
					$scope.special_holiday_rest_day_night_differential = data.special_holiday_rest_day_night_differential;
					$scope.special_holiday_rest_day_overtime = data.special_holiday_rest_day_overtime;
					$scope.special_holiday_rest_day_overtime_night_differential = data.special_holiday_rest_day_overtime_night_differential;

					$scope.regular_holiday_rate = data.regular_holiday_rate;
					$scope.regular_holiday_night_differential = data.regular_holiday_night_differential;
					$scope.regular_holiday_overtime = data.regular_holiday_overtime;
					$scope.regular_holiday_overtime_night_differential = data.regular_holiday_overtime_night_differential;
					$scope.regular_holiday_rest_day_rate = data.regular_holiday_rest_day_rate;
					$scope.regular_holiday_rest_day_night_differential = data.regular_holiday_rest_day_night_differential;
					$scope.regular_holiday_rest_day_overtime = data.regular_holiday_rest_day_overtime;
					$scope.regular_holiday_rest_day_overtime_night_differential = data.regular_holiday_rest_day_overtime_night_differential;

					$scope.time_interpretation = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.time_interpretation)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.timeInterpretationForm.$invalid){
				angular.forEach($scope.timeInterpretationForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.time_interpretation)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.time_interpretation)
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
	}]);
settings
	.controller('adminSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// {
			// 	'label':'Branches',
			// 	'url': '/branch/enlist',
			// 	'request': {
			// 		'withTrashed': true,
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'controller':'createBranchDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/branch-form-dialog.template.html',
			// 		'message': 'Branch saved.'
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show':true,
			// 			action: function(data){
			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'editBranchDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/branch-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Branch updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show':true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' branch?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/branch/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Branch deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'GL Account',
			// 			'type': 'gl_account',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
			{
				'label':'House Banks',
				'url': '/house-bank/enlist',
				'request': {
					'withTrashed': true,
					'with': [
						{
							'relation' : 'currency',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createHouseBankDialogController',
					'template':'/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html',
					'message': 'House bank saved.'
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editHouseBankDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('House bank updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' house bank?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/house-bank/' + data.id)
										.success(function(){
											Helper.notify('House bank deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Bank Branch',
						'type': 'bank_branch',
						'sortReverse': false,
					},
					{
						'label': 'Bank Account Number',
						'type': 'bank_account_number',
						'sortReverse': false,
					},
					{
						'label': 'Bank Account Name',
						'type': 'bank_account_name',
						'sortReverse': false,
					},
					{
						'label': 'GL Account',
						'type': 'gl_account',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
			},
			// Bir Tax Table
			{
				'label':'BIR Tax Table',
				'url': '/tax/enlist',
				'request': {
					'with': [
						{
							'relation' : 'tax_code',
							'withTrashed': false,
						},
					],
					'paginate':200
				},
				action: function(current){
					setInit(current);
				},
				'table': 'tax',
			},
			{
				'label':'SSS Table',
				'url': '/sss/enlist',
				'request': {
					'paginate':20,
				},
				action: function(current){
					setInit(current);
				},
				'table': 'sss',
			},
			{
				'label':'HDMF Table',
				'url': '/pagibig/enlist',
				'request': {
					'paginate':20,
				},
				action: function(current){
					setInit(current);
				},
				'table': 'pagibig',
			},
			{
				'label':'Philhealth Table',
				'url': '/philhealth/enlist',
				'request': {
					'paginate':20,
				},
				action: function(current){
					setInit(current);
				},
				'table': 'philhealth',
			},
			// User Groups
			{
				'label':'User Groups',
				'url': '/group/enlist',
				'request' : {
					'with': [
						{
							'relation':'modules',
							'withTrashed': false,
						},
						{
							'relation':'users',
							'withTrashed': false,	
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createGroupDialogController',
					'template':'/app/components/settings/templates/dialogs/group-form-dialog.template.html',
					'message': 'User group saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editGroupDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/group-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('User group updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' group?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/group/' + data.id)
										.success(function(){
											Helper.notify('User group deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			// Users
			{
				'label':'Users',
				'url': '/user/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'group',
							'withTrashed': false,
						}
					],
					'where': [
						{
							'label':'id',
							'condition':'!=',
							'value': 1,
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createUserDialogController',
					'template':'/app/components/settings/templates/dialogs/user-form-dialog.template.html',
					'message': 'User saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editUserDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/user-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('User updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Disable Account',
						'icon': 'mdi-account-remove',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Disable account';
							dialog.message = 'Disable ' + data.name + '\'s account?'
							dialog.ok = 'Disable';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/user/' + data.id)
										.success(function(){
											Helper.notify('User account disabled.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Email',
						'type': 'email',
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
settings
	.controller('hrisSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Branches
			{
				'label':'Branches',
				'url': '/branch/enlist',
				'request': {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createBranchDialogController',
					'template':'/app/components/settings/templates/dialogs/branch-form-dialog.template.html',
					'message': 'Branch saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editBranchDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/branch-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Branch updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' branch?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/branch/' + data.id)
										.success(function(){
											Helper.notify('Branch deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'GL Account',
						'type': 'gl_account',
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
			// Cost Centers
			{
				'label':'Cost Centers',
				'url': '/cost-center/enlist',
				'request': {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createCostCenterDialogController',
					'template':'/app/components/settings/templates/dialogs/cost-center-form-dialog.template.html',
					'message': 'Cost center saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editCostCenterDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/cost-center-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Cost center updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' cost center?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/cost-center/' + data.id)
										.success(function(){
											Helper.notify('Cost center deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'GL Account',
						'type': 'gl_account',
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
			// Departments
			// {
			// 	'label':'Departments',
			// 	'url': '/department/enlist',
			// 	'request': {
			// 		'with': [
			// 			{
			// 				'relation':'positions',
			// 				'withTrashed':false,
			// 			},
			// 		],
			// 		'withTrashed': true,
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'nameDescriptionDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
			// 		'message': 'Department saved.',
			// 		'action' : 'create',
			// 		'url': '/department',
			// 		'label': 'Department',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/department';
			// 				data.label = 'Department';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'nameDescriptionDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Department updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' department?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/department/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Department deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
			// Job Categories
			/*{
				'label':'Job Categories',
				'url': '/job-category/enlist',
				'request' : {
					'with': [
						{
							'relation':'positions',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Job category saved.',
					'action' : 'create',
					'url': '/job-category',
					'label': 'Job category',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/job-category';
							data.label = 'Job category';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Job category updated.');
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
							dialog.message = 'Delete ' + data.name + ' job category?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/job-category/' + data.id)
										.success(function(){
											Helper.notify('Job category deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			},*/
			// Labor Types
			/*{
				'label':'Labor Types',
				'url': '/labor-type/enlist',
				'request' : {
					'with' : [
						{
							'relation':'positions',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Labor type saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/labor-type',
					'label': 'Labor type',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/labor-type';
							data.label = 'Labor type';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Labor type updated.');
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
							dialog.message = 'Delete ' + data.name + ' labor type?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/labor-type/' + data.id)
										.success(function(){
											Helper.notify('Labor type deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			},*/
			// Leaves
			/*{
				'label':'Leaves',
				'url': '/leave-type/enlist',
				'request': {
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'leaveTypeDialogController',
					'template':'/app/components/settings/templates/dialogs/leave-type-form-dialog.template.html',
					'message': 'Leave saved.',
					'action' : 'create',
					'url': '/leave-type',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/leave-type';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'leaveTypeDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/leave-type-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Leave updated.');
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
							dialog.message = 'Delete ' + data.name + ' leave?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/leave-type/' + data.id)
										.success(function(){
											Helper.notify('Leave deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			},*/
			// Earnings
			{
				'label':'Earnings',
				'url': '/allowance-type/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'employees',
							'withTrashed': false,
						},
						{
							'relation':'de_minimis',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'earningsDialogController',
					'template':'/app/components/settings/templates/dialogs/earnings-dialog.template.html',
					'message': 'Earnings saved.',
					'action' : 'create',
					'url': '/allowance-type',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/allowance-type';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'earningsDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/earnings-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Earnings updated.');
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
							dialog.message = 'Delete ' + data.name + '?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/allowance-type/' + data.id)
										.success(function(){
											Helper.notify('Earnings deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			// Deductions
			{
				'label':'Deductions',
				'url': '/deduction-type/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'employees',
							'withTrashed': false,
						}
					],
					'where': [
						{
							'label':'government_deduction',
							'condition': '=',
							'value': false
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Deduction type saved.',
					'action' : 'create',
					'url': '/deduction-type',
					'label': 'Deduction',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/deduction-type';
							data.label = 'Deduction';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Deduction type updated.');
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
							dialog.message = 'Delete ' + data.name + ' deduction?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/deduction-type/' + data.id)
										.success(function(){
											Helper.notify('Deduction type deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			// Positions
			{
				'label':'Positions',
				'url': '/position/enlist',
				'request': {
					'withTrashed': true,
					'with': [
					// 	{
					// 		'relation' : 'department',
					// 		'withTrashed': false,
					// 	},
					// 	{
					// 		'relation' : 'job_category',
					// 		'withTrashed': false,
					// 	},
					// 	{
					// 		'relation' : 'labor_type',
					// 		'withTrashed': false,
					// 	},
					// 	{
					// 		'relation' : 'deployments',
					// 		'withTrashed': false,	
					// 	},
						{
							'relation' : 'employees',
							'withTrashed': true,	
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Position saved.',
					'action' : 'create',
					'url': '/position',
					'label': 'Position',
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/position';
							data.label = 'Position';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Position updated.');
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
							dialog.message = 'Delete ' + data.name + ' position?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/position/' + data.id)
										.success(function(){
											Helper.notify('Position deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
			},
			// Batches
			{
				'label':'Batches',
				'url': '/batch/enlist',
				'request': {
					'withTrashed': true,
					'with': [
						{
							'relation' : 'employees',
							'withTrashed': true,	
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Batch saved.',
					'action' : 'create',
					'url': '/batch',
					'label': 'Batch',
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/batch';
							data.label = 'Batch';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Batch updated.');
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
							dialog.message = 'Delete ' + data.name + ' batch?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/batch/' + data.id)
										.success(function(){
											Helper.notify('Batch deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
			},
			// Sanctions
			// {
			// 	'label':'Sanctions',
			// 	'url': '/sanction-type/enlist',
			// 	'request' : {		
			// 		'with': [
			// 			{
			// 				'relation':'sanction_levels',
			// 				'withTrashed': false,
			// 			},
			// 		],
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'nameDescriptionDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
			// 		'message': 'Sanction type saved.',
			// 		'action' : 'create',
			// 		'url': '/sanction-type',
			// 		'label': 'Sanction',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/sanction-type';
			// 				data.label = 'Sanction';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'nameDescriptionDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Sanction type updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' sanction type?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/sanction-type/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Sanction type deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
			// Sanction Levels
			// {
			// 	'label':'Sanction Levels',
			// 	'url': '/sanction-level/enlist',
			// 	'request' : {		
			// 		'with': [
			// 			{
			// 				'relation':'sanction_type',
			// 				'withTrashed': false,
			// 			},
			// 		],
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'sanctionLevelDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/sanction-level-form-dialog.template.html',
			// 		'message': 'Sanction level saved.',
			// 		'action' : 'create',
			// 		'url': '/sanction-level',
			// 		'label': 'Sanction',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/sanction-level';
			// 				data.label = 'Sanction';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'sanctionLevelDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/sanction-level-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Sanction level updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' sanction level?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/sanction-level/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Sanction level deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
		];

		setInit($scope.subheader.navs[0]);
	}]);
settings
	.controller('payrollSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Time Interpretations
			{
				'label':'Time Interpretations',
				'url': '/time-interpretation/enlist',
				'request' : {
					'with' : [
						{
							'relation':'positions',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'timeInterpretationDialogController',
					'template':'/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html',
					'message': 'Time interpretation saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/time-interpretation',
					'label': 'Time interpretation',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/time-interpretation';
							data.label = 'Time interpretation';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'timeInterpretationDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Time interpretation updated.');
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
							dialog.message = 'Delete ' + data.name + ' time interpretation?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/time-interpretation/' + data.id)
										.success(function(){
											Helper.notify('Time interpretation deleted.');
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
			// Payroll Configuration
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
					'withCount': [
						{
							'relation': 'payroll_process',
							'withTrashed': false,
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
					'withCount': [
						{
							'relation': 'payroll_process',
							'withTrashed': false,
						},
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
settings
	.controller('timekeepingSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Departments
			{
				'label':'Shift Schedule',
				'url': '/shift-schedule/enlist',
				'request': {
					'withTrashed': false,
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'shiftScheduleDialogController',
					'template':'/app/components/settings/templates/dialogs/shift-schedule-form-dialog.template.html',
					'message': 'Shift schedule saved.',
					'action' : 'create',
					'url': '/shift-schedule',
					'label': 'Shift Schedule',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/shift-schedule';
							data.label = 'Shift Schedule';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'shiftScheduleDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/shift-schedule-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Shift schedule updated.');
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
							dialog.message = 'Delete this shift schedule?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/shift-schedule/' + data.id)
										.success(function(){
											Helper.notify('Shift schedule deleted.');
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
						'label': 'Date Start',
						'type': 'date_start',
						'sortReverse': false,
					},
					{
						'label': 'Date End',
						'type': 'date_end',
						'sortReverse': false,
					},
					{
						'label': 'Shift Start',
						'type': 'shift_start',
						'sortReverse': false,
					},
					{
						'label': 'Shift End',
						'type': 'shift_end',
						'sortReverse': false,
					},
					{
						'label': 'Hours Break',
						'type': 'hours_break',
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
			// Biometrics
			{
				'label':'Biometrics',
				'url': '/biometric/enlist',
				'request' : {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Biometric machine saved.',
					'action' : 'create',
					'url': '/biometric',
					'label': 'Biometric',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/biometric';
							data.label = 'Biometric';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Biometric machine updated.');
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
							dialog.message = 'Delete ' + data.name + ' biometric machine?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/biometric/' + data.id)
										.success(function(){
											Helper.notify('Biometric machine deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
			// Time Interpretations
			{
				'label':'Time Interpretations',
				'url': '/time-interpretation/enlist',
				'request' : {
					'with' : [
						{
							'relation':'positions',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'timeInterpretationDialogController',
					'template':'/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html',
					'message': 'Time interpretation saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/time-interpretation',
					'label': 'Time interpretation',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/time-interpretation';
							data.label = 'Time interpretation';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'timeInterpretationDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Time interpretation updated.');
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
							dialog.message = 'Delete ' + data.name + ' time interpretation?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/time-interpretation/' + data.id)
										.success(function(){
											Helper.notify('Time interpretation deleted.');
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
		];

		setInit($scope.subheader.navs[0]);
	}]);
settings
	.controller('adminSettingsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Admin';

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
settings
	.controller('hrisSettingsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'HRIS';

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
settings
	.controller('payrollSettingsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
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
settings
	.controller('timekeepingSettingsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Timekeeping';

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
//# sourceMappingURL=settings.js.map
