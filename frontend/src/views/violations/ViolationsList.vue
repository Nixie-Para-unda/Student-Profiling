<template>
  <div class="violations-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Student Violations</h2>
        <p class="section-desc">Monitor and review all disciplinary cases in the department.</p>
      </div>
      <div class="header-right">
        <div class="summary-tags">
          <div class="summary-tag major">Major: <strong>2</strong></div>
          <div class="summary-tag moderate">Moderate: <strong>4</strong></div>
          <div class="summary-tag minor">Minor: <strong>6</strong></div>
        </div>
      </div>
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
          <tr v-for="v in cases" :key="v.name">
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const cases = ref([])

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
      color: v.severity === 'Major' ? '#ef4444' : v.severity === 'Moderate' ? '#f59e0b' : '#3b82f6',
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
}

.section-desc {
  font-size: 13px;
  color: #b89f90;
  margin-top: 4px;
}

.summary-tags {
  display: flex;
  gap: 12px;
}

.summary-tag {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
}

.summary-tag strong { font-weight: 700; }

.major { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.moderate { background: #fff7ed; color: #ea580c; border-color: #ffedd5; }
.minor { background: #fffbeb; color: #d97706; border-color: #fef3c7; }

.table-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 16px 24px;
  background: #faf8f6;
  font-size: 11px;
  font-weight: 700;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #f0e8e0;
}

.data-table td {
  padding: 18px 24px;
  font-size: 13px;
  color: #1a0a00;
  border-bottom: 1px solid #faf8f6;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.student-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 13px;
}
.name { font-weight: 600; }

.col-type { color: #9a8070; }
.col-date { color: #b89f90; font-size: 12px; }

.severity-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
}

.sev-major { background: #fff1f2; color: #e11d48; }
.sev-moderate { background: #fff7ed; color: #ea580c; }
.sev-minor { background: #fffbeb; color: #d97706; }

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.st-review { background: #fff1f2; color: #e11d48; }
.st-warned { background: #fff7ed; color: #ea580c; }
.st-resolved { background: #f0fdf4; color: #16a34a; }

.review-btn {
  background: #fff5ef;
  color: #FF6B1A;
  border: 1px solid #ffd5b0;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.review-btn:hover {
  background: #FF6B1A;
  color: #fff;
  border-color: #FF6B1A;
}
</style>
