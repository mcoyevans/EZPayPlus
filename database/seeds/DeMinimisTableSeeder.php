<?php

use Illuminate\Database\Seeder;

class DeMinimisTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('de_minimis')->insert([
        	['name' => 'Medical Cash', 'description' => 'medical cash allowance to dependents of employees not exceeding P750 per semester or P125 per month', 'maximum_amount_per_month' => 125.00, 'percentage_of_basic_minimum_wage' => null],
        	['name' => 'Rice', 'description' => 'rice subsidy of P1,000.00 or one-sack of rice per month', 'maximum_amount_per_month' => 1000.00, 'percentage_of_basic_minimum_wage' => null],
        	['name' => 'Uniform or Clothing', 'description' => 'uniforms and clothing allowance not exceeding P3,000.00 per year', 'maximum_amount_per_month' => 250.00, 'percentage_of_basic_minimum_wage' => null],
        	['name' => 'Medical Benefits', 'description' => 'medical benefits not exceeding P10,000.00 per annum', 'maximum_amount_per_month' => 833.33, 'percentage_of_basic_minimum_wage' => null],
        	['name' => 'Laundry', 'description' => 'laundry allowance of P300 per month', 'maximum_amount_per_month' => 300.00, 'percentage_of_basic_minimum_wage' => null],
        	['name' => 'Meal', 'description' => 'daily meal allowance for overtime work not exceeding 25% of the basic minimum wage', 'maximum_amount_per_month' => null, 'percentage_of_basic_minimum_wage' => 0.25],
        ]);
    }
}
