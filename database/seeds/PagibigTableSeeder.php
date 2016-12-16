<?php

use Illuminate\Database\Seeder;

class PagibigTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('pagibig')->insert([
            ['monthly_savings' => 100.00, 'savings_in_20_years' => 24000.00],
            ['monthly_savings' => 200.00, 'savings_in_20_years' => 48000.00],
            ['monthly_savings' => 300.00, 'savings_in_20_years' => 72000.00],
            ['monthly_savings' => 400.00, 'savings_in_20_years' => 96000.00],
            ['monthly_savings' => 500.00, 'savings_in_20_years' => 120000.00],
            ['monthly_savings' => 1000.00, 'savings_in_20_years' => 240000.00],
            ['monthly_savings' => 1500.00, 'savings_in_20_years' => 360000.00],
        	['monthly_savings' => 2000.00, 'savings_in_20_years' => 480000.00],
        ]);
    }
}
