<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\Section;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\Program;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AutoScheduleService
{
    private $operatingStart = '07:30';
    private $operatingEnd = '18:30';
    private $slotIncrement = 30; // minutes
    private $studentsPerSection = 50;

    /**
     * Generate schedules for a specific program, year level, and semester.
     */
    public function generate(int $programId, string $yearLevel, string $semester)
    {
        $program = Program::findOrFail($programId);
        
        // 1. Ensure sections exist based on student population
        $this->ensureSectionsExist($program, $yearLevel);

        $sections = Section::where('program_id', $programId)
            ->where('year_level', $yearLevel)
            ->get();

        $curriculum = Curriculum::where('program_id', $programId)
            ->where('year_level', $yearLevel)
            ->where('semester', $semester)
            ->with('course')
            ->get();

        if ($curriculum->isEmpty()) {
            throw new \Exception("No curriculum found for this program, year, and semester.");
        }

        // 2. Assign unique vacant days to sections (to spread load)
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $sectionVacantDays = [];
        foreach ($sections as $index => $section) {
            $sectionVacantDays[$section->id] = $days[$index % 6];
        }

        // 3. Sort subjects by priority: Lab units first (harder to place), then total units
        $sortedCurriculum = $curriculum->sortByDesc(function ($item) {
            return ($item->course->lab_units * 10) + $item->course->units;
        });

        $generatedSchedules = [];
        $conflicts = [];

        DB::beginTransaction();
        try {
            // Clear existing schedules for these sections
            Schedule::whereIn('section_id', $sections->pluck('id'))->delete();

            foreach ($sections as $section) {
                $vacantDay = $sectionVacantDays[$section->id];

                foreach ($sortedCurriculum as $item) {
                    $course = $item->course;

                    // Handle Lab component if exists
                    if ($course->lab_units > 0) {
                        if (!$this->placeSubject($section, $course, 'lab', $course->lab_units, $vacantDay, $generatedSchedules)) {
                            $conflicts[] = "Could not place Lab for {$course->course_code} ({$course->lab_units} units) in {$section->section_name}";
                        }
                    }

                    // Handle Lec component if exists
                    if ($course->lec_units > 0) {
                        if (!$this->placeSubject($section, $course, 'lec', $course->lec_units, $vacantDay, $generatedSchedules)) {
                            $conflicts[] = "Could not place Lec for {$course->course_code} ({$course->lec_units} units) in {$section->section_name}";
                        }
                    }
                }
            }

            if (!empty($conflicts)) {
                DB::rollBack();
                return ['success' => false, 'conflicts' => $conflicts];
            }

            DB::commit();
            return ['success' => true, 'schedules' => $generatedSchedules];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Ensure sections exist based on student count.
     */
    private function ensureSectionsExist(Program $program, string $yearLevel)
    {
        $studentCount = Student::where('program_id', $program->id)
            ->where('year_level', $yearLevel)
            ->count();

        // Determine how many sections we need (at least 1)
        $neededCount = max(1, ceil($studentCount / $this->studentsPerSection));
        
        $existingSections = Section::where('program_id', $program->id)
            ->where('year_level', $yearLevel)
            ->orderBy('section_name', 'asc')
            ->get();

        // Create missing sections (A, B, C...)
        for ($i = $existingSections->count(); $i < $neededCount; $i++) {
            $letter = chr(65 + $i); // A, B, C...
            Section::create([
                'program_id' => $program->id,
                'department_id' => $program->department_id,
                'section_name' => "{$program->program_code} {$yearLevel}-{$letter}",
                'year_level' => $yearLevel,
                'school_year' => date('Y') . '-' . (date('Y') + 1),
            ]);
        }

        // Re-fetch all sections for this year level
        $allSections = Section::where('program_id', $program->id)
            ->where('year_level', $yearLevel)
            ->orderBy('section_name', 'asc')
            ->get();

        // Distribute students if they exist
        if ($studentCount > 0) {
            $students = Student::where('program_id', $program->id)
                ->where('year_level', $yearLevel)
                ->orderBy('last_name', 'asc')
                ->orderBy('first_name', 'asc')
                ->get();

            foreach ($students as $index => $student) {
                $sectionIndex = floor($index / $this->studentsPerSection);
                if (isset($allSections[$sectionIndex])) {
                    $student->update(['section_id' => $allSections[$sectionIndex]->id]);
                }
            }
        }
    }

    private function placeSubject($section, $course, $type, $units, $vacantDay, &$generatedSchedules)
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        $patterns = [];
        if ($type === 'lab') {
            $patterns = [['days' => 1, 'hoursPerMeeting' => $units]];
        } else {
            if ($units == 3) {
                $patterns = [
                    ['days' => 2, 'hoursPerMeeting' => 1.5],
                    ['days' => 3, 'hoursPerMeeting' => 1],
                ];
            } elseif ($units == 2) {
                $patterns = [
                    ['days' => 1, 'hoursPerMeeting' => 2],
                    ['days' => 2, 'hoursPerMeeting' => 1],
                ];
            } else {
                $patterns = [['days' => 1, 'hoursPerMeeting' => $units]];
            }
        }

        foreach ($patterns as $pattern) {
            $validDays = array_filter($days, fn($d) => $d !== $vacantDay);
            
            $dayGroups = [];
            if ($pattern['days'] === 3) {
                $dayGroups = [['Monday', 'Wednesday', 'Friday']];
            } elseif ($pattern['days'] === 2) {
                $dayGroups = [['Tuesday', 'Thursday'], ['Monday', 'Wednesday'], ['Wednesday', 'Friday']];
            } else {
                foreach ($validDays as $d) $dayGroups[] = [$d];
            }

            foreach ($dayGroups as $group) {
                if (count(array_intersect($group, [$vacantDay])) > 0) continue;

                $time = Carbon::createFromFormat('H:i', $this->operatingStart);
                $endLimit = Carbon::createFromFormat('H:i', $this->operatingEnd);

                while ($time->copy()->addMinutes($pattern['hoursPerMeeting'] * 60)->lte($endLimit)) {
                    $startTime = $time->format('H:i');
                    $endTime = $time->copy()->addMinutes($pattern['hoursPerMeeting'] * 60)->format('H:i');

                    if ($this->isValidSlot($section, $group, $startTime, $endTime, $generatedSchedules)) {
                        foreach ($group as $day) {
                            $sched = Schedule::create([
                                'section_id' => $section->id,
                                'course_id' => $course->id,
                                'class_type' => $type,
                                'dayOfWeek' => $day,
                                'startTime' => $startTime,
                                'endTime' => $endTime,
                                'room' => $type === 'lab' ? 'Laboratory' : 'Lecture Room',
                            ]);
                            $generatedSchedules[] = $sched;
                        }
                        return true;
                    }
                    $time->addMinutes($this->slotIncrement);
                }
            }
        }

        return false;
    }

    private function isValidSlot($section, $days, $start, $end, $generatedSchedules)
    {
        foreach ($days as $day) {
            $exists = Schedule::where('section_id', $section->id)
                ->where('dayOfWeek', $day)
                ->where(function($q) use ($start, $end) {
                    $q->where(function($sub) use ($start, $end) {
                        $sub->where('startTime', '<', $end)
                            ->where('endTime', '>', $start);
                    });
                })->exists();

            if ($exists) return false;

            $overlap = array_filter($generatedSchedules, function($s) use ($section, $day, $start, $end) {
                return $s->section_id === $section->id && 
                       $s->dayOfWeek === $day && 
                       $this->overlaps($s->startTime, $s->endTime, $start, $end);
            });

            if (!empty($overlap)) return false;
        }

        return true;
    }

    private function overlaps($s1, $e1, $s2, $e2)
    {
        return max($s1, $s2) < min($e1, $e2);
    }
}
