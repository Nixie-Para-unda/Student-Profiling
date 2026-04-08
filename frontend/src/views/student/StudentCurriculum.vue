<template>
  <div class="curriculum-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Curriculum</h2>
        <p class="page-sub">View your program's course curriculum organized by year and semester.</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner-lg"></div>
      <p>Loading curriculum...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div class="program-info-card">
        <div class="program-badge">{{ studentProgram }}</div>
        <h3 class="program-name">{{ studentProgramName }}</h3>
        <p class="program-desc">Your enrolled program curriculum</p>
      </div>

      <div v-for="yearData in groupedCurriculum" :key="yearData.year" class="year-section">
        <div class="year-header">
          <h3 class="year-title">{{ yearData.year }}{{ getYearSuffix(yearData.year) }} Year</h3>
        </div>
        
        <div class="semesters-row">
          <div v-for="sem in yearData.semesters" :key="sem.semester" class="semester-card">
            <div class="semester-header">
              <span class="sem-label">{{ sem.semester }}</span>
              <span class="sem-total">{{ sem.courses.length }} courses · {{ getTotalUnits(sem.courses) }} units</span>
            </div>
            
            <div class="courses-list">
              <div v-for="course in sem.courses" :key="course.id" class="course-item">
                <div class="course-code">{{ course.code }}</div>
                <div class="course-info">
                  <h4 class="course-name">{{ course.name }}</h4>
                  <div class="course-details">
                    <span class="units-badge">{{ course.lec_units + course.lab_units }} units</span>
                    <span class="hours-badge">{{ course.lec_hours + course.lab_hours }} hrs/week</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sem.courses.length === 0" class="empty-sem">
              No courses assigned for this semester
            </div>
          </div>
        </div>
      </div>

      <div v-if="groupedCurriculum.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" class="empty-icon">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>No curriculum data available for your program.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const curriculum = ref([])
const studentProgram = ref('')
const studentProgramName = ref('')

const fetchCurriculum = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const studentRes = await axios.get('/student/profile')
    const student = studentRes.data
    const programId = student.section?.program_id || student.program_id
    
    if (!programId) {
      error.value = 'No program assigned to your account.'
      return
    }

    studentProgram.value = student.section?.program?.program_code || student.program?.program_code || ''
    studentProgramName.value = student.section?.program?.program_name || student.program?.program_name || ''
    
    const curriculumRes = await axios.get(`/student/curriculum?program_id=${programId}`)
    curriculum.value = curriculumRes.data
  } catch (err) {
    console.error('Failed to fetch curriculum:', err)
    error.value = 'Failed to load curriculum data.'
  } finally {
    loading.value = false
  }
}

const getYearSuffix = (y) => {
  const last = y % 10
  if (last === 1 && y !== 11) return 'st'
  if (last === 2 && y !== 12) return 'nd'
  if (last === 3 && y !== 13) return 'rd'
  return 'th'
}

const getTotalUnits = (courses) => {
  return courses.reduce((sum, c) => sum + (c.lec_units || 0) + (c.lab_units || 0), 0)
}

const groupedCurriculum = computed(() => {
  const grouped = {}
  
  curriculum.value.forEach(item => {
    const year = item.year_level
    const sem = item.semester
    
    if (!grouped[year]) {
      grouped[year] = { year, semesters: [] }
    }
    
    let semData = grouped[year].semesters.find(s => s.semester === sem)
    if (!semData) {
      semData = { semester: sem, courses: [] }
      grouped[year].semesters.push(semData)
    }
    
    semData.courses.push(item.course)
  })
  
  Object.values(grouped).forEach(year => {
    year.semesters.sort((a, b) => {
      const order = { '1st Semester': 1, '2nd Semester': 2, 'Summer': 3 }
      return (order[a.semester] || 99) - (order[b.semester] || 99)
    })
  })
  
  return Object.values(grouped).sort((a, b) => a.year - b.year)
})

onMounted(() => {
  fetchCurriculum()
})
</script>

<style scoped>
.curriculum-page {
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0 0 4px;
}

.page-sub {
  font-size: 14px;
  color: #9a8070;
  margin: 0;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border: 3px solid #f0e8e0;
  border-top-color: #FF6B1A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.program-info-card {
  background: linear-gradient(135deg, #FF6B1A 0%, #ff8c2a 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: #fff;
}

.program-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.program-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
}

.program-desc {
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}

.year-section {
  margin-bottom: 28px;
}

.year-header {
  margin-bottom: 16px;
}

.year-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #FF6B1A;
  display: inline-block;
}

.semesters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.semester-card {
  background: #fff;
  border: 1px solid #e8ddd6;
  border-radius: 12px;
  overflow: hidden;
}

.semester-header {
  background: #faf8f6;
  padding: 14px 18px;
  border-bottom: 1px solid #e8ddd6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sem-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a0a00;
}

.sem-total {
  font-size: 12px;
  color: #9a8070;
}

.courses-list {
  padding: 12px;
}

.course-item {
  display: flex;
  gap: 14px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.course-item:hover {
  background: #faf8f6;
}

.course-item:not(:last-child) {
  margin-bottom: 8px;
}

.course-code {
  font-family: 'Plus Jakarta Sans', sans-serif;
  width: 72px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #FF6B1A;
  background: #fff5ef;
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
}

.course-info {
  flex: 1;
}

.course-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a0a00;
  margin: 0 0 6px;
}

.course-details {
  display: flex;
  gap: 8px;
}

.units-badge, .hours-badge {
  font-size: 11px;
  color: #9a8070;
  background: #f5f3f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.empty-sem {
  padding: 20px;
  text-align: center;
  color: #9a8070;
  font-size: 13px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #c4b8b0;
  margin-bottom: 12px;
}
</style>