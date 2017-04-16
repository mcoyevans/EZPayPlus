<?php

namespace App\Providers;

use App\Group;
use App\Module;
use App\User;

use App\Policies\GroupPolicy;
use App\Policies\ModulePolicy;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
        'App\Group' => 'App\Policies\GroupPolicy',
        'App\Module' => 'App\Policies\ModulePolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('settings-access', function($user){
            $user = User::with('group.modules')->where('id', $user->id)->first();

            foreach ($user->group->modules as $module) {
                if($module->name == 'Settings')
                {
                    return true;
                }
            }

            return false;
        });   

        Gate::define('hris', function($user){
            $user = User::with('group.modules')->where('id', $user->id)->first();

            foreach ($user->group->modules as $module) {
                if($module->name == 'HRIS')
                {
                    return true;
                }
            }

            return false;
        }); 

        Gate::define('payroll', function($user){
            $user = User::with('group.modules')->where('id', $user->id)->first();

            foreach ($user->group->modules as $module) {
                if($module->name == 'Payroll')
                {
                    return true;
                }
            }

            return false;
        });  

        Gate::define('bookkeeping', function($user){
            $user = User::with('group.modules')->where('id', $user->id)->first();

            foreach ($user->group->modules as $module) {
                if($module->name == 'Bookkeeping')
                {
                    return true;
                }
            }

            return false;
        });     
    }
}
