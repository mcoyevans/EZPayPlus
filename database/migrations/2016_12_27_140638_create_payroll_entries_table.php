<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePayrollEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payroll_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('payroll_process_id')->unsigned();
            $table->integer('employee_id')->unsigned();
            // Time
            $table->float('regular_working_hours');
            $table->float('night_differential');
            $table->float('overtime');
            $table->float('overtime_night_differential');
            $table->float('rest_day');
            $table->float('rest_day_night_differential');
            $table->float('rest_day_overtime');
            $table->float('rest_day_overtime_night_differential');
            $table->float('regular_holiday');
            $table->float('regular_holiday_night_differential');
            $table->float('regular_holiday_overtime');
            $table->float('regular_holiday_overtime_night_differential');
            $table->float('regular_holiday_rest_day');
            $table->float('regular_holiday_rest_day_night_differential');
            $table->float('regular_holiday_rest_day_overtime');
            $table->float('regular_holiday_rest_day_overtime_night_differential');
            $table->float('special_holiday');
            $table->float('special_holiday_night_differential');
            $table->float('special_holiday_overtime');
            $table->float('special_holiday_overtime_night_differential');
            $table->float('special_holiday_rest_day');
            $table->float('special_holiday_rest_day_night_differential');
            $table->float('special_holiday_rest_day_overtime');
            $table->float('special_holiday_rest_day_overtime_night_differential');
            // Pay
            $table->float('regular_working_hours_pay');
            $table->float('night_differential_pay');
            $table->float('overtime_pay');
            $table->float('overtime_night_differential_pay');
            $table->float('rest_day_pay');
            $table->float('rest_day_night_differential_pay');
            $table->float('rest_day_overtime_pay');
            $table->float('rest_day_overtime_night_differential_pay');
            $table->float('regular_holiday_pay');
            $table->float('regular_holiday_night_differential_pay');
            $table->float('regular_holiday_overtime_pay');
            $table->float('regular_holiday_overtime_night_differential_pay');
            $table->float('regular_holiday_rest_day_pay');
            $table->float('regular_holiday_rest_day_night_differential_pay');
            $table->float('regular_holiday_rest_day_overtime_pay');
            $table->float('regular_holiday_rest_day_overtime_night_differential_pay');
            $table->float('special_holiday_pay');
            $table->float('special_holiday_night_differential_pay');
            $table->float('special_holiday_overtime_pay');
            $table->float('special_holiday_overtime_night_differential_pay');
            $table->float('special_holiday_rest_day_pay');
            $table->float('special_holiday_rest_day_night_differential_pay');
            $table->float('special_holiday_rest_day_overtime_pay');
            $table->float('special_holiday_rest_day_overtime_night_differential_pay');

            $table->float('taxable_income');
            $table->float('gross_pay');
            $table->float('total_deductions');
            $table->float('additional_earnings');
            $table->float('additional_deductions');
            $table->float('net_pay');
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
        Schema::dropIfExists('payroll_entries');
    }
}
