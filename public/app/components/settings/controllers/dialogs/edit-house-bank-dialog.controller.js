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