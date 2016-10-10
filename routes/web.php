<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/


Route::get('/', 'HomeController@home');

Auth::routes();

/* Determines what type of user then returns the appropriate views*/
Route::get('/home', 'HomeController@index');

/* Resource routes */
Route::resource('allowance-type', 'AllowanceTypeController');
Route::resource('biometric', 'BiometricController');
Route::resource('branch', 'BranchController');
Route::resource('city', 'CityController');
Route::resource('company', 'CompanyController');
Route::resource('cost-center', 'CostCenterController');
Route::resource('country', 'CountryController');
Route::resource('currency', 'CurrencyController');
Route::resource('deduction-type', 'DeductionTypeController');
Route::resource('department', 'DepartmentController');
Route::resource('employee', 'EmployeeController');
Route::resource('employee-allowance-type', 'EmployeeAllowanceTypeController');
Route::resource('employee-deduction-type', 'EmployeeDeductionTypeController');
Route::resource('employee-shift-schedule', 'EmployeeShiftScheduleController');
Route::resource('group', 'GroupController');
Route::resource('group-module', 'GroupModuleController');
Route::resource('holiday', 'HolidayController');
Route::resource('house-bank', 'HouseBankController');
Route::resource('job-category', 'JobCategoryController');
Route::resource('labor-type', 'LaborTypeController');
Route::resource('module', 'ModuleController');
Route::resource('pagibig', 'PagibigController');
Route::resource('payroll', 'PayrollController');
Route::resource('payroll-period', 'PayrollPeriodController');
Route::resource('payslip', 'PayslipController');
Route::resource('philhealth', 'PhilhealthController');
Route::resource('position', 'PositionController');
Route::resource('province', 'ProvinceController');
Route::resource('sanction-level', 'SanctionLevelController');
Route::resource('sanction-type', 'SanctionTypeController');
Route::resource('shift-schedule', 'ShiftScheduleController');
Route::resource('sss', 'SSSController');
Route::resource('tax', 'TaxController');
Route::resource('tax-code', 'TaxCodeController');
Route::resource('time-interpretation', 'TimeInterpretationController');
Route::resource('user', 'UserController');

/* User Routes */
Route::group(['prefix' => 'user'], function(){
	Route::post('logout', 'UserController@logout');
	Route::post('check', 'UserController@check');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('check-password', 'UserController@checkPassword');
});

/* Company Routes */
Route::group(['prefix' => 'company'], function(){
	Route::post('enlist', 'CompanyController@enlist');
});

/* City Routes */
Route::group(['prefix' => 'city'], function(){
	Route::post('enlist', 'CityController@enlist');
});

/* Province Routes */
Route::group(['prefix' => 'province'], function(){
	Route::post('enlist', 'ProvinceController@enlist');
});

/* Branch Routes */
Route::group(['prefix' => 'branch'], function(){
	Route::post('enlist', 'BranchController@enlist');
	Route::post('check-duplicate', 'BranchController@checkDuplicate');
});

/* House Bank Routes */
Route::group(['prefix' => 'house-bank'], function(){
	Route::post('enlist', 'HouseBankController@enlist');
	Route::post('check-gl-account', 'HouseBankController@checkGLAccount');
	Route::post('check-duplicate', 'HouseBankController@checkDuplicate');
});