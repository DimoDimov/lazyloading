'use strict';

/*
 Define our angular app
 */
window.perfTest = angular.module('perfTest', [
	'ngSanitize',
	'ui.bootstrap'
]);

// Configuration setup
perfTest.config([
	'$locationProvider',
	function ( $locationProvider ) {

		// Get rid of the #'s in URLs
		$locationProvider.html5Mode(true);

		console.log('[INIT] Framework configured.');

	}
]);

// App initialisation routine
perfTest.run([
	'$rootScope', '$location',
	function ( $rootScope, $location ) {

	}
]);

perfTest.filter('titlecase', function() {
	return function(str) {
		if (str && str.length > 0){

			// Convert snake and kebab case strings
			// (Only if no spaces found)
			var clean = str;
			if (clean.indexOf(' ') === -1){
				clean = str.replace(/[_-]/g, ' ');
			}

			// Clean spacing and capitalise 1st letter of each word
			return clean.replace(/\w\S*/g, function ( txt ) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

		} else {
			return '';
		}
	};
});

