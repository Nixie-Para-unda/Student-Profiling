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

    <!-- MODAL -->
    <div
      v-if="viewingViolation"
      class="modal-overlay"
      @click.self="viewingViolation = null"
    >
      <div class="modal">
        <div class="modal-header">
          <h3>Violation Details</h3>
          <button class="close-btn" @click="viewingViolation = null">×</button>
        </div>

        <div class="modal-body">
          <p>
            <b>Student:</b>
            {{ viewingViolation.student?.first_name }}
            {{ viewingViolation.student?.last_name }}
          </p>
          <p><b>Violation:</b> {{ viewingViolation.violationType }}</p>
          <p><b>Severity:</b> {{ viewingViolation.severity }}</p>
          <p><b>Description:</b> {{ viewingViolation.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const violations = ref([])
const loading = ref(false)
const search = ref('')
const viewingViolation = ref(null)

const fetchViolations = async () => {
  loading.value = true
  try {
    const res = await axios.get('/faculty/violations')
    violations.value = res.data
  } finally {
    loading.value = false
  }
}

const filteredViolations = computed(() => {
  return violations.value.filter(v => {
    const s = search.value.toLowerCase()
    return (
      !search.value ||
      v.violationType.toLowerCase().includes(s) ||
      v.student?.first_name?.toLowerCase().includes(s) ||
      v.student?.last_name?.toLowerCase().includes(s)
    )
  })
})

const miniStats = computed(() => [
  { value: violations.value.length },
  { value: violations.value.filter(v => v.severity === 'Major').length },
  { value: violations.value.filter(v => v.severity === 'Moderate').length },
  { value: violations.value.filter(v => v.severity === 'Minor').length }
])

const viewViolation = v => (viewingViolation.value = v)

const openReportModal = () => {
  alert('Hook your modal here')
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

/* BUTTON */
.primary-btn {
  background: #FF6B1A;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
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
  border-top: 3px solid;
  display: flex;
  gap: 10px;
}

.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
}

.stat-label {
  font-size: 10px;
  color: #9a8070;
  text-transform: uppercase;
}

/* COLORS */
.stat-orange { border-color: #FF6B1A; }
.stat-red { border-color: #ef4444; }
.stat-yellow { border-color: #f59e0b; }
.stat-blue { border-color: #3b82f6; }

/* SEARCH */
.search-wrap input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
}

/* TABLE */
.table-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #eee;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  font-size: 10px;
  text-transform: uppercase;
  color: #9a8070;
  padding: 12px;
}

.data-table td {
  padding: 12px;
  font-size: 13px;
}

.clickable-row:hover td {
  background: #fdf5ef;
}

/* STUDENT CELL */
.student-cell {
  display: flex;
  gap: 10px;
}

.s-avatar {
  width: 34px;
  height: 34px;
  background: #FF6B1A;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.s-name {
  font-weight: 600;
}

.s-sub {
  font-size: 11px;
  color: #b89f90;
}

/* BADGES */
.severity-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
}

.sev-major { color: #ef4444; }
.sev-moderate { color: #f59e0b; }
.sev-minor { color: #3b82f6; }

/* STATUS */
.status-badge {
  font-size: 11px;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  width: 400px;
}
</style>