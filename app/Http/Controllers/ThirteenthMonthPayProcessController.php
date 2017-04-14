<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\ThirteenthMonthPayProcess;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class ThirteenthMonthPayProcessController extends Controller
{
    /**
     * Locks thirteenth month pay process.
     *
     * @return bool
     */
    public function lock(Request $request)
    {
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized access.');
        }

        $thirteenth_month_pay_process = ThirteenthMonthPayProcess::findOrFail($request->id);

        $thirteenth_month_pay_process->locked = true;

        $thirteenth_month_pay_process->save();
    }

    /**
     * Check resource for duplicate entry or conflicts.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        if($request->id)
        {
            $thirteenth_month_pay_process = ThirteenthMonthPayProcess::whereNotIn('id', [$request->id])->where('batch_id', $request->batch_id)->where(function($query) use($request){
                // in between 
                $query->where('start', '<=', Carbon::parse($request->start))->where('end', '>=', Carbon::parse($request->end));
                // overlap on start of 
                $query->orWhereBetween('start', [Carbon::parse($request->start), Carbon::parse($request->end)]);
                // overlap on end of 
                $query->orWhereBetween('end', [Carbon::parse($request->start), Carbon::parse($request->end)]);
            })->first();
        }
        else{
            $thirteenth_month_pay_process = ThirteenthMonthPayProcess::where('batch_id', $request->batch_id)->where(function($query) use($request){
                // in between 
                $query->where('start', '<=', Carbon::parse($request->start))->where('end', '>=', Carbon::parse($request->end));
                // overlap on start of 
                $query->orWhereBetween('start', [Carbon::parse($request->start), Carbon::parse($request->end)]);
                // overlap on end of 
                $query->orWhereBetween('end', [Carbon::parse($request->start), Carbon::parse($request->end)]);
            })->first();
        }


        return $thirteenth_month_pay_process;

        // return response()->json($thirteenth_month_pay_process ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $thirteenth_month_pay_processes = ThirteenthMonthPayProcess::query();

        if($request->has('withTrashed'))
        {
            $thirteenth_month_pay_processes->withTrashed();
        }

        if($request->has('with'))
        {
            foreach ($request->with as $key => $with) {
                if(!$with['withTrashed'])
                {
                    $thirteenth_month_pay_processes->with($with['relation']);
                }
                else{
                    $thirteenth_month_pay_processes->with([$with['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            foreach ($request->where as $key => $where) {
                $thirteenth_month_pay_processes->where($where['label'], $where['condition'], $where['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $thirteenth_month_pay_processes->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $thirteenth_month_pay_processes->first();
        }

        return $thirteenth_month_pay_processes->get();
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
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $start = Carbon::parse($request->start);
        $end = Carbon::parse($request->end);

        $duplicate = ThirteenthMonthPayProcess::where('batch_id', $request->batch_id)->where(function($query) use($start, $end){
            // in between 
            $query->where('start', '<=', $start)->where('end', '>=', $end);
            // overlap on start of 
            $query->orWhereBetween('start', [$start, $end]);
            // overlap on end of 
            $query->orWhereBetween('end', [$start, $end]);
        })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'batch_id' => 'required',
            'start' => 'required',
            'end' => 'required',
            'payout' => 'required',
        ]);

        $thirteenth_month_pay_process = new ThirteenthMonthPayProcess;

        $thirteenth_month_pay_process->batch_id = $request->batch_id;        
        $thirteenth_month_pay_process->start = $start;        
        $thirteenth_month_pay_process->end = $end;        
        $thirteenth_month_pay_process->payout = Carbon::parse($request->payout);

        $thirteenth_month_pay_process->save();           
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
        // Authorization check
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $start = Carbon::parse($request->start);
        $end = Carbon::parse($request->end);

        // Duplicate check
        $duplicate = ThirteenthMonthPayProcess::whereNotIn('id', [$id])->where('batch_id', $request->batch_id)->where(function($query) use($start, $end){
            // in between 
            $query->where('start', '<=', $start)->where('end', '>=', $end);
            // overlap on start of 
            $query->orWhereBetween('start', [$start, $end]);
            // overlap on end of 
            $query->orWhereBetween('end', [$start, $end]);
        })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        // associated relation check
        $thirteenth_month_pay_process = ThirteenthMonthPayProcess::withCount('thirteenth_month_pay_entries')->where('id', $id)->first();

        if($thirteenth_month_pay_process->thirteenth_month_pay_entries_count)
        {
            abort(403, 'Unable to modify thirteenth month pay process with associated entries.');
        }
        
        // validation
        $this->validate($request, [
            'batch_id' => 'required',
            'start' => 'required',
            'end' => 'required',
            'payout' => 'required',
        ]);

        $thirteenth_month_pay_process->batch_id = $request->batch_id;        
        $thirteenth_month_pay_process->start = $start;        
        $thirteenth_month_pay_process->end = $end;        
        $thirteenth_month_pay_process->payout = Carbon::parse($request->payout);

        $thirteenth_month_pay_process->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Gate::forUser(Auth::user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $thirteenth_month_pay_process = ThirteenthMonthPayProcess::withCount('thirteenth_month_pay_entries')->where('id', $id)->first();

        if($thirteenth_month_pay_process->thirteenth_month_pay_entries_count)
        {
            abort(403, 'Unable to delete thirteenth month pay process with associated entries.');
        }

        $thirteenth_month_pay_process->delete();
    }
}
