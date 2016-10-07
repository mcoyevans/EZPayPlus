<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HouseBank extends Model
{
	public function currency()
    {
    	return $this->belongsTo('App\Branch');
    }

    // public function branch()
    // {
    // 	return $this->belongsTo('App\Branch');
    // }
}
