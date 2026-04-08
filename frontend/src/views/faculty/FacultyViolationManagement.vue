<template>
  <div class="page">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Student Violations</h2>
        <p class="page-sub">
          Record and monitor violations for students in your handled sections.
        </p>
      </div>

      <button class="primary-btn" @click="openReportModal">
        + Record Violation
      </button>
    </div>

    <!-- STATS -->
    <div class="mini-stats">
      <div class="mini-stat stat-orange">
        <div class="stat-icon">📄</div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[0].value }}</span>
          <span class="stat-label">Total Reports</span>
        </div>
      </div>

      <div class="mini-stat stat-red">
        <div class="stat-icon">⛔</div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[1].value }}</span>
          <span class="stat-label">Major</span>
        </div>
      </div>

      <div class="mini-stat stat-yellow">
        <div class="stat-icon">⚠️</div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[2].value }}</span>
          <span class="stat-label">Moderate</span>
        </div>
      </div>

      <div class="mini-stat stat-blue">
        <div class="stat-icon">ℹ️</div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[3].value }}</span>
          <span class="stat-label">Minor</span>
        </div>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="table-toolbar">
      <div class="search-wrap">
        <input
          v-model="search"
          type="text"
          placeholder="Search student or violation..."
        />
      </div>
    </div>

    <!-- TABLE -->
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
              <th>VIOLATION</th>
              <th>SEVERITY</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="v in filteredViolations"
              :key="v.id"
              class="clickable-row"
              @click="viewViolation(v)"
            >
              <td>
                <div class="student-cell">
                  <div class="s-avatar">
                    {{ v.student?.first_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="s-name">
                      {{ v.student?.first_name }} {{ v.student?.last_name }}
                    </p>
                    <p class="s-sub">
                      {{ v.student?.user?.student_number }}
                    </p>
                  </div>
                </div>
              </td>

              <td>{{ v.violationType }}</td>

              <td>
                <span :class="'severity-badge sev-' + v.severity.toLowerCase()">
                  {{ v.severity }}
                </span>
              </td>

              <td>{{ formatDate(v.dateReported) }}</td>

              <td>
                <span class="status-badge">
                  {{ v.status }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredViolations.length === 0">
              <td colspan="5" class="empty-row">
                No violations found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VIOLATION DETAILS MODAL -->
    <div
      v-if="viewingViolation"
      class="modal-overlay"
      @click.self="viewingViolation = null"
    >
      <div class="modal detail-modal">
        <div class="modal-header">
          <div class="header-with-icon">
            <span class="header-icon-box">📄</span>
            <div>
              <h3>Violation Details</h3>
              <p class="modal-sub">Reported on {{ formatDate(viewingViolation.dateReported) }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingViolation = null">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Involved Student</h4>
            <div class="involved-student">
              <div class="s-avatar lg">{{ viewingViolation.student?.first_name?.charAt(0) }}</div>
              <div>
                <p class="s-name-lg">{{ viewingViolation.student?.first_name }} {{ viewingViolation.student?.last_name }}</p>
                <p class="s-sub-lg">{{ viewingViolation.student?.user?.student_number }} · {{ viewingViolation.student?.section?.section_name }}</p>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Incident Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Violation Type</span>
                <span class="detail-val">{{ viewingViolation.violationType }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Severity</span>
                <span :class="'severity-badge sev-' + viewingViolation.severity.toLowerCase()">{{ viewingViolation.severity }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.course">
                <span class="detail-key">Related Course</span>
                <span class="detail-val">{{ viewingViolation.course.course_code }} - {{ viewingViolation.course.course_name }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.location">
                <span class="detail-key">Location</span>
                <span class="detail-val">{{ viewingViolation.location }}</span>
              </div>
              <div class="detail-row" v-if="viewingViolation.incident_time">
                <span class="detail-key">Incident Time</span>
                <span class="detail-val">{{ viewingViolation.incident_time }}</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Description / Remarks</h4>
            <p class="description-text">{{ viewingViolation.description }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingViolation = null">Close</button>
        </div>
      </div>
    </div>

    <!-- RECORD VIOLATION MODAL -->
    <div
      v-if="showReportModal"
      class="modal-overlay"
      @click.self="!saving && closeReportModal()"
    >
      <div class="modal form-modal">
        <div class="modal-header">
          <div class="header-with-icon">
            <span class="header-icon-box orange">⚠️</span>
            <div>
              <h3>Record New Violation</h3>
              <p class="modal-sub">Report a disciplinary incident for your students.</p>
            </div>
          </div>
          <button class="close-btn" @click="closeReportModal" :disabled="saving">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitViolation" class="violation-form">
            <div class="form-section">
              <h4 class="section-title">1. Involved Students</h4>
              
              <!-- Searchable Student Selection -->
              <div class="student-selection-box">
                <div class="selection-search">
                  <svg viewBox="0 0 18 18" fill="none" class="search-icon"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <input v-model="studentSearch" type="text" placeholder="Search students by name or ID..." />
                </div>
                
                <div class="student-list-container">
                  <div v-if="filteredMyStudents.length === 0" class="empty-selection">
                    No students found matching your search.
                  </div>
                  <div v-for="s in filteredMyStudents" :key="s.id" class="student-option" :class="{ selected: form.student_ids.includes(s.id) }">
                    <label class="checkbox-container">
                      <input type="checkbox" :value="s.id" v-model="form.student_ids" />
                      <span class="checkmark"></span>
                      <div class="option-info">
                        <span class="option-name">{{ s.last_name }}, {{ s.first_name }}</span>
                        <span class="option-sub">{{ s.user?.student_number }} · {{ s.section?.section_name }}</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div class="selection-footer">
                  <span>{{ form.student_ids.length }} student(s) selected</span>
                  <button type="button" class="text-btn" @click="form.student_ids = []" v-if="form.student_ids.length > 0">Clear Selection</button>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-title">2. Incident Details</h4>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Related Subject (Optional)</label>
                  <select v-model="form.course_id" :disabled="saving">
                    <option value="">No specific subject</option>
                    <option v-for="sub in mySubjects" :key="sub.id + sub.section_id" :value="sub.id">
                      {{ sub.code }} - {{ sub.name }} ({{ sub.section_name }})
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Violation Type <span class="req">*</span></label>
                  <input v-model="form.violationType" type="text" placeholder="e.g. Excessive Tardiness" required :disabled="saving" />
                </div>
                
                <div class="form-group">
                  <label>Severity Level <span class="req">*</span></label>
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
                  <label>Incident Time</label>
                  <input v-model="form.incident_time" type="time" :disabled="saving" />
                </div>

                <div class="form-group full-width">
                  <label>Location</label>
                  <input v-model="form.location" type="text" placeholder="e.g. Room 402, Computer Lab 1" :disabled="saving" />
                </div>

                <div class="form-group full-width">
                  <label>Description & Remarks <span class="req">*</span></label>
                  <textarea v-model="form.description" rows="3" placeholder="Provide detailed information about the incident..." required :disabled="saving"></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="ghost-btn" @click="closeReportModal" :disabled="saving">Cancel</button>
          <button type="submit" class="primary-btn" @click="submitViolation" :disabled="saving || form.student_ids.length === 0">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Recording...' : 'Record Violation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const violations = ref([])
const myStudents = ref([])
const mySubjects = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const studentSearch = ref('')
const viewingViolation = ref(null)
const showReportModal = ref(false)

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

const fetchHandledData = async () => {
  try {
    const res = await axios.get('/faculty/students')
    myStudents.value = res.data.students
    mySubjects.value = res.data.subjects
  } catch (err) {
    console.error('Failed to fetch handled students/subjects:', err)
  }
}

const filteredViolations = computed(() => {
  return violations.value.filter(v => {
    const s = search.value.toLowerCase()
    return (
      !search.value ||
      v.violationType.toLowerCase().includes(s) ||
      v.student?.first_name?.toLowerCase().includes(s) ||
      v.student?.last_name?.toLowerCase().includes(s) ||
      v.student?.user?.student_number?.toLowerCase().includes(s)
    )
  })
})

const filteredMyStudents = computed(() => {
  if (!studentSearch.value) return myStudents.value
  const s = studentSearch.value.toLowerCase()
  return myStudents.value.filter(std => 
    std.first_name.toLowerCase().includes(s) ||
    std.last_name.toLowerCase().includes(s) ||
    std.user?.student_number?.toLowerCase().includes(s)
  )
})

const miniStats = computed(() => [
  { value: violations.value.length },
  { value: violations.value.filter(v => v.severity === 'Major').length },
  { value: violations.value.filter(v => v.severity === 'Moderate').length },
  { value: violations.value.filter(v => v.severity === 'Minor').length }
])

const viewViolation = v => (viewingViolation.value = v)

const openReportModal = () => {
  fetchHandledData()
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
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
}

const submitViolation = async () => {
  if (form.value.student_ids.length === 0) {
    alert('Please select at least one student.')
    return
  }

  saving.value = true
  try {
    await axios.post('/faculty/violations', form.value)
    alert('Violation(s) recorded successfully.')
    closeReportModal()
    fetchViolations()
  } catch (err) {
    console.error('Failed to record violation:', err)
    alert(err.response?.data?.message || 'Failed to record violation. Please try again.')
  } finally {
    saving.value = false
  }
}

const formatDate = d =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

onMounted(fetchViolations)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Outfit', sans-serif;
  padding-bottom: 40px;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
}

.page-sub {
  font-size: 13px;
  color: #b89f90;
}

/* BUTTONS */
.primary-btn {
  background: #FF6B1A;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background: #e85500;
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ghost-btn {
  background: #fff;
  color: #4a3020;
  border: 1.5px solid #f0e8e0;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ghost-btn:hover {
  border-color: #FF6B1A;
  color: #FF6B1A;
}

/* STATS */
.mini-stats {
  display: flex;
  gap: 14px;
}

.mini-stat {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #f0e8e0;
  border-top: 4px solid;
  display: flex;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(26, 10, 0, 0.03);
}

.stat-icon {
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf8f6;
  border-radius: 12px;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #1a0a00;
}

.stat-label {
  font-size: 10px;
  color: #9a8070;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* COLORS */
.stat-orange { border-color: #FF6B1A; }
.stat-red { border-color: #ef4444; }
.stat-yellow { border-color: #f59e0b; }
.stat-blue { border-color: #3b82f6; }

/* TOOLBAR */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-wrap {
  width: 100%;
  max-width: 320px;
}

.search-wrap input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1.5px solid #f0e8e0;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-wrap input:focus {
  border-color: #FF6B1A;
  box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.08);
}

/* TABLE */
.table-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #f0e8e0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(26, 10, 0, 0.03);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  font-size: 10px;
  text-transform: uppercase;
  color: #9a8070;
  padding: 16px 20px;
  background: #faf8f6;
  font-weight: 700;
  letter-spacing: 0.8px;
  border-bottom: 1.5px solid #f0e8e0;
}

.data-table td {
  padding: 14px 20px;
  font-size: 13px;
  border-bottom: 1px solid #faf8f6;
  vertical-align: middle;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.15s;
}

.clickable-row:hover td {
  background: #fffaf8;
}

/* STUDENT CELL */
.student-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.s-avatar {
  width: 36px;
  height: 36px;
  background: #f0e8e0;
  color: #1a0a00;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 700;
}

.s-name {
  font-weight: 600;
  color: #1a0a00;
}

.s-sub {
  font-size: 11px;
  color: #b89f90;
  margin-top: 1px;
}

/* BADGES */
.severity-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.sev-major { background: #fef2f2; color: #ef4444; }
.sev-moderate { background: #fffbeb; color: #d97706; }
.sev-minor { background: #eff6ff; color: #3b82f6; }

.status-badge {
  font-size: 11px;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 20px;
}

.empty-row {
  text-align: center;
  padding: 60px !important;
  color: #9a8070;
  font-style: italic;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 10, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.detail-modal { width: 500px; }
.form-modal { width: 600px; }

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0e8e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

.header-with-icon {
  display: flex;
  gap: 16px;
  align-items: center;
}

.header-icon-box {
  width: 44px;
  height: 44px;
  background: #faf8f6;
  border: 1.5px solid #f0e8e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.header-icon-box.orange {
  background: #fff5ef;
  border-color: #ffe0cc;
}

.modal-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0;
}

.modal-sub {
  font-size: 12px;
  color: #b89f90;
  margin: 1px 0 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #9a8070;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #faf8f6;
  color: #1a0a00;
}

.modal-body {
  padding: 24px;
}

/* STUDENT SELECTION BOX */
.student-selection-box {
  border: 1.5px solid #f0e8e0;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.selection-search {
  padding: 12px 16px;
  border-bottom: 1px solid #f0e8e0;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #faf8f6;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #9a8070;
}

.selection-search input {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  font-size: 13px !important;
  width: 100%;
  box-shadow: none !important;
}

.student-list-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.empty-selection {
  padding: 30px;
  text-align: center;
  color: #b89f90;
  font-size: 13px;
  font-style: italic;
}

.student-option {
  padding: 2px;
  border-radius: 10px;
  transition: all 0.2s;
}

.student-option:hover {
  background: #faf8f6;
}

.student-option.selected {
  background: #fff5ef;
}

.checkbox-container {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  position: relative;
  gap: 12px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
  position: relative;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #FF6B1A;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #FF6B1A;
  border-color: #FF6B1A;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.option-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
}

.option-sub {
  font-size: 11px;
  color: #9a8070;
}

.selection-footer {
  padding: 10px 16px;
  background: #faf8f6;
  border-top: 1px solid #f0e8e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9a8070;
  font-weight: 600;
}

.text-btn {
  background: none;
  border: none;
  color: #FF6B1A;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.text-btn:hover {
  background: rgba(255, 107, 26, 0.05);
}

.profile-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 14px;
}

.involved-student {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #faf8f6;
  padding: 16px;
  border-radius: 16px;
}

.s-avatar.lg {
  width: 50px;
  height: 50px;
  font-size: 20px;
  border-radius: 14px;
  background: #FF6B1A;
  color: #fff;
}

.s-name-lg {
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.s-sub-lg {
  font-size: 13px;
  color: #9a8070;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #faf8f6;
}

.detail-key {
  font-size: 13px;
  color: #9a8070;
}

.detail-val {
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4a3020;
  background: #faf8f6;
  padding: 16px;
  border-radius: 12px;
  white-space: pre-wrap;
}

.modal-footer {
  padding: 18px 24px;
  border-top: 1px solid #f0e8e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* FORM STYLES */
.violation-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: #4a3020;
  display: flex;
  justify-content: space-between;
}

.req { color: #ef4444; margin-left: 4px; }

.form-group input, 
.form-group select, 
.form-group textarea {
  padding: 11px 14px;
  border: 1.5px solid #f0e8e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  background: #fff;
  transition: all 0.2s;
  color: #1a0a00;
  font-family: inherit;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  border-color: #FF6B1A;
  box-shadow: 0 0 0 4px rgba(255, 107, 26, 0.08);
}

.form-group input::placeholder, 
.form-group textarea::placeholder {
  color: #b89f90;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-overlay {
  padding: 60px;
  text-align: center;
  color: #9a8070;
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border: 3px solid #f0e8e0;
  border-top-color: #FF6B1A;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}
</style>