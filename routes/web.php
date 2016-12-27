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
Route::resource('batch', 'BatchController');
Route::resource('branch', 'BranchController');
Route::resource('branch-holiday', 'BranchHolidayController');
Route::resource('city', 'CityController');
Route::resource('company', 'CompanyController');
Route::resource('cost-center', 'CostCenterController');
Route::resource('cost-center-holiday', 'CostCenterHolidayController');
Route::resource('country', 'CountryController');
Route::resource('currency', 'CurrencyController');
Route::resource('deduction-type', 'DeductionTypeController');
Route::resource('department', 'DepartmentController');
Route::resource('de-minimis', 'DeMinimisController');
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
Route::resource('leave-type', 'LeaveTypeController');
Route::resource('module', 'ModuleController');
Route::resource('pagibig', 'PagibigController');
Route::resource('payroll', 'PayrollController');
Route::resource('payroll-period', 'PayrollPeriodController');
Route::resource('payroll-process', 'PayrollProcessController');
Route::resource('payroll-entry', 'PayrollEntryController');
Route::resource('payroll-entry-allowance', 'PayrollEntryAllowanceController');
Route::resource('payroll-entry-deduction', 'PayrollEntryDeductionController');
Route::resource('payroll-entry-government-contribution', 'PayrollEntryGovernmentContributionController');
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
	Route::post('check', 'UserController@check');
	Route::post('check-email', 'UserController@checkEmail');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('check-password', 'UserController@checkPassword');
	Route::post('enlist', 'UserController@enlist');
	Route::post('logout', 'UserController@logout');
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

/* Cost Center Routes */
Route::group(['prefix' => 'cost-center'], function(){
	Route::post('enlist', 'CostCenterController@enlist');
	Route::post('check-duplicate', 'CostCenterController@checkDuplicate');
});

/* House Bank Routes */
Route::group(['prefix' => 'house-bank'], function(){
	Route::post('enlist', 'HouseBankController@enlist');
	Route::post('check-duplicate', 'HouseBankController@checkDuplicate');
});

/* Group Routes */
Route::group(['prefix' => 'group'], function(){
	Route::post('enlist', 'GroupController@enlist');
	Route::post('check-duplicate', 'GroupController@checkDuplicate');
});

/* Group Routes */
Route::group(['prefix' => 'group-module'], function(){
	Route::post('enlist', 'GroupModuleController@enlist');
	Route::post('check-duplicate', 'GroupModuleController@checkDuplicate');
});

/* Department Routes */
Route::group(['prefix' => 'department'], function(){
	Route::post('enlist', 'DepartmentController@enlist');
	Route::post('check-duplicate', 'DepartmentController@checkDuplicate');
});

/* Job Category Routes */
Route::group(['prefix' => 'job-category'], function(){
	Route::post('enlist', 'JobCategoryController@enlist');
	Route::post('check-duplicate', 'JobCategoryController@checkDuplicate');
});

/* Labor Type Routes */
Route::group(['prefix' => 'labor-type'], function(){
	Route::post('enlist', 'LaborTypeController@enlist');
	Route::post('check-duplicate', 'LaborTypeController@checkDuplicate');
});

/* Leave Type Routes */
Route::group(['prefix' => 'leave-type'], function(){
	Route::post('enlist', 'LeaveTypeController@enlist');
	Route::post('check-duplicate', 'LeaveTypeController@checkDuplicate');
});

/* Position Routes */
Route::group(['prefix' => 'position'], function(){
	Route::post('enlist', 'PositionController@enlist');
	Route::post('check-duplicate', 'PositionController@checkDuplicate');
});

/* Deduction Type Routes */
Route::group(['prefix' => 'deduction-type'], function(){
	Route::post('enlist', 'DeductionTypeController@enlist');
	Route::post('check-duplicate', 'DeductionTypeController@checkDuplicate');
});

/* Allowance Type Routes */
Route::group(['prefix' => 'allowance-type'], function(){
	Route::post('enlist', 'AllowanceTypeController@enlist');
	Route::post('check-duplicate', 'AllowanceTypeController@checkDuplicate');
});

/* Sanction Type Routes */
Route::group(['prefix' => 'sanction-type'], function(){
	Route::post('enlist', 'SanctionTypeController@enlist');
	Route::post('check-duplicate', 'SanctionTypeController@checkDuplicate');
});

/* Sanction Level Routes */
Route::group(['prefix' => 'sanction-level'], function(){
	Route::post('enlist', 'SanctionLevelController@enlist');
	Route::post('check-duplicate', 'SanctionLevelController@checkDuplicate');
});

/* Shift Schedule Routes */
Route::group(['prefix' => 'shift-schedule'], function(){
	Route::post('enlist', 'ShiftScheduleController@enlist');
	Route::post('check-duplicate', 'ShiftScheduleController@checkDuplicate');
});

/* Biometrics Routes */
Route::group(['prefix' => 'biometric'], function(){
	Route::post('enlist', 'BiometricController@enlist');
	Route::post('check-duplicate', 'BiometricController@checkDuplicate');
});

/* Time Interpretation Routes */
Route::group(['prefix' => 'time-interpretation'], function(){
	Route::post('enlist', 'TimeInterpretationController@enlist');
	Route::post('check-duplicate', 'TimeInterpretationController@checkDuplicate');
});

/* Tax Routes */
Route::group(['prefix' => 'tax'], function(){
	Route::post('enlist', 'TaxController@enlist');
});

/* SSS Routes */
Route::group(['prefix' => 'sss'], function(){
	Route::post('enlist', 'SSSController@enlist');
});

/* Pagibig Routes */
Route::group(['prefix' => 'pagibig'], function(){
	Route::post('enlist', 'PagibigController@enlist');
});

/* Philhealth Routes */
Route::group(['prefix' => 'philhealth'], function(){
	Route::post('enlist', 'PhilhealthController@enlist');
});

/* Batch Routes */
Route::group(['prefix' => 'batch'], function(){
	Route::post('enlist', 'BatchController@enlist');
	Route::post('check-duplicate', 'BatchController@checkDuplicate');
});

/* Employee */
Route::group(['prefix' => 'employee'], function(){
	Route::post('enlist', 'EmployeeController@enlist');
	Route::post('check-duplicate', 'EmployeeController@checkDuplicate');
});

/* Payroll */
Route::group(['prefix' => 'payroll'], function(){
	Route::post('enlist', 'PayrollController@enlist');
	Route::post('check-duplicate', 'PayrollController@checkDuplicate');
});

/* Payroll Period */
Route::group(['prefix' => 'payroll-period'], function(){
	Route::post('enlist', 'PayrollPeriodController@enlist');
	Route::post('check-duplicate', 'PayrollPeriodController@checkDuplicate');
});

/* Holiday */
Route::group(['prefix' => 'holiday'], function(){
	Route::post('enlist', 'HolidayController@enlist');
	Route::post('check-duplicate', 'HolidayController@checkDuplicate');
});

/* Branch Holiday */
Route::group(['prefix' => 'branch-holiday'], function(){
	Route::post('enlist', 'BranchHolidayController@enlist');
	Route::post('check-duplicate', 'BranchHolidayController@checkDuplicate');
});

/* Cost Center Holiday */
Route::group(['prefix' => 'cost-center-holiday'], function(){
	Route::post('enlist', 'CostCenterHolidayController@enlist');
	Route::post('check-duplicate', 'CostCenterHolidayController@checkDuplicate');
});

/* Payroll Process Holiday */
Route::group(['prefix' => 'payroll-process'], function(){
	Route::post('enlist', 'PayrollProcessController@enlist');
	Route::post('check-duplicate', 'PayrollProcessController@checkDuplicate');
});