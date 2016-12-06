var hris = angular.module('hris', []);
hris
	.controller('hrisContentContainerController', ['$scope', '$state', '$mdMedia', 'Helper', function($scope, $state, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

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
		$scope.fab.label = 'Employee';
		$scope.fab.action = function(){
			$state.go('main.manage-employee');
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
			$scope.refresh();
			$scope.$broadcast('close');
		});

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
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

		$scope.request = {}
		$scope.request.paginate = 20;
		$scope.request.withTrashed = true;

		$scope.init = function(){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/employee/enlist', $scope.request)
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
						Helper.post('/employee/enlist' + '?page=' + $scope.model.page, $scope.request)
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

  			$scope.init();
		};

		$scope.init();
	}]);
hris
	.controller('manageEmployeeContentContainerController', ['$scope', '$filter', '$stateParams', '$mdMedia', 'Helper', function($scope, $filter, $stateParams, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		$scope.form = {}

		$scope.employee = {};

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.calculateAge = function(birthday){
			var ageDifMs = Date.now() - birthday.getTime();
		    var ageDate = new Date(ageDifMs);
		    $scope.employee.age = Math.abs(ageDate.getUTCFullYear() - 1970);
		}

		if($stateParams.employeeID)
		{
			Helper.get('/employee/' + $stateParams.employeeID)
				.success(function(data){
					$scope.employee = data;
				})
		}
		else{
			$scope.toolbar.childState = 'Employee';

			$scope.employee.sex = 'Male';

			$scope.employee.date_hired = new Date();

			$scope.calculateAge(new Date());

			$scope.employee.allowance_types = [];
			$scope.employee.deduction_types = [];
		}

		$scope.today = new Date();

		$scope.civil_status = ['Single', 'Married', 'Widowed'];
		$scope.employment_status = ['Probationary', 'Project Based', 'Regular'];

		$scope.addEarnings = function(){
			$scope.employee.allowance_types.push({});
		}

		$scope.addDeductions = function(){
			$scope.employee.deduction_types.push({});
		}

		$scope.removeEarnings = function(item){
			var index = $scope.employee.allowance_types.indexOf(item);

			$scope.employee.allowance_types.splice(index, 1);
		}

		$scope.removeDeduction = function(item){
			var index = $scope.employee.deduction_types.indexOf(item);

			$scope.employee.deduction_types.splice(index, 1);
		}


		$scope.checkDuplicate = function(){
			Helper.post('/employee/check-duplicate', $scope.employee)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.checkCity = function(){
			var query = {};
			query.search = $scope.employee.city;
			query.strict_search = true;

			Helper.post('/city/enlist', query)
				.success(function(data){
					$scope.cities = data;
					$scope.showError = data.length ? false : true;

					if($scope.employee.province_id)
					{
						$scope.checkProvince();
					}
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.employee)
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
					'value': $scope.employee.province_id
				}
			];
			query.city = $scope.employee.city;
			query.result = 'first';

			Helper.post('/province/enlist', query)
				.success(function(data){
					$scope.noMatches = data.cities.length ? false : true;
				})
		}
		
		$scope.formatPagIBIG = function(pagibig){
			if($scope.form.employeeForm.PagIBIG.$valid)
			{
				var first = pagibig.slice(0,4);
				var second = pagibig.slice(4,8);
				var third = pagibig.slice(8,12);

				$scope.employee.pagibig = first + '-' + second + '-' + third;
			}
		}

		$scope.formatPhilHealth = function(philhealth){
			if($scope.form.employeeForm.PhilHealth.$valid)
			{
				var first = philhealth.slice(0,2);
				var second = philhealth.slice(2,11);
				var third = philhealth.slice(11,12);

				$scope.employee.philhealth = first + '-' + second + '-' + third;
			}
		}

		$scope.formatSSS = function(sss){
			if($scope.form.employeeForm.SSS.$valid)
			{
				var first = sss.slice(0,2);
				var second = sss.slice(2,9);
				var third = sss.slice(9,10);

				$scope.employee.sss = first + '-' + second + '-' + third;
			}
		}	

		$scope.formatTIN = function(tin){
			if($scope.form.employeeForm.TIN.$valid)
			{
				var first = tin.slice(0,3);
				var second = tin.slice(3,6);
				var third = tin.slice(6,9);

				$scope.employee.tin = first + '-' + second + '-' + third;
			}
		}

		$scope.checkDeMinimis = function(data){
			var allowance_type = $filter('filter')($scope.allowance_types, {'id': data.allowance_type_id})[0];

			data.de_minimis = allowance_type.de_minimis_id ? allowance_type.de_minimis : null;
		}

		$scope.checkLimit = function(data){
			var total = data.checked ? (data.first_cut_off ? data.amount : 0) + (data.second_cut_off ? data.amount : 0) + (data.third_cut_off ? data.amount : 0) + (data.fourth_cut_off ? data.amount : 0) : 0;

			var de_minimis = $filter('filter')($scope.de_minimis, {'id': data.de_minimis.id})[0]

			var index = $scope.de_minimis.indexOf(de_minimis);

			console.log(de_minimis, index)

			$scope.de_minimis[index].maximum_amount_per_month = data.de_minimis.maximum_amount_per_month - total;

			data.limit = $scope.de_minimis[index].maximum_amount_per_month - data.amount < 0 ? true : false;

			console.log(total, $scope.de_minimis[index].maximum_amount_per_month, data);
		}

		$scope.checkFrequency = function(data, hold){
			data.checked = data.first_cut_off || data.second_cut_off || data.third_cut_off || data.fourth_cut_off || data.on_hold ? true : false;

			$scope.checkLimit(data);
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.employeeForm.$invalid){
				angular.forEach($scope.form.employeeForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.preload();

				$scope.employee.birthdate = $scope.employee.birthdate.toLocaleDateString();
				$scope.employee.date_hired = $scope.employee.date_hired.toDateString();

				if(!$stateParams.employeeID)
				{
					Helper.post('/employee', $scope.employee)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.hris');
						})
						.error(function(){
							$scope.employee.birthdate = new Date($scope.employee.birthdate);
							$scope.employee.date_hired = new Date($scope.employee.date_hired);

							$scope.busy = false;
							$scope.error = true;
						});
				}
				else
				{
					Helper.put('/employee/' + $stateParams.employeeID, $scope.employee)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.hris');
						})
						.error(function(){
							$scope.employee.birthdate = new Date($scope.employee.birthdate);
							$scope.employee.date_hired = new Date($scope.employee.date_hired);

							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}

		$scope.init = function(){
			Helper.get('/batch')
				.success(function(data){
					$scope.batches = data;
				})

			Helper.get('/branch')
				.success(function(data){
					$scope.branches = data;
				})

			Helper.get('/cost-center')
				.success(function(data){
					$scope.cost_centers = data;
				})

			Helper.get('/position')
				.success(function(data){
					$scope.positions = data;
				})

			Helper.get('/tax-code')
				.success(function(data){
					$scope.tax_codes = data;
				})

			Helper.get('/de-minimis')
				.success(function(data){
					$scope.de_minimis = data;
				})

			var allowance_type_request = {
				'with': [
					{
						'relation': 'de_minimis',
						'withTrashed': false,
					}
				]
			}

			Helper.post('/allowance-type/enlist', allowance_type_request)
				.success(function(data){
					$scope.allowance_types = data;
				})

			var deduction_type_request = {
				'where': [
					{
						'label': 'government_deduction',
						'condition': '=',
						'value': false,
					}
				]
			}

			Helper.post('/deduction-type/enlist', deduction_type_request)
				.success(function(data){
					$scope.deduction_types = data;
				})

			Helper.get('/time-interpretation')
				.success(function(data){
					$scope.time_interpretations = data;
				})

			$scope.checkCity();
			$scope.fetchProvinces();

			var request = {};

			request.orderBy = [
				{
					'label': 'employee_number',
					'sort' : 'desc'
				}
			]

			request.first = true;
			request.withTrashed = true;

			Helper.post('/employee/enlist', request)
				.success(function(data){
					$scope.last_employee_number = data.employee_number;
				})
		}();
	}]);
hris
	.controller('hrisSubheaderController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.subheader.menu = [
			{
				'label': 'Edit',
				'icon': 'mdi-pencil',
				'show':true,
				action: function(data){
					$state.go('main.manage-employee-information', {'employeeID':data.id});
				},
			},
			{
				'label': 'Delete',
				'icon': 'mdi-delete',
				'show':true,
				action: function(data){
					var dialog = {};
					dialog.title = 'Delete';
					dialog.message = 'Delete ' + data.first_name + '?'
					dialog.ok = 'Delete';
					dialog.cancel = 'Cancel';

					Helper.confirm(dialog)
						.then(function(){
							Helper.delete('/employee/' + data.id)
								.success(function(){
									Helper.notify('Employee deleted.');
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
		]

		$scope.subheader.sort = [
			{
				'label': 'Employee Number',
				'type': 'employee_number',
				'sortReverse': false,
			},
			{
				'label': 'First Name',
				'type': 'first_name',
				'sortReverse': false,
			},
			{
				'label': 'Last Name',
				'type': 'last_name',
				'sortReverse': false,
			},
			{
				'label': 'Age',
				'type': 'age',
				'sortReverse': false,
			},
			{
				'label': 'Birthdate',
				'type': 'birthdate',
				'sortReverse': false,
			},
		]
	}]);
hris
	.controller('hrisToolbarController', ['$scope', '$filter', function($scope, $filter){
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
hris
	.controller('manageEmployeeToolbarController', ['$scope', '$filter', function($scope, $filter){
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
//# sourceMappingURL=hris.js.map
