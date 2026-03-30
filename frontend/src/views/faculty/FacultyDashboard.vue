<template>
  <div class="dashboard-home">
    <div class="hero-banner">
      <div class="hero-bg-shape shape-1"></div>
      <div class="hero-bg-shape shape-2"></div>
      <div class="hero-body">
        <div class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Professor' }} 👋</h2>
          <p class="hero-desc">You have <strong>{{ facultyStats.totalSubjects }} subjects</strong> this semester with <strong>{{ facultyStats.totalStudents }} enrolled students</strong> across all your classes.</p>
          <div class="hero-actions">
            <router-link to="/faculty/schedule" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 1v4M12 1v4M2 7h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              My Schedule
            </router-link>
            <router-link to="/faculty/students" class="hero-btn-ghost">View My Students</router-link>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Subjects</span><span class="hsc-value">{{ facultyStats.totalSubjects }}</span><span class="hsc-sub">This semester</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Students</span><span class="hsc-value">{{ facultyStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
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
          <div><h3 class="card-title">Today's Teaching Schedule</h3><p class="card-sub">{{ todayLabel }}</p></div>
          <router-link to="/faculty/schedule" class="card-link">View all →</router-link>
        </div>
        <div class="schedule-list">
          <div class="schedule-row" v-for="cls in facultyScheduleToday" :key="cls.subject">
            <div class="schedule-time-col">
              <span class="schedule-time">{{ cls.time }}</span>
              <span class="schedule-duration">{{ cls.duration }}</span>
            </div>
            <div class="schedule-dot-col">
              <div class="schedule-dot" :style="{ background: cls.color }"></div>
              <div class="schedule-line"></div>
            </div>
            <div class="schedule-info">
              <p class="schedule-subject">{{ cls.subject }}</p>
              <p class="schedule-prof">{{ cls.section }} · {{ cls.room }}</p>
            </div>
            <span class="schedule-type-badge" :style="{ background: cls.color + '20', color: cls.color }">{{ cls.enrolled }} students</span>
          </div>
          <div v-if="facultyScheduleToday.length === 0" class="empty-small">No classes today.</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Student Performance</h3><p class="card-sub">Top students across my classes</p></div>
          <router-link to="/faculty/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in facultyTopStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ s.name }}</p><p class="student-course">{{ s.subject }}</p></div>
            <span class="student-tag tag-green">{{ s.grade }}</span>
          </div>
        </div>
        <div class="violations-mini">
          <div class="vm-header"><span class="vm-label">Pending Actions</span></div>
          <div class="pending-actions-list">
            <div class="pending-action-row" v-for="action in facultyPendingActions" :key="action.label">
              <div class="pending-dot" :style="{ background: action.color }"></div>
              <span class="pending-text">{{ action.label }}</span>
              <span class="pending-badge" :style="{ background: action.color + '18', color: action.color }">{{ action.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Courses I Teach</h3><p class="card-sub">Current semester workload</p></div>
          <router-link to="/faculty/subjects" class="card-link">View all →</router-link>
        </div>
        <div class="faculty-subjects-list">
          <div class="faculty-subject-row" v-for="subj in facultySubjects" :key="subj.code">
            <div class="fsubj-left">
              <div class="fsubj-icon" :style="{ background: subj.color + '18', color: subj.color }">
                <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              </div>
              <div class="fsubj-info">
                <p class="fsubj-code">{{ subj.code }}</p>
                <p class="fsubj-name">{{ subj.name }}</p>
              </div>
            </div>
            <div class="fsubj-right">
              <span class="fsubj-section">{{ subj.section }}</span>
              <span class="fsubj-enrolled">{{ subj.enrolled }} students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const facultyStats = ref({ totalSubjects: 0, totalStudents: 0 })
const facultyScheduleToday = ref([])
const facultyTopStudents = ref([])
const facultyPendingActions = ref([])
const facultySubjects = ref([])

const todayLabel = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))

const stats = ref([
  { label: 'My Subjects', value: '0', delta: 'This semester', deltaClass: 'positive', fill: '0%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/faculty/subjects', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Total Students', value: '0', delta: 'Enrolled', deltaClass: 'positive', fill: '0%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/faculty/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Avg Class GWA', value: 'N/A', delta: 'All classes', deltaClass: 'positive', fill: '0%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { label: 'Violations Filed', value: '0', delta: 'This semester', deltaClass: 'negative', fill: '0%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/faculty/violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { label: 'Awards Given', value: '0', delta: 'Recommended', deltaClass: 'positive', fill: '0%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/faculty/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' }
])

onMounted(async () => {
  try {
    const response = await axios.get('/analytics/faculty')
    const data = response.data
    
    facultyStats.value = {
      totalSubjects: data.total_subjects,
      totalStudents: data.total_students
    }
    
    facultyScheduleToday.value = data.today_schedule
    facultyTopStudents.value = data.top_students
    facultyPendingActions.value = data.pending_actions
    facultySubjects.value = data.subjects

    stats.value[0].value = data.total_subjects.toString()
    stats.value[0].fill = data.total_subjects > 0 ? '80%' : '0%'
    
    stats.value[1].value = data.total_students.toString()
    stats.value[1].fill = '100%'
    
    // Average Class GWA (using top students average for now as a demo)
    if (data.top_students.length > 0) {
      const avg = data.top_students.reduce((acc, s) => acc + parseFloat(s.grade), 0) / data.top_students.length
      stats.value[2].value = avg.toFixed(2)
      stats.value[2].fill = '75%'
    }

    stats.value[3].value = data.pending_actions.find(a => a.label === 'Violation reports')?.count.toString() || '0'
    stats.value[4].value = data.pending_actions.find(a => a.label === 'Award recommendations')?.count.toString() || '0'
    
  } catch (err) {
    console.error('Failed to fetch faculty summary:', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.dashboard-home{display:flex;flex-direction:column;gap:0}.hero-banner{background:linear-gradient(130deg,#1a0a00 0%,#3d1500 55%,#FF6B1A 130%);border-radius:20px;padding:28px 32px;position:relative;overflow:hidden;margin-bottom:20px}.hero-bg-shape{position:absolute;border-radius:50%;pointer-events:none}.shape-1{width:320px;height:320px;background:rgba(255,107,26,.15);top:-100px;right:-80px;filter:blur(60px)}.shape-2{width:200px;height:200px;background:rgba(255,255,255,.05);bottom:-60px;left:40%;filter:blur(40px)}.hero-body{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px}.hero-eyebrow{display:flex;align-items:center;gap:7px;font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}.eyebrow-dot{width:6px;height:6px;background:#FF6B1A;border-radius:50%;box-shadow:0 0 8px #FF6B1A}.hero-greeting{font-family:'Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:700;color:#fff;letter-spacing:-.5px;margin-bottom:8px}.hero-desc{font-size:13.5px;color:rgba(255,255,255,.55);line-height:1.6;max-width:400px;margin-bottom:20px}.hero-desc strong{color:rgba(255,255,255,.85);font-weight:500}.hero-actions{display:flex;gap:10px}.hero-btn-primary{display:flex;align-items:center;gap:8px;background:#FF6B1A;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:600;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;box-shadow:0 4px 16px rgba(255,107,26,.4);text-decoration:none}.hero-btn-primary:hover{background:#e85500;transform:translateY(-1px)}.hero-btn-ghost{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px 18px;font-size:13px;font-weight:500;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;backdrop-filter:blur(8px);text-decoration:none}.hero-btn-ghost:hover{background:rgba(255,255,255,.18)}.hero-right{display:flex;gap:12px;flex-shrink:0}.hero-stat-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px 20px;display:flex;flex-direction:column;gap:2px;backdrop-filter:blur(8px);min-width:100px}.hero-stat-card.accent{background:rgba(255,107,26,.2);border-color:rgba(255,107,26,.3)}.hsc-label{font-size:10px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.6px}.hsc-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin-top:4px}.hsc-sub{font-size:10px;color:rgba(255,255,255,.4);margin-top:2px}.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:20px}.stat-card{background:#fff;border:1px solid #f0e8e0;border-radius:16px;padding:18px 18px 14px;transition:all .2s}.stat-card.clickable{cursor:pointer}.stat-card.clickable:hover{border-color:#FF6B1A;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,26,.1)}.stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}.stat-label{font-size:10px;font-weight:600;color:#9a8070;text-transform:uppercase;letter-spacing:.6px;line-height:1.4;max-width:80px}.stat-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.stat-icon svg{width:16px;height:16px}.stat-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:4px;margin-bottom:12px}.stat-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:#1a0a00;line-height:1}.stat-delta{font-size:10px;font-weight:600;padding:2px 6px;border-radius:5px;white-space:nowrap}.stat-delta.positive{background:#f0fdf4;color:#16a34a}.stat-delta.negative{background:#fff1f2;color:#e11d48}.stat-bar{height:3px;background:#f0e8e0;border-radius:2px;overflow:hidden}.stat-bar-fill{height:100%;border-radius:2px;transition:width 1s ease}.bottom-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:20px}.card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;padding:22px}.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}.card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;color:#1a0a00}.card-sub{font-size:11px;color:#b89f90;margin-top:3px}.card-link{font-size:11px;font-weight:600;color:#FF6B1A;text-decoration:none;white-space:nowrap;background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif}.card-link:hover{text-decoration:underline}.student-list{display:flex;flex-direction:column;gap:10px}.student-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;transition:background .15s}.student-row:hover{background:#faf8f6}.rank{font-size:11px;font-weight:700;color:#ddd0c8;width:14px;flex-shrink:0;text-align:center}.student-avatar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}.student-info{flex:1;min-width:0}.student-name{font-size:12px;font-weight:600;color:#1a0a00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.student-course{font-size:10px;color:#b89f90}.student-tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;white-space:nowrap}.tag-green{background:#f0fdf4;color:#16a34a}.schedule-list{display:flex;flex-direction:column}.schedule-row{display:flex;align-items:flex-start;gap:10px;padding:10px 0}.schedule-time-col{width:64px;flex-shrink:0}.schedule-time{display:block;font-size:11px;font-weight:700;color:#1a0a00}.schedule-duration{font-size:9px;color:#b89f90}.schedule-dot-col{display:flex;flex-direction:column;align-items:center;width:18px;flex-shrink:0;padding-top:3px}.schedule-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.schedule-line{flex:1;width:2px;background:#f0e8e0;margin-top:4px;min-height:20px}.schedule-row:last-child .schedule-line{display:none}.schedule-info{flex:1;min-width:0}.schedule-subject{font-size:12px;font-weight:600;color:#1a0a00}.schedule-prof{font-size:10px;color:#b89f90;margin-top:2px}.schedule-type-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;white-space:nowrap;align-self:flex-start;margin-top:3px}.violations-mini{border-top:1px solid #f0e8e0;padding-top:14px;margin-top:10px}.vm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.vm-label{font-size:11px;font-weight:700;color:#1a0a00;text-transform:uppercase;letter-spacing:.5px}.pending-actions-list{display:flex;flex-direction:column;gap:8px}.pending-action-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:9px;background:#faf8f6}.pending-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.pending-text{flex:1;font-size:12px;color:#1a0a00;font-weight:500}.pending-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px}.faculty-subjects-list{display:flex;flex-direction:column;gap:10px}.faculty-subject-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid #f0e8e0;border-radius:12px;transition:all .15s}.faculty-subject-row:hover{border-color:#FF6B1A;background:#fffaf8}.fsubj-left{display:flex;align-items:center;gap:10px}.fsubj-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.fsubj-icon svg{width:16px;height:16px}.fsubj-code{font-size:11px;font-weight:700;color:#FF6B1A}.fsubj-name{font-size:12px;font-weight:500;color:#1a0a00;margin-top:1px}.fsubj-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px}.fsubj-section{font-size:11px;font-weight:600;color:#1a0a00}.fsubj-enrolled{font-size:10px;color:#b89f90}.empty-small{font-size:12px;color:#b89f90;font-style:italic;padding:8px 0}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(3,1fr)}.bottom-grid{grid-template-columns:1fr 1fr}}@media(max-width:900px){.hero-body{flex-direction:column;align-items:flex-start;gap:20px}.hero-right{width:100%}.hero-greeting{font-size:22px}.hero-desc{max-width:100%}.stats-grid{grid-template-columns:repeat(2,1fr)}.bottom-grid{grid-template-columns:1fr}}@media(max-width:600px){.hero-banner{padding:20px;border-radius:16px}.hero-greeting{font-size:20px}.hero-actions{flex-direction:column;width:100%}.hero-btn-primary,.hero-btn-ghost{width:100%;justify-content:center}.hero-right{flex-direction:column}.hero-stat-card{width:100%}.stats-grid{grid-template-columns:1fr 1fr;gap:10px}.stat-card{padding:12px}.stat-value{font-size:22px}.bottom-grid{gap:12px}.card{padding:16px;border-radius:16px}}
</style>