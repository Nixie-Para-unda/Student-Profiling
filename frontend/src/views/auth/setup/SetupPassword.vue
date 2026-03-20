<template>
  <div class="setup-page">
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="setup-container">
      <div class="form-card">
        <div class="form-header">
          <h2>Set Your Password</h2>
          <p>Please enter your new password to complete your account setup.</p>
        </div>

        <form @submit.prevent="handleSetup" class="setup-form">
          <div class="field-group">
            <label>Email Address</label>
            <div class="input-wrapper disabled">
              <input :value="email" type="email" readonly />
            </div>
          </div>

          <div class="field-group">
            <label for="password">New Password</label>
            <div class="input-wrapper" :class="{ focused: passwordFocused, filled: password }">
              <input
                v-model="password"
                id="password"
                type="password"
                required
                placeholder="At least 8 characters"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
            </div>
          </div>

          <div class="field-group">
            <label for="password_confirmation">Confirm Password</label>
            <div class="input-wrapper" :class="{ focused: confirmFocused, filled: passwordConfirmation }">
              <input
                v-model="passwordConfirmation"
                id="password_confirmation"
                type="password"
                required
                placeholder="Repeat your password"
                @focus="confirmFocused = true"
                @blur="confirmFocused = false"
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <div v-if="success" class="success-message">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ success }}</span>
          </div>

          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading">Processing...</span>
            <span v-else>Set Password</span>
          </button>
        </form>

        <div v-if="success" class="form-footer">
          <router-link to="/student/login">Go to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const passwordFocused = ref(false)
const confirmFocused = ref(false)

onMounted(() => {
  email.value = route.query.email
  token.value = route.query.token

  if (!email.value || !token.value) {
    error.value = 'Invalid setup link. Please check your email.'
  }
})

const handleSetup = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post('/setup-password', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    success.value = response.data.message
    setTimeout(() => {
      router.push('/student/login')
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to set password. Link might be expired.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.setup-page {
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

.circle-1 { width: 400px; height: 400px; background: #4F46E5; top: -100px; right: -100px; }
.circle-2 { width: 300px; height: 300px; background: #818CF8; bottom: -50px; left: -50px; }
.circle-3 { width: 250px; height: 250px; background: #C7D2FE; top: 40%; left: 15%; }

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

.setup-container {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  padding: 40px;
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-header p { color: #64748b; }

.setup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.input-wrapper.disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.input-wrapper.focused {
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
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

.submit-button {
  padding: 14px;
  background: #4F46E5;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) { background: #4338CA; }
.submit-button:disabled { opacity: 0.7; cursor: not-allowed; }

.error-message, .success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
}

.error-message { background: #fef2f2; color: #dc2626; }
.success-message { background: #f0fdf4; color: #16a34a; }

.form-footer {
  margin-top: 24px;
  text-align: center;
}

.form-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 600;
}
</style>