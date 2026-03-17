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
              <rect width="40" height="40" rx="10" fill="#FF6B1A"/>
              <path d="M8 20C8 13.373 13.373 8 20 8s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20z" fill="white" fill-opacity="0.2"/>
              <path d="M14 20h12M20 14v12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="brand-name">CCS Portal</span>
        </div>

        <div class="left-content">
          <h1 class="hero-text">Department<br/><span class="accent">Information</span><br/>System</h1>
          <p class="hero-sub">Unified access to faculty resources, scheduling, and departmental workflows.</p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Real-time schedule management</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Faculty workload tracking</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Student Information Tracking</span>
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
            <h2>Faculty Login</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="field-group">
              <label for="email-address">Email Address</label>
              <div class="input-wrapper" :class="{ focused: emailFocused, filled: email }">
                <svg class="input-icon" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.5l7.5 5 7.5-5M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                  v-model="email"
                  id="email-address"
                  name="email"
                  type="text"
                  autocomplete="email"
                  required
                  placeholder="you@department.edu"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
              </div>
            </div>

            <div class="field-group">
              <label for="password">
                Password
                <a href="#" class="forgot-link">Forgot password?</a>
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
                <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                  <svg v-if="!showPassword" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="none">
                    <path d="M3 3l14 14M8.5 8.5A2.5 2.5 0 0112.5 12M6 5.5C4.3 6.8 3 8.5 3 10s3.5 6 7 6c1.5 0 2.9-.5 4-1.3M14.5 14C16.1 12.7 17 11.1 17 10c0-1.5-3.5-6-7-6-1 0-1.9.2-2.8.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="error-alert">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ error }}
            </div>

            <button type="submit" class="submit-btn" :class="{ loading: loading }" :disabled="loading">
              <span class="btn-content">
                <span v-if="!loading">Sign In</span>
                <span v-else class="loading-state">
                  <span class="spinner"></span>
                  Signing in...
                </span>
              </span>
              <svg v-if="!loading" class="btn-arrow" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="form-footer">
              <p>Are you a student? <router-link to="/student/login">Student Login</router-link></p>
            </div>
          </form>

          <!-- <div class="demo-credentials">
            <div class="demo-header">
              <span class="demo-line"></span>
              <span class="demo-label">Demo Accounts</span>
              <span class="demo-line"></span>
            </div>
            <div class="demo-accounts">
              <button type="button" class="demo-chip" @click="fillDemo('dean@example.com', 'password')">
                <svg viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  <path d="M11 8.5l1 1 2-2" stroke="#FF6B1A" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Dean Account
              </button>
              <button type="button" class="demo-chip" @click="fillDemo('faculty@example.com', 'password')">
                <svg viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                Faculty Account
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const fillDemo = (demoEmail, demoPassword) => {
  email.value = demoEmail
  password.value = demoPassword
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

* { box-sizing: border-box; }

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Background */
.bg-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.07;
}
.circle-1 {
  width: 600px; height: 600px;
  background: #FF6B1A;
  top: -200px; right: -150px;
}
.circle-2 {
  width: 400px; height: 400px;
  background: #FF6B1A;
  bottom: -150px; left: -100px;
}
.circle-3 {
  width: 200px; height: 200px;
  background: #FF6B1A;
  top: 50%; left: 42%;
  transform: translate(-50%, -50%);
}
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 107, 26, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 26, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Layout */
.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* Left panel */
.left-panel {
  flex: 1;
  background: linear-gradient(145deg, #1a0a00 0%, #2d1200 40%, #3d1f00 100%);
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.left-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B1A' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}
.logo-icon svg { width: 40px; height: 40px; }
.brand-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  letter-spacing: 0.5px;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.hero-text {
  font-family: 'Syne', sans-serif;
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -1px;
}
.hero-text .accent { color: #FF6B1A; }

.hero-sub {
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  max-width: 340px;
  margin: 0 0 40px;
}

.feature-list { display: flex; flex-direction: column; gap: 14px; }
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}
.feature-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #FF6B1A;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(255,107,26,0.6);
}

.left-footer {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  position: relative;
}

/* Right panel */
.right-panel {
  width: 520px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 48px;
  background: #fff;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 36px;
}
.form-header h2 {
  font-family: 'Syne', sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}
.form-header p {
  font-size: 14px;
  color: #9a8070;
  margin: 0;
}

/* Form fields */
.login-form { display: flex; flex-direction: column; gap: 20px; }

.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: #4a3020;
  letter-spacing: 0.2px;
}
.forgot-link {
  font-size: 12px;
  color: #FF6B1A;
  text-decoration: none;
  font-weight: 400;
  transition: opacity 0.2s;
}
.forgot-link:hover { opacity: 0.7; }

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid #e8ddd6;
  border-radius: 10px;
  background: #faf8f6;
  transition: all 0.2s ease;
  overflow: hidden;
}
.input-wrapper.focused {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.1);
}
.input-wrapper.filled { background: #fff; }

.input-icon {
  width: 18px; height: 18px;
  color: #b89f90;
  flex-shrink: 0;
  margin-left: 14px;
  transition: color 0.2s;
}
.input-wrapper.focused .input-icon { color: #FF6B1A; }

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 13px 14px;
  font-size: 14px;
  color: #1a0a00;
  font-family: 'DM Sans', sans-serif;
  outline: none;
}
.input-wrapper input::placeholder { color: #c0b0a5; }

.toggle-password {
  background: none;
  border: none;
  padding: 0 14px;
  cursor: pointer;
  color: #b89f90;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-password:hover { color: #FF6B1A; }
.toggle-password svg { width: 18px; height: 18px; }

/* Error */
.error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff2ee;
  border: 1px solid #ffd5c2;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #c94000;
}
.error-alert svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #FF6B1A 0%, #e85500 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(255, 107, 26, 0.35);
  margin-top: 4px;
  letter-spacing: 0.2px;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(255, 107, 26, 0.45);
}
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-content { display: flex; align-items: center; gap: 8px; }
.btn-arrow { width: 18px; height: 18px; transition: transform 0.2s; }
.submit-btn:hover .btn-arrow { transform: translateX(4px); }

.activation-link {
  margin-top: 16px;
  text-align: center;
  font-size: 13.5px;
  color: #b89f90;
}

.activation-link a {
  color: #FF6B1A;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.activation-link a:hover {
  text-decoration: underline;
  color: #e85500;
}

.loading-state { display: flex; align-items: center; gap: 8px; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Demo credentials */
.demo-credentials { margin-top: 28px; }
.demo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.demo-line {
  flex: 1;
  height: 1px;
  background: #ede5de;
}
.demo-label {
  font-size: 11px;
  color: #b89f90;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  font-weight: 500;
}
.demo-accounts { display: flex; gap: 10px; }
.demo-chip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 14px;
  background: #faf8f6;
  border: 1.5px solid #ede5de;
  border-radius: 8px;
  font-size: 12.5px;
  color: #5a3d28;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}
.demo-chip svg { width: 14px; height: 14px; color: #b89f90; flex-shrink: 0; }
.demo-chip:hover {
  border-color: #FF6B1A;
  background: #fff5ef;
  color: #FF6B1A;
}
.demo-chip:hover svg { color: #FF6B1A; }

/* Responsive */
@media (max-width: 900px) {
  .left-panel { display: none; }
  .right-panel { width: 100%; padding: 40px 24px; }
}
</style>