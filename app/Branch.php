<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function company()
    {
    	return $this->belongsTo('App\Company');
    }

    public function currency()
    {
    	return $this->belongsTo
    }

    public function house_banks()
    {
    	return $this->hasMany('App\HouseBank');
    }
}
