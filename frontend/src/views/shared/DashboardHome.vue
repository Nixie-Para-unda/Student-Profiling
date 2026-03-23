<template>
  <div class="dashboard-main-container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading Portal...</p>
    </div>

    <div v-else class="role-content">
      <StudentDashboard v-if="authStore.isStudent" />
      <FacultyDashboard v-else-if="authStore.isFaculty" />
      <DeanDashboard v-else-if="authStore.isDean" />
      <SecretaryDashboard v-else-if="authStore.isSecretary" />
      <ChairDashboard v-else-if="authStore.isChair" />

      <div v-else class="unauthorized-state">
        <h3>Role Not Found</h3>
        <p>Your account does not have a dashboard assigned. Please contact the CCS department.</p>
        <button @click="handleLogout" class="logout-btn">Return to Login</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'


import StudentDashboard from '../student/StudentDashboard.vue'
import FacultyDashboard from '../faculty/FacultyDashboard.vue'
import DeanDashboard from '../dean/DeanDashboard.vue'
import SecretaryDashboard from '../secretary/SecretaryDashboard.vue'
import ChairDashboard from '../chair/DepartmentChairDashboard.vue'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Give the app a moment to verify the auth state
  setTimeout(() => {
    loading.value = false
  }, 400)
})
</script>

<style scoped>
.dashboard-main-container {
  min-height: 100vh;
  background-color: #f8f7f5;
  width: 100%;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #9a8070;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0e8e0;
  border-top: 4px solid #FF6B1A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.unauthorized-state {
  text-align: center;
  padding: 100px 20px;
}

.logout-btn {
  margin-top: 20px;
  background: #FF6B1A;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>