<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfilingController extends Controller
{
    /**
     * Get all programs.
     */
    public function getPrograms()
    {
        return response()->json(Program::all());
    }

    /**
     * Profiling query engine for generating qualified-student reports.
     */
    public function report(Request $request)
    {
        $user = $request->user();
        if (!$user->isDean() && !$user->isDepartmentChair() && !$user->isSecretary()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Student::query()
            ->with([
                'user',
                'section',
                'program',
                'skills',
                'academicActivities' => fn($q) => $q->where('status', 'verified'),
                'nonAcademicActivities' => fn($q) => $q->where('status', 'verified'),
                'organizations.organization',
                'awards' => fn($q) => $q->where('status', 'approved')
            ]);

        // Filter by Year Level, Section, Program
        if ($request->filled('year_level')) {
            $query->whereHas('section', function($q) use ($request) {
                $q->where('year_level', $request->year_level);
            });
        }
        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
        }
        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        // Filter by Skills
        if ($request->filled('skill_name') || $request->filled('skill_category')) {
            $query->whereHas('skills', function ($q) use ($request) {
                if ($request->filled('skill_name')) {
                    $q->where('skillName', 'like', '%' . $request->skill_name . '%');
                }
                if ($request->filled('skill_category')) {
                    $q->where('skill_category', $request->skill_category);
                }
            });
        }

        // Filter by Academic Activities (verified)
        if ($request->filled('academic_activity')) {
            $query->whereHas('academicActivities', function($q) use ($request) {
                $q->where('status', 'verified')
                  ->where('activity_name', 'like', '%' . $request->academic_activity . '%');
                
                if ($request->filled('start_date')) {
                    $q->where('date', '>=', $request->start_date);
                }
                if ($request->filled('end_date')) {
                    $q->where('date', '<=', $request->end_date);
                }
            });
        }

        // Filter by Non-Academic Activities (verified)
        if ($request->filled('non_academic_activity')) {
            $query->whereHas('nonAcademicActivities', function($q) use ($request) {
                $q->where('status', 'verified')
                  ->where('activity_name', 'like', '%' . $request->non_academic_activity . '%');
                
                if ($request->filled('start_date')) {
                    $q->where('date', '>=', $request->start_date);
                }
                if ($request->filled('end_date')) {
                    $q->where('date', '<=', $request->end_date);
                }
            });
        }

        // Filter by Organizations
        if ($request->filled('org_id')) {
            $query->whereHas('organizations', function($q) use ($request) {
                $q->where('org_id', $request->org_id);
            });
        }

        // Filter by Awards (approved)
        if ($request->filled('award_name')) {
            $query->whereHas('awards', function($q) use ($request) {
                $q->where('status', 'approved')
                  ->where('awardName', 'like', '%' . $request->award_name . '%');
                
                if ($request->filled('start_date')) {
                    $q->where('date_received', '>=', $request->start_date);
                }
                if ($request->filled('end_date')) {
                    $q->where('date_received', '<=', $request->end_date);
                }
            });
        }

        $students = $query->get();

        $report = $students->map(function($student) {
            return [
                'full_name' => $student->first_name . ' ' . ($student->middle_name ? $student->middle_name . ' ' : '') . $student->last_name,
                'year_level' => $student->section->year_level ?? 'N/A',
                'section' => $student->section->section_name ?? 'N/A',
                'program' => $student->program->program_code ?? 'N/A',
                'matched_skills' => $student->skills->pluck('skillName')->toArray(),
                'relevant_activities' => [
                    'academic' => $student->academicActivities->pluck('activity_name')->toArray(),
                    'non_academic' => $student->nonAcademicActivities->pluck('activity_name')->toArray(),
                ],
                'relevant_awards' => $student->awards->pluck('awardName')->toArray(),
                'org_memberships' => $student->organizations->map(fn($o) => $o->organization->organization_name ?? 'Unknown')->toArray(),
            ];
        });

        return response()->json($report);
    }
}
