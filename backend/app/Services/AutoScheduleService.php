<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\Section;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AutoScheduleService
{
    private $operatingStart = '07:00';
    private $operatingEnd = '19:00';
    private $preferredEnd = '17:00';
    private $lunchStart = '11:00';
    private $lunchEnd = '14:00';
    private $slotIncrement = 30; // minutes

    /**
     * Generate schedules for a specific program, year level, and semester.
     */
    public function generate(int $programId, string $yearLevel, string $semester)
    {
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

        // 1. Assign unique vacant days to sections
        $vacantDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $sectionVacantDays = [];
        foreach ($sections as $index => $section) {
            $sectionVacantDays[$section->id] = $vacantDays[$index % 6];
        }

        // 2. Sort subjects by priority: Lab first, then by units descending
        $sortedCurriculum = $curriculum->sortByDesc(function ($item) {
            // Priority: Lab > 3 units > 2 units > 1 unit
            // Assuming we need to split lab/lec if the course has both
            return ($item->course->units >= 3 ? 100 : 0) + $item->course->units;
        });

        $generatedSchedules = [];
        $conflicts = [];

        DB::beginTransaction();
        try {
            // Clear existing schedules for these sections to avoid duplicates
            Schedule::whereIn('section_id', $sections->pluck('id'))->delete();

            foreach ($sections as $section) {
                $vacantDay = $sectionVacantDays[$section->id];
                $dailyLoad = []; // day => hours

                foreach ($sortedCurriculum as $item) {
                    $course = $item->course;
                    
                    if ($course->type === 'lec+lab') {
                        // Schedule Lab (3 hours block)
                        if (!$this->placeSubject($section, $course, 'lab', 3, $vacantDay, $dailyLoad, $generatedSchedules)) {
                            $conflicts[] = "Could not place Lab for {$course->course_code} in {$section->section_name}";
                        }
                        // Schedule Lec (remaining units)
                        $lecUnits = $course->units - 3;
                        if ($lecUnits > 0) {
                            if (!$this->placeSubject($section, $course, 'lec', $lecUnits, $vacantDay, $dailyLoad, $generatedSchedules)) {
                                $conflicts[] = "Could not place Lec for {$course->course_code} in {$section->section_name}";
                            }
                        }
                    } elseif ($course->type === 'lab') {
                        if (!$this->placeSubject($section, $course, 'lab', $course->units, $vacantDay, $dailyLoad, $generatedSchedules)) {
                            $conflicts[] = "Could not place Lab for {$course->course_code} in {$section->section_name}";
                        }
                    } else {
                        // Standard Lec subject
                        if (!$this->placeSubject($section, $course, 'lec', $course->units, $vacantDay, $dailyLoad, $generatedSchedules)) {
                            $conflicts[] = "Could not place {$course->course_code} in {$section->section_name}";
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

    private function placeSubject($section, $course, $type, $hours, $vacantDay, &$dailyLoad, &$generatedSchedules)
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Determine pattern based on hours
        $patterns = [];
        if ($type === 'lab') {
            // Lab is always a single 3-hour block
            $patterns = [['days' => 1, 'hoursPerMeeting' => 3]];
        } else {
            if ($hours == 3) {
                $patterns = [
                    ['days' => 3, 'hoursPerMeeting' => 1], // MWF
                    ['days' => 2, 'hoursPerMeeting' => 1.5], // TTh
                ];
            } elseif ($hours == 2) {
                $patterns = [['days' => 2, 'hoursPerMeeting' => 1]];
            } else {
                $patterns = [['days' => 1, 'hoursPerMeeting' => $hours]];
            }
        }

        foreach ($patterns as $pattern) {
            $validDays = array_filter($days, fn($d) => $d !== $vacantDay);
            if ($pattern['days'] === 3) {
                $dayGroups = [['Monday', 'Wednesday', 'Friday']];
            } elseif ($pattern['days'] === 2) {
                $dayGroups = [['Tuesday', 'Thursday'], ['Monday', 'Wednesday'], ['Wednesday', 'Friday']];
            } else {
                $dayGroups = array_map(fn($d) => [$d], $validDays);
            }

            foreach ($dayGroups as $group) {
                // Check if all days in group are not vacant
                if (count(array_intersect($group, [$vacantDay])) > 0) continue;

                // Try to find a common time slot across all days in group
                $time = Carbon::createFromFormat('H:i', $this->operatingStart);
                $endLimit = Carbon::createFromFormat('H:i', $this->operatingEnd);

                while ($time->copy()->addMinutes($pattern['hoursPerMeeting'] * 60)->lte($endLimit)) {
                    $startTime = $time->format('H:i');
                    $endTime = $time->copy()->addMinutes($pattern['hoursPerMeeting'] * 60)->format('H:i');

                    if ($this->isValidSlot($section, $course, $group, $startTime, $endTime, $dailyLoad, $generatedSchedules)) {
                        // Place it!
                        foreach ($group as $day) {
                            $sched = Schedule::create([
                                'section_id' => $section->id,
                                'course_id' => $course->id,
                                'class_type' => $type,
                                'dayOfWeek' => $day,
                                'startTime' => $startTime,
                                'endTime' => $endTime,
                            ]);
                            $generatedSchedules[] = $sched;
                            $dailyLoad[$day] = ($dailyLoad[$day] ?? 0) + $pattern['hoursPerMeeting'];
                        }
                        return true;
                    }
                    $time->addMinutes($this->slotIncrement);
                }
            }
        }

        return false;
    }

    private function isValidSlot($section, $course, $days, $start, $end, $dailyLoad, $generatedSchedules)
    {
        $startT = Carbon::createFromFormat('H:i', $start);
        $endT = Carbon::createFromFormat('H:i', $end);
        $duration = $startT->diffInMinutes($endT) / 60;

        foreach ($days as $day) {
            // Rule 2: Max 6 hours per day
            if (($dailyLoad[$day] ?? 0) + $duration > 6) return false;

            // Rule 3: Lunch Break (11:00 - 14:00 window, must have 1 hour gap)
            // Simpler check: Class cannot overlap 12:00-13:00 (preferred)
            if ($this->overlaps('12:00', '13:00', $start, $end)) return false;

            // Rule 6: Subject Cross-Section Conflict
            // Same subject same year level cannot overlap
            $overlap = Schedule::where('course_id', $course->id)
                ->whereHas('section', function($q) use ($section) {
                    $q->where('year_level', $section->year_level);
                })
                ->where('dayOfWeek', $day)
                ->where(function($q) use ($start, $end) {
                    $q->whereBetween('startTime', [$start, $end])
                      ->orWhereBetween('endTime', [$start, $end])
                      ->orWhere(function($sq) use ($start, $end) {
                          $sq->where('startTime', '<=', $start)
                             ->where('endTime', '>=', $end);
                      });
                })
                ->exists();
            if ($overlap) return false;

            // Check overlap with already placed schedules for THIS section
            $sectionOverlap = array_filter($generatedSchedules, function($s) use ($section, $day, $start, $end) {
                return $s->section_id === $section->id && 
                       $s->dayOfWeek === $day && 
                       $this->overlaps($s->startTime, $s->endTime, $start, $end);
            });
            if (!empty($sectionOverlap)) return false;
        }

        return true;
    }

    private function overlaps($s1, $e1, $s2, $end2)
    {
        return max($s1, $s2) < min($e1, $end2);
    }
}
