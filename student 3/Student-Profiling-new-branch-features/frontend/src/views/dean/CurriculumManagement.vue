<template>
  <div class="curriculum-page">
  
  <Transition name="toast">
      <div v-if="notification.show" class="toast-notification" :class="notification.type">
        <svg v-if="notification.type === 'success'" viewBox="0 0 20 20" fill="none" class="toast-icon"><path d="M5 10l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else viewBox="0 0 20 20" fill="none" class="toast-icon"><path d="M10 5v6m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>{{ notification.message }}</span>
      </div>
    </Transition>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Remove Course</h3>
          <button class="close-btn" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body text-center">
          <p>Are you sure you want to remove this course from the curriculum?</p>
          <p class="modal-sub" style="margin-top: 8px;">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="primary-btn danger-btn" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Removing...' : 'Yes, Remove' }}
          </button>
        </div>
      </div>
    </div>

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
      <div class="filter-main">
        <div class="filter-group search-group">
          <label>Search Curriculum</label>
          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M14 14l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <input 
              v-model="curriculumSearch" 
              type="text" 
              placeholder="Search by code or name..." 
              class="search-input"
            />
          </div>
        </div>

        <div class="filter-group">
          <label>Program</label>
          <div class="select-wrapper">
            <svg class="select-icon" viewBox="0 0 20 20" fill="none"><path d="M4 6h12v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM10 2v4M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <select v-model="filterProgram" @change="fetchCurriculum">
              <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
            </select>
          </div>
        </div>

        <div class="filter-group">
          <label>Year Level</label>
          <div class="select-wrapper">
            <svg class="select-icon" viewBox="0 0 20 20" fill="none"><path d="M8 2v16M12 2v16M4 6h12M4 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <select v-model="filterYear">
              <option value="all">All Year Levels</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="curriculum-container">
      <div v-if="filterProgram" class="program-header-info">
        <div class="program-info-left">
          <div class="program-breadcrumb">Academic Program Curriculum</div>
          <h2 class="program-full-title">
            {{ programs.find(p => p.id === filterProgram)?.program_name || 'Curriculum' }} 
            <span class="program-code-tag">{{ programs.find(p => p.id === filterProgram)?.program_code }}</span>
          </h2>
        </div>
        
        <div class="program-stats-row" v-if="curriculum.length > 0">
          <div class="stat-pill">
            <span class="pill-label">Total Courses</span>
            <span class="pill-value">{{ curriculum.length }}</span>
          </div>
          <div class="stat-pill">
            <span class="pill-label">Academic Years</span>
            <span class="pill-value">{{ new Set(curriculum.map(c => c.year_level)).size }}</span>
          </div>
        </div>
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
        
        <div class="semester-list">
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
                      <th class="code-cell">Code</th>
                      <th class="name-cell">Course Name</th>
                      <th class="units-cell text-center">Lec Units</th>
                      <th class="units-cell text-center">Lab Units</th>
                      <th class="units-cell text-center">Total Units</th>
                      <th class="prereq-cell">Prerequisites</th>
                      <th class="action-cell"></th>
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
          <div class="modal-student-meta">
            <div class="s-avatar lg" style="background: #FF6B1A;">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M12 6.00012L12 18.0001M18 12.0001L6 12.0001" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <div>
              <h3>Add Curriculum Entries</h3>
              <p class="modal-sub">Assign multiple courses to a program, year level, and semester.</p>
            </div>
          </div>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">1. Target Program</h4>
            <div class="program-selector-grid">
              <button 
                v-for="p in programs" 
                :key="p.id" 
                class="prog-chip-modern" 
                :class="{ active: form.program_id === p.id }"
                @click="form.program_id = p.id"
              >
                <span class="p-code">{{ p.program_code }}</span>
                <span class="p-name">{{ p.program_name }}</span>
              </button>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">2. Academic Period</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="detail-key">Year Level</label>
                <div class="custom-select-wrap">
                  <select v-model="form.year_level" class="form-control-modern">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="detail-key">Semester</label>
                <div class="custom-select-wrap">
                  <select v-model="form.semester" class="form-control-modern">
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">3. Select Courses</h4>
            <div class="course-selection-container">
              <div class="course-search-bar">
                <svg class="search-icon-sm" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M14 14l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                <input v-model="courseSearch" type="text" placeholder="Filter by code or name..." class="course-filter-input" />
              </div>
              <div class="course-selection-list-modern">
                <label v-for="c in filteredCourses" :key="c.id" class="course-item-modern" :class="{ selected: form.course_ids.includes(c.id) }">
                  <div class="checkbox-wrapper">
                    <input type="checkbox" :value="c.id" v-model="form.course_ids" />
                    <span class="custom-checkbox"></span>
                  </div>
                  <div class="course-details">
                    <div class="c-top">
                      <span class="c-code-badge">{{ c.course_code }}</span>
                      <span class="c-name-text">{{ c.course_name }}</span>
                    </div>
                    <div class="c-bottom">
                      <span class="type-tag" :class="c.type">{{ c.type?.toUpperCase() }}</span>
                      <span class="units-label">
                        {{ c.units }} {{ c.units === 1 ? 'Unit' : 'Units' }}
                        <template v-if="c.lec_units || c.lab_units">
                          · ({{ c.lec_units || 0 }}L + {{ c.lab_units || 0 }}B)
                        </template>
                      </span>
                    </div>
                  </div>
                </label>
                <div v-if="filteredCourses.length === 0" class="empty-results">
                  No courses found matching "{{ courseSearch }}"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="selection-indicator">
            <div class="indicator-dot" :class="{ active: form.course_ids.length > 0 }"></div>
            <span><strong>{{ form.course_ids.length }}</strong> courses selected</span>
          </div>
          <div class="footer-btns">
            <button class="ghost-btn" @click="showAddModal = false">Cancel</button>
            <button class="primary-btn" @click="saveBulkEntry" :disabled="saving || form.course_ids.length === 0">
              {{ saving ? 'Processing...' : 'Add to Curriculum' }}
            </button>
          </div>
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
const filterYear = ref('all')
const curriculumSearch = ref('')
const fileInput = ref(null)
const courseSearch = ref('')

const showDeleteModal = ref(false)
const deleting = ref(false)
const itemToDelete = ref(null)

const notification = ref({ show: false, message: '', type: 'success' })
const showNotify = (msg, type = 'success') => {
  notification.value = { show: true, message: msg, type }
  setTimeout(() => { notification.value.show = false }, 3500)
}

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
  
  let filtered = curriculum.value
  
  // Year Filter
  if (filterYear.value !== 'all') {
    filtered = filtered.filter(item => item.year_level == filterYear.value)
  }

  // Search Filter
  if (curriculumSearch.value.trim()) {
    const s = curriculumSearch.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.course.course_code.toLowerCase().includes(s) || 
      item.course.course_name.toLowerCase().includes(s)
    )
  }

  const years = {}
  filtered.forEach(item => {
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
    showNotify('Please select a program and at least one course.', 'error')
    return
  }
  saving.value = true
  try {
    const res = await axios.post('/dean/curriculum/bulk', form.value)
    showNotify(res.data.message, 'success')
    showAddModal.value = false
    fetchCurriculum()
  } catch (err) {
    showNotify(err.response?.data?.message || 'Failed to save entries.', 'error')
  } finally {
    saving.value = false
  }
}

const deleteEntry = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await axios.delete(`/dean/curriculum/${itemToDelete.value}`)
    showNotify('Course removed from curriculum.', 'success')
    fetchCurriculum()
  } catch (err) {
    showNotify('Failed to delete entry.', 'error')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  importing.value = true
   try {
     const res = await axios.post('/dean/curriculum/import', formData, {
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        })
      showNotify(res.data.message, 'success')
      fetchCurriculum()
    } catch (err) {
      if (err.response?.status === 403) {
        showNotify(`Forbidden: Requires ${err.response.data.required_roles.join(', ')}`, 'error')
      } else {
        showNotify(err.response?.data?.message || 'Import failed.', 'error')
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.curriculum-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.filter-bar { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; }
.filter-main { display: flex; gap: 24px; width: 100%; align-items: flex-end; }
.filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.search-group { flex: 2; }
.filter-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.select-wrapper, .search-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
.select-icon, .search-icon { position: absolute; left: 12px; width: 16px; height: 16px; color: #FF6B1A; pointer-events: none; }
.filter-group select, .search-input { width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #f0e8e0; border-radius: 12px; font-size: 14px; font-weight: 500; outline: none; background: #fff; cursor: pointer; transition: all 0.2s; color: #1a0a00; }
.search-input { cursor: text; }
.filter-group select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239a8070' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 18px; }
.filter-group select:hover, .search-input:hover { border-color: #FF6B1A; background-color: #fffaf8; }
.filter-group select:focus, .search-input:focus { border-color: #FF6B1A; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

.program-header-info { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 20px; border-bottom: 2px solid #f0e8e0; width: 100%; gap: 24px; }
.program-info-left { display: flex; flex-direction: column; gap: 4px; }
.program-breadcrumb { font-size: 11px; font-weight: 700; color: #b89f90; text-transform: uppercase; letter-spacing: 0.8px; }
.program-full-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a0a00; letter-spacing: -0.8px; display: flex; align-items: center; gap: 12px; }
.program-code-tag { font-size: 14px; font-weight: 700; color: #FF6B1A; background: #fffaf8; padding: 4px 12px; border-radius: 8px; border: 1.5px solid #fef0e8; }

.program-stats-row { display: flex; gap: 16px; }
.stat-pill { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.pill-label { font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.3px; }
.pill-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; color: #FF6B1A; line-height: 1; }

.curriculum-container { display: flex; flex-direction: column; gap: 24px; }
.year-section { display: flex; flex-direction: column; gap: 20px; }
.year-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #f0e8e0; }
.year-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 700; color: #1a0a00; display: flex; align-items: center; gap: 10px; }
.year-title::before { content: ''; display: block; width: 4px; height: 20px; background: #FF6B1A; border-radius: 2px; }
.program-badge { font-size: 12px; font-weight: 800; color: #FF6B1A; background: #fffaf8; padding: 4px 12px; border-radius: 20px; border: 1px solid #fef0e8; }

.semester-list { display: flex; flex-direction: column; gap: 24px; }
.semester-card { width: 100%; display: flex; flex-direction: column; }
.sem-header { padding: 16px 24px; background: #fffaf8; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.sem-header h4 { font-size: 14px; font-weight: 700; color: #1a0a00; }
.course-count { font-size: 11px; font-weight: 600; color: #9a8070; background: #f0e8e0; padding: 2px 8px; border-radius: 10px; }
.sem-body { padding: 0; }

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.sem-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 800px; table-layout: fixed; }
.sem-table th { text-align: left; padding: 14px 20px; font-size: 11px; color: #9a8070; text-transform: uppercase; border-bottom: 1px solid #faf8f6; white-space: nowrap; letter-spacing: 0.5px; }
.sem-table td { padding: 16px 20px; border-bottom: 1px solid #faf8f6; vertical-align: middle; }
.code-cell { font-weight: 700; color: #FF6B1A; width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.name-cell { width: auto; font-weight: 600; color: #1a0a00; line-height: 1.4; white-space: normal; }
.units-cell { font-weight: 600; color: #1a0a00; width: 100px; white-space: nowrap; }
.prereq-cell { color: #9a8070; font-size: 12px; width: 150px; white-space: normal; word-break: break-word; line-height: 1.5; }
.text-center { text-align: center; }
.action-cell { text-align: right; width: 60px; }

.delete-btn-sm { background: none; border: none; color: #c0b0a5; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
.delete-btn-sm:hover { color: #ef4444; background: #fee2e2; }
.delete-btn-sm svg { width: 16px; height: 16px; }

.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.primary-btn:disabled { background: #f0e8e0; cursor: not-allowed; }
.outline-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-icon { width: 16px; height: 16px; }

/* ── MODAL ENHANCEMENTS ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 28px; width: 100%; max-width: 500px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.2); display: flex; flex-direction: column; max-height: 92vh; border: 1px solid rgba(255,255,255,0.1); }
.modal-lg { max-width: 650px; }
.modal-header { padding: 20px 24px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; background: #fff; gap: 12px; }
.modal-student-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-student-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-avatar.lg { width: 50px; height: 50px; border-radius: 14px; font-size: 20px; }

.close-btn { background: #faf8f6; border: none; font-size: 24px; color: #9a8070; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transition: all 0.2s; }
.close-btn:hover { background: #f0e8e0; color: #1a0a00; }

.modal-body { padding: 24px; overflow-y: auto; background: #fff; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

/* Program Selector Grid */
.program-selector-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.prog-chip-modern { display: flex; flex-direction: column; align-items: flex-start; padding: 14px 18px; border: 2px solid #f0e8e0; border-radius: 16px; background: #fff; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-align: left; }
.prog-chip-modern .p-code { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 800; color: #1a0a00; }
.prog-chip-modern .p-name { font-size: 11px; color: #9a8070; margin-top: 2px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
.prog-chip-modern:hover { border-color: #FF6B1A; background: #fffaf8; transform: translateY(-2px); }
.prog-chip-modern.active { border-color: #FF6B1A; background: #FF6B1A; box-shadow: 0 8px 20px rgba(255,107,26,0.25); }
.prog-chip-modern.active .p-code, .prog-chip-modern.active .p-name { color: #fff; }

/* Modern Selects */
.custom-select-wrap { position: relative; }
.form-control-modern { width: 100%; padding: 12px 16px; border: 2px solid #f0e8e0; border-radius: 14px; font-size: 14px; font-weight: 600; color: #1a0a00; outline: none; transition: all 0.2s; appearance: none; background: #fff; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239a8070' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 18px; }
.form-control-modern:focus { border-color: #FF6B1A; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

/* Course Selection List */
.course-selection-container { border: 2px solid #f0e8e0; border-radius: 20px; overflow: hidden; background: #fff; }
.course-search-bar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0e8e0; background: #fff; }
.search-icon-sm { width: 16px; height: 16px; color: #9a8070; margin-right: 10px; }
.course-filter-input { flex: 1; background: none; border: none; outline: none; font-size: 13px; font-weight: 500; color: #1a0a00; }

.course-selection-list-modern { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; padding: 8px; gap: 4px; }
.course-item-modern { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 14px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
.course-item-modern:hover { background: #fafafa; }
.course-item-modern.selected { background: #fff; border-color: #f0e8e0; }

.checkbox-wrapper { position: relative; width: 22px; height: 22px; flex-shrink: 0; }
.checkbox-wrapper input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.custom-checkbox { position: absolute; top: 0; left: 0; height: 22px; width: 22px; background-color: #fff; border: 2px solid #dcd0c8; border-radius: 6px; transition: all 0.2s; }
.course-item-modern:hover .custom-checkbox { border-color: #FF6B1A; }
.checkbox-wrapper input:checked ~ .custom-checkbox { background-color: #FF6B1A; border-color: #FF6B1A; }
.custom-checkbox:after { content: ""; position: absolute; display: none; left: 7px; top: 3px; width: 5px; height: 10px; border: solid white; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); }
.checkbox-wrapper input:checked ~ .custom-checkbox:after { display: block; }

.course-details { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.c-top { display: flex; align-items: center; gap: 10px; }
.c-code-badge { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; color: #FF6B1A; background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid #f0e8e0; }
.c-name-text { font-size: 14px; font-weight: 700; color: #1a0a00; }
.c-bottom { display: flex; align-items: center; gap: 12px; margin-top: 2px; }
.type-tag { font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.5px; }
.type-tag.lec { background: #e0f2fe; color: #0369a1; }
.type-tag.lab { background: #fef3c7; color: #92400e; }
.type-tag.lec\+lab { background: #f0fdf4; color: #166534; }
.units-label { font-size: 11px; color: #9a8070; font-weight: 600; }

.empty-results { padding: 40px 20px; text-align: center; color: #9a8070; font-size: 13px; font-weight: 500; font-style: italic; }

/* Modal Footer */
.modal-footer { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #fff; }
.selection-indicator { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #1a0a00; }
.indicator-dot { width: 8px; height: 8px; background: #dcd0c8; border-radius: 50%; transition: all 0.3s; }
.indicator-dot.active { background: #FF6B1A; box-shadow: 0 0 8px rgba(255,107,26,0.6); transform: scale(1.2); }
.footer-btns { display: flex; gap: 12px; }

.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }

.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }


.empty-state { padding: 80px; text-align: center; color: #b89f90; }
.loading-state { padding: 60px; text-align: center; color: #b89f90; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast Notification */
.toast-notification { position: fixed; top: 24px; right: 24px; z-index: 9999; display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.toast-notification.success { background: #16a34a; }
.toast-notification.error { background: #ef4444; }
.toast-icon { width: 18px; height: 18px; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(40px); }

/* Custom Modal Sizes & Danger Button */
.modal-sm { max-width: 420px; }
.text-center { text-align: center; }
.danger-btn { background: #ef4444 !important; box-shadow: 0 4px 12px rgba(239,68,68,0.2) !important; }
.danger-btn:hover:not(:disabled) { background: #dc2626 !important; }
</style>
