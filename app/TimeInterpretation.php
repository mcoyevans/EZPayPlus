<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimeInterpretation extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $casts = [
    	'regular_working_hours' => 'float',
		'night_differential' => 'float',
		'overtime' => 'float',
		'overtime_night_differential' => 'float',
		'rest_day_rate' => 'float',
		'rest_day_night_differential' => 'float',
		'rest_day_overtime' => 'float',
		'rest_day_overtime_night_differential' => 'float',

		'special_holiday_rate' => 'float',
		'special_holiday_night_differential' => 'float',
		'special_holiday_overtime' => 'float',
		'special_holiday_overtime_night_differential' => 'float',
		'special_holiday_rest_day_rate' => 'float',
		'special_holiday_rest_day_night_differential' => 'float',
		'special_holiday_rest_day_overtime' => 'float',
		'special_holiday_rest_day_overtime_night_differential' => 'float',

		'regular_holiday_rate' => 'float',
		'regular_holiday_night_differential' => 'float',
		'regular_holiday_overtime' => 'float',
		'regular_holiday_overtime_night_differential' => 'float',
		'regular_holiday_rest_day_rate' => 'float',
		'regular_holiday_rest_day_night_differential' => 'float',
		'regular_holiday_rest_day_overtime' => 'float',
		'regular_holiday_rest_day_overtime_night_differential' => 'float'
    ];

    public function payrolls()
    {
    	return $this->hasMany('App\Payroll');
    }
}
