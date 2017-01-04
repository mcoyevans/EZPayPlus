<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Payroll;
use App\PayrollPeriod;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class PayrollPeriodController extends Controller
{
    /**
     * Checks the time start and end availability.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $start = Carbon::parse($request->start_cut_off);
        $end = Carbon::parse($request->end_cut_off);

        $new = PayrollPeriod::where('payroll_id', $request->payroll_id)->where(function($query) use($start, $end){
            // in between
            $query->where('start_cut_off', '<=', $start)->where('end_cut_off', '>=', $end);
            // overlap on start
            $query->orWhereBetween('start_cut_off', [$start, $end]);
            // overlap on end
            $query->orWhereBetween('end_cut_off', [$start, $end]);
        })->first();

        $existing = PayrollPeriod::where('payroll_id', $request->payroll_id)->whereNotIn('id', [$request->id])->where(function($query) use($start, $end){
            // in between
            $query->where('start_cut_off', '<=', $start)->where('end_cut_off', '>=', $end);
            // overlap on start
            $query->orWhereBetween('start_cut_off', [$start, $end]);
            // overlap on end
            $query->orWhereBetween('end_cut_off', [$start, $end]);
        })->first();

        $payroll_period = $request->id ? $existing : $new;

        return response()->json($payroll_period ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $payroll_periods = PayrollPeriod::query();

        if($request->has('withTrashed'))
        {
            $payroll_periods->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $payroll_periods->with($request->input('with')[$i]['relation']);
                }
                else{
                    $payroll_periods->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $payroll_periods->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereDoesntHave'))
        {
            for ($i=0; $i < count($request->whereDoesntHave); $i++) { 
                $payroll_periods->whereDoesntHave($request->input('whereDoesntHave')[$i]['relation'], function($query) use($request, $i){
                    for ($j=0; $j < count($request->input('whereDoesntHave')[$i]['where']); $j++) { 
                        $query->where($request->input('whereDoesntHave')[$i]['where'][$j]['label'], $request->input('whereDoesntHave')[$i]['where'][$j]['condition'], $request->input('whereDoesntHave')[$i]['where'][$j]['value']);
                    }
                });
            }
        }

        if($request->has('orWhere'))
        {
            for ($i=0; $i < count($request->orWhere); $i++) { 
                $payroll_periods->orWhere($request->input('orWhere')[$i]['label'], $request->input('orWhere')[$i]['condition'], $request->input('orWhere')[$i]['value']);
            }
        }

        if($request->has('orderBy'))
        {
            for ($i=0; $i < count($request->orderBy); $i++) { 
                $payroll_periods->orderBy($request->input('orderBy')[$i]['column'], $request->input('orderBy')[$i]['order']);
            }
        }

        if($request->has('paginate'))
        {
            return $payroll_periods->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $payroll_periods->first();
        }

        return $payroll_periods->get();
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
        if(Gate::forUser($request->user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'payroll_id' => 'required',
            'start_cut_off' => 'required',
            'end_cut_off' => 'required',
            'payout' => 'required',
        ]);

        $start = Carbon::parse($request->start_cut_off);
        $end = Carbon::parse($request->end_cut_off);

        $duplicate = PayrollPeriod::where('payroll_id', $request->payroll_id)->where(function($query) use($start, $end){
            // in between
            $query->where('start_cut_off', '<=', $start)->where('end_cut_off', '>=', $end);
            // overlap on start
            $query->orWhereBetween('start_cut_off', [$start, $end]);
            // overlap on end
            $query->orWhereBetween('end_cut_off', [$start, $end]);
        })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $start, $end){
            $payroll_period = new PayrollPeriod;

            $payroll_period->payroll_id = $request->payroll_id;
            $payroll_period->start_cut_off = Carbon::parse($request->start_cut_off);
            $payroll_period->end_cut_off = Carbon::parse($request->end_cut_off);
            $payroll_period->payout = Carbon::parse($request->payout);
            
            $payroll = Payroll::findOrFail($request->payroll_id);

            $first_day_of_the_month = Carbon::parse('first day of ' . date_format(date_create($start->toDateString()), 'F') . ' ' . date_format(date_create($start->toDateString()), 'Y'));

            if ($payroll->pay_frequency == 'Weekly') {
                if($start->between($first_day_of_the_month, $first_day_of_the_month->addDays(6)))
                {
                    $payroll_period->cut_off = 'first';
                }
            }
            else if($payroll->pay_frequency == 'Semi-monthly')
            {   
                $last_day_of_the_month = Carbon::parse('last day of ' . date_format(date_create($start->toDateString()), 'F') . ' ' . date_format(date_create($start->toDateString()), 'Y'));
                $middle_of_the_month = Carbon::parse($first_day_of_the_month->average($last_day_of_the_month));

                if($start->lt($middle_of_the_month))
                {
                    $payroll_period->cut_off = 'first';
                }
                else
                {
                    $payroll_period->cut_off = 'second'; 
                }
            }
            else if($payroll->pay_frequency == 'Monthly')
            {
                $payroll_period->cut_off = 'first';
            }

            $payroll_period->save();

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
        if(Gate::forUser($request->user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'payroll_id' => 'required',
            'start_cut_off' => 'required',
            'end_cut_off' => 'required',
            'payout' => 'required',
        ]);

        $start = Carbon::parse($request->start_cut_off);
        $end = Carbon::parse($request->end_cut_off);

        $duplicate = PayrollPeriod::whereNotIn('id', [$id])->where('payroll_id', $request->payroll_id)->where(function($query) use($start, $end){
            // in between
            $query->where('start_cut_off', '<=', $start)->where('end_cut_off', '>=', $end);
            // overlap on start
            $query->orWhereBetween('start_cut_off', [$start, $end]);
            // overlap on end
            $query->orWhereBetween('end_cut_off', [$start, $end]);
        })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $payroll_period = PayrollPeriod::find($id);

        $payroll_period->payroll_id = $request->payroll_id;
        $payroll_period->start_cut_off = Carbon::parse($request->start_cut_off);
        $payroll_period->end_cut_off = Carbon::parse($request->end_cut_off);
        $payroll_period->payout = Carbon::parse($request->payout);

        $payroll_period->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Gate::forUser(Auth::user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        PayrollPeriod::where('id', $id)->delete();
    }
}
