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
        	['from' => 0.00, 'to' => 1500.00, 'employee_share' => 0.01, 'employer_share' => 0.02],
        	['from' => 1500.01, 'to' => null, 'employee_share' => 0.02, 'employer_share' => 0.02],
        ]);
    }
}
