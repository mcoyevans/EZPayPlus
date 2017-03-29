<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\ThirteenthMonthPayEntry;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class ThirteenthMonthPayEntryController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $thirteenth_month_pay_entries = ThirteenthMonthPayEntry::query();

        if($request->has('withTrashed'))
        {
            $thirteenth_month_pay_entries->withTrashed();
        }

        if($request->has('with'))
        {
            foreach ($request->with as $key => $with) {
                if(!$with['withTrashed'])
                {
                    $thirteenth_month_pay_entries->with($with['relation']);
                }
                else{
                    $thirteenth_month_pay_entries->with([$with['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            foreach ($request->where as $key => $where) {
                $thirteenth_month_pay_entries->where($where['label'], $where['condition'], $where['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $thirteenth_month_pay_entries->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $thirteenth_month_pay_entries->first();
        }

        return $thirteenth_month_pay_entries->get();
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
        //
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
        //
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
