<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Auth;
use DB;
use Gate;
use App\Customer;
use App\Traits\Enlist;


class CustomerController extends Controller
{
    use Enlist;  

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $this->model = Customer::query();

        $this->populate($request);

        if($request->has('first'))
        {
            return $this->model->first();
        }

        if($request->has('paginate'))
        {
            return $this->model->paginate($request->paginate);
        }

        return $this->model->get();  
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(Gate::forUser($request->user())->denies('bookkeeping'))
        {
            abort(403, 'Unauthorized access.');
        }

        $this->validate($request, [
            'type' => 'required',
            'city' => 'required',
            'province_id' => 'required',
            'mobile_number' => 'required',
        ]);

        DB::transaction(function() use($request){
            $customer = new Customer;

            $customer->type = $request->type;
            $customer->first_name = $request->first_name;
            $customer->middle_name = $request->middle_name;
            $customer->last_name = $request->last_name;
            $customer->suffix = $request->suffix;
            $customer->corporation_name = $request->corporation_name;
            $customer->contact_person = $request->contact_person;
            $customer->tin = $request->tin;
            $customer->street_address = $request->street_address;
            $customer->city_id = \App\City::where('name', $request->city)->firstOrFail()->id;
            $customer->province_id = $request->province_id;
            $customer->country_id = $request->country_id;
            $customer->postal_code = $request->postal_code;
            $customer->telephone_number = $request->telephone_number;
            $customer->mobile_number = $request->mobile_number;
            $customer->email_address = $request->email_address;

            $customer->save();
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'type' => 'required',
            'city' => 'required',
            'province_id' => 'required',
            'mobile_number' => 'required',
        ]);

        DB::transaction(function() use($request){
            $customer = new Customer;

            $customer->type = $request->type;
            $customer->first_name = $request->first_name;
            $customer->middle_name = $request->middle_name;
            $customer->last_name = $request->last_name;
            $customer->suffix = $request->suffix;
            $customer->corporation_name = $request->corporation_name;
            $customer->contact_person = $request->contact_person;
            $customer->tin = $request->tin;
            $customer->street_address = $request->street_address;
            $customer->city = \App\City::where('name', $request->city)->firstOrFail()->id;
            $customer->province_id = $request->province_id;
            $customer->country_id = $request->country_id;
            $customer->postal_code = $request->postal_code;
            $customer->telephone_number = $request->telephone_number;
            $customer->mobile_number = $request->mobile_number;
            $customer->email_address = $request->email_address;

            $customer->save();
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
