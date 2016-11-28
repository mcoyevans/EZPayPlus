<?php

use Illuminate\Database\Seeder;

class ModulesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('modules')->insert([
        	[
        		'name' => 'Settings',
        		'description' => 'Allow user to manage settings information.',
        	],
        	[
		        'name' => 'HRIS',
		        'description' => 'Allow user to manage Human Resource Information System.',
		    ],
		    [
		        'name' => 'Payroll',
		        'description' => 'Allow user to manage payroll.',
		    ],
        ]);
    }
}
