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
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->text('address')->nullable();
            $table->integer('city_id')->nullable()->unsigned();
            $table->integer('province_id')->nullable()->unsigned();
            $table->integer('country_id')->nullable()->unsigned();
            $table->string('postal_code')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('tin')->nullable();
            $table->string('sss')->nullable();
            $table->string('pagibig')->nullable();
            $table->string('philhealth')->nullable();
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
