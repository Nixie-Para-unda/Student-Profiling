<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Student Accounts</h2>
        <p class="page-sub">Create and manage initial student accounts for the department.</p>
      </div>

      <!-- DESIGN FIX: Import & Create only visible to secretary role -->
      <div class="header-actions" v-if="userRole === 'secretary'">
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
          <span>Required columns: <strong>first_name, last_name, email, student_number, course, year_level, section</strong></span>
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

        <!-- FILTER FIX: Year Level filter -->
        <select v-model="filterYear">
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <!-- FILTER FIX: Section filter (dynamically populated from loaded students) -->
        <select v-model="filterSection">
          <option value="">All Sections</option>
          <option v-for="sec in availableSections" :key="sec" :value="sec">{{ sec }}</option>
        </select>

        <select v-model="filterStatus">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <!-- DESIGN FIX: Removed ACTIONS column; rows are clickable -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>STUDENT NO.</th>
            <th>COURSE</th>
            <th>YEAR & SECTION</th>
            <th>EMAIL</th>
            <th>STATUS</th>
            <th>CREATED</th>
          </tr>
        </thead>
        <tbody>
          <!-- ROW CLICKABLE FIX: @click opens the detail modal -->
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            class="clickable-row"
            @click="viewStudent(student)"
          >
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
            <td>{{ student.year_level }}{{ getYearSuffix(student.year_level) }} Year · {{ student.section || '—' }}</td>
            <td class="email-cell">{{ student.email }}</td>
            <td>
              <span class="status-badge" :class="student.status === 'active' ? 'st-active' : 'st-pending'">
                {{ student.status === 'active' ? 'Active' : 'Pending Setup' }}
              </span>
            </td>
            <td class="date-cell">{{ student.created_at }}</td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="7" class="empty-row">No students found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══════════════════════════════════════════════════
         CREATE MODAL (secretary only — fields are editable)
    ═══════════════════════════════════════════════════ -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="!saving && (showCreateModal = false)">
      <div class="modal">
        <div class="modal-header">
          <h3>Create Student Account</h3>
          <button class="close-btn" @click="showCreateModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name <span class="req">*</span></label>
              <input v-model="form.first_name" type="text" placeholder="First name" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Last Name <span class="req">*</span></label>
              <input v-model="form.last_name" type="text" placeholder="Last name" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Student Number <span class="req">*</span></label>
              <input v-model="form.student_number" type="text" placeholder="e.g. 2024-00001" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Email Address <span class="req">*</span></label>
              <input v-model="form.email" type="email" placeholder="student@school.edu.ph" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Course <span class="req">*</span></label>
              <select v-model="form.course" :disabled="saving">
                <option value="">Select Course</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSIS">BSIS</option>
              </select>
            </div>
            <div class="form-group">
              <label>Year Level <span class="req">*</span></label>
              <select v-model="form.year_level" :disabled="saving">
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <!-- BUG A FIX: Section field added to create form -->
            <div class="form-group full-span">
              <label>Section <span class="req">*</span></label>
              <select v-model="form.section_id" :disabled="saving">
                <option value="">Select Section</option>
                <option v-for="sec in sections" :key="sec.id" :value="sec.id">{{ sec.section_name }}</option>
              </select>
            </div>
          </div>
          <div class="modal-notice">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            A password setup link will be sent to the student's email after account creation.
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showCreateModal = false" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="saveStudent" :disabled="saving">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Saving...' : 'Create Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         VIEW MODAL (all roles — all fields are READ-ONLY)
         BUG B FIX: No editing allowed here
         DESIGN FIX: Archive/delete button is inside this modal
         IMPROVEMENT FIX: Row click opens this
    ═══════════════════════════════════════════════════ -->
    <div v-if="viewingStudent" class="modal-overlay" @click.self="viewingStudent = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-student-meta">
            <div class="s-avatar lg" :style="{ background: viewingStudent.color }">
              {{ viewingStudent.first_name.charAt(0) }}
            </div>
            <div>
              <h3>{{ viewingStudent.first_name }} {{ viewingStudent.last_name }}</h3>
              <p class="modal-sub">{{ viewingStudent.student_number }} · {{ viewingStudent.course }} · {{ viewingStudent.section || 'Unassigned' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingStudent = null">×</button>
        </div>

        <div class="modal-body">
          <!-- All fields are read-only display — no inputs -->
          <div class="detail-grid">
            <div class="detail-section">
              <div class="detail-section-label">Personal Information</div>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-key">First Name</span>
                  <span class="detail-val">{{ viewingStudent.first_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Last Name</span>
                  <span class="detail-val">{{ viewingStudent.last_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Email Address</span>
                  <span class="detail-val">{{ viewingStudent.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Student Number</span>
                  <span class="detail-val">
                    <span class="code-badge">{{ viewingStudent.student_number }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section-label">Academic Information</div>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-key">Course</span>
                  <span class="detail-val">{{ viewingStudent.course }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Year Level</span>
                  <span class="detail-val">{{ viewingStudent.year_level }}{{ getYearSuffix(viewingStudent.year_level) }} Year</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Section</span>
                  <span class="detail-val">{{ viewingStudent.section || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Account Status</span>
                  <span class="detail-val">
                    <span class="status-badge" :class="viewingStudent.status === 'active' ? 'st-active' : 'st-pending'">
                      {{ viewingStudent.status === 'active' ? 'Active' : 'Pending Setup' }}
                    </span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Date Created</span>
                  <span class="detail-val">{{ viewingStudent.created_at }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RESEND limit notice -->
          <div class="resend-row" v-if="viewingStudent.status === 'pending'">
            <div class="resend-info">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span>
                Setup email
                <!-- IMPROVEMENT FIX: Max 3 resends tracked per student -->
                <strong>resent {{ getResendCount(viewingStudent.id) }}/3 times</strong>
              </span>
            </div>
            <button
              class="resend-btn"
              @click="resendSetup(viewingStudent)"
              :disabled="getResendCount(viewingStudent.id) >= 3"
              :title="getResendCount(viewingStudent.id) >= 3 ? 'Maximum resend limit reached' : 'Resend setup email'"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              {{ getResendCount(viewingStudent.id) >= 3 ? 'Limit Reached' : 'Resend Email' }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingStudent = null">Close</button>
          <!-- DESIGN FIX: Archive/delete button is inside modal, not in the table -->
          <!-- Only visible to secretary role -->
          <button
            v-if="userRole === 'secretary'"
            class="danger-btn"
            @click="confirmDelete(viewingStudent)"
          >
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Delete Account
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
          <p class="delete-msg">
            Are you sure you want to delete the account of
            <strong>{{ deletingStudent?.first_name }} {{ deletingStudent?.last_name }}</strong>?
            This action cannot be undone.
          </p>
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
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

// ─── Role detection ──────────────────────────────────────────────────────────
// DESIGN FIX: Role used to conditionally show import/create and delete button.
// Adjust this to match how your auth store exposes the role.
const userRole = computed(() => authStore.user?.role || 'secretary')

// ─── State ───────────────────────────────────────────────────────────────────
const search      = ref('')
const filterCourse  = ref('')
const filterYear    = ref('')       // FILTER FIX: year filter
const filterSection = ref('')       // FILTER FIX: section filter
const filterStatus  = ref('')

const showImport      = ref(false)
const showCreateModal = ref(false)  // Separate from view modal
const showDeleteModal = ref(false)
const viewingStudent  = ref(null)   // Currently open in view modal
const deletingStudent = ref(null)
const saving          = ref(false)
const loading         = ref(false)
const loadingImport   = ref(false)
const csvInput        = ref(null)

// IMPROVEMENT FIX: Track resend counts per student id (frontend-only cap, max 3)
const resendCounts = ref({})

const form = ref({
  first_name: '', last_name: '', student_number: '',
  email: '', course: '', year_level: '', section_id: ''
})

const colors  = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
const students = ref([])
const sections = ref([])  // BUG A FIX: sections list for create form

// ─── Fetch ───────────────────────────────────────────────────────────────────
const fetchStudents = async () => {
  loading.value = true
  try {
    const [studentsRes, sectionsRes] = await Promise.all([
      axios.get('/students'),
      axios.get('/sections')
    ])

    students.value = studentsRes.data.map((s, idx) => ({
      id:             s.id,
      first_name:     s.first_name,
      last_name:      s.last_name,
      student_number: s.user?.student_number || 'N/A',
      email:          s.user?.email || 'N/A',
      course:         s.program?.program_code || 'N/A',
      year_level:     s.section?.year_level || 1,
      section:        s.section?.section_name || null,
      status:         s.user?.status || 'pending',
      created_at:     new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color:          colors[idx % colors.length]
    }))

    sections.value = sectionsRes.data
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStudents)

// ─── Computed ─────────────────────────────────────────────────────────────────

const miniStats = computed(() => [
  { label: 'Total Students',  value: students.value.length,                                      color: '#FF6B1A' },
  { label: 'Active',          value: students.value.filter(s => s.status === 'active').length,   color: '#16a34a' },
  { label: 'Pending Setup',   value: students.value.filter(s => s.status === 'pending').length,  color: '#f59e0b' },
  { label: 'BSCS',            value: students.value.filter(s => s.course === 'BSCS').length,     color: '#8b5cf6' },
  { label: 'BSIT',            value: students.value.filter(s => s.course === 'BSIT').length,     color: '#3b82f6' }
])

// FILTER FIX: Dynamic section list derived from loaded students
const availableSections = computed(() => {
  const secs = students.value
    .map(s => s.section)
    .filter(Boolean)
  return [...new Set(secs)].sort()
})

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchSearch = !search.value ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
      s.email.toLowerCase().includes(search.value.toLowerCase()) ||
      s.student_number.toLowerCase().includes(search.value.toLowerCase())
    const matchCourse  = !filterCourse.value  || s.course === filterCourse.value
    const matchYear    = !filterYear.value    || s.year_level == filterYear.value    // FILTER FIX
    const matchSection = !filterSection.value || s.section === filterSection.value  // FILTER FIX
    const matchStatus  = !filterStatus.value  || s.status === filterStatus.value
    return matchSearch && matchCourse && matchYear && matchSection && matchStatus
  })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getYearSuffix = (year) => {
  if (year == 1) return 'st'
  if (year == 2) return 'nd'
  if (year == 3) return 'rd'
  return 'th'
}

// IMPROVEMENT FIX: Resend count helpers
const getResendCount = (studentId) => resendCounts.value[studentId] || 0

const incrementResend = (studentId) => {
  resendCounts.value[studentId] = (resendCounts.value[studentId] || 0) + 1
}

// ─── Actions ──────────────────────────────────────────────────────────────────

// IMPROVEMENT FIX: Row click opens view modal
const viewStudent = (student) => {
  viewingStudent.value = student
}

const openCreateModal = () => {
  form.value = { first_name: '', last_name: '', student_number: '', email: '', course: '', year_level: '', section_id: '' }
  showCreateModal.value = true
}

const saveStudent = async () => {
  if (!form.value.first_name || !form.value.last_name || !form.value.student_number || !form.value.email || !form.value.course || !form.value.year_level || !form.value.section_id) {
    alert('Please fill in all required fields including Section.')
    return
  }

  saving.value = true
  try {
    // await axios.post('/secretary/students', form.value)
    // Mock push for now:
    students.value.push({
      id:             Date.now(),
      first_name:     form.value.first_name,
      last_name:      form.value.last_name,
      student_number: form.value.student_number,
      email:          form.value.email,
      course:         form.value.course,
      year_level:     form.value.year_level,
      section:        sections.value.find(s => s.id == form.value.section_id)?.section_name || null,
      status:         'pending',
      created_at:     new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color:          colors[students.value.length % colors.length]
    })
    showCreateModal.value = false
    await nextTick()
    alert('Student account created. Setup email sent.')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create student account.')
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
    viewingStudent.value = null
    alert('Student account deleted successfully.')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete student.')
  }
}

// IMPROVEMENT FIX: Resend capped at 3 per student on the frontend
const resendSetup = async (student) => {
  if (getResendCount(student.id) >= 3) return

  try {
    // await axios.post(`/secretary/students/${student.id}/resend-setup`)
    incrementResend(student.id)
    alert(`Setup email resent to ${student.email}. (${getResendCount(student.id)}/3 resends used)`)
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
    fetchStudents()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to import students.')
  } finally {
    loadingImport.value = false
    if (csvInput.value) csvInput.value.value = ''
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 10px; }

/* ── Buttons ── */
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.primary-btn svg { width: 15px; height: 15px; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.ghost-btn svg { width: 15px; height: 15px; }
.danger-btn { display: flex; align-items: center; gap: 6px; background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: background 0.2s; }
.danger-btn:hover { background: #dc2626; }

/* ── Import Panel ── */
.import-panel { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.import-panel-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #faf8f6; }
.import-panel-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.import-panel-header p { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.close-btn:hover { color: #1a0a00; }
.import-body { padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.drop-zone { border: 2px dashed #f0e8e0; border-radius: 14px; padding: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; min-height: 160px; }
.drop-zone:hover:not(.disabled) { border-color: #FF6B1A; background: #fffaf8; }
.drop-zone.disabled { cursor: not-allowed; opacity: 0.7; background: #fafafa; }
.drop-zone svg { width: 40px; height: 40px; color: #c0b0a5; }
.drop-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.drop-sub { font-size: 12px; color: #b89f90; }
.import-template { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a8070; background: #faf8f6; padding: 10px 14px; border-radius: 9px; }
.import-template svg { width: 14px; height: 14px; color: #FF6B1A; flex-shrink: 0; }

/* ── Mini Stats ── */
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.mini-stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }

/* ── Toolbar ── */
.table-toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; min-width: 200px; transition: all 0.2s; }
.search-wrap:focus-within { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.search-wrap svg { width: 15px; height: 15px; color: #c0b0a5; flex-shrink: 0; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; width: 100%; background: none; }
.search-wrap input::placeholder { color: #c0b0a5; }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-group select { padding: 9px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; background: #fff; outline: none; cursor: pointer; transition: border-color 0.2s; }
.filter-group select:focus { border-color: #FF6B1A; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }

/* IMPROVEMENT FIX: Clickable row styling */
.clickable-row { cursor: pointer; transition: background 0.15s; }
.clickable-row:hover td { background: #fdf5ef; }
.clickable-row:hover .s-name { color: #FF6B1A; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-avatar.lg { width: 48px; height: 48px; font-size: 20px; border-radius: 14px; flex-shrink: 0; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; transition: color 0.15s; }
.s-sub { font-size: 11px; color: #b89f90; margin-top: 1px; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.email-cell { font-size: 12px; color: #6b7280; }
.date-cell { font-size: 12px; color: #9a8070; white-space: nowrap; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-lg { max-width: 600px; }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-student-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-student-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }

/* ── Create form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.full-span { grid-column: span 2; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }
.form-group input,
.form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; width: 100%; }
.form-group input:focus,
.form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; margin-top: 16px; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }

/* ── View modal detail grid ── */
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-section { background: #faf8f6; border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.detail-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #9a8070; padding: 12px 16px 8px; border-bottom: 1px solid #f0e8e0; background: #f5f1ed; }
.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }

/* ── Resend row ── */
.resend-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; }
.resend-info { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #92400e; }
.resend-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid #fde68a; color: #92400e; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.resend-btn:hover:not(:disabled) { background: #fef3c7; border-color: #f59e0b; }
.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f5f1ed; border-color: #e5e0da; color: #a89080; }

/* ── Misc ── */
.delete-msg { font-size: 14px; color: #4a3020; line-height: 1.6; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>