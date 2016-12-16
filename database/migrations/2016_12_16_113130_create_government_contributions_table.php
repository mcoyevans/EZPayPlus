<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGovernmentContributionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('government_contributions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->boolean('first_cut_off');
            $table->boolean('second_cut_off');
            $table->boolean('third_cut_off');
            $table->boolean('fourth_cut_off');
            $table->integer('payroll_id')->unsigned();
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
        Schema::dropIfExists('government_contributions');
    }
}
