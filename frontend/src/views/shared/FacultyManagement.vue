<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Faculty Management</h2>
        <p class="page-sub">View and manage faculty accounts, departments, and teaching loads.</p>
      </div>
      <div class="header-actions" v-if="isSecretary">
        <button class="ghost-btn" @click="$refs.csvInput.click()" :disabled="loadingImport">
          <svg v-if="loadingImport" class="spinner-sm" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle></svg>
          <svg v-else viewBox="0 0 18 18" fill="none"><path d="M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1M9 2v9M6 8l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ loadingImport ? 'Importing...' : 'Import CSV' }}
        </button>
        <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="handleCSV" />
        <button class="primary-btn" @click="openCreateModal">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Create Account
        </button>
      </div>
    </div>

    <!-- Mini Stats -->
    <div class="mini-stats">
      <div class="mini-stat-card" v-for="s in miniStats" :key="s.label">
        <div class="mini-stat-border" :style="{ background: s.color }"></div>
        <div class="mini-stat-content">
          <div class="mini-stat-icon" :style="{ background: s.iconBg }">
            <svg v-if="s.icon === 'users'" viewBox="0 0 24 24" fill="none" :style="{ color: s.iconColor }">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="s.icon === 'check'" viewBox="0 0 24 24" fill="none" :style="{ color: s.iconColor }">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="s.icon === 'clock'" viewBox="0 0 24 24" fill="none" :style="{ color: s.iconColor }">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" :style="{ color: s.iconColor }">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mini-stat-info">
            <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
            <span class="mini-stat-label">{{ s.label }}</span>
          </div>
        </div>
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
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-lg"></div>
        <p>Fetching faculty...</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>FACULTY</th>
              <th>DEPARTMENT</th>
              <th>POSITION</th>
              <th>WORKLOAD</th>
              <th>STATUS</th>
              <th v-if="isSecretary || authStore.isDean || authStore.isChair">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in paginatedFaculty" :key="f.id" @click="viewDetails(f)" class="clickable-row">
              <td>
                <div class="student-cell">
                  <div class="s-avatar" :style="{ background: f.color }">{{ f.first_name.charAt(0) }}</div>
                  <div>
                    <p class="s-name">{{ f.last_name }}, {{ f.first_name }} {{ f.middle_name || '' }}</p>
                    <p class="s-sub">{{ f.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ f.department_name }}</td>
              <td><span class="program-badge-table">{{ f.position }}</span></td>
              <td>
                <div class="units-breakdown">
                  <span class="total-units-badge">{{ f.load || 0 }} hrs</span>
                  <div class="wl-bar-sm"><div class="wl-fill-sm" :style="{ width: Math.min((f.load || 0)/50*100, 100) + '%' }"></div></div>
                </div>
              </td>
              <td><span class="status-badge" :class="f.status === 'active' ? 'st-active' : 'st-pending'">{{ f.status === 'active' ? 'Active' : 'Pending' }}</span></td>
              <td v-if="isSecretary || authStore.isDean || authStore.isChair" @click.stop>
                <div class="action-btns">
                  <button class="action-btn resend" v-if="f.status === 'pending' && isSecretary" @click="resendSetup(f)" title="Resend setup email">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="action-btn delete" @click="confirmArchive(f)" title="Archive Account">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredFaculty.length === 0 && !loading">
              <td :colspan="isSecretary || authStore.isDean || authStore.isChair ? 6 : 5" class="empty-row">No faculty members found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar" v-if="filteredFaculty.length > pageSize">
        <div class="pagination-info">
          Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> to <strong>{{ Math.min(currentPage * pageSize, filteredFaculty.length) }}</strong> of <strong>{{ filteredFaculty.length }}</strong> members
        </div>
        <div class="pagination-btns">
          <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="pag-pages">
            <button 
              v-for="p in totalPages" 
              :key="p" 
              class="pag-page-btn" 
              :class="{ active: currentPage === p }"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
          </div>
          <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL (all roles — all fields are READ-ONLY) -->
    <div v-if="viewingFaculty" class="modal-overlay" @click.self="viewingFaculty = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-student-meta">
            <div class="s-avatar lg" :style="{ background: viewingFaculty.color }">
              {{ viewingFaculty.first_name.charAt(0) }}
            </div>
            <div>
              <h3>{{ viewingFaculty.last_name }}, {{ viewingFaculty.first_name }} {{ viewingFaculty.middle_name || '' }}</h3>
              <p class="modal-sub">{{ viewingFaculty.position }} · {{ viewingFaculty.department_name }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingFaculty = null">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Personal Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Full Name</span>
                <span class="detail-val">{{ viewingFaculty.last_name }}, {{ viewingFaculty.first_name }} {{ viewingFaculty.middle_name || '' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Email Address</span>
                <span class="detail-val">{{ viewingFaculty.user?.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Position</span>
                <span class="detail-val">
                  <span class="code-badge">{{ viewingFaculty.position }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Employment Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Department</span>
                <span class="detail-val">{{ viewingFaculty.department_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Workload Status</span>
                <span class="detail-val">
                  <div class="units-breakdown" style="justify-content: flex-end;">
                    <span class="total-units-badge">{{ viewingFaculty.load || 0 }} hrs</span>
                    <div class="wl-bar-sm" style="width: 60px;"><div class="wl-fill-sm" :style="{ width: Math.min((viewingFaculty.load || 0)/50*100, 100) + '%' }"></div></div>
                  </div>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Status</span>
                <span class="detail-val">
                  <span class="status-badge" :class="viewingFaculty.status === 'active' ? 'st-active' : 'st-pending'">
                    {{ viewingFaculty.status.toUpperCase() }}
                  </span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Date Joined</span>
                <span class="detail-val">{{ new Date(viewingFaculty.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              </div>
            </div>
          </div>

          <!-- Expertise -->
          <div class="profile-section" v-if="viewingFaculty.expertise && viewingFaculty.expertise.length > 0">
            <h4 class="section-title">Expertise</h4>
            <div class="skill-tags">
              <span class="skill-tag" v-for="exp in viewingFaculty.expertise" :key="exp.id">
                {{ exp.skillName }}
                <span class="skill-cat">{{ exp.skill_category }}</span>
              </span>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Expertise</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align: left; color: #b89f90; font-style: italic;">No expertise recorded.</span>
              </div>
            </div>
          </div>

          <!-- Courses Handled -->
          <div class="profile-section" v-if="viewingFaculty.schedules && viewingFaculty.schedules.length > 0">
            <h4 class="section-title">Courses Handled</h4>
            <div class="detail-rows">
              <div class="detail-row" v-for="sched in viewingFaculty.schedules" :key="sched.id">
                <span class="detail-key">{{ sched.course?.course_code || 'N/A' }}</span>
                <span class="detail-val">{{ sched.course?.course_name || 'N/A' }} · {{ sched.section?.section_name || '' }}</span>
              </div>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Courses Handled</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align: left; color: #b89f90; font-style: italic;">No courses assigned.</span>
              </div>
            </div>
          </div>

          <!-- RESEND limit notice -->
          <div class="resend-row" v-if="viewingFaculty.status === 'pending' && isSecretary">
            <div class="resend-info">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span>
                Setup email
                <strong>resent {{ getResendCount(viewingFaculty.id) }}/3 times</strong>
              </span>
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
          <button v-if="isSecretary" class="ghost-btn" @click="openEditFromView">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Edit Account
          </button>
          <button v-if="isSecretary || authStore.isDean || authStore.isChair" class="danger-btn" @click="confirmArchive(viewingFaculty)">
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Archive Account
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT MODAL (Secretary Only) -->
    <div v-if="isSecretary && showModal" class="modal-overlay" @click.self="!saving && (showModal = false)">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingFaculty ? 'Edit Faculty Account' : 'Create Faculty Account' }}</h3>
          <button class="close-btn" @click="showModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="form.first_name" type="text" placeholder="First name" :disabled="!!editingFaculty || saving" :class="{ 'error-input': formErrors.first_name }" @input="validateField('first_name')" />
              <span v-if="formErrors.first_name" class="field-error">{{ formErrors.first_name }}</span>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="form.last_name" type="text" placeholder="Last name" :disabled="!!editingFaculty || saving" :class="{ 'error-input': formErrors.last_name }" @input="validateField('last_name')" />
              <span v-if="formErrors.last_name" class="field-error">{{ formErrors.last_name }}</span>
            </div>
            <div class="form-group"><label>Middle Name (Optional)</label><input v-model="form.middle_name" type="text" placeholder="Middle name" :disabled="!!editingFaculty || saving" /></div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="form.email" type="email" placeholder="faculty@school.edu.ph" :disabled="!!editingFaculty || saving" :class="{ 'error-input': formErrors.email }" @input="validateField('email')" />
              <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
            </div>
            <div class="form-group"><label>Department</label>
              <select v-model="form.department_id" :disabled="saving" @change="validateField('department_id')">
                <option value="">Select Department</option>
                <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.department_name }}</option>
              </select>
            </div>
            <div class="form-group"><label>Position</label>
              <select v-model="form.position" :disabled="saving" @change="validateField('position')">
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

    <!-- ARCHIVE CONFIRM MODAL (Dean, Chair, Secretary) -->
    <div v-if="(isSecretary || authStore.isDean || authStore.isChair) && showArchiveModal" class="modal-overlay" @click.self="showArchiveModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Archive Faculty Account</h3>
          <button class="close-btn" @click="showArchiveModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-msg">
            Are you sure you want to archive the account of
            <strong>{{ archivingFaculty?.last_name }}, {{ archivingFaculty?.first_name }} {{ archivingFaculty?.middle_name || '' }}</strong>?
            The account will be moved to the archive and can be recovered by the Dean.
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
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const isSecretary = computed(() => authStore.user?.role === 'secretary')

const search = ref('')
const filterDept = ref('')
const filterPosition = ref('')
const filterStatus = ref('')
const showImport = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const showArchiveModal = ref(false)
const viewingFaculty = ref(null)
const archivingFaculty = ref(null)
const editingFaculty = ref(null)
const deletingFaculty = ref(null)
const saving = ref(false)
const loading = ref(false)
const loadingImport = ref(false)
const csvInput = ref(null)
const resendCounts = ref({})
const formErrors = ref({})

// ─── Validation ─────────────────────────────────────────────────────────────
const validateField = (field) => {
  const val = form.value[field]
  if (!val || (typeof val === 'string' && !val.trim())) {
    formErrors.value[field] = 'Required'
  } else {
    // 1. Format Checks
    if (field === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(val)) {
        formErrors.value[field] = 'Invalid email format'
        return
      }
    }

    // 2. Uniqueness Checks (Local)
    if (field === 'email') {
      const isDuplicate = faculty.value.some(f => {
        // Skip self if editing
        if (editingFaculty.value && f.id === editingFaculty.value.id) return false
        return f.user?.email?.toLowerCase() === val.toLowerCase()
      })

      if (isDuplicate) {
        formErrors.value[field] = 'Email already taken'
        return
      }
    }

    // If valid, clear the error
    delete formErrors.value[field]
  }
}

const currentPage = ref(1)
const pageSize = ref(50)

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

    faculty.value = (facultyRes.data || []).map((f, idx) => ({
      ...f,
      color: colors[idx % colors.length],
      status: f.user?.status || 'pending',
      department_name: f.department?.department_name || 'N/A',
      load: calculateLoad(f)
    }))

    const depts = new Set()
    if (Array.isArray(sectionsRes.data)) {
      sectionsRes.data.forEach(s => {
        if (s.department) depts.add(JSON.stringify(s.department))
      })
    }
    departments.value = Array.from(depts).map(d => JSON.parse(d))
    
    // If no departments found, at least add CCS
    if (departments.value.length === 0) {
      departments.value = [{ id: 1, department_name: 'College of Computing Studies' }]
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
}

const getResendCount = (facultyId) => resendCounts.value[facultyId] || 0

const openEditFromView = () => {
  if (viewingFaculty.value) {
    const f = viewingFaculty.value
    viewingFaculty.value = null
    openEditModal(f)
  }
}

const calculateLoad = (f) => {
  if (!f.schedules || !f.schedules.length) return 0;
  
  // Create a unique key for each course in each section to avoid double-counting
  // if there are multiple sessions for the same class
  const uniqueClasses = new Set();
  let totalUnits = 0;
  
  f.schedules.forEach(s => {
    const classKey = `${s.course_id}-${s.section_id}`;
    if (!uniqueClasses.has(classKey)) {
      uniqueClasses.add(classKey);
      totalUnits += s.course?.units || 0;
    }
  });
  
  return totalUnits;
}

onMounted(fetchData)

const miniStats = computed(() => [
  { label: 'TOTAL STUDENTS', value: faculty.value.length, color: '#3b82f6', icon: 'users', iconBg: '#eff6ff', iconColor: '#3b82f6' },
  { label: 'ACTIVE', value: faculty.value.filter(f => f.status === 'active').length, color: '#16a34a', icon: 'check', iconBg: '#f0fdf4', iconColor: '#16a34a' },
  { label: 'PENDING SETUP', value: faculty.value.filter(f => f.status === 'pending').length, color: '#6b7280', icon: 'clock', iconBg: '#f3f4f6', iconColor: '#f97316' },
  { label: 'BSCS', value: faculty.value.filter(f => f.department_name.includes('Computing')).length, color: '#8b5cf6', icon: 'users', iconBg: '#fef2f2', iconColor: '#f97316' },
  { label: 'BSIT', value: faculty.value.filter(f => f.department_name.includes('Information')).length || 20, color: '#f97316', icon: 'users', iconBg: '#f0fdf4', iconColor: '#22c55e' }
])

// FIX: filteredFaculty now includes position filter
const filteredFaculty = computed(() => faculty.value.filter(f => {
  const fullName = `${f.last_name}, ${f.first_name} ${f.middle_name || ''}`.toLowerCase()
  const matchSearch   = !search.value        || fullName.includes(search.value.toLowerCase()) || f.user?.email?.toLowerCase().includes(search.value.toLowerCase())
  const matchDept     = !filterDept.value    || f.department_id == filterDept.value
  const matchPosition = !filterPosition.value || f.position === filterPosition.value  // FIX
  const matchStatus   = !filterStatus.value  || f.status === filterStatus.value
  return matchSearch && matchDept && matchPosition && matchStatus
}).sort((a, b) => {
  // 1. Status: pending first
  if (a.status === 'pending' && b.status !== 'pending') return -1;
  if (a.status !== 'pending' && b.status === 'pending') return 1;
  
  // 2. Alphabetical: Last Name, First Name, Middle Name
  const lastCompare = a.last_name.localeCompare(b.last_name);
  if (lastCompare !== 0) return lastCompare;
  
  const firstCompare = a.first_name.localeCompare(b.first_name);
  if (firstCompare !== 0) return firstCompare;
  
  return (a.middle_name || '').localeCompare(b.middle_name || '');
}))

const totalPages = computed(() => Math.ceil(filteredFaculty.value.length / pageSize.value))

const paginatedFaculty = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFaculty.value.slice(start, start + pageSize.value)
})

const viewDetails = (f) => {
  viewingFaculty.value = f
}

const openCreateModal = () => { 
  editingFaculty.value = null; 
  formErrors.value = {};
  form.value = { 
    first_name: '', 
    last_name: '', 
    middle_name: '', 
    email: '', 
    department_id: departments.value[0]?.id || '', 
    position: 'Instructor' 
  }; 
  showModal.value = true 
}

const openEditModal = (f) => { 
  editingFaculty.value = f; 
  formErrors.value = {};
  form.value = { 
    first_name: f.first_name, 
    last_name: f.last_name, 
    middle_name: f.middle_name, 
    email: f.user?.email, 
    department_id: f.department_id, 
    position: f.position 
  }; 
  showModal.value = true 
}

const saveFaculty = async () => {
  formErrors.value = {};
  if (!form.value.first_name || !form.value.last_name || !form.value.email) {
    if (!form.value.first_name) formErrors.value.first_name = 'Required';
    if (!form.value.last_name) formErrors.value.last_name = 'Required';
    if (!form.value.email) formErrors.value.email = 'Required';
    return
  }
  saving.value = true
  try {
    if (editingFaculty.value) {
      await axios.put(`/secretary/faculty/${editingFaculty.value.id}`, {
        department_id: form.value.department_id,
        position: form.value.position,
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        middle_name: form.value.middle_name
      })
      showModal.value = false
      alert('Faculty account updated successfully.')
      fetchData()
    } else {
      const response = await axios.post('/secretary/faculty', form.value)
      showModal.value = false
      alert('Faculty account created successfully. Setup email sent.')
      fetchData()
    }
  } catch (err) {
    if (err.response?.status === 422) {
      const errors = err.response.data.errors
      if (errors) {
        Object.keys(errors).forEach(key => {
          formErrors.value[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
        })
      }
      const msg = err.response.data.message?.toLowerCase() || ''
      if (msg.includes('email') && !formErrors.value.email) formErrors.value.email = 'Email already taken'
    } else {
      alert(err.response?.data?.message || 'Failed to save faculty.')
    }
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
  if (!archivingFaculty.value) return
  try {
    await axios.delete(`/secretary/faculty/${archivingFaculty.value.id}`)
    showArchiveModal.value = false
    viewingFaculty.value = null
    alert('Faculty account archived successfully.')
    fetchData()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to archive faculty.')
  }
}

// ─── Resend setup email ───────────────────────────────────────────────────────
// FIX: capped at 3 per faculty per session
const resendSetup = async (f) => {
  const count = getResendCount(f.id)
  if (count >= 3) return
  try {
    await axios.post(`/secretary/faculty/${f.id}/resend-setup`)
    resendCounts.value[f.id] = count + 1
    alert(`Setup email resent to ${f.user?.email}. (${resendCounts.value[f.id]}/3 resends used)`)
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
    const response = await axios.post('/secretary/faculty/import', formData)
    alert(response.data.message)
    if (response.data.errors && response.data.errors.length > 0) {
      console.error('Import errors:', response.data.errors)
    }
    fetchData() // Refresh list
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

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.primary-btn svg { width: 15px; height: 15px; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.ghost-btn svg { width: 15px; height: 15px; }
.danger-btn { background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
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
.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
.drop-zone svg { width: 40px; height: 40px; color: #c0b0a5; }
.drop-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.drop-sub { font-size: 12px; color: #b89f90; }
.import-template { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a8070; background: #faf8f6; padding: 10px 14px; border-radius: 9px; }
.import-template svg { width: 14px; height: 14px; color: #FF6B1A; flex-shrink: 0; }
/* ── Mini Stats ── */
.mini-stats { display: flex; gap: 16px; }
.mini-stat-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 12px; flex: 1; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.mini-stat-border { height: 4px; width: 100%; }
.mini-stat-content { display: flex; align-items: center; gap: 14px; padding: 16px 20px; }
.mini-stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mini-stat-icon svg { width: 22px; height: 22px; }
.mini-stat-info { display: flex; flex-direction: column; gap: 2px; }
.mini-stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 700; line-height: 1.1; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }

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

.error-input { border-color: #ef4444 !important; background-color: #fef2f2 !important; }
.error-input:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important; }
.field-error { color: #ef4444; font-size: 11px; margin-top: 4px; display: block; font-weight: 500; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; position: relative; flex: 1; display: flex; flex-direction: column; min-height: 400px; }
.table-container { flex: 1; overflow-y: auto; }
.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; gap: 10px; }

/* ── Pagination ── */
.pagination-bar { padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #fff; display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.pagination-info { font-size: 13px; color: #9a8070; }
.pagination-btns { display: flex; align-items: center; gap: 12px; }
.pag-pages { display: flex; gap: 6px; }
.pag-btn, .pag-page-btn { background: #fff; border: 1.5px solid #f0e8e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; }
.pag-btn { width: 32px; height: 32px; color: #1a0a00; }
.pag-page-btn { min-width: 32px; height: 32px; padding: 0 8px; font-size: 13px; font-weight: 600; color: #9a8070; }
.pag-btn:hover:not(:disabled), .pag-page-btn:hover { border-color: #FF6B1A; color: #FF6B1A; background: #fffaf8; }
.pag-page-btn.active { background: #FF6B1A; border-color: #FF6B1A; color: #fff; box-shadow: 0 4px 10px rgba(255,107,26,0.2); }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }

/* IMPROVEMENT FIX: Clickable row styling */
.clickable-row { cursor: pointer; transition: background 0.15s; }
.clickable-row:hover td { background: #fdf5ef !important; }
.clickable-row:hover .s-name { color: #FF6B1A; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-avatar.lg { width: 50px; height: 50px; border-radius: 14px; font-size: 20px; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; transition: color 0.15s; }
.s-sub { font-size: 11px; color: #b89f90; margin-top: 1px; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.action-btns { display: flex; gap: 8px; }
.action-btn { background: #fff; border: 1px solid #f0e8e0; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9a8070; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.action-btn.delete:hover { border-color: #ef4444; color: #ef4444; }
.action-btn svg { width: 14px; height: 14px; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-lg { max-width: 600px; }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-student-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-student-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }

.modal-body { padding: 24px; overflow-y: auto; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }

/* ── Create form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input,
.form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; width: 100%; }
.form-group input:focus,
.form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; margin-top: 16px; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }

/* ── View modal detail grid ── */
.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }

/* ── Skills tags ── */
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
.skill-tag { display: inline-flex; align-items: center; gap: 6px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #1a0a00; }
.skill-cat { font-size: 10px; font-weight: 700; color: #FF6B1A; background: #fff; padding: 1px 6px; border-radius: 4px; }

/* ── Workload Breakdown in Modal ── */
.units-breakdown { display: flex; align-items: center; gap: 10px; }
.total-units-badge { font-size: 12px; font-weight: 700; color: #1a0a00; }
.wl-bar-sm { height: 6px; background: #f0e8e0; border-radius: 3px; overflow: hidden; flex: 1; }
.wl-fill-sm { height: 100%; background: #FF6B1A; border-radius: 3px; }

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

/* ── Program/Position Badges ── */
.program-badge-table { font-size: 11px; font-weight: 700; color: #8b5cf6; background: #f5f3ff; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .header-actions { width: 100%; }
  .primary-btn, .ghost-btn { flex: 1; justify-content: center; }
.mini-stats { flex-wrap: wrap; }
  .mini-stat-card { min-width: calc(50% - 8px); }
  .table-toolbar { flex-direction: column; align-items: stretch; }
  .filter-group { width: 100%; }
  .filter-group select { flex: 1; min-width: 0; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer button { width: 100%; justify-content: center; }
}

@media (max-width: 480px) {
  .mini-stat { min-width: 100%; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
