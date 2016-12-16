<?php

use Illuminate\Database\Seeder;

class CostCentersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cost_centers')->insert([
        	'name' => 'Sample',
        	'description' => 'Sample',
        	'gl_account' => '000000000001',
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now()
        ]);
    }
}
