<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectLoadController;

use App\Http\Controllers\ProfilingController;

use App\Http\Controllers\FacultyScheduleController;
use App\Http\Controllers\StudentProfileController;

use App\Http\Controllers\CurriculumController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/setup-password', [AuthController::class, 'setupPassword']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load($request->user()->role === 'student' ? 'student' : ($request->user()->role === 'faculty' ? 'faculty' : []));
    });

    // Profiling Query Engine (Dean, Chair, Secretary)
    Route::get('/profiling/report', [ProfilingController::class, 'report'])->middleware('role:dean,department_chair,secretary');

    // Faculty Routes
    Route::middleware('role:faculty')->group(function () {
        Route::get('/faculty/schedule', [FacultyScheduleController::class, 'index']);
        Route::get('/faculty/sections/{section_id}/students', [FacultyScheduleController::class, 'getSectionStudents']);
    });

    // Student Routes
    Route::middleware('role:student')->group(function () {
        Route::get('/student/profile', [StudentProfileController::class, 'show']);
        Route::post('/student/profile', [StudentController::class, 'updateProfile']);
        Route::post('/student/guardian', [StudentProfileController::class, 'updateGuardian']);
        Route::post('/student/skills', [StudentProfileController::class, 'addSkill']);
        Route::delete('/student/skills/{id}', [StudentProfileController::class, 'removeSkill']);
        Route::get('/student/organizations', [StudentProfileController::class, 'getOrganizations']);
        Route::post('/student/affiliations', [StudentProfileController::class, 'addAffiliation']);
        Route::delete('/student/affiliations/{id}', [StudentProfileController::class, 'removeAffiliation']);
        Route::post('/student/activities', [StudentProfileController::class, 'addActivity']);
    });

    // Dean Specific
    Route::middleware('role:dean')->group(function () {
        Route::get('/dean/curriculum', [CurriculumController::class, 'index']);
        Route::post('/dean/curriculum', [CurriculumController::class, 'store']);
        Route::post('/dean/curriculum/bulk', [CurriculumController::class, 'bulkStore']);
        Route::post('/dean/curriculum/import', [CurriculumController::class, 'import']);
        Route::delete('/dean/curriculum/{id}', [CurriculumController::class, 'destroy']);
    });

    // Secretary Specific
    Route::middleware('role:secretary')->group(function () {
        Route::post('/secretary/students/import', [StudentController::class, 'import']);
        // Add more secretary-specific routes here
    });

    // Shared routes for Dean, Chair, Secretary
    Route::middleware('role:dean,department_chair,secretary')->group(function () {
        Route::get('/students', [StudentController::class, 'index']);
        Route::get('/faculty', [FacultyController::class, 'index']);
        
        // Courses
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

        Route::get('/analytics/summary', [AnalyticsController::class, 'deanSummary']);
        Route::get('/analytics/performance', [AnalyticsController::class, 'academicPerformance']);
        Route::get('/violations', [ViolationController::class, 'index']);
        Route::get('/sections', [SectionController::class, 'index']);
    });
});
