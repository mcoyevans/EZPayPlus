<?php

use Illuminate\Database\Seeder;

class PositionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('positions')->insert([
        	'name' => 'Sample',
        	'description' => 'Sample',
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now()
        ]);
    }
}
