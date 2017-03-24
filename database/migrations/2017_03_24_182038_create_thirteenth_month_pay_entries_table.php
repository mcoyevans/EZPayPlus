<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateThirteenthMonthPayEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thirteenth_month_pay_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('thirteenth_month_pay_process_id')->unsigned();
            $table->integer('employee_id')->unsigned();
            $table->float('amount')->unsigned();
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
        Schema::dropIfExists('thirteenth_month_pay_entries');
    }
}
