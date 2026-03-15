<?php

namespace App\Http\Controllers;

use App\Models\StudentViolation;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    /**
     * Get all violations (for Dean).
     */
    public function index(Request $request)
    {
        if (!$request->user()->isDean()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return StudentViolation::with(['student', 'faculty'])->latest()->get();
    }
}
