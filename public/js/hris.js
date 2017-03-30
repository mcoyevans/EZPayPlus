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

		$scope.view = function(data){
			Helper.set(data);

			var dialog = {
				'template': '/app/components/hris/templates/dialogs/employee-information-dialog.template.html',
				'controller': 'employeeInformationDialogController',
				'fullscreen': true
			}

			Helper.customDialog(dialog)
				.then(function(data){
					var confirm = {}

					confirm.title = 'Delete';
					confirm.message = 'Are you sure you want to delete this employee?';
					confirm.ok = 'Delete';
					confirm.cancel = 'Cancel';

					if(data){
						Helper.confirm(confirm)
							.then(function(){
								Helper.preload();
								Helper.delete('/employee/' + data)
									.success(function(){
										Helper.stop();
										$scope.refresh();
										Helper.notify('Employee deleted.')
									})
									.error(function(){
										Helper.error();
									})
							})
					}
				});
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
							// pushItem(item);
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
									// pushItem(item);
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
	.controller('manageEmployeeContentContainerController', ['$scope', '$filter', '$state', '$stateParams', '$mdMedia', 'Helper', function($scope, $filter, $state, $stateParams, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		$scope.form = {}

		$scope.employee = {};

		$scope.employee.allowance_types = [];
		$scope.employee.deduction_types = [];
		$scope.employee.minimum_wage_earner = false;

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

		$scope.today = new Date();

		$scope.civil_status = ['Single', 'Married', 'Widowed'];
		$scope.employment_status = ['Probationary', 'Project Based', 'Regular'];

		$scope.checkDuplicate = function(){
			Helper.post('/employee/check-duplicate', $scope.employee)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkDuplicate();
						})
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
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkCity();
						})
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.employee)
				.success(function(data){
					$scope.provinces = data;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.fetchProvinces();
						})
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
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkProvince();
						})
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

		$scope.addEarnings = function(){
			$scope.employee.allowance_types.push({});
		}

		$scope.addDeductions = function(){
			$scope.employee.deduction_types.push({});
		}

		$scope.removeEarnings = function(item){
			var index = $scope.employee.allowance_types.indexOf(item);

			if(item.de_minimis)
			{
				var de_minimis = $filter('filter')($scope.de_minimis, {'id': item.de_minimis.id})[0];

				var de_minimis_index = $scope.de_minimis.indexOf(de_minimis);

				$scope.de_minimis[de_minimis_index].balance = $scope.de_minimis[de_minimis_index].balance + (item.first_cut_off ? item.amount : 0) + (item.second_cut_off ? item.amount : 0) + (item.third_cut_off ? item.amount : 0) + (item.fourth_cut_off ? item.amount : 0);

				if($scope.de_minimis[de_minimis_index].balance)
				{
					var allowance_type = $filter('filter')($scope.allowance_types, {'id': item.allowance_type_id})[0];

					var allowance_type_index = $scope.allowance_types.indexOf(allowance_type);

					$scope.allowance_types[allowance_type_index].maxed_out = false;
				}
			}


			$scope.employee.allowance_types.splice(index, 1);
		}

		$scope.removeDeduction = function(item){
			var index = $scope.employee.deduction_types.indexOf(item);

			$scope.employee.deduction_types.splice(index, 1);
		}

		$scope.checkDeduction = function(data, edit){
			var siblings = $filter('filter')($scope.employee.deduction_types, {'deduction_type_id': data.deduction_type_id});

			if(!edit){
				angular.forEach(siblings, function(item){
					data.first_cut_off_checked = item.first_cut_off ? item.first_cut_off : data.first_cut_off_checked;
					data.second_cut_off_checked = item.second_cut_off ? item.second_cut_off : data.second_cut_off_checked;
					data.third_cut_off_checked = item.third_cut_off ? item.third_cut_off : data.third_cut_off_checked;
					data.fourth_cut_off_checked = item.fourth_cut_off ? item.fourth_cut_off : data.fourth_cut_off_checked;
				});
			}
		}

		// check the maximum amount you can still input
		// check for siblings that used the same allowance type
		$scope.checkDeMinimis = function(data, edit){
			console.log($scope.allowance_types);
			var allowance_type = $filter('filter')($scope.allowance_types, {'id': data.allowance_type_id})[0];

			data.de_minimis = allowance_type.de_minimis_id ? allowance_type.de_minimis : null;

			data.max = allowance_type.de_minimis_id ? $filter('filter')($scope.de_minimis, {'id': allowance_type.de_minimis_id})[0].balance : null;

			var siblings = $filter('filter')($scope.employee.allowance_types, {'allowance_type_id': data.allowance_type_id});

			if(!edit){
				angular.forEach(siblings, function(item){
					data.first_cut_off_checked = item.first_cut_off ? item.first_cut_off : data.first_cut_off_checked;
					data.second_cut_off_checked = item.second_cut_off ? item.second_cut_off : data.second_cut_off_checked;
					data.third_cut_off_checked = item.third_cut_off ? item.third_cut_off : data.third_cut_off_checked;
					data.fourth_cut_off_checked = item.fourth_cut_off ? item.fourth_cut_off : data.fourth_cut_off_checked;
				});
			}
		}

		// check the limit of the allowance type and make it not exceed the balance for the de minimis
		$scope.checkLimit = function(data, cut_off){
			var de_minimis = $filter('filter')($scope.de_minimis, {'id': data.de_minimis.id})[0];

			var index = $scope.de_minimis.indexOf(de_minimis);

			if(typeof cut_off !== 'undefined')
			{
				$scope.de_minimis[index].balance = cut_off ? $scope.de_minimis[index].balance - data.amount : $scope.de_minimis[index].balance + data.amount;
			}

			data.limit = $scope.de_minimis[index].balance - data.amount < 0 ? true : false;

			if($scope.de_minimis[index].balance <= 0)
			{
				var allowance_type = $filter('filter')($scope.allowance_types, {'id': data.allowance_type_id})[0];

				var allowance_type_index = $scope.allowance_types.indexOf(allowance_type);

				$scope.allowance_types[allowance_type_index].maxed_out = true;
			}
		}

		$scope.checkFrequency = function(data, cut_off){
			data.checked = data.first_cut_off || data.second_cut_off || data.third_cut_off || data.fourth_cut_off || data.on_hold ? true : false;

			$scope.checkLimit(data, cut_off);
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


				Helper.alert('Oops!', 'Kindly check form for errors.');

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				var allowance_unchecked = false;

				angular.forEach($scope.employee.allowance_types, function(item, key){
					if(!item.first_cut_off && !item.second_cut_off && !item.third_cut_off && !item.fourth_cut_off && !item.on_hold && item.allowance_type_id)
					{
						allowance_unchecked = true;
					}
				});

				var deduction_unchecked = false;

				angular.forEach($scope.employee.deduction_types, function(item, key){
					if(!item.first_cut_off && !item.second_cut_off && !item.third_cut_off && !item.fourth_cut_off && !item.on_hold && item.deduction_type_id)
					{
						deduction_unchecked = true;
					}
				});

				if(deduction_unchecked || allowance_unchecked)
				{
					Helper.alert('Oops!', 'Kindly check allowances or deductions for errors.')

					return;
				}

				Helper.preload();

				var date_back_up = {};

				date_back_up.birthdate = new Date($scope.employee.birthdate);
				date_back_up.date_hired = new Date($scope.employee.date_hired);

				$scope.employee.birthdate = $scope.employee.birthdate.toDateString();
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
							$scope.employee.birthdate = new Date(date_back_up.birthdate);
							$scope.employee.date_hired = new Date(date_back_up.date_hired);

							$scope.busy = false;
							$scope.error = true;

							Helper.error();
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
							$scope.employee.birthdate = date_back_up.birthdate;
							$scope.employee.date_hired = date_back_up.date_hired;

							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
			}
		}

		$scope.test = function(){
			$scope.employee.employee_number = 10071128;
			$scope.employee.first_name = 'Marco Chrisitan';
			$scope.employee.middle_name = 'Santillan';
			$scope.employee.last_name = 'Paco';
			$scope.employee.birthdate = new Date('12/30/1993');
			$scope.employee.age = 22;
			$scope.employee.civil_status = 'Single';
			$scope.employee.batch_id = 1;
			$scope.employee.branch_id = 1;
			$scope.employee.cost_center_id = 1;
			$scope.employee.position_id = 1;
			$scope.employee.employment_status = 'Regular';
			$scope.employee.date_hired = new Date('07/29/2015');
			$scope.employee.street_address = 'B3 L8 Terry Town Subdivision';
			$scope.employee.city = 'Santa Rosa City';
			$scope.employee.province_id = 40;
			$scope.employee.postal_code = 4026;
			$scope.employee.email = 'marcopaco1230@gmail.com';
			$scope.employee.mobile_number = '09364589106';
			$scope.employee.telephone_number = '(049) 543-1704';
			$scope.employee.tax_code_id = 2;
			$scope.tin = '012345678';
			$scope.sss = '0123456789';
			$scope.pagibig = '012345678901';
			$scope.philhealth = '012345678901';

			$scope.checkCity();
			$scope.fetchProvinces();

			$scope.employee.tin = '012-345-678';
			$scope.employee.sss = '01-2345678-9';
			$scope.employee.pagibig = '0123-4567-8901';
			$scope.employee.philhealth = '01-234567890-1';
			$scope.employee.time_interpretation_id = 2;
			$scope.employee.basic_salary = 14000;
			$scope.employee.allowance_types = [
				{
					'allowance_type_id': 1,
					'amount': 100,
					'first_cut_off': 1,
					'second_cut_off': 1,
				}
			]

			$scope.checkDeMinimis($scope.employee.allowance_types[0], true);
			$scope.checkFrequency($scope.employee.allowance_types[0], 1);
			$scope.checkFrequency($scope.employee.allowance_types[0], 1);
			
			$scope.employee.deduction_types = [
				{
					'deduction_type_id': 5,
					'amount': 100,
					'first_cut_off': 1,
					'second_cut_off': 1,
				}
			]
		}

		$scope.init = function(){
			var batches = function(){
				Helper.get('/batch')
					.success(function(data){
						$scope.batches = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								batches();
							})
					});
			}

			var branches = function(){
				Helper.get('/branch')
					.success(function(data){
						$scope.branches = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								branches();
							})
					});
			}

			var costCenters = function(){
				Helper.get('/cost-center')
					.success(function(data){
						$scope.cost_centers = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								costCenters();
							})
					});
			}

			var positions = function(){
				Helper.get('/position')
					.success(function(data){
						$scope.positions = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								positions();
							})
					});
			}

			var taxCodes = function(){
				Helper.get('/tax-code')
					.success(function(data){
						$scope.tax_codes = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								taxCodes();
							})
					});
			}

			var deMinimis = function()
			{
				Helper.get('/de-minimis')
					.success(function(data){
						$scope.de_minimis = data;
						angular.forEach($scope.de_minimis, function(item){
							item.balance = item.maximum_amount_per_month;
						});
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								deMinimis();
							})
					});

			}

			var allowanceTypes = function(){
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
						$scope.employee_fetch();
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								allowanceTypes();
							})
					});
			}

			var deductionTypes = function(){
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
					.error(function(){
						Helper.failed()
							.then(function(){
								deductionTypes();
							})
					});
			}

			var timeInterpretations = function(){
				Helper.get('/time-interpretation')
					.success(function(data){
						$scope.time_interpretations = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								timeInterpretations();
							})
					});
			}

			var request = {};

			request.orderBy = [
				{
					'label': 'created_at',
					'sort' : 'desc'
				}
			]

			request.first = true;
			request.withTrashed = true;

			var lastEmployee = function(){
				Helper.post('/employee/enlist', request)
					.success(function(data){
						$scope.last_employee_number = data.employee_number;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								lastEmployee();
							})
					});
			}

			if($stateParams.employeeID)
			{
				var request = {}

				request.with = [
					{
						'relation': 'allowance_types',
						'withTrashed': false,
					},
					{
						'relation': 'deduction_types',
						'withTrashed': false,
					},
					{
						'relation': 'batch',
						'withTrashed': true,
					},
					{
						'relation': 'branch',
						'withTrashed': true,
					},
					{
						'relation': 'cost_center',
						'withTrashed': true,
					},
					{
						'relation': 'position',
						'withTrashed': true,
					},
					{
						'relation': 'city',
						'withTrashed': false,
					},
					{
						'relation': 'province',
						'withTrashed': false,
					},
					{
						'relation': 'tax_code',
						'withTrashed': false,
					},
					{
						'relation': 'time_interpretation',
						'withTrashed': false,
					},
				]

				request.where = [
					{
						'label': 'id',
						'condition': '=',
						'value': $stateParams.employeeID,
					},
				]

				request.withTrashed = true;

				request.first = true;

				$scope.employee_fetch = function(){
					Helper.post('/employee/enlist', request)
						.success(function(data){
							$scope.employee = data;
							$scope.employee.birthdate = new Date(data.birthdate);
							$scope.employee.date_hired = new Date(data.date_hired);
							$scope.employee.city = data.city.name;
							$scope.employee.province = data.province.name;

							$scope.checkCity();
							$scope.fetchProvinces();

							$scope.tin = data.tin.replace(/-/g, '');
							$scope.sss = data.sss.replace(/-/g, '');
							$scope.pagibig = data.pagibig.replace(/-/g, '');
							$scope.philhealth = data.philhealth.replace(/-/g, '');

							angular.forEach($scope.employee.allowance_types, function(item, key){
								$scope.employee.allowance_types[key] = item.pivot;
								$scope.checkDeMinimis($scope.employee.allowance_types[key], true);

								if($scope.employee.allowance_types[key].first_cut_off){
									$scope.checkFrequency($scope.employee.allowance_types[key], 1)
								}

								if($scope.employee.allowance_types[key].second_cut_off){
									$scope.checkFrequency($scope.employee.allowance_types[key], 1)
								}

								if($scope.employee.allowance_types[key].third_cut_off){
									$scope.checkFrequency($scope.employee.allowance_types[key], 1)
								}

								if($scope.employee.allowance_types[key].fourth_cut_off){
									$scope.checkFrequency($scope.employee.allowance_types[key], 1)
								}
							})

							angular.forEach($scope.employee.deduction_types, function(item, key){
								$scope.employee.deduction_types[key] = item.pivot;
							})

							$scope.toolbar.childState = data.last_name + ', ' + data.first_name;

							$scope.show = true;
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									$scope.employee_fetch();
								});
						});
				}
			}
			else{
				$scope.toolbar.childState = 'Employee';

				$scope.employee.sex = 'Male';

				$scope.employee.date_hired = new Date();

				$scope.calculateAge(new Date());
				$scope.show = true;
			}

			batches();
			branches();
			costCenters();
			positions();
			taxCodes();
			deMinimis();
			allowanceTypes();
			deductionTypes();
			timeInterpretations();
			lastEmployee();
		}();
	}]);
hris
	.controller('employeeInformationDialogController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var employee = Helper.fetch();

		var request = {}

		request.with = [
			{
				'relation': 'allowance_types',
				'withTrashed': false,
			},
			{
				'relation': 'deduction_types',
				'withTrashed': false,
			},
			{
				'relation': 'batch',
				'withTrashed': true,
			},
			{
				'relation': 'branch',
				'withTrashed': true,
			},
			{
				'relation': 'cost_center',
				'withTrashed': true,
			},
			{
				'relation': 'position',
				'withTrashed': true,
			},
			{
				'relation': 'city',
				'withTrashed': false,
			},
			{
				'relation': 'province',
				'withTrashed': false,
			},
			{
				'relation': 'tax_code',
				'withTrashed': false,
			},
			{
				'relation': 'time_interpretation',
				'withTrashed': false,
			},
		]

		request.where = [
			{
				'label':'id',
				'condition': '=',
				'value': employee.id,
			}
		]

		request.withTrashed = true;

		request.first = true;

		Helper.post('/employee/enlist', request)
			.success(function(data){
				$scope.employee = data;
				$scope.employee.birthdate = new Date(data.birthdate);
				$scope.employee.date_hired = new Date(data.date_hired);
			})
			.error(function(){
				Helper.error();
			});

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.edit = function(){
			Helper.cancel();
			$state.go('main.manage-employee', {'employeeID':$scope.employee.id});
		}

		$scope.delete = function(){
			Helper.stop($scope.employee.id);
		}		
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
//# sourceMappingURL=hris.js.map
