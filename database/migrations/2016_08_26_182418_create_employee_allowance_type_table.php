<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeAllowanceTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_allowance_type', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('employee_id')->unsigned();
            $table->integer('allowance_type_id')->unsigned();
            $table->decimal('amount', 8,2);
            $table->date('date_start');
            $table->boolean('first_cut_off');
            $table->boolean('second_cut_off');
            $table->boolean('on_hold');
            $table->boolean('tax_shield');
            $table->boolean('taxable');
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
        Schema::drop('employee_allowance_type');
    }
}
