<template>
  <div class="faculty-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Faculty Profiles</h2>
        <p class="section-desc">View faculty workloads, assigned subjects, and teaching schedules.</p>
      </div>
      <div class="header-right">
        <!-- Add Subject Button for Dean -->
        <button v-if="authStore.isDean" class="add-btn secondary" @click="showSubjectModal = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Add Subject
        </button>
        <!-- Add Faculty Button for Dean -->
        <button v-if="authStore.isDean" class="add-btn" @click="showAddModal = true">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 5v10M5 10h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add Faculty
        </button>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showSubjectModal" class="modal-overlay" @click.self="showSubjectModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create New Subject</h3>
          <button class="close-btn" @click="showSubjectModal = false">&times;</button>
        </div>
        <form @submit.prevent="handleAddSubject" class="modal-form">
          <div class="form-group">
            <label>Subject Code</label>
            <input v-model="newSubject.subject_code" type="text" required placeholder="e.g. IT101" />
          </div>
          <div class="form-group">
            <label>Subject Name</label>
            <input v-model="newSubject.subject_name" type="text" required placeholder="e.g. Introduction to Computing" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" @click="showSubjectModal = false">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Creating...' : 'Create Subject' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Assign Subject Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Assign Subject to {{ selectedProf?.name }}</h3>
          <button class="close-btn" @click="showAssignModal = false">&times;</button>
        </div>
        <form @submit.prevent="handleAssignSubject" class="modal-form">
          <div class="form-group">
            <label>Select Subject</label>
            <select v-model="assignment.subject_id" required>
              <option value="">Choose a subject...</option>
              <option v-for="sub in subjects" :key="sub.id" :value="sub.id">
                {{ sub.subject_code }} - {{ sub.subject_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Select Section</label>
            <select v-model="assignment.section_id" required>
              <option value="">Choose a section...</option>
              <option v-for="sec in sections" :key="sec.id" :value="sec.id">
                {{ sec.course?.course_name }} {{ sec.year_level }}{{ sec.section_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Schedule (Optional)</label>
            <input v-model="assignment.schedule" type="text" placeholder="e.g. Mon/Wed 9:00 AM - 10:30 AM" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" @click="showAssignModal = false">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Assigning...' : 'Assign Subject' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Faculty Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add Faculty Member</h3>
          <button class="close-btn" @click="showAddModal = false">&times;</button>
        </div>
        <form @submit.prevent="handleAddFaculty" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="newFaculty.first_name" type="text" required placeholder="Enter first name" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="newFaculty.last_name" type="text" required placeholder="Enter last name" />
            </div>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="newFaculty.email" type="email" required placeholder="faculty@department.edu" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Position</label>
              <select v-model="newFaculty.position" required>
                <option value="Instructor">Instructor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Department</label>
              <select v-model="newFaculty.department_id" required>
                <option value="1">College of Computing Studies</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Initial Password</label>
            <input v-model="newFaculty.password" type="password" required placeholder="Min 8 characters" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" @click="showAddModal = false">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Adding...' : 'Add Faculty Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading faculty records...
    </div>

    <div v-else class="faculty-grid">
      <div class="faculty-card" v-for="prof in faculty" :key="prof.id">
        <div class="card-top">
          <div class="prof-avatar" :style="{ background: prof.color }">{{ prof.initials }}</div>
          <div class="prof-main">
            <div class="prof-header-row">
              <h3 class="prof-name">{{ prof.name }}</h3>
              <button v-if="authStore.isDean" class="icon-btn" @click="openAssignModal(prof)" title="Assign Subject">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <p class="prof-expertise">{{ prof.expertise }}</p>
            <span class="status-tag" :class="prof.statusClass">{{ prof.status }}</span>
          </div>
        </div>
        
        <div class="workload-section">
          <div class="workload-header">
            <span class="workload-label">Teaching Load</span>
            <span class="workload-value"><strong>{{ prof.load }}</strong>/30 hrs</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (prof.load / 30 * 100) + '%', background: prof.barColor }"></div>
          </div>
        </div>

        <div class="subjects-section">
          <span class="subjects-label">ASSIGNED SUBJECTS</span>
          <div class="subjects-tags">
            <span v-for="sub in prof.subjects" :key="sub" class="subject-tag">{{ sub }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const submitting = ref(false)
const faculty = ref([])
const subjects = ref([])
const sections = ref([])
const showAddModal = ref(false)
const showSubjectModal = ref(false)
const showAssignModal = ref(false)
const selectedProf = ref(null)

const newFaculty = ref({
  first_name: '',
  last_name: '',
  email: '',
  department_id: '1',
  position: 'Instructor',
  status: 'Normal',
  password: ''
})

const newSubject = ref({
  subject_code: '',
  subject_name: ''
})

const assignment = ref({
  faculty_id: '',
  subject_id: '',
  section_id: '',
  schedule: ''
})

const fetchFaculty = async () => {
  loading.value = true
  try {
    const response = await axios.get('/dean/faculty')
    faculty.value = response.data.map(f => ({
      id: f.id,
      name: `Prof. ${f.first_name.charAt(0)}. ${f.last_name}`,
      expertise: f.position,
      initials: f.first_name.charAt(0) + f.last_name.charAt(0),
      color: '#fff5ef',
      status: f.status,
      statusClass: f.status === 'Overloaded' ? 'st-danger' : 'st-success',
      load: f.load || 0,
      barColor: f.status === 'Overloaded' ? '#ef4444' : '#10b981',
      subjects: f.subject_loads ? f.subject_loads.map(load => `${load.subject.subject_code} (${load.section.year_level}${load.section.section_name})`) : []
    }))
  } catch (err) {
    console.error('Failed to fetch faculty:', err)
  } finally {
    loading.value = false
  }
}

const fetchSubjects = async () => {
  try {
    const response = await axios.get('/dean/subjects')
    subjects.value = response.data
  } catch (err) {
    console.error('Failed to fetch subjects:', err)
  }
}

const fetchSections = async () => {
  try {
    const response = await axios.get('/dean/sections')
    sections.value = response.data
  } catch (err) {
    console.error('Failed to fetch sections:', err)
  }
}

const handleAddSubject = async () => {
  submitting.value = true
  try {
    await axios.post('/dean/subjects', newSubject.value)
    alert('Subject created successfully!')
    showSubjectModal.value = false
    newSubject.value = { subject_code: '', subject_name: '' }
    fetchSubjects()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create subject.')
  } finally {
    submitting.value = false
  }
}

const openAssignModal = (prof) => {
  selectedProf.value = prof
  assignment.value = {
    faculty_id: prof.id,
    subject_id: '',
    section_id: '',
    schedule: ''
  }
  showAssignModal.value = true
}

const handleAssignSubject = async () => {
  submitting.value = true
  try {
    await axios.post('/dean/faculty/assign-subject', assignment.value)
    alert('Subject assigned successfully!')
    showAssignModal.value = false
    fetchFaculty()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to assign subject.')
  } finally {
    submitting.value = false
  }
}

const handleAddFaculty = async () => {
  submitting.value = true
  try {
    await axios.post('/dean/faculty', newFaculty.value)
    alert('Faculty member added successfully!')
    showAddModal.value = false
    // Reset form
    newFaculty.value = {
      first_name: '',
      last_name: '',
      email: '',
      department_id: '1',
      position: 'Instructor',
      status: 'Normal',
      password: ''
    }
    fetchFaculty()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add faculty member.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (authStore.isDean) {
    fetchFaculty()
    fetchSubjects()
    fetchSections()
  }
})
</script>

<style scoped>
.faculty-page {
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

.header-right {
  display: flex;
  gap: 12px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a0a00;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.add-btn.secondary {
  background: #fff;
  border: 1.5px solid #f0e8e0;
  color: #1a0a00;
}

.add-btn.secondary:hover {
  background: #faf7f5;
  border-color: #e6dad0;
}

.prof-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.icon-btn {
  background: none;
  border: none;
  color: #b89f90;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #fdf8f4;
  color: #1a0a00;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.export-btn:hover {
  border-color: #FF6B1A;
  color: #FF6B1A;
  background: #fff5ef;
}

.export-btn svg { width: 16px; height: 16px; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 10, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 { font-family: 'Syne', sans-serif; font-size: 20px; color: #1a0a00; }

.close-btn {
  background: none; border: none; font-size: 24px; color: #b89f90; cursor: pointer;
}

.modal-form { display: flex; flex-direction: column; gap: 16px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-group label { font-size: 12px; font-weight: 600; color: #9a8070; }

.form-group input, .form-group select {
  padding: 10px 14px;
  border: 1.5px solid #f0e8e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  font-family: 'DM Sans', sans-serif;
}

.form-group input:focus { border-color: #FF6B1A; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.btn-ghost {
  padding: 10px 20px; border-radius: 10px; border: 1.5px solid #f0e8e0;
  background: none; font-weight: 600; color: #9a8070; cursor: pointer;
}

.btn-primary {
  padding: 10px 20px; border-radius: 10px; border: none;
  background: #FF6B1A; color: #fff; font-weight: 600; cursor: pointer;
}

.loading-state {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px; color: #b89f90;
}

.spinner {
  width: 32px; height: 32px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.faculty-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.faculty-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(26, 10, 0, 0.05);
}

.card-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.prof-avatar {
  width: 54px; height: 54px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 18px;
  color: #FF6B1A;
  border: 1px solid rgba(255,107,26,0.1);
}

.prof-main { flex: 1; }

.prof-name {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.prof-expertise {
  font-size: 12px;
  color: #b89f90;
  margin-top: 2px;
}

.status-tag {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 8px;
}

.st-danger { background: #fff1f2; color: #e11d48; }
.st-success { background: #f0fdf4; color: #16a34a; }
.st-warning { background: #fff7ed; color: #ea580c; }
.st-info { background: #eff6ff; color: #3b82f6; }

.workload-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.workload-label { font-size: 12px; color: #9a8070; }
.workload-value { font-size: 12px; color: #1a0a00; }

.progress-bar {
  height: 6px;
  background: #f0e8e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.subjects-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  color: #b89f90;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.subjects-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  font-size: 10px;
  font-weight: 600;
  background: #fff5ef;
  color: #c94000;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #ffd5b0;
}
</style>

<style scoped>
.faculty-page {
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

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #f0e8e0;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.export-btn:hover {
  border-color: #FF6B1A;
  color: #FF6B1A;
  background: #fff5ef;
}

.export-btn svg { width: 16px; height: 16px; }

.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.faculty-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.faculty-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(26, 10, 0, 0.05);
}

.card-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.prof-avatar {
  width: 54px; height: 54px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 18px;
  color: #FF6B1A;
  border: 1px solid rgba(255,107,26,0.1);
}

.prof-main { flex: 1; }

.prof-name {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.prof-expertise {
  font-size: 12px;
  color: #b89f90;
  margin-top: 2px;
}

.status-tag {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 8px;
}

.st-danger { background: #fff1f2; color: #e11d48; }
.st-success { background: #f0fdf4; color: #16a34a; }
.st-warning { background: #fff7ed; color: #ea580c; }
.st-info { background: #eff6ff; color: #3b82f6; }

.workload-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.workload-label { font-size: 12px; color: #9a8070; }
.workload-value { font-size: 12px; color: #1a0a00; }

.progress-bar {
  height: 6px;
  background: #f0e8e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.subjects-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  color: #b89f90;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.subjects-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  font-size: 10px;
  font-weight: 600;
  background: #fff5ef;
  color: #c94000;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #ffd5b0;
}
</style>
