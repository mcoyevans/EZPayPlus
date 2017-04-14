<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\ThirteenthMonthPayEntry;
use App\ThirteenthMonthPayProcess;

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
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $thirteenth_month_pay_process = ThirteenthMonthPayProcess::where('id', $request->thirteenth_month_pay_process_id)->first();

        if($thirteenth_month_pay_process->locked || $thirteenth_month_pay_process->processed)
        {
            abort(403, 'Thirteenth month pay process already locked or processed.');
        }

        $duplicate = ThirteenthMonthPayEntry::where('employee_id', $request->employee_id)->where('thirteenth_month_pay_process_id', $request->thirteenth_month_pay_process_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_id' => 'required',
            'thirteenth_month_pay_process_id' => 'required',
            'net_pay' => 'required',
        ]);

        $thirteenth_month_pay_entry = new ThirteenthMonthPayEntry;

        $thirteenth_month_pay_entry->thirteenth_month_pay_process_id = $request->thirteenth_month_pay_process_id;
        $thirteenth_month_pay_entry->employee_id = $request->employee_id;
        $thirteenth_month_pay_entry->taxable_amount = $request->taxable_amount;
        $thirteenth_month_pay_entry->net_pay = $request->net_pay;

        $thirteenth_month_pay_entry->save();
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

        $thirteenth_month_pay_process = ThirteenthMonthPayProcess::where('id', $request->thirteenth_month_pay_process_id)->first();

        if($thirteenth_month_pay_process->locked || $thirteenth_month_pay_process->processed)
        {
            abort(403, 'Thirteenth month pay process already locked or processed.');
        }

        $duplicate = ThirteenthMonthPayEntry::whereNotIn('id', [$id])->where('employee_id', $request->employee_id)->where('thirteenth_month_pay_process_id', $request->thirteenth_month_pay_process_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_id' => 'required',
            'thirteenth_month_pay_process_id' => 'required',
            'net_pay' => 'required',
        ]);

        $thirteenth_month_pay_entry = ThirteenthMonthPayEntry::find($id);

        $thirteenth_month_pay_entry->taxable_amount = $request->taxable_amount;
        $thirteenth_month_pay_entry->net_pay = $request->net_pay;

        $thirteenth_month_pay_entry->save();
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

        $thirteenth_month_pay_entry = ThirteenthMonthPayEntry::with('thirteenth_month_pay_process')->where('id', $id)->first();

        if($thirteenth_month_pay_entry->thirteenth_month_pay_process->locked || $thirteenth_month_pay_entry->thirteenth_month_pay_process->processed)
        {
            abort(403, 'Unable toThirteenth month pay process already locked or processed.');
        }

        $thirteenth_month_pay_entry->delete();        
    }
}
