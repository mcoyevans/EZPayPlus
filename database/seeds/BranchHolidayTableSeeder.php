<?php

use Illuminate\Database\Seeder;

class BranchHolidayTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('branch_holiday')->insert([
        	['branch_id' => 1, 'holiday_id' => 1, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 2, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 3, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 4, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 5, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 6, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 7, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 8, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 9, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 10, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 11, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 12, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['branch_id' => 1, 'holiday_id' => 13, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()]
        ]);
    }
}
