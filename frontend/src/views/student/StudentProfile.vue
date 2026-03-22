<template>
  <div class="profile-page">

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">My Academic Profile</h2>
        <p class="section-desc">Keep your personal and contact information up to date.</p>
      </div>
      <button class="save-btn" @click="saveProfile" :disabled="saving">
        <span v-if="saving" class="spinner-sm"></span>
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Error Summary -->
    <transition name="fade">
      <div v-if="Object.keys(errors).length > 0" class="error-summary">
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>Please fill in all required fields marked in red.</span>
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading your profile...
    </div>

    <div v-else class="profile-grid">

      <!-- LEFT COLUMN -->
      <div class="profile-main">

        <!-- Identity Strip -->
        <div class="identity-card">
          <div class="avatar-circle">{{ initials }}</div>
          <div class="identity-info">
            <div class="identity-name">{{ fullName }}</div>
            <div class="identity-meta">{{ profile.student_number }} · {{ profile.section_name || 'Unassigned' }}</div>
          </div>
          <span class="active-badge">Active</span>
        </div>

        <!-- Tabbed Card -->
        <div class="profile-card">
          <div class="tab-bar">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-item"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Personal Tab -->
          <div v-if="activeTab === 'personal'" class="card-body">
            <div class="tab-header">
              <div class="tab-icon personal">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="tab-header-text">
                <div class="tab-header-title">Personal Information</div>
                <div class="tab-header-subtitle">Basic details about you</div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Student Number</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg>
                  <input :value="profile.student_number" type="text" readonly class="readonly-input" />
                </div>
              </div>
              <div class="form-group">
                <label>First Name</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="profile.first_name" type="text" readonly class="readonly-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="profile.last_name" type="text" readonly class="readonly-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Middle Name</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="profile.middle_name" type="text" placeholder="Optional" :class="{ 'error-input': errors.middle_name }" />
                </div>
              </div>
              <div class="form-group">
                <label>Gender</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 12v2M9 5h6M5 12h14"/></svg>
                  <select v-model="profile.gender" :class="{ 'error-input': errors.gender }">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Birthdate</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  <input v-model="profile.birthdate" type="date" :class="{ 'error-input': errors.birthdate }" />
                </div>
              </div>
              <div class="form-group">
                <label>Civil Status</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  <select v-model="profile.civil_status" :class="{ 'error-input': errors.civil_status }">
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Tab -->
          <div v-if="activeTab === 'contact'" class="card-body">
            <div class="tab-header">
              <div class="tab-icon contact">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tab-header-text">
                <div class="tab-header-title">Contact Details</div>
                <div class="tab-header-subtitle">How we can reach you</div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Institutional Email</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  <input v-model="profile.email" type="email" readonly class="readonly-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Mobile Number</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                  <input v-model="profile.contact_number" type="tel" placeholder="09XX XXX XXXX" :class="{ 'error-input': errors.contact_number }" />
                </div>
              </div>
              <div class="form-group full-width">
                <label>Permanent Address</label>
                <div class="input-icon textarea-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <textarea v-model="profile.address" rows="3" placeholder="Enter your full address" :class="{ 'error-input': errors.address }"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Guardian Tab -->
          <div v-if="activeTab === 'guardian'" class="card-body">
            <div class="tab-header">
              <div class="tab-icon guardian">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tab-header-text">
                <div class="tab-header-title">Guardian Information</div>
                <div class="tab-header-subtitle">Emergency contact person</div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Guardian First Name</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="guardian.first_name" type="text" placeholder="First name" :class="{ 'error-input': errors['guardian.first_name'] }" />
                </div>
              </div>
              <div class="form-group">
                <label>Guardian Last Name</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model="guardian.last_name" type="text" placeholder="Last name" :class="{ 'error-input': errors['guardian.last_name'] }" />
                </div>
              </div>
              <div class="form-group">
                <label>Relationship</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  <select v-model="guardian.relationship" :class="{ 'error-input': errors['guardian.relationship'] }">
                    <option value="">Select</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Contact Number</label>
                <div class="input-icon">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                  <input v-model="guardian.contact_number" type="tel" placeholder="09XX XXX XXXX" :class="{ 'error-input': errors['guardian.contact_number'] }" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Semester Progress Card -->
        <div class="progress-card">
          <div class="tab-header">
            <div class="tab-icon progress">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 6h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="tab-header-text">
              <div class="tab-header-title">Semester Progress</div>
              <div class="tab-header-subtitle">Academic Performance</div>
            </div>
          </div>
          <div class="progress-body">
            <div class="progress-item">
              <div class="progress-labels">
                <span class="progress-label-text">
                  <span class="progress-dot orange"></span>
                  Units Completed
                </span>
                <span class="progress-value">36 / 120</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar orange" style="width: 30%"></div>
              </div>
            </div>
            <div class="progress-item">
              <div class="progress-labels">
                <span class="progress-label-text">
                  <span class="progress-dot purple"></span>
                  Subjects Passed
                </span>
                <span class="progress-value">12 / 15</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar purple" style="width: 80%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDEBAR -->
      <div class="profile-side">

        <!-- Academic Info Dark Card -->
        <div class="acad-card">
          <div class="acad-header">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5"
                stroke="#F5C4B3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="acad-header-label">Academic Info</span>
          </div>
          <div class="acad-rows">
            <div class="acad-row">
              <span class="acad-key">Student ID</span>
              <span class="acad-val">{{ profile.student_number || '—' }}</span>
            </div>
            <div class="acad-row">
              <span class="acad-key">Program</span>
              <span class="acad-val">{{ profile.course_name || '—' }}</span>
            </div>
            <div class="acad-row">
              <span class="acad-key">Year Level & Section</span>
              <span class="acad-val">{{ profile.section_name || 'Unassigned' }}</span>
            </div>
            <div class="gpa-row">
              <span class="gpa-label">Current GWA</span>
              <div class="gpa-display">
                <span class="gpa-num">{{ profile.gwa || '0.00' }}</span>
                <span class="gpa-denom">/ 4.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Skills Card -->
        <div class="skills-card">

          <!-- Header -->
          <div class="skills-header">
            <div class="skills-header-left">
              <div class="skills-icon-wrap">
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                  <path d="M6 5l-4 5 4 5M14 5l4 5-4 5M11.5 3l-3 14"
                    stroke="#FF6B1A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <div class="skills-title">Technical Skills</div>
                <div class="skills-count">{{ skills.length }} skill{{ skills.length !== 1 ? 's' : '' }} added</div>
              </div>
            </div>
          </div>

          <!-- Input Row -->
          <div class="skills-input-section">
            <div class="skills-input-wrap" :class="{ focused: inputFocused }">
              <svg viewBox="0 0 20 20" fill="none" width="14" height="14" class="skills-input-icon">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 6v8M6 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input
                v-model="newSkill"
                @keyup.enter="addSkill"
                @focus="inputFocused = true"
                @blur="inputFocused = false"
                type="text"
                placeholder="e.g. React, Python, Figma…"
                class="skills-input"
              />
              <button @click="addSkill" class="skills-add-btn" :disabled="!newSkill.trim()">
                Add
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="skills-divider"></div>

          <!-- Empty State -->
          <div v-if="skills.length === 0" class="skills-empty">
            <div class="skills-empty-icon">
              <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                <circle cx="20" cy="20" r="18" stroke="#f0e8e0" stroke-width="2"/>
                <path d="M13 20h14M20 13v14" stroke="#e0cfc4" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="skills-empty-text">No skills yet</p>
            <p class="skills-empty-sub">Add your first technical skill above</p>
          </div>

          <!-- Skills Grid -->
          <div v-else class="skills-list">
            <div
              v-for="(skill, index) in skills"
              :key="skill.id"
              class="skill-item"
              :style="{ animationDelay: index * 0.04 + 's' }"
            >
              <div class="skill-item-left">
                <span class="skill-dot"></span>
                <span class="skill-name">{{ skill.skillName }}</span>
              </div>
              <button @click="removeSkill(skill.id)" class="skill-remove-btn" title="Remove skill">
                <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const saving = ref(false)
const errors = ref({})
const newSkill = ref('')
const skills = ref([])
const activeTab = ref('personal')
const inputFocused = ref(false)

const tabs = [
  { key: 'personal', label: 'Personal' },
  { key: 'contact',  label: 'Contact'  },
  { key: 'guardian', label: 'Guardian' },
]

const profile = ref({
  student_number: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  gender: '',
  birthdate: '',
  civil_status: '',
  email: '',
  contact_number: '',
  address: '',
  course_name: '',
  section_name: '',
  year_level: '',
  gwa: '0.00'
})

const guardian = ref({
  first_name: '',
  last_name: '',
  contact_number: '',
  relationship: ''
})

const initials = computed(() => {
  const f = profile.value.first_name?.[0] || ''
  const l = profile.value.last_name?.[0] || ''
  return (f + l).toUpperCase() || 'ST'
})

const fullName = computed(() => {
  const parts = [profile.value.first_name, profile.value.middle_name, profile.value.last_name]
  return parts.filter(Boolean).join(' ') || 'Student'
})

const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await axios.get('/student/profile')
    const data = response.data
    
    if (data) {
      // Direct assignment for better reactivity
      profile.value.first_name = data.first_name || ''
      profile.value.last_name = data.last_name || ''
      profile.value.middle_name = data.middle_name || ''
      profile.value.gender = data.gender || ''
      profile.value.birthdate = data.birthdate || ''
      profile.value.civil_status = data.civil_status || ''
      profile.value.contact_number = data.contact_number || ''
      profile.value.address = data.address || ''
      
      // Academic & Identity Info (from User relationship)
      profile.value.student_number = data.user?.student_number || data.student_number || '—'
      profile.value.email = data.user?.email || data.email || '—'
      profile.value.course_name = data.program?.program_name || data.program?.name || '—'
      profile.value.section_name = data.section?.section_name || data.section?.name || 'Unassigned'
      profile.value.year_level = data.year_level || '—'
      profile.value.gwa = data.gwa || '0.00'
      
      if (data.guardian) {
        guardian.value.first_name = data.guardian.first_name || ''
        guardian.value.last_name = data.guardian.last_name || ''
        guardian.value.contact_number = data.guardian.contact_number || ''
        guardian.value.relationship = data.guardian.relationship || ''
      }
      skills.value = data.skills || []
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  // Reset errors
  errors.value = {}
  
  // Validation
  if (!profile.value.gender) errors.value.gender = true
  if (!profile.value.birthdate) errors.value.birthdate = true
  if (!profile.value.civil_status) errors.value.civil_status = true
  if (!profile.value.contact_number) errors.value.contact_number = true
  if (!profile.value.address) errors.value.address = true
  
  if (!guardian.value.first_name) errors.value['guardian.first_name'] = true
  if (!guardian.value.last_name) errors.value['guardian.last_name'] = true
  if (!guardian.value.relationship) errors.value['guardian.relationship'] = true
  if (!guardian.value.contact_number) errors.value['guardian.contact_number'] = true

  if (Object.keys(errors.value).length > 0) {
    // Switch to the first tab that has an error
    if (errors.value.gender || errors.value.birthdate || errors.value.civil_status) {
      activeTab.value = 'personal'
    } else if (errors.value.contact_number || errors.value.address) {
      activeTab.value = 'contact'
    } else {
      activeTab.value = 'guardian'
    }
    return
  }

  saving.value = true
  try {
    await axios.post('/student/profile', {
      middle_name:    profile.value.middle_name,
      gender:         profile.value.gender,
      birthdate:      profile.value.birthdate,
      civil_status:   profile.value.civil_status,
      contact_number: profile.value.contact_number,
      address:        profile.value.address
    })
    await axios.post('/student/guardian', guardian.value)
    alert('Profile updated successfully!')
  } catch (err) {
    console.error('Failed to save profile:', err)
    alert('Error saving profile changes.')
  } finally {
    saving.value = false
  }
}

const addSkill = async () => {
  if (!newSkill.value.trim()) return
  try {
    const response = await axios.post('/student/skills', {
      skillName:      newSkill.value,
      skill_category: 'Technical'
    })
    skills.value.push(response.data.skill)
    newSkill.value = ''
  } catch (err) {
    console.error('Failed to add skill:', err)
  }
}

const removeSkill = async (id) => {
  try {
    await axios.delete(`/student/skills/${id}`)
    skills.value = skills.value.filter(s => s.id !== id)
  } catch (err) {
    console.error('Failed to remove skill:', err)
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.profile-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Outfit', sans-serif;
}

/* ── Page Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.section-desc { font-size: 13px; color: #b89f90; margin: 0; }

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF6B1A 0%, #ff8f5a 100%);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(255,107,26,0.3);
}
.save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,107,26,0.4); }
.save-btn:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── Grid ── */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  align-items: start;
}

.profile-main { display: flex; flex-direction: column; gap: 16px; }

/* ── Identity Strip ── */
.identity-card {
  background: #1a0a00;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: hidden;
}

.identity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 12px,
    rgba(255,107,26,0.04) 12px,
    rgba(255,107,26,0.04) 24px
  );
  pointer-events: none;
}

.identity-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,107,26,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B1A 0%, #ff9f5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(255, 107, 26, 0.3);
}

.identity-info { flex: 1; }
.identity-name { font-size: 15px; font-weight: 600; color: #fff; }
.identity-meta { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }

.active-badge {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  background: rgba(255, 107, 26, 0.15);
  color: #FF6B1A;
  border: 1px solid rgba(255, 107, 26, 0.3);
  border-radius: 100px;
  padding: 5px 12px;
  letter-spacing: 0.05em;
}

/* ── Profile Card ── */
.profile-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid #faf4f0;
}

.card-header-icon {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: #FFF5EF;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.card-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a0a00;
  margin: 0;
}

/* ── Tab Bar ── */
.tab-bar {
  display: flex;
  border-bottom: 1px solid #f0e8e0;
  padding: 0 20px;
}

.tab-item {
  font-size: 13px;
  font-weight: 500;
  color: #b89f90;
  padding: 11px 14px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s;
}

.tab-item.active {
  color: #FF6B1A;
  border-bottom-color: #FF6B1A;
  font-weight: 600;
}

/* ── Form ── */
.card-body { padding: 20px; }

.tab-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5efe9;
}

.tab-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab-icon.personal {
  background: linear-gradient(135deg, #FFF5F5, #FFCDD2);
  border: 1px solid #EF9A9A;
  color: #C62828;
}

.tab-icon.contact {
  background: linear-gradient(135deg, #E3F2FD, #90CAF9);
  border: 1px solid #64B5F6;
  color: #1565C0;
}

.tab-icon.guardian {
  background: linear-gradient(135deg, #E8F5E9, #A5D6A7);
  border: 1px solid #81C784;
  color: #2E7D32;
}

.tab-icon.progress {
  background: linear-gradient(135deg, #FFF8E1, #FFE082);
  border: 1px solid #FFD54F;
  color: #F57C00;
}

.tab-header-text {
  flex: 1;
}

.tab-header-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
  letter-spacing: -0.01em;
}

.tab-header-subtitle {
  font-size: 12px;
  color: #9a8070;
  margin-top: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group { display: flex; flex-direction: column; gap: 6px; }
.full-width { grid-column: span 2; }

.form-group label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #b89f90;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon .icon {
  position: absolute;
  left: 12px;
  width: 15px; height: 15px;
  color: #b89f90;
  pointer-events: none;
  z-index: 1;
}

.input-icon.textarea-icon .icon { top: 14px; align-self: flex-start; }

.input-icon input,
.input-icon select,
.input-icon textarea {
  padding: 10px 14px 10px 38px;
  border: 1px solid #f0e8e0;
  border-radius: 10px;
  font-size: 13px;
  color: #1a0a00;
  background: #faf8f6;
  font-family: 'Outfit', sans-serif;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
  width: 100%;
}

.input-icon input:focus,
.input-icon select:focus,
.input-icon textarea:focus {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.08);
}

.readonly-input {
  background: #f3f0ed !important;
  color: #9a8070 !important;
  cursor: not-allowed;
}

.error-input {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ── Progress Card ── */
.progress-card {
  background: linear-gradient(145deg, #fff 0%, #faf8f6 100%);
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}

/* ── Progress Bars ── */
.progress-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1a0a00;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.progress-dot.orange {
  background: linear-gradient(135deg, #FF6B1A, #ff9f5a);
  box-shadow: 0 2px 6px rgba(255,107,26,0.4);
}

.progress-dot.purple {
  background: linear-gradient(135deg, #534AB7, #7B68EE);
  box-shadow: 0 2px 6px rgba(83,74,183,0.4);
}

.progress-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #9a8070;
}

.progress-track {
  height: 10px;
  background: #f5efe9;
  border-radius: 100px;
  overflow: hidden;
  position: relative;
}

.progress-track::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
}

.progress-bar {
  height: 100%;
  border-radius: 100px;
  position: relative;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-bar.orange {
  background: linear-gradient(90deg, #FF6B1A 0%, #ff9f5a 100%);
  box-shadow: 0 2px 8px rgba(255,107,26,0.35);
}

.progress-bar.purple {
  background: linear-gradient(90deg, #534AB7 0%, #7B68EE 100%);
  box-shadow: 0 2px 8px rgba(83,74,183,0.35);
}

/* ── Sidebar ── */
.profile-side { display: flex; flex-direction: column; gap: 16px; }

/* ── Academic Dark Card ── */
.acad-card {
  background: #1a0a00;
  border-radius: 16px;
  overflow: hidden;
}

.acad-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.acad-header-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #F5C4B3;
}

.acad-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.acad-key { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; flex-shrink: 0; }
.acad-val { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.88); text-align: right; }

.gpa-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px 16px;
}

.gpa-label { font-size: 11px; color: rgba(255,255,255,0.35); }
.gpa-display { display: flex; align-items: baseline; gap: 4px; }

.gpa-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #FF6B1A;
  letter-spacing: -0.03em;
}

.gpa-denom { font-size: 13px; color: rgba(255,255,255,0.25); }

/* ── Technical Skills Card ── */
.skills-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  overflow: hidden;
}

/* Header */
.skills-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid #faf4f0;
}

.skills-header-left {
  display: flex;
  align-items: center;
  gap: 11px;
}

.skills-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff3eb, #ffe8d6);
  border: 1px solid #ffd5b0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.skills-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a0a00;
  line-height: 1.2;
}

.skills-count {
  font-size: 11px;
  color: #b89f90;
  margin-top: 1px;
}

/* Input Section */
.skills-input-section {
  padding: 14px 18px 0;
}

.skills-input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  background: #faf8f6;
  border: 1.5px solid #f0e8e0;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.skills-input-wrap.focused {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.08);
}

.skills-input-icon {
  color: #c9b5a8;
  margin-left: 12px;
  flex-shrink: 0;
}

.skills-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 10px;
  font-size: 12.5px;
  color: #1a0a00;
  font-family: 'Outfit', sans-serif;
}

.skills-input::placeholder { color: #c9b5a8; }

.skills-add-btn {
  background: #1a0a00;
  color: #fff;
  border: none;
  padding: 0 16px;
  height: 40px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.15s, opacity 0.15s;
  flex-shrink: 0;
}

.skills-add-btn:hover:not(:disabled) { background: #2e1200; }
.skills-add-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Divider */
.skills-divider {
  height: 1px;
  background: #f5efe9;
  margin: 14px 18px 0;
}

/* Empty State */
.skills-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 18px 24px;
  gap: 6px;
}

.skills-empty-icon { margin-bottom: 4px; opacity: 0.7; }
.skills-empty-text { font-size: 13px; font-weight: 600; color: #c9b5a8; margin: 0; }
.skills-empty-sub  { font-size: 11px; color: #d4c3b8; margin: 0; }

/* Skill List */
.skills-list {
  padding: 10px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 10px;
  border-radius: 10px;
  transition: background 0.15s;
  animation: skillIn 0.25s ease both;
}

@keyframes skillIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}

.skill-item:hover { background: #faf6f3; }

.skill-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF6B1A;
  opacity: 0.7;
  flex-shrink: 0;
}

.skill-name {
  font-size: 13px;
  font-weight: 500;
  color: #2d1a0e;
  font-family: 'Outfit', sans-serif;
}

.skill-remove-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9b5a8;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s, color 0.15s;
}

.skill-item:hover .skill-remove-btn { opacity: 1; }
.skill-remove-btn:hover { background: #fef0eb; color: #e05a00; }

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 0;
  color: #b89f90;
  font-size: 14px;
}

.spinner {
  width: 36px; height: 36px;
  border: 3px solid #f0e8e0;
  border-top-color: #FF6B1A;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner-sm {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; }
}
</style>
