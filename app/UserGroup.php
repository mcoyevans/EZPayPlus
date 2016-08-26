<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    protected $table = 'user_group';

    public function user()
    {
    	return $this->belongTo('App\User');
    }

    public function group()
    {
    	return $this->belongTo('App\Group');
    }
}
