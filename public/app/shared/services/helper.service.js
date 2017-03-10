sharedModule
	.service('Helper', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;
		var user = null;

		var error_dialog = {
			'title': 'Aw Snap!',
			'message': 'An error occured on the server.',
			'ok': 'Try Again'
		}

		return {
			cancel: function(){
				$mdDialog.cancel();
			},
			customDialog: function(data){
				return $mdDialog.show({
			      	controller: data.controller,
			      	templateUrl: data.template,
			      	parent: angular.element(document.body),
			      	fullscreen: data.fullscreen,
			    });
			},
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
			failed(){
			 	return this.confirm(error_dialog);
			},
			/* Send temporary data for retrival */
			set: function(data){
				dataHolder = data;
			},
			/* Retrieves data */
			fetch: function(){
				return dataHolder;
			},
			setAuthUser: function(data){
				user = data;
			},
			authUser: function(data){
				return user;
			},
			get: function(url){
				return $http.get(url);
			},
			post: function(url, data){
				return $http.post(url, data);
			},
			put: function(url, data){
				return $http.put(url, data);
			},
			delete: function(url){
				return $http.delete(url);
			},
		};
	}]);