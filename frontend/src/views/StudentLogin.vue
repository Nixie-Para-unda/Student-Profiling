<template>
  <div class="login-page">
    <!-- Background decorative elements -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="login-container">
      <!-- Left panel -->
      <div class="left-panel">
        <div class="brand-mark">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#4F46E5"/>
              <path d="M8 20C8 13.373 13.373 8 20 8s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20z" fill="white" fill-opacity="0.2"/>
              <path d="M14 20h12M20 14v12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="brand-name">CCS Student Portal</span>
        </div>

        <div class="left-content">
          <h1 class="hero-text">Student<br/><span class="accent-blue">Self-Service</span><br/>Portal</h1>
          <p class="hero-sub">Access your academic records, schedules, and departmental updates.</p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-dot blue"></div>
              <span>View grades and performance</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot blue"></div>
              <span>Check class schedules</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot blue"></div>
              <span>Track academic progress</span>
            </div>
          </div>
        </div>

        <div class="left-footer">
          <span>© 2024 Department of Information Systems</span>
        </div>
      </div>

      <!-- Right panel (form) -->
      <div class="right-panel">
        <div class="form-card">
          <div class="form-header">
            <h2>Student Login</h2>
            <p>Enter your student number to access your portal</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="field-group">
              <label for="student-number">Student Number</label>
              <div class="input-wrapper" :class="{ focused: idFocused, filled: studentId }">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  v-model="studentId"
                  id="student-number"
                  name="studentId"
                  type="text"
                  required
                  placeholder="202X-XXXXX"
                  @focus="idFocused = true"
                  @blur="idFocused = false"
                />
              </div>
            </div>

            <div class="field-group">
              <label for="password">
                Password
                <a href="#" class="forgot-link blue">Forgot?</a>
              </label>
              <div class="input-wrapper" :class="{ focused: passwordFocused, filled: password }">
                <svg class="input-icon" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="10" cy="13" r="1" fill="currentColor"/>
                </svg>
                <input
                  v-model="password"
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="Enter your password"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                />
                <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                  <svg v-if="showPassword" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="error-message">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <button type="submit" class="submit-button blue" :disabled="loading">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign In</span>
              <svg v-if="!loading" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </form>

          <div class="form-footer">
            <p>Are you a faculty member? <router-link to="/login">Faculty Login</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const studentId = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const idFocused = ref(false)
const passwordFocused = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(studentId.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid student number or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Inheriting some styles from Login.vue or global styles, 
   but adding student-specific blue theme */
.accent-blue {
  color: #4F46E5;
}

.feature-dot.blue {
  background: #4F46E5;
}

.submit-button.blue {
  background: #4F46E5;
}

.submit-button.blue:hover {
  background: #4338CA;
}

.forgot-link.blue {
  color: #4F46E5;
}

/* Base styles copied and adapted from Login.vue */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: #4F46E5;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: #818CF8;
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: #C7D2FE;
  top: 40%;
  left: 15%;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 650px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.left-panel {
  flex: 1;
  background: #0f172a;
  color: white;
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 64px;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.left-content {
  flex: 1;
}

.hero-text {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: 1.125rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 400px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #e2e8f0;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.left-footer {
  color: #64748b;
  font-size: 0.875rem;
}

.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #ffffff;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-header p {
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  justify-content: space-between;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.input-wrapper.focused {
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.input-icon {
  width: 20px;
  height: 20px;
  margin-left: 16px;
  color: #94a3b8;
}

.input-wrapper.focused .input-icon {
  color: #4F46E5;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #1e293b;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.toggle-password {
  background: none;
  border: none;
  padding: 0 16px;
  color: #94a3b8;
  cursor: pointer;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.forgot-link {
  font-weight: 500;
  text-decoration: none;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button svg {
  width: 18px;
  height: 18px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
}

.error-message svg {
  width: 20px;
  height: 20px;
}

.form-footer {
  margin-top: 32px;
  text-align: center;
}

.form-footer p {
  color: #64748b;
  font-size: 0.875rem;
}

.form-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .left-panel {
    display: none;
  }
  .login-container {
    max-width: 500px;
  }
}
</style>