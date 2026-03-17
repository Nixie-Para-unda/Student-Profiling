import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import StudentLogin from '../views/StudentLogin.vue'
import SetupPassword from '../views/SetupPassword.vue'
import ActivateAccount from '../views/ActivateAccount.vue'
import MainLayout from '../layouts/MainLayout.vue'
import DashboardHome from '../views/dashboard/DashboardHome.vue'
import StudentsList from '../views/students/StudentsList.vue'
import StudentProfile from '../views/students/StudentProfile.vue'
import FacultyList from '../views/faculty/FacultyList.vue'
import PerformanceOverview from '../views/academic-performance/PerformanceOverview.vue'
import ViolationsList from '../views/violations/ViolationsList.vue'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/student/login',
    name: 'StudentLogin',
    component: StudentLogin,
    meta: { guest: true }
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
      {
        path: '',
        name: 'Dashboard',
        component: DashboardHome,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: StudentProfile,
        meta: { title: 'My Profile' }
      },
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
      // Placeholder routes to stop warnings
      { path: 'reports', name: 'Reports', component: { template: '<div>Reports Page</div>' } },
      { path: 'faculty-schedule', name: 'FacultySchedule', component: { template: '<div>Faculty Schedule Page</div>' } },
      { path: 'awards', name: 'Awards', component: { template: '<div>Awards Page</div>' } },
      { path: 'settings', name: 'Settings', component: { template: '<div>Settings Page</div>' } },
      { path: 'schedule', name: 'MySchedule', component: { template: '<div>My Schedule Page</div>' } },
      { path: 'subjects', name: 'MySubjects', component: { template: '<div>My Subjects Page</div>' } },
      { path: 'classes', name: 'MyClasses', component: { template: '<div>My Classes Page</div>' } },
      { path: 'profiles', name: 'StudentProfiles', component: { template: '<div>Student Profiles Page</div>' } },
      { path: 'record-violation', name: 'RecordViolation', component: { template: '<div>Record Violation Page</div>' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
  if (to.meta.guest && authStore.isAuthenticated) {
    return '/'
  }
})

export default router
