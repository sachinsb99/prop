<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\HomeEnquiryController;
use App\Http\Controllers\Api\HomeInquiryController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\PropertyImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;








/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/test', function () {
    return response()->json(['message' => 'API working from Laravel!']);
});

// Or with v1 prefix
Route::prefix('v1')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'API working with v1 prefix!']);
    });
});

Route::post('/test-form', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string'
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Form submitted successfully!',
        'data' => $validated,
        'timestamp' => now()
    ]);
});

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
// Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/me', function (Request $request) {
//         return $request->user();
//     });

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
    Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Category Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/active', [CategoryController::class, 'getActiveCategories']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});

// Property Routes
Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::post('/', [PropertyController::class, 'store']);
    Route::get('/{property}', [PropertyController::class, 'show']);
    Route::put('/{property}', [PropertyController::class, 'update']); // POST for file uploads
    Route::delete('/{property}', [PropertyController::class, 'destroy']);
});

// Property Images Routes
Route::prefix('property-images')->group(function () {
    Route::post('/', [PropertyImageController::class, 'store']);
    Route::delete('/{propertyImage}', [PropertyImageController::class, 'destroy']);
    Route::put('/{propertyImage}/reorder', [PropertyImageController::class, 'reorder']);
});

Route::prefix('enquiry')->group(function () {
    Route::post('/', [EnquiryController::class, 'store']);
    
});

// Admin routes (add authentication middleware as needed)
    // Route::middleware(['auth:sanctum'])->group(function () {
    //     Route::get('/', [EnquiryController::class, 'index']);
    //     Route::get('/{enquiry}', [EnquiryController::class, 'show']);
    //     Route::patch('/{enquiry}/status', [EnquiryController::class, 'updateStatus']);
    //     Route::delete('/{enquiry}', [EnquiryController::class, 'destroy']);
    // });