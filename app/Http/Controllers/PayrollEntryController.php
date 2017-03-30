<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\PayrollEntry;
use App\PayrollEntryEmployeeAllowanceType;
use App\PayrollEntryEmployeeDeductionType;
use App\PayrollEntryGovernmentContribution;
use App\PayrollProcess;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class PayrollEntryController extends Controller
{
    /**
     * Checks for duplicate entry.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? PayrollEntry::where('employee_id', $request->employee_id)->where('payroll_process_id', $request->payroll_process_id)->whereNotIn('id', [$request->id])->first() : PayrollEntry::where('batch_id', $request->batch_id)->where('payroll_id', $request->payroll_id)->first();
        
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $payroll_entries = PayrollEntry::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    if(isset($request->input('with')[$i]['whereBetween']))
                    {
                        $payroll_entries->with([$request->input('with')[$i]['relation'] => function($query) use($request, $i){
                            $query->whereBetween($request->input('with')[$i]['whereBetween']['label'], [Carbon::parse($request->input('with')[$i]['whereBetween']['start']), Carbon::parse($request->input('with')[$i]['whereBetween']['end'])]);
                        }]);

                        continue;
                    }

                    $payroll_entries->with($request->input('with')[$i]['relation']);
                }
                else{
                    $payroll_entries->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $payroll_entries->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereHas'))
        {
            
        }

        if($request->has('paginate'))
        {
            return $payroll_entries->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $payroll_entries->first();
        }

        return $payroll_entries->get();
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

        $payroll_process = PayrollProcess::with('payroll')->where('id', $request->payroll_process_id)->first();

        if($payroll_process->locked || $payroll_process->processed)
        {
            abort(403, 'Payroll process already locked or processed.');
        }

        $duplicate = PayrollEntry::where('employee_id', $request->employee_id)->where('payroll_process_id', $request->payroll_process_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_id' => 'required',
            'payroll_process_id' => 'required',
            'taxable_income' => 'required',
            'employee' => 'required',
            'regular_working_days' => 'required',
            'regular_working_hours' => 'required',
        ]);

        DB::transaction(function() use($request, $payroll_process){
            $payroll_entry = new PayrollEntry;

            $payroll_entry->payroll_process_id = $request->payroll_process_id;
            $payroll_entry->employee_id = $request->employee_id;

            $payroll_entry->define($request, $payroll_process);

            if($request->has('allowances'))
            {
                $payroll_entry->count_additional_earnings($request);
            }

            if($request->has('deductions'))
            {
                $payroll_entry->count_additional_deductions($request);                
            }

            if($request->has('government_contributions'))
            {
                $payroll_entry->count_government_contributions($request);  
            }

            $payroll_entry->gross_pay += $payroll_entry->additional_earnings;
            $payroll_entry->total_deductions = round($payroll_entry->government_deductions + $payroll_entry->additional_deductions, 2);
            $payroll_entry->net_pay = round($payroll_entry->gross_pay - $payroll_entry->total_deductions, 2);

            $payroll_entry->save();

            if($request->has('allowances'))
            {
                $payroll_entry->createAllowances($request);
            }

            if($request->has('deductions'))
            {
                $payroll_entry->createDeductions($request);   
            }

            if($request->has('government_contributions'))
            {
                $payroll_entry->createGovernmentContributions($request);
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
        if(Gate::forUser($request->user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $payroll_process = PayrollProcess::with('payroll')->where('id', $request->payroll_process_id)->first();

        if($payroll_process->locked || $payroll_process->processed)
        {
            abort(403, 'Payroll process already locked or processed.');
        }

        $duplicate = PayrollEntry::whereNotIn('id', [$id])->where('employee_id', $request->employee_id)->where('payroll_process_id', $request->payroll_process_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'employee_id' => 'required',
            'payroll_process_id' => 'required',
            'taxable_income' => 'required',
            'employee' => 'required',
            'regular_working_days' => 'required',
            'regular_working_hours' => 'required',
        ]);

        DB::transaction(function() use($request, $payroll_process, $id){
            $payroll_entry = PayrollEntry::find($id);

            $payroll_entry->define($request, $payroll_process);

            if(count('allowances'))
            {
                $payroll_entry->count_additional_earnings($request);
            }

            if(count('deductions'))
            {
                $payroll_entry->count_additional_deductions($request);                
            }

            if(count('government_contributions'))
            {
                $payroll_entry->count_government_contributions($request);  
            }

            $payroll_entry->gross_pay += $payroll_entry->additional_earnings;
            $payroll_entry->total_deductions = round($payroll_entry->government_deductions + $payroll_entry->additional_deductions, 2);
            $payroll_entry->net_pay = round($payroll_entry->gross_pay - $payroll_entry->total_deductions, 2);

            $payroll_entry->save();

            if(count('allowances'))
            {
                PayrollEntryEmployeeAllowanceType::where('payroll_entry_id', $id)->delete();

                $payroll_entry->createAllowances($request);
            }

            if(count('deductions'))
            {
                PayrollEntryEmployeeDeductionType::where('payroll_entry_id', $id)->delete();

                $payroll_entry->createDeductions($request);   
            }

            if(count('government_contributions'))
            {
                PayrollEntryGovernmentContribution::where('payroll_entry_id', $id)->delete();

                $payroll_entry->createGovernmentContributions($request);
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
        if(Gate::forUser(Auth::user())->denies('payroll'))
        {
            abort(403, 'Unauthorized action.');
        }

        $payroll_entry = PayrollEntry::with('payroll_process')->where('id', $id)->first();

        if($payroll_entry->payroll_process->locked || $payroll_entry->payroll_process->processed)
        {
            abort(403, 'Unable to delete payroll entry that was locked or processed.');
        }

        $payroll_entry->delete();

        PayrollEntryGovernmentContribution::where('payroll_entry_id', $id)->delete();
        PayrollEntryEmployeeAllowanceType::where('payroll_entry_id', $id)->delete();
        PayrollEntryEmployeeDeductionType::where('payroll_entry_id', $id)->delete();
    }
}
