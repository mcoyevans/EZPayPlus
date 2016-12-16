<?php

use Illuminate\Database\Seeder;

class PhilhealthTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('philhealth')->insert([
        	['from' => 0.00, 'to' => 8999.99, 'salary_base' => 8000.00, 'total_monthly_premium' => 200, 'employee_share' => 100, 'employer_share' => 100],
        	['from' => 9000.00, 'to' => 9999.99, 'salary_base' => 9000.00, 'total_monthly_premium' => 225, 'employee_share' => 112.5, 'employer_share' =>	112.5],
			['from' => 10000.00, 'to' => 10999.99, 'salary_base' =>	10000.00, 'total_monthly_premium' => 250, 'employee_share' => 125, 'employer_share' =>	125],
			['from' => 11000.00, 'to' => 11999.99, 'salary_base' =>	11000.00, 'total_monthly_premium' => 275, 'employee_share' => 137.5, 'employer_share' =>	137.5],
			['from' => 12000.00, 'to' => 12999.99, 'salary_base' =>	12000.00, 'total_monthly_premium' => 300, 'employee_share' => 150, 'employer_share' =>	150],
			['from' => 13000.00, 'to' => 13999.99, 'salary_base' =>	13000.00, 'total_monthly_premium' => 325, 'employee_share' => 162.5, 'employer_share' =>	162.5],
			['from' => 14000.00, 'to' => 14999.99, 'salary_base' =>	14000.00, 'total_monthly_premium' => 350, 'employee_share' => 175, 'employer_share' =>	175],
			['from' => 15000.00, 'to' => 15999.99, 'salary_base' =>	15000.00, 'total_monthly_premium' => 375, 'employee_share' => 187.5, 'employer_share' =>	187.5],
			['from' => 16000.00, 'to' => 16999.99, 'salary_base' =>	16000.00, 'total_monthly_premium' => 400, 'employee_share' => 200, 'employer_share' =>	200],
			['from' => 17000.00, 'to' => 17999.99, 'salary_base' =>	17000.00, 'total_monthly_premium' => 425, 'employee_share' => 212.5, 'employer_share' =>	212.5],
			['from' => 18000.00, 'to' => 18999.99, 'salary_base' =>	18000.00, 'total_monthly_premium' => 450, 'employee_share' => 225, 'employer_share' =>	225],
			['from' => 19000.00, 'to' => 19999.99, 'salary_base' =>	19000.00, 'total_monthly_premium' => 475, 'employee_share' => 237.5, 'employer_share' =>	237.5],
			['from' => 20000.00, 'to' => 20999.99, 'salary_base' =>	20000.00, 'total_monthly_premium' => 500, 'employee_share' => 250, 'employer_share' =>	250],
			['from' => 21000.00, 'to' => 21999.99, 'salary_base' =>	21000.00, 'total_monthly_premium' => 525, 'employee_share' => 262.5, 'employer_share' =>	262.5],
			['from' => 22000.00, 'to' => 22999.99, 'salary_base' =>	22000.00, 'total_monthly_premium' => 550, 'employee_share' => 275, 'employer_share' =>	275],
			['from' => 23000.00, 'to' => 23999.99, 'salary_base' =>	23000.00, 'total_monthly_premium' => 575, 'employee_share' => 287.5, 'employer_share' =>	287.5],
			['from' => 24000.00, 'to' => 24999.99, 'salary_base' =>	24000.00, 'total_monthly_premium' => 600, 'employee_share' => 300, 'employer_share' =>	300],
			['from' => 25000.00, 'to' => 25999.99, 'salary_base' =>	25000.00, 'total_monthly_premium' => 625, 'employee_share' => 312.5, 'employer_share' =>	312.5],
			['from' => 26000.00, 'to' => 26999.99, 'salary_base' =>	26000.00, 'total_monthly_premium' => 650, 'employee_share' => 325, 'employer_share' =>	325],
			['from' => 27000.00, 'to' => 27999.99, 'salary_base' =>	27000.00, 'total_monthly_premium' => 675, 'employee_share' => 337.5, 'employer_share' =>	337.5],
			['from' => 28000.00, 'to' => 28999.99, 'salary_base' =>	28000.00, 'total_monthly_premium' => 700, 'employee_share' => 350, 'employer_share' =>	350],
			['from' => 29000.00, 'to' => 29999.99, 'salary_base' =>	29000.00, 'total_monthly_premium' => 725, 'employee_share' => 362.5, 'employer_share' =>	362.5],
			['from' => 30000.00, 'to' => 30999.99, 'salary_base' =>	30000.00, 'total_monthly_premium' => 750, 'employee_share' => 375, 'employer_share' =>	375],
			['from' => 31000.00, 'to' => 31999.99, 'salary_base' =>	31000.00, 'total_monthly_premium' => 775, 'employee_share' => 387.5, 'employer_share' =>	387.5],
			['from' => 32000.00, 'to' => 32999.99, 'salary_base' =>	32000.00, 'total_monthly_premium' => 800, 'employee_share' => 400, 'employer_share' =>	400],
			['from' => 33000.00, 'to' => 33999.99, 'salary_base' =>	33000.00, 'total_monthly_premium' => 825, 'employee_share' => 412.5, 'employer_share' =>	412.5],
			['from' => 34000.00, 'to' => 34999.99, 'salary_base' =>	34000.00, 'total_monthly_premium' => 850, 'employee_share' => 425, 'employer_share' =>	425],
			['from' => 35000.00, 'to' => null, 'salary_base' => 35000.00, 'total_monthly_premium' => 875, 'employee_share' => 437.5, 'employer_share' =>	437.5]
        ]);
    }
}
