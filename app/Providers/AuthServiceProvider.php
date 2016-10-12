<?php

namespace App\Providers;

use App\Branch;
use App\Company;
use App\Group;
use App\HouseBank;
use App\Module;
use App\User;
use App\Policies\BranchPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\GroupPolicy;
use App\Policies\HouseBankPolicy;
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
        'App\Branch' => 'App\Policies\BranchPolicy',
        'App\Group' => 'App\Policies\GroupPolicy',
        'App\HouseBank' => 'App\Policies\HouseBankPolicy',
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

        Gate::define('manage-user', function($user){
            $user = User::with('group.modules')->where('id', $user->id)->first();

            foreach ($user->group->modules as $module) {
                if($module->name == 'Settings')
                {
                    return true;
                }
            }

            return false;
        });        
    }
}
