<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Department Violations</h2>
        <p class="page-sub">Monitor and manage student conduct reports within your department.</p>
      </div>
    </div>

    <div class="mini-stats">
      <div class="mini-stat stat-orange">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[0].value }}</span>
          <span class="stat-label">{{ miniStats[0].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-amber">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[1].value }}</span>
          <span class="stat-label">{{ miniStats[1].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[2].value }}</span>
          <span class="stat-label">{{ miniStats[2].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[3].value }}</span>
          <span class="stat-label">{{ miniStats[3].label }}</span>
        </div>
      </div>
    </div>

    <div class="table-actions">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search student or violation..." />
      </div>
      <div class="filter-group">
        <select v-model="severityFilter">
          <option value="">All Severity</option>
          <option value="Major">Major</option>
          <option value="Moderate">Moderate</option>
          <option value="Minor">Minor</option>
        </select>
        <select v-model="statusFilter">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
          <option value="Sanctioned">Sanctioned</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-lg"></div>
        <p>Loading violations...</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>VIOLATION</th>
              <th>REPORTER</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in filteredViolations" :key="v.id" @click="viewViolation(v)" class="clickable-row">
              <td>
                <div class="student-cell">
                  <div class="s-avatar">
                    {{ v.student?.first_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="s-name">{{ v.student?.first_name }} {{ v.student?.last_name }}</p>
                    <p class="s-sub">{{ v.student?.user?.student_number || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="v-type">{{ v.violationType }}</p>
                <span class="sev-badge" :class="'sev-' + v.severity.toLowerCase()">{{ v.severity }}</span>
              </td>
              <td>
                <p class="r-name">{{ v.faculty?.first_name }} {{ v.faculty?.last_name }}</p>
                <p class="r-pos">{{ v.faculty?.position }}</p>
              </td>
              <td>{{ formatDate(v.dateReported) }}</td>
              <td>
                <span class="status-badge" :class="'st-' + v.status.toLowerCase().replace(' ', '-')">
                  {{ v.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredViolations.length === 0 && !loading">
              <td colspan="5" class="empty-row">No violations found matching your criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="viewingViolation" class="modal-overlay" @click.self="!saving && (viewingViolation = null)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Violation Case Details</h3>
          <button class="close-btn" @click="viewingViolation = null" :disabled="saving">×</button>
        </div>
        <div class="modal-body profile-body">
          <div class="detail-grid">
            <div class="profile-section">
              <h4 class="section-title">Reported Student</h4>
              <div class="info-card">
                <p class="info-name">{{ viewingViolation.student?.first_name }} {{ viewingViolation.student?.last_name }}</p>
                <p class="info-sub">{{ viewingViolation.student?.user?.student_number }}</p>
                <p class="info-sub">{{ viewingViolation.student?.section?.section_name }} | {{ viewingViolation.student?.program?.program_code }}</p>
              </div>
            </div>
            <div class="profile-section">
              <h4 class="section-title">Reporting Faculty</h4>
              <div class="info-card">
                <p class="info-name">{{ viewingViolation.faculty?.first_name }} {{ viewingViolation.faculty?.last_name }}</p>
                <p class="info-sub">{{ viewingViolation.faculty?.position }}</p>
                <p class="info-sub" v-if="viewingViolation.course">During: {{ viewingViolation.course.course_name }}</p>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Incident Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Type & Severity</span>
                <span class="detail-val">
                  {{ viewingViolation.violationType }} 
                  <span class="sev-badge" :class="'sev-' + viewingViolation.severity.toLowerCase()">{{ viewingViolation.severity }}</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Date & Time</span>
                <span class="detail-val">{{ formatDate(viewingViolation.dateReported) }} {{ formatTime(viewingViolation.incident_time) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Location</span>
                <span class="detail-val">{{ viewingViolation.location || 'Not specified' }}</span>
              </div>
              <div class="detail-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                <span class="detail-key">Faculty Description</span>
                <p class="description-text">{{ viewingViolation.description }}</p>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Administrative Action</h4>
            <div class="action-form">
              <div class="form-group">
                <label>Update Case Status</label>
                <select v-model="editForm.status" :disabled="saving">
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                  <option value="Sanctioned">Sanctioned</option>
                </select>
              </div>
              <div class="form-group full-span">
                <label>Action Taken / Remarks</label>
                <textarea 
                  v-model="editForm.action_taken" 
                  rows="3" 
                  placeholder="Input the actions taken or final decision for this case..."
                  :disabled="saving"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingViolation = null" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="updateViolation" :disabled="saving">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Saving Changes...' : 'Update Record' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const violations = ref([])
const loading = ref(true)
const saving = ref(false)
const viewingViolation = ref(null)

const search = ref('')
const severityFilter = ref('')
const statusFilter = ref('')

const editForm = ref({
  status: '',
  action_taken: ''
})

const fetchViolations = async () => {
  loading.value = true
  try {
    const res = await axios.get('/violations')
    violations.value = res.data
  } catch (err) {
    console.error('Failed to fetch violations:', err)
  } finally {
    loading.value = false
  }
}

const filteredViolations = computed(() => {
  return violations.value.filter(v => {
    const matchesSearch = !search.value || 
      `${v.student?.first_name} ${v.student?.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
      v.violationType.toLowerCase().includes(search.value.toLowerCase()) ||
      `${v.faculty?.first_name} ${v.faculty?.last_name}`.toLowerCase().includes(search.value.toLowerCase())
    
    const matchesSeverity = severityFilter.value ? v.severity === severityFilter.value : true
    const matchesStatus = statusFilter.value ? v.status === statusFilter.value : true
    
    return matchesSearch && matchesSeverity && matchesStatus
  })
})

const miniStats = computed(() => [
  { label: 'Total Cases', value: violations.value.length },
  { label: 'Pending Review', value: violations.value.filter(v => v.status === 'Pending').length },
  { label: 'Under Review', value: violations.value.filter(v => v.status === 'Under Review').length },
  { label: 'Action Taken', value: violations.value.filter(v => ['Resolved', 'Sanctioned'].includes(v.status)).length }
])

const viewViolation = (v) => {
  // Syncs with Vue Router just like the Dean page
  router.push({ name: 'ChairViolationDetail', params: { id: v.id } })
}

const updateViolation = async () => {
  saving.value = true
  try {
    await axios.put(`/violations/${viewingViolation.value.id}`, editForm.value)
    alert('Violation updated successfully!')
    viewingViolation.value = null
    fetchViolations()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update violation')
  } finally {
    saving.value = false
  }
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

onMounted(fetchViolations)

// ─── Route Modal Handling ───────────────────────────────────────────────────

watch(() => route.params.id, (newId) => {
  if (newId) {
    const v = violations.value.find(c => c.id == newId)
    if (v) {
      viewingViolation.value = v
      editForm.value = {
        status: v.status || 'Pending',
        action_taken: v.action_taken || ''
      }
    }
  } else {
    viewingViolation.value = null
  }
}, { immediate: true })

watch(violations, (newCases) => {
  if (route.params.id && !viewingViolation.value) {
    const v = newCases.find(c => c.id == route.params.id)
    if (v) {
      viewingViolation.value = v
      editForm.value = {
        status: v.status || 'Pending',
        action_taken: v.action_taken || ''
      }
    }
  }
})

watch(viewingViolation, (newVal) => {
  if (!newVal && route.params.id) {
    // Assuming your chair route name is 'ChairViolations'. Adjust if necessary.
    router.push({ name: 'ChairViolations' })
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* ── Stats (Imported from Dean UI) ── */
.mini-stats { display: flex; gap: 14px; }

.mini-stat {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-top: 3px solid;
  border-radius: 14px;
  padding: 16px 20px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg { width: 18px; height: 18px; }

.stat-text { display: flex; flex-direction: column; gap: 3px; }

.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* Color variants */
.stat-orange { border-top-color: #FF6B1A; }
.stat-orange .stat-icon { background: #fff5ef; }
.stat-orange .stat-icon svg { color: #FF6B1A; }
.stat-orange .stat-value { color: #FF6B1A; }

.stat-amber { border-top-color: #f59e0b; }
.stat-amber .stat-icon { background: #fffbeb; }
.stat-amber .stat-icon svg { color: #f59e0b; }
.stat-amber .stat-value { color: #f59e0b; }

.stat-blue { border-top-color: #3b82f6; }
.stat-blue .stat-icon { background: #eff6ff; }
.stat-blue .stat-icon svg { color: #3b82f6; }
.stat-blue .stat-value { color: #3b82f6; }

.stat-green { border-top-color: #10b981; }
.stat-green .stat-icon { background: #f0fdf4; }
.stat-green .stat-icon svg { color: #10b981; }
.stat-green .stat-value { color: #10b981; }

/* ── Actions ── */
.table-actions { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; max-width: 400px; }
.search-wrap svg { width: 16px; height: 16px; color: #b89f90; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; width: 100%; }
.filter-group { display: flex; gap: 10px; }
.filter-group select { padding: 9px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif; background: #fff; outline: none; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; position: relative; flex: 1; }
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 14px 20px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; text-align: left; border-bottom: 1px solid #f0e8e0; }
.data-table td { padding: 14px 20px; border-bottom: 1px solid #faf8f6; vertical-align: middle; }

.student-cell { display: flex; align-items: center; gap: 12px; }
.s-avatar { width: 36px; height: 36px; border-radius: 10px; background: #FF6B1A; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.s-sub { font-size: 11px; color: #b89f90; }

.v-type { font-size: 13px; font-weight: 600; color: #1a0a00; }
.r-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.r-pos { font-size: 11px; color: #9a8070; }

.sev-badge { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 5px; text-transform: uppercase; }
.sev-minor { background: #eff6ff; color: #3b82f6; }
.sev-moderate { background: #fffbeb; color: #d97706; }
.sev-major { background: #fef2f2; color: #ef4444; }

.status-badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 8px; white-space: nowrap; }
.st-pending { background: #fff7ed; color: #ea580c; }
.st-under-review { background: #eff6ff; color: #3b82f6; }
.st-resolved { background: #f0fdf4; color: #16a34a; }
.st-dismissed { background: #f3f4f6; color: #6b7280; }
.st-sanctioned { background: #fff1f2; color: #e11d48; }

.clickable-row { cursor: pointer; transition: all 0.2s; }
.clickable-row:hover { background: #fff9f4; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 24px; width: 100%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.2); }
.modal-header { padding: 20px 28px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; margin: 0; }
.close-btn { background: none; border: none; font-size: 24px; color: #b89f90; cursor: pointer; }

.modal-body { padding: 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.info-card { background: #faf8f6; padding: 16px; border-radius: 14px; border: 1px solid #f0e8e0; }
.info-name { font-size: 15px; font-weight: 700; color: #1a0a00; margin-bottom: 4px; }
.info-sub { font-size: 12px; color: #9a8070; }

.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; margin-bottom: 12px; }

.detail-rows { display: flex; flex-direction: column; border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0e8e0; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 12px; color: #9a8070; font-weight: 500; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; display: flex; align-items: center; gap: 8px; }
.description-text { font-size: 13px; line-height: 1.6; color: #4a3020; background: #fff9f4; padding: 12px; border-radius: 10px; width: 100%; }

.action-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 12px; font-weight: 700; color: #1a0a00; }
.form-group select, .form-group textarea { padding: 12px; border: 1.5px solid #f0e8e0; border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; transition: all 0.2s; }
.form-group select:focus, .form-group textarea:focus { border-color: #FF6B1A; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

.modal-footer { padding: 20px 28px; border-top: 1px solid #f0e8e0; background: #faf8f6; display: flex; justify-content: flex-end; gap: 12px; }

.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; transform: translateY(-1px); }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.ghost-btn { background: #fff; border: 1.5px solid #f0e8e0; color: #1a0a00; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }

.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #9a8070; }
.empty-row { text-align: center; padding: 60px; color: #b89f90; font-style: italic; }
</style>