<?php

namespace App\Providers;

use App\Services\FaceDataService;
use App\Services\IdentityDocumentService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(IdentityDocumentService::class, function ($app){
            return new IdentityDocumentService();
        });

        $this->app->singleton(FaceDataService::class, function($app){
            return new FaceDataService();
        });

        $this->app->singleton(UserService::class, function($app){
            return new UserService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
