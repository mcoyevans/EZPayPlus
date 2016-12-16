<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function allowance_types()
    {
    	return $this->belongsToMany('App\AllowanceType', 'employee_allowance_type')->withPivot('amount', 'first_cut_off', 'second_cut_off', 'third_cut_off', 'fourth_cut_off', 'on_hold');
    }

    public function deduction_types()
    {
        return $this->belongsToMany('App\DeductionType', 'employee_deduction_type')->withPivot('amount', 'first_cut_off', 'second_cut_off', 'third_cut_off', 'fourth_cut_off', 'on_hold');
    }

    // public function shift_schedules()
    // {
    // 	return $this->belongsToMany('App\ShiftSchedule');
    // }

    // public function deployments()
    // {
    // 	return $this->hasMany('App\Deployment');
    // }

    public function branch()
    {
        return $this->belongsTo('App\Branch');
    }

    public function cost_center()
    {
        return $this->belongsTo('App\CostCenter');
    }

    public function position()
    {
        return $this->belongsTo('App\Position');
    }

    public function batch()
    {
        return $this->belongsTo('App\Batch');
    }

    public function tax_code()
    {
        return $this->belongsTo('App\TaxCode');
    }

    public function city()
    {
        return $this->belongsTo('App\City');
    }

    public function province()
    {
        return $this->belongsTo('App\Province');
    }

    public function time_interpretation()
    {
        return $this->belongsTo('App\TimeInterpretation');
    }
}
