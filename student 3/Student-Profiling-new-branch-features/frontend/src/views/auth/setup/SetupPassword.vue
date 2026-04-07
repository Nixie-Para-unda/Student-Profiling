<template>
  <div class="setup-page">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="card">
      <div class="header-section">
        <div class="logos-row">
          <div class="logo-wrap pnc">
            <img src="../../../assets/pnc-logo.png" alt="University Logo" />
          </div>
          <div class="logo-wrap ccs">
            <img src="../../../assets/ccs-logo.jpg" alt="CCS Logo" />
          </div>
        </div>
        <div class="brand-text">
          <span class="brand-name">CCS Student Portal</span>
          <span class="brand-sub">University of Cabuyao</span>
        </div>
      </div>

      <div class="divider-line"></div>

      <div v-if="error && !isSuccess" class="global-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ error }}
      </div>

      <div v-if="isSuccess" class="success-section">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2>Password Set!</h2>
        <p>{{ success || 'Your password has been created successfully.' }}</p>
        <div class="redirect-note">Redirecting to login in {{ countdown }} seconds...</div>
        <button class="login-btn" @click="router.push('/students/login')">
          Go to Login Now
        </button>
      </div>

      <template v-else>
        <div class="icon-container">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f06a00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1>Set Password</h1>
        <p class="subtitle">Create a strong password</p>

        <div class="email-chip">
          <span class="dot"></span>
          {{ email || 'loading...' }}
        </div>

        <div class="fields">
          <div class="field">
            <label>Password</label>
            <div class="input-row">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter new password"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword" tabindex="-1">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div class="strength-bar" v-if="password">
              <div
                v-for="i in 4" :key="i"
                class="strength-segment"
                :class="{ active: passwordStrength >= i, [`level-${passwordStrength}`]: passwordStrength >= i }"
              ></div>
              <span class="strength-label">{{ strengthLabel }}</span>
            </div>
          </div>

          <div class="field">
            <label>Confirm Password</label>
            <div class="input-row">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </span>
              <input
                v-model="passwordConfirmation"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Repeat your password"
              />
              <button type="button" class="eye-btn" @click="showConfirm = !showConfirm" tabindex="-1">
                <svg v-if="!showConfirm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div v-if="passwordsMatch" class="match-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Passwords match!
            </div>
            <div v-else-if="error" class="match-success match-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              {{ error }}
            </div>
          </div>
        </div>

        <button class="submit-btn" :class="{ loading }" :disabled="loading" @click="handleSetup">
          <span v-if="!loading">Set Password</span>
          <span v-else class="spinner"></span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const email = ref('')
const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const countdown = ref(3)

const passwordsMatch = computed(() => {
  return passwordConfirmation.value && password.value && password.value === passwordConfirmation.value
})

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => {
  return ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value]
})

onMounted(() => {
  email.value = route.query.email
  token.value = route.query.token
  if (!email.value || !token.value) {
    error.value = 'Invalid setup link. Please check your email.'
  }
})

const isSuccess = ref(false)

const handleSetup = async () => {
  if (!password.value || !passwordConfirmation.value) {
    error.value = 'Please fill in both fields.'
    return
  }
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  error.value = ''
  isSuccess.value = false
  try {
    const response = await axios.post('/setup-password', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    success.value = response.data.message || 'Account setup successful'
    isSuccess.value = true
    countdown.value = 3
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        router.push('/students/login')
      }
    }, 1000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to set password. Link might be expired.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.setup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding: 24px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.orb-1 { width: 500px; height: 500px; background: rgba(240,106,0,0.08); top: -150px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: rgba(240,106,0,0.05); bottom: -120px; left: -80px; }
.orb-3 { width: 300px; height: 300px; background: rgba(240,106,0,0.04); top: 50%; left: 50%; transform: translate(-50%,-50%); }

.card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 28px;
  padding: 44px 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  position: relative;
  z-index: 1;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.logos-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.logo-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: white;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrap.pnc { background: white; }
.logo-wrap.ccs { background: white; }

.logo-wrap img { width: 100%; height: 100%; object-fit: contain; }

.brand-text { display: flex; flex-direction: column; align-items: center; gap: 2px; }

.brand-name { font-size: 16px; font-weight: 700; color: #f06a00; letter-spacing: 0.02em; }
.brand-sub { font-size: 11px; color: #059669; letter-spacing: 0.03em; font-weight: 500; }

.divider-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #f06a00, #ff8c2a);
  border-radius: 2px;
  margin: 0 auto 20px;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  font-weight: 400;
  color: #111827;
  letter-spacing: 0.02em;
  margin-bottom: 6px;
  text-align: center;
}

.subtitle { color: #9ca3af; font-size: 0.9rem; font-weight: 400; margin-bottom: 20px; text-align: center; }

.email-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(240,106,0,0.1);
  border: 1px solid rgba(240,106,0,0.2);
  border-radius: 100px;
  padding: 5px 14px 5px 10px;
  font-size: 0.8rem;
  color: #f06a00;
  margin-bottom: 28px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.dot { width: 7px; height: 7px; border-radius: 50%; background: #f06a00; box-shadow: 0 0 6px rgba(240,106,0,0.5); }

.global-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }

.field { display: flex; flex-direction: column; gap: 8px; }

.field label { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #374151; }

.input-row {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  transition: all 0.25s;
}

.input-icon {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
}

.input-row:focus-within { border-color: #f06a00; box-shadow: 0 0 0 4px rgba(240,106,0,0.1); }
.input-row:focus-within .input-icon { color: #f06a00; }

.input-row input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 16px 14px 0;
  font-size: 0.95rem;
  color: #111827;
  font-family: 'Inter', sans-serif;
}

.input-row input::placeholder { color: #9ca3af; }

.eye-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 12px;
  color: #9ca3af;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}
.eye-btn:hover { color: #6b7280; }

.match-success {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  margin-top: 6px;
}

.match-error {
  color: #ef4444;
}

.strength-bar { display: flex; align-items: center; gap: 5px; padding: 2px 0; }
.strength-segment { flex: 1; height: 3px; border-radius: 100px; background: #e5e7eb; transition: all 0.3s ease; }
.strength-segment.active.level-1 { background: #ef4444; }
.strength-segment.active.level-2 { background: #f97316; }
.strength-segment.active.level-3 { background: #eab308; }
.strength-segment.active.level-4 { background: #10b981; }
.strength-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.05em; width: 42px; text-align: right; color: #6b7280; }

.submit-btn {
  width: 100%;
  padding: 15px;
  margin-top: 4px;
  background: linear-gradient(135deg, #f06a00, #ff8c2a);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(240,106,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%);
}

.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(240,106,0,0.45); }
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.login-link { margin-top: 20px; text-align: center; }
.login-link a { font-size: 0.875rem; color: #f06a00; text-decoration: none; font-weight: 600; transition: color 0.2s; }
.login-link a:hover { color: #ff8c2a; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes successPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.success-section h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.75rem;
  color: #111827;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.success-section p {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.redirect-note {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 20px;
}

.login-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #f06a00, #ff8c2a);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(240,106,0,0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240,106,0,0.4);
}
</style>
