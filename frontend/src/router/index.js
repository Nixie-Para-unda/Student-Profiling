import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// ✅ Auth & Layout
import StudentLogin from '../views/auth/login/StudentLogin.vue'
import FacultyLogin from '../views/auth/login/FacultyLogin.vue'
import SetupPassword from '../views/auth/setup/SetupPassword.vue'
import SetupPasswordFaculty from '../views/auth/setup/SetupPasswordFaculty.vue'
import ActivateAccount from '../views/auth/activate/ActivateAccount.vue'
import MainLayout from '../layouts/MainLayout.vue'

import StudentProfile from '../views/student/StudentProfile.vue'

// ✅ Dean page imports
import DeanDashboard from '../views/dean/DeanDashboard.vue'
import CurriculumManagement from '../views/dean/CurriculumManagement.vue'
import CourseManagement from '../views/dean/CourseManagement.vue'
import PerformanceOverview from '../views/dean/PerformanceOverview.vue'
import ViolationsList from '../views/dean/ViolationsList.vue'
import ProfilingReport from '../views/dean/ProfilingReport.vue'
import ArchiveManagement from '../views/dean/ArchiveManagement.vue'

// ✅ Settings
import Settings from '../views/shared/Settings.vue'
import StudentManagement from '../views/shared/StudentManagement.vue'
import FacultyManagement from '../views/shared/FacultyManagement.vue'

// ✅ Secretary page imports
import SecretaryDashboard from '../views/secretary/SecretaryDashboard.vue'
import SecretaryFacultyWorkload from '../views/secretary/SecretaryFacultyWorkload.vue'
import SecretaryAchievements from '../views/secretary/SecretaryAchievements.vue'
import SecretaryReports from '../views/secretary/SecretaryReports.vue'

// ✅ Department Chair page imports
import ChairDashboard from '../views/chair/DepartmentChairDashboard.vue'
import ChairViolations from '../views/chair/DepartmentChairViolations.vue'
import ChairAwards from '../views/chair/DepartmentChairAwards.vue'
import ChairPerformance from '../views/chair/DepartmentChairPerformance.vue'
import ChairReports from '../views/chair/DepartmentChairReports.vue'
import ChairSchedules from '../views/chair/ScheduleManagement.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'FacultyLogin', component: FacultyLogin },
  { path: '/students/login', name: 'StudentLogin', component: StudentLogin },
  { path: '/setup-password', name: 'SetupPassword', component: SetupPassword },
  { path: '/setup-password-faculty', name: 'SetupPasswordFaculty', component: SetupPasswordFaculty },
  { path: '/activate', name: 'ActivateAccount', component: ActivateAccount },

  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      // ── Student routes ──────────────────────────
      {
        path: 'student/dashboard',
        name: 'StudentDashboard',
        component: () => import('../views/student/StudentDashboard.vue'),
        meta: { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'student', sidebar: true, icon: 'dashboard', section: 'Overview' }
      },
      {
        path: 'student/profile',
        name: 'MyProfile',
        component: StudentProfile,
        meta: { title: 'My Profile', breadcrumb: 'Student Portal > My Profile', role: 'student', sidebar: true, icon: 'profile', section: 'My Academic' }
      },
      {
        path: 'student/curriculum',
        name: 'MyCurriculum',
        component: () => import('../views/student/StudentSchedule.vue'),
        meta: { title: 'My Curriculum', breadcrumb: 'Academic > My Curriculum', role: 'student', sidebar: true, icon: 'curriculum', section: 'My Academic' }
      },
      {
        path: 'student/schedule',
        name: 'MySchedule',
        component: () => import('../views/student/StudentSchedule.vue'),
        meta: { title: 'My Schedule', breadcrumb: 'Academic > My Schedule', role: 'student', sidebar: true, icon: 'schedule', section: 'Academics' }
      },
      {
        path: 'student/achievements',
        name: 'MyAchievements',
        component: () => import('../views/student/StudentAwards.vue'),
        meta: { title: 'My Achievements', breadcrumb: 'Student Portal > My Achievements', role: 'student', sidebar: true, icon: 'awards', section: 'My Activities' }
      },
      {
        path: 'student/violations',
        name: 'MyViolations',
        component: () => import('../views/student/StudentViolations.vue'),
        meta: { title: 'My Violations', breadcrumb: 'Student Portal > My Violations', role: 'student', sidebar: true, icon: 'violations', section: 'My Academic' }
      },

      // ── Dean routes ─────────────────────────────
      {
        path: 'dean/dashboard',
        name: 'DeanDashboard',
        component: DeanDashboard,
        meta: { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'dean', sidebar: true, icon: 'dashboard', section: 'Overview' }
      },
      {
        path: 'profiling/report',
        name: 'ProfilingReport',
        component: ProfilingReport,
        meta: { title: 'Profiling Reports', breadcrumb: 'Overview > Profiling Reports', role: 'dean', sidebar: true, icon: 'reports', section: 'Overview' }
      },
      {
        path: 'dean/curriculum',
        name: 'CurriculumManagement',
        component: CurriculumManagement,
        meta: { title: 'Curriculum', breadcrumb: 'Overview > Curriculum', role: 'dean', sidebar: true, icon: 'curriculum', section: 'Overview' }
      },
      {
        path: 'dean/courses',
        name: 'CourseManagement',
        component: CourseManagement,
        meta: { title: 'Courses', breadcrumb: 'Overview > Course Management', role: 'dean', sidebar: true, icon: 'courses', section: 'Overview' }
      },
      {
        path: 'academic-performance',
        name: 'AcademicPerformance',
        component: PerformanceOverview,
        meta: { title: 'Academic Performance', breadcrumb: 'Academic > Academic Performance', role: 'dean', sidebar: true, icon: 'performance', section: 'Academic' }
      },
      {
        path: 'violations',
        name: 'Violations',
        component: ViolationsList,
        meta: { title: 'Violations', breadcrumb: 'Academic > Student Violations', role: 'dean', sidebar: true, icon: 'violations', section: 'Academic' }
      },
      {
        path: 'violations/:id',
        name: 'ViolationDetail',
        component: ViolationsList,
        meta: { title: 'Violations', breadcrumb: 'Academic > Student Violations', role: ['dean', 'department_chair', 'faculty'], sidebar: false }
      },
      {
        path: 'students',
        name: 'StudentManagement',
        component: StudentManagement,
        meta: { title: 'Student Accounts', breadcrumb: 'Academic > Student Accounts', role: ['dean', 'secretary', 'department_chair'], sidebar: true, icon: 'profile', section: 'Accounts' }
      },
      {
        path: 'students/:id',
        name: 'StudentDetail',
        component: StudentManagement,
        meta: { title: 'Student Accounts', breadcrumb: 'Academic > Student Accounts', role: ['dean', 'secretary', 'department_chair', 'faculty'], sidebar: false }
      },
      {
        path: 'faculty',
        name: 'FacultyManagement',
        component: FacultyManagement,
        meta: { title: 'Faculty Accounts', breadcrumb: 'Academic > Faculty Accounts', role: ['dean', 'secretary', 'department_chair'], sidebar: true, icon: 'faculty', section: 'Accounts' }
      },
      {
        path: 'faculty/:id',
        name: 'FacultyDetail',
        component: FacultyManagement,
        meta: { title: 'Faculty Accounts', breadcrumb: 'Academic > Faculty Accounts', role: ['dean', 'secretary', 'department_chair'], sidebar: false }
      },
      {
        path: 'dean/archive',
        name: 'ArchiveManagement',
        component: ArchiveManagement,
        meta: { title: 'Archive Management', breadcrumb: 'Management > Archive', role: 'dean', sidebar: true, icon: 'archive', section: 'Management' }
      },

      // ── Faculty routes ──────────────────────────
      {
        path: 'faculty/dashboard',
        name: 'FacultyDashboard',
        component: () => import('../views/faculty/FacultyDashboard.vue'),
        meta: { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'faculty', sidebar: true, icon: 'dashboard', section: 'Overview' }
      },
      {
        path: 'faculty/schedule',
        name: 'FacultySchedule',
        component: () => import('../views/faculty/FacultySchedule.vue'),
        meta: { title: 'My Schedule', breadcrumb: 'Academic > My Schedule', role: 'faculty', sidebar: true, icon: 'schedule', section: 'My Classes' }
      },
      {
        path: 'faculty/subjects',
        name: 'FacultySubjects',
        component: () => import('../views/faculty/FacultySchedule.vue'), // Assuming subjects use same view or update later
        meta: { title: 'My Subjects', breadcrumb: 'Academic > My Subjects', role: 'faculty', sidebar: true, icon: 'subjects', section: 'My Classes' }
      },
      {
        path: 'faculty/students',
        name: 'FacultyStudents',
        component: () => import('../views/faculty/FacultyStudentManagement.vue'),
        meta: { title: 'Student Profiles', breadcrumb: 'Academic > Student Profiles', role: 'faculty', sidebar: true, icon: 'profile', section: 'Monitoring' }
      },
      {
        path: 'faculty/violations',
        name: 'FacultyViolations',
        component: () => import('../views/faculty/FacultyViolationManagement.vue'),
        meta: { title: 'Record Violation', breadcrumb: 'Academic > Student Violations', role: 'faculty', sidebar: true, icon: 'violations', section: 'Monitoring' }
      },
      {
        path: 'faculty/awards',
        name: 'FacultyAwards',
        component: () => import('../views/chair/DepartmentChairAwards.vue'), // Assuming same or update later
        meta: { title: 'Recommend Awards', breadcrumb: 'Academic > Recommend Awards', role: 'faculty', sidebar: true, icon: 'awards', section: 'Monitoring' }
      },
      {
        path: 'faculty/profile',
        name: 'FacultyProfile',
        component: StudentProfile, // Using shared profile or faculty profile
        meta: { title: 'My Profile', breadcrumb: 'Faculty Portal > My Profile', role: 'faculty', sidebar: true, icon: 'profile', section: 'My Academic' }
      },

      // ── Secretary routes ─────────────────────────
      {
        path: 'secretary/dashboard',
        name: 'SecretaryDashboard',
        component: SecretaryDashboard,
        meta: { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'secretary', sidebar: true, icon: 'dashboard', section: 'Overview' }
      },
      {
        path: 'secretary/faculty-schedule',
        name: 'SecretaryFacultySchedule',
        component: SecretaryFacultyWorkload,
        meta: { title: 'Faculty Workload', breadcrumb: 'Monitoring > Faculty Workload', role: ['secretary', 'dean'], sidebar: true, icon: 'schedule', section: 'Monitoring' }
      },
      {
        path: 'secretary/achievements',
        name: 'SecretaryAchievements',
        component: SecretaryAchievements,
        meta: { title: 'Achievement Verification', breadcrumb: 'Management > Achievement Verification', role: 'secretary', sidebar: true, icon: 'awards', section: 'Management', badge: '8', badgeClass: 'warning' }
      },
      {
        path: 'secretary/reports',
        name: 'SecretaryReports',
        component: SecretaryReports,
        meta: { title: 'Generate Reports', breadcrumb: 'Reports > Generate Reports', role: 'secretary', sidebar: true, icon: 'reports', section: 'Reports' }
      },

      // ── Chair routes ─────────────────────────────
      {
        path: 'chair/dashboard',
        name: 'ChairDashboard',
        component: ChairDashboard,
        meta: { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'department_chair', sidebar: true, icon: 'dashboard', section: 'Overview' }
      },
      {
        path: 'chair/performance',
        name: 'DepartmentChairPerformance',
        component: ChairPerformance,
        meta: { title: 'Academic Performance', breadcrumb: 'Academic > Academic Performance', role: 'department_chair', sidebar: true, icon: 'performance', section: 'Academic' }
      },
      {
        path: 'chair/schedules',
        name: 'ChairSchedules',
        component: ChairSchedules,
        meta: { title: 'Manage Schedules', breadcrumb: 'Academic > Schedule Management', role: 'department_chair', sidebar: true, icon: 'schedule', section: 'Academic' }
      },
      {
        path: 'chair/violations',
        name: 'DepartmentChairViolations',
        component: ChairViolations,
        meta: { title: 'Student Violations', breadcrumb: 'Academic > Student Violations', role: 'department_chair', sidebar: true, icon: 'violations', section: 'Management', badge: '12', badgeClass: 'danger' }
      },
      {
        path: 'chair/awards',
        name: 'DepartmentChairAwards',
        component: ChairAwards,
        meta: { title: 'Approve Awards', breadcrumb: 'Academic > Approve Awards', role: 'department_chair', sidebar: true, icon: 'awards', section: 'Management', badge: '5', badgeClass: 'warning' }
      },
      {
        path: 'chair/reports',
        name: 'DepartmentChairReports',
        component: ChairReports,
        meta: { title: 'Generate Reports', breadcrumb: 'Reports > Generate Reports', role: 'department_chair', sidebar: true, icon: 'reports', section: 'Management' }
      },


      // Shared
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { title: 'Account Settings', breadcrumb: 'Settings > Account Settings', sidebar: false, icon: 'settings', section: 'Settings' }
      }
    ]

  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token
  const userRole = authStore.user?.role

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If trying to access student routes, redirect to student login
    if (to.path.startsWith('/student')) {
      next('/students/login')
    } else {
      next('/login')
    }
  } else if (isAuthenticated && (to.path === '/login' || to.path === '/students/login')) {
    // Redirect to respective dashboard based on role if already logged in
    if (userRole === 'student') next('/student/dashboard')
    else if (userRole === 'dean') next('/dean/dashboard')
    else if (userRole === 'secretary') next('/secretary/dashboard')
    else if (userRole === 'department_chair') next('/chair/dashboard')
    else if (userRole === 'faculty') next('/faculty/dashboard')
    else next('/')
  } else {
    next()
  }
})

export default router
