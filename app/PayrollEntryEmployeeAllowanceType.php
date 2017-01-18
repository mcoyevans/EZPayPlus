<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntryEmployeeAllowanceType extends Model
{
	protected $table = 'payroll_entry_employee_allowance_type';

    public function payroll_entry()
    {
    	return $this->belongsTo('App\PayrollEntry');
    }

    public function employee_allowance_type()
    {
    	return $this->belongsTo('App\EmployeeAllowanceType');
    }
}
