<?php

use Illuminate\Database\Seeder;

class DeductionTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Db::table('deduction_types')->insert([
        	['name' => 'HDMFEE', 'description' => 'Home Development Mutual Fund', 'government_deduction' => true],
        	['name' => 'PHICEE', 'description' => 'Philhealth', 'government_deduction' => true],
        	['name' => 'SSSEE', 'description' => 'Social Security System', 'government_deduction' => true],
        	['name' => 'WTAX', 'description' => 'Withholding Tax', 'government_deduction' => true],
        ]);
    }
}
