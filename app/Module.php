<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
	use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function groups()
    {
    	return $this->belongToMany('App\Group');
    }
}
