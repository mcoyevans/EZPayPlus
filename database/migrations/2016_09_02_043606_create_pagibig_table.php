<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagibigTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagibig', function (Blueprint $table) {
            $table->increments('id');
            $table->float('minimum_range');
            $table->float('maximum_range');
            $table->float('employee_share');
            $table->float('employer_share');
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
        Schema::drop('pagibig');
    }
}
