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


$factory->define(App\Group::class, function (Faker\Generator $faker) {
    return [
        'name' => 'admin',
        'description' => 'Admin has access to all modules.',
    ];
});