<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
            $table->string('last_name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('corporation_name')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('tin')->nullable();
            $table->text('street_address')->nullable();
            $table->integer('city_id')->unsigned();
            $table->integer('province_id')->unsigned();
            $table->integer('country_id')->nullable()->unsigned()->default(177);
            $table->string('postal_code')->nullable();
            $table->string('telephone_number')->nullable();
            $table->string('mobile_number');
            $table->string('email_address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
