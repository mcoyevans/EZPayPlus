hris
	.controller('manageEmployeeContentContainerController', ['$scope', '$stateParams', '$mdMedia', 'Helper', function($scope, $stateParams, $mdMedia, Helper){
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

			$scope.employee.date_started = new Date();

			$scope.calculateAge(new Date());
		}

		$scope.today = new Date();

		$scope.civil_status = ['Single', 'Married', 'Widowed'];
		$scope.employment_status = ['Probationary', 'Project Based', 'Regular'];

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
		
		$scope.formatPagIBIG = function(){
			if($scope.employeeForm.PagIBIG.$valid)
			{
				var first = $scope.pagibig.slice(0,4);
				var second = $scope.pagibig.slice(4,8);
				var third = $scope.pagibig.slice(8,12);

				$scope.employee.pagibig = first + '-' + second + '-' + third;
			}
		}

		$scope.formatPhilHealth = function(){
			if($scope.employeeForm.PhilHealth.$valid)
			{
				var first = $scope.philhealth.slice(0,2);
				var second = $scope.philhealth.slice(2,11);
				var third = $scope.philhealth.slice(11,12);

				$scope.employee.philhealth = first + '-' + second + '-' + third;
			}
		}

		$scope.formatSSS = function(){
			if($scope.employeeForm.SSS.$valid)
			{
				var first = $scope.sss.slice(0,2);
				var second = $scope.sss.slice(2,9);
				var third = $scope.sss.slice(9,10);

				$scope.employee.sss = first + '-' + second + '-' + third;
			}
		}	

		$scope.formatTIN = function(){
			if($scope.employeeForm.TIN.$valid)
			{
				var first = $scope.tin.slice(0,3);
				var second = $scope.tin.slice(3,6);
				var third = $scope.tin.slice(6,9);

				$scope.employee.tin = first + '-' + second + '-' + third;
			}
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

				if(!$stateParams.employeeID)
				{
					Helper.post('/employee', $scope.model)
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
				else
				{
					Helper.put('/employee/' + $scope.config.id, $scope.model)
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