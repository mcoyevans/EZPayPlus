<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ThirteenthMonthPayProcess extends Model
{
    public function batch()
    {
    	return $this->belongsTo('App\Batch');
    }

    public function thirteenth_month_pay_entries()
    {
    	return $this->hasMany('App\ThirteenthMonthPayEntry');
    }
}
