<?php

namespace App\Http;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Http\Middleware\TrustProxies;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // Global middleware
        TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        // ...
    ];

    protected $middlewareGroups = [
        'web' => [
            EncryptCookies::class,
            // ...
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $middlewareAliases = [
        'auth' => Authenticate::class,
        // ...
    ];
}
