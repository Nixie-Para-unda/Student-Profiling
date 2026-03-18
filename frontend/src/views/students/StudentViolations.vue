<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Violation Records</h2><p class="page-sub">Your disciplinary history this academic year.</p></div>
    </div>
    <div class="pcard">
      <div class="pcard-body">
        <div v-if="violations.length === 0" class="empty-clean">
          <div class="clean-icon">
            <svg viewBox="0 0 48 48" fill="none" style="width:48px;height:48px"><circle cx="24" cy="24" r="20" stroke="#10b981" stroke-width="2"/><path d="M16 24l6 6 10-10" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p class="clean-title">No violations on record.</p>
          <p class="clean-sub">Keep up the great behavior!</p>
        </div>
        <div v-else class="violation-list">
          <div class="violation-row" v-for="v in violations" :key="v.type">
            <div class="v-avatar">!</div>
            <div class="v-info">
              <p class="v-type">{{ v.type }}</p>
              <p class="v-date">{{ v.date }}</p>
            </div>
            <div class="v-right">
              <span class="sev-badge" :class="v.severityClass">{{ v.severity }}</span>
              <span class="v-status" :class="v.resolved ? 'resolved' : 'pending'">{{ v.resolved ? 'Resolved' : 'Pending' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Replace with real API call when backend is ready
const violations = ref([])
// Example: violations.value = [{ type: 'Excessive Absences', date: 'Feb 12, 2026', severity: 'Moderate', severityClass: 'sev-moderate', resolved: false }]
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-body { padding: 22px; }
.empty-clean { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 12px; }
.clean-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #10b981; }
.clean-sub { font-size: 13px; color: #b89f90; }
.violation-list { display: flex; flex-direction: column; gap: 12px; }
.violation-row { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #fff1f2; border-radius: 14px; background: #fffafa; }
.v-avatar { width: 40px; height: 40px; border-radius: 10px; background: #ef4444; color: #fff; font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.v-info { flex: 1; }
.v-type { font-size: 14px; font-weight: 600; color: #1a0a00; }
.v-date { font-size: 12px; color: #b89f90; margin-top: 2px; }
.v-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.sev-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
.sev-major { background: #fff1f2; color: #e11d48; }
.sev-moderate { background: #fff7ed; color: #ea580c; }
.sev-minor { background: #fffbeb; color: #d97706; }
.v-status { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
.resolved { background: #f0fdf4; color: #16a34a; }
.pending { background: #fef3c7; color: #d97706; }
</style>