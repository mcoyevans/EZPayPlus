<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
	use SoftDeletes;
	protected $dates = ['deleted_at'];

    public function positions()
    {
    	return $this->hasMany('App\Position');
    }
}
