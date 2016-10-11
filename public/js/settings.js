var settings = angular.module('settings', []);
settings
	.controller('adminSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.refresh();
		});

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current 
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
						Helper.error();
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
						Helper.error();
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
						Helper.error();
					});
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
						Helper.error();
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
						Helper.error();
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
						Helper.error();
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
settings
	.controller('adminSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
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
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editBranchDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/branch-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete Branch';
							dialog.message = 'Delete ' + data.name + ' branch?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/branch/' + data.id)
										.success(function(){
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
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editHouseBankDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete House Bank';
							dialog.message = 'Delete ' + data.name + ' house bank?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/house-bank/' + data.id)
										.success(function(){
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
			{
				'label':'User Groups',
				'url': '/group/enlist',
				'request' : {
					'with': [
						{
							'relation':'modules',
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
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editGroupDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/group-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete Group';
							dialog.message = 'Delete ' + data.name + ' group?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/group/' + data.id)
										.success(function(){
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
			{
				'label':'Users',
				'url': '/user/enlist',
				'request' : {
					'withTrashed': false,
					'with' : [
						{
							'relation':'group',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createUserDialogController',
					'template':'/app/components/settings/templates/dialogs/user-form-dialog.template.html',
					'message': 'User saved.'
				},
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
