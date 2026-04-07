<template>
  <div class="faculty-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Teaching Schedule</h2>
        <p class="page-sub">View your assigned courses and enrolled students.</p>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="stats-grid">
      <div class="stat-card stat-card-blue">
        <div class="stat-icon stat-icon-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-number stat-number-blue">{{ stats.totalStudents }}</span>
          <span class="stat-label">TOTAL STUDENTS</span>
        </div>
      </div>

      <div class="stat-card stat-card-green">
        <div class="stat-icon stat-icon-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-number stat-number-green">{{ stats.activeStudents }}</span>
          <span class="stat-label">ACTIVE</span>
        </div>
      </div>

      <div class="stat-card stat-card-purple">
        <div class="stat-icon stat-icon-purple">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ stats.pendingSetup }}</span>
          <span class="stat-label">PENDING SETUP</span>
        </div>
      </div>

      <div class="stat-card stat-card-orange">
        <div class="stat-icon stat-icon-orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-number stat-number-orange">{{ stats.bscsStudents }}</span>
          <span class="stat-label">BSCS</span>
        </div>
      </div>

      <div class="stat-card stat-card-red">
        <div class="stat-icon stat-icon-red">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-number stat-number-red">{{ stats.bsitStudents }}</span>
          <span class="stat-label">BSIT</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading schedule...
    </div>

    <div v-else class="calendar-card">
      <div class="calendar-wrapper">
        <div class="calendar-grid">
          <!-- Header: Days -->
          <div class="time-header"></div>
          <div v-for="day in days" :key="day" class="day-header">{{ day }}</div>

          <!-- Time Labels and Grid Background -->
          <template v-for="(time, tIdx) in timeLabels" :key="time">
            <div class="time-label">{{ time }}</div>
            <div v-for="day in days" :key="day + time" class="grid-cell"></div>
          </template>

          <!-- Schedule Items (Dynamic) -->
          <div 
            v-for="(item, index) in formattedSchedule" 
            :key="index"
            class="schedule-item"
            :style="getItemStyle(item)"
            @click="viewStudents(item)"
          >
            <div class="item-content">
              <div class="item-name">{{ item.course.course_name }}</div>
              <div class="item-meta">
                <span class="item-code">{{ item.course.course_code }}</span>
                <span class="item-sep">|</span>
                <span class="item-section">{{ item.section.section_name }}</span>
                <span class="item-sep">|</span>
                <span class="item-room">{{ item.room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Students Modal -->
    <div v-if="selectedSection" class="modal-overlay" @click.self="selectedSection = null">
      <div class="modal-content pcard">
        <div class="modal-header-styled">
          <div class="modal-title-info">
            <h3>Students in {{ selectedSection.section.section_name }}</h3>
            <p class="modal-subtitle">{{ selectedSection.course.course_code }} · {{ selectedSection.course.course_name }}</p>
          </div>
          <button class="close-btn" @click="selectedSection = null">&times;</button>
        </div>
        <div class="modal-body-styled">
          <div v-if="loadingStudents" class="loading-small">
            <span class="spinner-sm"></span>
            Loading student list...
          </div>
          <table v-else class="students-table">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in sectionStudents" :key="student.id">
                <td class="id-cell">{{ student.user.student_number }}</td>
                <td class="name-cell">{{ student.first_name }} {{ student.last_name }}</td>
                <td><span class="status-badge" :class="student.user.status">{{ student.user.status }}</span></td>
                <td class="text-right">
                  <button class="report-btn">Report Violation</button>
                </td>
              </tr>
              <tr v-if="sectionStudents.length === 0">
                <td colspan="4" class="empty-row">No students enrolled in this section yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const loading = ref(true)
const loadingStudents = ref(false)
const schedule = ref([])
const selectedSection = ref(null)
const sectionStudents = ref([])

// Stats data
const stats = ref({
  totalStudents: 40,
  activeStudents: 40,
  pendingSetup: 0,
  bscsStudents: 20,
  bsitStudents: 20
})

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Generate time labels from 7:00 AM to 8:30 PM in 30-minute increments
const timeLabels = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', 
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
]

const START_MINUTES = 7 * 60 // 7:00 AM
const MINUTES_PER_ROW = 15 // 15-minute increments for better precision

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  // Handle both "HH:MM:SS" and "HH:MM AM/PM" formats
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [time, modifier] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (hours === 12) hours = 0
    if (modifier === 'PM') hours += 12
    return hours * 60 + (minutes || 0)
  } else {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + (minutes || 0)
  }
}

const formattedSchedule = computed(() => {
  if (!Array.isArray(schedule.value)) return []
  
  return schedule.value.map(item => {
    if (!item || !item.startTime || !item.endTime || !item.dayOfWeek) return null
    
    const start = timeToMinutes(item.startTime)
    const end = timeToMinutes(item.endTime)
    const duration = end - start
    
    // grid-row: starts at 2 (1 is header)
    const startRow = Math.floor((start - START_MINUTES) / MINUTES_PER_ROW) + 2
    const rowSpan = Math.max(1, Math.floor(duration / MINUTES_PER_ROW))
    
    // Handle day names (full names or abbreviations)
    const dayName = item.dayOfWeek.charAt(0).toUpperCase() + item.dayOfWeek.slice(1).toLowerCase()
    let colIndex = days.indexOf(dayName)
    
    // Fallback for short names if needed
    if (colIndex === -1) {
      const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      colIndex = shortDays.indexOf(dayName.slice(0, 3))
    }
    
    if (colIndex === -1) return null // Skip if day is invalid
    
    const colPosition = colIndex + 2 // +1 for time column, +1 for 1-based index
    
    return {
      ...item,
      gridArea: `${startRow} / ${colPosition} / span ${rowSpan} / ${colPosition}`
    }
  }).filter(Boolean)
})

const getItemStyle = (item) => ({
  gridArea: item.gridArea,
  backgroundColor: item.color || '#FF6B1A',
  borderLeft: `3px solid rgba(0,0,0,0.15)`
})

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
  loadingStudents.value = true
  try {
    const response = await axios.get(`/faculty/sections/${item.section_id}/students`)
    sectionStudents.value = response.data
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loadingStudents.value = false
  }
}

onMounted(fetchSchedule)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.faculty-page { display: flex; flex-direction: column; gap: 16px; font-family: 'Outfit', sans-serif; height: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 4px 0; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 12px; color: #b89f90; margin-top: 2px; }

/* Stats Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #f0e8e0;
  border-top: 4px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card-blue { border-top-color: #3b82f6; }
.stat-card-green { border-top-color: #22c55e; }
.stat-card-purple { border-top-color: #a855f7; }
.stat-card-orange { border-top-color: #f97316; }
.stat-card-red { border-top-color: #ef4444; }

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-blue { background: #eff6ff; color: #3b82f6; }
.stat-icon-green { background: #f0fdf4; color: #22c55e; }
.stat-icon-purple { background: #faf5ff; color: #a855f7; }
.stat-icon-orange { background: #fff7ed; color: #f97316; }
.stat-icon-red { background: #fef2f2; color: #ef4444; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  color: #1a0a00;
}

.stat-number-blue { color: #3b82f6; }
.stat-number-green { color: #22c55e; }
.stat-number-orange { color: #f97316; }
.stat-number-red { color: #ef4444; }

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.calendar-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.calendar-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

.calendar-grid {
  display: grid;
  grid-template-columns: 75px repeat(7, 1fr);
  /* 14 hours * 4 slots = 56 rows + 1 header */
  grid-template-rows: 40px repeat(56, 24px); 
  min-width: 1000px;
}

.time-header {
  background: #faf8f6;
  border-bottom: 1px solid #f0e8e0;
  border-right: 1px solid #f0e8e0;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 21;
}

.day-header {
  background: #faf8f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #6b7280;
  border-bottom: 1px solid #f0e8e0;
  border-right: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 20;
}

.time-label {
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  border-right: 1px solid #f0e8e0;
  grid-row: span 2;
  background: #fff;
  position: sticky;
  left: 0;
  z-index: 10;
  border-bottom: 1px solid #f3f4f6;
}

.grid-cell {
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f9fafb;
}

.time-label:nth-of-type(odd) {
  border-bottom: 1px solid #f0e8e0;
}

.schedule-item {
  margin: 1px 2px;
  padding: 6px 8px;
  border-radius: 6px;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  z-index: 5;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.schedule-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 15;
  filter: brightness(1.05);
}

.item-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  padding-top: 2px;
}

.item-name {
  font-weight: 700;
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 600;
  opacity: 0.95;
}

.item-sep {
  opacity: 0.5;
}

/* Modal Styles */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: #fff; border-radius: 24px; width: 100%; max-width: 850px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 85vh; }
.modal-header-styled { padding: 20px 24px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: flex-start; background: #fffaf8; }
.modal-title-info h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; color: #1a0a00; }
.modal-subtitle { font-size: 12px; color: #b89f90; margin-top: 2px; }
.close-btn { background: none; border: none; font-size: 28px; color: #b89f90; cursor: pointer; line-height: 1; }
.modal-body-styled { padding: 0; overflow-y: auto; }

.students-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.students-table th { text-align: left; padding: 14px 24px; background: #fff; position: sticky; top: 0; z-index: 1; font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f0e8e0; }
.students-table td { padding: 16px 24px; border-bottom: 1px solid #faf8f6; }
.id-cell { font-weight: 700; color: #FF6B1A; }
.name-cell { font-weight: 600; color: #1a0a00; }
.text-right { text-align: right; }

.status-badge { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
.status-badge.active { background: #f0fdf4; color: #16a34a; }
.status-badge.pending { background: #fffbeb; color: #f59e0b; }

.report-btn { background: #fff1f2; color: #e11d48; border: none; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.report-btn:hover { background: #ffe4e6; transform: translateY(-1px); }

.loading-state { padding: 100px; text-align: center; color: #b89f90; }
.loading-small { padding: 40px; text-align: center; color: #b89f90; font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.empty-row { padding: 40px; text-align: center; color: #b89f90; font-style: italic; }

.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
.spinner-sm { width: 18px; height: 18px; border: 2px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .calendar-grid {
    grid-template-columns: 65px repeat(7, 1fr);
    min-width: 800px;
  }
}
</style>
