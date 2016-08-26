<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    public function house_banks()
    {
    	return $this->hasMany('App\HouseBank');
    }
}
