<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    public function branches()
    {
    	return $this->hasMany('App\Branches');
    }

    public function city()
    {
    	return $this->belongsTo('App\City');
    }

    public function province()
    {
    	return $this->belongsTo('App\Province');
    }

    public function country()
    {
    	return $this->belongsTo('App\Country');
    }
}
