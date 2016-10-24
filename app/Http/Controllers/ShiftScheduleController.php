<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\ShiftSchedule;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class ShiftScheduleController extends Controller
{
    /**
     * Checks for duplicate bank account number entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->has('id') ? ShiftSchedule::where('date_start', $request->date_start)->where('date_end', $request->date_end)->where('shift_start', $request->shift_start)->where('shift_end', $request->shift_end)->where('hours_break', $request->hours_break)->whereNotIn('id', [$request->id])->first() : ShiftSchedule::where('date_start', $request->date_start)->where('date_end', $request->date_end)->where('shift_start', $request->shift_start)->where('shift_end', $request->shift_end)->where('hours_break', $request->hours_break)->first();

        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    
    public function enlist(Request $request)
    {
        $shift_schedules = ShiftSchedule::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $shift_schedules->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $shift_schedules->withCount($request->input('withCount')[$i]['relation']);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $shift_schedules->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $shift_schedules->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $shift_schedules->first();
        }

        return $shift_schedules->get();
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */

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
        if(!Gate::forUser($request->user())->allows('settings-access'))
        {
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'date_start' =>'required',
            'date_end' =>'required',
            'shift_start' =>'required',
            'shift_end' =>'required',
            'hours_break' =>'required',
        ]);

        DB::transaction(function() use($request){
            $shift_schedule = ShiftSchedule::firstorCreate([
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'shift_start' => $request->shift_start,
                'shift_end' => $request->shift_end,
                'hours_break' => $request->hours_break,
            ]);
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
        return ShiftSchedule::where('id', $id)->first();
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
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'date_start' =>'required',
            'date_end' =>'required',
            'shift_start' =>'required',
            'shift_end' =>'required',
            'hours_break' =>'required',
        ]);

        $duplicate = ShiftSchedule::where('date_start', $request->date_start)->where('date_end', $request->date_end)->where('shift_start', $request->shift_start)->where('shift_end', $request->shift_end)->where('hours_break', $request->hours_break)->whereNotIn('id', [$request->id])->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        DB::transaction(function() use($request, $id){
            $shift_schedule = ShiftSchedule::where('id', $id)->first();

            $shift_schedule->date_start = $request->date_start;
            $shift_schedule->date_end = $request->date_end;
            $shift_schedule->shift_start = $request->shift_start;
            $shift_schedule->shift_end = $request->shift_end;
            $shift_schedule->hours_break = $request->hours_break;

            $shift_schedule->save();
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
