<template>
  <div class="courses-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Course Management</h2>
        <p class="page-sub">Add, edit, and manage all available courses in the department.</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openAddModal">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add New Course
        </button>
      </div>
    </div>

    <div class="filter-bar pcard">
      <div class="filter-main">
        <div class="search-group">
          <label>Search Course</label>
          <div class="search-wrapper">
            <svg viewBox="0 0 18 18" fill="none" class="search-icon"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <input v-model="search" type="text" placeholder="Search by code or name..." class="search-input" />
          </div>
        </div>
        <div class="filter-group">
          <label>Program</label>
          <div class="select-wrapper">
            <svg class="select-icon" viewBox="0 0 20 20" fill="none"><path d="M4 6h12v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM10 2v4M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <select v-model="filterProgram">
              <option value="">All Programs</option>
              <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="courses-list pcard">
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        Loading courses...
      </div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th width="120">Code</th>
              <th>Course Name</th>
              <th width="100">Program</th>
              <th width="100">Type</th>
              <th width="150">Year/Sem</th>
              <th width="150">Units</th>
              <th width="100" class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredCourses" :key="c.id">
              <td><span class="code-badge">{{ c.course_code }}</span></td>
              <td><div class="course-name-cell"><strong>{{ c.course_name }}</strong></div></td>
              <td><span class="program-badge-table" :class="'prog-' + c.program?.program_code?.toLowerCase()">{{ c.program?.program_code || 'N/A' }}</span></td>
              <td><span class="type-badge" :class="c.type">{{ c.type?.toUpperCase() }}</span></td>
              <td><span class="year-sem-text">{{ c.year_level }}{{ getYearSuffix(c.year_level) }} Year · {{ c.semester }}</span></td>
              <td>
                <div class="units-breakdown">
                  <span class="total-units-badge">{{ c.units }} Units</span>
                  <div class="units-detail" v-if="c.lec_units || c.lab_units">
                    <span v-if="c.lec_units">{{ c.lec_units }}L</span>
                    <span v-if="c.lab_units">{{ c.lab_units }}B</span>
                  </div>
                </div>
              </td>
              <td class="actions-cell">
                <button class="edit-btn" @click="openEditModal(c)" title="Edit">
                  <svg viewBox="0 0 20 20" fill="none"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="delete-btn" @click="deleteCourse(c.id)" title="Delete">
                  <svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M7 6V4a2 2 0 012-2h2a2 2 0 012 2v2m-7 0v10a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredCourses.length === 0">
              <td colspan="7" class="empty-row">No courses found matching your criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD/EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-student-meta">
            <div class="s-avatar lg" :style="{ background: editingCourse ? '#3b82f6' : '#FF6B1A' }">
              <svg v-if="!editingCourse" viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M12 6.00012L12 18.0001M18 12.0001L6 12.0001" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <h3>{{ editingCourse ? 'Edit Course Details' : 'Register New Course' }}</h3>
              <p class="modal-sub">{{ editingCourse ? 'Update information for an existing course.' : 'Create a new course entry in the system.' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Core Information</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="detail-key">Course Code <span class="req">*</span></label>
                <input v-model="form.course_code" type="text" placeholder="e.g. IT101" class="form-control-modern" />
              </div>
              <div class="form-group">
                <label class="detail-key">Course Name <span class="req">*</span></label>
                <input v-model="form.course_name" type="text" placeholder="e.g. Intro to Computing" class="form-control-modern" />
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Units & Credits</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="detail-key">Total Units <span class="req">*</span></label>
                <input v-model="form.units" type="number" class="form-control-modern" />
              </div>
              <div class="form-group">
                <label class="detail-key">Type <span class="req">*</span></label>
                <select v-model="form.type" class="form-control-modern">
                  <option value="lec">Lecture Only</option>
                  <option value="lab">Laboratory Only</option>
                  <option value="lec+lab">Lecture + Laboratory</option>
                </select>
              </div>
              <div class="form-group">
                <label class="detail-key">Lecture Units</label>
                <input v-model="form.lec_units" type="number" class="form-control-modern" />
              </div>
              <div class="form-group">
                <label class="detail-key">Laboratory Units</label>
                <input v-model="form.lab_units" type="number" class="form-control-modern" />
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Academic Dependencies</h4>
            <div class="form-group">
              <label class="detail-key">Prerequisites</label>
              <div class="prereq-selector-modern">
                <div class="prereq-search">
                  <svg class="search-icon-sm" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M14 14l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                  <input v-model="prereqSearch" type="text" placeholder="Search courses to add as prerequisite..." class="prereq-filter-input" />
                </div>
                <div class="prereq-list-modern">
                  <label v-for="c in filteredCourses" :key="c.id" class="prereq-item-modern" :class="{ selected: form.prerequisite_ids.includes(c.id) }">
                    <input type="checkbox" :value="c.id" v-model="form.prerequisite_ids" class="hidden-check" />
                    <span class="p-check-box"></span>
                    <span class="p-code">{{ c.course_code }}</span>
                    <span class="p-name">{{ c.course_name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="showModal = false">Cancel</button>
          <button class="primary-btn" @click="saveCourse" :disabled="saving">
            {{ saving ? 'Saving Changes...' : (editingCourse ? 'Update Course' : 'Create Course') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const courses = ref([])
const programs = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingCourse = ref(null)
const search = ref('')
const filterProgram = ref('')

const form = ref({
  course_code: '',
  course_name: '',
  program_id: '',
  year_level: '1',
  semester: '1st',
  type: 'lec',
  lec_units: 3,
  lab_units: 0,
  units: 3,
  prerequisites: ''
})

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    const matchesSearch = c.course_code.toLowerCase().includes(search.value.toLowerCase()) || 
                          c.course_name.toLowerCase().includes(search.value.toLowerCase())
    const matchesProgram = !filterProgram.value || c.program_id == filterProgram.value
    return matchesSearch && matchesProgram
  })
})

const getYearSuffix = (y) => y == 1 ? 'st' : y == 2 ? 'nd' : y == 3 ? 'rd' : 'th'

const updateUnits = () => {
  if (form.value.type === 'lec') {
    form.value.lec_units = 3
    form.value.lab_units = 0
  } else if (form.value.type === 'lab') {
    form.value.lec_units = 0
    form.value.lab_units = 3
  } else {
    form.value.lec_units = 2
    form.value.lab_units = 1
  }
  syncTotalUnits()
}

const syncTotalUnits = () => {
  form.value.units = (form.value.lec_units || 0) + (form.value.lab_units || 0)
}

const fetchCourses = async () => {
  loading.value = true
  try {
    const res = await axios.get('/courses')
    courses.value = res.data
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  } finally {
    loading.value = false
  }
}

const fetchPrograms = async () => {
  try {
    const res = await axios.get('/programs')
    programs.value = res.data
  } catch (err) {
    console.error('Failed to fetch programs:', err)
  }
}

const openAddModal = () => {
  editingCourse.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (course) => {
  editingCourse.value = course
  form.value = {
    course_code: course.course_code,
    course_name: course.course_name,
    program_id: course.program_id,
    year_level: course.year_level,
    semester: course.semester,
    type: course.type,
    lec_units: course.lec_units,
    lab_units: course.lab_units,
    units: course.units,
    prerequisites: course.prerequisites || ''
  }
  showModal.value = true
}

const saveCourse = async () => {
  saving.value = true
  try {
    if (editingCourse.value) {
      await axios.put(`/courses/${editingCourse.value.id}`, form.value)
      alert('Course updated successfully.')
    } else {
      await axios.post('/courses', form.value)
      alert('Course added successfully.')
    }
    showModal.value = false
    fetchCourses()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save course.')
  } finally {
    saving.value = false
  }
}

const deleteCourse = async (id) => {
  if (!confirm('Are you sure you want to delete this course?')) return
  try {
    await axios.delete(`/courses/${id}`)
    fetchCourses()
  } catch (err) {
    alert('Failed to delete course.')
  }
}

const resetForm = () => {
  form.value = {
    course_code: '',
    course_name: '',
    program_id: '',
    year_level: '1',
    semester: '1st',
    type: 'lec',
    units: 3,
    prerequisites: ''
  }
}

onMounted(() => {
  fetchCourses()
  fetchPrograms()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.courses-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.filter-bar { padding: 20px 24px; background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; }
.filter-main { display: flex; gap: 24px; width: 100%; align-items: flex-end; }
.filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; max-width: 250px; }
.search-group { flex: 2; display: flex; flex-direction: column; gap: 6px; }
.filter-group label, .search-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }

.search-wrapper, .select-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
.search-icon, .select-icon { position: absolute; left: 14px; width: 16px; height: 16px; color: #FF6B1A; pointer-events: none; }
.search-input, .filter-group select { width: 100%; padding: 10px 12px 10px 42px; border: 1.5px solid #f0e8e0; border-radius: 12px; font-size: 14px; font-weight: 500; outline: none; background: #fff; transition: all 0.2s; color: #1a0a00; }
.filter-group select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239a8070' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 18px; }
.search-input:hover, .filter-group select:hover { border-color: #FF6B1A; background-color: #fffaf8; }
.search-input:focus, .filter-group select:focus { border-color: #FF6B1A; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

.courses-list { margin-top: 24px; }
.table-container { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 900px; }
.data-table th { text-align: left; padding: 16px 22px; background: #fffaf8; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #f0e8e0; letter-spacing: 0.5px; }
.data-table td { padding: 16px 22px; border-bottom: 1px solid #faf8f6; color: #1a0a00; vertical-align: middle; }
.data-table tr:hover td { background: #faf8f6; }

.code-badge { background: #fff1e6; color: #ff6b1a; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 11px; border: 1px solid #fef0e8; }
.course-name-cell { max-width: 300px; line-height: 1.4; }
.program-badge-table { font-weight: 700; color: #1a0a00; background: #f0e8e0; padding: 2px 8px; border-radius: 6px; font-size: 11px; }
.program-badge-table.prog-bsit { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
.program-badge-table.prog-bscs { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
.type-badge { padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 10px; letter-spacing: 0.3px; }
.type-badge.lec { background: #e0f2fe; color: #0369a1; }
.type-badge.lab { background: #fef3c7; color: #92400e; }
.type-badge.lec\+lab { background: #f0fdf4; color: #166534; }

.year-sem-text { color: #9a8070; font-weight: 600; font-size: 12px; }
.units-breakdown { display: flex; flex-direction: column; gap: 2px; }
.total-units-badge { font-weight: 700; color: #1a0a00; }
.units-detail { font-size: 10px; color: #b89f90; font-weight: 600; display: flex; gap: 4px; }

.text-right { text-align: right; }
.actions-cell { display: flex; gap: 8px; justify-content: flex-end; }
.edit-btn, .delete-btn { background: #fff; border: 1.5px solid #f0e8e0; padding: 8px; border-radius: 10px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.edit-btn { color: #3b82f6; }
.edit-btn:hover { background: #eff6ff; border-color: #3b82f6; transform: translateY(-1px); }
.delete-btn { color: #ef4444; }
.delete-btn:hover { background: #fee2e2; border-color: #ef4444; transform: translateY(-1px); }
.edit-btn svg, .delete-btn svg { width: 16px; height: 16px; }

.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 12px 24px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(255,107,26,0.2); white-space: nowrap; }
.primary-btn:hover { background: #e85500; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(255,107,26,0.3); }

/* ── MODAL ENHANCEMENTS ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 28px; width: 100%; max-width: 550px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.2); display: flex; flex-direction: column; max-height: 92vh; border: 1px solid rgba(255,255,255,0.1); }
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

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.detail-key { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-control-modern { width: 100%; padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #fff; color: #1a0a00; transition: all 0.2s; }
.form-control-modern:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.req { color: #ef4444; }

/* Prerequisites Selector */
.prereq-selector-modern { border: 2px solid #f0e8e0; border-radius: 20px; overflow: hidden; background: #fff; }
.prereq-search { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0e8e0; background: #fff; }
.search-icon-sm { width: 16px; height: 16px; color: #9a8070; margin-right: 10px; }
.prereq-filter-input { flex: 1; background: none; border: none; outline: none; font-size: 13px; font-weight: 500; color: #1a0a00; }
.prereq-list-modern { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; padding: 8px; gap: 4px; }
.prereq-item-modern { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
.prereq-item-modern:hover { background: #fafafa; }
.prereq-item-modern.selected { background: #fff; border-color: #f0e8e0; }
.hidden-check { position: absolute; opacity: 0; }
.p-check-box { width: 18px; height: 18px; border: 2px solid #dcd0c8; border-radius: 5px; position: relative; transition: all 0.2s; background: #fff; }
.prereq-item-modern.selected .p-check-box { background: #FF6B1A; border-color: #FF6B1A; }
.prereq-item-modern.selected .p-check-box:after { content: ''; position: absolute; left: 5px; top: 1px; width: 4px; height: 8px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.p-code { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; color: #FF6B1A; background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid #f0e8e0; }
.p-name { font-size: 13px; font-weight: 700; color: #1a0a00; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #fff; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.loading-state { padding: 80px; text-align: center; color: #b89f90; }
.spinner { width: 28px; height: 28px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
.empty-row { padding: 60px; text-align: center; color: #b89f90; font-weight: 500; font-style: italic; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
