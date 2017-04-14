<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollEntry extends Model
{
    protected $casts = [
        'regular_working_hours' => 'float',
        'night_differential' => 'float',
        'overtime' => 'float',
        'overtime_night_differential' => 'float',
        'rest_day' => 'float',
        'rest_day_night_differential' => 'float',
        'rest_day_overtime' => 'float',
        'rest_day_overtime_night_differential' => 'float',

        'special_holiday' => 'float',
        'special_holiday_night_differential' => 'float',
        'special_holiday_overtime' => 'float',
        'special_holiday_overtime_night_differential' => 'float',
        'special_holiday_rest_day' => 'float',
        'special_holiday_rest_day_night_differential' => 'float',
        'special_holiday_rest_day_overtime' => 'float',
        'special_holiday_rest_day_overtime_night_differential' => 'float',

        'regular_holiday' => 'float',
        'regular_holiday_night_differential' => 'float',
        'regular_holiday_overtime' => 'float',
        'regular_holiday_overtime_night_differential' => 'float',
        'regular_holiday_rest_day' => 'float',
        'regular_holiday_rest_day_night_differential' => 'float',
        'regular_holiday_rest_day_overtime' => 'float',
        'regular_holiday_rest_day_overtime_night_differential' => 'float'
    ];

    public function payroll_process()
    {
    	return $this->belongsTo('App\PayrollProcess');
    }

    public function employee()
    {
    	return $this->belongsTo('App\Employee');
    }

    public function allowances()
    {
    	return $this->belongsToMany('App\EmployeeAllowanceType', 'payroll_entry_employee_allowance_type')->withPivot('id', 'amount', 'taxable');
    }

    public function deductions()
    {
        return $this->belongsToMany('App\EmployeeDeductionType', 'payroll_entry_employee_deduction_type')->withPivot('id', 'amount');
    }

    public function government_contributions()
    {
        return $this->belongsToMany('App\GovernmentContribution', 'payroll_entry_government_contribution')->withPivot('id', 'amount');
    }

    public function define($request, $payroll_process)
    {
        $this->days_absent = $request->days_absent;
        $this->hours_tardy = $request->hours_tardy;

        // Hours
        
        $this->regular_working_days = $request->regular_working_days;
        $this->regular_working_hours = $request->regular_working_hours;
        $this->night_differential = $request->night_differential;
        $this->overtime = $request->overtime;
        $this->overtime_night_differential = $request->overtime_night_differential;
        
        $this->rest_day = $request->rest_day;
        $this->rest_day_night_differential = $request->rest_day_night_differential;
        $this->rest_day_overtime = $request->rest_day_overtime;
        $this->rest_day_overtime_night_differential = $request->rest_day_overtime_night_differential;

        $this->regular_holiday = $request->regular_holiday;
        $this->regular_holiday_night_differential = $request->regular_holiday_night_differential;
        $this->regular_holiday_overtime = $request->regular_holiday_overtime;
        $this->regular_holiday_overtime_night_differential = $request->regular_holiday_overtime_night_differential;

        $this->regular_holiday_rest_day = $request->regular_holiday_rest_day;
        $this->regular_holiday_rest_day_night_differential = $request->regular_holiday_rest_day_night_differential;
        $this->regular_holiday_rest_day_overtime = $request->regular_holiday_rest_day_overtime;
        $this->regular_holiday_rest_day_overtime_night_differential = $request->regular_holiday_rest_day_overtime_night_differential;

        $this->special_holiday = $request->special_holiday;
        $this->special_holiday_night_differential = $request->special_holiday_night_differential;
        $this->special_holiday_overtime = $request->special_holiday_overtime;
        $this->special_holiday_overtime_night_differential = $request->special_holiday_overtime_night_differential;

        $this->special_holiday_rest_day = $request->special_holiday_rest_day;
        $this->special_holiday_rest_day_night_differential = $request->special_holiday_rest_day_night_differential;
        $this->special_holiday_rest_day_overtime = $request->special_holiday_rest_day_overtime;
        $this->special_holiday_rest_day_overtime_night_differential = $request->special_holiday_rest_day_overtime_night_differential;

        // Pay

        $this->regular_working_hours_pay = round($request->regular_working_hours_pay, 2);
        $this->night_differential_pay = round($request->night_differential_pay, 2);
        $this->overtime_pay = round($request->overtime_pay, 2);
        $this->overtime_night_differential_pay = round($request->overtime_night_differential_pay, 2);
        
        $this->rest_day_pay = round($request->rest_day_pay, 2);
        $this->rest_day_night_differential_pay = round($request->rest_day_night_differential_pay, 2);
        $this->rest_day_overtime_pay = round($request->rest_day_overtime_pay, 2);
        $this->rest_day_overtime_night_differential_pay = round($request->rest_day_overtime_night_differential_pay, 2);

        $this->regular_holiday_pay = round($request->regular_holiday_pay, 2);
        $this->regular_holiday_night_differential_pay = round($request->regular_holiday_night_differential_pay, 2);
        $this->regular_holiday_overtime_pay = round($request->regular_holiday_overtime_pay, 2);
        $this->regular_holiday_overtime_night_differential_pay = round($request->regular_holiday_overtime_night_differential_pay, 2);

        $this->regular_holiday_rest_day_pay = round($request->regular_holiday_rest_day_pay, 2);
        $this->regular_holiday_rest_day_night_differential_pay = round($request->regular_holiday_rest_day_night_differential_pay, 2);
        $this->regular_holiday_rest_day_overtime_pay = round($request->regular_holiday_rest_day_overtime_pay, 2);
        $this->regular_holiday_rest_day_overtime_night_differential_pay = round($request->regular_holiday_rest_day_overtime_night_differential_pay, 2);

        $this->special_holiday_pay = round($request->special_holiday_pay, 2);
        $this->special_holiday_night_differential_pay = round($request->special_holiday_night_differential_pay, 2);
        $this->special_holiday_overtime_pay = round($request->special_holiday_overtime_pay, 2);
        $this->special_holiday_overtime_night_differential_pay = round($request->special_holiday_overtime_night_differential_pay, 2);

        $this->special_holiday_rest_day_pay = round($request->special_holiday_rest_day_pay, 2);
        $this->special_holiday_rest_day_night_differential_pay = round($request->special_holiday_rest_day_night_differential_pay, 2);
        $this->special_holiday_rest_day_overtime_pay = round($request->special_holiday_rest_day_overtime_pay, 2);
        $this->special_holiday_rest_day_overtime_night_differential_pay = round($request->special_holiday_rest_day_overtime_night_differential_pay, 2);

        $this->tardy = round($request->tardy, 2);
        $this->absent = round($request->absent, 2);
        $this->taxable_income = round($request->taxable_income, 2);
        
        $this->gross_pay = $this->regular_working_hours_pay - $this->tardy - $this->absent + $this->night_differential_pay + $this->overtime_pay + $this->overtime_night_differential_pay + $this->rest_day_pay + $this->rest_day_overtime_pay + $this->rest_day_night_differential_pay + $this->rest_day_overtime_night_differential_pay + $this->regular_holiday_pay + $this->regular_holiday_overtime_pay + $this->regular_holiday_night_differential_pay + $this->regular_holiday_overtime_night_differential_pay + $this->regular_holiday_rest_day_pay + $this->regular_holiday_rest_day_overtime_pay + $this->regular_holiday_rest_day_night_differential_pay + $this->regular_holiday_rest_day_overtime_night_differential_pay + $this->special_holiday_pay + $this->special_holiday_overtime_pay + $this->special_holiday_night_differential_pay + $this->special_holiday_overtime_night_differential_pay + $this->special_holiday_rest_day_pay + $this->special_holiday_rest_day_overtime_pay + $this->special_holiday_rest_day_night_differential_pay + $this->special_holiday_rest_day_overtime_night_differential_pay;

        if($payroll_process->payroll->thirteenth_month_pay_basis == 'Gross')
        {
            $this->partial_thirteenth_month_pay = round($this->gross_pay / 12, 2);
        }
        else if($payroll_process->payroll->thirteenth_month_pay_basis == 'Base')
        {
            $this->partial_thirteenth_month_pay = round($this->regular_working_hours_pay / 12, 2);
        }
    }

    public function count_additional_earnings($request)
    {
        $this->additional_earnings = 0;

        foreach ($request->allowances as $key => $allowance) {
            $this->additional_earnings += $allowance['amount'];
        }
    }

    public function count_additional_deductions($request)
    {
        $this->additional_deductions = 0;

        foreach ($request->deductions as $key => $deduction) {
            $this->additional_deductions += $deduction['amount'];
        }
    }

    public function count_government_contributions($request)
    {
        $this->government_deductions = 0;

        foreach ($request->government_contributions as $key => $government_contribution) {
            $this->government_deductions += isset($government_contribution['amount']) ? $government_contribution['amount'] : $government_contribution['pivot']['amount'];
        }
    }

    public function createAllowances($request)
    {
        foreach ($request->allowances as $key => $value) {
            $allowance = new PayrollEntryEmployeeAllowanceType;

            $allowance->employee_allowance_type_id = isset($value['employee_allowance_type_id']) ? $value['employee_allowance_type_id'] : $value['pivot']['id'];
            $allowance->amount = $value['amount'];
            $allowance->taxable = false;
            $allowance->payroll_entry_id = $this->id;

            $allowance->save();
        }
    }

    public function createDeductions($request)
    {
        foreach ($request->deductions as $key => $value) {
            $deduction = new PayrollEntryEmployeedeductionType;

            $deduction->employee_deduction_type_id = isset($value['employee_deduction_type_id']) ? $value['employee_deduction_type_id'] : $value['pivot']['id'];
            $deduction->amount = $value['amount'];
            $deduction->payroll_entry_id = $this->id;

            $deduction->save();
        }
    }

    public function createGovernmentContributions($request)
    {
        foreach ($request->government_contributions as $key => $value) {
            $government_contribution = new PayrollEntryGovernmentContribution;

            $government_contribution->government_contribution_id = $value['id'];
            $government_contribution->amount = isset($value['amount']) ? $value['amount'] : $value['pivot']['amount'];
            $government_contribution->payroll_entry_id = $this->id;

            $government_contribution->save();
        }
    }
}
