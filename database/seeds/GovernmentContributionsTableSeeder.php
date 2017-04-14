<?php

use Illuminate\Database\Seeder;

class GovernmentContributionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('government_contributions')->insert([
        	['name' => 'Withholding Tax', 'first_cut_off' => 1, 'second_cut_off' => 1, 'third_cut_off' => 0, 'fourth_cut_off' => 0, 'payroll_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'SSS', 'first_cut_off' => 0, 'second_cut_off' => 1, 'third_cut_off' => 0, 'fourth_cut_off' => 0, 'payroll_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Pagibig', 'first_cut_off' => 0, 'second_cut_off' => 1, 'third_cut_off' => 0, 'fourth_cut_off' => 0, 'payroll_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Philhealth', 'first_cut_off' => 0, 'second_cut_off' => 1, 'third_cut_off' => 0, 'fourth_cut_off' => 0, 'payroll_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        ]);
    }
}
