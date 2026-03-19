import { createRouter, createWebHistory } from 'vue-router'
import FacultyLogin from '../views/auth/login/FacultyLogin.vue'
import StudentLogin from '../views/auth/login/StudentLogin.vue'
import SetupPassword from '../views/SetupPassword.vue'
import ActivateAccount from '../views/ActivateAccount.vue'
import MainLayout from '../layouts/MainLayout.vue'
import DashboardHome from '../views/dashboard/DashboardHome.vue'
import StudentsList from '../views/students/StudentsList.vue'
import StudentProfile from '../views/students/StudentProfile.vue'
import FacultyList from '../views/faculty/FacultyList.vue'
import PerformanceOverview from '../views/academic-performance/PerformanceOverview.vue'
import ViolationsList from '../views/violations/ViolationsList.vue'

// ✅ Student page imports
import MyAffiliations from '../views/students/StudentAffiliation.vue'
import MyActivities from '../views/students/StudentActivities.vue'
import MySchedule from '../views/students/StudentSchedule.vue'
import MyAcademicHistory from '../views/students/StudentAcademicHistory.vue'
import MyAwards from '../views/students/StudentAwards.vue'
import MyViolations from '../views/students/StudentViolations.vue'
import MyPerformance from '../views/students/StudentPerformance.vue'

// Department Chair page imports
import ChairStudents from '../views/chair/DepartmentChairStudents.vue'
import ChairFaculty from '../views/chair/DepartmentChairFaculty.vue'
import ChairViolations from '../views/chair/DepartmentChairViolations.vue'
import ChairAwards from '../views/chair/DepartmentChairAwards.vue'
import ChairPerformance from '../views/chair/DepartmentChairPerformance.vue'
import ChairReports from '../views/chair/DepartmentChairReports.vue'

// ✅ Settings
import Settings from '../views/settings/Settings.vue'

// ✅ router/index.js is in src/router/ so store is ONE level up — NOT two
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: FacultyLogin,
    meta: { guest: true, title: 'Faculty Login' }
  },
  {
    path: '/student/login',
    name: 'StudentLogin',
    component: StudentLogin,
    meta: { guest: true, title: 'Student Login' }
  },
  {
    path: '/setup-password',
    name: 'SetupPassword',
    component: SetupPassword,
    meta: { guest: true }
  },
  {
    path: '/activate',
    name: 'ActivateAccount',
    component: ActivateAccount,
    meta: { guest: true }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [

      // ── Shared ──────────────────────────────────
      {
        path: '',
        name: 'Dashboard',
        component: DashboardHome,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { title: 'Settings' }
      },

      // ── Dean routes ──────────────────────────────
      {
        path: 'students',
        name: 'Students',
        component: StudentsList,
        meta: { title: 'Students' }
      },
      {
        path: 'faculty',
        name: 'Faculty',
        component: FacultyList,
        meta: { title: 'Faculty' }
      },
      {
        path: 'academic-performance',
        name: 'AcademicPerformance',
        component: PerformanceOverview,
        meta: { title: 'Academic Performance' }
      },
      {
        path: 'violations',
        name: 'Violations',
        component: ViolationsList,
        meta: { title: 'Violations' }
      },

      // ── Student routes ───────────────────────────
      {
        path: 'student/profile',
        name: 'StudentProfile',
        component: StudentProfile,
        meta: { title: 'My Profile' }
      },
      {
        path: 'student/affiliations',
        name: 'MyAffiliations',
        component: MyAffiliations,
        meta: { title: 'Affiliations' }
      },
      {
        path: 'student/activities',
        name: 'MyActivities',
        component: MyActivities,
        meta: { title: 'Activities' }
      },
      {
        path: 'student/schedule',
        name: 'MySchedule',
        component: MySchedule,
        meta: { title: 'My Schedule' }
      },
      {
        path: 'student/academic-history',
        name: 'MyAcademicHistory',
        component: MyAcademicHistory,
        meta: { title: 'Academic History' }
      },
      {
        path: 'student/awards',
        name: 'MyAwards',
        component: MyAwards,
        meta: { title: 'Awards' }
      },
      {
        path: 'student/violations',
        name: 'MyViolations',
        component: MyViolations,
        meta: { title: 'My Violations' }
      },
      {
        path: 'student/performance',
        name: 'MyPerformance',
        component: MyPerformance,
        meta: { title: 'My Performance' }
      },

      // ── Faculty placeholders ─────────────────────
      { path: 'faculty/schedule', name: 'FacultyMySchedule', component: { template: '<div>Faculty Schedule</div>' } },
      { path: 'faculty/subjects', name: 'FacultySubjects', component: { template: '<div>My Subjects</div>' } },
      { path: 'faculty/students', name: 'FacultyStudents', component: { template: '<div>Student Profiles</div>' } },
      { path: 'faculty/violations', name: 'FacultyViolations', component: { template: '<div>Record Violation</div>' } },
      { path: 'faculty/awards', name: 'FacultyAwards', component: { template: '<div>Recommend Awards</div>' } },
      { path: 'faculty/profile', name: 'FacultyProfile', component: { template: '<div>Faculty Profile</div>' } },

      // ── Dean placeholders ────────────────────────
      { path: 'reports', name: 'Reports', component: { template: '<div>Reports Page</div>' } },
      { path: 'faculty-schedule', name: 'FacultySchedule', component: { template: '<div>Faculty Schedule Page</div>' } },
      { path: 'awards', name: 'Awards', component: { template: '<div>Awards Page</div>' } },

      // ── Old placeholders (kept so nothing breaks) ─
      { path: 'subjects', name: 'MySubjects', component: { template: '<div>My Subjects Page</div>' } },
      { path: 'classes', name: 'MyClasses', component: { template: '<div>My Classes Page</div>' } },
      { path: 'profiles', name: 'StudentProfiles', component: { template: '<div>Student Profiles Page</div>' } },
      { path: 'record-violation', name: 'RecordViolation', component: { template: '<div>Record Violation Page</div>' } },

      // ── Secretary placeholders ───────────────────
      { path: 'secretary/students', name: 'SecretaryStudents', component: { template: '<div>Secretary - Student Accounts</div>' } },
      { path: 'secretary/faculty', name: 'SecretaryFaculty', component: { template: '<div>Secretary - Faculty Accounts</div>' } },
      { path: 'secretary/faculty-schedule', name: 'SecretaryFacultySchedule', component: { template: '<div>Secretary - Faculty Workload</div>' } },
      { path: 'secretary/profiles', name: 'SecretaryProfiles', component: { template: '<div>Secretary - Student Profiles</div>' } },
      { path: 'secretary/achievements', name: 'SecretaryAchievements', component: { template: '<div>Secretary - Achievement Verification</div>' } },
      { path: 'secretary/reports', name: 'SecretaryReports', component: { template: '<div>Secretary - Generate Reports</div>' } },

      // ── Chair routes ─────────────────────────────
      { path: 'chair/students', name: 'DepartmentChairStudents', component: ChairStudents, meta: { title: 'Student Profiles' } },
      { path: 'chair/faculty', name: 'DepartmentChairFaculty', component: ChairFaculty, meta: { title: 'Faculty Members' } },
      { path: 'chair/violations', name: 'DepartmentChairViolations', component: ChairViolations, meta: { title: 'Student Violations' } },
      { path: 'chair/awards', name: 'DepartmentChairAwards', component: ChairAwards, meta: { title: 'Approve Awards' } },
      { path: 'chair/performance', name: 'DepartmentChairPerformance', component: ChairPerformance, meta: { title: 'Academic Performance' } },
      { path: 'chair/reports', name: 'DepartmentChairReports', component: ChairReports, meta: { title: 'Generate Reports' } },

      // ── Redirect old /profile ────────────────────
      { path: 'profile', redirect: 'student/profile' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  // Update document title
  const baseTitle = 'CCS Student Profiling System'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
  if (to.meta.guest && authStore.isAuthenticated) {
    return '/'
  }
})

export default router