import { createRouter, createWebHistory } from 'vue-router'
import FacultyLogin from '../views/auth/login/FacultyLogin.vue'
import StudentLogin from '../views/auth/login/StudentLogin.vue'
import SetupPassword from '../views/auth/setup/SetupPassword.vue'
import SetupPasswordFaculty from '../views/auth/setup/SetupPasswordFaculty.vue'
import ActivateAccount from '../views/auth/activate/ActivateAccount.vue'
import MainLayout from '../layouts/MainLayout.vue'

import StudentsList from '../views/dean/StudentsList.vue'
import StudentProfile from '../views/student/StudentProfile.vue'
import FacultyList from '../views/dean/FacultyList.vue'
import PerformanceOverview from '../views/dean/PerformanceOverview.vue'
import ViolationsList from '../views/dean/ViolationsList.vue'
import ProfilingReport from '../views/dean/ProfilingReport.vue'
import CurriculumManagement from '../views/dean/CurriculumManagement.vue'
import CourseManagement from '../views/dean/CourseManagement.vue'
import FacultySchedule from '../views/faculty/FacultySchedule.vue'

// ✅ Student page imports
import MyAffiliations from '../views/student/StudentAffiliation.vue'
import MyActivities from '../views/student/StudentActivities.vue'
import MySchedule from '../views/student/StudentSchedule.vue'
import MyAcademicHistory from '../views/student/StudentAcademicHistory.vue'
import MyAwards from '../views/student/StudentAwards.vue'
import MyViolations from '../views/student/StudentViolations.vue'
import MyPerformance from '../views/student/StudentPerformance.vue'

// Department Chair page imports
import ChairStudents from '../views/chair/DepartmentChairStudents.vue'
import ChairFaculty from '../views/chair/DepartmentChairFaculty.vue'
import ChairViolations from '../views/chair/DepartmentChairViolations.vue'
import ChairAwards from '../views/chair/DepartmentChairAwards.vue'
import ChairPerformance from '../views/chair/DepartmentChairPerformance.vue'
import ChairReports from '../views/chair/DepartmentChairReports.vue'
import ChairSchedules from '../views/chair/ScheduleManagement.vue'

// ✅ Settings
import Settings from '../views/shared/Settings.vue'

// ✅ Secretary page imports
import SecretaryStudents from '../views/secretary/SecretaryStudent.vue'
import SecretaryFaculty from '../views/secretary/SecretaryFaculty.vue'
import SecretaryFacultyWorkload from '../views/secretary/SecretaryFacultyWorkload.vue'
import SecretaryStudentProfiles from '../views/secretary/SecretaryStudentProfiles.vue'
import SecretaryAchievements from '../views/secretary/SecretaryAchievements.vue'
import SecretaryReports from '../views/secretary/SecretaryReports.vue'

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
    path: '/faculty/setup-password',
    name: 'SetupPasswordFaculty',
    component: SetupPasswordFaculty,
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
      {
        path: '',
        redirect: to => {
          const authStore = useAuthStore()
          if (authStore.isStudent) return '/student/profile';
          if (authStore.isFaculty) return '/faculty/schedule';
          if (authStore.isDean) return '/students';
          if (authStore.isChair) return '/chair/students';
          if (authStore.isSecretary) return '/secretary/students';
          return '/login';
        }
      },
      // ── Shared ──────────────────────────────────
      
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
        meta: { title: 'Student Violations' }
      },
      {
        path: 'profiling/report',
        name: 'ProfilingReport',
        component: ProfilingReport,
        meta: { title: 'Profiling Report Engine' }
      },
      {
        path: 'dean/curriculum',
        name: 'CurriculumManagement',
        component: CurriculumManagement,
        meta: { title: 'Curriculum Management' }
      },
      {
        path: 'dean/courses',
        name: 'CourseManagement',
        component: CourseManagement,
        meta: { title: 'Course Management' }
      },
      { path: 'reports', name: 'Reports', component: { template: '<div>Reports Page</div>' } },
      { path: 'faculty-schedule', name: 'FacultyScheduleManagement', component: { template: '<div>Faculty Schedule Management Page</div>' } },
      { path: 'awards', name: 'Awards', component: { template: '<div>Awards Page</div>' } },

      // ── Faculty routes ──────────────────────────
      {
        path: 'faculty/schedule',
        name: 'FacultySchedule',
        component: FacultySchedule,
        meta: { title: 'My Schedule' }
      },
      { path: 'faculty/subjects', name: 'FacultySubjects', component: { template: '<div>My Subjects</div>' } },
      { path: 'faculty/students', name: 'FacultyStudents', component: { template: '<div>Student Profiles</div>' } },
      { path: 'faculty/violations', name: 'FacultyViolations', component: { template: '<div>Record Violation</div>' } },
      { path: 'faculty/awards', name: 'FacultyAwards', component: { template: '<div>Recommend Awards</div>' } },
      { path: 'faculty/profile', name: 'FacultyProfile', component: { template: '<div>Faculty Profile</div>' } },

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

      // ── Secretary routes ─────────────────────────
      { path: 'secretary/students', name: 'SecretaryStudents', component: SecretaryStudents, meta: { title: 'Student Accounts' } },
      { path: 'secretary/faculty', name: 'SecretaryFaculty', component: SecretaryFaculty, meta: { title: 'Faculty Accounts' } },
      { path: 'secretary/faculty-schedule', name: 'SecretaryFacultySchedule', component: SecretaryFacultyWorkload, meta: { title: 'Faculty Workload' } },
      { path: 'secretary/profiles', name: 'SecretaryProfiles', component: SecretaryStudentProfiles, meta: { title: 'Student Profiles' } },
      { path: 'secretary/achievements', name: 'SecretaryAchievements', component: SecretaryAchievements, meta: { title: 'Achievement Verification' } },
      { path: 'secretary/reports', name: 'SecretaryReports', component: SecretaryReports, meta: { title: 'Generate Reports' } },

      // ── Chair routes ─────────────────────────────
      { path: 'chair/students', name: 'DepartmentChairStudents', component: ChairStudents, meta: { title: 'Student Profiles' } },
      { path: 'chair/faculty', name: 'DepartmentChairFaculty', component: ChairFaculty, meta: { title: 'Faculty Members' } },
      { path: 'chair/violations', name: 'DepartmentChairViolations', component: ChairViolations, meta: { title: 'Student Violations' } },
      { path: 'chair/awards', name: 'DepartmentChairAwards', component: ChairAwards, meta: { title: 'Approve Awards' } },
      { path: 'chair/performance', name: 'DepartmentChairPerformance', component: ChairPerformance, meta: { title: 'Academic Performance' } },
      { path: 'chair/schedules', name: 'ChairSchedules', component: ChairSchedules, meta: { title: 'Schedule Management' } },
      { path: 'chair/reports', name: 'DepartmentChairReports', component: ChairReports, meta: { title: 'Generate Reports' } },

      // ── Redirect old /profile ────────────────────
      { path: 'profile', redirect: 'student/profile' }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
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
    if (authStore.isStudent) return '/student/profile';
    if (authStore.isFaculty) return '/faculty/schedule';
    if (authStore.isDean) return '/students';
    if (authStore.isChair) return '/chair/students';
    if (authStore.isSecretary) return '/secretary/students';
    return '/'; // Fallback
  }
})

export default router
