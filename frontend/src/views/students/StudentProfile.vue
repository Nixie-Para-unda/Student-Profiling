<template>
  <div class="profile-page">

    <!-- ── LOADING ── -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your profile...</p>
    </div>

    <template v-else>

      <!-- ── HERO BANNER ── -->
      <div class="profile-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="avatar-wrap">
            <div class="avatar">{{ initials }}</div>
            <div class="avatar-badge" :class="statusColor">{{ profile.course_name || 'Student' }}</div>
          </div>
          <div class="hero-info">
            <h1 class="hero-name">{{ fullName }}</h1>
            <p class="hero-sub">{{ profile.student_number }} &nbsp;·&nbsp; {{ profile.section_name || 'No section assigned' }}</p>
            <div class="hero-chips">
              <div class="hero-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
                GWA: <strong>{{ profile.gwa || '—' }}</strong>
              </div>
              <div class="hero-chip" v-if="profile.gender">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
                {{ profile.gender }}
              </div>
              <div class="hero-chip orange" v-if="skills.length">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                {{ skills.length }} Skill{{ skills.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
          <div class="hero-actions">
            <button class="save-btn" @click="saveProfile" :disabled="saving">
              <div v-if="saving" class="spinner-sm"></div>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── STAT ROW ── -->
      <div class="stat-row">
        <div class="sstat">
          <div class="sstat-icon orange"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5"/></svg></div>
          <div><div class="sstat-val">{{ profile.gwa || '—' }}</div><div class="sstat-label">Current GWA</div></div>
        </div>
        <div class="sstat">
          <div class="sstat-icon blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
          <div><div class="sstat-val">{{ profile.course_name || '—' }}</div><div class="sstat-label">Course</div></div>
        </div>
        <div class="sstat">
          <div class="sstat-icon green"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div><div class="sstat-val">{{ profile.section_name || '—' }}</div><div class="sstat-label">Section</div></div>
        </div>
        <div class="sstat">
          <div class="sstat-icon purple"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <div><div class="sstat-val">{{ skills.length }}</div><div class="sstat-label">Skills</div></div>
        </div>
      </div>

      <!-- ── MAIN GRID ── -->
      <div class="main-grid">

        <!-- LEFT COLUMN -->
        <div class="col-left">

          <!-- Personal Information -->
          <div class="card">
            <div class="card-head">
              <div class="card-head-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              </div>
              <div>
                <h3 class="card-title">Personal Information</h3>
                <p class="card-sub">Your basic identity details</p>
              </div>
              <div class="card-badge readonly-badge">Partially locked</div>
            </div>
            <div class="card-body">
              <div class="field-group">
                <label>Student Number</label>
                <div class="readonly-field">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {{ profile.student_number || '—' }}
                </div>
              </div>
              <div class="form-row">
                <div class="field-group">
                  <label>First Name</label>
                  <div class="readonly-field">{{ profile.first_name || '—' }}</div>
                </div>
                <div class="field-group">
                  <label>Last Name</label>
                  <div class="readonly-field">{{ profile.last_name || '—' }}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="field-group">
                  <label>Middle Name</label>
                  <input v-model="profile.middle_name" type="text" placeholder="Optional" />
                </div>
                <div class="field-group">
                  <label>Gender</label>
                  <select v-model="profile.gender">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="field-group">
                  <label>Birthdate</label>
                  <input v-model="profile.birthdate" type="date" />
                </div>
                <div class="field-group">
                  <label>Civil Status</label>
                  <select v-model="profile.civil_status">
                    <option value="">Select Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Separated</option>
                    <option>Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Details -->
          <div class="card">
            <div class="card-head">
              <div class="card-head-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <h3 class="card-title">Contact Details</h3>
                <p class="card-sub">How we can reach you</p>
              </div>
            </div>
            <div class="card-body">
              <div class="field-group">
                <label>Institutional Email</label>
                <div class="readonly-field">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {{ profile.email || '—' }}
                </div>
              </div>
              <div class="field-group">
                <label>Mobile Number</label>
                <div class="input-with-prefix">
                  <span class="input-prefix">+63</span>
                  <input v-model="profile.contact_number" type="tel" placeholder="9XX XXX XXXX" />
                </div>
              </div>
              <div class="field-group">
                <label>Permanent Address</label>
                <textarea v-model="profile.address" rows="3" placeholder="Enter your full address..."></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-right">

          <!-- Academic Summary -->
          <div class="card card-dark">
            <div class="card-head">
              <div class="card-head-icon dark">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <h3 class="card-title">Academic Summary</h3>
                <p class="card-sub" style="color:rgba(255,255,255,.4)">Read-only academic record</p>
              </div>
            </div>
            <div class="card-body">
              <div class="gwa-display">
                <div class="gwa-circle">
                  <div class="gwa-num">{{ profile.gwa || '—' }}</div>
                  <div class="gwa-lbl">GWA</div>
                </div>
                <div class="gwa-meta">
                  <div class="gwa-standing" :class="standingClass">{{ standing }}</div>
                  <div class="gwa-desc">{{ standingDesc }}</div>
                </div>
              </div>
              <div class="dark-list">
                <div class="dark-row"><span>Student ID</span><span>{{ profile.student_number || '—' }}</span></div>
                <div class="dark-row"><span>Course</span><span>{{ profile.course_name || '—' }}</span></div>
                <div class="dark-row"><span>Section</span><span>{{ profile.section_name || 'Unassigned' }}</span></div>
              </div>
            </div>
          </div>

          <!-- Technical Skills -->
          <div class="card">
            <div class="card-head">
              <div class="card-head-icon orange">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div>
                <h3 class="card-title">Technical Skills</h3>
                <p class="card-sub">{{ skills.length }} skill{{ skills.length !== 1 ? 's' : '' }} added</p>
              </div>
            </div>
            <div class="card-body">
              <div class="skill-input-row">
                <input v-model="newSkill" @keyup.enter="addSkill" type="text" placeholder="Type a skill and press Enter..." class="skill-input" />
                <button @click="addSkill" class="skill-add-btn" :disabled="!newSkill.trim()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
              <div class="suggested-wrap" v-if="suggestedSkills.length">
                <p class="suggested-label">Quick add</p>
                <div class="suggested-chips">
                  <button v-for="s in suggestedSkills" :key="s" class="suggested-chip" @click="addSuggestedSkill(s)">+ {{ s }}</button>
                </div>
              </div>
              <div class="skills-list" v-if="skills.length">
                <div class="skill-item" v-for="(skill, idx) in skills" :key="skill" :style="{ animationDelay: `${idx * 0.04}s` }">
                  <div class="skill-dot"></div>
                  <span>{{ skill }}</span>
                  <button class="skill-remove" @click="removeSkill(skill)">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              <div class="skills-empty" v-else>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <p>No skills yet. Start typing above.</p>
              </div>
            </div>
          </div>

          <!-- Profile Completion -->
          <div class="card completion-card">
            <div class="completion-top">
              <span class="completion-title">Profile Completion</span>
              <span class="completion-pct">{{ completionPct }}%</span>
            </div>
            <div class="completion-track"><div class="completion-fill" :style="{ width: completionPct + '%' }"></div></div>
            <div class="completion-items">
              <div class="ci" v-for="item in completionItems" :key="item.label" :class="{ done: item.done }">
                <div class="ci-dot"></div>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </template>

    <!-- ── TOAST ── -->
    <Teleport to="body">
      <div class="toast" :class="[toast.type, { show: toast.visible }]">
        <svg v-if="toast.type==='success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        {{ toast.message }}
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'

const loading  = ref(true)
const saving   = ref(false)
const newSkill = ref('')
const skills   = ref([])

const profile = ref({
  first_name:'', last_name:'', middle_name:'', student_number:'',
  email:'', gender:'', birthdate:'', civil_status:'',
  contact_number:'', address:'', course_name:'', section_name:'', gwa:''
})

const toast = reactive({ visible:false, message:'', type:'' })

// ── Computed ──────────────────────────────────────────────
const fullName = computed(() =>
  [profile.value.first_name, profile.value.middle_name, profile.value.last_name].filter(Boolean).join(' ') || 'Student'
)
const initials = computed(() =>
  fullName.value.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase()
)
const statusColor = computed(() => {
  const c = profile.value.course_name
  if (c?.includes('CS')) return 'badge-blue'
  if (c?.includes('IT')) return 'badge-green'
  return 'badge-orange'
})
const standing = computed(() => {
  const g = parseFloat(profile.value.gwa)
  if (!g) return '—'
  if (g <= 1.25) return 'Summa Cum Laude'
  if (g <= 1.5)  return 'Magna Cum Laude'
  if (g <= 1.75) return 'Cum Laude'
  if (g <= 2.5)  return 'Good Standing'
  return 'Needs Improvement'
})
const standingClass = computed(() => {
  const g = parseFloat(profile.value.gwa)
  if (!g) return ''
  if (g <= 1.75) return 'standing-honor'
  if (g <= 2.5)  return 'standing-good'
  return 'standing-warn'
})
const standingDesc = computed(() => {
  const g = parseFloat(profile.value.gwa)
  if (!g) return 'No GWA recorded yet'
  if (g <= 1.75) return 'Honor student — keep it up!'
  if (g <= 2.5)  return 'Performing well'
  return 'Consider seeking academic support'
})
const SUGGESTED = ['Python','Java','Vue.js','React','SQL','Laravel','Node.js','Figma','C++','Git','TypeScript','Flutter']
const suggestedSkills = computed(() => SUGGESTED.filter(s => !skills.value.includes(s)).slice(0,6))
const completionItems = computed(() => [
  { label: 'Middle name',      done: !!profile.value.middle_name },
  { label: 'Gender',           done: !!profile.value.gender },
  { label: 'Birthdate',        done: !!profile.value.birthdate },
  { label: 'Civil status',     done: !!profile.value.civil_status },
  { label: 'Mobile number',    done: !!profile.value.contact_number },
  { label: 'Address',          done: !!profile.value.address },
  { label: 'At least 1 skill', done: skills.value.length > 0 },
])
const completionPct = computed(() => Math.round(completionItems.value.filter(i => i.done).length / completionItems.value.length * 100))

// ── API ────────────────────────────────────────────────────
const fetchProfile = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/student/profile')
    profile.value = {
      ...data,
      course_name:  data.section?.course?.course_code || data.course_name || '—',
      section_name: data.section?.section_name || data.section_name || '—',
    }
    skills.value = Array.isArray(data.skills) ? data.skills : []
  } catch (err) {
    console.error(err)
    showToast('Failed to load profile.', 'warn')
  } finally {
    loading.value = false
  }
}
const saveProfile = async () => {
  saving.value = true
  try {
    await axios.post('/student/profile', { ...profile.value, skills: skills.value })
    showToast('Profile saved successfully!', 'success')
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to save.', 'warn')
  } finally {
    saving.value = false
  }
}

// ── Skills ─────────────────────────────────────────────────
const addSkill          = () => { const s = newSkill.value.trim(); if (s && !skills.value.includes(s)) { skills.value.push(s); newSkill.value = '' } }
const addSuggestedSkill = (s) => { if (!skills.value.includes(s)) skills.value.push(s) }
const removeSkill       = (s) => { skills.value = skills.value.filter(x => x !== s) }

// ── Toast ──────────────────────────────────────────────────
const showToast = (message, type = '') => {
  toast.message = message; toast.type = type; toast.visible = true
  setTimeout(() => toast.visible = false, 3200)
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page { display: flex; flex-direction: column; gap: 22px; }

/* ── LOADING ── */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 100px 20px; color: #aaa; font-size: 13.5px; }
.spinner    { width: 32px; height: 32px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin .7s linear infinite; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── HERO ── */
.profile-hero {
  position: relative; background: #111;
  border-radius: 18px; overflow: hidden; padding: 30px 28px;
}
.hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 80% 50%, rgba(255,107,26,.18) 0%, transparent 65%),
              radial-gradient(ellipse at 10% 80%, rgba(255,107,26,.07) 0%, transparent 50%);
}
.hero-content { position: relative; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.avatar-wrap  { position: relative; flex-shrink: 0; padding-bottom: 10px; }
.avatar {
  width: 70px; height: 70px; border-radius: 18px;
  background: linear-gradient(135deg, #FF6B1A, #c94000);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: #fff;
  border: 2.5px solid rgba(255,255,255,.12);
}
.avatar-badge {
  position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  font-size: 9.5px; font-weight: 700; padding: 3px 10px;
  border-radius: 20px; white-space: nowrap; letter-spacing: .04em;
}
.badge-blue   { background: #1a6bff; color: #fff; }
.badge-green  { background: #2d7a25; color: #fff; }
.badge-orange { background: #FF6B1A; color: #fff; }
.hero-info { flex: 1; }
.hero-name { font-size: 21px; font-weight: 800; color: #fff; letter-spacing: -.02em; margin-bottom: 4px; }
.hero-sub  { font-size: 12.5px; color: rgba(255,255,255,.4); margin-bottom: 12px; font-family: monospace; }
.hero-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.hero-chip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.08); color: rgba(255,255,255,.65);
  border: 1px solid rgba(255,255,255,.1);
  padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
}
.hero-chip.orange { background: rgba(255,107,26,.2); color: #ffb088; border-color: rgba(255,107,26,.3); }
.hero-chip strong { color: #fff; }
.hero-actions { margin-left: auto; }
.save-btn {
  display: flex; align-items: center; gap: 8px;
  background: #FF6B1A; color: #fff; border: none;
  padding: 12px 22px; border-radius: 12px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: background .2s, transform .15s; white-space: nowrap;
}
.save-btn:hover:not(:disabled) { background: #e8591a; transform: translateY(-1px); }
.save-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

/* ── STAT ROW ── */
.stat-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.sstat {
  background: #fff; border: 1.5px solid #e8e6e1; border-radius: 14px;
  padding: 16px 18px; display: flex; align-items: center; gap: 13px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.sstat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sstat-icon.orange { background: #fff1ea; color: #FF6B1A; }
.sstat-icon.blue   { background: #eff6ff; color: #1a6bff; }
.sstat-icon.green  { background: #eaf5e9; color: #2d7a25; }
.sstat-icon.purple { background: #f5f3ff; color: #7c3aed; }
.sstat-val   { font-size: 18px; font-weight: 800; color: #111; line-height: 1; }
.sstat-label { font-size: 11px; color: #aaa; margin-top: 2px; }

/* ── LAYOUT ── */
.main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
.col-left  { display: flex; flex-direction: column; gap: 20px; }
.col-right { display: flex; flex-direction: column; gap: 20px; }

/* ── CARD ── */
.card {
  background: #fff; border: 1.5px solid #e8e6e1;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.card-dark { background: #111; border-color: #1e1e1e; }

.card-head {
  display: flex; align-items: center; gap: 12px;
  padding: 17px 22px; border-bottom: 1px solid #f0ede9;
}
.card-dark .card-head { border-bottom-color: rgba(255,255,255,.07); }

.card-head-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: #f5f4f2; color: #777;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.card-head-icon.dark   { background: rgba(255,255,255,.08); color: rgba(255,255,255,.55); }
.card-head-icon.orange { background: #fff1ea; color: #FF6B1A; }

.card-title { font-size: 14px; font-weight: 700; color: #111; }
.card-dark .card-title { color: #fff; }
.card-sub { font-size: 11.5px; color: #aaa; margin-top: 1px; }

.card-badge { margin-left: auto; font-size: 10.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.readonly-badge { background: #f5f4f2; color: #bbb; border: 1px solid #e8e6e1; }

.card-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }

/* ── FIELDS ── */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label {
  font-size: 10.5px; font-weight: 700; color: #bbb;
  text-transform: uppercase; letter-spacing: .07em;
}
.field-group input,
.field-group select,
.field-group textarea {
  padding: 11px 14px; border: 1.5px solid #e8e6e1; border-radius: 10px;
  font-size: 13.5px; color: #111; outline: none;
  background: #fafaf8; transition: all .2s; font-family: inherit;
}
.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
  border-color: #FF6B1A; background: #fff;
  box-shadow: 0 0 0 3px rgba(255,107,26,.07);
}
.field-group textarea { resize: vertical; min-height: 84px; }

.readonly-field {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; background: #f5f4f2;
  border: 1.5px solid #e8e6e1; border-radius: 10px;
  font-size: 13.5px; color: #999;
}
.readonly-field svg { color: #d0ccc8; flex-shrink: 0; }

.input-with-prefix {
  display: flex; border: 1.5px solid #e8e6e1; border-radius: 10px;
  overflow: hidden; background: #fafaf8; transition: all .2s;
}
.input-with-prefix:focus-within { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,.07); }
.input-prefix { padding: 11px 12px; background: #f0ede9; font-size: 13px; font-weight: 600; color: #999; border-right: 1.5px solid #e8e6e1; flex-shrink: 0; }
.input-with-prefix input { border: none; background: transparent; padding: 11px 14px; font-size: 13.5px; color: #111; outline: none; flex: 1; }

/* ── GWA DISPLAY ── */
.gwa-display { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,.05); border-radius: 12px; padding: 16px; }
.gwa-circle { width: 68px; height: 68px; border-radius: 50%; border: 2.5px solid rgba(255,107,26,.45); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
.gwa-num { font-size: 20px; font-weight: 800; color: #FF6B1A; line-height: 1; }
.gwa-lbl { font-size: 9px; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
.gwa-meta { flex: 1; }
.gwa-standing { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
.standing-honor { color: #4ade80; }
.standing-good  { color: #60a5fa; }
.standing-warn  { color: #fb923c; }
.gwa-desc { font-size: 12px; color: rgba(255,255,255,.38); line-height: 1.4; }

.dark-list { display: flex; flex-direction: column; }
.dark-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.05); font-size: 13px; }
.dark-row:last-child { border-bottom: none; }
.dark-row span:first-child { color: rgba(255,255,255,.38); }
.dark-row span:last-child  { color: #fff; font-weight: 500; }

/* ── SKILLS ── */
.skill-input-row { display: flex; gap: 8px; }
.skill-input { flex: 1; padding: 10px 14px; border: 1.5px solid #e8e6e1; border-radius: 10px; font-size: 13px; color: #111; outline: none; background: #fafaf8; transition: all .2s; }
.skill-input:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,.07); }
.skill-add-btn { width: 40px; height: 40px; background: #FF6B1A; color: #fff; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s, transform .15s; flex-shrink: 0; }
.skill-add-btn:hover:not(:disabled) { background: #e8591a; transform: scale(1.05); }
.skill-add-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

.suggested-wrap { border-top: 1px solid #f0ede9; padding-top: 12px; }
.suggested-label { font-size: 10px; font-weight: 700; color: #ccc; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 8px; }
.suggested-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.suggested-chip { background: #fafaf8; color: #888; border: 1.5px solid #e8e6e1; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; cursor: pointer; transition: all .15s; }
.suggested-chip:hover { background: #fff1ea; border-color: #ffcfb0; color: #FF6B1A; }

.skills-list { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #f0ede9; padding-top: 14px; }
.skill-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; background: #fafaf8;
  border: 1.5px solid #e8e6e1; border-radius: 9px;
  animation: fadeIn .25s ease both; transition: background .15s;
}
.skill-item:hover { background: #fff3ec; border-color: #ffcfb0; }
.skill-dot   { width: 7px; height: 7px; border-radius: 50%; background: #FF6B1A; flex-shrink: 0; }
.skill-item span { flex: 1; font-size: 13px; font-weight: 500; color: #333; }
.skill-remove { background: none; border: none; color: #d0ccc8; cursor: pointer; padding: 2px; border-radius: 4px; display: flex; align-items: center; transition: color .15s; }
.skill-remove:hover { color: #e24b4a; }
.skills-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 22px 0; color: #ccc; text-align: center; font-size: 12.5px; line-height: 1.6; border-top: 1px solid #f0ede9; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

/* ── COMPLETION ── */
.completion-card { padding: 18px 22px; }
.completion-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.completion-title { font-size: 13px; font-weight: 700; color: #333; }
.completion-pct   { font-size: 15px; font-weight: 800; color: #FF6B1A; }
.completion-track { height: 6px; background: #f0ede9; border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
.completion-fill  { height: 100%; background: linear-gradient(90deg, #FF6B1A, #ffb088); border-radius: 3px; transition: width .6s cubic-bezier(.4,0,.2,1); }
.completion-items { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ci { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #ccc; }
.ci.done { color: #555; }
.ci-dot { width: 8px; height: 8px; border-radius: 50%; background: #e8e6e1; flex-shrink: 0; transition: background .25s; }
.ci.done .ci-dot { background: #FF6B1A; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 24px; right: 24px; background: #111; color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 9999; opacity: 0; transform: translateY(10px); transition: all .3s; pointer-events: none; max-width: 300px; display: flex; align-items: center; gap: 8px; }
.toast.show    { opacity: 1; transform: translateY(0); }
.toast.success { background: #2d7a25; }
.toast.warn    { background: #FF6B1A; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .main-grid { grid-template-columns: 1fr; }
  .stat-row  { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 600px) {
  .stat-row        { grid-template-columns: 1fr 1fr; }
  .form-row        { grid-template-columns: 1fr; }
  .hero-content    { flex-direction: column; align-items: flex-start; }
  .hero-actions    { width: 100%; }
  .save-btn        { width: 100%; justify-content: center; }
  .completion-items { grid-template-columns: 1fr; }
}
</style>