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

    public function allowance()
    {
    	return $this->belongsTo('App\AllowanceType');
    }
}
