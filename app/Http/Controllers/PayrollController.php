<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Payroll;
use App\GovernmentContribution;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class PayrollController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? Payroll::where('name', $request->name)->whereNotIn('id', [$request->id])->first() : Payroll::where('name', $request->name)->first();
        
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $payroll = Payroll::query();

        if($request->has('withTrashed'))
        {
            $payroll->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $payroll->with($request->input('with')[$i]['relation']);
                }
                else{
                    $payroll->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if($request->input('withCount')[$i]['whereBetween'])
                {
                    $payroll->withCount(['payroll_periods' => function($query) use($request, $i){
                        $query->whereBetween('start_cut_off', [Carbon::parse('first day of '. $request->input('withCount')[$i]['whereBetween']), Carbon::parse('last day of '. $request->input('withCount')[$i]['whereBetween'])]);
                    }]);

                    continue;
                }

                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $payroll->withCount($request->input('withCount')[$i]['relation']);
                }
                else{
                    $payroll->withCount([$request->input('withCount')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $payroll->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $payroll->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $payroll->first();
        }

        return $payroll->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Payroll::all();
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

        $duplicate = Payroll::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'working_days_per_year' => 'required|numeric',
            'working_hours_per_day' => 'required|numeric',
            'pay_frequency' => 'required',
            'time_interpretation_id' => 'required',
            'government_contributions' => 'required',
        ]);

        DB::transaction(function() use($request){
            $payroll = new Payroll;

            $payroll->name = $request->name;
            $payroll->description = $request->description;
            $payroll->working_days_per_year = $request->working_days_per_year;
            $payroll->working_hours_per_day = $request->working_hours_per_day;
            $payroll->pay_frequency = $request->pay_frequency;
            $payroll->time_interpretation_id = $request->time_interpretation_id;

            $payroll->save();

            for ($i=0; $i < count($request->government_contributions); $i++) { 
                $government_contribution = new GovernmentContribution;

                $government_contribution->payroll_id = $payroll->id;

                $government_contribution->name = $request->input('government_contributions')[$i]['name'];
                $government_contribution->first_cut_off = isset($request->input('government_contributions')[$i]['first_cut_off']) ? $request->input('government_contributions')[$i]['first_cut_off'] : 0;
                $government_contribution->second_cut_off = $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['second_cut_off']) ? $request->input('government_contributions')[$i]['second_cut_off'] : 0);
                $government_contribution->third_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['third_cut_off']) ? $request->input('government_contributions')[$i]['third_cut_off'] : 0);
                $government_contribution->fourth_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['fourth_cut_off']) ? $request->input('government_contributions')[$i]['fourth_cut_off'] : 0);

                $government_contribution->save();
            }
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

        $duplicate = Payroll::where('name', $request->name)->whereNotIn('id', [$id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'working_days_per_year' => 'required|numeric',
            'working_hours_per_day' => 'required|numeric',
            'pay_frequency' => 'required',
            'time_interpretation_id' => 'required',
            'government_contributions' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $payroll = Payroll::find($id);

            $payroll->name = $request->name;
            $payroll->description = $request->description;
            $payroll->working_days_per_year = $request->working_days_per_year;
            $payroll->working_hours_per_day = $request->working_hours_per_day;
            $payroll->pay_frequency = $request->pay_frequency;
            $payroll->time_interpretation_id = $request->time_interpretation_id;

            $payroll->save();

            for ($i=0; $i < count($request->government_contributions); $i++) { 
                if(!isset($request->input('government_contributions')[$i]['id']))
                {
                    $government_contribution = new GovernmentContribution;

                    $government_contribution->payroll_id = $payroll->id;

                    $government_contribution->name = $request->input('government_contributions')[$i]['name'];
                    $government_contribution->first_cut_off = isset($request->input('government_contributions')[$i]['first_cut_off']) ? $request->input('government_contributions')[$i]['first_cut_off'] : 0;
                    $government_contribution->second_cut_off = $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['second_cut_off']) ? $request->input('government_contributions')[$i]['second_cut_off'] : 0);
                    $government_contribution->third_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['third_cut_off']) ? $request->input('government_contributions')[$i]['third_cut_off'] : 0);
                    $government_contribution->fourth_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['fourth_cut_off']) ? $request->input('government_contributions')[$i]['fourth_cut_off'] : 0);

                    $government_contribution->save();
                }
                else{
                    $government_contribution = GovernmentContribution::find($request->input('government_contributions')[$i]['id']);

                    $government_contribution->name = $request->input('government_contributions')[$i]['name'];
                    $government_contribution->first_cut_off = isset($request->input('government_contributions')[$i]['first_cut_off']) ? $request->input('government_contributions')[$i]['first_cut_off'] : 0;
                    $government_contribution->second_cut_off = $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['second_cut_off']) ? $request->input('government_contributions')[$i]['second_cut_off'] : 0);
                    $government_contribution->third_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['third_cut_off']) ? $request->input('government_contributions')[$i]['third_cut_off'] : 0);
                    $government_contribution->fourth_cut_off = $payroll->pay_frequency == 'Semi-monthly' || $payroll->pay_frequency == 'Monthly' ? 0 : (isset($request->input('government_contributions')[$i]['fourth_cut_off']) ? $request->input('government_contributions')[$i]['fourth_cut_off'] : 0);

                    $government_contribution->save();
                }
            }
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
        if(Gate::forUser(Auth::user())->denies('settings-access'))
        {
            abort(403, 'Unauthorized action.');
        }

        $payroll = Payroll::with('payroll_periods')->where('id', $id)->first();

        if(count($payroll->payroll_periods))
        {
            abort(422, 'Unable to delete payroll.');
        }

        $payroll->delete();
    }
}
