<template>
  <div class="students-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Student Profiles</h2>
        <p class="section-desc">View all student records, GWA, violations, and organization memberships.</p>
      </div>
      <div class="header-right">
        <!-- Import Button for Secretary -->
        <template v-if="authStore.isSecretary">
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept=".csv" 
            style="display: none" 
          />
          <button class="import-btn" @click="$refs.fileInput.click()" :disabled="importing">
            <svg v-if="!importing" viewBox="0 0 20 20" fill="none"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1m-4-8l-4-4-4 4m4-4v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-if="importing" class="spinner-sm"></span>
            {{ importing ? 'Importing...' : 'Import CSV' }}
          </button>
        </template>

        <div class="search-container">
          <svg viewBox="0 0 20 20" fill="none" class="search-icon"><path d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <input type="text" placeholder="Search students..." class="table-search" />
        </div>
        <div class="filter-group">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">BSCS</button>
          <button class="filter-btn">BSIT</button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-student-id">STUDENT ID</th>
            <th class="col-student">STUDENT</th>
            <th class="col-course">COURSE</th>
            <th class="col-year">YEAR</th>
            <th class="col-gwa">GWA</th>
            <th class="col-violations">VIOLATIONS</th>
            <th class="col-org">ORGANIZATION</th>
            <th class="col-skills">SKILLS</th>
            <th class="col-status">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="index">
            <td class="col-rank">{{ index + 1 }}</td>
            <td class="col-student-id">
              <span class="student-id-text">{{ student.studentNumber }}</span>
            </td>
            <td class="col-student">
              <div class="student-cell">
                <span class="name">{{ student.name }}</span>
              </div>
            </td>
            <td class="col-course">{{ student.course }}</td>
            <td class="col-year">{{ student.year }}</td>
            <td class="col-gwa"><strong>{{ student.gwa }}</strong></td>
            <td class="col-violations">
              <span class="v-count" :class="{ danger: student.violations > 0 }">{{ student.violations }}</span>
            </td>
            <td class="col-org">{{ student.org }}</td>
            <td class="col-skills">
              <div class="skills-wrap">
                <span v-for="skill in student.skills" :key="skill" class="skill-tag">{{ skill }}</span>
              </div>
            </td>
            <td class="col-status">
              <span class="status-badge" :class="student.statusClass">{{ student.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const importing = ref(false)
const loadingStudents = ref(true)
const fileInput = ref(null)
const students = ref([])

const fetchStudents = async () => {
  loadingStudents.value = true
  try {
    const response = await axios.get('/students')
    students.value = response.data.map(s => ({
      studentNumber: s.user?.student_number || 'N/A',
      name: `${s.first_name} ${s.last_name}`,
      course: s.program?.program_code || 'Unassigned',
      year: s.section?.year_level ? `${s.section.year_level}${getYearSuffix(s.section.year_level)} Year` : 'N/A',
      gwa: s.gwa || '0.00',
      violations: s.violations_count || 0,
      org: '—',
      skills: [],
      status: s.user?.status === 'active' ? 'Active' : 'Pending',
      statusClass: s.user?.status === 'active' ? 'st-good' : 'st-monitor',
      color: s.user?.status === 'active' ? '#10b981' : '#94a3b8'
    }))
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loadingStudents.value = false
  }
}

const getYearSuffix = (year) => {
  if (year == 1) return 'st'
  if (year == 2) return 'nd'
  if (year == 3) return 'rd'
  return 'th'
}

onMounted(() => {
  if (authStore.isDean || authStore.isChair || authStore.isSecretary) {
    fetchStudents()
  }
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  importing.value = true
  try {
    const response = await axios.post('/secretary/students/import', formData)
    alert(response.data.message || 'Students imported successfully!')
    fetchStudents() // Refresh list
  } catch (err) {
    console.error('Import failed:', err)
    alert(err.response?.data?.message || 'Failed to import students.')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = '' // Clear input
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.students-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
}

.section-desc {
  font-size: 13px;
  color: #b89f90;
  margin-top: 4px;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.import-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #f0e8e0;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
  height: 40px;
}

.import-btn:hover:not(:disabled) {
  border-color: #FF6B1A;
  color: #FF6B1A;
  background: #fff5ef;
}

.import-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.import-btn svg { width: 16px; height: 16px; }

.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(255, 107, 26, 0.2);
  border-top-color: #FF6B1A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.search-container {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #c0b0a5;
}

.table-search {
  width: 100%;
  padding: 9px 12px 9px 36px;
  background: #fff;
  border: 1.5px solid #f0e8e0;
  border-radius: 10px;
  font-size: 13px;
  font-family: 'Outfit', sans-serif;
  outline: none;
  transition: all 0.2s;
}

.table-search:focus {
  border-color: #FF6B1A;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.08);
}

.filter-group {
  display: flex;
  background: #f0e8e0;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}

.filter-btn {
  padding: 6px 16px;
  border: none;
  background: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #9a8070;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #fff;
  color: #FF6B1A;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.table-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 16px 20px;
  background: #faf8f6;
  font-size: 11px;
  font-weight: 700;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #f0e8e0;
}

.data-table td {
  padding: 14px 20px;
  font-size: 13px;
  color: #1a0a00;
  border-bottom: 1px solid #faf8f6;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.col-rank { width: 50px; text-align: center; color: #b89f90; font-weight: 600; }
.col-student-id { width: 130px; font-weight: 600; color: #64748b; }
.col-student { min-width: 220px; }
.student-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 12px;
}
.name { font-weight: 600; }

.v-count {
  font-weight: 700;
  color: #10b981;
}
.v-count.danger {
  color: #ef4444;
}

.skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-tag {
  font-size: 10px;
  padding: 2px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 5px;
  white-space: nowrap;
}

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.st-dean { background: #f0fdf4; color: #16a34a; }
.st-rising { background: #fff5ef; color: #FF6B1A; }
.st-risk { background: #fff1f2; color: #e11d48; }
.st-monitor { background: #fff7ed; color: #ea580c; }
.st-good { background: #ecfeff; color: #0891b2; }
</style>
