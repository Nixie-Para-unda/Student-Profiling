<template>
  <div class="faculty-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Teaching Schedule</h2>
        <p class="page-sub">View your assigned courses and enrolled students.</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading schedule...
    </div>

    <div v-else class="schedule-grid">
      <div v-for="item in schedule" :key="item.id" class="schedule-card pcard">
        <div class="card-header">
          <div class="course-info">
            <span class="course-code">{{ item.course.course_code }}</span>
            <h3 class="course-name">{{ item.course.course_name }}</h3>
          </div>
          <span class="section-badge">{{ item.section.section_name }}</span>
        </div>
        <div class="card-body">
          <div class="schedule-details">
            <div class="detail-row">
              <svg viewBox="0 0 24 24" fill="none" class="icon"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>{{ item.dayOfWeek }}</span>
            </div>
            <div class="detail-row">
              <svg viewBox="0 0 24 24" fill="none" class="icon"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</span>
            </div>
            <div class="detail-row">
              <svg viewBox="0 0 24 24" fill="none" class="icon"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Room {{ item.room }}</span>
            </div>
          </div>
          <button class="view-students-btn" @click="viewStudents(item)">
            View Students ({{ item.section.students_count || 0 }})
          </button>
        </div>
      </div>
    </div>

    <!-- Students Modal -->
    <div v-if="selectedSection" class="modal-overlay" @click.self="selectedSection = null">
      <div class="modal-content pcard">
        <div class="pcard-header">
          <h3>Students in {{ selectedSection.section.section_name }}</h3>
          <button class="close-btn" @click="selectedSection = null">&times;</button>
        </div>
        <div class="pcard-body">
          <table class="students-table">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in sectionStudents" :key="student.id">
                <td>{{ student.user.student_number }}</td>
                <td>{{ student.first_name }} {{ student.last_name }}</td>
                <td><span class="status-badge" :class="student.user.status">{{ student.user.status }}</span></td>
                <td>
                  <button class="action-btn">Report Violation</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const schedule = ref([])
const selectedSection = ref(null)
const sectionStudents = ref([])

const fetchSchedule = async () => {
  loading.value = true
  try {
    const response = await axios.get('/faculty/schedule')
    schedule.value = response.data
  } catch (err) {
    console.error('Failed to fetch schedule:', err)
  } finally {
    loading.value = false
  }
}

const viewStudents = async (item) => {
  selectedSection.value = item
  try {
    const response = await axios.get(`/faculty/sections/${item.section_id}/students`)
    sectionStudents.value = response.data
  } catch (err) {
    console.error('Failed to fetch students:', err)
  }
}

const formatTime = (time) => {
  return new Date(`2026-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchSchedule)
</script>

<style scoped>
.faculty-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

.schedule-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.card-header { padding: 18px 22px; border-bottom: 1px solid #faf8f6; display: flex; justify-content: space-between; align-items: flex-start; }
.course-code { font-size: 11px; font-weight: 700; color: #FF6B1A; text-transform: uppercase; }
.course-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; margin-top: 4px; }
.section-badge { background: #fffaf8; color: #FF6B1A; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #f0e8e0; }

.card-body { padding: 22px; }
.schedule-details { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.detail-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #9a8070; }
.icon { width: 16px; height: 16px; }

.view-students-btn { width: 100%; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.view-students-btn:hover { border-color: #FF6B1A; background: #fffaf8; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { width: 100%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column; }
.close-btn { background: none; border: none; font-size: 24px; color: #b89f90; cursor: pointer; }

.students-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.students-table th { text-align: left; padding: 12px; color: #9a8070; font-weight: 700; border-bottom: 2px solid #faf8f6; }
.students-table td { padding: 12px; border-bottom: 1px solid #faf8f6; }

.status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
.active { background: #f0fdf4; color: #16a34a; }
.pending { background: #fffbeb; color: #f59e0b; }

.action-btn { background: #fff1f2; color: #e11d48; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
