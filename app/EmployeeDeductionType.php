<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmployeeDeductionType extends Model
{
    protected $table = 'employee_deduction_type';

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

	public function deduction_type()
    {
    	return $this->belongsTo('App\DeductionType');
    }    
}
