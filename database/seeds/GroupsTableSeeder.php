<?php

use Illuminate\Database\Seeder;

class GroupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('groups')->insert([
        	[
        		'name' => 'Admin',
        		'description' => 'Admin has access to all modules.',
        		'created_at' => Carbon\Carbon::now(),        	
        		'updated_at' => Carbon\Carbon::now(),        	
        	]
        ]);
    }
}
