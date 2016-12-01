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
        $this->call(BatchesTableSeeder::class);
        $this->call(BranchesTableSeeder::class);
        $this->call(CitiesTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(CostCentersTableSeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(GroupsTableSeeder::class);
        $this->call(ModulesTableSeeder::class);
        $this->call(GroupModuleTableSeeder::class);
        $this->call(PositionsTableSeeder::class);
        $this->call(ProvincesTableSeeder::class);
        $this->call(TimeInterpretationsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(SSSTableSeeder::class);
        $this->call(PhilhealthTableSeeder::class);
        $this->call(PagibigTableSeeder::class);
        $this->call(TaxCodesTableSeeder::class);
        $this->call(TaxesTableSeeder::class);
        $this->call(DeMinimisTableSeeder::class);
        $this->call(DeductionTypesTableSeeder::class);
    }
}
