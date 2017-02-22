<?php

use Illuminate\Database\Seeder;

class GroupModuleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('group_module')->insert([
        	[
        		'group_id' => 1,
        		'module_id' => 1,
        	],
        	[
        		'group_id' => 1,
        		'module_id' => 2,
        	],
        	[
        		'group_id' => 1,
        		'module_id' => 3,
        	],
            [
                'group_id' => 1,
                'module_id' => 4,
            ],
        ]);
    }
}
