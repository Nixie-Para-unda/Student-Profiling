<template>
  <div class="violations-page">

    <!-- ── ANALYTICS STRIP ── -->
    <div class="analytics-strip">
      <div class="stat-card">
        <div class="stat-icon icon-orange">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <div class="stat-num">{{ counts.major }}</div>
          <div class="stat-label">Major Cases</div>
        </div>
        <div class="stat-trend" :class="trend.major >= 0 ? 'up' : 'down'">
          {{ trend.major >= 0 ? '▲' : '▼' }} {{ Math.abs(trend.major) }} this week
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-black">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <div class="stat-num">{{ counts.moderate }}</div>
          <div class="stat-label">Moderate Cases</div>
        </div>
        <div class="stat-trend neutral">— stable</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div class="stat-num">{{ counts.resolved }}</div>
          <div class="stat-label">Resolved</div>
        </div>
        <div class="stat-trend down">▲ {{ resolvedRate }}% rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-review">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div class="stat-num">{{ counts.underReview }}</div>
          <div class="stat-label">Under Review</div>
        </div>
        <div class="stat-trend up">Needs attention</div>
      </div>
    </div>

    <!-- ── PAGE HEADER ── -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Student Violations</h2>
        <p class="section-desc">Monitor and review all disciplinary cases in the department.</p>
      </div>
      <div class="header-actions">
        <!-- VIEW TOGGLE -->
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" title="Table view">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>
          </button>
          <button :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'" title="Card view">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
        </div>
        <!-- EXPORT -->
        <button class="export-btn" @click="exportCSV">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
        <button class="add-btn" @click="openAddModal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Violation
        </button>
      </div>
    </div>

    <!-- ── TOOLBAR ── -->
    <div class="toolbar">
      <div class="search-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input v-model="searchQuery" placeholder="Search by name or student ID..." />
        <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
      </div>
      <select v-model="severityFilter">
        <option value="">All Severity</option>
        <option>Major</option>
        <option>Moderate</option>
        <option>Minor</option>
      </select>
      <select v-model="statusFilter">
        <option value="">All Status</option>
        <option>Under Review</option>
        <option>Warned</option>
        <option>Resolved</option>
      </select>
      <select v-model="sortBy">
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="name-asc">Name A–Z</option>
        <option value="severity">By Severity</option>
      </select>
    </div>

    <!-- ── BULK ACTION BAR ── -->
    <transition name="slide-down">
      <div class="bulk-bar" v-if="selectedIds.length > 0">
        <span class="bulk-count">{{ selectedIds.length }} selected</span>
        <div class="bulk-actions">
          <button class="bulk-btn" @click="bulkWarn">Mark Warned</button>
          <button class="bulk-btn" @click="bulkResolve">Mark Resolved</button>
          <button class="bulk-btn danger" @click="bulkDelete">Delete Selected</button>
          <button class="bulk-btn ghost" @click="selectedIds = []">Clear</button>
        </div>
      </div>
    </transition>

    <!-- ── TABLE VIEW ── -->
    <div class="table-card" v-if="viewMode === 'table'">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading violations...</p>
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-check">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th>Student</th>
            <th>Violation Type</th>
            <th>Severity</th>
            <th>Date Filed</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedCases.length === 0">
            <td colspan="7">
              <div class="empty-state">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                <p>No violations match your filters.</p>
                <button class="clear-filters-btn" @click="clearFilters">Clear Filters</button>
              </div>
            </td>
          </tr>
          <tr
            v-for="(v, i) in paginatedCases"
            :key="v.studentId + i"
            :class="{ selected: selectedIds.includes(v._uid) }"
            :style="{ animationDelay: `${i * 0.04}s` }"
          >
            <td class="col-check">
              <input type="checkbox" :checked="selectedIds.includes(v._uid)" @change="toggleSelect(v._uid)" />
            </td>
            <td>
              <div class="student-cell">
                <div class="avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
                <div>
                  <div class="student-name">{{ v.name }}</div>
                  <div class="student-id">{{ v.studentId }}</div>
                </div>
              </div>
            </td>
            <td>{{ v.type }}</td>
            <td><span class="badge" :class="sevClass(v.severity)">{{ v.severity }}</span></td>
            <td>{{ v.date }}</td>
            <td><span class="badge" :class="stClass(v.status)">{{ v.status }}</span></td>
            <td>
              <div class="row-actions">
                <button class="btn-review" @click="openReview(v)">Review</button>
                <button class="btn-icon" title="Edit" @click="openEdit(v)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-icon danger" title="Delete" @click="deleteCase(v)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="pagination" v-if="!loading && filteredCases.length > 0">
        <span class="pg-info">Showing {{ paginationStart }}–{{ paginationEnd }} of {{ filteredCases.length }} record{{ filteredCases.length !== 1 ? 's' : '' }}</span>
        <div class="pg-btns">
          <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
          <button
            v-for="p in totalPages" :key="p"
            class="pg-btn" :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
        </div>
      </div>
    </div>

    <!-- ── CARD VIEW ── -->
    <div class="card-grid" v-else-if="viewMode === 'card' && !loading">
      <div v-if="paginatedCases.length === 0" class="empty-state" style="grid-column:1/-1; background:#fff; border-radius:14px; border:1.5px solid #e8e6e1;">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        <p>No violations match your filters.</p>
      </div>
      <div
        class="vcard"
        v-for="(v, i) in paginatedCases"
        :key="v.studentId + i"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <div class="vcard-top">
          <div class="student-cell">
            <div class="avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
            <div>
              <div class="student-name">{{ v.name }}</div>
              <div class="student-id">{{ v.studentId }}</div>
            </div>
          </div>
          <span class="badge" :class="sevClass(v.severity)">{{ v.severity }}</span>
        </div>
        <div class="vcard-type">{{ v.type }}</div>
        <div class="vcard-meta">
          <span>{{ v.date }}</span>
          <span class="badge" :class="stClass(v.status)">{{ v.status }}</span>
        </div>
        <div class="vcard-actions">
          <button class="btn-review" style="flex:1" @click="openReview(v)">Review</button>
          <button class="btn-icon" @click="openEdit(v)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon danger" @click="deleteCase(v)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      <!-- card pagination -->
      <div class="pagination" style="grid-column:1/-1; background:#fff; border-radius:14px; border:1.5px solid #e8e6e1;" v-if="filteredCases.length > 0">
        <span class="pg-info">Showing {{ paginationStart }}–{{ paginationEnd }} of {{ filteredCases.length }} records</span>
        <div class="pg-btns">
          <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
          <button v-for="p in totalPages" :key="p" class="pg-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
        </div>
      </div>
    </div>

    <!-- ── REVIEW MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" :class="{ open: showReviewModal }" @click.self="showReviewModal = false">
        <div class="modal modal-wide" v-if="activeCase">
          <div class="modal-header">
            <h3>Case Review</h3>
            <button class="modal-close" @click="showReviewModal = false">✕</button>
          </div>

          <!-- Student info bar -->
          <div class="modal-student-info">
            <div class="modal-avatar" :style="{ background: activeCase.color }">{{ activeCase.name.charAt(0) }}</div>
            <div style="flex:1">
              <div class="modal-student-name">{{ activeCase.name }}</div>
              <div class="modal-student-id">{{ activeCase.studentId }}</div>
            </div>
            <span class="badge" :class="stClass(activeCase.status)">{{ activeCase.status }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-item"><label>Violation</label><span>{{ activeCase.type }}</span></div>
            <div class="detail-item"><label>Severity</label><span class="badge" :class="sevClass(activeCase.severity)">{{ activeCase.severity }}</span></div>
            <div class="detail-item"><label>Date Filed</label><span>{{ activeCase.date }}</span></div>
            <div class="detail-item"><label>Case ID</label><span style="font-family:monospace;font-size:12px;">{{ activeCase._uid }}</span></div>
          </div>

          <div class="modal-notes">
            <label>Incident Notes</label>
            <p>{{ activeCase.notes || 'No notes available.' }}</p>
          </div>

          <!-- Timeline -->
          <div class="timeline-section">
            <label>Activity Timeline</label>
            <div class="timeline">
              <div class="tl-item" v-for="(evt, idx) in (activeCase.timeline || defaultTimeline(activeCase))" :key="idx">
                <div class="tl-dot" :class="evt.type"></div>
                <div class="tl-content">
                  <div class="tl-title">{{ evt.label }}</div>
                  <div class="tl-date">{{ evt.date }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="showReviewModal = false">Close</button>
            <button class="btn-warn" @click="markWarned" :disabled="activeCase.status === 'Warned'">Mark as Warned</button>
            <button class="btn-resolve" @click="markResolved" :disabled="activeCase.status === 'Resolved'">Resolve Case</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── EDIT MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" :class="{ open: showEditModal }" @click.self="showEditModal = false">
        <div class="modal" v-if="editTarget">
          <div class="modal-header">
            <h3>Edit Violation</h3>
            <button class="modal-close" @click="showEditModal = false">✕</button>
          </div>
          <div class="form-group">
            <label>Violation Type</label>
            <select v-model="editTarget.type">
              <option>Academic Dishonesty</option>
              <option>Misconduct</option>
              <option>Dress Code Violation</option>
              <option>Tardiness</option>
              <option>Property Damage</option>
              <option>Harassment</option>
              <option>Unauthorized Absence</option>
            </select>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Severity</label>
              <select v-model="editTarget.severity">
                <option>Major</option>
                <option>Moderate</option>
                <option>Minor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="editTarget.status">
                <option>Under Review</option>
                <option>Warned</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Incident Notes</label>
            <textarea v-model="editTarget.notes" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showEditModal = false">Cancel</button>
            <button class="btn-resolve" @click="saveEdit">Save Changes</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── ADD MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" :class="{ open: showAddModal }" @click.self="showAddModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>File New Violation</h3>
            <button class="modal-close" @click="showAddModal = false">✕</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>First Name <span class="req">*</span></label>
              <input v-model="form.firstName" placeholder="Juan" :class="{ error: formErrors.firstName }" @input="formErrors.firstName = false" />
              <span class="field-error" v-if="formErrors.firstName">Required</span>
            </div>
            <div class="form-group">
              <label>Last Name <span class="req">*</span></label>
              <input v-model="form.lastName" placeholder="Dela Cruz" :class="{ error: formErrors.lastName }" @input="formErrors.lastName = false" />
              <span class="field-error" v-if="formErrors.lastName">Required</span>
            </div>
          </div>
          <div class="form-group">
            <label>Student ID <span class="req">*</span></label>
            <input v-model="form.studentId" placeholder="2024-00001" :class="{ error: formErrors.studentId }" @input="formErrors.studentId = false" />
            <span class="field-error" v-if="formErrors.studentId">Required</span>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Violation Type</label>
              <select v-model="form.type">
                <option>Academic Dishonesty</option>
                <option>Misconduct</option>
                <option>Dress Code Violation</option>
                <option>Tardiness</option>
                <option>Property Damage</option>
                <option>Harassment</option>
                <option>Unauthorized Absence</option>
              </select>
            </div>
            <div class="form-group">
              <label>Severity</label>
              <select v-model="form.severity">
                <option>Major</option>
                <option>Moderate</option>
                <option>Minor</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Incident Notes</label>
            <textarea v-model="form.notes" rows="3" placeholder="Describe the incident..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showAddModal = false">Cancel</button>
            <button class="btn-resolve" @click="submitViolation" :disabled="submitting">
              {{ submitting ? 'Filing...' : 'File Violation' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── DELETE CONFIRM MODAL ── -->
    <Teleport to="body">
      <div class="modal-overlay" :class="{ open: showDeleteModal }" @click.self="showDeleteModal = false">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3>Confirm Delete</h3>
            <button class="modal-close" @click="showDeleteModal = false">✕</button>
          </div>
          <p style="font-size:14px; color:#555; margin-bottom:24px; line-height:1.6;">
            Are you sure you want to remove the violation record for
            <strong>{{ deleteTarget?.name }}</strong>? This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
            <button class="btn-delete-confirm" @click="confirmDelete">Yes, Delete</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── TOAST ── -->
    <Teleport to="body">
      <div class="toast" :class="[toast.type, { show: toast.visible }]">
        <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else-if="toast.type === 'warn'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        {{ toast.message }}
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()

// ── State ─────────────────────────────────────────────────
const loading    = ref(true)
const submitting = ref(false)
const cases      = ref([])
const viewMode   = ref('table') // 'table' | 'card'

const searchQuery    = ref('')
const severityFilter = ref('')
const statusFilter   = ref('')
const sortBy         = ref('date-desc')
const currentPage    = ref(1)
const PER_PAGE       = 6

const selectedIds     = ref([])
const showReviewModal = ref(false)
const showAddModal    = ref(false)
const showEditModal   = ref(false)
const showDeleteModal = ref(false)
const activeCase      = ref(null)
const editTarget      = ref(null)
const deleteTarget    = ref(null)

const form = reactive({
  firstName: '', lastName: '', studentId: '',
  type: 'Academic Dishonesty', severity: 'Major', notes: ''
})
const formErrors = reactive({ firstName: false, lastName: false, studentId: false })
const toast = reactive({ visible: false, message: '', type: '' })

// ── Reset page on filter change ────────────────────────────
watch([searchQuery, severityFilter, statusFilter, sortBy], () => { currentPage.value = 1 })

// ── Colors & UID ──────────────────────────────────────────
const COLORS = ['#FF6B1A','#1a6bff','#9b51e0','#0fa68a','#d63e5e','#e08c0f']
const colorFor = (name) => COLORS[name.charCodeAt(0) % COLORS.length]
let _uid = 0
const nextUid = () => `V-${String(++_uid).padStart(4,'0')}`

// ── API ───────────────────────────────────────────────────
const mapCase = (v) => ({
  _raw: v,
  _uid: nextUid(),
  name: `${v.student.first_name} ${v.student.last_name}`,
  studentId: v.student.student_id ?? v.student_id ?? '—',
  type: v.violation_type,
  severity: v.severity,
  date: new Date(v.date_filed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  status: v.status,
  notes: v.notes ?? '',
  color: colorFor(v.student.first_name),
  timeline: null,
})

const fetchViolations = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/dean/violations')
    cases.value = data.map(mapCase)
  } catch (err) {
    console.error('Failed to fetch violations:', err)
    showToast('Failed to load violations.', 'warn')
  } finally {
    loading.value = false
  }
}

// ── Computed ──────────────────────────────────────────────
const SEVERITY_ORDER = { Major: 0, Moderate: 1, Minor: 2 }

const filteredCases = computed(() => {
  let list = cases.value.filter(v => {
    const q = searchQuery.value.toLowerCase()
    return (
      (v.name.toLowerCase().includes(q) || v.studentId.toLowerCase().includes(q)) &&
      (!severityFilter.value || v.severity === severityFilter.value) &&
      (!statusFilter.value   || v.status   === statusFilter.value)
    )
  })
  if (sortBy.value === 'date-desc')  list = [...list].reverse()
  if (sortBy.value === 'name-asc')   list = [...list].sort((a,b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'severity')   list = [...list].sort((a,b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  return list
})

const totalPages      = computed(() => Math.max(1, Math.ceil(filteredCases.value.length / PER_PAGE)))
const paginationStart = computed(() => Math.min((currentPage.value - 1) * PER_PAGE + 1, filteredCases.value.length))
const paginationEnd   = computed(() => Math.min(currentPage.value * PER_PAGE, filteredCases.value.length))
const paginatedCases  = computed(() => filteredCases.value.slice((currentPage.value - 1) * PER_PAGE, currentPage.value * PER_PAGE))

const counts = computed(() => ({
  major:       cases.value.filter(v => v.severity === 'Major').length,
  moderate:    cases.value.filter(v => v.severity === 'Moderate').length,
  minor:       cases.value.filter(v => v.severity === 'Minor').length,
  resolved:    cases.value.filter(v => v.status === 'Resolved').length,
  underReview: cases.value.filter(v => v.status === 'Under Review').length,
}))

const resolvedRate = computed(() =>
  cases.value.length ? Math.round((counts.value.resolved / cases.value.length) * 100) : 0
)

const trend = computed(() => ({ major: counts.value.major > 0 ? 2 : 0 }))

const allSelected = computed(() =>
  paginatedCases.value.length > 0 && paginatedCases.value.every(v => selectedIds.value.includes(v._uid))
)

// ── Helpers ───────────────────────────────────────────────
const sevClass = (s) => ({ Major: 'sev-major', Moderate: 'sev-moderate', Minor: 'sev-minor' }[s] ?? '')
const stClass  = (s) => ({ Resolved: 'st-resolved', Warned: 'st-warned', 'Under Review': 'st-review' }[s] ?? '')

const defaultTimeline = (v) => [
  { label: 'Violation filed', date: v.date, type: 'filed' },
  ...(v.status === 'Warned'   ? [{ label: 'Student warned',    date: v.date, type: 'warned'   }] : []),
  ...(v.status === 'Resolved' ? [{ label: 'Case resolved',     date: v.date, type: 'resolved' }] : []),
]

// ── Select / Bulk ─────────────────────────────────────────
const toggleSelect    = (uid) => selectedIds.value.includes(uid)
  ? selectedIds.value.splice(selectedIds.value.indexOf(uid), 1)
  : selectedIds.value.push(uid)

const toggleSelectAll = () => {
  if (allSelected.value) selectedIds.value = selectedIds.value.filter(id => !paginatedCases.value.find(v => v._uid === id))
  else paginatedCases.value.forEach(v => { if (!selectedIds.value.includes(v._uid)) selectedIds.value.push(v._uid) })
}

const bulkApply = (status) => {
  cases.value.forEach(v => { if (selectedIds.value.includes(v._uid)) v.status = status })
  showToast(`${selectedIds.value.length} records marked as ${status}.`, 'success')
  selectedIds.value = []
}
const bulkWarn    = () => bulkApply('Warned')
const bulkResolve = () => bulkApply('Resolved')
const bulkDelete  = () => {
  cases.value = cases.value.filter(v => !selectedIds.value.includes(v._uid))
  showToast(`${selectedIds.value.length} records deleted.`, 'warn')
  selectedIds.value = []
}

// ── CRUD ──────────────────────────────────────────────────
const openReview = (v) => { activeCase.value = v; showReviewModal.value = true }
const openEdit   = (v) => { editTarget.value = { ...v }; showEditModal.value = true }
const openAddModal = () => { showAddModal.value = true }

const markWarned = async () => {
  try { await axios.patch(`/dean/violations/${activeCase.value._raw.id}/warn`) } catch {}
  activeCase.value.status = 'Warned'
  showReviewModal.value = false
  showToast('Student marked as Warned.', 'warn')
}
const markResolved = async () => {
  try { await axios.patch(`/dean/violations/${activeCase.value._raw.id}/resolve`) } catch {}
  activeCase.value.status = 'Resolved'
  showReviewModal.value = false
  showToast('Case resolved successfully.', 'success')
}

const saveEdit = async () => {
  const target = cases.value.find(v => v._uid === editTarget.value._uid)
  if (!target) return
  try { await axios.put(`/dean/violations/${target._raw.id}`, { violation_type: editTarget.value.type, severity: editTarget.value.severity, status: editTarget.value.status, notes: editTarget.value.notes }) } catch {}
  Object.assign(target, { type: editTarget.value.type, severity: editTarget.value.severity, status: editTarget.value.status, notes: editTarget.value.notes })
  showEditModal.value = false
  showToast('Violation updated.', 'success')
}

const deleteCase = (v) => { deleteTarget.value = v; showDeleteModal.value = true }
const confirmDelete = async () => {
  try { await axios.delete(`/dean/violations/${deleteTarget.value._raw.id}`) } catch {}
  cases.value = cases.value.filter(c => c._uid !== deleteTarget.value._uid)
  showDeleteModal.value = false
  showToast('Record deleted.', 'warn')
}

const submitViolation = async () => {
  formErrors.firstName = !form.firstName
  formErrors.lastName  = !form.lastName
  formErrors.studentId = !form.studentId
  if (formErrors.firstName || formErrors.lastName || formErrors.studentId) return

  submitting.value = true
  try {
    const payload = {
      student: { first_name: form.firstName, last_name: form.lastName, student_id: form.studentId },
      violation_type: form.type, severity: form.severity,
      notes: form.notes, date_filed: new Date().toISOString(), status: 'Under Review',
    }
    const { data } = await axios.post('/dean/violations', payload)
    cases.value.unshift(mapCase(data))
    Object.assign(form, { firstName:'', lastName:'', studentId:'', type:'Academic Dishonesty', severity:'Major', notes:'' })
    showAddModal.value = false
    showToast('Violation filed successfully.', 'success')
  } catch (err) {
    console.error(err)
    showToast('Failed to file violation.', 'warn')
  } finally {
    submitting.value = false
  }
}

// ── Export CSV ────────────────────────────────────────────
const exportCSV = () => {
  const headers = ['Name','Student ID','Violation Type','Severity','Date Filed','Status']
  const rows = filteredCases.value.map(v => [v.name, v.studentId, v.type, v.severity, v.date, v.status])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `violations-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  showToast('CSV exported.', 'success')
}

// ── Filters clear ─────────────────────────────────────────
const clearFilters = () => { searchQuery.value = ''; severityFilter.value = ''; statusFilter.value = '' }

// ── Toast ─────────────────────────────────────────────────
const showToast = (message, type = '') => {
  toast.message = message; toast.type = type; toast.visible = true
  setTimeout(() => { toast.visible = false }, 3200)
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  if (authStore.isDean) fetchViolations()
  else loading.value = false
})
</script>

<style scoped>
.violations-page { display: flex; flex-direction: column; gap: 20px; }

/* ── ANALYTICS STRIP ── */
.analytics-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e8e6e1;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.stat-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon-orange  { background: #fff1ea; color: #FF6B1A; }
.icon-black   { background: #f0efed; color: #111; }
.icon-green   { background: #eaf5e9; color: #2d7a25; }
.icon-review  { background: #fff3ec; color: #FF6B1A; }
.stat-num     { font-size: 22px; font-weight: 800; color: #111; line-height: 1; }
.stat-label   { font-size: 11.5px; color: #888; margin-top: 2px; }
.stat-trend   { font-size: 11px; font-weight: 500; margin-left: auto; white-space: nowrap; }
.stat-trend.up      { color: #FF6B1A; }
.stat-trend.down    { color: #2d7a25; }
.stat-trend.neutral { color: #aaa; }

/* ── PAGE HEADER ── */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.section-title { font-size: 24px; font-weight: 800; color: #FF6B1A; letter-spacing: -.02em; }
.section-desc  { font-size: 13px; color: #666; margin-top: 3px; }

.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* VIEW TOGGLE */
.view-toggle {
  display: flex;
  background: #f5f4f2;
  border: 1.5px solid #e8e6e1;
  border-radius: 9px;
  overflow: hidden;
}
.view-toggle button {
  background: none; border: none; padding: 7px 10px;
  cursor: pointer; color: #888; display: flex; align-items: center;
  transition: all .15s;
}
.view-toggle button.active { background: #fff; color: #FF6B1A; }

.export-btn {
  background: #fff; color: #333; border: 1.5px solid #e8e6e1;
  padding: 9px 15px; border-radius: 10px; font-size: 13px; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; gap: 7px;
  transition: all .2s;
}
.export-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }

.add-btn {
  background: #FF6B1A; color: #fff; border: none;
  padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: background .2s, transform .15s; white-space: nowrap;
}
.add-btn:hover  { background: #e8591a; transform: translateY(-1px); }
.add-btn:active { transform: scale(.97); }

/* ── TOOLBAR ── */
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.search-wrap { flex: 1; min-width: 220px; position: relative; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
.search-wrap input {
  width: 100%; padding: 10px 36px 10px 38px;
  border: 1.5px solid #e8e6e1; border-radius: 10px;
  background: #fff; font-size: 13px; color: #111;
  outline: none; transition: border-color .2s;
}
.search-wrap input:focus { border-color: #FF6B1A; }
.clear-search {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #aaa; cursor: pointer; font-size: 13px;
  padding: 2px 4px; border-radius: 4px; transition: color .15s;
}
.clear-search:hover { color: #FF6B1A; }
.toolbar select {
  padding: 10px 14px; border: 1.5px solid #e8e6e1; border-radius: 10px;
  background: #fff; font-size: 13px; color: #111; outline: none; cursor: pointer;
  transition: border-color .2s;
}
.toolbar select:focus { border-color: #FF6B1A; }

/* ── BULK BAR ── */
.bulk-bar {
  background: #111; color: #fff; border-radius: 12px;
  padding: 12px 18px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
}
.bulk-count  { font-size: 13px; font-weight: 600; }
.bulk-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.bulk-btn {
  background: rgba(255,255,255,.12); color: #fff; border: 1px solid rgba(255,255,255,.2);
  padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 500;
  cursor: pointer; transition: background .15s;
}
.bulk-btn:hover         { background: rgba(255,255,255,.22); }
.bulk-btn.danger        { background: rgba(220,60,50,.3); border-color: rgba(220,60,50,.5); }
.bulk-btn.danger:hover  { background: rgba(220,60,50,.5); }
.bulk-btn.ghost         { background: transparent; border-color: rgba(255,255,255,.15); color: #aaa; }
.slide-down-enter-active, .slide-down-leave-active { transition: all .25s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── TABLE CARD ── */
.table-card {
  background: #fff; border: 1.5px solid #e8e6e1; border-radius: 14px;
  overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.04);
}
.data-table { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #111; }
.data-table th {
  padding: 13px 14px; text-align: left;
  font-size: 10.5px; font-weight: 700; color: #fff;
  letter-spacing: .07em; text-transform: uppercase; white-space: nowrap;
}
.col-check { width: 40px; }
.data-table th.col-check, .data-table td.col-check { padding-left: 16px; }
.data-table tbody tr {
  border-bottom: 1px solid #e8e6e1; transition: background .15s;
  animation: fadeIn .3s ease both;
}
.data-table tbody tr:last-child { border-bottom: none; }
.data-table tbody tr:hover    { background: #fff3ec; }
.data-table tbody tr.selected { background: #fff8f4; }
.data-table td { padding: 13px 14px; font-size: 13.5px; vertical-align: middle; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* STUDENT CELL */
.student-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; flex-shrink: 0; }
.student-name { font-weight: 600; font-size: 13.5px; color: #111; }
.student-id   { font-size: 11px; color: #aaa; }

/* BADGES */
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
.sev-major    { background: #fff1ea; color: #c44b0a; }
.sev-moderate { background: #f0efed; color: #222; }
.sev-minor    { background: #eaf5e9; color: #2d7a25; }
.st-review    { background: #fff3ec; color: #FF6B1A; border: 1px solid #ffcfb0; }
.st-warned    { background: #f0efed; color: #222; }
.st-resolved  { background: #eaf5e9; color: #2d7a25; }

/* ROW ACTIONS */
.row-actions { display: flex; gap: 6px; }
.btn-review { background: #111; color: #fff; border: none; padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-review:hover { background: #FF6B1A; }
.btn-icon {
  background: #f5f4f2; border: 1.5px solid #e8e6e1; color: #666;
  padding: 6px 8px; border-radius: 7px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.btn-icon:hover          { background: #fde8e0; border-color: #ffcfb0; color: #FF6B1A; }
.btn-icon.danger:hover   { background: #fde8e0; border-color: #f09595; color: #c0392b; }

/* ── CARD GRID ── */
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.vcard {
  background: #fff; border: 1.5px solid #e8e6e1; border-radius: 14px; padding: 18px;
  display: flex; flex-direction: column; gap: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  animation: fadeIn .3s ease both; transition: box-shadow .2s;
}
.vcard:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.vcard-top  { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.vcard-type { font-size: 13px; color: #555; font-weight: 500; }
.vcard-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #aaa; }
.vcard-actions { display: flex; gap: 6px; }

/* ── LOADING / EMPTY ── */
.loading-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; gap: 14px; color: #aaa; font-size: 13px; }
.spinner { width: 28px; height: 28px; border: 3px solid #e8e6e1; border-top-color: #FF6B1A; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #aaa; gap: 12px; font-size: 13.5px; }
.clear-filters-btn {
  background: #FF6B1A; color: #fff; border: none;
  padding: 8px 18px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;
}

/* ── PAGINATION ── */
.pagination { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; border-top: 1px solid #e8e6e1; font-size: 12.5px; color: #666; }
.pg-btns { display: flex; gap: 6px; }
.pg-btn { background: #f5f4f2; border: 1.5px solid #e8e6e1; border-radius: 7px; padding: 5px 11px; font-size: 12px; cursor: pointer; transition: all .15s; }
.pg-btn:hover           { background: #fde8e0; border-color: #ffcfb0; color: #FF6B1A; }
.pg-btn.active          { background: #FF6B1A; border-color: #FF6B1A; color: #fff; }
.pg-btn:disabled        { opacity: .4; cursor: not-allowed; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 999; opacity: 0; pointer-events: none; transition: opacity .2s; }
.modal-overlay.open { opacity: 1; pointer-events: all; }
.modal { background: #fff; border-radius: 14px; width: 100%; max-width: 480px; padding: 28px; margin: 16px; box-shadow: 0 20px 60px rgba(0,0,0,.18); transform: translateY(16px); transition: transform .25s; }
.modal-wide { max-width: 560px; }
.modal-sm   { max-width: 400px; }
.modal-overlay.open .modal { transform: translateY(0); }

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { font-size: 17px; font-weight: 800; color: #111; }
.modal-close { background: #f5f4f2; border: none; border-radius: 7px; padding: 5px 9px; cursor: pointer; font-size: 15px; color: #666; transition: background .2s; }
.modal-close:hover { background: #fde8e0; color: #FF6B1A; }

.modal-student-info { display: flex; align-items: center; gap: 14px; background: #f5f4f2; border-radius: 10px; padding: 14px; margin-bottom: 18px; }
.modal-avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; }
.modal-student-name { font-weight: 600; font-size: 15px; }
.modal-student-id   { font-size: 12px; color: #aaa; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.detail-item label { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: #aaa; display: block; margin-bottom: 4px; }
.detail-item span  { font-size: 13.5px; font-weight: 500; }

.modal-notes { margin-bottom: 18px; }
.modal-notes > label { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: #aaa; display: block; margin-bottom: 6px; }
.modal-notes p { font-size: 13.5px; color: #555; line-height: 1.65; background: #f5f4f2; border-radius: 8px; padding: 10px 12px; }

/* ── TIMELINE ── */
.timeline-section { margin-bottom: 20px; }
.timeline-section > label { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: #aaa; display: block; margin-bottom: 10px; }
.timeline { display: flex; flex-direction: column; gap: 0; border-left: 2px solid #e8e6e1; margin-left: 8px; padding-left: 18px; }
.tl-item { display: flex; align-items: flex-start; gap: 10px; padding-bottom: 14px; position: relative; }
.tl-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  position: absolute; left: -24px; top: 4px;
}
.tl-dot.filed    { background: #FF6B1A; }
.tl-dot.warned   { background: #111; }
.tl-dot.resolved { background: #2d7a25; }
.tl-title { font-size: 13px; font-weight: 600; color: #111; }
.tl-date  { font-size: 11.5px; color: #aaa; }

.modal-actions { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
.btn-cancel  { background: #f5f4f2; color: #666; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background .2s; }
.btn-cancel:hover  { background: #e8e6e1; }
.btn-warn    { background: #111; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-warn:hover    { background: #333; }
.btn-warn:disabled { opacity: .4; cursor: not-allowed; }
.btn-resolve { background: #FF6B1A; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-resolve:hover    { background: #e8591a; }
.btn-resolve:disabled { opacity: .5; cursor: not-allowed; }
.btn-delete-confirm { background: #c0392b; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-delete-confirm:hover { background: #a93226; }

/* ── FORM ── */
.form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 14px; }
.form-group label { font-size: 12px; font-weight: 500; color: #555; display: block; margin-bottom: 5px; }
.req { color: #FF6B1A; }
.form-group input,
.form-group select,
.form-group textarea { width: 100%; padding: 10px 12px; border: 1.5px solid #e8e6e1; border-radius: 8px; font-size: 13px; color: #111; outline: none; transition: border-color .2s; background: #fff; resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #FF6B1A; }
.form-group input.error { border-color: #e24b4a; }
.field-error { font-size: 11px; color: #e24b4a; margin-top: 3px; display: block; }

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  background: #111; color: #fff;
  padding: 11px 18px; border-radius: 10px;
  font-size: 13px; font-weight: 500; z-index: 9999;
  opacity: 0; transform: translateY(10px);
  transition: all .3s; pointer-events: none;
  max-width: 300px; display: flex; align-items: center; gap: 8px;
}
.toast.show    { opacity: 1; transform: translateY(0); }
.toast.success { background: #2d7a25; }
.toast.warn    { background: #FF6B1A; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .analytics-strip { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .analytics-strip { grid-template-columns: 1fr 1fr; }
  .header-actions  { width: 100%; justify-content: flex-end; }
  .toolbar         { flex-direction: column; }
  .search-wrap     { width: 100%; }
}
</style>