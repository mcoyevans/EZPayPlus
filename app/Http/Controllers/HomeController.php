<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\User;
use App\Company;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->only('index');;
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = User::where('id', Auth::user()->id)->with('group.modules')->first();
        
        return view('home')->with('user', $user);
    }

    /**
     * Show the application registration page.
     *
     * @return \Illuminate\Http\Response
     */
    public function register()
    {
        $company = Company::first();

        if($company)
        {
            return redirect('/home');
        }

        return view('auth.register');
    }

    /**
     * Redirects user to appropriate home page if authenticated.
     *
     * @return \Illuminate\Http\Response
     */
    public function home()
    {   
        $company = Company::first();

        if(!$company)
        {
            return redirect('/register');
        }

        if (Auth::check()) {
            return redirect('/home');
        }

        return view('auth.login');
    }   
}
