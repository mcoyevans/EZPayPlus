<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SantionType extends Model
{
	use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function sanction_levels()
    {
    	return $this->hasMany('App\SanctionLevel');
    }
}
