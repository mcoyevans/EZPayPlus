<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Holiday extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function branches()
    {
    	return $this->belongsToMany('App\Branch');
    }
}
