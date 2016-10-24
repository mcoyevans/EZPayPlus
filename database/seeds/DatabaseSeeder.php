<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Group::class, 'super-admin')->create();
		factory(App\Company::class)->create();
        factory(App\GroupModule::class, 'super-admin-setup')->create();
        factory(App\GroupModule::class, 'super-admin-hris')->create();
        factory(App\GroupModule::class, 'super-admin-payroll')->create();
        factory(App\GroupModule::class, 'super-admin-timekeeping')->create();
        factory(App\Module::class, 'settings')->create();
        factory(App\Module::class, 'hris')->create();
        factory(App\Module::class, 'payroll')->create();
        factory(App\Module::class, 'timekeeping')->create();
        factory(App\User::class, 'mcoy')->create();
        $this->call(CountriesTableSeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(CitiesTableSeeder::class);
        $this->call(ProvincesTableSeeder::class);
        $this->call(TimeInterpretationsTableSeeder::class);
    }
}
