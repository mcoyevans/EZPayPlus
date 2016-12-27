<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntryAllowance extends Model
{
    public function payroll_entry()
    {
    	return $this->belongsTo('App\PayrollEntry');
    }

    public function employee_allowance_type()
    {
    	return $this->belongsTo('App\EmployeeAllowanceType');
    }
}
