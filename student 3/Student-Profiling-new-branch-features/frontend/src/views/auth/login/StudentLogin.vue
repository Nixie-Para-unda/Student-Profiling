
<template>
  <div class="login-page">
    <div class="shell">

      <!-- LEFT PANEL -->
      <div class="left">

        <!-- Floating icons -->
        <div class="floating-icons">
          <span class="ico ico-1"></span>
          <span class="ico ico-2"></span>
          <span class="ico ico-3"></span>
          <span class="ico ico-4"></span>
          <span class="ico ico-5"></span>
        </div>

        <div class="brand">
          <div class="brand-logos">
            <div class="brand-logo pnc">
              <img src="../../../assets/pnc-logo.png" alt="University Logo" />
            </div>
            <div class="brand-logo ccs">
              <img src="../../../assets/ccs-logo.jpg" alt="CCS Logo" />
            </div>
          </div>
          <div>
            <div class="brand-name">CCS Student Portal</div>
            <div class="brand-sub">University of Cabuyao</div>
          </div>
        </div>

        <div class="hero">
          <h1 class="hero-title">
            <span>Student</span>
            <span class="accent">Self-Service</span>
            <span>Portal</span>
          </h1>
          <p class="hero-desc">
            Access your academic records, schedules,
            and departmental updates.
          </p>
        </div>

        <p class="left-foot">© 2026 University of Cabuyao — College of Computing Studies</p>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right">
        <div class="form-wrap">
          <div class="form-accent-bar" :class="{ loading: loading }"></div>
          <h2 class="form-title">Students <span>Login</span></h2>
          <p class="form-sub">Sign in to access your academic portal</p>

          <form @submit.prevent="handleLogin" class="login-form">

            <div class="field">
              <div class="field-label-row">
                <label class="field-label">Student Number</label>
              </div>
              <div class="inp-wrap" :class="{ focused: idFocused }">
                <span class="inp-ico">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  v-model="studentId"
                  type="text"
                  placeholder="e.g. 2026xxxx"
                  autocomplete="username"
                  required
                  @focus="idFocused = true"
                  @blur="idFocused = false"
                />
              </div>
            </div>

            <div class="field">
              <div class="field-label-row">
                <label class="field-label">Password</label>
              </div>
              <div class="inp-wrap" :class="{ focused: passwordFocused }">
                <span class="inp-ico">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div class="field-footer">
                <a href="#" class="forgot">Forgot password?</a>
              </div>
            </div>

            <transition name="error-fade">
              <div v-if="error" class="error-message">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ error }}</span>
              </div>
            </transition>

            <button class="btn-submit" type="submit" :disabled="loading">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign In &nbsp;<span class="b-arrow">→</span></span>
            </button>

          </form>

          <div class="divider">
            <div class="divider-line"></div>
            <span class="divider-text">Secured Access</span>
            <div class="divider-line"></div>
          </div>

          <div class="secure-row">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p>Protected by end-to-end encryption. For CCS students only.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../store/auth';
import { useAuthRedirect } from '../../../composables/useAuthRedirect';

const router = useRouter()
const authStore = useAuthStore()
const { redirect } = useAuthRedirect()

const studentId = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const idFocused = ref(false)
const passwordFocused = ref(false)

const handleLogin = async () => {
  if (studentId.value.includes('@')) {
    error.value = 'Invalid credentials'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.login(studentId.value, password.value, 'student')
    redirect();
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

.login-page {
  --brown: #2d1200; /* Lightened from #180700 */
  --orange: #f06a00;
  --orange-d: #c85800;
  --r: 10px;

  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  background: var(--brown);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-page * {
  box-sizing: border-box;
}

/* ── SHELL ── */
.shell {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 480px;
}

/* ══ LEFT ══ */
.left {
  background: var(--brown);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start; /* Ensure all children start from the left padding line */
  padding: 40px 48px 40px 60px; /* Reduced left padding to 60px */
  overflow: hidden;
  perspective: 900px;
  text-align: left; /* Explicitly left align all text */
}

/* ── FLOATING ICONS ── */
.floating-icons {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.ico {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  animation: float-up 10s infinite ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ico::before {
  content: '+';
  font-size: 20px;
  color: rgba(255, 255, 255, 0.2);
  font-weight: 300;
}

.ico-1 { top: 15%; left: 10%; animation-delay: -2s; animation-duration: 12s; }
.ico-2 { top: 30%; left: 80%; animation-delay: -5s; animation-duration: 15s; }
.ico-3 { top: 70%; left: 20%; animation-delay: -8s; animation-duration: 10s; }
.ico-4 { top: 85%; left: 60%; animation-delay: -3s; animation-duration: 18s; }
.ico-5 { top: 50%; left: 50%; animation-delay: -10s; animation-duration: 14s; }

@keyframes float-up {
  0% { transform: translateY(0); opacity: 0; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  100% { transform: translateY(-200px); opacity: 0; }
}

/* crosshatch grid */
.left::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none;
}

/* brand */
.brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logos {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
  padding: 4px;
}

.brand-logo.pnc {
  background: white;
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.brand-sub {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.02em;
}

/* hero - removed 3D rotation for better lining */
.hero {
  position: relative;
  z-index: 1;
}

/* 3D title - removed translateZ for equal lining */
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(62px, 7vw, 96px);
  line-height: 0.92;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: 0.01em;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5), 4px 4px 0px rgba(0, 0, 0, 0.3),
    6px 6px 0px rgba(0, 0, 0, 0.2), 8px 8px 12px rgba(0, 0, 0, 0.25);
}

.hero-title .accent {
  color: var(--orange);
  display: block;
  text-shadow: 2px 2px 0px rgba(150, 50, 0, 0.6), 4px 4px 0px rgba(120, 40, 0, 0.4),
    6px 6px 0px rgba(100, 30, 0, 0.25), 8px 8px 14px rgba(0, 0, 0, 0.3);
}

.hero-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;
  max-width: 340px;
}

/* footer */
.left-foot {
  position: relative;
  z-index: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.2);
}

/* ══ RIGHT ══ */
.right {
  background: #f8f7f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 52px;
  position: relative;
  overflow: hidden;
}

/* subtle warm texture on right */
.right::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240, 106, 0, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(240, 106, 0, 0.04) 0%, transparent 50%);
  pointer-events: none;
}

.form-wrap {
  width: 100%;
  max-width: 370px;
  position: relative;
  z-index: 1;
}

/* top orange accent bar */
.form-accent-bar {
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, var(--orange), var(--orange-d));
  border-radius: 2px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
}

.form-accent-bar.loading {
  width: 100%;
}

.form-accent-bar.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: loading-scan 1.2s infinite ease-in-out;
}

@keyframes loading-scan {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.form-title span {
  color: var(--orange);
}

.form-sub {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 40px;
  line-height: 1.55;
  font-weight: 400;
}

/* fields */
.field {
  margin-bottom: 20px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 9px;
}

.field-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.field-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.forgot {
  font-size: 12px;
  font-weight: 500;
  color: var(--orange);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot:hover {
  color: var(--orange-d);
}

/* input wrapper with floating label feel */
.inp-wrap {
  position: relative;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: stretch; /* Stretch children to fill height */
  height: 52px; /* Fixed height for perfect consistency */
  overflow: hidden;
}

.inp-wrap.focused {
  border-color: var(--orange);
  box-shadow: 0 0 0 4px rgba(240, 106, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04);
}

.inp-ico {
  width: 46px; /* Sufficient width for centering */
  color: #d1d5db;
  pointer-events: none;
  transition: color 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.inp-wrap.focused .inp-ico {
  color: var(--orange);
}

.inp-wrap input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 16px 0 0; /* Only right padding, icon handles left spacing */
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  height: 100%;
  display: block;
}

/* Hide browser's native password reveal button */
.inp-wrap input::-ms-reveal,
.inp-wrap input::-ms-clear {
  display: none;
}

/* Fix for Chrome Autofill background color issues */
.inp-wrap input:-webkit-autofill,
.inp-wrap input:-webkit-autofill:hover,
.inp-wrap input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

.inp-wrap input::placeholder {
  color: #c4c9d1;
  font-weight: 400;
}

.eye-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #c4c9d1;
  width: 46px; /* Same width as left icon for balance */
  padding: 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;
}

.eye-btn:hover {
  color: #6b7280;
}

/* submit button */
.btn-submit {
  width: 100%;
  padding: 15px 24px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, var(--orange) 0%, #ff8c2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 15px rgba(240, 106, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240, 106, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.1);
}

.btn-submit:active {
  transform: translateY(0);
}

.b-arrow {
  transition: transform 0.2s;
  font-size: 17px;
}

.btn-submit:hover .b-arrow {
  transform: translateX(5px);
}

/* divider */
.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 28px 0 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e9eaec;
}

.divider-text {
  font-size: 11px;
  color: #c4c9d1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* bottom secure row */
.secure-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
}

.secure-row svg {
  color: #d1d5db;
  flex-shrink: 0;
}

.secure-row p {
  font-size: 11.5px;
  color: #b0b5be;
  line-height: 1.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff5f5; /* Softer red background */
  color: #c53030; /* Darker red text for contrast */
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #fed7d7; /* Subtle red border */
  text-align: left;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .shell {
    grid-template-columns: 1fr;
  }
  .left {
    display: none;
  }
}
</style>
