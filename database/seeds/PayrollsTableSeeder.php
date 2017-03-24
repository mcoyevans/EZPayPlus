<?php

use Illuminate\Database\Seeder;

class PayrollsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('payrolls')->insert([
        	'name' => 'Sample',
        	'description' => 'Sample',
        	'working_days_per_year' => 262,
            'working_hours_per_day' => 8,
        	'working_days_per_week' => 5,
        	'pay_frequency' => 'Semi-monthly',
        	'time_interpretation_id' => 2,
            'thirteenth_month_pay_basis' => 'Base',
        ]);
    }
}
