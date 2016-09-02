<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    public function tax_code()
    {
    	return $this->belongsTo('App\TaxCode');
    }
}
