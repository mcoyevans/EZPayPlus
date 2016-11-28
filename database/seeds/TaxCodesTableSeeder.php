<?php

use Illuminate\Database\Seeder;

class TaxCodesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tax_codes')->insert([
        	['code' => 'Z', 'description' => 'Zero Exemption', 'exemption' => 0, 'dependent' => 0],
        	['code' => 'S/ME', 'description' => 'Single/Married', 'exemption' => 50000, 'dependent' => 0],
        	['code' => 'ME1 / S1', 'description' => 'Single/Married with 1 dependent', 'exemption' => 50000, 'dependent' => 25000],
        	['code' => 'ME2 / S2', 'description' => 'Single/Married with 2 dependents', 'exemption' => 50000, 'dependent' => 50000],
        	['code' => 'ME3 / S3', 'description' => 'Single/Married with 3 dependents', 'exemption' => 50000, 'dependent' => 75000],
        	['code' => 'ME4 / S4', 'description' => 'Single/Married with 4 dependents', 'exemption' => 50000, 'dependent' => 100000],
        ]);
    }
}
