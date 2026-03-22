<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Student Accounts</h2>
        <p class="page-sub">Create and manage initial student accounts for the department.</p>
      </div>
      <div class="header-actions">
        <button class="ghost-btn" @click="showImport = !showImport">
          <svg viewBox="0 0 18 18" fill="none"><path d="M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1M9 2v9M6 8l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Import CSV
        </button>
        <button class="primary-btn" @click="openCreateModal">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Create Account
        </button>
      </div>
    </div>

    <!-- Import CSV Panel -->
    <div v-if="showImport" class="import-panel">
      <div class="import-panel-header">
        <div>
          <h3>Import Students via CSV</h3>
          <p>Upload a CSV file with student data to create multiple accounts at once.</p>
        </div>
        <button class="close-btn" @click="showImport = false">×</button>
      </div>
      <div class="import-body">
        <div class="drop-zone" :class="{ disabled: loadingImport }" @click="!loadingImport && $refs.csvInput.click()">
          <div v-if="loadingImport" class="spinner-lg"></div>
          <template v-else>
            <svg viewBox="0 0 48 48" fill="none"><path d="M24 8v24M14 18l10-10 10 10M8 36h32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p class="drop-title">Click to upload or drag and drop</p>
            <p class="drop-sub">CSV files only · Max 5MB</p>
          </template>
          <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="handleCSV" />
        </div>
        <div class="import-template">
          <svg viewBox="0 0 18 18" fill="none"><path d="M4 2h7l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4"/><path d="M11 2v4h4" stroke="currentColor" stroke-width="1.4"/></svg>
          <span>Required columns: <strong>first_name, last_name, email, student_number, course, year_level</strong></span>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="mini-stats">
      <div class="mini-stat" v-for="s in miniStats" :key="s.label">
        <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="mini-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by name, email, or student number..." />
      </div>
      <div class="filter-group">
        <select v-model="filterCourse">
          <option value="">All Courses</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSIS">BSIS</option>
        </select>
        <select v-model="filterStatus">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>STUDENT NO.</th>
            <th>COURSE</th>
            <th>YEAR</th>
            <th>EMAIL</th>
            <th>STATUS</th>
            <th>CREATED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>
              <div class="student-cell">
                <div class="s-avatar" :style="{ background: student.color }">{{ student.first_name.charAt(0) }}</div>
                <div>
                  <p class="s-name">{{ student.first_name }} {{ student.last_name }}</p>
                  <p class="s-sub">{{ student.section || 'Unassigned' }}</p>
                </div>
              </div>
            </td>
            <td><span class="code-badge">{{ student.student_number }}</span></td>
            <td>{{ student.course }}</td>
            <td>{{ student.year_level }}{{ getYearSuffix(student.year_level) }} Year</td>
            <td class="email-cell">{{ student.email }}</td>
            <td>
              <span class="status-badge" :class="student.status === 'active' ? 'st-active' : 'st-pending'">
                {{ student.status === 'active' ? 'Active' : 'Pending Setup' }}
              </span>
            </td>
            <td class="date-cell">{{ student.created_at }}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit" @click="openEditModal(student)" title="Edit">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="action-btn resend" @click="resendSetup(student)" title="Resend setup email">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="action-btn delete" @click="confirmDelete(student)" title="Delete">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="8" class="empty-row">No students found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="!saving && (showModal = false)">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingStudent ? 'Edit Student Account' : 'Create Student Account' }}</h3>
          <button class="close-btn" @click="showModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="form.first_name" type="text" placeholder="First name" :disabled="!!editingStudent || saving" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="form.last_name" type="text" placeholder="Last name" :disabled="!!editingStudent || saving" />
            </div>
            <div class="form-group">
              <label>Student Number</label>
              <input v-model="form.student_number" type="text" placeholder="e.g. 2024-00001" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="form.email" type="email" placeholder="student@school.edu.ph" :disabled="!!editingStudent || saving" />
            </div>
            <div class="form-group">
              <label>Course</label>
              <select v-model="form.course" :disabled="saving">
                <option value="">Select Course</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSIS">BSIS</option>
              </select>
            </div>
            <div class="form-group">
              <label>Year Level</label>
              <select v-model="form.year_level" :disabled="saving">
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div class="modal-notice" v-if="!editingStudent">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            A password setup link will be sent to the student's email after account creation.
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showModal = false" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="saveStudent" :disabled="saving">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Saving...' : editingStudent ? 'Save Changes' : 'Create Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM MODAL -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Delete Student Account</h3>
          <button class="close-btn" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-msg">Are you sure you want to delete the account of <strong>{{ deletingStudent?.first_name }} {{ deletingStudent?.last_name }}</strong>? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="danger-btn" @click="deleteStudent">Delete Account</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'

const search = ref('')
const filterCourse = ref('')
const filterStatus = ref('')
const showImport = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const saving = ref(false)
const editingStudent = ref(null)
const deletingStudent = ref(null)
const csvInput = ref(null)
const loading = ref(false)
const loadingImport = ref(false)

const form = ref({
  first_name: '', last_name: '', student_number: '',
  email: '', course: '', year_level: ''
})

const colors = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

const students = ref([])

const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await axios.get('/students')
    students.value = response.data.map((s, idx) => ({
      id: s.id,
      first_name: s.first_name,
      last_name: s.last_name,
      student_number: s.user?.student_number || 'N/A',
      email: s.user?.email || 'N/A',
      course: s.program?.program_code || 'N/A',
      year_level: s.section?.year_level || 1,
      section: s.section?.section_name || null,
      status: s.user?.status || 'pending',
      created_at: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: colors[idx % colors.length]
    }))
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStudents)

const miniStats = computed(() => [
  { label: 'Total Students', value: students.value.length, color: '#FF6B1A' },
  { label: 'Active', value: students.value.filter(s => s.status === 'active').length, color: '#16a34a' },
  { label: 'Pending Setup', value: students.value.filter(s => s.status === 'pending').length, color: '#f59e0b' },
  { label: 'BSCS', value: students.value.filter(s => s.course === 'BSCS').length, color: '#8b5cf6' },
  { label: 'BSIT', value: students.value.filter(s => s.course === 'BSIT').length, color: '#3b82f6' }
])

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchSearch = !search.value ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
      s.email.toLowerCase().includes(search.value.toLowerCase()) ||
      s.student_number.toLowerCase().includes(search.value.toLowerCase())
    const matchCourse = !filterCourse.value || s.course === filterCourse.value
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    return matchSearch && matchCourse && matchStatus
  })
})

const getYearSuffix = (year) => {
  if (year == 1) return 'st'
  if (year == 2) return 'nd'
  if (year == 3) return 'rd'
  return 'th'
}

const openCreateModal = () => {
  editingStudent.value = null
  form.value = { first_name: '', last_name: '', student_number: '', email: '', course: '', year_level: '' }
  showModal.value = true
}

const openEditModal = (student) => {
  editingStudent.value = student
  form.value = { ...student }
  showModal.value = true
}

const saveStudent = async () => {
  saving.value = true
  try {
    if (editingStudent.value) {
      await axios.put(`/secretary/students/${editingStudent.value.id}`, {
        student_number: form.value.student_number,
        course: form.value.course,
        year_level: form.value.year_level
      })
      showModal.value = false
      await nextTick()
      alert('Student account updated successfully.')
      fetchStudents() // Refresh list
    } else {
      // await axios.post('/secretary/students', form.value)
      showModal.value = false
      await nextTick()
      alert('Creation is currently mock-only for Students.')
      students.value.push({
        id: Date.now(),
        ...form.value,
        status: 'pending',
        section: null,
        created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: colors[students.value.length % colors.length]
      })
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save student.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (student) => {
  deletingStudent.value = student
  showDeleteModal.value = true
}

const deleteStudent = async () => {
  try {
    await axios.delete(`/secretary/students/${deletingStudent.value.id}`)
    students.value = students.value.filter(s => s.id !== deletingStudent.value.id)
    showDeleteModal.value = false
    alert('Student account deleted successfully.')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete student.')
  }
}

const resendSetup = async (student) => {
  try {
    // await axios.post(`/secretary/students/${student.id}/resend-setup`)
    alert(`Setup email resent to ${student.email}`)
  } catch (err) {
    alert('Failed to resend setup email.')
  }
}

const handleCSV = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  loadingImport.value = true
  try {
    const response = await axios.post('/secretary/students/import', formData)
    alert(response.data.message || 'Students imported successfully!')
    fetchStudents() // Refresh list
  } catch (err) {
    console.error('Import failed:', err)
    alert(err.response?.data?.message || 'Failed to import students.')
  } finally {
    loadingImport.value = false
    if (csvInput.value) csvInput.value.value = '' // Clear input
  }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 10px; }

/* Buttons */
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.primary-btn svg { width: 15px; height: 15px; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.ghost-btn svg { width: 15px; height: 15px; }
.danger-btn { background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.danger-btn:hover { background: #dc2626; }

/* Import Panel */
.import-panel { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.import-panel-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #faf8f6; }
.import-panel-header h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.import-panel-header p { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.close-btn:hover { color: #1a0a00; }
.import-body { padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.drop-zone { border: 2px dashed #f0e8e0; border-radius: 14px; padding: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; min-height: 160px; }
.drop-zone:hover:not(.disabled) { border-color: #FF6B1A; background: #fffaf8; }
.drop-zone.disabled { cursor: not-allowed; opacity: 0.7; background: #fafafa; }
.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
.drop-zone svg { width: 40px; height: 40px; color: #c0b0a5; }
.drop-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.drop-sub { font-size: 12px; color: #b89f90; }
.import-template { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a8070; background: #faf8f6; padding: 10px 14px; border-radius: 9px; }
.import-template svg { width: 14px; height: 14px; color: #FF6B1A; flex-shrink: 0; }

/* Mini Stats */
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.mini-stat-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }

/* Toolbar */
.table-toolbar { display: flex; gap: 12px; align-items: center; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; transition: all 0.2s; }
.search-wrap:focus-within { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.search-wrap svg { width: 15px; height: 15px; color: #c0b0a5; flex-shrink: 0; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1a0a00; width: 100%; background: none; }
.search-wrap input::placeholder { color: #c0b0a5; }
.filter-group { display: flex; gap: 8px; }
.filter-group select { padding: 9px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1a0a00; background: #fff; outline: none; cursor: pointer; }
.filter-group select:focus { border-color: #FF6B1A; }

/* Table */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #fdf9f7; }
.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.s-sub { font-size: 11px; color: #b89f90; margin-top: 1px; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.email-cell { font-size: 12px; color: #6b7280; }
.date-cell { font-size: 12px; color: #9a8070; white-space: nowrap; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.action-btns { display: flex; gap: 6px; }
.action-btn { width: 30px; height: 30px; border: 1.5px solid #f0e8e0; border-radius: 7px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
.action-btn svg { width: 13px; height: 13px; }
.action-btn.edit { color: #3b82f6; }
.action-btn.edit:hover { background: #eff6ff; border-color: #3b82f6; }
.action-btn.resend { color: #f59e0b; }
.action-btn.resend:hover { background: #fffbeb; border-color: #f59e0b; }
.action-btn.delete { color: #ef4444; }
.action-btn.delete:hover { background: #fff1f2; border-color: #ef4444; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; }
.modal-header h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'DM Sans', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; margin-top: 16px; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
.delete-msg { font-size: 14px; color: #4a3020; line-height: 1.6; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>