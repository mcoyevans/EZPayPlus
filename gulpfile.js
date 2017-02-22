const elixir = require('laravel-elixir');

require('laravel-elixir-vue');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix
    	/* App Sass Bootstrap */
    	.sass('app.scss')

    	/* Vendor CSS */
		.styles('vendor/*.css', 'public/css/vendor.css')
    	
    	/* Vendor Scripts */
    	.scriptsIn('public/libraries', 'public/js/vendor.js')
    	
    	/* Application Sass */
    	.sass('app/app.scss', 'public/css/application.css')

        /* Shared Scripts */
        .scriptsIn('public/app/shared', 'public/js/shared.js')

        /* App Scripts */
        .scriptsIn('public/app/components/app', 'public/js/app.js')

        /* HRIS Scripts */
        .scriptsIn('public/app/components/hris', 'public/js/hris.js')

        /* Payroll Scripts */
        .scriptsIn('public/app/components/payroll', 'public/js/payroll.js')

        /* HRIS Scripts */
        .scriptsIn('public/app/components/bookkeeping', 'public/js/bookkeeping.js')

        /* Timekeeping Scripts */
        .scriptsIn('public/app/components/timekeeping', 'public/js/timekeeping.js')

        /* Settings Scripts */
        .scriptsIn('public/app/components/settings', 'public/js/settings.js')
});
