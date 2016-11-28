<?php

use Illuminate\Database\Seeder;

class TaxesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('taxes')->insert([
        	// Zero Exemption - Daily
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 0.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 33.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 99.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 231.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 462.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 825.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 1, 'pay_frequency' => 'daily', 'salary' => 1650.00, 'tax' => 412.54, 'excess' => 0.32],
        	// Single/Married - Daily
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 165.00, 'tax' => 0.0, 'excess' => 0.05],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 198.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 264.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 396.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 627.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 990.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 2, 'pay_frequency' => 'daily', 'salary' => 1815.00, 'tax' => 412.54, 'excess' => 0.32],
        	// Single/Married with 1 Dependent - Daily
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 248.00, 'tax' => 0.0, 'excess' => 0.05],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 281.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 347.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 479.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 710.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 1073.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 3, 'pay_frequency' => 'daily', 'salary' => 1898.00, 'tax' => 412.54, 'excess' => 0.32],
        	// Single/Married with 2 Dependents - Daily
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 330.00, 'tax' => 0.0, 'excess' => 0.05],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 363.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 429.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 561.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 792.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 1155.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 4, 'pay_frequency' => 'daily', 'salary' => 1980.00, 'tax' => 412.54, 'excess' => 0.32],
        	// Single/Married with 3 Dependents - Daily
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 413.00, 'tax' => 0.0, 'excess' => 0.05],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 446.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 512.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 644.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 875.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 1238.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 5, 'pay_frequency' => 'daily', 'salary' => 2063.00, 'tax' => 412.54, 'excess' => 0.32],
        	// Single/Married with 4 Dependents - Daily
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 495.00, 'tax' => 0.0, 'excess' => 0.05],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 446.00, 'tax' => 1.65, 'excess' => 0.10],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 512.00, 'tax' => 8.25, 'excess' => 0.15],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 644.00, 'tax' => 28.05, 'excess' => 0.20],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 875.00, 'tax' => 74.26, 'excess' => 0.25],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 1238.00, 'tax' => 165.02, 'excess' => 0.30],
        	['tax_code_id' => 6, 'pay_frequency' => 'daily', 'salary' => 2063.00, 'tax' => 412.54, 'excess' => 0.32],

        	// Zero Exemption - Weekly
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 0.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 192.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 577.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 1346.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 2692.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 4808.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 1, 'pay_frequency' => 'weekly', 'salary' => 9615.00, 'tax' => 2403.85, 'excess' => 0.32],
        	// Single/Married - Weekly
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 962.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 1154.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 1538.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 2308.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 3654.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 5769.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 2, 'pay_frequency' => 'weekly', 'salary' => 10577.00, 'tax' => 2403.85, 'excess' => 0.32],
        	// Single/Married with 1 Dependent - Weekly
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 1142.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 1635.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 2019.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 2788.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 4135.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 6250.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 3, 'pay_frequency' => 'weekly', 'salary' => 11058.00, 'tax' => 2403.85, 'excess' => 0.32],
        	// Single/Married with 2 Dependents - Weekly
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 1923.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 2115.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 2500.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 3269.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 4615.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 6731.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 4, 'pay_frequency' => 'weekly', 'salary' => 11538.00, 'tax' => 2403.85, 'excess' => 0.32],
        	// Single/Married with 3 Dependents - Weekly
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 2404.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 2596.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 2981.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 3750.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 5096.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 7212.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 5, 'pay_frequency' => 'weekly', 'salary' => 12019.00, 'tax' => 2403.85, 'excess' => 0.32],
        	// Single/Married with 4 Dependents - Weekly
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 2404.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 2596.00, 'tax' => 9.62, 'excess' => 0.10],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 2981.00, 'tax' => 48.08, 'excess' => 0.15],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 3750.00, 'tax' => 163.46, 'excess' => 0.20],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 5096.00, 'tax' => 432.69, 'excess' => 0.25],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 7212.00, 'tax' => 961.54, 'excess' => 0.30],
        	['tax_code_id' => 6, 'pay_frequency' => 'weekly', 'salary' => 12019.00, 'tax' => 2403.85, 'excess' => 0.32],

        	// Zero Exemption - Semi-Monthly
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 0.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 417.00, 'tax' => 20.83, 'excess' => 0.10],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 1250.00, 'tax' => 104.17, 'excess' => 0.15],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 2917.00, 'tax' => 354.17, 'excess' => 0.20],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 5833.00, 'tax' => 937.50, 'excess' => 0.25],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 10417.00, 'tax' => 2083.33, 'excess' => 0.30],
        	['tax_code_id' => 1, 'pay_frequency' => 'semi-monthly', 'salary' => 20833.00, 'tax' => 5208.33, 'excess' => 0.32],
        	// Single/Married - Semi-Monthly
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 2083.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 2500.00, 'tax' => 20.83, 'excess' => 0.10],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 3333.00, 'tax' => 104.17, 'excess' => 0.15],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 5000.00, 'tax' => 354.17, 'excess' => 0.20],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 7917.00, 'tax' => 937.50, 'excess' => 0.25],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 12500.00, 'tax' => 2083.33, 'excess' => 0.30],
        	['tax_code_id' => 2, 'pay_frequency' => 'semi-monthly', 'salary' => 22917.00, 'tax' => 5208.33, 'excess' => 0.32],
        	// Single/Married with 1 Depdendent - Semi-Monthly
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 3125.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 3542.00, 'tax' => 20.83, 'excess' => 0.10],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 4375.00, 'tax' => 104.17, 'excess' => 0.15],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 6042.00, 'tax' => 354.17, 'excess' => 0.20],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 8958.00, 'tax' => 937.50, 'excess' => 0.25],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 13542.00, 'tax' => 2083.33, 'excess' => 0.30],
        	['tax_code_id' => 3, 'pay_frequency' => 'semi-monthly', 'salary' => 23958.00, 'tax' => 5208.33, 'excess' => 0.32],
        	// Single/Married with 2 Depdendent - Semi-Monthly
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 5208.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 5625.00, 'tax' => 20.83, 'excess' => 0.10],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 6458.00, 'tax' => 104.17, 'excess' => 0.15],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 8125.00, 'tax' => 354.17, 'excess' => 0.20],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 11042.00, 'tax' => 937.50, 'excess' => 0.25],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 15625.00, 'tax' => 2083.33, 'excess' => 0.30],
        	['tax_code_id' => 4, 'pay_frequency' => 'semi-monthly', 'salary' => 26042.00, 'tax' => 5208.33, 'excess' => 0.32],
        	// Single/Married with 3 Depdendent - Semi-Monthly
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 6250.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 6667.00, 'tax' => 20.83, 'excess' => 0.10],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 7500.00, 'tax' => 104.17, 'excess' => 0.15],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 9167.00, 'tax' => 354.17, 'excess' => 0.20],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 12083.00, 'tax' => 937.50, 'excess' => 0.25],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 16667.00, 'tax' => 2083.33, 'excess' => 0.30],
        	['tax_code_id' => 5, 'pay_frequency' => 'semi-monthly', 'salary' => 27083.00, 'tax' => 5208.33, 'excess' => 0.32],

        	// Zero Exemption - Monthly
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 0.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 833.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 2500.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 5833.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 11667.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 20833.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 1, 'pay_frequency' => 'monthly', 'salary' => 41667.00, 'tax' => 10416.67, 'excess' => 0.32],
        	// Single/Married - Monthly
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 4167.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 5000.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 6667.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 10000.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 15833.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 25000.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 2, 'pay_frequency' => 'monthly', 'salary' => 45833.00, 'tax' => 10416.67, 'excess' => 0.32],
        	// Single/Married with 1 Depdendent - Monthly
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 6250.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 7083.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 8750.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 12083.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 17917.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 27083.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 3, 'pay_frequency' => 'monthly', 'salary' => 47917.00, 'tax' => 10416.67, 'excess' => 0.32],
        	// Single/Married with 2 Depdendents - Monthly
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 8333.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 9167.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 10833.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 14167.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 20000.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 29167.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 4, 'pay_frequency' => 'monthly', 'salary' => 50000.00, 'tax' => 10416.67, 'excess' => 0.32],
        	// Single/Married with 3 Depdendents - Monthly
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 10417.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 11250.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 12917.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 16250.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 22083.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 31250.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 5, 'pay_frequency' => 'monthly', 'salary' => 52083.00, 'tax' => 10416.67, 'excess' => 0.32],
        	// Single/Married with 4 Depdendents - Monthly
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 12500.00, 'tax' => 0.00, 'excess' => 0.05],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 13333.00, 'tax' => 41.67, 'excess' => 0.10],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 15000.00, 'tax' => 208.33, 'excess' => 0.15],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 18333.00, 'tax' => 708.33, 'excess' => 0.20],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 24167.00, 'tax' => 1875.00, 'excess' => 0.25],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 33333.00, 'tax' => 4166.67, 'excess' => 0.30],
        	['tax_code_id' => 6, 'pay_frequency' => 'monthly', 'salary' => 54167.00, 'tax' => 10416.67, 'excess' => 0.32],
        ]);
    }
}
