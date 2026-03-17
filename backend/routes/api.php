<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectLoadController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/setup-password', [AuthController::class, 'setupPassword']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Activation (Guest access)
Route::post('/activate', [StudentController::class, 'activate']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Student specific
    Route::get('/student/profile', [StudentController::class, 'profile']);
    Route::post('/student/profile', [StudentController::class, 'updateProfile']);

    // Dean specific (Student management)
    Route::get('/dean/students', [StudentController::class, 'index']);
    Route::post('/dean/students/import', [StudentController::class, 'import']);

    // Faculty management
    Route::get('/dean/faculty', [FacultyController::class, 'index']);
    Route::post('/dean/faculty', [FacultyController::class, 'store']);

    // Subject/Section management
    Route::get('/dean/subjects', [SubjectController::class, 'index']);
    Route::post('/dean/subjects', [SubjectController::class, 'store']);
    Route::get('/dean/sections', [SectionController::class, 'index']);

    // Subject Assignments
    Route::post('/dean/faculty/assign-subject', [SubjectLoadController::class, 'store']);
    Route::delete('/dean/faculty/subject-load/{id}', [SubjectLoadController::class, 'destroy']);

    // Violations
    Route::get('/dean/violations', [ViolationController::class, 'index']);

    // Analytics
    Route::get('/dean/analytics/summary', [AnalyticsController::class, 'deanSummary']);
    Route::get('/dean/analytics/performance', [AnalyticsController::class, 'academicPerformance']);
});
