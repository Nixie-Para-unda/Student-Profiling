<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">My Academic Profile</h2>
        <p class="section-desc">Keep your personal and contact information up to date.</p>
      </div>
      <div class="header-right">
        <button class="save-btn" @click="saveProfile" :disabled="saving">
          <span v-if="saving" class="spinner-sm"></span>
          {{ saving ? 'Saving Changes...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading your profile...
    </div>

    <div v-else class="profile-grid">
      <!-- Left Column: Main Info -->
      <div class="profile-main">

        <!-- Personal Information -->
        <div class="profile-card">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" class="card-icon"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Personal Information</h3>
          </div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Student Number</label>
                <input v-model="profile.student_number" type="text" readonly class="readonly-input" />
              </div>
              <div class="form-group">
                <label>First Name</label>
                <input v-model="profile.first_name" type="text" readonly class="readonly-input" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input v-model="profile.last_name" type="text" readonly class="readonly-input" />
              </div>
              <div class="form-group">
                <label>Middle Name</label>
                <input v-model="profile.middle_name" type="text" placeholder="Optional" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select v-model="profile.gender">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Birthdate</label>
                <input v-model="profile.birthdate" type="date" />
              </div>
              <div class="form-group">
                <label>Civil Status</label>
                <select v-model="profile.civil_status">
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

        <!-- Contact Details -->
        <div class="profile-card">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" class="card-icon"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.79 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Contact Details</h3>
          </div>
          <div class="card-body">
            <div class="form-group full-width">
              <label>Institutional Email</label>
              <input v-model="profile.email" type="email" readonly class="readonly-input" />
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Mobile Number</label>
                <input v-model="profile.contact_number" type="tel" placeholder="09XX XXX XXXX" />
              </div>
              <div class="form-group full-width">
                <label>Permanent Address</label>
                <textarea v-model="profile.address" rows="3" placeholder="Enter your full address"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ADDED: Guardian Information -->
        <div class="profile-card">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" class="card-icon"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Guardian Information</h3>
          </div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Guardian Name</label>
                <input v-model="guardian.name" type="text" placeholder="Full name" />
              </div>
              <div class="form-group">
                <label>Relationship</label>
                <select v-model="guardian.relationship">
                  <option value="">Select</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Relative">Relative</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
              <div class="form-group">
                <label>Contact Number</label>
                <input v-model="guardian.contact" type="tel" placeholder="09XX XXX XXXX" />
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input v-model="guardian.email" type="email" placeholder="guardian@email.com" />
              </div>
              <div class="form-group full-width">
                <label>Address</label>
                <textarea v-model="guardian.address" rows="2" placeholder="Guardian's address"></textarea>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Academic & Skills -->
      <div class="profile-side">
        <!-- Academic Summary -->
        <div class="profile-card side-card accent">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" class="card-icon"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Academic Info</h3>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Student ID</span>
              <span class="info-value">{{ profile.student_number }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Course</span>
              <span class="info-value">{{ profile.course_name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Section</span>
              <span class="info-value">{{ profile.section_name || 'Unassigned' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Current GWA</span>
              <span class="info-value gwa">{{ profile.gwa || '0.00' }}</span>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="profile-card side-card">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" class="card-icon"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Technical Skills</h3>
          </div>
          <div class="card-body">
            <div class="skills-input-group">
              <input v-model="newSkill" @keyup.enter="addSkill" type="text" placeholder="Add a skill (e.g. Java)" />
              <button @click="addSkill" class="add-skill-btn">+</button>
            </div>
            <div class="skills-tags">
              <span v-for="skill in skills" :key="skill" class="skill-tag">
                {{ skill }}
                <button @click="removeSkill(skill)" class="remove-skill">&times;</button>
              </span>
              <p v-if="skills.length === 0" class="empty-msg">No skills added yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const saving = ref(false)
const newSkill = ref('')
const skills = ref([])
const profile = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  student_number: '',
  email: '',
  gender: '',
  birthdate: '',
  civil_status: '',
  contact_number: '',
  address: '',
  course_name: '',
  section_name: '',
  gwa: ''
})

// ✅ ADDED: Guardian ref
const guardian = ref({
  name: '',
  relationship: '',
  contact: '',
  email: '',
  address: ''
})

const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await axios.get('/student/profile')
    const data = response.data
    profile.value = {
      ...data,
      course_name: data.section?.course?.course_code || '—',
      section_name: data.section?.section_name || '—'
    }
    // Mock skills for now
    skills.value = data.skills || []

    // ✅ ADDED: Load guardian data if available
    if (data.guardian) {
      guardian.value = { ...data.guardian }
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await axios.post('/student/profile', {
      ...profile.value,
      skills: skills.value
    })
    // ✅ ADDED: Save guardian info alongside profile
    await axios.post('/student/guardian', guardian.value)
    alert('Profile updated successfully!')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update profile.')
  } finally {
    saving.value = false
  }
}

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !skills.value.includes(skill)) {
    skills.value.push(skill)
    newSkill.value = ''
  }
}

const removeSkill = (skill) => {
  skills.value = skills.value.filter(s => s !== skill)
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
}

.section-desc {
  font-size: 13px;
  color: #b89f90;
  margin-top: 4px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FF6B1A;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(255, 107, 26, 0.2);
}

.save-btn:hover:not(:disabled) { background: #e85500; transform: translateY(-1px); }
.save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #faf8f6;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon { width: 20px; height: 20px; color: #FF6B1A; }

.card-header h3 {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.card-body { padding: 24px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.full-width { grid-column: span 2; }

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 12px 16px;
  border: 1.5px solid #f0e8e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  background: #faf8f6;
  transition: all 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #FF6B1A;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 107, 26, 0.05);
}

.readonly-input {
  background: #f3f4f6 !important;
  color: #6b7280;
  cursor: not-allowed;
}

/* Side Card */
.side-card { height: fit-content; }
.side-card.accent { background: #1a0a00; border-color: #1a0a00; color: #fff; }
.side-card.accent .card-header h3, .side-card.accent .info-label { color: rgba(255,255,255,0.6); }
.side-card.accent .info-value { color: #fff; }
.side-card.accent .card-icon { color: #FF6B1A; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.info-row:last-child { border-bottom: none; }

.info-label { font-size: 12px; font-weight: 500; }
.info-value { font-size: 14px; font-weight: 600; }
.info-value.gwa { font-family: 'Syne', sans-serif; font-size: 20px; color: #FF6B1A !important; }

/* Skills */
.skills-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.skills-input-group input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #f0e8e0;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
}

.add-skill-btn {
  width: 38px; height: 38px;
  background: #1a0a00;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
}

.skills-tags { display: flex; flex-wrap: wrap; gap: 8px; }

.skill-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff5ef;
  color: #c94000;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #ffd5b0;
}

.remove-skill {
  background: none; border: none; color: #c94000;
  font-size: 16px; cursor: pointer; padding: 0; line-height: 1;
}

.empty-msg { font-size: 12px; color: #b89f90; font-style: italic; }

.loading-state {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 100px; color: #b89f90;
}

.spinner {
  width: 40px; height: 40px; border: 4px solid #f0e8e0; border-top-color: #FF6B1A;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; }
}
</style>