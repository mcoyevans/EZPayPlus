<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmployeeAllowance extends Model
{
	protected $table = 'employee_allowance';

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function allowance()
    {
    	return $this->belongsTo('App\Allowance');
    }
}
