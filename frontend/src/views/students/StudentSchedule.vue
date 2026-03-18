<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Class Schedule</h2><p class="page-sub">2nd Semester · Academic Year 2026–2027</p></div>
    </div>
    <div class="pcard">
      <div class="pcard-body no-pad">
        <table class="data-table">
          <thead>
            <tr><th>Subject Code</th><th>Subject Name</th><th>Professor</th><th>Schedule</th><th>Room</th><th>Units</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in schedule" :key="s.code">
              <td><span class="code-badge">{{ s.code }}</span></td>
              <td><strong>{{ s.name }}</strong></td>
              <td>
                <div class="prof-cell">
                  <div class="prof-avatar" :style="{ background: s.color }">{{ s.professor.charAt(0) }}</div>
                  {{ s.professor }}
                </div>
              </td>
              <td>{{ s.sched }}</td>
              <td>{{ s.room }}</td>
              <td><span class="units-badge">{{ s.units }} units</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const schedule = ref([
  { code: 'CS301', name: 'Data Structures & Algorithms', professor: 'Dr. R. Villanueva', sched: 'MWF 7:30–9:00 AM', room: 'CS Lab 3', units: 3, color: '#8b5cf6' },
  { code: 'CS302', name: 'Software Engineering', professor: 'Prof. A. Reyes', sched: 'TTH 10:00 AM–1:00 PM', room: 'Room 204', units: 3, color: '#FF6B1A' },
  { code: 'MATH201', name: 'Discrete Mathematics', professor: 'Dr. J. Cruz', sched: 'MWF 1:00–2:30 PM', room: 'Room 101', units: 3, color: '#3b82f6' },
  { code: 'CS303', name: 'Computer Organization', professor: 'Prof. L. Garcia', sched: 'TTH 1:00–2:30 PM', room: 'Room 103', units: 3, color: '#10b981' },
  { code: 'CS304', name: 'Web Development', professor: 'Prof. M. Diaz', sched: 'MWF 3:00–4:30 PM', room: 'CS Lab 1', units: 3, color: '#f59e0b' },
  { code: 'HUM101', name: 'Ethics & Moral Philosophy', professor: 'Dr. C. Bautista', sched: 'TTH 4:00–5:30 PM', room: 'Room 205', units: 3, color: '#6b7280' },
  { code: 'PE201', name: 'Physical Education 3', professor: 'Coach F. Torres', sched: 'Sat 8:00–10:00 AM', room: 'Gym', units: 2, color: '#ef4444' }
])
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-body { padding: 22px; }
.no-pad { padding: 0; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 14px 20px; background: #faf8f6; font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; }
.data-table td { padding: 14px 20px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #fdf9f7; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 4px 10px; border-radius: 7px; white-space: nowrap; }
.prof-cell { display: flex; align-items: center; gap: 10px; }
.prof-avatar { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
.units-badge { font-size: 11px; font-weight: 700; background: #eff6ff; color: #3b82f6; padding: 4px 10px; border-radius: 7px; }
</style>