<template>
  <div class="dashboard-home">
    <div class="hero-banner">
      <div class="hero-bg-shape shape-1"></div>
      <div class="hero-bg-shape shape-2"></div>
      <div class="hero-body">
        <div class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Chair' }} 👋</h2>
          <p class="hero-desc">Department avg GWA is <strong>{{ chairStats.avgGwa }}</strong>. You have <strong>{{ chairStats.pendingAwards }} awards</strong> awaiting approval and <strong>{{ chairStats.activeViolations }} active violations</strong> this semester.</p>
          <div class="hero-actions">
            <router-link to="/students" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              View Students
            </router-link>
            <router-link to="/chair/reports" class="hero-btn-ghost">Generate Report</router-link>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Total Students</span><span class="hsc-value">{{ chairStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Avg GWA</span><span class="hsc-value">{{ chairStats.avgGwa }}</span><span class="hsc-sub">Department</span></div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label" @click="stat.route && $router.push(stat.route)" :class="{ clickable: stat.route }">
        <div class="stat-top">
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-icon" :style="{ background: stat.iconBg, color: stat.iconColor }">
            <component :is="'svg'" viewBox="0 0 18 18" fill="none" v-html="stat.iconPath"></component>
          </div>
        </div>
        <div class="stat-bottom">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-delta" :class="stat.deltaClass">{{ stat.delta }}</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill" :style="{ width: stat.fill, background: stat.iconColor }"></div></div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card chart-card">
        <div class="card-header">
          <div><h3 class="card-title">Academic Performance Trends</h3><p class="card-sub">Department avg GWA per semester</p></div>
          <router-link to="/chair/performance" class="card-link">Full report →</router-link>
        </div>
        <div class="chart-bars">
          <div class="chart-bar-col" v-for="(bar, i) in chairChartData" :key="i">
            <div class="chart-bar-wrap">
              <div class="chart-bar-fill" :class="{ current: i === chairChartData.length - 1 }" :style="{ height: bar.pct + '%' }">
                <span class="chart-tooltip">{{ bar.sem }}: {{ bar.gwa }}</span>
              </div>
            </div>
            <span class="chart-bar-label">{{ bar.sem }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot current"></span><span class="legend-text">Current sem</span>
          <span class="legend-dot"></span><span class="legend-text">Previous</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Top Performing Students</h3><p class="card-sub">Ranked by GWA · current semester</p></div>
          <router-link to="/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in chairTopStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ s.name }}</p><p class="student-course">{{ s.course }}</p></div>
            <span class="student-tag tag-green">{{ s.tag }}</span>
            <span class="student-gwa">{{ s.gwa }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Pending Award Approvals</h3><p class="card-sub">Awaiting your review</p></div>
          <router-link to="/chair/awards" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="ach in chairPendingAwards" :key="ach.student">
            <div class="student-avatar" :style="{ background: ach.color }">{{ ach.student.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ ach.student }}</p><p class="student-course">{{ ach.award }}</p></div>
            <span class="student-tag tag-orange">Pending</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6-4-2.9h4.5L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>{{ chairStats.pendingAwards }} awards need your approval</span>
          <router-link to="/chair/awards" style="background:none;border:none;color:#FF6B1A;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none">Approve Now →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const chairStats = ref({ totalStudents: 842, totalFaculty: 38, avgGwa: '1.87', activeViolations: 12, pendingAwards: 5 })
const chairTopStudents = ref([
  { name: 'Aira Mae Reyes', course: 'BSCS', gwa: '1.21', color: '#f59e0b', tag: "Dean's List" },
  { name: 'Jose Miguel Cruz', course: 'BSIT', gwa: '1.34', color: '#3b82f6', tag: "Dean's List" },
  { name: 'Katrina Villanueva', course: 'BSCS', gwa: '1.38', color: '#10b981', tag: "Dean's List" }
])
const chairPendingAwards = ref([
  { student: 'Aira Mae Reyes', award: "Dean's List Nomination", color: '#f59e0b' },
  { student: 'Jose Miguel Cruz', award: 'Best Research Paper', color: '#3b82f6' },
  { student: 'Mark Dela Cruz', award: "Dean's List Nomination", color: '#8b5cf6' }
])
const chairChartData = ref([
  { sem: "1st '22", gwa: 2.14, pct: 38 }, { sem: "2nd '22", gwa: 2.08, pct: 50 },
  { sem: "1st '23", gwa: 2.01, pct: 60 }, { sem: "2nd '23", gwa: 1.96, pct: 68 },
  { sem: "1st '24", gwa: 1.91, pct: 75 }, { sem: "2nd '24", gwa: 1.87, pct: 85 }
])
const stats = ref([
  { label: 'Total Students', value: '842', delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Total Faculty', value: '38', delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Dept Avg GWA', value: '1.87', delta: 'This semester', deltaClass: 'positive', fill: '75%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/chair/performance', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { label: 'Active Violations', value: '12', delta: 'This semester', deltaClass: 'negative', fill: '20%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/chair/violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Pending Awards', value: '5', delta: 'To approve', deltaClass: 'warning', fill: '35%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/chair/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' }
])

onMounted(async () => {
  try {
    const response = await axios.get('/analytics/summary')
    const data = response.data
    chairStats.value.totalStudents = data.total_students
    chairStats.value.totalFaculty = data.total_faculty
    chairStats.value.avgGwa = data.dept_avg_gwa.toFixed(2)
    chairStats.value.activeViolations = data.active_violations
    stats.value[0].value = data.total_students.toString()
    stats.value[1].value = data.total_faculty.toString()
    stats.value[2].value = data.dept_avg_gwa.toFixed(2)
    stats.value[3].value = data.active_violations.toString()
  } catch (err) {
    console.error('Failed to fetch chair summary:', err)
  }
})
</script>

<style scoped>
.dashboard-home{display:flex;flex-direction:column;gap:0}.hero-banner{background:linear-gradient(130deg,#1a0a00 0%,#3d1500 55%,#FF6B1A 130%);border-radius:20px;padding:28px 32px;position:relative;overflow:hidden;margin-bottom:20px}.hero-bg-shape{position:absolute;border-radius:50%;pointer-events:none}.shape-1{width:320px;height:320px;background:rgba(255,107,26,.15);top:-100px;right:-80px;filter:blur(60px)}.shape-2{width:200px;height:200px;background:rgba(255,255,255,.05);bottom:-60px;left:40%;filter:blur(40px)}.hero-body{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px}.hero-eyebrow{display:flex;align-items:center;gap:7px;font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}.eyebrow-dot{width:6px;height:6px;background:#FF6B1A;border-radius:50%;box-shadow:0 0 8px #FF6B1A}.hero-greeting{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:#fff;letter-spacing:-.5px;margin-bottom:8px}.hero-desc{font-size:13.5px;color:rgba(255,255,255,.55);line-height:1.6;max-width:400px;margin-bottom:20px}.hero-desc strong{color:rgba(255,255,255,.85);font-weight:500}.hero-actions{display:flex;gap:10px}.hero-btn-primary{display:flex;align-items:center;gap:8px;background:#FF6B1A;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;box-shadow:0 4px 16px rgba(255,107,26,.4);text-decoration:none}.hero-btn-primary:hover{background:#e85500;transform:translateY(-1px)}.hero-btn-ghost{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 18px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;backdrop-filter:blur(8px);text-decoration:none}.hero-right{display:flex;gap:12px;flex-shrink:0}.hero-stat-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px 20px;display:flex;flex-direction:column;gap:2px;backdrop-filter:blur(8px);min-width:100px}.hero-stat-card.accent{background:rgba(255,107,26,.2);border-color:rgba(255,107,26,.3)}.hsc-label{font-size:10px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.6px}.hsc-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin-top:4px}.hsc-sub{font-size:10px;color:rgba(255,255,255,.4);margin-top:2px}.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:20px}.stat-card{background:#fff;border:1px solid #f0e8e0;border-radius:16px;padding:18px 18px 14px;transition:all .2s}.stat-card.clickable{cursor:pointer}.stat-card.clickable:hover{border-color:#FF6B1A;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,26,.1)}.stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}.stat-label{font-size:10px;font-weight:600;color:#9a8070;text-transform:uppercase;letter-spacing:.6px;line-height:1.4;max-width:80px}.stat-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.stat-icon svg{width:16px;height:16px}.stat-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:4px;margin-bottom:12px}.stat-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#1a0a00;line-height:1}.stat-delta{font-size:10px;font-weight:600;padding:2px 6px;border-radius:5px;white-space:nowrap}.stat-delta.positive{background:#f0fdf4;color:#16a34a}.stat-delta.negative{background:#fff1f2;color:#e11d48}.stat-delta.warning{background:#fff5ef;color:#c94000}.stat-bar{height:3px;background:#f0e8e0;border-radius:2px;overflow:hidden}.stat-bar-fill{height:100%;border-radius:2px;transition:width 1s ease}.bottom-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:20px}.card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;padding:22px}.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}.card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#1a0a00}.card-sub{font-size:11px;color:#b89f90;margin-top:3px}.card-link{font-size:11px;font-weight:600;color:#FF6B1A;text-decoration:none;white-space:nowrap;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}.chart-bars{display:flex;align-items:flex-end;gap:8px;height:140px;padding-bottom:4px}.chart-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;gap:4px}.chart-bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end}.chart-bar-fill{width:100%;background:#fde8d8;border-radius:5px 5px 0 0;transition:height .8s ease;position:relative;cursor:pointer}.chart-bar-fill.current{background:#FF6B1A}.chart-bar-fill:hover .chart-tooltip{opacity:1;transform:translateX(-50%) translateY(0)}.chart-tooltip{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%) translateY(4px);background:#1a0a00;color:#fff;font-size:10px;padding:4px 8px;border-radius:6px;white-space:nowrap;opacity:0;transition:all .15s;pointer-events:none}.chart-bar-label{font-size:8px;color:#b89f90;text-transform:uppercase;letter-spacing:.3px;text-align:center;white-space:nowrap}.chart-legend{display:flex;align-items:center;gap:16px;margin-top:16px}.legend-dot{width:8px;height:8px;border-radius:50%;background:#fde8d8}.legend-dot.current{background:#FF6B1A}.legend-text{font-size:10px;color:#b89f90}.student-list{display:flex;flex-direction:column;gap:10px}.student-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;transition:background .15s}.student-row:hover{background:#faf8f6}.rank{font-size:11px;font-weight:700;color:#ddd0c8;width:14px;flex-shrink:0;text-align:center}.student-avatar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}.student-info{flex:1;min-width:0}.student-name{font-size:12px;font-weight:600;color:#1a0a00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.student-course{font-size:10px;color:#b89f90}.student-tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;white-space:nowrap}.tag-green{background:#f0fdf4;color:#16a34a}.tag-orange{background:#fff5ef;color:#c94000}.student-gwa{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#1a0a00;flex-shrink:0}.violation-alert{margin-top:16px;padding:12px;background:#1a0a00;border-radius:12px;display:flex;align-items:center;gap:10px;color:#fff;font-size:11px}.violation-alert svg{width:14px;height:14px;color:#FF6B1A}.violation-alert span{flex:1}
</style>