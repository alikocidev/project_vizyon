<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        apiPrefix: 'v1',  // /api yerine /v1 kullanılacak
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: []);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response) {
            if ($response->getStatusCode() === 419) {
                return response()->json([
                    'message' => 'Page expired',
                    'status' => 419
                ], 419);
            }
            return $response;
        });
    })->create();
