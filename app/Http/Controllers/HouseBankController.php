<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\HouseBank;

use Auth;
use DB;
use Carbon\Carbon;

class HouseBankController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        if($request->has('bank_account_number'))
        {
            $duplicate = $request->has('id') ? HouseBank::where('bank_account_number', $request->bank_account_number)->whereNotIn('id', [$request->id])->first() : HouseBank::where('bank_account_number', $request->bank_account_number)->first();

            return response()->json($duplicate ? true : false);
        }
        else if($request->has('gl_account'))
        {
            $duplicate = $request->has('id') ? HouseBank::where('gl_account', $request->gl_account)->whereNotIn('id', [$request->id])->first() : HouseBank::where('gl_account', $request->gl_account)->first();

            return response()->json($duplicate ? true : false);   
        }
    }
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $house_banks = HouseBank::query();

        if($request->has('withTrashed'))
        {
            $house_banks->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $house_banks->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $house_banks->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $house_banks->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $house_banks->first();
        }

        return $house_banks->get();
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
        $this->authorize('create', HouseBank::class);

        $this->validate($request, [
            'name' => 'required',
            'bank_branch' => 'required',
            'bank_account_number' => 'required',
            'bank_account_name' => 'required',
            'gl_account' => 'required',
            'currency.id' => 'required|numeric',
        ]);

        $duplicate = HouseBank::where('gl_account', $request->gl_account)->orWhere('bank_account_number', $request->bank_account_number)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $house_bank = new HouseBank;

        $house_bank->name = $request->name;
        $house_bank->bank_branch = $request->bank_branch;
        $house_bank->bank_account_number = $request->bank_account_number;
        $house_bank->bank_account_name = $request->bank_account_name;
        $house_bank->gl_account = $request->gl_account;
        $house_bank->currency_id = $request->input('currency.id');

        $house_bank->save();
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
        $this->authorize('create', HouseBank::class);

        $this->validate($request, [
            'name' => 'required',
            'bank_branch' => 'required',
            'bank_account_number' => 'required',
            'bank_account_name' => 'required',
            'gl_account' => 'required',
            'currency.id' => 'required|numeric',
        ]);

        $duplicate = HouseBank::where(function($query) use ($request, $id){
                $query->whereNotIn('id', [$id])->where('gl_account', $request->gl_account);
            })
            ->orWhere(function($query) use ($request, $id){
                $query->whereNotIn('id', [$id])->where('bank_account_number', $request->bank_account_number);
            })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $house_bank = HouseBank::where('id', $id)->first();

        $house_bank->name = $request->name;
        $house_bank->bank_branch = $request->bank_branch;
        $house_bank->bank_account_number = $request->bank_account_number;
        $house_bank->bank_account_name = $request->bank_account_name;
        $house_bank->gl_account = $request->gl_account;
        $house_bank->currency_id = $request->input('currency.id');

        $house_bank->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->authorize('create', HouseBank::class);

        HouseBank::where('id', $id)->delete();
    }
}
