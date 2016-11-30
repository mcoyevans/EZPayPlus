<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeMinimis extends Model
{
    public function allowances()
    {
    	return $this->hasMany('App/AllowanceType');
    }
}
