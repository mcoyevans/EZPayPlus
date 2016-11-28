<?php

use Illuminate\Database\Seeder;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('companies')->insert([
        	'name' => 'Personiv',
	        'address' => '6F Aeon Center Bldg., North Bridgeway ave. Northgate Cyberzone',
	        'city_id' => 971,
	        'province_id' => 47,
	        'country_id' => 177,
	        'postal_code' => 1781,
	        'contact_number' => '(632) 772-4382',
	        'tin' => '123-456-789',
	        'sss' => '12-3456789-0',
	        'pagibig' => '0123-4567-8901',
	        'philhealth' => '01-234567890-1',
        ]);
    }
}
