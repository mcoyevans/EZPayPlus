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
			$scope.holiday.date = $scope.holiday.date.toLocaleDateString();

			Helper.post('/holiday/check-duplicate', $scope.holiday)
				.success(function(data){
					$scope.duplicate = data;

					$scope.holiday.date = new Date($scope.holiday.date);
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

				$scope.holiday.date = $scope.holiday.date.toLocaleDateString();

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

							$scope.holiday.date = new Date($scope.holiday.date);
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

							$scope.holiday.date = new Date($scope.holiday.date);
						});
				}
			}
		}
	}]);