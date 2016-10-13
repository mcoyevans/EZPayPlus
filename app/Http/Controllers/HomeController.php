<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
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
     * Redirects user to appropriate home page if authenticated.
     *
     * @return \Illuminate\Http\Response
     */
    public function home()
    {
        if (Auth::check()) {
            return redirect('/home');
        }
        return view('auth.login');
    }   
}
