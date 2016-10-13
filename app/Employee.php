<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    public function allowance_types()
    {
    	return $this->belongsToMany('App\AllowanceType', 'employee_allowance_type');
    }

    public function deduction_types()
    {
        return $this->belongsToMany('App\AllowanceType', 'employee_deduction_type');
    }

    public function shift_schedules()
    {
    	return $this->belongsToMany('App\ShiftSchedule');
    }

    public function deployments()
    {
    	return $this->hasMany('App\Deployment')
    }

    public function tax_code()
    {
        return $this->belongsTo('App\TaxCode');
    }
}
