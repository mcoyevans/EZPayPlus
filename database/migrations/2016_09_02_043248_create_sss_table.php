<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSSSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sss', function (Blueprint $table) {
            $table->increments('id');
            $table->float('minimum_range');
            $table->float('maximum_range');
            $table->float('monthly_salary_credit');
            $table->float('employee_contribution');
            $table->float('employer_contribution');
            $table->float('total_contribution');
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
        Schema::drop('sss');
    }
}
