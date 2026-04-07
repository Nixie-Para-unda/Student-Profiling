<template>
  <div class="dashboard-home">
    <div class="hero-banner">
      <div class="hero-bg-shape shape-1"></div>
      <div class="hero-bg-shape shape-2"></div>
      <div class="hero-body">
        <div class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">{{ greeting }} 👋</h2>
          <p class="hero-desc">There are <strong>{{ secStats.pendingAccounts }} pending account requests</strong> and <strong>{{ secStats.pendingVerifications }} achievements</strong> awaiting verification today.</p>
          <div class="hero-actions">
            <router-link to="/students" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              Student Accounts
            </router-link>
            <router-link to="/secretary/reports" class="hero-btn-ghost">Generate Report</router-link>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Total Students</span><span class="hsc-value">{{ secStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Pending</span><span class="hsc-value">{{ secStats.pendingAccounts }}</span><span class="hsc-sub">Account requests</span></div>
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
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Recent Account Requests</h3><p class="card-sub">Pending student & faculty accounts</p></div>
          <router-link to="/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="req in secAccountRequests" :key="req.name">
            <div class="student-avatar" :style="{ background: req.color }">{{ req.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ req.name }}</p><p class="student-course">{{ req.type }} · {{ req.course }}</p></div>
            <span class="student-tag tag-orange">{{ req.status }}</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          <span>{{ secStats.pendingAccounts }} accounts awaiting creation</span>
          <button>Create Now →</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Faculty Workload</h3><p class="card-sub">Schedules & course loads</p></div>
          <router-link to="/faculty" class="card-link">View all →</router-link>
        </div>
        <div class="faculty-subjects-list">
          <div class="faculty-subject-row" v-for="f in secFacultyWorkload" :key="f.name">
            <div class="fsubj-left">
              <div class="fsubj-icon" :style="{ background: f.color + '18', color: f.color }">
                <svg viewBox="0 0 18 18" fill="none"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              </div>
              <div class="fsubj-info"><p class="fsubj-code">{{ f.name }}</p><p class="fsubj-name">{{ f.department }}</p></div>
            </div>
            <div class="fsubj-right">
              <span class="fsubj-section">{{ f.subjects }} courses</span>
              <span class="fsubj-enrolled">{{ f.students }} students</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Achievement Verification</h3><p class="card-sub">Pending awards to verify</p></div>
          <router-link to="/secretary/achievements" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="ach in secPendingAchievements" :key="ach.student">
            <div class="student-avatar" :style="{ background: ach.color }">{{ ach.student.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ ach.student }}</p><p class="student-course">{{ ach.achievement }}</p></div>
            <span class="student-tag tag-orange">Pending</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6-4-2.9h4.5L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>{{ secStats.pendingVerifications }} achievements need verification</span>
          <button>Verify Now →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  let timeMsg = 'morning'
  if (hour >= 12 && hour < 18) timeMsg = 'afternoon'
  else if (hour >= 18 || hour < 5) timeMsg = 'evening'
  
  const faculty = authStore.user?.faculty
  if (faculty) {
    const title = faculty.title ? faculty.title + ' ' : ''
    const lastName = faculty.last_name || ''
    return `Good ${timeMsg}, ${title}${lastName}`
  }
  
  return `Good ${timeMsg}, Secretary`
})

const secStats = ref({ totalStudents: 842, totalFaculty: 38, pendingAccounts: 5, pendingVerifications: 8 })
const secAccountRequests = ref([
  { name: 'Juan dela Cruz', type: 'Student', course: 'BSCS', status: 'Pending', color: '#FF6B1A' },
  { name: 'Ana Reyes', type: 'Student', course: 'BSIT', status: 'Pending', color: '#3b82f6' },
  { name: 'Prof. R. Santos', type: 'Faculty', course: 'CCS Dept', status: 'Pending', color: '#8b5cf6' },
  { name: 'Maria Cruz', type: 'Student', course: 'BSCS', status: 'Pending', color: '#10b981' }
])
const secFacultyWorkload = ref([
  { name: 'Dr. R. Villanueva', department: 'CS Department', subjects: 3, students: 95, color: '#FF6B1A' },
  { name: 'Prof. A. Reyes', department: 'CS Department', subjects: 2, students: 70, color: '#3b82f6' },
  { name: 'Dr. J. Cruz', department: 'Math Department', subjects: 4, students: 140, color: '#8b5cf6' },
  { name: 'Prof. L. Garcia', department: 'CS Department', subjects: 2, students: 65, color: '#10b981' }
])
const secPendingAchievements = ref([
  { student: 'Aira Mae Reyes', achievement: "Dean's List Nomination", color: '#f59e0b' },
  { student: 'Jose Miguel Cruz', achievement: 'Best Research Paper', color: '#3b82f6' },
  { student: 'Katrina Villanueva', achievement: 'Leadership Award', color: '#10b981' },
  { student: 'Mark Dela Cruz', achievement: "Dean's List Nomination", color: '#8b5cf6' }
])
const stats = ref([
  { label: 'Total Students', value: '842', delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Total Faculty', value: '38', delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Pending Accounts', value: '5', delta: 'To create', deltaClass: 'warning', fill: '30%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/students', iconPath: '<path d="M9 1v10M9 1L6 4M9 1l3 3M2 13h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { label: 'Pending Verify', value: '8', delta: 'Achievements', deltaClass: 'warning', fill: '40%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/secretary/achievements', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { label: 'Dept Reports', value: '12', delta: 'Generated', deltaClass: 'positive', fill: '80%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/secretary/reports', iconPath: '<path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
])

onMounted(async () => {
  try {
    const response = await axios.get('/analytics/summary')
    const data = response.data
    
    secStats.value = {
      totalStudents: data.total_students,
      totalFaculty: data.total_faculty,
      pendingAccounts: data.pending_accounts,
      pendingVerifications: data.pending_verifications
    }

    secAccountRequests.value = data.account_requests
    secFacultyWorkload.value = data.faculty_workload
    secPendingAchievements.value = data.pending_achievements

    stats.value = [
      { label: 'Total Students', value: data.total_students.toString(), delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
      { label: 'Total Faculty', value: data.total_faculty.toString(), delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
      { label: 'Pending Accounts', value: data.pending_accounts.toString(), delta: 'To create', deltaClass: 'warning', fill: (data.pending_accounts > 0 ? '30%' : '0%'), iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/students', iconPath: '<path d="M9 1v10M9 1L6 4M9 1l3 3M2 13h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
      { label: 'Pending Verify', value: data.pending_verifications.toString(), delta: 'Achievements', deltaClass: 'warning', fill: (data.pending_verifications > 0 ? '40%' : '0%'), iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/secretary/achievements', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
      { label: 'Dept Reports', value: '12', delta: 'Generated', deltaClass: 'positive', fill: '80%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/secretary/reports', iconPath: '<path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
    ]
  } catch (err) {
    console.error('Failed to fetch secretary summary:', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.dashboard-home{display:flex;flex-direction:column;gap:0}.hero-banner{background:linear-gradient(130deg,#1a0a00 0%,#3d1500 55%,#FF6B1A 130%);border-radius:20px;padding:28px 32px;position:relative;overflow:hidden;margin-bottom:20px}.hero-bg-shape{position:absolute;border-radius:50%;pointer-events:none}.shape-1{width:320px;height:320px;background:rgba(255,107,26,.15);top:-100px;right:-80px;filter:blur(60px)}.shape-2{width:200px;height:200px;background:rgba(255,255,255,.05);bottom:-60px;left:40%;filter:blur(40px)}.hero-body{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px}.hero-eyebrow{display:flex;align-items:center;gap:7px;font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}.eyebrow-dot{width:6px;height:6px;background:#FF6B1A;border-radius:50%;box-shadow:0 0 8px #FF6B1A}.hero-greeting{font-family:'Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:700;color:#fff;letter-spacing:-.5px;margin-bottom:8px}.hero-desc{font-size:13.5px;color:rgba(255,255,255,.55);line-height:1.6;max-width:400px;margin-bottom:20px}.hero-desc strong{color:rgba(255,255,255,.85);font-weight:500}.hero-actions{display:flex;gap:10px}.hero-btn-primary{display:flex;align-items:center;gap:8px;background:#FF6B1A;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:600;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;box-shadow:0 4px 16px rgba(255,107,26,.4);text-decoration:none}.hero-btn-primary:hover{background:#e85500;transform:translateY(-1px)}.hero-btn-ghost{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 18px;font-size:13px;font-weight:500;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;backdrop-filter:blur(8px);text-decoration:none}.hero-right{display:flex;gap:12px;flex-shrink:0}.hero-stat-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px 20px;display:flex;flex-direction:column;gap:2px;backdrop-filter:blur(8px);min-width:100px}.hero-stat-card.accent{background:rgba(255,107,26,.2);border-color:rgba(255,107,26,.3)}.hsc-label{font-size:10px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.6px}.hsc-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin-top:4px}.hsc-sub{font-size:10px;color:rgba(255,255,255,.4);margin-top:2px}.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:20px}.stat-card{background:#fff;border:1px solid #f0e8e0;border-radius:16px;padding:18px 18px 14px;transition:all .2s}.stat-card.clickable{cursor:pointer}.stat-card.clickable:hover{border-color:#FF6B1A;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,26,.1)}.stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}.stat-label{font-size:10px;font-weight:600;color:#9a8070;text-transform:uppercase;letter-spacing:.6px;line-height:1.4;max-width:80px}.stat-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.stat-icon svg{width:16px;height:16px}.stat-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:4px;margin-bottom:12px}.stat-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:#1a0a00;line-height:1}.stat-delta{font-size:10px;font-weight:600;padding:2px 6px;border-radius:5px;white-space:nowrap}.stat-delta.positive{background:#f0fdf4;color:#16a34a}.stat-delta.negative{background:#fff1f2;color:#e11d48}.stat-delta.warning{background:#fff5ef;color:#c94000}.stat-bar{height:3px;background:#f0e8e0;border-radius:2px;overflow:hidden}.stat-bar-fill{height:100%;border-radius:2px;transition:width 1s ease}.bottom-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:20px}.card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;padding:22px}.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}.card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;color:#1a0a00}.card-sub{font-size:11px;color:#b89f90;margin-top:3px}.card-link{font-size:11px;font-weight:600;color:#FF6B1A;text-decoration:none;white-space:nowrap;background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif}.student-list{display:flex;flex-direction:column;gap:10px}.student-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;transition:background .15s}.student-row:hover{background:#faf8f6}.student-avatar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}.student-info{flex:1;min-width:0}.student-name{font-size:12px;font-weight:600;color:#1a0a00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.student-course{font-size:10px;color:#b89f90}.student-tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;white-space:nowrap}.tag-orange{background:#fff5ef;color:#c94000}.faculty-subjects-list{display:flex;flex-direction:column;gap:10px}.faculty-subject-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid #f0e8e0;border-radius:12px;transition:all .15s}.faculty-subject-row:hover{border-color:#FF6B1A;background:#fffaf8}.fsubj-left{display:flex;align-items:center;gap:10px}.fsubj-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.fsubj-icon svg{width:16px;height:16px}.fsubj-code{font-size:11px;font-weight:700;color:#FF6B1A}.fsubj-name{font-size:12px;font-weight:500;color:#1a0a00;margin-top:1px}.fsubj-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px}.fsubj-section{font-size:11px;font-weight:600;color:#1a0a00}.fsubj-enrolled{font-size:10px;color:#b89f90}.violation-alert{margin-top:16px;padding:12px;background:#1a0a00;border-radius:12px;display:flex;align-items:center;gap:10px;color:#fff;font-size:11px}.violation-alert svg{width:14px;height:14px;color:#FF6B1A}.violation-alert span{flex:1}.violation-alert button{background:none;border:none;color:#FF6B1A;font-size:11px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(3,1fr)}.bottom-grid{grid-template-columns:1fr 1fr}}@media(max-width:900px){.hero-body{flex-direction:column;align-items:flex-start;gap:20px}.hero-right{width:100%}.hero-greeting{font-size:22px}.hero-desc{max-width:100%}.stats-grid{grid-template-columns:repeat(2,1fr)}.bottom-grid{grid-template-columns:1fr}}@media(max-width:600px){.hero-banner{padding:20px;border-radius:16px}.hero-greeting{font-size:20px}.hero-actions{flex-direction:column;width:100%}.hero-btn-primary,.hero-btn-ghost{width:100%;justify-content:center}.hero-right{flex-direction:column}.hero-stat-card{width:100%}.stats-grid{grid-template-columns:1fr 1fr;gap:10px}.stat-card{padding:12px}.stat-value{font-size:22px}.bottom-grid{gap:12px}.card{padding:16px;border-radius:16px}}
</style>