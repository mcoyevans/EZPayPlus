<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SanctionLevel extends Model
{
    public function sanction()
    {
    	return $this->belongsTo('App\SanctionType');
    }
}
