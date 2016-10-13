<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaxCode extends Model
{
    public function employees()
    {
    	return $this->hasMany('App\Employee');
    }

    public function taxes()
    {
    	return $this->hasMany('App\Tax');
    }
}
