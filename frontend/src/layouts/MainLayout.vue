<template>
  <div class="dashboard-root">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand Sidebar' : ''">
        <div class="brand-icon">
          <img :src="ccsLogo" alt="CSS Logo" class="brand-logo-img" />
        </div>
        <div class="brand-text" v-show="!sidebarCollapsed">
          <span class="brand-name">CSS Portal</span>
          <span class="brand-sub">CCS · AY 2026–2027</span>
        </div>
        <button v-if="!sidebarCollapsed" class="collapse-btn" @click.stop="sidebarCollapsed = true">
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
          <p class="user-role">{{ userRoleDisplay }}</p>
        </div>
      </div>
      <div class="user-avatar-sm" v-show="sidebarCollapsed" @click="sidebarCollapsed = false" title="Expand Sidebar">
        {{ authStore.user?.name?.charAt(0) ?? 'U' }}
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">

        <!-- ── OVERVIEW (all roles) ── -->
        <div class="nav-section-label" v-show="!sidebarCollapsed">Overview</div>
        <router-link :to="dashboardRoute" class="nav-item" active-class="active">
          <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>
          <span v-show="!sidebarCollapsed">Dashboard</span>
        </router-link>

        <!-- ── DEAN NAV ── -->
        <template v-if="authStore.isDean">
          <router-link to="/profiling/report" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M12 15V9m-4 6V5m-4 10v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Profiling Reports</span>
          </router-link>
          <router-link to="/dean/curriculum" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 3v14M14 3v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Curriculum</span>
          </router-link>
          <router-link to="/dean/courses" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 8h14M8 4v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Courses</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Academic</div>
          <router-link to="/students" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Profiles</span>
          </router-link>
          <router-link to="/faculty" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty Members</span>
          </router-link>
          <router-link to="/academic-performance" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M2 14l4-8 4 5 3-3 5 6H2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Academic Performance</span>
          </router-link>
          <router-link to="/violations" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Violations</span>
          </router-link>

          <div class="nav-section-label" v-show="!sidebarCollapsed">Management</div>
          <router-link to="/dean/archive" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M4 10h12M4 14h12M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Archive Management</span>
          </router-link>
          <router-link to="/secretary/faculty-schedule" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty Schedule</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Account Settings</div>
          <router-link to="/settings" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed"> Settings</span>
          </router-link>
        </template>

        <!-- ── FACULTY NAV ── -->
        <template v-if="authStore.isFaculty">
          <div class="nav-section-label" v-show="!sidebarCollapsed">My Classes</div>
          <router-link to="/faculty/schedule" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Schedule</span>
          </router-link>
          <router-link to="/faculty/subjects" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 4h12v12H4zM8 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Subjects</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Monitoring</div>
          <router-link to="/faculty/students" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Profiles</span>
          </router-link>
          <router-link to="/faculty/violations" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Record Violation</span>
          </router-link>
          <router-link to="/faculty/awards" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Recommend Awards</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Account Settings</div>
          <router-link to="/faculty/profile" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Profile</span>
          </router-link>
          <router-link to="/settings" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Account Settings</span>
          </router-link>
        </template>

        <!-- ── CHAIR NAV ── -->
        <template v-if="authStore.isChair">
          <div class="nav-section-label" v-show="!sidebarCollapsed">Academic</div>
          <router-link to="/students" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Profiles</span>
          </router-link>
          <router-link to="/faculty" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty Members</span>
          </router-link>
          <router-link to="/chair/performance" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M2 14l4-8 4 5 3-3 5 6H2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Academic Performance</span>
          </router-link>
          <router-link to="/chair/schedules" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Manage Schedules</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Management</div>
          <router-link to="/chair/violations" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Violations</span>
            <span class="nav-badge danger" v-show="!sidebarCollapsed">12</span>
          </router-link>
          <router-link to="/chair/awards" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Approve Awards</span>
            <span class="nav-badge warning" v-show="!sidebarCollapsed">5</span>
          </router-link>
          <router-link to="/chair/reports" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Generate Reports</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Account Settings</div>
          <router-link to="/settings" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Account Settings</span>
          </router-link>
        </template>

        <!-- ── SECRETARY NAV ── -->
        <template v-if="authStore.isSecretary">
          <div class="nav-section-label" v-show="!sidebarCollapsed">Accounts</div>
          <!-- Secretary Links -->
          <router-link to="/students" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Student Accounts</span>
          </router-link>
          <router-link to="/faculty" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty Accounts</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Monitoring</div>
          <router-link to="/secretary/faculty-schedule" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Faculty Workload</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Management</div>
          <router-link to="/secretary/achievements" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">Achievement Verification</span>
            <span class="nav-badge warning" v-show="!sidebarCollapsed">8</span>
          </router-link>
          <router-link to="/secretary/reports" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Generate Reports</span>
          </router-link>
          <div class="nav-section-label" v-show="!sidebarCollapsed">Settings</div>
          <router-link to="/settings" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Account Settings</span>
          </router-link>
        </template>

        <!-- ── STUDENT NAV ── -->
        <template v-if="authStore.isStudent">
          <div class="nav-section-label" v-show="!sidebarCollapsed">My Academic</div>
          <router-link to="/student/profile" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Profile</span>
          </router-link>
          <router-link to="/student/curriculum" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 3v14M14 3v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Curriculum</span>
          </router-link>
          <router-link to="/student/violations" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Violations</span>
          </router-link>

          <div class="nav-section-label" v-show="!sidebarCollapsed">My Activities</div>
          <router-link to="/student/achievements" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-show="!sidebarCollapsed">My Achievements</span>
          </router-link>

          <div class="nav-section-label" v-show="!sidebarCollapsed">Academics</div>
          <router-link to="/student/schedule" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">My Schedule</span>
          </router-link>

          <div class="nav-section-label" v-show="!sidebarCollapsed">Account Settings</div>
          <router-link to="/settings" class="nav-item" active-class="active">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span v-show="!sidebarCollapsed">Account Settings</span>
          </router-link>
        </template>

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
              <div class="page-breadcrumb">College of <span class="breadcrumb-orange">Computing Studies</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{ portalLabel }}</div>
            </div>
        </div>
        <div class="topbar-right">
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
        <div v-if="route.meta.breadcrumb" class="page-breadcrumb-trail">
          <span class="breadcrumb-category">{{ route.meta.breadcrumb.split(' > ')[0] }}</span>
          <span class="breadcrumb-sep">&gt;</span>
          <span class="breadcrumb-current">{{ route.meta.breadcrumb.split(' > ')[1] }}</span>
        </div>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter, useRoute } from 'vue-router'
import { useAuthRedirect } from '../composables/useAuthRedirect'
import ccsLogo from '../assets/ccs-logo.jpg'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { getDashboardRoute } = useAuthRedirect()
const sidebarCollapsed = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})

const dashboardRoute = computed(() => getDashboardRoute())

const userRoleDisplay = computed(() => {
  if (!authStore.user) return 'User'
  const role = authStore.user.role
  if (role === 'dean') return 'Dean · Head of Dept'
  if (role === 'faculty') return 'Faculty Member'
  if (role === 'student') return 'Student'
  if (role === 'secretary') return 'Department Secretary'
  if (role === 'department_chair') return 'Department Chair'
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const portalLabel = computed(() => {
  if (!authStore.user) return 'Portal'
  const role = authStore.user.role
  if (role === 'dean') return 'Dean Portal'
  if (role === 'faculty') return 'Faculty Portal'
  if (role === 'student') return 'Student Portal'
  if (role === 'secretary') return 'Secretary Portal'
  if (role === 'department_chair') return 'Chair Portal'
  return 'Portal'
})

const handleLogout = () => {
  const isStudent = authStore.isStudent
  authStore.logout()
  if (isStudent) {
    router.push('/student/login')
  } else {
    router.push('/login')
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard-root { display: flex; height: 100vh; overflow: hidden; background: #f7f3f0; font-family: 'DM Sans', sans-serif; color: #1a0a00; }

/* ── SIDEBAR ── */
.sidebar { width: 252px; flex-shrink: 0; background: #1a0a00; display: flex; flex-direction: column; transition: width 0.25s ease; position: relative; z-index: 10; }
.sidebar.collapsed { width: 68px; }

.collapse-btn { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.collapse-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
.collapse-btn svg { width: 16px; height: 16px; display: block; }

.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 20px 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; overflow: hidden; transition: all 0.2s; }
.sidebar.collapsed .sidebar-brand { padding: 20px 0; justify-content: center; cursor: pointer; }
.sidebar.collapsed .sidebar-brand:hover { background: rgba(255,255,255,0.04); }
.brand-icon svg { width: 36px; height: 36px; flex-shrink: 0; }
.brand-logo-img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.brand-text { flex: 1; min-width: 0; }
.brand-name { display: block; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; }
.brand-sub { display: block; font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; white-space: nowrap; }

.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 14px 16px; margin: 12px 12px 0; background: rgba(255,107,26,0.1); border-radius: 12px; border: 1px solid rgba(255,107,26,0.15); overflow: hidden; }
.user-avatar { width: 36px; height: 36px; background: #FF6B1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #fff; flex-shrink: 0; }
.user-avatar-sm { width: 36px; height: 36px; background: #FF6B1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #fff; margin: 12px auto 0; cursor: pointer; transition: all 0.2s; }
.user-avatar-sm:hover { transform: scale(1.05); box-shadow: 0 0 10px rgba(255,107,26,0.3); }
.user-info { min-width: 0; }
.user-name { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.4px; margin-top: 1px; }

.sidebar-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
.sidebar-nav::-webkit-scrollbar { width: 0; }
.nav-section-label { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 1.2px; padding: 10px 8px 4px; white-space: nowrap; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.15s; cursor: pointer; white-space: nowrap; position: relative; }
.nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.nav-item.active { background: rgba(255,107,26,0.12); color: #FF6B1A; font-weight: 500; }
.nav-item svg { width: 17px; height: 17px; flex-shrink: 0; }

.sidebar.collapsed .sidebar-nav { padding: 16px 8px; align-items: center; }
.sidebar.collapsed .nav-item { padding: 10px; justify-content: center; width: 44px; height: 44px; margin: 0 auto; }
.sidebar.collapsed .nav-item svg { width: 20px; height: 20px; }
.sidebar.collapsed .nav-section-label { display: none; }
.sidebar.collapsed .nav-badge { display: none; }
.sidebar.collapsed .logout-btn { padding: 10px; justify-content: center; width: 44px; height: 44px; margin: 0 auto; }
.sidebar.collapsed .logout-btn svg { width: 20px; height: 20px; }
.sidebar.collapsed .sidebar-footer { padding: 14px 8px; display: flex; justify-content: center; }

.nav-badge { margin-left: auto; font-size: 10px; font-weight: 600; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); padding: 1px 6px; border-radius: 5px; }
.nav-badge.danger { background: rgba(239,68,68,0.15); color: #f87171; }
.nav-badge.warning { background: rgba(255,107,26,0.15); color: #FF6B1A; }

.sidebar-footer { padding: 14px 12px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; overflow: hidden; }
.logout-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border-radius: 10px; border: none; background: none; color: rgba(255,255,255,0.35); font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }
.logout-btn svg { width: 17px; height: 17px; flex-shrink: 0; }

/* ── MAIN ── */
.main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.topbar { display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 64px; background: #fff; border-bottom: 1px solid #f0e8e0; flex-shrink: 0; }
.page-breadcrumb { font-size: 15px; color: #1a0a00; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }
.breadcrumb-orange { color: #FF6B1A; }
.page-breadcrumb::before { display: none; }
.page-breadcrumb::after { display: none; }
.page-breadcrumb-trail { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
.breadcrumb-category { color: #9a8070; }
.breadcrumb-sep { color: #c0b0a5; font-size: 12px; }
.breadcrumb-current { color: #FF6B1A; font-weight: 600; }
.page-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #1a0a00; margin-top: 1px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.icon-btn { position: relative; width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #f0e8e0; background: #faf8f6; display: flex; align-items: center; justify-content: center; color: #9a8070; cursor: pointer; transition: all 0.15s; }
.icon-btn:hover { border-color: #FF6B1A; color: #FF6B1A; background: #fff5ef; }
.icon-btn svg { width: 17px; height: 17px; }
.notif-dot { position: absolute; top: 7px; right: 7px; width: 6px; height: 6px; background: #FF6B1A; border-radius: 50%; border: 1.5px solid #fff; }
.date-chip { display: flex; align-items: center; gap: 6px; background: #fff5ef; border: 1.5px solid #ffd5b0; color: #c94000; font-size: 12px; font-weight: 500; padding: 7px 12px; border-radius: 10px; }
.date-chip svg { width: 14px; height: 14px; }

.content { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
.content::-webkit-scrollbar { width: 5px; }
.content::-webkit-scrollbar-track { background: transparent; }
.content::-webkit-scrollbar-thumb { background: #e8ddd6; border-radius: 3px; }
</style>