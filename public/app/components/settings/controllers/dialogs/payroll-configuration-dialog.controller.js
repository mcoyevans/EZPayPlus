settings
	.controller('payrollConfigurationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll = {};

		$scope.pay_frequencies = ['Weekly', 'Semi-monthly', 'Monthly'];

		if($scope.config.action == 'create')
		{
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