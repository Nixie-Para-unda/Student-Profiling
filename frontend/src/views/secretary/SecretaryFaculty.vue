<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Faculty Accounts</h2>
        <p class="page-sub">Create and manage initial faculty member accounts.</p>
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
        <div><h3>Import Faculty via CSV</h3><p>Upload a CSV file to create multiple faculty accounts at once.</p></div>
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
          <span>Required columns: <strong>first_name, last_name, middle_name, email, position</strong></span>
        </div>
      </div>
    </div>

    <!-- Mini Stats -->
    <div class="mini-stats">
      <div class="mini-stat" v-for="s in miniStats" :key="s.label">
        <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="mini-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by name or email..." />
      </div>
      <div class="filter-group">
        <select v-model="filterDept">
          <option value="">All Departments</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.department_name }}</option>
        </select>
        <!-- FIX: Position filter added -->
        <select v-model="filterPosition">
          <option value="">All Positions</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Instructor">Instructor</option>
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
      <div v-if="loading" class="loading-state">
        <div class="spinner-lg"></div>
        <p>Loading faculty members...</p>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>FACULTY</th>
            <th>EMPLOYEE ID</th>
            <th>DEPARTMENT</th>
            <th>POSITION</th>
            <th>EMAIL</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <!-- FIX: Row is now clickable to open view modal -->
          <tr
            v-for="f in filteredFaculty"
            :key="f.id"
            class="clickable-row"
            @click="viewFaculty(f)"
          >
            <td>
              <div class="student-cell">
                <div class="s-avatar" :style="{ background: f.color }">{{ f.first_name.charAt(0) }}</div>
                <div>
                  <p class="s-name">{{ f.first_name }} {{ f.last_name }}</p>
                  <p class="s-sub">{{ f.position }}</p>
                </div>
              </div>
            </td>
            <td><span class="code-badge">{{ f.employee_id }}</span></td>
            <td>{{ f.department_name }}</td>
            <td>{{ f.position }}</td>
            <td class="email-cell">{{ f.user?.email }}</td>
            <td><span class="status-badge" :class="f.status === 'active' ? 'st-active' : 'st-pending'">{{ f.status === 'active' ? 'Active' : 'Pending Setup' }}</span></td>
            <td>
              <!-- Stop propagation so action buttons don't also trigger row click -->
              <div class="action-btns" @click.stop>
                <button class="action-btn edit" @click="openEditModal(f)" title="Edit">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="action-btn view" @click="viewFaculty(f)" title="View details">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredFaculty.length === 0">
            <td colspan="7" class="empty-row">No faculty members found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══════════════════════════════════════════════════
         FIX: VIEW MODAL — read-only faculty details
         Includes resend email with 3-attempt limit
    ═══════════════════════════════════════════════════ -->
    <div v-if="viewingFaculty" class="modal-overlay" @click.self="viewingFaculty = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-faculty-meta">
            <div class="s-avatar lg" :style="{ background: viewingFaculty.color }">
              {{ viewingFaculty.first_name.charAt(0) }}
            </div>
            <div>
              <h3>{{ viewingFaculty.first_name }} {{ viewingFaculty.last_name }}</h3>
              <p class="modal-sub">{{ viewingFaculty.employee_id }} · {{ viewingFaculty.department_name }} · {{ viewingFaculty.position }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingFaculty = null">×</button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-section">
              <div class="detail-section-label">Personal Information</div>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-key">First Name</span>
                  <span class="detail-val">{{ viewingFaculty.first_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Last Name</span>
                  <span class="detail-val">{{ viewingFaculty.last_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Middle Name</span>
                  <span class="detail-val">{{ viewingFaculty.middle_name || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Email Address</span>
                  <span class="detail-val">{{ viewingFaculty.user?.email || '—' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section-label">Academic Information</div>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-key">Employee ID</span>
                  <span class="detail-val">
                    <span class="code-badge">{{ viewingFaculty.employee_id }}</span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Department</span>
                  <span class="detail-val">{{ viewingFaculty.department_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Position</span>
                  <span class="detail-val">{{ viewingFaculty.position }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Account Status</span>
                  <span class="detail-val">
                    <span class="status-badge" :class="viewingFaculty.status === 'active' ? 'st-active' : 'st-pending'">
                      {{ viewingFaculty.status === 'active' ? 'Active' : 'Pending Setup' }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- FIX: Resend email with max 3 limit -->
          <div class="resend-row" v-if="viewingFaculty.status === 'pending'">
            <div class="resend-info">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span>Setup email <strong>resent {{ getResendCount(viewingFaculty.id) }}/3 times</strong></span>
            </div>
            <button
              class="resend-btn"
              @click="resendSetup(viewingFaculty)"
              :disabled="getResendCount(viewingFaculty.id) >= 3"
              :title="getResendCount(viewingFaculty.id) >= 3 ? 'Maximum resend limit reached' : 'Resend setup email'"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              {{ getResendCount(viewingFaculty.id) >= 3 ? 'Limit Reached' : 'Resend Email' }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingFaculty = null">Close</button>
          <button class="ghost-btn edit-modal-btn" @click="openEditFromView">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Edit
          </button>
          <!-- Archive replaces delete — backend needs POST /secretary/faculty/{id}/archive -->
          <button class="danger-btn" @click="confirmArchive(viewingFaculty)">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M2 5h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5zM1 2h14v3H1V2zM6 8h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Archive Account
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="!saving && (showModal = false)">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingFaculty ? 'Edit Faculty Account' : 'Create Faculty Account' }}</h3>
          <button class="close-btn" @click="showModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group"><label>First Name</label><input v-model="form.first_name" type="text" placeholder="First name" :disabled="!!editingFaculty || saving" /></div>
            <div class="form-group"><label>Last Name</label><input v-model="form.last_name" type="text" placeholder="Last name" :disabled="!!editingFaculty || saving" /></div>
            <div class="form-group"><label>Middle Name (Optional)</label><input v-model="form.middle_name" type="text" placeholder="Middle name" :disabled="!!editingFaculty || saving" /></div>
            <div class="form-group"><label>Email Address</label><input v-model="form.email" type="email" placeholder="faculty@school.edu.ph" :disabled="!!editingFaculty || saving" /></div>
            <div class="form-group"><label>Department</label>
              <select v-model="form.department_id" :disabled="saving">
                <option value="">Select Department</option>
                <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.department_name }}</option>
              </select>
            </div>
            <div class="form-group"><label>Position</label>
              <select v-model="form.position" :disabled="saving">
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>
          </div>
          <div class="modal-notice" v-if="!editingFaculty">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            A password setup link will be sent to the faculty's email after account creation.
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showModal = false" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="saveFaculty" :disabled="saving">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Saving...' : editingFaculty ? 'Save Changes' : 'Create Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ARCHIVE CONFIRM MODAL -->
    <div v-if="showArchiveModal" class="modal-overlay" @click.self="showArchiveModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Archive Faculty Account</h3>
          <button class="close-btn" @click="showArchiveModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-msg">
            Are you sure you want to archive the account of
            <strong>{{ archivingFaculty?.first_name }} {{ archivingFaculty?.last_name }}</strong>?
            The account will be hidden but can be restored from the Archive menu.
          </p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showArchiveModal = false">Cancel</button>
          <button class="danger-btn" @click="archiveFaculty">Archive Account</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'

const search          = ref('')
const filterDept      = ref('')
const filterPosition  = ref('')   // FIX: position filter
const filterStatus    = ref('')
const showImport      = ref(false)
const showModal       = ref(false)
const showArchiveModal = ref(false)  // FIX: archive replaces delete modal
const saving          = ref(false)
const loading         = ref(false)
const loadingImport   = ref(false)
const editingFaculty  = ref(null)
const archivingFaculty = ref(null)  // FIX: archive
const viewingFaculty  = ref(null)   // FIX: view modal
const csvInput        = ref(null)

// FIX: Resend count tracker (frontend cap, max 3 per session)
const resendCounts = ref({})

const form = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  department_id: '',
  position: ''
})

const colors = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
const faculty = ref([])
const departments = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const [facultyRes, sectionsRes] = await Promise.all([
      axios.get('/faculty'),
      axios.get('/sections')
    ])

    faculty.value = facultyRes.data.map((f, idx) => ({
      ...f,
      color: colors[idx % colors.length],
      status: f.user?.status || 'pending',
      employee_id: f.employee_id || 'N/A',
      department_name: f.department?.department_name || 'N/A'
    }))

    const depts = new Set()
    sectionsRes.data.forEach(s => {
      if (s.department) depts.add(JSON.stringify(s.department))
    })
    departments.value = Array.from(depts).map(d => JSON.parse(d))

    if (departments.value.length === 0) {
      departments.value = [{ id: 1, department_name: 'College of Computing Studies' }]
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const miniStats = computed(() => [
  { label: 'Total Faculty',  value: faculty.value.length,                                         color: '#FF6B1A' },
  { label: 'Active',         value: faculty.value.filter(f => f.status === 'active').length,      color: '#16a34a' },
  { label: 'Pending Setup',  value: faculty.value.filter(f => f.status === 'pending').length,     color: '#f59e0b' },
  { label: 'CCS Dept',       value: faculty.value.filter(f => f.department_name.includes('Computing')).length, color: '#8b5cf6' }
])

// FIX: filteredFaculty now includes position filter
const filteredFaculty = computed(() => faculty.value.filter(f => {
  const fullName = `${f.first_name} ${f.last_name}`.toLowerCase()
  const matchSearch   = !search.value        || fullName.includes(search.value.toLowerCase()) || f.user?.email?.toLowerCase().includes(search.value.toLowerCase())
  const matchDept     = !filterDept.value    || f.department_id == filterDept.value
  const matchPosition = !filterPosition.value || f.position === filterPosition.value  // FIX
  const matchStatus   = !filterStatus.value  || f.status === filterStatus.value
  return matchSearch && matchDept && matchPosition && matchStatus
}))

// ─── View modal ───────────────────────────────────────────────────────────────
// FIX: opens read-only view modal on row click
const viewFaculty = (f) => {
  viewingFaculty.value = f
}

const openEditFromView = () => {
  openEditModal(viewingFaculty.value)
  viewingFaculty.value = null
}

// ─── Resend helpers ───────────────────────────────────────────────────────────
// FIX: max 3 resends per faculty per session
const getResendCount  = (id) => resendCounts.value[id] || 0
const incrementResend = (id) => { resendCounts.value[id] = (resendCounts.value[id] || 0) + 1 }

// ─── Create / Edit ────────────────────────────────────────────────────────────
const openCreateModal = () => {
  editingFaculty.value = null
  form.value = {
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    department_id: departments.value[0]?.id || '',
    position: 'Instructor'
  }
  showModal.value = true
}

const openEditModal = (f) => {
  editingFaculty.value = f
  form.value = {
    first_name:    f.first_name,
    last_name:     f.last_name,
    middle_name:   f.middle_name,
    email:         f.user?.email,
    department_id: f.department_id,
    position:      f.position
  }
  showModal.value = true
}

const saveFaculty = async () => {
  if (!form.value.first_name || !form.value.last_name || !form.value.email) {
    alert('Please fill in all required fields.')
    return
  }
  saving.value = true
  try {
    if (editingFaculty.value) {
      await axios.put(`/secretary/faculty/${editingFaculty.value.id}`, {
        department_id: form.value.department_id,
        position:      form.value.position
      })
      showModal.value = false
      await nextTick()
      alert('Faculty account updated successfully.')
      fetchData()
    } else {
      const response = await axios.post('/secretary/faculty', form.value)
      faculty.value.push({
        ...response.data.faculty,
        color:           colors[faculty.value.length % colors.length],
        status:          'pending',
        department_name: departments.value.find(d => d.id == form.value.department_id)?.department_name || 'N/A'
      })
      showModal.value = false
      await nextTick()
      alert('Faculty account created successfully. Setup email sent.')
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save faculty.')
  } finally {
    saving.value = false
  }
}

// ─── Archive (replaces delete) ────────────────────────────────────────────────
// FIX: archive instead of hard delete
const confirmArchive = (f) => {
  archivingFaculty.value = f
  showArchiveModal.value = true
}

const archiveFaculty = async () => {
  try {
    // Backend needs: POST /secretary/faculty/{id}/archive
    await axios.post(`/secretary/faculty/${archivingFaculty.value.id}/archive`)
    faculty.value = faculty.value.filter(f => f.id !== archivingFaculty.value.id)
    showArchiveModal.value = false
    viewingFaculty.value   = null
    alert('Faculty account archived successfully.')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to archive faculty.')
  }
}

// ─── Resend setup email ───────────────────────────────────────────────────────
// FIX: capped at 3 per faculty per session
const resendSetup = async (f) => {
  if (getResendCount(f.id) >= 3) return
  try {
    await axios.post(`/secretary/faculty/${f.id}/resend-setup`)
    incrementResend(f.id)
    alert(`Setup email resent to ${f.user?.email}. (${getResendCount(f.id)}/3 resends used)`)
  } catch (err) {
    alert('Failed to resend setup email.')
  }
}

// ─── CSV Import ───────────────────────────────────────────────────────────────
const handleCSV = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  loadingImport.value = true
  try {
    const response = await axios.post('/secretary/faculty/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    alert(response.data.message)
    if (response.data.errors?.length > 0) console.error('Import errors:', response.data.errors)
    fetchData()
    showImport.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to import CSV.')
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
.edit-modal-btn { color: #3b82f6; border-color: #bfdbfe; }
.edit-modal-btn:hover { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }
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
.drop-zone { border: 2px dashed #f0e8e0; border-radius: 14px; padding: 36px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.drop-zone:hover { border-color: #FF6B1A; background: #fffaf8; }
.drop-zone svg { width: 40px; height: 40px; color: #c0b0a5; }
.drop-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.drop-sub { font-size: 12px; color: #b89f90; }
.import-template { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a8070; background: #faf8f6; padding: 10px 14px; border-radius: 9px; }
.import-template svg { width: 14px; height: 14px; color: #FF6B1A; flex-shrink: 0; }

/* ── Mini Stats ── */
.mini-stats { display: flex; gap: 14px; flex-wrap: wrap; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 120px; }
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
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }

/* FIX: Clickable row styles */
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
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.action-btns { display: flex; gap: 6px; }
.action-btn { width: 30px; height: 30px; border: 1.5px solid #f0e8e0; border-radius: 7px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
.action-btn svg { width: 13px; height: 13px; }
.action-btn.edit { color: #3b82f6; } .action-btn.edit:hover { background: #eff6ff; border-color: #3b82f6; }
.action-btn.view { color: #FF6B1A; } .action-btn.view:hover { background: #fff5ef; border-color: #FF6B1A; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-lg { max-width: 620px; }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-faculty-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-faculty-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; flex-wrap: wrap; }

/* ── View modal detail grid ── */
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-section { background: #faf8f6; border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.detail-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #9a8070; padding: 12px 16px 8px; border-bottom: 1px solid #f0e8e0; background: #f5f1ed; }
.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }

/* FIX: Resend row (same as StudentAccounts) */
.resend-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; }
.resend-info { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #92400e; }
.resend-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid #fde68a; color: #92400e; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.resend-btn:hover:not(:disabled) { background: #fef3c7; border-color: #f59e0b; }
.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f5f1ed; border-color: #e5e0da; color: #a89080; }

/* ── Create/Edit form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; margin-top: 16px; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
.delete-msg { font-size: 14px; color: #4a3020; line-height: 1.6; }

/* ── Spinners ── */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-lg { width: 40px; height: 40px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 12px; color: #b89f90; }
.drop-zone.disabled { opacity: 0.6; cursor: not-allowed; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .header-actions { width: 100%; }
  .primary-btn, .ghost-btn { flex: 1; justify-content: center; }
  .mini-stats { flex-wrap: wrap; }
  .mini-stat { min-width: calc(50% - 7px); }
  .table-toolbar { flex-direction: column; align-items: stretch; }
  .filter-group { width: 100%; }
  .filter-group select { flex: 1; min-width: 0; }
  .detail-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer button { width: 100%; justify-content: center; }
}

@media (max-width: 480px) {
  .mini-stat { min-width: 100%; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>