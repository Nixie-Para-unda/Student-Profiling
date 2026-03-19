<template>
  <div class="violations-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Student Violations</h2>
        <p class="section-desc">Monitor and review all disciplinary cases in the department.</p>
      </div>
      <div class="header-right">
        <div class="summary-tags">
          <div class="summary-tag major">Major: <strong>{{ counts.major }}</strong></div>
          <div class="summary-tag moderate">Moderate: <strong>{{ counts.moderate }}</strong></div>
          <div class="summary-tag minor">Minor: <strong>{{ counts.minor }}</strong></div>
        </div>
      </div>
    </div>

    <!-- ADDED: SEARCH + FILTER -->
    <div class="toolbar">
      <input v-model="searchQuery" placeholder="Search student..." />
      <select v-model="severityFilter">
        <option value="">All Severity</option>
        <option value="Major">Major</option>
        <option value="Moderate">Moderate</option>
        <option value="Minor">Minor</option>
      </select>
      <select v-model="statusFilter">
        <option value="">All Status</option>
        <option value="Under Review">Under Review</option>
        <option value="Warned">Warned</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-student">STUDENT</th>
            <th class="col-type">VIOLATION TYPE</th>
            <th class="col-severity">SEVERITY</th>
            <th class="col-date">DATE FILED</th>
            <th class="col-status">STATUS</th>
            <th class="col-action">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filteredCases" :key="v.name">
            <td class="col-student">
              <div class="student-cell">
                <div class="avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
                <span class="name">{{ v.name }}</span>
              </div>
            </td>
            <td class="col-type">{{ v.type }}</td>
            <td class="col-severity">
              <span class="severity-badge" :class="v.severityClass">{{ v.severity }}</span>
            </td>
            <td class="col-date">{{ v.date }}</td>
            <td class="col-status">
              <span class="status-badge" :class="v.statusClass">{{ v.status }}</span>
            </td>
            <td class="col-action">
              <button class="review-btn">Review</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const cases = ref([])

// ADDED STATE
const searchQuery = ref('')
const severityFilter = ref('')
const statusFilter = ref('')

// FILTERED DATA
const filteredCases = computed(() => {
  return cases.value.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSeverity = severityFilter.value ? v.severity === severityFilter.value : true
    const matchStatus = statusFilter.value ? v.status === statusFilter.value : true
    return matchSearch && matchSeverity && matchStatus
  })
})

// ADDED COUNTS
const counts = computed(() => {
  return {
    major: cases.value.filter(v => v.severity === 'Major').length,
    moderate: cases.value.filter(v => v.severity === 'Moderate').length,
    minor: cases.value.filter(v => v.severity === 'Minor').length
  }
})

const fetchViolations = async () => {
  loading.value = true
  try {
    const response = await axios.get('/dean/violations')
    cases.value = response.data.map(v => ({
      name: `${v.student.first_name} ${v.student.last_name}`,
      type: v.violation_type,
      severity: v.severity,
      date: v.date_filed,
      status: v.status,
      color: v.severity === 'Major' ? '#FF6B1A' : v.severity === 'Moderate' ? '#000' : '#fff',
      severityClass: v.severity === 'Major' ? 'sev-major' : v.severity === 'Moderate' ? 'sev-moderate' : 'sev-minor',
      statusClass: v.status === 'Resolved' ? 'st-resolved' : v.status === 'Warned' ? 'st-warned' : 'st-review'
    }))
  } catch (err) {
    console.error('Failed to fetch violations:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isDean) {
    fetchViolations()
  }
})
</script>

<style scoped>
.violations-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ADDED TOOLBAR */
.toolbar {
  display: flex;
  gap: 12px;
}

.toolbar input,
.toolbar select {
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #000;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B1A;
}

.summary-tags {
  display: flex;
  gap: 12px;
}

.summary-tag {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 10px;
}

.major { background: #FF6B1A; color: #fff; }
.moderate { background: #000; color: #fff; }
.minor { background: #fff; color: #000; border: 1px solid #000; }

.table-card {
  border: 2px solid #000;
  border-radius: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #000;
  color: #fff;
  padding: 12px;
}

.data-table td {
  padding: 14px;
}

.data-table tr:hover {
  background: #fff5ef;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.sev-major { background: #FF6B1A; color: #fff; }
.sev-moderate { background: #000; color: #fff; }
.sev-minor { background: #fff; color: #000; border: 1px solid #000; }

.st-review { background: #FF6B1A; color: #fff; }
.st-warned { background: #000; color: #fff; }
.st-resolved { background: #fff; color: #000; border: 1px solid #000; }

.review-btn {
  background: #000;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
}

.review-btn:hover {
  background: #FF6B1A;
}
</style>s