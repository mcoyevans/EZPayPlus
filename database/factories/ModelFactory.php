<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->defineAs(App\User::class, 'mcoy', function ($faker) use ($factory) {
    static $password;

    return [
        'name' => 'Marco Paco',
        'email' => 'marco.paco@personiv.com',
        'password' => bcrypt('admin222526'),
        'group_id' => 1,
    ];
});

$factory->defineAs(App\Group::class, 'super-admin', function (Faker\Generator $faker) {
    return [
        'name' => 'Super-Admin',
        'description' => 'Super admin has access to all modules.',
    ];
});

$factory->define(App\Company::class, function (Faker\Generator $faker) {
    return [
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
    ];
});

$factory->defineAs(App\Module::class, 'settings', function (Faker\Generator $faker) {
    return [
        'name' => 'Settings',
        'description' => 'Module that allows client settings information.',
    ];
});

$factory->defineAs(App\Module::class, 'hris', function (Faker\Generator $faker) {
    return [
        'name' => 'HRIS',
        'description' => 'Module that covers client hris.',
    ];
});

$factory->defineAs(App\Module::class, 'payroll', function (Faker\Generator $faker) {
    return [
        'name' => 'Payroll',
        'description' => 'Module that covers client payroll.',
    ];
});

$factory->defineAs(App\Module::class, 'timekeeping', function (Faker\Generator $faker) {
    return [
        'name' => 'Timekeeping',
        'description' => 'Module that covers client timekeeping.',
    ];
});

$factory->defineAs(App\GroupModule::class, 'super-admin-setup', function (Faker\Generator $faker) {
    return [
        'group_id' => 1,
        'module_id' => 1,
    ];
});

$factory->defineAs(App\GroupModule::class, 'super-admin-hris', function (Faker\Generator $faker) {
    return [
        'group_id' => 1,
        'module_id' => 2,
    ];
});

$factory->defineAs(App\GroupModule::class, 'super-admin-payroll', function (Faker\Generator $faker) {
    return [
        'group_id' => 1,
        'module_id' => 3,
    ];
});

$factory->defineAs(App\GroupModule::class, 'super-admin-timekeeping', function (Faker\Generator $faker) {
    return [
        'group_id' => 1,
        'module_id' => 4,
    ];
});

$factory->define(App\Branch::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => 'Some dummy description.',
        'gl_account' => str_random(12),
    ];
});

