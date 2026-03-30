<template>
  <div class="archive-page">
    <div class="page-header">
      <div class="header-left">
        <div class="breadcrumb">Management</div>
        <h2 class="page-title">Archive Management</h2>
        <p class="page-sub">View and restore archived student and faculty accounts.</p>
      </div>
      <div class="header-stats">
        <div class="stat-pill">
          <span class="pill-label">Archived Students</span>
          <span class="pill-value">{{ students.length }}</span>
        </div>
        <div class="stat-pill">
          <span class="pill-label">Archived Faculty</span>
          <span class="pill-value">{{ faculty.length }}</span>
        </div>
      </div>
    </div>

    <div class="archive-tabs pcard">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'students' }"
        @click="activeTab = 'students'"
      >
        Student Accounts
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'faculty' }"
        @click="activeTab = 'faculty'"
      >
        Faculty Accounts
      </button>
    </div>

    <div class="archive-list pcard">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading archived accounts...</p>
      </div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>{{ activeTab === 'students' ? 'STUDENT NO.' : 'DEPARTMENT' }}</th>
              <th>{{ activeTab === 'students' ? 'PROGRAM' : 'POSITION' }}</th>
              <th>ARCHIVED AT</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in (activeTab === 'students' ? students : faculty)" :key="item.id">
              <td>
                <div class="user-cell">
                  <div class="u-avatar">{{ (item.first_name?.[0] || '?').toUpperCase() }}</div>
                  <div>
                    <p class="u-name">{{ item.first_name }} {{ item.last_name }}</p>
                    <p class="u-sub">{{ item.user?.email || 'No email' }}</p>
                  </div>
                </div>
              </td>
              <td>{{ activeTab === 'students' ? (item.student_number || 'N/A') : (item.department?.department_name || 'N/A') }}</td>
              <td>
                <span class="type-badge">
                  {{ activeTab === 'students' ? (item.program?.program_code || 'N/A') : (item.position || 'N/A') }}
                </span>
              </td>
              <td>{{ formatDate(item.deleted_at) }}</td>
              <td class="actions-cell">
                <button class="restore-btn" @click="confirmRestore(item)" title="Restore Account">
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 2v4M10 2a8 8 0 108 8M10 2l-3 3m3-3l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Restore
                </button>
              </td>
            </tr>
            <tr v-if="(activeTab === 'students' ? students : faculty).length === 0">
              <td colspan="5" class="empty-row">No archived {{ activeTab }} found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- RESTORE MODAL -->
    <div v-if="showRestoreModal" class="modal-overlay" @click.self="showRestoreModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Restore Account</h3>
          <button class="close-btn" @click="showRestoreModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to restore the account of <strong>{{ selectedItem?.first_name }} {{ selectedItem?.last_name }}</strong>?</p>
          <p class="modal-help">This will move the account back to the active list and allow the user to log in again.</p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showRestoreModal = false">Cancel</button>
          <button class="primary-btn" @click="restoreAccount" :disabled="restoring">
            {{ restoring ? 'Restoring...' : 'Restore Account' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const students = ref([])
const faculty = ref([])
const loading = ref(false)
const restoring = ref(false)
const activeTab = ref('students')
const showRestoreModal = ref(false)
const selectedItem = ref(null)

const fetchArchived = async () => {
  loading.value = true
  try {
    const res = await axios.get('/archive')
    students.value = res.data.students
    faculty.value = res.data.faculty
  } catch (err) {
    console.error('Failed to fetch archive:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const confirmRestore = (item) => {
  selectedItem.value = item
  showRestoreModal.value = true
}

const restoreAccount = async () => {
  if (!selectedItem.value) return
  restoring.value = true
  try {
    await axios.post(`/archive/${selectedItem.value.id}/restore`, {
      type: activeTab.value === 'students' ? 'student' : 'faculty'
    })
    showRestoreModal.value = false
    fetchArchived()
    alert('Account restored successfully.')
  } catch (err) {
    alert('Failed to restore account.')
  } finally {
    restoring.value = false
  }
}

onMounted(fetchArchived)
</script>

<style scoped>
.archive-page { display: flex; flex-direction: column; gap: 24px; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 20px; border-bottom: 2px solid #f0e8e0; }
.breadcrumb { font-size: 11px; font-weight: 700; color: #b89f90; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a0a00; letter-spacing: -0.8px; }
.page-sub { font-size: 13px; color: #9a8070; margin-top: 4px; }

.header-stats { display: flex; gap: 16px; }
.stat-pill { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.pill-label { font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.3px; }
.pill-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; color: #FF6B1A; line-height: 1; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }

.archive-tabs { display: flex; padding: 6px; gap: 6px; background: #faf8f6; }
.tab-btn { flex: 1; padding: 12px; border: none; border-radius: 14px; font-size: 14px; font-weight: 700; color: #9a8070; cursor: pointer; transition: all 0.2s; background: none; }
.tab-btn.active { background: #fff; color: #FF6B1A; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.archive-list { flex: 1; display: flex; flex-direction: column; min-height: 400px; }
.table-container { flex: 1; overflow-y: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 16px 22px; background: #fffaf8; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #f0e8e0; letter-spacing: 0.5px; }
.data-table td { padding: 16px 22px; border-bottom: 1px solid #faf8f6; color: #1a0a00; vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 12px; }
.u-avatar { width: 36px; height: 36px; background: #f0e8e0; color: #9a8070; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
.u-name { font-weight: 700; font-size: 14px; }
.u-sub { font-size: 12px; color: #9a8070; }

.type-badge { background: #f0e8e0; color: #1a0a00; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; }
.text-right { text-align: right; }
.actions-cell { text-align: right; }

.restore-btn { background: #fffaf8; border: 1.5px solid #fef0e8; color: #FF6B1A; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; margin-left: auto; }
.restore-btn:hover { background: #FF6B1A; color: #fff; border-color: #FF6B1A; box-shadow: 0 4px 12px rgba(255,107,26,0.2); }

.loading-state { padding: 80px; text-align: center; color: #b89f90; }
.spinner { width: 28px; height: 28px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-row { padding: 80px; text-align: center; color: #b89f90; font-style: italic; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,10,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 28px; width: 100%; max-width: 450px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.2); }
.modal-header { padding: 24px 32px; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { font-size: 18px; font-weight: 800; color: #1a0a00; }
.close-btn { background: #faf8f6; border: none; font-size: 24px; color: #9a8070; cursor: pointer; width: 32px; height: 32px; border-radius: 10px; }
.modal-body { padding: 32px; text-align: center; }
.modal-body p { font-size: 15px; color: #1a0a00; margin-bottom: 8px; line-height: 1.5; }
.modal-help { font-size: 13px !important; color: #9a8070 !important; }
.modal-footer { padding: 24px 32px; background: #faf8f6; display: flex; gap: 12px; justify-content: stretch; }
.modal-footer button { flex: 1; padding: 12px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.ghost-btn { background: #fff; border: 1.5px solid #f0e8e0; color: #1a0a00; }
.primary-btn { background: #FF6B1A; border: none; color: #fff; box-shadow: 0 4px 12px rgba(255,107,26,0.2); }
</style>
