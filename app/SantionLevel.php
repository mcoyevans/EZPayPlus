<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SantionLevel extends Model
{
    public function sanction()
    {
    	return $this->belongsTo('App\Sanction');
    }
}
