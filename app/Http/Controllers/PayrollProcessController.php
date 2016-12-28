<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\PayrollProcess;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class PayrollProcessController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? PayrollProcess::where('batch_id', $request->batch_id)->where('payroll_id', $request->payroll_id)->where('payroll_period_id', $request->payroll_period_id)->whereNotIn('id', [$request->id])->first() : PayrollProcess::where('batch_id', $request->batch_id)->where('payroll_id', $request->payroll_id)->where('payroll_period_id', $request->payroll_period_id)->first();
        
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $payroll_processes = PayrollProcess::query();

        if($request->has('withTrashed'))
        {
            $payroll_processes->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $payroll_processes->with($request->input('with')[$i]['relation']);
                }
                else{
                    $payroll_processes->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $payroll_processes->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('paginate'))
        {
            return $payroll_processes->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $payroll_processes->first();
        }

        return $payroll_processes->get();
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

        $duplicate = PayrollProcess::where('batch_id', $request->batch_id)->where('payroll_id', $request->payroll_id)->where('payroll_period_id', $request->payroll_period_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'batch_id' => 'required',
            'payroll_id' => 'required',
            'payroll_period_id' => 'required',
        ]);

        $payroll_process = new PayrollProcess;

        $payroll_process->batch_id = $request->batch_id;
        $payroll_process->payroll_id = $request->payroll_id;
        $payroll_process->payroll_period_id = $request->payroll_period_id;
        $payroll_process->locked = false;

        $payroll_process->save();
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
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = PayrollProcess::whereNotIn('id', $id)->where('batch_id', $request->batch_id)->where('payroll_id', $request->payroll_id)->where('payroll_period_id', $request->payroll_period_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'batch_id' => 'required',
            'payroll_id' => 'required',
            'payroll_period_id' => 'required',
        ]);

        $payroll_process = PayrollProcess::find($id);

        if($payroll_process->locked)
        {
            abort(403, 'Payroll process is already locked');
        }

        $payroll_process->batch_id = $request->batch_id;
        $payroll_process->payroll_id = $request->payroll_id;
        $payroll_process->payroll_period_id = $request->payroll_period_id;
        $payroll_process->locked = false;

        $payroll_process->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $payroll_process = PayrollProcess::find($id);
        
        if(Gate::forUser(Auth::user())->denies('payroll') || $payroll_process->locked)
        {
            abort(403, 'Unauthorized action.');
        }

        $payroll_process->delete();
    }
}
