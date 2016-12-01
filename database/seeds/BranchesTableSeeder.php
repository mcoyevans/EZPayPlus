<?php

use Illuminate\Database\Seeder;

class BranchesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('branches')->insert([
        	'name' => 'Sample',
        	'description' => 'Sample',
        	'gl_account' => '000000000001',
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now()
        ]);
    }
}
