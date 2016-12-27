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