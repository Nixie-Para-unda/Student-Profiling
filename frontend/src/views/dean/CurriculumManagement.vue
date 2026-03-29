<template>
  <div class="curriculum-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Curriculum Management</h2>
        <p class="page-sub">Define and manage program curricula, courses, and year levels.</p>
      </div>
      <div class="header-actions">
        <button class="outline-btn" @click="$refs.fileInput.click()" :disabled="importing">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1m-4-8l-4-4-4 4m4-4v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ importing ? 'Importing...' : 'Import CSV' }}
        </button>
        <input type="file" ref="fileInput" @change="handleImport" style="display: none" accept=".csv" />
        <button class="primary-btn" @click="openAddModal">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add Curriculum
        </button>
      </div>
    </div>

    <div class="filter-bar pcard">
      <div class="filter-group">
        <label>Select Program to View</label>
        <select v-model="filterProgram" @change="fetchCurriculum">
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
        </select>
      </div>
    </div>

    <div class="curriculum-container">
      <div v-if="filterProgram" class="program-header-info">
        <h2 class="program-full-title">
          {{ programs.find(p => p.id === filterProgram)?.program_name || 'Curriculum' }} 
          ({{ programs.find(p => p.id === filterProgram)?.program_code }})
        </h2>
        <div class="program-divider"></div>
      </div>

      <div v-if="loading" class="loading-state pcard">
        <span class="spinner"></span>
        Loading curriculum...
      </div>
      
      <div v-else-if="groupedCurriculum.length === 0" class="empty-state pcard">
        <p>No curriculum entries found. Select a program or add a new curriculum.</p>
      </div>

      <div v-else v-for="year in groupedCurriculum" :key="year.year" class="year-section">
        <div class="year-header">
          <h3 class="year-title">{{ year.year }}{{ getYearSuffix(year.year) }} Year</h3>
          <span class="program-badge" v-if="filterProgram">
            {{ programs.find(p => p.id === filterProgram)?.program_code }}
          </span>
        </div>
        
        <div class="semester-grid">
          <div v-for="sem in year.semesters" :key="sem.semester" class="semester-card pcard">
            <div class="sem-header">
              <h4>{{ sem.semester }} Semester</h4>
              <span class="course-count">{{ sem.courses.length }} Courses</span>
            </div>
            <div class="sem-body">
              <div class="table-responsive">
                <table class="sem-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Lec Units</th>
                      <th>Lab Units</th>
                      <th>Total Units</th>
                      <th>Prerequisites</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in sem.courses" :key="item.id">
                      <td class="code-cell">{{ item.course.course_code }}</td>
                      <td class="name-cell">{{ item.course.course_name }}</td>
                      <td class="units-cell text-center">{{ item.course.lec_units || 0 }}</td>
                      <td class="units-cell text-center">{{ item.course.lab_units || 0 }}</td>
                      <td class="units-cell text-center">{{ item.course.units }}</td>
                      <td class="prereq-cell">{{ item.course.prerequisites || 'None' }}</td>
                      <td class="action-cell">
                        <button class="delete-btn-sm" @click="deleteEntry(item.id)" title="Remove from curriculum">
                          <svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M7 6V4a2 2 0 012-2h2a2 2 0 012 2v2m-7 0v10a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BULK ADD MODAL -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Add Curriculum for Program</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="bulk-form-grid">
            <div class="form-group">
              <label>1. Select Program</label>
              <div class="program-selector">
                <button 
                  v-for="p in programs" 
                  :key="p.id" 
                  class="prog-chip" 
                  :class="{ active: form.program_id === p.id }"
                  @click="form.program_id = p.id"
                >
                  {{ p.program_code }}
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>2. Year Level</label>
                <select v-model="form.year_level">
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div class="form-group">
                <label>3. Semester</label>
                <select v-model="form.semester">
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>4. Select Courses</label>
              <div class="course-search-wrap">
                <input v-model="courseSearch" type="text" placeholder="Search courses by name or code..." class="course-search-input" />
              </div>
              <div class="course-selection-list">
                <label v-for="c in filteredCourses" :key="c.id" class="course-checkbox-item">
                  <input type="checkbox" :value="c.id" v-model="form.course_ids" />
                  <div class="course-info-sm">
                    <span class="c-code">{{ c.course_code }}</span>
                    <span class="c-name">{{ c.course_name }}</span>
                    <div class="c-meta">
                      <span class="type-badge" :class="c.type">{{ c.type?.toUpperCase() }}</span>
                      <span class="unit-info">
                        <span v-if="c.lec_units">{{ c.lec_units }} Lec</span>
                        <span v-if="c.lec_units && c.lab_units"> + </span>
                        <span v-if="c.lab_units">{{ c.lab_units }} Lab</span>
                        ({{ c.units }} Total)
                      </span>
                    </div>
                  </div>
                </label>
                <div v-if="filteredCourses.length === 0" class="empty-small">No courses found matching your search.</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="selected-summary">
            <strong>{{ form.course_ids.length }}</strong> courses selected
          </div>
          <button class="ghost-btn" @click="showAddModal = false">Cancel</button>
          <button class="primary-btn" @click="saveBulkEntry" :disabled="saving || form.course_ids.length === 0">
            {{ saving ? 'Saving...' : 'Add to Curriculum' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const curriculum = ref([])
const programs = ref([])
const courses = ref([])
const loading = ref(false)
const importing = ref(false)
const saving = ref(false)
const showAddModal = ref(false)
const filterProgram = ref('')
const fileInput = ref(null)
const courseSearch = ref('')

const form = ref({
  program_id: '',
  year_level: '1',
  semester: '1st',
  course_ids: []
})

const filteredCourses = computed(() => {
  if (!courseSearch.value) return courses.value
  const s = courseSearch.value.toLowerCase()
  return courses.value.filter(c => 
    c.course_code.toLowerCase().includes(s) || 
    c.course_name.toLowerCase().includes(s)
  )
})

const groupedCurriculum = computed(() => {
  if (curriculum.value.length === 0) return []
  
  const years = {}
  curriculum.value.forEach(item => {
    const y = item.year_level
    if (!years[y]) years[y] = {}
    
    const s = item.semester
    if (!years[y][s]) years[y][s] = []
    
    years[y][s].push(item)
  })

  // Sort and format
  return Object.keys(years).sort().map(y => ({
    year: y,
    semesters: Object.keys(years[y]).sort().map(s => ({
      semester: s,
      courses: years[y][s]
    }))
  }))
})

const getYearSuffix = (y) => y == 1 ? 'st' : y == 2 ? 'nd' : y == 3 ? 'rd' : 'th'

const fetchCurriculum = async () => {
  loading.value = true
  try {
    const res = await axios.get('/dean/curriculum', { params: { program_id: filterProgram.value } })
    curriculum.value = res.data
    
    // Extract programs if not loaded
    if (programs.value.length === 0) {
      const progMap = new Map()
      res.data.forEach(item => {
        if (item.program && !progMap.has(item.program_id)) {
          progMap.set(item.program_id, item.program)
        }
      })
      programs.value = Array.from(progMap.values())
    }
  } catch (err) {
    console.error('Failed to fetch curriculum:', err)
  } finally {
    loading.value = false
  }
}

const fetchHelperData = async () => {
  try {
    const [programsRes, coursesRes] = await Promise.all([
      axios.get('/programs'),
      axios.get('/courses')
    ])
    
    programs.value = programsRes.data
    courses.value = coursesRes.data

    // Set BSIT as default if not set
    if (!filterProgram.value && programs.value.length > 0) {
      const bsit = programs.value.find(p => p.program_code === 'BSIT')
      if (bsit) {
        filterProgram.value = bsit.id
        fetchCurriculum()
      }
    }
  } catch (err) {
    console.error('Helper data fetch failed:', err)
  }
}

const openAddModal = () => {
  resetForm()
  if (filterProgram.value) {
    form.value.program_id = filterProgram.value
  }
  showAddModal.value = true
}

const saveBulkEntry = async () => {
  if (!form.value.program_id || form.value.course_ids.length === 0) {
    alert('Please select a program and at least one course.')
    return
  }
  saving.value = true
  try {
    const res = await axios.post('/dean/curriculum/bulk', form.value)
    alert(res.data.message)
    showAddModal.value = false
    fetchCurriculum()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save entries.')
  } finally {
    saving.value = false
  }
}

const deleteEntry = async (id) => {
  if (!confirm('Are you sure you want to remove this course from the curriculum?')) return
  try {
    await axios.delete(`/dean/curriculum/${id}`)
    fetchCurriculum()
  } catch (err) {
    alert('Failed to delete entry.')
  }
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  importing.value = true
   console.log('Importing curriculum with token:', authStore.token)
   console.log('Role:', authStore.user?.role)
   try {
     const res = await axios.post('/dean/curriculum/import', formData, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
      console.log('Import success:', res.data)
      alert(res.data.message)
      fetchCurriculum()
    } catch (err) {
      console.error('Import failed details:', err.response?.status, err.response?.data)
      if (err.response?.status === 403) {
        alert(`Forbidden: Your role is ${err.response.data.user_role}, but this action requires: ${err.response.data.required_roles.join(', ')}`)
      } else {
        alert(err.response?.data?.message || 'Import failed.')
      }
    } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const resetForm = () => {
  form.value = {
    program_id: '',
    year_level: '1',
    semester: '1st',
    course_ids: []
  }
  courseSearch.value = ''
}

onMounted(() => {
  fetchHelperData()
})
</script>

<style scoped>
.curriculum-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.filter-bar { padding: 16px 22px; display: flex; gap: 20px; align-items: center; }
.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; }
.filter-group select { padding: 8px 12px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; background: #fff; cursor: pointer; }

.program-header-info { margin-bottom: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.program-full-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #1a0a00; letter-spacing: -0.5px; }
.program-divider { width: 60px; height: 4px; background: #FF6B1A; border-radius: 2px; }

.curriculum-container { display: flex; flex-direction: column; gap: 30px; }
.year-section { display: flex; flex-direction: column; gap: 16px; }
.year-header { display: flex; justify-content: space-between; align-items: center; }
.year-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #1a0a00; border-left: 4px solid #FF6B1A; padding-left: 12px; }
.program-badge { font-size: 12px; font-weight: 800; color: #FF6B1A; background: #fffaf8; padding: 4px 12px; border-radius: 20px; border: 1px solid #f0e8e0; box-shadow: 0 2px 6px rgba(255,107,26,0.05); }

.semester-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
@media (max-width: 900px) {
  .semester-grid { grid-template-columns: 1fr; }
  .semester-card { min-width: 0; }
}
.semester-card { display: flex; flex-direction: column; min-width: 400px; }
.sem-header { padding: 14px 20px; background: #fffaf8; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.sem-header h4 { font-size: 14px; font-weight: 700; color: #1a0a00; }
.course-count { font-size: 11px; font-weight: 600; color: #9a8070; background: #f0e8e0; padding: 2px 8px; border-radius: 10px; }
.sem-body { padding: 0; }

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.sem-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 650px; }
.sem-table th { text-align: left; padding: 10px 20px; font-size: 11px; color: #9a8070; text-transform: uppercase; border-bottom: 1px solid #faf8f6; white-space: nowrap; }
.sem-table td { padding: 12px 20px; border-bottom: 1px solid #faf8f6; }
.code-cell { font-weight: 700; color: #FF6B1A; width: 100px; }
.name-cell { min-width: 180px; font-weight: 600; color: #1a0a00; }
.units-cell { font-weight: 600; color: #1a0a00; width: 60px; }
.prereq-cell { color: #9a8070; font-size: 12px; min-width: 120px; }
.text-center { text-align: center; }
.action-cell { text-align: right; width: 40px; }

.delete-btn-sm { background: none; border: none; color: #c0b0a5; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
.delete-btn-sm:hover { color: #ef4444; background: #fee2e2; }
.delete-btn-sm svg { width: 16px; height: 16px; }

.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.primary-btn:disabled { background: #f0e8e0; cursor: not-allowed; }
.outline-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-icon { width: 16px; height: 16px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 24px; width: 100%; max-width: 500px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-lg { max-width: 600px; }
.modal-header { padding: 20px 24px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 24px; overflow-y: auto; }
.modal-footer { padding: 16px 24px; background: #faf8f6; display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.selected-summary { margin-right: auto; font-size: 13px; color: #9a8070; }

.bulk-form-grid { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.program-selector { display: flex; gap: 10px; }
.prog-chip { flex: 1; padding: 12px; border: 1.5px solid #f0e8e0; border-radius: 12px; background: #fff; font-weight: 700; color: #9a8070; cursor: pointer; transition: all 0.2s; }
.prog-chip.active { border-color: #FF6B1A; background: #fffaf8; color: #FF6B1A; box-shadow: 0 4px 12px rgba(255,107,26,0.1); }

.course-search-wrap { margin-bottom: 10px; }
.course-search-input { width: 100%; padding: 10px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; }
.course-selection-list { border: 1.5px solid #f0e8e0; border-radius: 12px; max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; }
.course-checkbox-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #faf8f6; cursor: pointer; transition: all 0.2s; }
.course-checkbox-item:hover { background: #faf8f6; }
.course-checkbox-item:last-child { border-bottom: none; }
.course-checkbox-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #FF6B1A; }
.course-info-sm { display: flex; flex-direction: column; gap: 2px; }
.c-code { font-size: 11px; font-weight: 700; color: #FF6B1A; }
.c-name { font-size: 13px; color: #1a0a00; font-weight: 600; }
.c-meta { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.type-badge { font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; }
.type-badge.lec { background: #e0f2fe; color: #0369a1; }
.type-badge.lab { background: #fef3c7; color: #92400e; }
.type-badge.lec\+lab { background: #f0fdf4; color: #166534; }
.unit-info { font-size: 10px; color: #9a8070; font-weight: 500; }

.empty-state { padding: 80px; text-align: center; color: #b89f90; }
.loading-state { padding: 60px; text-align: center; color: #b89f90; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
