<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeDeductionTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_deduction_type', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('employee_id')->unsigned();
            $table->integer('deduction_type_id')->unsigned();
            $table->decimal('amount', 8,2);
            $table->decimal('amortization', 8,2);
            $table->date('date_start');
            $table->date('date_end')->nullable();
            $table->boolean('first_cut_off');
            $table->boolean('second_cut_off');
            $table->boolean('on_hold');
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
        Schema::drop('employee_deduction_type');
    }
}
