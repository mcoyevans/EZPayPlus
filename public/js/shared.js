var sharedModule = angular.module('sharedModule', [
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
	'chart.js',
	'angularMoment',
	'angularFileUpload'
]);
sharedModule
	.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function($urlRouterProvider, $stateProvider, $mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.accentPalette('pink')
		
		/* Dark Theme - Blue */
		$mdThemingProvider.theme('dark', 'default')
	      	.primaryPalette('blue')
			.dark();

		$urlRouterProvider
			.otherwise('/page-not-found')
			.when('', '/');

		$stateProvider
			.state('page-not-found',{
				url: '/page-not-found',
				templateUrl: '/app/shared/views/page-not-found.view.html',
			})
	}]);
sharedModule
	.service('Helper', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;

		return {
			prompt: function(data)
			{
				var prompt = $mdDialog.prompt()
			    	.title(data.title)
			      	.textContent(data.message)
			      	.placeholder(data.placeholder)
			      	.ariaLabel(data.title)
			      	.ok(data.ok)
			      	.cancel(data.cancel);

			    return $mdDialog.show(prompt);
			},
			confirm: function(data)
			{
				var confirm = $mdDialog.confirm()
			        .title(data.title)
			        .textContent(data.message)
			        .ariaLabel(data.title)
			        .ok(data.ok)
			        .cancel(data.cancel);

			    return $mdDialog.show(confirm);
			},
			alert: function(title, message){
				$mdDialog.show(
					$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title(title)
				        .textContent(message)
				        .ariaLabel(title)
				        .ok('Got it!')
				    );
			},
			notify: function(message) {
				var toast = $mdToast.simple()
			      	.textContent(message)
			      	.position('bottom right')
			      	.hideDelay(3000);

			    var audio = new Audio('/audio/notif.mp3')
			    audio.play();
			    
			    return $mdToast.show(toast);
			},
			/* Starts the preloader */
			preload: function(){
				return $mdDialog.show({
					templateUrl: '/app/shared/templates/loading.template.html',
				    parent: angular.element(document.body),
				});
			},
			/* Stops the preloader */
			stop: function(data){
				return $mdDialog.hide(data);
			},
			cancel: function(){
				return $mdDialog.cancel();
			},
			/* Shows error message if AJAX failed */
			error: function(){
				return $mdDialog.show(
			    	$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title('Oops! Something went wrong!')
				        .content('An error occured. Please contact administrator for assistance.')
				        .ariaLabel('Error Message')
				        .ok('Got it!')
				);
			},
			/* Send temporary data for retrival */
			set: function(data){
				dataHolder = data;
			},
			/* Retrieves data */
			get: function(){
				return dataHolder;
			},
			checkDuplicate: function(urlBase, data){
				return $http.post(urlBase + '/check-duplicate', data);
			},
			get: function(url){
				return $http.get(url);
			},
			post: function(url, data){
				return $http.post(url, data);
			},
			update: function(url, data){
				return $http.put(url, data);
			},
			delete: function(url){
				return $http.delete(url);
			},
		};
	}]);
sharedModule
	.controller('changePasswordDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.password = {};

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkPassword = function(){
			Helper.post('/user/check-password', $scope.password)
				.success(function(data){
					$scope.match = data;
					$scope.show = true;
				});
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.changePasswordForm.$invalid){
				angular.forEach($scope.changePasswordForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.password.old == $scope.password.new || $scope.password.new != $scope.password.confirm)
			{
				return;
			}
			else {
				$scope.busy = true;
				Helper.post('/user/change-password', $scope.password)
					.success(function(){
						Helper.stop();
					})
					.error(function(){
						Helper.error();
					});
			}
		}
	}]);
//# sourceMappingURL=shared.js.map
