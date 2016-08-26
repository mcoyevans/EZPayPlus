<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('address');
            $table->integer('city_id')->unsigned();
            $table->integer('province_id')->unsigned();
            $table->integer('country_id')->unsigned();
            $table->string('postal_code');
            $table->string('contact_number');
            $table->string('tin');
            $table->string('sss');
            $table->string('pagibig');
            $table->string('philhealth');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('companies');
    }
}
