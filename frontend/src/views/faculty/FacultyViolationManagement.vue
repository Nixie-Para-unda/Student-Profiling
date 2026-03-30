<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Student Violations</h2>
        <p class="page-sub">Record and monitor violations for students in your handled sections.</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openReportModal">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Record Violation
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="mini-stats">
      <div class="mini-stat" v-for="s in miniStats" :key="s.label">
        <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="mini-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-lg"></div>
        <p>Fetching violations...</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>VIOLATION TYPE</th>
              <th>SEVERITY</th>
              <th>DATE REPORTED</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in violations" :key="v.id" @click="viewViolation(v)" class="clickable-row">
              <td>
                <div class="student-cell">
                  <div class="s-avatar" :style="{ background: studentColors[v.student_id % studentColors.length] || '#FF6B1A' }">
                    {{ v.student?.first_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="s-name">{{ v.student?.first_name }} {{ v.student?.last_name }}</p>
                    <p class="s-sub">{{ v.student?.user?.student_number || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td>{{ v.violationType }}</td>
              <td>
                <span class="severity-badge" :class="'sev-' + v.severity.toLowerCase()">
                  {{ v.severity }}
                </span>
              </td>
              <td>{{ formatDate(v.dateReported) }}</td>
              <td>
                <span class="status-badge" :class="v.status === 'active' ? 'st-active' : 'st-resolved'">
                  {{ v.status }}
                </span>
              </td>
            </tr>
            <tr v-if="violations.length === 0 && !loading">
              <td colspan="5" class="empty-row">No violations recorded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- RECORD VIOLATION MODAL -->
    <div v-if="showReportModal" class="modal-overlay" @click.self="!saving && (showReportModal = false)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Record New Violation</h3>
          <button class="close-btn" @click="showReportModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitViolation" class="form-grid">
            <!-- Searchable Multi-Select Dropdown -->
            <div class="form-group full-span">
              <label>Select Student(s) <span class="req">*</span></label>
              <div class="custom-select-container" v-click-outside="() => showDropdown = false">
                <div class="search-input-wrap">
                  <svg viewBox="0 0 18 18" fill="none" class="search-icon"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <input 
                    v-model="studentSearch" 
                    type="text" 
                    placeholder="Search students to involve..." 
                    @focus="showDropdown = true"
                    @click="showDropdown = true"
                    :disabled="saving"
                  />
                </div>
                
                <!-- Selected Chips -->
                <div class="selected-chips" v-if="form.student_ids.length > 0">
                  <div v-for="id in form.student_ids" :key="id" class="chip">
                    <span>{{ getStudentName(id) }}</span>
                    <button type="button" @click="toggleStudent(id)" :disabled="saving">×</button>
                  </div>
                </div>

                <!-- Dropdown -->
                <div v-show="showDropdown" class="select-dropdown">
                  <div v-if="filteredStudentsForSelect.length === 0" class="no-results">
                    {{ students.length === 0 ? 'Loading students...' : 'No students found matching your search.' }}
                  </div>
                  <template v-else>
                    <div v-for="(studentsList, section) in groupedFilteredStudents" :key="section" class="dropdown-group">
                      <div class="group-label">{{ section }}</div>
                      <div 
                        v-for="s in studentsList" 
                        :key="s.id" 
                        class="dropdown-item" 
                        :class="{ selected: form.student_ids.includes(s.id) }"
                        @mousedown.prevent="toggleStudent(s.id)"
                      >
                        <div class="item-info">
                          <span class="item-name">{{ s.first_name }} {{ s.last_name }}</span>
                          <span class="item-sub">{{ s.student_number }}</span>
                        </div>
                        <div class="item-checkbox">
                          <div class="check-box" :class="{ checked: form.student_ids.includes(s.id) }">
                            <svg v-if="form.student_ids.includes(s.id)" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <p class="field-help" v-if="form.student_ids.length > 0">Selected {{ form.student_ids.length }} student(s)</p>
            </div>

            <div class="form-group full-span">
              <label>Violation Type <span class="req">*</span></label>
              <input v-model="form.violationType" type="text" placeholder="e.g. Excessive Absences, Dress Code, Academic Dishonesty" required :disabled="saving" />
            </div>

            <div class="form-group">
              <label>Severity <span class="req">*</span></label>
              <select v-model="form.severity" required :disabled="saving">
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Major">Major</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date of Incident <span class="req">*</span></label>
              <input v-model="form.dateReported" type="date" required :disabled="saving" />
            </div>

            <div class="form-group">
              <label>Time of Incident</label>
              <input v-model="form.incident_time" type="time" :disabled="saving" />
            </div>

            <div class="form-group">
              <label>Location</label>
              <input v-model="form.location" type="text" placeholder="e.g. Room 204, Library, Hallway" :disabled="saving" />
            </div>

            <div class="form-group full-span">
              <label>During Subject (Optional)</label>
              <select v-model="form.course_id" :disabled="saving">
                <option value="">Not during a subject</option>
                <option v-for="subj in availableSubjects" :key="subj.id" :value="subj.id">
                  {{ subj.name }} ({{ subj.code }})
                </option>
              </select>
            </div>

            <div class="form-group full-span">
              <label>Description <span class="req">*</span></label>
              <textarea v-model="form.description" rows="3" placeholder="Provide details about the incident..." required :disabled="saving"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showReportModal = false" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="submitViolation" :disabled="saving || form.student_ids.length === 0">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Submitting...' : 'Submit Report' }}
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW VIOLATION DETAILS MODAL -->
    <div v-if="viewingViolation" class="modal-overlay" @click.self="viewingViolation = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Violation Details</h3>
          <button class="close-btn" @click="viewingViolation = null">×</button>
        </div>
        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Student Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Name</span>
                <span class="detail-val">{{ viewingViolation.student?.first_name }} {{ viewingViolation.student?.last_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Student No.</span>
                <span class="detail-val">{{ viewingViolation.student?.user?.student_number || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Section</span>
                <span class="detail-val">{{ viewingViolation.student?.section?.section_name || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Incident Details</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Type</span>
                <span class="detail-val">{{ viewingViolation.violationType }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Severity</span>
                <span class="detail-val">
                  <span class="severity-badge" :class="'sev-' + viewingViolation.severity.toLowerCase()">
                    {{ viewingViolation.severity }}
                  </span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Date Reported</span>
                <span class="detail-val">{{ formatDate(viewingViolation.dateReported) }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.incident_time">
                <span class="detail-key">Time</span>
                <span class="detail-val">{{ formatTime(viewingViolation.incident_time) }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.location">
                <span class="detail-key">Location</span>
                <span class="detail-val">{{ viewingViolation.location }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.course">
                <span class="detail-key">During Subject</span>
                <span class="detail-val">{{ viewingViolation.course.course_name }} ({{ viewingViolation.course.course_code }})</span>
              </div>
              <div class="detail-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                <span class="detail-key">Description</span>
                <p class="detail-val" style="text-align: left; line-height: 1.5; color: #4a3020;">{{ viewingViolation.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingViolation = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('mousedown', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el.clickOutsideEvent)
  }
}

const violations = ref([])
const students = ref([])
const availableSubjects = ref([])
const loading = ref(false)
const saving = ref(false)
const showReportModal = ref(false)
const viewingViolation = ref(null)
const studentColors = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

// Selection states
const studentSearch = ref('')
const showDropdown = ref(false)

const form = ref({
  student_ids: [],
  violationType: '',
  severity: 'Minor',
  description: '',
  dateReported: new Date().toISOString().split('T')[0],
  incident_time: '',
  location: '',
  course_id: ''
})

const fetchViolations = async () => {
  loading.value = true
  try {
    const res = await axios.get('/faculty/violations')
    violations.value = res.data
  } catch (err) {
    console.error('Failed to fetch violations:', err)
  } finally {
    loading.value = false
  }
}

const fetchStudents = async () => {
  try {
    const res = await axios.get('/faculty/students')
    // Data structure: { students: [...], subjects: [...] }
    const data = res.data.students || []
    students.value = data.map(s => ({
      ...s,
      student_number: s.user?.student_number || 'N/A'
    }))
    
    // Also store subjects for the reporting dropdown
    const subjs = res.data.subjects || []
    // Make subjects unique by ID
    const uniqueSubjs = []
    const ids = new Set()
    for (const sub of subjs) {
      if (!ids.has(sub.id)) {
        ids.add(sub.id)
        uniqueSubjs.push(sub)
      }
    }
    availableSubjects.value = uniqueSubjs.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    console.error('Failed to fetch students:', err)
  }
}

const filteredStudentsForSelect = computed(() => {
  if (!Array.isArray(students.value)) return []
  if (!studentSearch.value) return students.value
  
  const s = studentSearch.value.toLowerCase()
  return students.value.filter(std => {
    const fullName = `${std.first_name || ''} ${std.last_name || ''}`.toLowerCase()
    const studentNum = (std.student_number || '').toLowerCase()
    return fullName.includes(s) || studentNum.includes(s)
  })
})

const groupedFilteredStudents = computed(() => {
  return filteredStudentsForSelect.value.reduce((acc, s) => {
    const sec = s.section?.section_name || 'No Section'
    if (!acc[sec]) acc[sec] = []
    acc[sec].push(s)
    return acc
  }, {})
})

const getStudentName = (id) => {
  const s = students.value.find(std => std.id === id)
  return s ? `${s.first_name} ${s.last_name}` : 'Unknown'
}

const toggleStudent = (id) => {
  const idx = form.value.student_ids.indexOf(id)
  if (idx > -1) {
    form.value.student_ids.splice(idx, 1)
  } else {
    form.value.student_ids.push(id)
  }
}

const miniStats = computed(() => [
  { label: 'Total Reported', value: violations.value.length, color: '#FF6B1A' },
  { label: 'Major', value: violations.value.filter(v => v.severity === 'Major').length, color: '#ef4444' },
  { label: 'Moderate', value: violations.value.filter(v => v.severity === 'Moderate').length, color: '#f59e0b' },
  { label: 'Minor', value: violations.value.filter(v => v.severity === 'Minor').length, color: '#3b82f6' }
])

const openReportModal = () => {
  form.value = {
    student_ids: [],
    violationType: '',
    severity: 'Minor',
    description: '',
    dateReported: new Date().toISOString().split('T')[0],
    incident_time: '',
    location: '',
    course_id: ''
  }
  studentSearch.value = ''
  showDropdown.value = false
  showReportModal.value = true
}

const submitViolation = async () => {
  if (form.value.student_ids.length === 0 || !form.value.violationType || !form.value.description) {
    alert('Please fill in all required fields.')
    return
  }

  saving.value = true
  try {
    const res = await axios.post('/faculty/violations', form.value)
    alert(res.data.message)
    showReportModal.value = false
    fetchViolations()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to record violation.')
  } finally {
    saving.value = false
  }
}

const viewViolation = (v) => {
  viewingViolation.value = v
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

onMounted(() => {
  fetchViolations()
  fetchStudents()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* ── Buttons ── */
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; }

/* ── Mini Stats ── */
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.mini-stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; position: relative; flex: 1; display: flex; flex-direction: column; min-height: 400px; }
.table-container { flex: 1; overflow-y: auto; }
.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; gap: 10px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.s-sub { font-size: 11px; color: #b89f90; }

.severity-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.sev-minor { background: #eff6ff; color: #3b82f6; }
.sev-moderate { background: #fffbeb; color: #d97706; }
.sev-major { background: #fef2f2; color: #ef4444; }

.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-resolved { background: #f3f4f6; color: #6b7280; }

.clickable-row { cursor: pointer; transition: all 0.2s; }
.clickable-row:hover { background-color: #fff9f4 !important; }

.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 500px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-lg { max-width: 600px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; }

.modal-body { padding: 24px; overflow-y: auto; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.full-span { grid-column: span 2; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }
.form-group input, .form-group select, .form-group textarea { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }

/* ── Custom Multi-Select ── */
.custom-select-container { position: relative; display: flex; flex-direction: column; gap: 10px; }
.search-input-wrap { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; width: 14px; height: 14px; color: #b89f90; pointer-events: none; }
.search-input-wrap input { padding-left: 38px; }

.selected-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { display: flex; align-items: center; gap: 6px; background: #fff5ef; border: 1px solid #ffd5b0; color: #c94000; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.chip button { background: none; border: none; color: #c94000; font-size: 16px; cursor: pointer; line-height: 1; padding: 0; margin-left: 2px; }

.select-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 50; background: #fff; border: 1px solid #f0e8e0; border-radius: 12px; margin-top: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-height: 240px; overflow-y: auto; }
.dropdown-group { border-bottom: 1px solid #faf8f6; }
.group-label { background: #faf8f6; padding: 6px 14px; font-size: 10px; font-weight: 800; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.dropdown-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; transition: all 0.15s; }
.dropdown-item:hover { background: #fff5ef; }
.dropdown-item.selected { background: #fff9f4; }
.item-info { display: flex; flex-direction: column; }
.item-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.item-sub { font-size: 11px; color: #b89f90; }
.item-checkbox { flex-shrink: 0; }
.check-box { width: 18px; height: 18px; border: 1.5px solid #f0e8e0; border-radius: 5px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.check-box.checked { background: #FF6B1A; border-color: #FF6B1A; }
.no-results { padding: 20px; text-align: center; font-size: 13px; color: #b89f90; font-style: italic; }
.field-help { font-size: 11px; color: #FF6B1A; font-weight: 600; margin-top: 4px; }

.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }

.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
