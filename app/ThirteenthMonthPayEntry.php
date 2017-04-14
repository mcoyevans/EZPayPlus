<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ThirteenthMonthPayEntry extends Model
{
    public function thirteenth_month_pay_process()
    {
    	return $this->belongsTo('App\ThirteenthMonthPayProcess');
    }

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }
}
