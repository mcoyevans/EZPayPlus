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