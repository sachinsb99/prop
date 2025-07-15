<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API working from web routes!']);
});