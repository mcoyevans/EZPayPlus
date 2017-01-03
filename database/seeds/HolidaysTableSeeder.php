<?php

use Illuminate\Database\Seeder;

class HolidaysTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('holidays')->insert([
        	['date' => Carbon\Carbon::parse('January 1')->toDateTimeString(), 'description' => 'New Year\'s Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('April 9')->toDateTimeString(), 'description' => 'The Day of Valor', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('May 1')->toDateTimeString(), 'description' => 'Labor Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('June 12')->toDateTimeString(), 'description' => 'Independence Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('August 21')->toDateTimeString(), 'description' => 'Ninoy Aquino Day', 'type' => 'Special Non-working Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('August 28')->toDateTimeString(), 'description' => 'National Heroes Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('October 31')->toDateTimeString(), 'description' => 'Special non-working day', 'type' => 'Special Non-working Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('November 1')->toDateTimeString(), 'description' => 'All Saints\' Day', 'type' => 'Special Non-working Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('November 30')->toDateTimeString(), 'description' => 'Bonifcatio Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
            ['date' => Carbon\Carbon::parse('December 24')->toDateTimeString(), 'description' => 'Christmas Eve', 'type' => 'Special Non-working Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('December 25')->toDateTimeString(), 'description' => 'Christmas Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('December 30')->toDateTimeString(), 'description' => 'Rizal Day', 'type' => 'Regular Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        	['date' => Carbon\Carbon::parse('December 31')->toDateTimeString(), 'description' => 'New Year\'s Eve', 'type' => 'Special Non-working Holiday', 'repeat' => true, 'created_at' => Carbon\Carbon::now()->toDateTimeString(), 'updated_at' => Carbon\Carbon::now()->toDateTimeString()],
        ]);
    }
}
