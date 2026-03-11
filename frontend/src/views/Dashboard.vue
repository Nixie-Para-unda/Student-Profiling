<template>
  <div class="dashboard-root">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#FF6B1A"/>
            <path d="M8 20C8 13.373 13.373 8 20 8s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20z" fill="white" fill-opacity="0.2"/>
            <path d="M14 20h12M20 14v12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="brand-text" v-show="!sidebarCollapsed">
          <span class="brand-name">DIS Portal</span>
          <span class="brand-sub">CCS · AY 2026–2027</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M13 5l-5 5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- User -->
      <div class="sidebar-user" v-show="!sidebarCollapsed">
        <div class="user-avatar">{{ authStore.user?.name?.charAt(0) ?? 'U' }}</div>
        <div class="user-info">
          <p class="user-name">{{ authStore.user?.name ?? 'User' }}</p>
          <p class="user-role">{{ authStore.user?.role ?? 'Faculty' }} · Head of Dept</p>
        </div>
      </div>
      <div class="user-avatar-sm" v-show="sidebarCollapsed">{{ authStore.user?.name?.charAt(0) ?? 'U' }}</div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div class="nav-section-label" v-show="!sidebarCollapsed">Overview</div>
        <a href="#" class="nav-item active">
          <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>
          <span v-show="!sidebarCollapsed">Dashboard</span>
        </a>
        <a v-if="authStore.isDean" href="#" class="nav-item">
          <svg viewBox="0 0 20 20" fill="none"><path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span v-show="!sidebarCollapsed">Reports</span>
        </a>

        <template v-if="authStore.isDean">
          <div class="nav-section-label" v-show="!sidebarCollapsed">Academic</div>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Students</span>
            <span class="nav-badge" v-show="!sidebarCollapsed">842</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty</span>
            <span class="nav-badge" v-show="!sidebarCollapsed">38</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M2 14l4-8 4 5 3-3 5 6H2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Academic Performance</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Violations</span>
            <span class="nav-badge danger" v-show="!sidebarCollapsed">12</span>
          </a>
        </template>

        <template v-else>
          <div class="nav-section-label" v-show="!sidebarCollapsed">My Classes</div>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Schedule</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 4h12v12H4zM8 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Subjects</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M9 11a3 3 0 100-6 3 3 0 000 6zM2 18a7 7 0 0114 0M15 7a3 3 0 110 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Classes</span>
          </a>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Monitoring</div>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Profiles</span>
          </a>
          <a href="#" class="nav-item">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Record Violation</span>
          </a>
        </template>

        <div class="nav-section-label" v-show="!sidebarCollapsed">Management</div>
        <a v-if="authStore.isDean" href="#" class="nav-item">
          <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span v-show="!sidebarCollapsed">Faculty Schedule</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span v-show="!sidebarCollapsed">Awards & Recognition</span>
          <span class="nav-badge warning" v-show="!sidebarCollapsed && authStore.isDean">3</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span v-show="!sidebarCollapsed">Settings</span>
        </a>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 20 20" fill="none"><path d="M13 10H3m0 0l3-3m-3 3l3 3M8 5V4a2 2 0 012-2h5a2 2 0 012 2v12a2 2 0 01-2 2h-5a2 2 0 01-2-2v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span v-show="!sidebarCollapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">

      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="page-title-block">
            <div class="page-breadcrumb">College of Computing Studies</div>
            <h1 class="page-title">Dashboard</h1>
          </div>
        </div>
        <div class="topbar-right">
          <div class="search-box">
            <svg viewBox="0 0 20 20" fill="none"><path d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <input type="text" placeholder="Search students, faculty…" />
          </div>
          <button class="icon-btn">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 00-6 6v2.5l-1.5 2.5h15L16 10.5V8a6 6 0 00-6-6zM8 16a2 2 0 004 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span class="notif-dot"></span>
          </button>
          <div class="date-chip">
            <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            March 10, 2026
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="content">

        <!-- Hero Banner -->
        <div class="hero-banner">
          <div class="hero-bg-shape shape-1"></div>
          <div class="hero-bg-shape shape-2"></div>
          <div class="hero-body">
            <div class="hero-left">
              <p class="hero-eyebrow">
                <span class="eyebrow-dot"></span>
                Academic Year 2026–2027 · 2nd Semester
              </p>
              <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Dean' }} 👋</h2>
              <p class="hero-desc">You have <strong>3 pending recognition approvals</strong> and <strong>12 student violations</strong> requiring attention this week.</p>
              <div class="hero-actions">
                <button class="hero-btn-primary">Pending Approvals <span class="hero-btn-badge">3</span></button>
                <button class="hero-btn-ghost">Generate Report</button>
              </div>
            </div>
            <div class="hero-right">
              <div class="hero-stat-card">
                <span class="hsc-label">This Week</span>
                <span class="hsc-value">47</span>
                <span class="hsc-sub">Activities logged</span>
              </div>
              <div class="hero-stat-card accent">
                <span class="hsc-label">Pending</span>
                <span class="hsc-value">3</span>
                <span class="hsc-sub">Awaiting review</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
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
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: stat.fill, background: stat.iconColor }"></div>
            </div>
          </div>
        </div>

        <!-- Bottom grid -->
        <div class="bottom-grid">

          <!-- Performance Chart -->
          <div class="card chart-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Academic Performance Trends</h3>
                <p class="card-sub">Average GWA per semester</p>
              </div>
              <a href="#" class="card-link">Full report →</a>
            </div>
            <div class="chart-bars">
              <div class="chart-bar-col" v-for="(bar, i) in chartData" :key="i">
                <div class="chart-bar-wrap">
                  <div class="chart-bar-fill" :class="{ current: i === chartData.length - 1 }" :style="{ height: bar.pct + '%' }">
                    <span class="chart-tooltip">{{ bar.label }}: {{ bar.gwa }}</span>
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

          <!-- Top Students -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Top Performing Students</h3>
                <p class="card-sub">Ranked by GWA · current semester</p>
              </div>
              <a href="#" class="card-link">View all →</a>
            </div>
            <div class="student-list">
              <div class="student-row" v-for="(s, i) in topStudents" :key="i">
                <span class="rank">{{ i + 1 }}</span>
                <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
                <div class="student-info">
                  <p class="student-name">{{ s.name }}</p>
                  <p class="student-course">{{ s.course }}</p>
                </div>
                <span class="student-tag" :class="s.tagClass">{{ s.tag }}</span>
                <span class="student-gwa">{{ s.gwa }}</span>
              </div>
            </div>
          </div>

          <!-- Violations -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Student Violations</h3>
                <p class="card-sub">Active cases this semester</p>
              </div>
              <a href="#" class="card-link">View all →</a>
            </div>
            <div class="violation-list">
              <div class="violation-row" v-for="(v, i) in violations" :key="i">
                <div class="violation-avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
                <div class="violation-info">
                  <p class="violation-name">{{ v.name }}</p>
                  <p class="violation-type">{{ v.type }}</p>
                </div>
                <span class="violation-badge" :class="v.severityClass">{{ v.severity }}</span>
              </div>
            </div>
            <div class="violation-alert">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 5v4M8 11.5v.5M2.5 14h11a1 1 0 00.87-1.5l-5.5-9.5a1 1 0 00-1.74 0l-5.5 9.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
              <span>8 more cases need review</span>
              <button>Review Now →</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const sidebarCollapsed = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const stats = [
  {
    label: 'Total Students',
    value: '842',
    delta: '↑ 4.2% vs last sem',
    deltaClass: 'positive',
    fill: '72%',
    iconBg: '#fff5ef',
    iconColor: '#FF6B1A',
    iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  },
  {
    label: 'Total Faculty',
    value: '38',
    delta: '↑ 2 new this sem',
    deltaClass: 'positive',
    fill: '45%',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011 1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  },
  {
    label: 'Dept. Avg GWA',
    value: '1.87',
    delta: '↑ 0.04 improved',
    deltaClass: 'positive',
    fill: '60%',
    iconBg: '#f5f3ff',
    iconColor: '#8b5cf6',
    iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    label: 'With Violations',
    value: '12',
    delta: '↑ 3 this month',
    deltaClass: 'negative',
    fill: '25%',
    iconBg: '#fff1f2',
    iconColor: '#ef4444',
    iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  },
  {
    label: 'Award Nominations',
    value: '7',
    delta: '3 pending review',
    deltaClass: 'warning',
    fill: '38%',
    iconBg: '#fffbeb',
    iconColor: '#f59e0b',
    iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
  }
]

const chartData = [
  { sem: "1st '22", gwa: 2.14, pct: 38 },
  { sem: "2nd '22", gwa: 2.08, pct: 50 },
  { sem: "1st '23", gwa: 2.01, pct: 60 },
  { sem: "2nd '23", gwa: 1.96, pct: 68 },
  { sem: "1st '24", gwa: 1.91, pct: 75 },
  { sem: "2nd '24", gwa: 1.87, pct: 85 }
]

const topStudents = [
  { name: 'Aira Mae Reyes', course: 'BSCS · 4th Year', tag: "Dean's List", gwa: '1.21', color: '#f59e0b', tagClass: 'tag-green' },
  { name: 'Jose Miguel Cruz', course: 'BSIT · 3rd Year', tag: "Dean's List", gwa: '1.34', color: '#3b82f6', tagClass: 'tag-green' },
  { name: 'Katrina Villanueva', course: 'BSCS · 4th Year', tag: "Dean's List", gwa: '1.38', color: '#10b981', tagClass: 'tag-green' },
  { name: 'Mark Daniel Lim', course: 'BSIT · 2nd Year', tag: 'Rising Star', gwa: '1.42', color: '#FF6B1A', tagClass: 'tag-orange' },
  { name: 'Sofia Tan Garcia', course: 'BSCS · 3rd Year', tag: 'Rising Star', gwa: '1.47', color: '#8b5cf6', tagClass: 'tag-orange' }
]

const violations = [
  { name: 'Ryan Santos', type: 'Academic Dishonesty', severity: 'Major', color: '#b91c1c', severityClass: 'sev-major' },
  { name: 'Luis Pascual', type: 'Excessive Absences', severity: 'Moderate', color: '#c2410c', severityClass: 'sev-moderate' },
  { name: 'Ana Bautista', type: 'Dress Code Violation', severity: 'Minor', color: '#b45309', severityClass: 'sev-minor' },
  { name: 'Earl Mendoza', type: 'Misconduct (2nd offense)', severity: 'Major', color: '#991b1b', severityClass: 'sev-major' }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ======================== ROOT ======================== */
.dashboard-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f7f3f0;
  font-family: 'DM Sans', sans-serif;
  color: #1a0a00;
}

/* ======================== SIDEBAR ======================== */
.sidebar {
  width: 252px;
  flex-shrink: 0;
  background: #1a0a00;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
  position: relative;
  z-index: 10;
}
.sidebar.collapsed { width: 68px; }

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.brand-icon svg { width: 36px; height: 36px; flex-shrink: 0; }
.brand-text { flex: 1; min-width: 0; }
.brand-name {
  display: block;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}
.brand-sub {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  margin-top: 1px;
  white-space: nowrap;
}
.collapse-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s;
  flex-shrink: 0;
}
.collapse-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
.collapse-btn svg { width: 16px; height: 16px; display: block; }
.sidebar.collapsed .collapse-btn svg { transform: rotate(180deg); }

/* User */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  margin: 12px 12px 0;
  background: rgba(255,107,26,0.1);
  border-radius: 12px;
  border: 1px solid rgba(255,107,26,0.15);
}
.user-avatar {
  width: 36px; height: 36px;
  background: #FF6B1A;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}
.user-avatar-sm {
  width: 36px; height: 36px;
  background: #FF6B1A;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  margin: 12px auto 0;
}
.user-info { min-width: 0; }
.user-name {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 1px;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar-nav::-webkit-scrollbar { width: 0; }
.nav-section-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.2);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 10px 8px 4px;
  white-space: nowrap;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.nav-item.active {
  background: rgba(255,107,26,0.12);
  color: #FF6B1A;
  font-weight: 500;
}
.nav-item svg { width: 17px; height: 17px; flex-shrink: 0; }
.nav-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.45);
  padding: 1px 6px;
  border-radius: 5px;
}
.nav-badge.danger { background: rgba(239,68,68,0.15); color: #f87171; }
.nav-badge.warning { background: rgba(255,107,26,0.15); color: #FF6B1A; }

/* Footer */
.sidebar-footer {
  padding: 14px 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 10px;
  border: none;
  background: none;
  color: rgba(255,255,255,0.35);
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }
.logout-btn svg { width: 17px; height: 17px; flex-shrink: 0; }

/* ======================== MAIN ======================== */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #f0e8e0;
  flex-shrink: 0;
}
.page-breadcrumb {
  font-size: 11px;
  color: #b89f90;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 500;
}
.page-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a0a00;
  margin-top: 1px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #faf8f6;
  border: 1.5px solid #f0e8e0;
  border-radius: 10px;
  padding: 8px 14px;
  width: 240px;
  transition: all 0.2s;
}
.search-box:focus-within {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.08);
}
.search-box svg { width: 15px; height: 15px; color: #c0b0a5; flex-shrink: 0; }
.search-box input {
  border: none; background: none; outline: none;
  font-size: 13px; color: #1a0a00; font-family: 'DM Sans', sans-serif;
  width: 100%;
}
.search-box input::placeholder { color: #c0b0a5; }
.icon-btn {
  position: relative;
  width: 38px; height: 38px;
  border-radius: 10px;
  border: 1.5px solid #f0e8e0;
  background: #faf8f6;
  display: flex; align-items: center; justify-content: center;
  color: #9a8070; cursor: pointer;
  transition: all 0.15s;
}
.icon-btn:hover { border-color: #FF6B1A; color: #FF6B1A; background: #fff5ef; }
.icon-btn svg { width: 17px; height: 17px; }
.notif-dot {
  position: absolute; top: 7px; right: 7px;
  width: 6px; height: 6px;
  background: #FF6B1A; border-radius: 50%;
  border: 1.5px solid #fff;
}
.date-chip {
  display: flex; align-items: center; gap: 6px;
  background: #fff5ef;
  border: 1.5px solid #ffd5b0;
  color: #c94000;
  font-size: 12px; font-weight: 500;
  padding: 7px 12px; border-radius: 10px;
}
.date-chip svg { width: 14px; height: 14px; }

/* Content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.content::-webkit-scrollbar { width: 5px; }
.content::-webkit-scrollbar-track { background: transparent; }
.content::-webkit-scrollbar-thumb { background: #e8ddd6; border-radius: 3px; }

/* Hero Banner */
.hero-banner {
  background: linear-gradient(130deg, #1a0a00 0%, #3d1500 55%, #FF6B1A 130%);
  border-radius: 20px;
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
}
.hero-bg-shape {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.shape-1 {
  width: 320px; height: 320px;
  background: rgba(255,107,26,0.15);
  top: -100px; right: -80px;
  filter: blur(60px);
}
.shape-2 {
  width: 200px; height: 200px;
  background: rgba(255,255,255,0.05);
  bottom: -60px; left: 40%;
  filter: blur(40px);
}
.hero-body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  background: #FF6B1A;
  border-radius: 50%;
  box-shadow: 0 0 8px #FF6B1A;
}
.hero-greeting {
  font-family: 'Syne', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.hero-desc {
  font-size: 13.5px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  max-width: 400px;
  margin-bottom: 20px;
}
.hero-desc strong { color: rgba(255,255,255,0.85); font-weight: 500; }
.hero-actions { display: flex; gap: 10px; }
.hero-btn-primary {
  display: flex; align-items: center; gap: 8px;
  background: #FF6B1A;
  color: #fff;
  border: none; border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 16px rgba(255,107,26,0.4);
}
.hero-btn-primary:hover { background: #e85500; transform: translateY(-1px); }
.hero-btn-badge {
  background: rgba(255,255,255,0.25);
  padding: 1px 6px; border-radius: 6px;
  font-size: 11px;
}
.hero-btn-ghost {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(8px);
}
.hero-btn-ghost:hover { background: rgba(255,255,255,0.18); }
.hero-right { display: flex; gap: 12px; flex-shrink: 0; }
.hero-stat-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(8px);
  min-width: 100px;
}
.hero-stat-card.accent {
  background: rgba(255,107,26,0.2);
  border-color: rgba(255,107,26,0.3);
}
.hsc-label { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.6px; }
.hsc-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; line-height: 1; margin-top: 4px; }
.hsc-sub { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 16px;
  padding: 18px 18px 14px;
}
.stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}
.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.4;
  max-width: 80px;
}
.stat-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon svg { width: 16px; height: 16px; }
.stat-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 12px;
}
.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #1a0a00;
  line-height: 1;
}
.stat-delta {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 5px;
  white-space: nowrap;
}
.stat-delta.positive { background: #f0fdf4; color: #16a34a; }
.stat-delta.negative { background: #fff1f2; color: #e11d48; }
.stat-delta.warning { background: #fff5ef; color: #c94000; }
.stat-bar {
  height: 3px;
  background: #f0e8e0;
  border-radius: 2px;
  overflow: hidden;
}
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

/* Cards */
.card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  padding: 22px;
}
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a0a00;
}
.card-sub {
  font-size: 11px;
  color: #b89f90;
  margin-top: 3px;
}
.card-link {
  font-size: 11px;
  font-weight: 600;
  color: #FF6B1A;
  text-decoration: none;
  white-space: nowrap;
}
.card-link:hover { text-decoration: underline; }

/* Chart */
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 140px;
  padding-bottom: 4px;
}
.chart-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
}
.chart-bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.chart-bar-fill {
  width: 100%;
  background: #fde8d8;
  border-radius: 5px 5px 0 0;
  transition: height 0.8s ease;
  position: relative;
  cursor: pointer;
}
.chart-bar-fill.current { background: #FF6B1A; }
.chart-bar-fill:hover .chart-tooltip { opacity: 1; transform: translateY(0); }
.chart-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #1a0a00;
  color: #fff;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.15s;
  pointer-events: none;
}
.chart-bar-label {
  font-size: 8px;
  color: #b89f90;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: center;
  white-space: nowrap;
}
.chart-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}
.legend-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #fde8d8;
}
.legend-dot.current { background: #FF6B1A; }
.legend-text { font-size: 10px; color: #b89f90; }

/* Students */
.student-list { display: flex; flex-direction: column; gap: 10px; }
.student-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.15s;
}
.student-row:hover { background: #faf8f6; }
.rank { font-size: 11px; font-weight: 700; color: #ddd0c8; width: 14px; flex-shrink: 0; text-align: center; }
.student-avatar {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.student-info { flex: 1; min-width: 0; }
.student-name { font-size: 12px; font-weight: 600; color: #1a0a00; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.student-course { font-size: 10px; color: #b89f90; }
.student-tag {
  font-size: 9px; font-weight: 700;
  padding: 2px 7px; border-radius: 5px;
  white-space: nowrap;
}
.tag-green { background: #f0fdf4; color: #16a34a; }
.tag-orange { background: #fff5ef; color: #c94000; }
.student-gwa { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #1a0a00; flex-shrink: 0; }

/* Violations */
.violation-list { display: flex; flex-direction: column; gap: 8px; }
.violation-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.15s;
}
.violation-row:hover { background: #faf8f6; }
.violation-avatar {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.violation-info { flex: 1; min-width: 0; }
.violation-name { font-size: 12px; font-weight: 600; color: #1a0a00; }
.violation-type { font-size: 10px; color: #b89f90; }
.violation-badge {
  font-size: 9px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.5px;
  white-space: nowrap;
}
.sev-major { background: #fff1f2; color: #be123c; }
.sev-moderate { background: #fff5ef; color: #c94000; }
.sev-minor { background: #fefce8; color: #854d0e; }
.violation-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 14px;
}
.violation-alert svg { width: 14px; height: 14px; color: #e11d48; flex-shrink: 0; }
.violation-alert span { font-size: 11px; font-weight: 600; color: #be123c; flex: 1; }
.violation-alert button {
  background: none; border: none;
  font-size: 11px; font-weight: 700; color: #e11d48;
  cursor: pointer; padding: 0;
  font-family: 'DM Sans', sans-serif;
}
.violation-alert button:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
  .bottom-grid { grid-template-columns: 1fr 1fr; }
  .bottom-grid .chart-card { grid-column: 1 / -1; }
  .hero-right { display: none; }
}
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .bottom-grid { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}
</style>