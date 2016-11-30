<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('employee_number')->unsigned();
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('sex');
            $table->string('civil_status');
            $table->integer('age');
            $table->date('birthdate');
            $table->string('tin', 11);
            $table->string('sss', 12);
            $table->string('phic', 14);
            $table->string('hdmf', 14);
            $table->string('payment_type');
            $table->integer('batch_id')->unsigned();
            $table->integer('branch_id')->unsigned();
            $table->integer('cost_center_id')->unsigned();
            $table->integer('position_id')->unsigned();
            $table->dateTime('date_hired');
            $table->string('employee_status');
            $table->integer('tax_code_id')->unsigned();
            $table->smallInteger('dependents')->unsigned();
            $table->integer('account_number');
            $table->boolean('minimum_wage_earner');
            $table->text('street_address');
            $table->integer('city_id')->unsigned();
            $table->integer('province_id')->unsigned();
            $table->integer('country_id')->unsigned();
            $table->string('postal_code')->nullable();
            $table->string('telephone_number')->nullable();
            $table->string('mobile_phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('emergency_contact_person')->nullable();
            $table->text('emergency_contact_person_address')->nullable();
            $table->text('emergency_contact_person_relationship')->nullable();
            $table->text('emergency_contact_person_telephone_number')->nullable();
            $table->text('emergency_contact_person_mobile_phone_number')->nullable();
            $table->integer('payroll_id')->unsigned();
            $table->float('basic_pay');
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
        Schema::drop('employees');
    }
}
