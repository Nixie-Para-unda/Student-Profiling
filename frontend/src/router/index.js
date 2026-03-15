import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import DashboardHome from '../views/dashboard/DashboardHome.vue'
import StudentsList from '../views/students/StudentsList.vue'
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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
