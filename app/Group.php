<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    public function users()
    {
    	return $this->belongsToMany('App\User');
    }

    public function modules()
    {
    	return $this->belongsToMany('App\Module');
    }
}
