<template>
  <div class="dashboard-home">

    <!-- ═══════════════════════ HERO BANNER ═══════════════════════ -->
    <div class="hero-banner">
      <!-- Ambient glows -->
      <div class="ambient ambient-1"></div>
      <div class="ambient ambient-2"></div>
      <div class="ambient ambient-3"></div>

      <div class="hero-body">
        <!-- LEFT: Greeting & CTA -->
        <div class="hero-left">
          <div class="hero-meta">
            <span class="meta-dot"></span>
            <span>AY 2026–2027 · 2nd Semester</span>
          </div>
          <h1 class="hero-heading">
            Good morning, <span class="hero-name">{{ authStore.user?.name?.split(' ')[0] ?? 'Student' }}</span> <span class="wave">👋</span>
          </h1>
          <div class="hero-chips">
            <span class="hero-chip">
              <svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              {{ todaySchedule.length }} class{{ todaySchedule.length !== 1 ? 'es' : '' }} today
            </span>
          </div>
          <div class="hero-actions">
            <router-link to="/student/schedule" class="btn-primary">
              <svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px">
                <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/>
                <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              View Schedule
            </router-link>
            <router-link to="/student/academic-history" class="btn-ghost">
              <svg viewBox="0 0 16 16" fill="none" style="width:13px;height:13px">
                <path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Academic History
            </router-link>
          </div>
        </div>

        <!-- RIGHT: KPI Tiles -->
        <div class="hero-right">
          <div class="kpi-tile">
            <div class="kpi-tile-header">
              <svg viewBox="0 0 18 18" fill="none" class="kpi-icon">
                <path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="kpi-eyebrow">Current GWA</span>
            </div>
            <span class="kpi-val">{{ studentProfile.gwa || '0.00' }}</span>
            <span class="kpi-foot">This semester</span>
            <div class="kpi-sparkbar">
              <div v-for="(b, i) in studentChartData" :key="i"
                class="kpi-spark-seg"
                :style="{ height: b.pct * 0.28 + 'px', opacity: i === studentChartData.length-1 ? 1 : 0.25 + i*0.1 }">
              </div>
            </div>
          </div>
          <div class="kpi-tile kpi-accent">
            <div class="kpi-tile-header">
              <svg viewBox="0 0 18 18" fill="none" class="kpi-icon">
                <circle cx="9" cy="5" r="3.5" stroke="currentColor" stroke-width="1.4"/>
                <path d="M2 16c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <span class="kpi-eyebrow">Activities</span>
            </div>
            <span class="kpi-val">{{ studentActivities.length }}</span>
            <span class="kpi-foot">Non-academic</span>
            <div class="kpi-ring">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.15)" stroke-width="5"/>
                <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.8)" stroke-width="5"
                  stroke-dasharray="119.4" stroke-dashoffset="40" stroke-linecap="round"
                  transform="rotate(-90 24 24)"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ PROFILE NUDGE ═══════════════════════ -->
    <!--
      Placed between hero and stats — the student sees their summary first,
      then gets a calm, contextual prompt to complete their profile before
      diving into their data. Non-intrusive: no modal, no banner inside the hero.
    -->
    <Transition name="slide-nudge">
      <div v-if="profileIncomplete" class="profile-nudge">
        <div class="nudge-bar-right"></div>
        <div class="nudge-left">
          <div class="nudge-icon">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 17c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <p class="nudge-title">Your profile is incomplete</p>
            <p class="nudge-desc">Add your contact details and address to finish registration.</p>
          </div>
        </div>
        <div class="nudge-progress">
          <div class="nudge-steps">
            <div class="nudge-step done"></div>
            <div class="nudge-step done"></div>
            <div class="nudge-step"></div>
            <div class="nudge-step"></div>
          </div>
          <span class="nudge-progress-label">2 of 4 complete</span>
        </div>
        <router-link to="/student/profile" class="nudge-cta">Complete Profile →</router-link>
      </div>
    </Transition>

    <!-- ═══════════════════════ STATS STRIP ═══════════════════════ -->
    <div class="stats-strip">
      <div
        class="stat-chip"
        v-for="stat in stats"
        :key="stat.label"
        @click="stat.route && $router.push(stat.route)"
        :class="{ 'stat-chip--clickable': stat.route }"
      >
        <div class="sc-icon" :style="{ background: stat.iconBg, color: stat.iconColor }">
          <component :is="'svg'" viewBox="0 0 18 18" fill="none" v-html="stat.iconPath"></component>
        </div>
        <div class="sc-body">
          <span class="sc-label">{{ stat.label }}</span>
          <span class="sc-value">{{ stat.value }}</span>
        </div>
        <span class="sc-badge" :class="stat.deltaClass">{{ stat.delta }}</span>
        <div class="sc-progress">
          <div class="sc-progress-fill" :style="{ width: stat.fill, background: stat.iconColor }"></div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ BOTTOM GRID ═══════════════════════ -->
    <div class="bottom-grid">

      <!-- Today's Schedule -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Today's Schedule</h3>
            <p class="panel-sub">{{ todayLabel }}</p>
          </div>
          <router-link to="/student/schedule" class="panel-link">View all →</router-link>
        </div>
        <div class="timeline">
          <div class="tl-item" v-for="(cls, idx) in todaySchedule" :key="cls.subject">
            <div class="tl-time">
              <span class="tl-t">{{ cls.time }}</span>
              <span class="tl-dur">{{ cls.duration }}</span>
            </div>
            <div class="tl-track">
              <div class="tl-node" :style="{ background: cls.color }"></div>
              <div class="tl-rail" v-if="idx < todaySchedule.length - 1"></div>
            </div>
            <div class="tl-content">
              <p class="tl-subject">{{ cls.subject }}</p>
              <p class="tl-meta">{{ cls.professor }} · {{ cls.room }}</p>
              <span class="tl-badge" :style="{ background: cls.color + '18', color: cls.color }">{{ cls.type }}</span>
            </div>
          </div>
          <div v-if="todaySchedule.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px;opacity:.25">
              <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" stroke-width="1.4"/>
              <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <span>No classes today</span>
          </div>
        </div>
      </div>

      <!-- Awards & Violations -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Awards & Recognition</h3>
            <p class="panel-sub">Your achievements this year</p>
          </div>
          <router-link to="/student/awards" class="panel-link">View all →</router-link>
        </div>
        <div class="awards-list">
          <div class="award-row" v-for="award in studentAwards.slice(0,3)" :key="award.title">
            <div class="award-icon" :style="{ background: award.color + '18', color: award.color }">
              <svg viewBox="0 0 14 14" fill="none" style="width:13px;height:13px">
                <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9.5 3.5 12l1.5-4L1 5h4.5L7 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-body">
              <p class="award-title">{{ award.title }}</p>
              <p class="award-sem">{{ award.semester }}</p>
            </div>
            <span class="award-chip">{{ award.badge }}</span>
          </div>
          <div v-if="studentAwards.length === 0" class="empty-state"><span>No awards yet</span></div>
        </div>

        <div class="divider"></div>

        <div class="viol-section">
          <div class="viol-header">
            <span class="viol-label">Violations</span>
            <router-link to="/student/violations" class="panel-link">See all →</router-link>
          </div>
          <div v-if="studentViolations.length === 0" class="viol-clear">
            <div class="viol-check">
              <svg viewBox="0 0 12 12" fill="none" style="width:10px;height:10px">
                <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>No active violations — keep it up!</span>
          </div>
        </div>
      </div>

      <!-- GWA Chart -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Academic Performance</h3>
            <p class="panel-sub">GWA trend per semester</p>
          </div>
          <router-link to="/student/academic-history" class="panel-link">History →</router-link>
        </div>
        <div class="chart-area">
          <div class="chart-col" v-for="(bar, i) in studentChartData" :key="i">
            <div class="chart-col-inner">
              <div
                class="chart-bar"
                :class="{ 'chart-bar--active': i === studentChartData.length - 1 }"
                :style="{ height: bar.pct + '%' }"
              >
                <div class="chart-tip">{{ bar.sem }}<br><strong>{{ bar.gwa }}</strong></div>
              </div>
            </div>
            <span class="chart-lbl">{{ bar.sem }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="cl-dot cl-dot--active"></span><span class="cl-text">Current sem</span>
          <span class="cl-dot"></span><span class="cl-text">Previous</span>
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
const stats = ref([])
const profileIncomplete = ref(false)
const studentProfile = ref({ gwa: '' })
const studentActivities = ref([
  { title: 'ICPEP.SE Hackathon' },
  { title: 'Annual JS Summit 2026' },
  { title: 'Campus Clean Drive' }
])
const studentAwards = ref([
  { title: "Dean's List Awardee", semester: '1st Sem 2025–2026', badge: 'Academic', color: '#f59e0b' },
  { title: 'Best Research Paper', semester: '2nd Sem 2024–2025', badge: 'Research', color: '#3b82f6' },
  { title: 'Outstanding Student Leader', semester: '1st Sem 2024–2025', badge: 'Leadership', color: '#10b981' }
])
const studentViolations = ref([])
const todaySchedule = ref([])
const studentChartData = ref([
  { sem: "1S'23", gwa: 1.95, pct: 45 }, { sem: "2S'23", gwa: 1.88, pct: 55 },
  { sem: "1S'24", gwa: 1.81, pct: 68 }, { sem: "2S'24", gwa: 1.77, pct: 76 },
  { sem: "1S'25", gwa: 1.74, pct: 83 }, { sem: "2S'25", gwa: 1.72, pct: 90 }
])

const todayLabel = computed(() => new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
}))

onMounted(async () => {
  try {
    const response = await axios.get('/student/profile')
    const s = response.data
    profileIncomplete.value = !s.gender || !s.contact_number || !s.address
    studentProfile.value = { ...s }
    stats.value = buildStats(s)
  } catch (err) {
    console.error('Failed to fetch student profile:', err)
    stats.value = buildStats({})
  }
})

function buildStats(s) {
  return [
    { label: 'My GWA', value: s.gwa || '0.00', delta: 'Academic', deltaClass: 'positive', fill: '80%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/student/academic-history', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
    { label: 'Subjects', value: '7', delta: 'Enrolled', deltaClass: 'positive', fill: '70%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/student/schedule', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h6M6 9h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
    { label: 'Awards', value: '3', delta: 'This year', deltaClass: 'positive', fill: '60%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/student/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
    { label: 'Violations', value: '0', delta: 'Clear', deltaClass: 'positive', fill: '0%', iconBg: '#f0fdf4', iconColor: '#10b981', route: '/student/violations', iconPath: '<circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
    { label: 'Activities', value: '6', delta: 'Non-academic', deltaClass: 'neutral', fill: '50%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/student/activities', iconPath: '<circle cx="9" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M2 16c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
  ]
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700;800&display=swap');

/* ─── Reset & Base ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: 'Outfit', sans-serif;
  color: #0d0a08;
}

/* ════════════════════════════════════════
   HERO BANNER
════════════════════════════════════════ */
.hero-banner {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 28px 32px;
  background: linear-gradient(130deg, #1a0a00 0%, #3d1500 55%, #FF6B1A 130%);
  margin-bottom: 20px;
}
.ambient {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.ambient-1 {
  width: 320px; height: 320px;
  background: rgba(255,107,26,0.15);
  top: -100px; right: -80px;
  filter: blur(60px);
}
.ambient-2 {
  width: 200px; height: 200px;
  background: rgba(255,255,255,0.05);
  bottom: -60px; left: 40%;
  filter: blur(40px);
}
.ambient-3 {
  width: 160px; height: 160px;
  background: rgba(255,100,20,0.12);
  top: 30%; left: -30px;
  filter: blur(40px);
}

.hero-body {
  position: relative; z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero-meta {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 500;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase; letter-spacing: 0.8px;
  margin-bottom: 14px;
}
.meta-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #FF6B1A;
  box-shadow: 0 0 8px #FF6B1A;
}

.hero-heading {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: 12px;
  white-space: nowrap;
}
.hero-name {
  background: linear-gradient(90deg, #ffd0a8 0%, #fff0e0 50%, #ffb888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.wave { -webkit-text-fill-color: initial; margin-left: 4px; }

.hero-chips {
  display: flex; gap: 8px;
  margin-bottom: 16px;
}
.hero-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  color: rgba(255,255,255,0.65);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 5px 10px;
}
.hero-chip svg { color: rgba(255,255,255,0.4); }

.hero-actions { display: flex; gap: 10px; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #FF6B1A;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 13px; font-weight: 600;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(255,107,26,0.4);
  transition: all 0.15s;
}
.btn-primary:hover {
  background: #e85500;
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  font-family: 'Outfit', sans-serif;
  font-size: 13px; font-weight: 500;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  text-decoration: none;
  transition: all 0.15s;
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.18);
}

.hero-right { display: flex; gap: 12px; flex-shrink: 0; align-items: flex-end; }

.kpi-tile {
  position: relative; overflow: hidden;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 16px 20px 14px;
  min-width: 120px;
  display: flex; flex-direction: column;
  transition: all 0.2s;
}
.kpi-tile:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.12);
}

.kpi-tile-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.kpi-icon {
  width: 14px; height: 14px;
  color: rgba(255,255,255,0.4);
  flex-shrink: 0;
}

.kpi-accent {
  background: rgba(255,107,26,0.2);
  border-color: rgba(255,107,26,0.3);
}
.kpi-accent .kpi-icon { color: rgba(255,255,255,0.6); }

.kpi-eyebrow {
  font-size: 10px; font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase; letter-spacing: 0.6px;
}
.kpi-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px; font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -1px;
}
.kpi-foot {
  font-size: 10px; color: rgba(255,255,255,0.4);
  margin-top: 4px;
}

.kpi-sparkbar {
  display: flex; align-items: flex-end; gap: 3px;
  height: 20px; margin-top: 10px;
}
.kpi-spark-seg {
  flex: 1;
  background: rgba(255,255,255,0.6);
  border-radius: 3px 3px 0 0;
  min-height: 4px;
}

.kpi-ring {
  position: absolute; bottom: -18px; right: -18px;
  width: 72px; height: 72px; opacity: 0.5;
}

/* ════════════════════════════════════════
   PROFILE NUDGE
════════════════════════════════════════ */
.profile-nudge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: linear-gradient(135deg, #fffbf8 0%, #fff7f0 50%, #fff 100%);
  border: 1px solid #ffe4cc;
  border-radius: 16px;
  padding: 18px 24px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
}
.profile-nudge::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #FF6B1A 0%, #ff9a5c 50%, #FFD4A8 100%);
  border-radius: 4px 0 0 4px;
}
.profile-nudge .nudge-bar-right {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #FF6B1A 0%, #ff9a5c 50%, #FFD4A8 100%);
  border-radius: 0 4px 4px 0;
}
.profile-nudge::after {
  content: '';
  position: absolute;
  right: -40px; top: -40px;
  width: 140px; height: 140px;
  background: radial-gradient(circle, rgba(255,107,26,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.profile-nudge:hover {
  box-shadow: 0 8px 32px rgba(255,107,26,0.12);
  transform: translateY(-1px);
}

.nudge-left {
  display: flex; align-items: center; gap: 14px;
  flex: 1; min-width: 0;
}
.nudge-icon {
  width: 42px; height: 42px; flex-shrink: 0;
  background: linear-gradient(135deg, #fff5ef, #ffe8d6);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #FF6B1A;
  box-shadow: 0 2px 8px rgba(255,107,26,0.12);
}
.nudge-icon svg { width: 18px; height: 18px; }

.nudge-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px; font-weight: 700; color: #0d0a08;
  margin-bottom: 3px;
}
.nudge-desc { font-size: 11.5px; color: #b89f90; line-height: 1.4; }

.nudge-progress {
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;
}
.nudge-steps { display: flex; gap: 5px; }
.nudge-step {
  width: 28px; height: 6px; border-radius: 3px;
  background: #f0ebe5;
  transition: background 0.3s, box-shadow 0.3s;
}
.nudge-step.done {
  background: linear-gradient(90deg, #FF6B1A, #ff9a5c);
  box-shadow: 0 0 8px rgba(255,107,26,0.3);
  animation: stepGlow 2.5s ease-in-out infinite alternate;
}
@keyframes stepGlow {
  0% { box-shadow: 0 0 6px rgba(255,107,26,0.2); }
  100% { box-shadow: 0 0 12px rgba(255,107,26,0.45); }
}
.nudge-progress-label {
  font-size: 10.5px; color: #b89f90; white-space: nowrap; font-weight: 500;
}

.nudge-cta {
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12.5px; font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #FF6B1A 0%, #ff8a4c 100%);
  border-radius: 12px;
  padding: 11px 22px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(255,107,26,0.35);
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.nudge-cta::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.nudge-cta:hover::before {
  left: 100%;
}
.nudge-cta:hover {
  background: linear-gradient(135deg, #ff7c30 0%, #ff9a5c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,107,26,0.45);
}

.slide-nudge-enter-active, .slide-nudge-leave-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-nudge-enter-from, .slide-nudge-leave-to { opacity: 0; transform: translateY(-12px) scale(0.98); }

/* ════════════════════════════════════════
   STATS STRIP
════════════════════════════════════════ */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.stat-chip {
  position: relative; overflow: hidden;
  background: #fff;
  border: 1px solid #f0ebe5;
  border-radius: 16px;
  padding: 16px 16px 12px;
  transition: all 0.2s;
}
.stat-chip--clickable { cursor: pointer; }
.stat-chip--clickable:hover {
  border-color: rgba(255,107,26,0.35);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255,107,26,0.1);
}

.sc-icon {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
  transition: transform 0.2s;
}
.stat-chip--clickable:hover .sc-icon { transform: scale(1.08); }
.sc-icon svg { width: 15px; height: 15px; }

.sc-body { display: flex; align-items: baseline; justify-content: space-between; gap: 4px; margin-bottom: 4px; }
.sc-label { font-size: 10px; font-weight: 500; color: #a89080; text-transform: uppercase; letter-spacing: 0.5px; }
.sc-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px; font-weight: 800;
  color: #0d0a08; line-height: 1;
}

.sc-badge {
  display: inline-block;
  font-size: 9px; font-weight: 700;
  padding: 2px 7px; border-radius: 5px;
  margin-bottom: 10px;
}
.sc-badge.positive { background: #f0fdf4; color: #15803d; }
.sc-badge.neutral  { background: #fff5ef; color: #c2440e; }
.sc-badge.negative { background: #fff1f2; color: #be123c; }

.sc-progress {
  height: 2.5px;
  background: #f0ebe5;
  border-radius: 2px;
  overflow: hidden;
}
.sc-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.34,1.56,0.64,1);
}

/* ════════════════════════════════════════
   BOTTOM GRID
════════════════════════════════════════ */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}

.panel {
  background: #fff;
  border: 1px solid #f0ebe5;
  border-radius: 20px;
  padding: 22px 24px;
  transition: box-shadow 0.2s;
}
.panel:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.05); }

.panel-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 20px; gap: 12px;
}
.panel-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px; font-weight: 700; color: #0d0a08;
  margin-bottom: 3px;
}
.panel-sub { font-size: 11px; color: #b89f90; }
.panel-link {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 11px; font-weight: 600; color: #FF6B1A;
  text-decoration: none; white-space: nowrap; flex-shrink: 0;
  transition: opacity 0.15s;
}
.panel-link:hover { opacity: 0.7; }

/* Timeline */
.timeline { display: flex; flex-direction: column; }
.tl-item { display: flex; gap: 10px; align-items: flex-start; }

.tl-time { width: 58px; flex-shrink: 0; padding-top: 1px; }
.tl-t { display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; color: #0d0a08; }
.tl-dur { font-size: 9.5px; color: #c0a898; }

.tl-track { display: flex; flex-direction: column; align-items: center; width: 16px; flex-shrink: 0; padding-top: 3px; }
.tl-node { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.tl-rail { flex: 1; width: 1.5px; background: #f0ebe5; margin-top: 4px; min-height: 24px; }

.tl-content { flex: 1; min-width: 0; padding-bottom: 18px; }
.tl-item:last-child .tl-content { padding-bottom: 0; }
.tl-subject { font-size: 12.5px; font-weight: 600; color: #0d0a08; margin-bottom: 2px; }
.tl-meta { font-size: 10.5px; color: #b89f90; margin-bottom: 5px; }
.tl-badge { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 5px; }

/* Awards */
.awards-list { display: flex; flex-direction: column; gap: 8px; }
.award-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 12px;
  transition: background 0.15s; cursor: default;
}
.award-row:hover { background: #faf8f6; }
.award-icon {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.award-body { flex: 1; min-width: 0; }
.award-title { font-size: 12px; font-weight: 600; color: #0d0a08; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.award-sem { font-size: 10px; color: #b89f90; margin-top: 1px; }
.award-chip {
  font-size: 9px; font-weight: 700;
  background: #f0fdf4; color: #15803d;
  padding: 2px 8px; border-radius: 5px; white-space: nowrap;
}

.divider { height: 1px; background: #f5f0ec; margin: 16px 0; }

.viol-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.viol-label { font-size: 10.5px; font-weight: 700; color: #0d0a08; text-transform: uppercase; letter-spacing: 0.5px; }
.viol-clear { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #16a34a; font-weight: 500; }
.viol-check {
  width: 20px; height: 20px; border-radius: 50%;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  color: #16a34a;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Chart */
.chart-area {
  display: flex; align-items: flex-end; gap: 6px;
  height: 130px; padding-bottom: 2px;
}
.chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 5px; }
.chart-col-inner { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.chart-bar {
  width: 100%;
  background: #fde8d8;
  border-radius: 6px 6px 0 0;
  position: relative;
  cursor: pointer;
  transition: height 0.9s cubic-bezier(0.34,1.1,0.64,1);
}
.chart-bar--active {
  background: linear-gradient(180deg, #FF6B1A 0%, #e85500 100%);
  box-shadow: 0 4px 16px rgba(255,107,26,0.3);
}
.chart-bar:hover .chart-tip { opacity: 1; transform: translateX(-50%) translateY(0); }
.chart-tip {
  position: absolute; bottom: calc(100% + 7px); left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #0d0a08; color: #fff;
  font-size: 9.5px; line-height: 1.4;
  padding: 5px 9px; border-radius: 7px;
  white-space: nowrap; opacity: 0;
  transition: all 0.15s;
  pointer-events: none; text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.chart-tip::after {
  content: '';
  position: absolute; top: 100%; left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #0d0a08;
}
.chart-lbl { font-size: 8px; color: #c0a898; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }

.chart-legend { display: flex; align-items: center; gap: 14px; margin-top: 14px; }
.cl-dot { width: 7px; height: 7px; border-radius: 50%; background: #fde8d8; }
.cl-dot--active { background: #FF6B1A; }
.cl-text { font-size: 10px; color: #b89f90; }

/* Empty state */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 24px 0;
  font-size: 12px; color: #c0a898; font-style: italic;
}
</style>