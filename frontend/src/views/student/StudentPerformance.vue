<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Performance</h2>
        <p class="page-sub">Your grades and subjects per semester.</p>
      </div>
    </div>

    <!-- Semester Cards with full grades -->
    <div class="history-grid">
      <div class="sem-card" v-for="(sem, si) in history" :key="si">
        <div class="sem-header">
          <div class="sem-left">
            <span class="sem-label">{{ sem.semester }}</span>
            <span class="sem-current-badge" v-if="sem.semester.includes('Current')">Current</span>
          </div>
          <div class="sem-right">
            <div class="sem-gwa-block">
              <span class="sem-gwa-label">GWA</span>
              <span class="sem-gwa-value" :class="sem.gwa <= 1.75 ? 'gwa-good' : 'gwa-warn'">{{ sem.gwa }}</span>
            </div>
            <span class="sem-units">{{ totalUnits(sem.subjects) }} units</span>
            <span class="deans-badge" v-if="sem.gwa <= 1.75">Dean's List</span>
          </div>
        </div>
        <div class="subjects-table">
          <div class="subjects-thead">
            <span>Code</span>
            <span>Subject</span>
            <span>Units</span>
            <span>Grade</span>
            <span>Remarks</span>
          </div>
          <div class="subject-row" v-for="s in sem.subjects" :key="s.code">
            <span class="s-code">{{ s.code }}</span>
            <span class="s-name">{{ s.name }}</span>
            <span class="s-units">{{ s.units }}</span>
            <span class="s-grade" :class="gradeClass(s.grade)">{{ s.grade }}</span>
            <span class="s-remarks" :class="s.grade <= 3.0 ? 'passed' : 'failed'">
              {{ s.grade <= 3.0 ? 'Passed' : 'Failed' }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Replace with real API call when backend is ready
// const response = await axios.get('/student/performance')
const history = ref([
  {
    semester: '2nd Semester 2025–2026 (Current)', gwa: 1.72,
    subjects: [
      { code: 'CS301', name: 'Data Structures & Algorithms', units: 3, grade: 1.5 },
      { code: 'CS302', name: 'Software Engineering', units: 3, grade: 1.75 },
      { code: 'CS303', name: 'Computer Organization', units: 3, grade: 1.5 },
      { code: 'CS304', name: 'Web Development', units: 3, grade: 2.0 }
    ]
  },
  {
    semester: '1st Semester 2025–2026', gwa: 1.74,
    subjects: [
      { code: 'CS201', name: 'Algorithms', units: 3, grade: 1.5 },
      { code: 'CS202', name: 'Database Systems', units: 3, grade: 1.75 },
      { code: 'CS203', name: 'Operating Systems', units: 3, grade: 2.0 },
      { code: 'MATH201', name: 'Discrete Mathematics', units: 3, grade: 1.5 }
    ]
  },
  {
    semester: '2nd Semester 2024–2025', gwa: 1.77,
    subjects: [
      { code: 'CS101', name: 'Programming 1', units: 3, grade: 1.5 },
      { code: 'MATH101', name: 'Calculus', units: 3, grade: 2.0 },
      { code: 'CS102', name: 'Object-Oriented Programming', units: 3, grade: 1.75 },
      { code: 'HUM101', name: 'Humanities', units: 3, grade: 1.5 }
    ]
  },
  {
    semester: '1st Semester 2024–2025', gwa: 1.81,
    subjects: [
      { code: 'CS001', name: 'Introduction to Computing', units: 3, grade: 1.5 },
      { code: 'ENGL101', name: 'Technical Writing', units: 3, grade: 2.0 },
      { code: 'MATH001', name: 'College Algebra', units: 3, grade: 1.75 },
      { code: 'PE101', name: 'Physical Education 1', units: 2, grade: 1.5 }
    ]
  }
])

const totalUnits = (subjects) => subjects.reduce((a, s) => a + s.units, 0)

const gradeClass = (grade) => {
  if (grade <= 1.25) return 'gr-ex'
  if (grade <= 1.75) return 'gr-good'
  if (grade <= 2.5) return 'gr-avg'
  return 'gr-low'
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* Semester Cards */
.history-grid { display: flex; flex-direction: column; gap: 16px; }
.sem-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.sem-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; background: #faf8f6; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.sem-left { display: flex; align-items: center; gap: 10px; }
.sem-label { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1a0a00; }
.sem-current-badge { font-size: 9px; font-weight: 700; background: #fff5ef; color: #FF6B1A; border: 1px solid #ffd5b0; padding: 2px 8px; border-radius: 5px; }
.sem-right { display: flex; align-items: center; gap: 14px; }
.sem-gwa-block { display: flex; align-items: baseline; gap: 5px; }
.sem-gwa-label { font-size: 10px; color: #b89f90; text-transform: uppercase; letter-spacing: 0.5px; }
.sem-gwa-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; }
.gwa-good { color: #16a34a; }
.gwa-warn { color: #FF6B1A; }
.sem-units { font-size: 11px; color: #9a8070; background: #f0e8e0; padding: 3px 9px; border-radius: 6px; }
.deans-badge { font-size: 10px; font-weight: 700; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 3px 9px; border-radius: 6px; }

/* Subjects Table */
.subjects-table { padding: 8px 0; }
.subjects-thead { display: grid; grid-template-columns: 100px 1fr 70px 80px 90px; gap: 8px; padding: 10px 22px; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #faf8f6; }
.subject-row { display: grid; grid-template-columns: 100px 1fr 70px 80px 90px; gap: 8px; padding: 13px 22px; border-bottom: 1px solid #faf8f6; align-items: center; transition: background 0.15s; }
.subject-row:last-child { border-bottom: none; }
.subject-row:hover { background: #fdf9f7; }
.s-code { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; display: inline-block; }
.s-name { font-size: 13px; color: #1a0a00; }
.s-units { font-size: 12px; color: #9a8070; text-align: center; }
.s-grade { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; text-align: center; }
.gr-ex { color: #16a34a; }
.gr-good { color: #3b82f6; }
.gr-avg { color: #f59e0b; }
.gr-low { color: #ef4444; }
.s-remarks { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px; display: inline-block; }
.passed { background: #f0fdf4; color: #16a34a; }
.failed { background: #fff1f2; color: #e11d48; }
</style>