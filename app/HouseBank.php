<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HouseBank extends Model
{
	use SoftDeletes;

	protected $dates = ['deleted_at'];

	public function currency()
    {
    	return $this->belongsTo('App\Currency');
    }

    // public function branch()
    // {
    // 	return $this->belongsTo('App\Branch');
    // }
}
