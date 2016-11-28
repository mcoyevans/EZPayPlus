<?php

use Illuminate\Database\Seeder;

class TimeInterpretationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('time_interpretations')->insert([
        	[
        		'name' => 'Daily',
                'regular_working_hours' => 1.000,
        		'night_differential' => 0.100,
        		'overtime' => 1.250,
        		'overtime_night_differential' => 1.375,
        		'rest_day_rate' => 1.300,
        		'rest_day_night_differential' => 1.300,
        		'rest_day_overtime' => 1.690,
        		'rest_day_overtime_night_differential' => 1.859,
        		'regular_holiday_rate' => 2.000,
        		'regular_holiday_night_differential' => 0.200,
        		'regular_holiday_overtime' => 2.600,
        		'regular_holiday_overtime_night_differential' => 2.860,
        		'regular_holiday_rest_day_rate' => 2.600,
        		'regular_holiday_rest_day_night_differential' => 2.860,
        		'regular_holiday_rest_day_overtime' => 2.600,
        		'regular_holiday_rest_day_overtime_night_differential' => 3.718,
        		'special_holiday_rate' => 1.300,
        		'special_holiday_night_differential' => 0.430, 
        		'special_holiday_overtime' => 1.690,
        		'special_holiday_overtime_night_differential' => 1.859, 
        		'special_holiday_rest_day_rate' => 1.500,
        		'special_holiday_rest_day_night_differential' => 1.650, 
        		'special_holiday_rest_day_overtime' => 1.950,
        		'special_holiday_rest_day_overtime_night_differential' => 2.145 
        	],
        	[
        		'name' => 'Monthly',
                'regular_working_hours' => 1.000,
        		'night_differential' => 0.100,
        		'overtime' => 1.250,
        		'overtime_night_differential' => 1.375,
        		'rest_day_rate' => 1.300,
        		'rest_day_night_differential' => 1.300,
        		'rest_day_overtime' => 1.690,
        		'rest_day_overtime_night_differential' => 1.859,
        		'regular_holiday_rate' => 1.000,
        		'regular_holiday_night_differential' => 0.200,
        		'regular_holiday_overtime' => 2.600,
        		'regular_holiday_overtime_night_differential' => 2.860,
        		'regular_holiday_rest_day_rate' => 2.600,
        		'regular_holiday_rest_day_night_differential' => 2.860,
        		'regular_holiday_rest_day_overtime' => 2.600,
        		'regular_holiday_rest_day_overtime_night_differential' => 3.718,
        		'special_holiday_rate' => 0.300,
        		'special_holiday_night_differential' => 0.430, 
        		'special_holiday_overtime' => 1.690,
        		'special_holiday_overtime_night_differential' => 1.859, 
        		'special_holiday_rest_day_rate' => 1.500,
        		'special_holiday_rest_day_night_differential' => 1.650, 
        		'special_holiday_rest_day_overtime' => 1.950,
        		'special_holiday_rest_day_overtime_night_differential' => 2.145 
        	],
        ]);
    }
}
