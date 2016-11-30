<?php

use Illuminate\Database\Seeder;

class SSSTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sss')->insert([
        	['from' => 1000, 'to' => 1249.99, 'monthly_salary_credit' => 1000, 'ER' => 73.70, 'EE' => 36.30, 'EC' => 10.00, 'total' => 120.00],
        	['from' => 1250, 'to' => 1749.99, 'monthly_salary_credit' => 1500, 'ER' => 110.50, 'EE' => 54.50, 'EC' => 10.00, 'total' => 175.00],
        	['from' => 1750, 'to' => 2249.99, 'monthly_salary_credit' => 2000, 'ER' => 147.30, 'EE' => 72.70, 'EC' => 10.00, 'total' => 230.00],
        	['from' => 2250, 'to' => 2749.99, 'monthly_salary_credit' => 2500, 'ER' => 184.20, 'EE' => 90.80, 'EC' => 10.00, 'total' => 285.00],
        	['from' => 2750, 'to' => 3249.99, 'monthly_salary_credit' => 3000, 'ER' => 221.00, 'EE' => 109.00, 'EC' => 10.00, 'total' => 340.00],
        	['from' => 3250, 'to' => 3749.99, 'monthly_salary_credit' => 3500, 'ER' => 257.80, 'EE' => 127.20, 'EC' => 10.00, 'total' => 395.00],
        	['from' => 3750, 'to' => 4249.99, 'monthly_salary_credit' => 4000, 'ER' => 294.70, 'EE' => 145.30, 'EC' => 10.00, 'total' => 450.00],
        	['from' => 4250, 'to' => 4749.99, 'monthly_salary_credit' => 4500, 'ER' => 331.50, 'EE' => 163.50, 'EC' => 10.00, 'total' => 505.00],
        	['from' => 4750, 'to' => 5249.99, 'monthly_salary_credit' => 5000, 'ER' => 368.30, 'EE' => 181.70, 'EC' => 10.00, 'total' => 560.00],
        	['from' => 5250, 'to' => 5749.99, 'monthly_salary_credit' => 5500, 'ER' => 405.20, 'EE' => 199.80, 'EC' => 10.00, 'total' => 615.00],
        	['from' => 5750, 'to' => 6249.99, 'monthly_salary_credit' => 6000, 'ER' => 442.00, 'EE' => 218.00, 'EC' => 10.00, 'total' => 670.00],
        	['from' => 6250, 'to' => 6749.99, 'monthly_salary_credit' => 6500, 'ER' => 478.80, 'EE' => 236.20, 'EC' => 10.00, 'total' => 725.00],
        	['from' => 6750, 'to' => 7249.99, 'monthly_salary_credit' => 7000, 'ER' => 515.70, 'EE' => 254.30, 'EC' => 10.00, 'total' => 780.00],
        	['from' => 7250, 'to' => 7749.99, 'monthly_salary_credit' => 7500, 'ER' => 552.50, 'EE' => 272.50, 'EC' => 10.00, 'total' => 835.00],
        	['from' => 7750, 'to' => 8249.99, 'monthly_salary_credit' => 8000, 'ER' => 589.30, 'EE' => 290.70, 'EC' => 10.00, 'total' => 890.00],
        	['from' => 8250, 'to' => 8749.99, 'monthly_salary_credit' => 8500, 'ER' => 626.20, 'EE' => 308.80, 'EC' => 10.00, 'total' => 945.00],
        	['from' => 8750, 'to' => 9249.99, 'monthly_salary_credit' => 9000, 'ER' => 663.00, 'EE' => 327.00, 'EC' => 10.00, 'total' => 1000.00],
        	['from' => 9250, 'to' => 9749.99, 'monthly_salary_credit' => 9500, 'ER' => 699.80, 'EE' => 345.20, 'EC' => 10.00, 'total' => 1055.00],
        	['from' => 9750, 'to' => 10249.99, 'monthly_salary_credit' => 10000, 'ER' => 736.70, 'EE' => 363.30, 'EC' => 10.00, 'total' => 1110.00],
        	['from' => 10250, 'to' => 10749.99, 'monthly_salary_credit' => 10500, 'ER' => 773.50, 'EE' => 381.50, 'EC' => 10.00, 'total' => 1165.00],
        	['from' => 10750, 'to' => 11249.99, 'monthly_salary_credit' => 11000, 'ER' => 810.30, 'EE' => 399.70, 'EC' => 10.00, 'total' => 1220.00],
        	['from' => 11250, 'to' => 11749.99, 'monthly_salary_credit' => 11500, 'ER' => 847.20, 'EE' => 417.80, 'EC' => 10.00, 'total' => 1275.00],
        	['from' => 11750, 'to' => 12249.99, 'monthly_salary_credit' => 12000, 'ER' => 884.00, 'EE' => 436.00, 'EC' => 10.00, 'total' => 1330.00],
        	['from' => 12250, 'to' => 12749.99, 'monthly_salary_credit' => 12500, 'ER' => 920.80, 'EE' => 454.20, 'EC' => 10.00, 'total' => 1385.00],
        	['from' => 12750, 'to' => 13249.99, 'monthly_salary_credit' => 13000, 'ER' => 957.70, 'EE' => 472.30, 'EC' => 10.00, 'total' => 1440.00],
        	['from' => 13250, 'to' => 13749.99, 'monthly_salary_credit' => 13500, 'ER' => 994.50, 'EE' => 490.50, 'EC' => 10.00, 'total' => 1495.00],
        	['from' => 13750, 'to' => 14249.99, 'monthly_salary_credit' => 14000, 'ER' => 1031.30, 'EE' => 508.70, 'EC' => 10.00, 'total' => 1550.00],
        	['from' => 14250, 'to' => 14749.99, 'monthly_salary_credit' => 14500, 'ER' => 1068.20, 'EE' => 526.80, 'EC' => 10.00, 'total' => 1605.00],
        	['from' => 14750, 'to' => 15249.99, 'monthly_salary_credit' => 15000, 'ER' => 1105.00, 'EE' => 545.00, 'EC' => 30.00, 'total' => 1680.00],
        	['from' => 15250, 'to' => 15749.99, 'monthly_salary_credit' => 15500, 'ER' => 1141.80, 'EE' => 563.20, 'EC' => 30.00, 'total' => 1735.00],
        	['from' => 15750, 'to' => null, 'monthly_salary_credit' => 16000, 'ER' => 1178.70, 'EE' => 581.30, 'EC' => 30.00, 'total' => 1790.00]
        ]);
    }
}
