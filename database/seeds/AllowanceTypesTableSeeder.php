<?php

use Illuminate\Database\Seeder;

class AllowanceTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('allowance_types')->insert([
        	['name' => 'Clothing', 'description' => 'Clothing Allowance', 'de_minimis_id' => 3, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Laundry', 'description' => 'Laundry Allowance', 'de_minimis_id' => 5, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        	['name' => 'Rice', 'description' => 'Rice Allowance', 'de_minimis_id' => 2, 'created_at' => Carbon\Carbon::now(), 'updated_at' => Carbon\Carbon::now()],
        ]);
    }
}
