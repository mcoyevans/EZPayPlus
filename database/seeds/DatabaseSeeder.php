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
        $this->call(CitiesTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(GroupsTableSeeder::class);
        $this->call(ModulesTableSeeder::class);
        $this->call(GroupModuleTableSeeder::class);
        $this->call(ProvincesTableSeeder::class);
        $this->call(TimeInterpretationsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
    }
}
