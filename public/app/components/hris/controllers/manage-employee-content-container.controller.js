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