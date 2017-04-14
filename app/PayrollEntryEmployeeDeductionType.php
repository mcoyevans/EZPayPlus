<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntryEmployeeDeductionType extends Model
{
	protected $table = 'payroll_entry_employee_deduction_type';

    public function payroll_entry()
    {
    	return $this->belongsTo('App\PayrollEntry');
    }

    public function employee_deduction_type()
    {
    	return $this->belongsTo('App\EmployeeDeductionType');
    }
}
