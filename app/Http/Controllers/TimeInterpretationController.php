<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\TimeInterpretation;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class TimeInterpretationController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? TimeInterpretation::where('name', $request->name)->whereNotIn('id', $request->id)->first() : TimeInterpretation::where('name', $request->name)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $time_interpretations = TimeInterpretation::query();

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $time_interpretations->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $time_interpretations->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('paginate'))
        {
            return $time_interpretations->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $time_interpretations->first();
        }

        return $time_interpretations->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return TimeInterpretation::all();
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
        if(!Gate::forUser($request->user())->allows('settings-access'))
        {
            abort(403, 'Unathorized action');
        }

        $duplicate = TimeInterpretation::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'regular_working_hours' => 'required|numeric',
            'night_differential' => 'required|numeric',
            'overtime' => 'required|numeric',
            'overtime_night_differential' => 'required|numeric',
            'rest_day_rate' => 'required|numeric',
            'rest_day_night_differential' => 'required|numeric',
            'rest_day_overtime' => 'required|numeric',
            'rest_day_overtime_night_differential' => 'required|numeric',
            'regular_holiday_rate' => 'required|numeric',
            'regular_holiday_night_differential' => 'required|numeric',
            'regular_holiday_overtime' => 'required|numeric',
            'regular_holiday_overtime_night_differential' => 'required|numeric',
            'regular_holiday_rest_day_rate' => 'required|numeric',
            'regular_holiday_rest_day_night_differential' => 'required|numeric',
            'regular_holiday_rest_day_overtime' => 'required|numeric',
            'regular_holiday_rest_day_overtime_night_differential' => 'required|numeric',
            'special_holiday_rate' => 'required|numeric',
            'special_holiday_night_differential' => 'required|numeric',
            'special_holiday_overtime' => 'required|numeric',
            'special_holiday_overtime_night_differential' => 'required|numeric',
            'special_holiday_rest_day_rate' => 'required|numeric',
            'special_holiday_rest_day_night_differential' => 'required|numeric',
            'special_holiday_rest_day_overtime' => 'required|numeric',
            'special_holiday_rest_day_overtime_night_differential' => 'required|numeric',
        ]);

        $time_interpretation = new TimeInterpretation;

        $time_interpretation->name = $request->name;
        $time_interpretation->regular_working_hours = $request->regular_working_hours;
        $time_interpretation->night_differential = $request->night_differential;
        $time_interpretation->overtime = $request->overtime;
        $time_interpretation->overtime_night_differential = $request->overtime_night_differential;
        $time_interpretation->rest_day_rate = $request->rest_day_rate;
        $time_interpretation->rest_day_night_differential = $request->rest_day_night_differential;
        $time_interpretation->rest_day_overtime = $request->rest_day_overtime;
        $time_interpretation->rest_day_overtime_night_differential = $request->rest_day_overtime_night_differential;

        $time_interpretation->regular_holiday_rate = $request->regular_holiday_rate;
        $time_interpretation->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
        $time_interpretation->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;
        $time_interpretation->regular_holiday_night_differential = $request->regular_holiday_night_differential;
        $time_interpretation->regular_holiday_overtime = $request->regular_holiday_overtime;
        $time_interpretation->regular_holiday_overtime_night_differential = $request->regular_holiday_overtime_night_differential;
        $time_interpretation->regular_holiday_rest_day_rate = $request->regular_holiday_rest_day_rate;
        $time_interpretation->regular_holiday_rest_day_night_differential = $request->regular_holiday_rest_day_night_differential;
        $time_interpretation->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
        $time_interpretation->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;

        $time_interpretation->special_holiday_rate = $request->special_holiday_rate;
        $time_interpretation->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
        $time_interpretation->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;
        $time_interpretation->special_holiday_night_differential = $request->special_holiday_night_differential;
        $time_interpretation->special_holiday_overtime = $request->special_holiday_overtime;
        $time_interpretation->special_holiday_overtime_night_differential = $request->special_holiday_overtime_night_differential;
        $time_interpretation->special_holiday_rest_day_rate = $request->special_holiday_rest_day_rate;
        $time_interpretation->special_holiday_rest_day_night_differential = $request->special_holiday_rest_day_night_differential;
        $time_interpretation->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
        $time_interpretation->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;

        $time_interpretation->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return TimeInterpretation::where('id', $id)->first();
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
        if(!Gate::forUser($request->user())->allows('settings-access'))
        {
            abort(403, 'Unathorized action');
        }

        $duplicate = TimeInterpretation::where('name', $request->name)->whereNotIn('id', [$id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
            'regular_working_hours' => 'required|numeric',
            'night_differential' => 'required|numeric',
            'overtime' => 'required|numeric',
            'overtime_night_differential' => 'required|numeric',
            'rest_day_rate' => 'required|numeric',
            'rest_day_night_differential' => 'required|numeric',
            'rest_day_overtime' => 'required|numeric',
            'rest_day_overtime_night_differential' => 'required|numeric',
            'regular_holiday_rate' => 'required|numeric',
            'regular_holiday_night_differential' => 'required|numeric',
            'regular_holiday_overtime' => 'required|numeric',
            'regular_holiday_overtime_night_differential' => 'required|numeric',
            'regular_holiday_rest_day_rate' => 'required|numeric',
            'regular_holiday_rest_day_night_differential' => 'required|numeric',
            'regular_holiday_rest_day_overtime' => 'required|numeric',
            'regular_holiday_rest_day_overtime_night_differential' => 'required|numeric',
            'special_holiday_rate' => 'required|numeric',
            'special_holiday_night_differential' => 'required|numeric',
            'special_holiday_overtime' => 'required|numeric',
            'special_holiday_overtime_night_differential' => 'required|numeric',
            'special_holiday_rest_day_rate' => 'required|numeric',
            'special_holiday_rest_day_night_differential' => 'required|numeric',
            'special_holiday_rest_day_overtime' => 'required|numeric',
            'special_holiday_rest_day_overtime_night_differential' => 'required|numeric',
        ]);

        $time_interpretation = TimeInterpretation::where('id', $id)->first();

        $time_interpretation->name = $request->name;
        $time_interpretation->regular_working_hours = $request->regular_working_hours;
        $time_interpretation->night_differential = $request->night_differential;
        $time_interpretation->overtime = $request->overtime;
        $time_interpretation->overtime_night_differential = $request->overtime_night_differential;
        $time_interpretation->rest_day_rate = $request->rest_day_rate;
        $time_interpretation->rest_day_night_differential = $request->rest_day_night_differential;
        $time_interpretation->rest_day_overtime = $request->rest_day_overtime;
        $time_interpretation->rest_day_overtime_night_differential = $request->rest_day_overtime_night_differential;

        $time_interpretation->regular_holiday_rate = $request->regular_holiday_rate;
        $time_interpretation->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
        $time_interpretation->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;
        $time_interpretation->regular_holiday_night_differential = $request->regular_holiday_night_differential;
        $time_interpretation->regular_holiday_overtime = $request->regular_holiday_overtime;
        $time_interpretation->regular_holiday_overtime_night_differential = $request->regular_holiday_overtime_night_differential;
        $time_interpretation->regular_holiday_rest_day_rate = $request->regular_holiday_rest_day_rate;
        $time_interpretation->regular_holiday_rest_day_night_differential = $request->regular_holiday_rest_day_night_differential;
        $time_interpretation->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
        $time_interpretation->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;

        $time_interpretation->special_holiday_rate = $request->special_holiday_rate;
        $time_interpretation->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
        $time_interpretation->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;
        $time_interpretation->special_holiday_night_differential = $request->special_holiday_night_differential;
        $time_interpretation->special_holiday_overtime = $request->special_holiday_overtime;
        $time_interpretation->special_holiday_overtime_night_differential = $request->special_holiday_overtime_night_differential;
        $time_interpretation->special_holiday_rest_day_rate = $request->special_holiday_rest_day_rate;
        $time_interpretation->special_holiday_rest_day_night_differential = $request->special_holiday_rest_day_night_differential;
        $time_interpretation->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
        $time_interpretation->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;

        $time_interpretation->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(!Gate::forUser(Auth::user())->allows('settings-access') || $id == 1 || $id == 2)
        {
            abort(403, 'Unathorized action');
        }

        TimeInterpretation::where('id', $id)->delete();
    }
}
