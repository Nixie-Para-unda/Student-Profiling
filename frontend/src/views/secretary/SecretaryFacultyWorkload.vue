<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Faculty Workload & Schedules</h2>
        <p class="page-sub">Overview of faculty subject loads and teaching schedules.</p>
      </div>
    </div>

    <!-- Mini Stats -->
    <div class="mini-stats">
      <div class="mini-stat" v-for="s in miniStats" :key="s.label">
        <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="mini-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Faculty Cards -->
    <div class="faculty-grid">
      <div class="faculty-card" v-for="f in faculty" :key="f.id">
        <div class="fc-header">
          <div class="fc-avatar" :style="{ background: f.color }">{{ f.name.charAt(0) }}</div>
          <div class="fc-info">
            <p class="fc-name">{{ f.name }}</p>
            <p class="fc-dept">{{ f.department }}</p>
            <p class="fc-pos">{{ f.position }}</p>
          </div>
          <div class="fc-load" :class="f.units >= 18 ? 'load-full' : f.units >= 12 ? 'load-mid' : 'load-low'">
            <span class="load-num">{{ f.units }}</span>
            <span class="load-label">units</span>
          </div>
        </div>
        <div class="fc-subjects">
          <div class="fc-subject-row" v-for="subj in f.subjects" :key="subj.code">
            <span class="subj-code">{{ subj.code }}</span>
            <span class="subj-name">{{ subj.name }}</span>
            <span class="subj-section">{{ subj.section }}</span>
            <span class="subj-sched">{{ subj.schedule }}</span>
          </div>
        </div>
        <div class="fc-footer">
          <span class="fc-students">{{ f.totalStudents }} students total</span>
          <span class="workload-badge" :class="f.units >= 18 ? 'wl-full' : f.units >= 12 ? 'wl-normal' : 'wl-light'">
            {{ f.units >= 18 ? 'Full Load' : f.units >= 12 ? 'Normal Load' : 'Light Load' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const faculty = ref([])

const miniStats = computed(() => [
  { label: 'Total Faculty', value: faculty.value.length, color: '#FF6B1A' },
  { label: 'Full Load', value: faculty.value.filter(f => f.units >= 18).length, color: '#ef4444' },
  { label: 'Normal Load', value: faculty.value.filter(f => f.units >= 12 && f.units < 18).length, color: '#f59e0b' },
  { label: 'Light Load', value: faculty.value.filter(f => f.units < 12).length, color: '#16a34a' },
  { label: 'Total Subjects', value: faculty.value.reduce((a, f) => a + f.subjects.length, 0), color: '#8b5cf6' }
])
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.mini-stat-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.faculty-grid { display: flex; flex-direction: column; gap: 16px; }
.faculty-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.fc-header { display: flex; align-items: flex-start; gap: 14px; padding: 20px 22px; border-bottom: 1px solid #faf8f6; }
.fc-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0; }
.fc-info { flex: 1; }
.fc-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.fc-dept { font-size: 12px; color: #b89f90; margin-top: 2px; }
.fc-pos { font-size: 11px; color: #9a8070; margin-top: 1px; }
.fc-load { display: flex; flex-direction: column; align-items: center; padding: 8px 16px; border-radius: 12px; }
.fc-load.load-full { background: #fff1f2; }
.fc-load.load-mid { background: #fffbeb; }
.fc-load.load-low { background: #f0fdf4; }
.load-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #1a0a00; }
.load-label { font-size: 9px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.fc-subjects { padding: 8px 0; }
.fc-subject-row { display: grid; grid-template-columns: 80px 1fr 100px 160px; gap: 12px; padding: 10px 22px; border-bottom: 1px solid #faf8f6; align-items: center; }
.fc-subject-row:last-child { border-bottom: none; }
.fc-subject-row:hover { background: #fdf9f7; }
.subj-code { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.subj-name { font-size: 13px; color: #1a0a00; }
.subj-section { font-size: 11px; color: #9a8070; font-weight: 600; }
.subj-sched { font-size: 11px; color: #b89f90; }
.fc-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 22px; background: #faf8f6; }
.fc-students { font-size: 12px; color: #9a8070; }
.workload-badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 7px; }
.wl-full { background: #fff1f2; color: #e11d48; }
.wl-normal { background: #fffbeb; color: #d97706; }
.wl-light { background: #f0fdf4; color: #16a34a; }
</style>