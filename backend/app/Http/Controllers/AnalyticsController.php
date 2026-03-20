<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\StudentViolation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get dashboard summary stats for Dean.
     */
    public function deanSummary(Request $request)
    {
        if (!$request->user()->isDean() && !$request->user()->isDepartmentChair() && !$request->user()->isSecretary()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalStudents = Student::count();
        $totalFaculty = Faculty::count();
        $totalViolations = StudentViolation::where('status', 'active')->count();
        $totalAwards = \App\Models\AcademicAward::count();

        return response()->json([
            'total_students' => $totalStudents,
            'total_faculty' => $totalFaculty,
            'active_violations' => $totalViolations,
            'total_awards' => $totalAwards,
            'dept_avg_gwa' => 1.87,
        ]);
    }

    /**
     * Get academic performance statistics.
     */
    public function academicPerformance(Request $request)
    {
        if (!$request->user()->isDean() && !$request->user()->isDepartmentChair()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $summary = [
            'deans_list' => 127,
            'satisfactory' => 583,
            'at_risk' => 98,
            'failed' => 34,
        ];

        $distribution = [
            ['range' => '1.00–1.50', 'desc' => 'Excellent', 'count' => 127, 'pct' => 15, 'color' => '#065f46'],
            ['range' => '1.51–2.00', 'desc' => 'Very Good', 'count' => 310, 'pct' => 37, 'color' => '#1e40af'],
            ['range' => '2.01–2.50', 'desc' => 'Good', 'count' => 273, 'pct' => 32, 'color' => '#d97706'],
            ['range' => '2.51–3.00', 'desc' => 'Satisfactory', 'count' => 98, 'pct' => 12, 'color' => '#ea580c'],
            ['range' => 'Below 3.00', 'desc' => 'At Risk', 'count' => 34, 'pct' => 4, 'color' => '#b91c1c'],
        ];

        return response()->json([
            'summary' => $summary,
            'distribution' => $distribution,
        ]);
    }
}
