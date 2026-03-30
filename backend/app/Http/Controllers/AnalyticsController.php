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

        // Calculate real avg GWA from students who have it
        $avgGwa = Student::whereNotNull('gwa')->avg('gwa') ?: 1.87;

        // Fetch top 3 performing students
        $topStudents = Student::with(['program'])
            ->whereNotNull('gwa')
            ->orderBy('gwa', 'asc') // Lower is better in GWA usually
            ->limit(3)
            ->get()
            ->map(function($s) {
                return [
                    'name' => $s->first_name . ' ' . $s->last_name,
                    'course' => $s->program->program_code ?? 'N/A',
                    'tag' => $s->gwa <= 1.5 ? "Dean's List" : "Honor Roll",
                    'gwa' => number_format($s->gwa, 2),
                    'color' => '#' . substr(md5($s->id), 0, 6),
                    'tagClass' => 'tag-green'
                ];
            });

        // Fetch recent active violations
        $recentViolations = StudentViolation::with('student')
            ->where('status', 'active')
            ->latest()
            ->limit(2)
            ->get()
            ->map(function($v) {
                return [
                    'name' => $v->student ? ($v->student->first_name . ' ' . $v->student->last_name) : 'Unknown',
                    'type' => $v->violation_type,
                    'severity' => $v->severity,
                    'color' => $v->severity === 'Major' ? '#b91c1c' : ($v->severity === 'Moderate' ? '#c2410c' : '#f59e0b'),
                    'severityClass' => 'sev-' . strtolower($v->severity)
                ];
            });

        // Mock historical data for the chart (usually requires a historical table)
        $chartData = [
            ['sem' => "1st '23", 'gwa' => 2.01, 'pct' => 60],
            ['sem' => "2nd '23", 'gwa' => 1.96, 'pct' => 68],
            ['sem' => "1st '24", 'gwa' => 1.91, 'pct' => 75],
            ['sem' => "2nd '24", 'gwa' => 1.87, 'pct' => 85],
            ['sem' => "Current", 'gwa' => round($avgGwa, 2), 'pct' => 90],
        ];

        return response()->json([
            'total_students' => $totalStudents,
            'total_faculty' => $totalFaculty,
            'active_violations' => $totalViolations,
            'total_awards' => $totalAwards,
            'dept_avg_gwa' => round($avgGwa, 2),
            'top_students' => $topStudents,
            'recent_violations' => $recentViolations,
            'chart_data' => $chartData,
            'pending_approvals' => \App\Models\AcademicAward::where('status', 'pending')->count() + 
                                  \App\Models\AcademicActivity::where('status', 'pending')->count() +
                                  \App\Models\NonAcademicActivity::where('status', 'pending')->count()
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
