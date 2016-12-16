<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Batch extends Model
{
	use SoftDeletes;

    protected $dates= ['deleted_at'];

    public function employees()
    {
    	return $this->hasMany('App\Employee');
    }
}
