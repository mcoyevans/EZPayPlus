<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SanctionType extends Model
{
    public function sanction_levels()
    {
    	return $this->hasMany('App\SanctionLevel');
    }
}
