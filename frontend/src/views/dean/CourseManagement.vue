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
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none" class="search-icon"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by code or name..." />
      </div>
      <div class="filter-group">
        <select v-model="filterProgram" @change="fetchCourses">
          <option value="">All Programs</option>
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
        </select>
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
              <th>Code</th>
              <th>Course Name</th>
              <th>Program</th>
              <th>Type</th>
              <th>Year/Sem</th>
              <th>Units</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredCourses" :key="c.id">
              <td><span class="code-badge">{{ c.course_code }}</span></td>
              <td><strong>{{ c.course_name }}</strong></td>
              <td>{{ c.program?.program_code || 'N/A' }}</td>
              <td><span class="type-badge" :class="c.type">{{ c.type?.toUpperCase() }}</span></td>
              <td>{{ c.year_level }}{{ getYearSuffix(c.year_level) }} / {{ c.semester }}</td>
              <td>{{ c.units }}</td>
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
              <td colspan="6" class="empty-row">No courses found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD/EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingCourse ? 'Edit Course' : 'Add New Course' }}</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Course Code</label>
              <input v-model="form.course_code" type="text" placeholder="e.g. IT101" />
            </div>
            <div class="form-group">
              <label>Course Name</label>
              <input v-model="form.course_name" type="text" placeholder="e.g. Introduction to Computing" />
            </div>
            <div class="form-group">
              <label>Program</label>
              <select v-model="form.program_id">
                <option value="">Select Program</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }} - {{ p.program_name }}</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Year Level</label>
                <select v-model="form.year_level">
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div class="form-group">
                <label>Semester</label>
                <select v-model="form.semester">
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Course Type</label>
                <select v-model="form.type">
                  <option value="lec">Lecture (Lec)</option>
                  <option value="lab">Laboratory (Lab)</option>
                  <option value="lec+lab">Lec + Lab</option>
                </select>
              </div>
              <div class="form-group">
                <label>Units</label>
                <input v-model.number="form.units" type="number" placeholder="3" />
              </div>
            </div>
            <div class="form-group">
              <label>Prerequisites (Optional)</label>
              <input v-model="form.prerequisites" type="text" placeholder="e.g. IT101, IT102" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showModal = false">Cancel</button>
          <button class="primary-btn" @click="saveCourse" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Course' }}
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
    const res = await axios.get('/sections')
    const progMap = new Map()
    res.data.forEach(s => {
      if (s.program && !progMap.has(s.program.id)) {
        progMap.set(s.program.id, s.program)
      }
    })
    programs.value = Array.from(progMap.values())
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
.courses-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.filter-bar { padding: 16px 22px; display: flex; gap: 20px; align-items: center; }
.search-wrap { flex: 1; position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #c0b0a5; }
.search-wrap input { width: 100%; padding: 10px 14px 10px 40px; border: 1.5px solid #f0e8e0; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; }
.search-wrap input:focus { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.05); }

.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; }
.filter-group select { padding: 8px 12px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; background: #fff; cursor: pointer; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 14px 22px; background: #fffaf8; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #f0e8e0; }
.data-table td { padding: 14px 22px; border-bottom: 1px solid #faf8f6; color: #1a0a00; }
.code-badge { background: #fff1e6; color: #ff6b1a; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; }

.actions-cell { display: flex; gap: 8px; justify-content: flex-end; }
.edit-btn, .delete-btn { background: none; border: none; padding: 6px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.edit-btn { color: #3b82f6; }
.edit-btn:hover { background: #eff6ff; }
.delete-btn { color: #ef4444; }
.delete-btn:hover { background: #fee2e2; }
.edit-btn svg, .delete-btn svg { width: 18px; height: 18px; }

.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }

.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 24px; width: 100%; max-width: 500px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
.modal-header { padding: 20px 24px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 24px; }
.modal-footer { padding: 16px 24px; background: #faf8f6; display: flex; justify-content: flex-end; gap: 12px; }

.form-grid { display: grid; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 600; color: #1a0a00; }
.form-group input, .form-group select { padding: 10px 14px; border: 1.5px solid #f0e8e0; border-radius: 12px; outline: none; font-size: 13px; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; }

.loading-state { padding: 60px; text-align: center; color: #b89f90; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
