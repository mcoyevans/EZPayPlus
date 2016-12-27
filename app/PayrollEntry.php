<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntry extends Model
{
    protected $casts = [
        'regular_working_hours' => 'float',
        'night_differential' => 'float',
        'overtime' => 'float',
        'overtime_night_differential' => 'float',
        'rest_day' => 'float',
        'rest_day_night_differential' => 'float',
        'rest_day_overtime' => 'float',
        'rest_day_overtime_night_differential' => 'float',

        'special_holiday' => 'float',
        'special_holiday_night_differential' => 'float',
        'special_holiday_overtime' => 'float',
        'special_holiday_overtime_night_differential' => 'float',
        'special_holiday_rest_day' => 'float',
        'special_holiday_rest_day_night_differential' => 'float',
        'special_holiday_rest_day_overtime' => 'float',
        'special_holiday_rest_day_overtime_night_differential' => 'float',

        'regular_holiday' => 'float',
        'regular_holiday_night_differential' => 'float',
        'regular_holiday_overtime' => 'float',
        'regular_holiday_overtime_night_differential' => 'float',
        'regular_holiday_rest_day' => 'float',
        'regular_holiday_rest_day_night_differential' => 'float',
        'regular_holiday_rest_day_overtime' => 'float',
        'regular_holiday_rest_day_overtime_night_differential' => 'float'
    ];

    public function payroll_process()
    {
    	return $this->belongsTo('App\PayrollProcess');
    }

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function allowances()
    {
    	return $this->belongsToMany('App\PayrollEntryAllowance', 'payroll_entry_allowances');
    }

    public function deductions()
    {
        return $this->belongsToMany('App\PayrollEntryDeduction', 'payroll_entry_deductions');
    }

    public function government_contributions()
    {
        return $this->belongsToMany('App\PayrollEntryGovernmentContribution', 'payroll_entry_government_contributions');
    }
}
