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
        ]);

        DB::transaction(function() use($request, $payroll_process){
            $payroll_entry = new PayrollEntry;

            $payroll_entry->payroll_process_id = $request->payroll_process_id;
            $payroll_entry->employee_id = $request->employee_id;
            $payroll_entry->days_absent = $request->days_absent;
            $payroll_entry->hours_tardy = $request->hours_tardy;

            // Hours
            
            $payroll_entry->regular_working_hours = $request->regular_working_hours;
            $payroll_entry->night_differential = $request->night_differential;
            $payroll_entry->overtime = $request->overtime;
            $payroll_entry->overtime_night_differential = $request->overtime_night_differential;
            
            $payroll_entry->rest_day = $request->rest_day;
            $payroll_entry->rest_day_night_differential = $request->rest_day_night_differential;
            $payroll_entry->rest_day_overtime = $request->rest_day_overtime;
            $payroll_entry->rest_day_overtime_night_differential = $request->rest_day_overtime_night_differential;

            $payroll_entry->regular_holiday = $request->regular_holiday;
            $payroll_entry->regular_holiday_night_differential = $request->regular_holiday_night_differential;
            $payroll_entry->regular_holiday_overtime = $request->regular_holiday_overtime;
            $payroll_entry->regular_holiday_overtime_night_differential = $request->regular_holiday_overtime_night_differential;

            $payroll_entry->regular_holiday_rest_day = $request->regular_holiday_rest_day;
            $payroll_entry->regular_holiday_rest_day_night_differential = $request->regular_holiday_rest_day_night_differential;
            $payroll_entry->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
            $payroll_entry->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;

            $payroll_entry->special_holiday = $request->special_holiday;
            $payroll_entry->special_holiday_night_differential = $request->special_holiday_night_differential;
            $payroll_entry->special_holiday_overtime = $request->special_holiday_overtime;
            $payroll_entry->special_holiday_overtime_night_differential = $request->special_holiday_overtime_night_differential;

            $payroll_entry->special_holiday_rest_day = $request->special_holiday_rest_day;
            $payroll_entry->special_holiday_rest_day_night_differential = $request->special_holiday_rest_day_night_differential;
            $payroll_entry->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
            $payroll_entry->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;

            // Pay

            $payroll_entry->regular_working_hours_pay = round($request->regular_working_hours_pay, 2);
            $payroll_entry->night_differential_pay = round($request->night_differential_pay, 2);
            $payroll_entry->overtime_pay = round($request->overtime_pay, 2);
            $payroll_entry->overtime_night_differential_pay = round($request->overtime_night_differential_pay, 2);
            
            $payroll_entry->rest_day_pay = round($request->rest_day_pay, 2);
            $payroll_entry->rest_day_night_differential_pay = round($request->rest_day_night_differential_pay, 2);
            $payroll_entry->rest_day_overtime_pay = round($request->rest_day_overtime_pay, 2);
            $payroll_entry->rest_day_overtime_night_differential_pay = round($request->rest_day_overtime_night_differential_pay, 2);

            $payroll_entry->regular_holiday_pay = round($request->regular_holiday_pay, 2);
            $payroll_entry->regular_holiday_night_differential_pay = round($request->regular_holiday_night_differential_pay, 2);
            $payroll_entry->regular_holiday_overtime_pay = round($request->regular_holiday_overtime_pay, 2);
            $payroll_entry->regular_holiday_overtime_night_differential_pay = round($request->regular_holiday_overtime_night_differential_pay, 2);

            $payroll_entry->regular_holiday_rest_day_pay = round($request->regular_holiday_rest_day_pay, 2);
            $payroll_entry->regular_holiday_rest_day_night_differential_pay = round($request->regular_holiday_rest_day_night_differential_pay, 2);
            $payroll_entry->regular_holiday_rest_day_overtime_pay = round($request->regular_holiday_rest_day_overtime_pay, 2);
            $payroll_entry->regular_holiday_rest_day_overtime_night_differential_pay = round($request->regular_holiday_rest_day_overtime_night_differential_pay, 2);

            $payroll_entry->special_holiday_pay = round($request->special_holiday_pay, 2);
            $payroll_entry->special_holiday_night_differential_pay = round($request->special_holiday_night_differential_pay, 2);
            $payroll_entry->special_holiday_overtime_pay = round($request->special_holiday_overtime_pay, 2);
            $payroll_entry->special_holiday_overtime_night_differential_pay = round($request->special_holiday_overtime_night_differential_pay, 2);

            $payroll_entry->special_holiday_rest_day_pay = round($request->special_holiday_rest_day_pay, 2);
            $payroll_entry->special_holiday_rest_day_night_differential_pay = round($request->special_holiday_rest_day_night_differential_pay, 2);
            $payroll_entry->special_holiday_rest_day_overtime_pay = round($request->special_holiday_rest_day_overtime_pay, 2);
            $payroll_entry->special_holiday_rest_day_overtime_night_differential_pay = round($request->special_holiday_rest_day_overtime_night_differential_pay, 2);

            $payroll_entry->tardy = round($request->tardy, 2);
            $payroll_entry->absent = round($request->absent, 2);
            $payroll_entry->taxable_income = round($request->taxable_income, 2);
            
            $payroll_entry->gross_pay = $payroll_entry->regular_working_hours_pay - $payroll_entry->tardy - $payroll_entry->absent + $payroll_entry->night_differential_pay + $payroll_entry->overtime_pay + $payroll_entry->overtime_night_differential_pay + $payroll_entry->rest_day_pay + $payroll_entry->rest_day_overtime_pay + $payroll_entry->rest_day_night_differential_pay + $payroll_entry->rest_day_overtime_night_differential_pay + $payroll_entry->regular_holiday_pay + $payroll_entry->regular_holiday_overtime_pay + $payroll_entry->regular_holiday_night_differential_pay + $payroll_entry->regular_holiday_overtime_night_differential_pay + $payroll_entry->regular_holiday_rest_day_pay + $payroll_entry->regular_holiday_rest_day_overtime_pay + $payroll_entry->regular_holiday_rest_day_night_differential_pay + $payroll_entry->regular_holiday_rest_day_overtime_night_differential_pay + $payroll_entry->special_holiday_pay + $payroll_entry->special_holiday_overtime_pay + $payroll_entry->special_holiday_night_differential_pay + $payroll_entry->special_holiday_overtime_night_differential_pay + $payroll_entry->special_holiday_rest_day_pay + $payroll_entry->special_holiday_rest_day_overtime_pay + $payroll_entry->special_holiday_rest_day_night_differential_pay + $payroll_entry->special_holiday_rest_day_overtime_night_differential_pay;

            if($payroll_process->payroll->thirteenth_month_pay_basis == 'Gross')
            {
                $payroll_entry->partial_thirteenth_month_pay = round($payroll_entry->gross_pay / 12);
            }
            else if($payroll_process->payroll->thirteenth_month_pay_basis == 'Base')
            {
                $payroll_entry->partial_thirteenth_month_pay = round($payroll_entry->regular_working_hours_pay / 12);
            }

            if($request->has('allowances'))
            {
                $payroll_entry->additional_earnings = 0;

                for ($i=0; $i < count($request->allowances); $i++) { 
                    $payroll_entry->additional_earnings += $request->input('allowances')[$i]['amount'];
                }
            }

            if($request->has('deductions'))
            {
                $payroll_entry->additional_deductions = 0;

                for ($i=0; $i < count($request->deductions); $i++) { 
                    $payroll_entry->additional_deductions += $request->input('deductions')[$i]['amount'];
                }
            }

            if($request->has('government_contributions'))
            {
                $payroll_entry->government_deductions = 0;

                for ($i=0; $i < count($request->government_contributions); $i++) { 
                    $payroll_entry->government_deductions += $request->input('government_contributions')[$i]['amount'];
                }   
            }

            $payroll_entry->gross_pay += $payroll_entry->additional_earnings;
            $payroll_entry->total_deductions = round($payroll_entry->government_deductions + $payroll_entry->additional_deductions, 2);
            $payroll_entry->net_pay = round($payroll_entry->gross_pay - $payroll_entry->total_deductions, 2);

            $payroll_entry->save();

            if($request->has('allowances'))
            {
                for ($i=0; $i < count($request->allowances); $i++) { 
                    $allowance = new PayrollEntryEmployeeAllowanceType;

                    $allowance->payroll_entry_id = $payroll_entry->id;
                    $allowance->employee_allowance_type_id = $request->input('allowances')[$i]['employee_allowance_type_id'];
                    $allowance->amount = $request->input('allowances')[$i]['amount'];
                    $allowance->taxable = false;

                    $allowance->save();
                }
            }

            if($request->has('deductions'))
            {
                for ($i=0; $i < count($request->deductions); $i++) { 
                    $deduction = new PayrollEntryEmployeeDeductionType;

                    $deduction->payroll_entry_id = $payroll_entry->id;
                    $deduction->employee_deduction_type_id = $request->input('deductions')[$i]['employee_deduction_type_id'];
                    $deduction->amount = $request->input('deductions')[$i]['amount'];

                    $deduction->save();
                }   
            }

            if($request->has('government_contributions'))
            {
                for ($i=0; $i < count($request->government_contributions); $i++) { 
                    $government_contribution = new PayrollEntryGovernmentContribution;

                    $government_contribution->payroll_entry_id = $payroll_entry->id;
                    $government_contribution->government_contribution_id = $request->input('government_contributions')[$i]['id'];                    
                    $government_contribution->amount = $request->input('government_contributions')[$i]['amount'];

                    $government_contribution->save();                    
                }
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
