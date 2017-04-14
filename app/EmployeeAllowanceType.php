<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmployeeAllowanceType extends Model
{
	protected $table = 'employee_allowance_type';

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function allowance_type()
    {
    	return $this->belongsTo('App\AllowanceType');
    }

    public function payroll_entries()
    {
    	return $this->belongsToMany('App\PayrollEntryAllowance', 'payroll_entry_employee_allowance_type');
    }
}
