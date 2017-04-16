<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('company_name')->nullable();
            $table->string('tin')->nullable();
            $table->text('address')->nullable();
            $table->integer('city_id')->nullable()->unsigned();
            $table->integer('province_id')->nullable()->unsigned();
            $table->integer('country_id')->nullable()->unsigned();
            $table->string('postal_code')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('telephone_number')->nullable();
            $table->string('cellphone_number')->nullable();
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
        Schema::dropIfExists('suppliers');
    }
}
