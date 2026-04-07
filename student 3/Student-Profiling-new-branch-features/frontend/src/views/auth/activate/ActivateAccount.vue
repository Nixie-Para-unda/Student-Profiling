<template>
  <div class="activate-page">
    <!-- Background decorative elements (same as Login) -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="activate-container">
      <!-- Left panel (matching Login style) -->
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
          <h1 class="hero-text">Account<br/><span class="accent">Activation</span></h1>
          <p class="hero-sub">Enter your student details to activate your portal account and set your password.</p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Access your academic profile</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>View performance & violations</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Update your skill set</span>
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
            <h2>Activate Account</h2>
            <p>Verification required for new student accounts</p>
          </div>

          <form @submit.prevent="handleActivation" class="activate-form">
            <!-- Student Number -->
            <div class="field-group">
              <label for="student-number">Student Number</label>
              <div class="input-wrapper" :class="{ focused: idFocused, filled: studentNumber }">
                <svg class="input-icon" viewBox="0 0 20 20" fill="none">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input
                  v-model="studentNumber"
                  id="student-number"
                  type="text"
                  required
                  placeholder="202X-XXXX"
                  @focus="idFocused = true"
                  @blur="idFocused = false"
                />
              </div>
            </div>

            <!-- Email Address -->
            <div class="field-group">
              <label for="email-address">Institutional Email</label>
              <div class="input-wrapper" :class="{ focused: emailFocused, filled: email }">
                <svg class="input-icon" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.5l7.5 5 7.5-5M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                  v-model="email"
                  id="email-address"
                  type="email"
                  required
                  placeholder="you@department.edu"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
              </div>
            </div>

            <!-- New Password -->
            <div class="field-group">
              <label for="password">Set Password</label>
              <div class="input-wrapper" :class="{ focused: passwordFocused, filled: password }">
                <svg class="input-icon" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input
                  v-model="password"
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Create a strong password"
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

            <div v-if="success" class="success-alert">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Account activated! Redirecting to login...
            </div>

            <button type="submit" class="submit-btn" :class="{ loading: loading }" :disabled="loading || success">
              <span class="btn-content">
                <span v-if="!loading">Activate Account</span>
                <span v-else class="loading-state">
                  <span class="spinner"></span>
                  Verifying...
                </span>
              </span>
              <svg v-if="!loading" class="btn-arrow" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="form-footer">
              <router-link to="/students/login" class="back-link">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M15 10H5M5 10l5-5m-5 5l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Back to Sign In
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const studentNumber = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const idFocused = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)

const router = useRouter()

const handleActivation = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await axios.post('/activate', {
      student_number: studentNumber.value,
      email: email.value,
      password: password.value,
    })
    
    success.value = true
    setTimeout(() => {
      router.push('/students/login')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Activation failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
/* Reuse the Login.vue styling logic but adapted for activation */
.activate-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f3f0;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;
  position: relative;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  width: 400px; height: 400px;
  background: rgba(255, 107, 26, 0.1);
  top: -100px; left: -100px;
}

.circle-2 {
  width: 500px; height: 500px;
  background: rgba(255, 107, 26, 0.05);
  bottom: -150px; right: -100px;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(26, 10, 0, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}

.activate-container {
  width: 100%;
  max-width: 1000px;
  height: 640px;
  display: flex;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(26, 10, 0, 0.08);
  overflow: hidden;
  z-index: 1;
  margin: 20px;
}

.left-panel {
  flex: 1;
  background: #1a0a00;
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}

.logo-icon svg { width: 36px; height: 36px; }

.brand-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

.hero-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 16px;
}

.accent { color: #FF6B1A; }

.hero-sub {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 320px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.feature-list { display: flex; flex-direction: column; gap: 16px; }

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.feature-dot {
  width: 6px; height: 6px;
  background: #FF6B1A;
  border-radius: 50%;
  box-shadow: 0 0 10px #FF6B1A;
}

.left-footer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  z-index: 2;
}

.right-panel {
  width: 440px;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card { width: 100%; }

.form-header h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
  margin-bottom: 6px;
}

.form-header p { font-size: 14px; color: #b89f90; margin-bottom: 32px; }

.activate-form { display: flex; flex-direction: column; gap: 20px; }

.field-group { display: flex; flex-direction: column; gap: 8px; }

.field-group label {
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
  display: flex;
  justify-content: space-between;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #faf8f6;
  border: 1.5px solid #f0e8e0;
  border-radius: 12px;
  padding: 0 14px;
  transition: all 0.2s;
}

.input-wrapper.focused {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 107, 26, 0.08);
}

.input-icon { width: 18px; height: 18px; color: #c0b0a5; transition: color 0.2s; }
.input-wrapper.focused .input-icon { color: #FF6B1A; }

.input-wrapper input {
  flex: 1;
  border: none;
  background: none;
  padding: 12px 10px;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  color: #1a0a00;
  outline: none;
}

.input-wrapper input::placeholder { color: #c0b0a5; }

.toggle-password {
  background: none;
  border: none;
  color: #c0b0a5;
  cursor: pointer;
  padding: 4px;
}

.toggle-password:hover { color: #1a0a00; }
.toggle-password svg { width: 18px; height: 18px; }

.submit-btn {
  margin-top: 10px;
  background: #1a0a00;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) { background: #3d1500; transform: translateY(-1px); }
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-arrow { width: 18px; height: 18px; transition: transform 0.2s; }
.submit-btn:hover .btn-arrow { transform: translateX(4px); }

.error-alert, .success-alert {
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-alert { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }
.error-alert svg { width: 16px; height: 16px; }

.success-alert { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.success-alert svg { width: 16px; height: 16px; }

.form-footer {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #9a8070;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover { color: #FF6B1A; }
.back-link svg { width: 16px; height: 16px; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .left-panel { display: none; }
  .activate-container { max-width: 440px; height: auto; }
  .right-panel { width: 100%; }
}
</style>
