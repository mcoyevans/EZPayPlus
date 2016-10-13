<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhilhealthTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('philhealth', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->float('minimum_range');
            $table->float('maximum_range');
            $table->float('salary_base');
            $table->float('employee_share');
            $table->float('employer_share');
            $table->float('total_monthly_premium');
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
        Schema::drop('philhealth');
    }
}
