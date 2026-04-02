<template>
  <div class="schedule-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Schedule Management</h2>
        <p class="page-sub">Import and manage class schedules based on curriculum requirements.</p>
      </div>
      <div class="header-actions">
        <button class="outline-btn" @click="showAutoModal = true" :disabled="loading">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M10 3v4m0 10v-4m-7-3h4m10 0h-4m-1.4-5.6l-2.8 2.8m0 5.6l2.8 2.8m-8.4-2.8l2.8-2.8m0-5.6l-2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          Auto-Generate
        </button>
        <button class="outline-btn" @click="$refs.fileInput.click()" :disabled="importing">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1m-4-8l-4-4-4 4m4-4v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ importing ? 'Importing...' : 'Import CSV' }}
        </button>
        <input type="file" ref="fileInput" @change="handleImport" style="display: none" accept=".csv" />
        <button class="primary-btn" @click="openAddModal">
          <svg viewBox="0 0 20 20" fill="none" class="btn-icon"><path d="M10 5v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          New Schedule
        </button>
      </div>
    </div>

    <div class="filter-bar pcard">
      <div class="filter-group">
        <label>Program</label>
        <select v-model="filterProgram" @change="resetActiveSection">
          <option value="">Select Program</option>
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Year Level</label>
        <select v-model="filterYear" @change="resetActiveSection">
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>
    </div>

    <!-- SECTION TABS -->
    <div v-if="filterProgram && filterYear" class="section-tabs-container">
      <div class="tabs-scroll">
        <button 
          v-for="s in filteredSections" 
          :key="s.id" 
          class="section-tab"
          :class="{ active: activeSectionId === s.id }"
          @click="activeSectionId = s.id"
        >
          {{ s.section_name }}
        </button>
        <div v-if="filteredSections.length === 0" class="no-sections-hint">
          No sections found for this year level.
        </div>
      </div>
    </div>

    <div class="schedule-list pcard">
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        Loading schedules...
      </div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Lec Lab Units</th>
              <th>Type</th>
              <th>Days</th>
              <th>Time</th>
              <th>Proctor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in groupedSchedules" :key="item.id">
              <td><span class="section-badge">{{ item.section.section_name }}</span></td>
              <td><span class="c-code">{{ item.course.course_code }}</span></td>
              <td><span class="c-name">{{ item.course.course_name }}</span></td>
              <td class="units-cell">
                <span v-if="item.course.lec_units">{{ item.course.lec_units }}L</span>
                <span v-if="item.course.lec_units && item.course.lab_units"> / </span>
                <span v-if="item.course.lab_units">{{ item.course.lab_units }}B</span>
              </td>
              <td><span class="type-badge" :class="item.class_type || 'lec'">{{ (item.class_type || 'lec').toUpperCase() }}</span></td>
              <td><span class="day-badge">{{ formatDays(item.days) }}</span></td>
              <td><span class="time-text">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</span></td>
              <td>
                <span v-if="item.faculty" class="proctor-name">{{ item.faculty.first_name }} {{ item.faculty.last_name }}</span>
                <button v-else class="assign-btn" @click="openAssignModal(item)">
                  Assign Faculty
                </button>
              </td>
              <td>
                <div class="action-btns">
                  <button class="delete-btn" @click="deleteSchedule(item.id)" title="Remove all sessions of this course">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M7 6V4a2 2 0 012-2h2a2 2 0 012 2v2m-7 0v10a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="groupedSchedules.length === 0">
              <td colspan="9" class="empty-row">No schedules found matching your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD MODAL -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Create New Schedule</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>1. Select Section</label>
              <select v-model="form.section_id" @change="onSectionChange">
                <option value="">Choose Section...</option>
                <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.section_name }} ({{ s.program.program_code }} - Year {{ s.year_level }})</option>
              </select>
            </div>

            <div v-if="form.section_id">
              <div class="form-group">
                <label>2. Choose Course from Curriculum</label>
                <select v-model="form.course_id">
                  <option value="">Choose Course...</option>
                  <option v-for="c in curriculumCourses" :key="c.id" :value="c.id">[{{ c.course_code }}] {{ c.course_name }}</option>
                </select>
                <p class="form-hint" v-if="curriculumCourses.length === 0">No courses found in curriculum for this section's year level.</p>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Type</label>
                  <select v-model="form.class_type">
                    <option value="lec">Lecture</option>
                    <option value="lab">Laboratory</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Day</label>
                  <select v-model="form.dayOfWeek">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Start Time</label>
                  <input v-model="form.startTime" type="time" />
                </div>
                <div class="form-group">
                  <label>End Time</label>
                  <input v-model="form.endTime" type="time" />
                </div>
              </div>

              <div class="form-group">
                <label>Room</label>
                <input v-model="form.room" type="text" placeholder="e.g. Lab 1" />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showAddModal = false">Cancel</button>
          <button class="primary-btn" @click="saveSchedule" :disabled="saving || !form.course_id">
            {{ saving ? 'Saving...' : 'Create Schedule' }}
          </button>
        </div>
      </div>
    </div>

    <!-- AUTO-GENERATE MODAL -->
    <div v-if="showAutoModal" class="modal-overlay" @click.self="!generating && (showAutoModal = false)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div>
            <h3>Auto-Generate Schedules</h3>
            <p class="modal-sub">Generate conflict-free schedules based on curriculum.</p>
          </div>
          <button class="close-btn" @click="showAutoModal = false" :disabled="generating">×</button>
        </div>
        <div class="modal-body profile-body">
          <div class="modal-notice">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 1v6M8 11v.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/></svg>
            <span>This will <strong>clear existing schedules</strong> for the selected sections and regenerate them from the curriculum.</span>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Generation Settings</h4>
            <div class="form-grid">
              <div class="form-group">
                <label>Program <span class="req">*</span></label>
                <select v-model="autoForm.program_id">
                  <option value="">Select Program</option>
                  <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Year Level <span class="req">*</span></label>
                <select v-model="autoForm.year_level">
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div class="form-group">
                <label>Semester <span class="req">*</span></label>
                <select v-model="autoForm.semester">
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showAutoModal = false" :disabled="generating">Cancel</button>
          <button class="primary-btn" @click="handleAutoGenerate" :disabled="generating || !autoForm.program_id">
            <span v-if="generating" class="spinner-sm"></span>
            {{ generating ? 'Generating...' : 'Start Generation' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ASSIGN FACULTY MODAL -->
    <div v-if="showAssignModal" class="modal-overlay" @click.self="!assigning && (showAssignModal = false)">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div>
            <h3>Assign Faculty</h3>
            <p class="modal-sub">Assign a faculty member to this course section.</p>
          </div>
          <button class="close-btn" @click="showAssignModal = false" :disabled="assigning">×</button>
        </div>
        <div class="modal-body profile-body">
          <div class="profile-section" v-if="selectedSchedule">
            <h4 class="section-title">Schedule Details</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Course</span>
                <span class="detail-val">{{ selectedSchedule.course.course_code }} — {{ selectedSchedule.course.course_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Section</span>
                <span class="detail-val">{{ selectedSchedule.section.section_name }}</span>
              </div>
            </div>
          </div>

          <div class="modal-notice">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 1v6M8 11v.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/></svg>
            <span>Assigning a faculty will apply to <strong>all sessions</strong> of this course for this section.</span>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Faculty Assignment</h4>
            <div class="form-group">
              <label>Select Faculty <span class="req">*</span></label>
              <select v-model="assignForm.faculty_id">
                <option value="">Choose Faculty...</option>
                <option v-for="f in facultyMembers" :key="f.id" :value="f.id">{{ f.first_name }} {{ f.last_name }} ({{ f.department?.dept_name }})</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showAssignModal = false" :disabled="assigning">Cancel</button>
          <button class="primary-btn" @click="saveAssignment" :disabled="assigning || !assignForm.faculty_id">
            <span v-if="assigning" class="spinner-sm"></span>
            {{ assigning ? 'Assigning...' : 'Assign Faculty' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

const schedules = ref([])
const sections = ref([])
const programs = ref([])
const curriculumCourses = ref([])
const facultyMembers = ref([])
const loading = ref(false)
const importing = ref(false)
const saving = ref(false)
const assigning = ref(false)
const generating = ref(false)
const showAddModal = ref(false)
const showAssignModal = ref(false)
const showAutoModal = ref(false)
const selectedSchedule = ref(null)
const filterSection = ref('')
const filterProgram = ref('')
const filterYear = ref('')
const activeSectionId = ref('')
const fileInput = ref(null)

// Compute filtered sections for tabs
const filteredSections = computed(() => {
  if (!filterProgram.value || !filterYear.value) return []
  return sections.value.filter(s => 
    s.program_id == filterProgram.value && 
    s.year_level == filterYear.value
  ).sort((a, b) => a.section_name.localeCompare(b.section_name))
})

const resetActiveSection = () => {
  activeSectionId.value = ''
  // Auto-select first section if available after filter change
  setTimeout(() => {
    if (filteredSections.value.length > 0) {
      activeSectionId.value = filteredSections.value[0].id
    }
  }, 100)
}

// Watch for changes in sections to handle initial load
watch(sections, () => {
  if (filterProgram.value && filterYear.value && !activeSectionId.value) {
    resetActiveSection()
  }
})

// Group schedules by course for better UI (as requested)
const groupedSchedules = computed(() => {
  if (schedules.value.length === 0) return []
  
  const grouped = {}
  
  schedules.value.forEach(item => {
    const key = `${item.section_id}-${item.course_id}-${item.class_type}`
    if (!grouped[key]) {
      grouped[key] = {
        ...item,
        days: [item.dayOfWeek],
        sessions: [item]
      }
    } else {
      grouped[key].days.push(item.dayOfWeek)
      grouped[key].sessions.push(item)
    }
  })

  return Object.values(grouped).filter(item => {
    // If a tab is active, prioritize that section
    if (activeSectionId.value) {
      return item.section_id == activeSectionId.value
    }
    
    const matchesSection = !filterSection.value || item.section_id == filterSection.value
    const matchesProgram = !filterProgram.value || item.section.program_id == filterProgram.value
    const matchesYear = !filterYear.value || item.section.year_level == filterYear.value
    return matchesSection && matchesProgram && matchesYear
  }).sort((a, b) => a.section.section_name.localeCompare(b.section.section_name))
})

const formatDays = (days) => {
  const dayMap = { 'Monday': 'M', 'Tuesday': 'T', 'Wednesday': 'W', 'Thursday': 'Th', 'Friday': 'F', 'Saturday': 'Sat' }
  const sortedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days.sort((a, b) => sortedDays.indexOf(a) - sortedDays.indexOf(b))
            .map(d => dayMap[d] || d)
            .join('/')
}

const form = ref({
  section_id: '',
  course_id: '',
  class_type: 'lec',
  dayOfWeek: 'Monday',
  startTime: '08:00',
  endTime: '09:00',
  room: ''
})

const autoForm = ref({
  program_id: '',
  year_level: '1',
  semester: '1st'
})

const assignForm = ref({
  faculty_id: ''
})

const fetchSchedules = async () => {
  loading.value = true
  try {
    const res = await axios.get('/schedules')
    schedules.value = res.data
  } catch (err) {
    console.error('Failed to fetch schedules:', err)
  } finally {
    loading.value = false
  }
}

const fetchSections = async () => {
  try {
    const res = await axios.get('/sections')
    sections.value = res.data
    
    // Extract unique programs
    const progMap = new Map()
    res.data.forEach(s => {
      if (s.program && !progMap.has(s.program.id)) {
        progMap.set(s.program.id, s.program)
      }
    })
    programs.value = Array.from(progMap.values())
  } catch (err) {
    console.error('Failed to fetch sections:', err)
  }
}

const fetchFaculty = async () => {
  try {
    const res = await axios.get('/faculty')
    facultyMembers.value = res.data
  } catch (err) {
    console.error('Failed to fetch faculty:', err)
  }
}

const onSectionChange = async () => {
  if (!form.value.section_id) return
  try {
    const res = await axios.get('/curriculum-courses', { params: { section_id: form.value.section_id } })
    curriculumCourses.value = res.data
  } catch (err) {
    console.error('Failed to fetch curriculum courses:', err)
  }
}

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const openAssignModal = (schedule) => {
  selectedSchedule.value = schedule
  assignForm.value.faculty_id = ''
  showAssignModal.value = true
}

const saveSchedule = async () => {
  saving.value = true
  try {
    await axios.post('/schedules', form.value)
    showAddModal.value = false
    fetchSchedules()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save schedule.')
  } finally {
    saving.value = false
  }
}

const handleAutoGenerate = async () => {
  generating.value = true
  try {
    const res = await axios.post('/schedules/auto-generate', autoForm.value)
    
    // Success message shows how many students/sections were handled
    alert(res.data.message)
    
    showAutoModal.value = false
    
    // 1. Refresh data
    await Promise.all([
      fetchSchedules(),
      fetchSections()
    ])

    // 2. Force re-calculation of active section if it was empty
    if (!activeSectionId.value && filteredSections.value.length > 0) {
      activeSectionId.value = filteredSections.value[0].id
    }
  } catch (err) {
    if (err.response?.status === 422 && err.response.data.conflicts) {
      alert('Conflict: ' + err.response.data.conflicts.join('\n'))
    } else {
      alert(err.response?.data?.message || 'Generation failed.')
    }
  } finally {
    generating.value = false
  }
}

const saveAssignment = async () => {
  if (!selectedSchedule.value) return
  assigning.value = true
  try {
    await axios.post(`/schedules/${selectedSchedule.value.id}/assign-faculty`, assignForm.value)
    showAssignModal.value = false
    fetchSchedules()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to assign faculty.')
  } finally {
    assigning.value = false
  }
}

const deleteSchedule = async (item) => {
  if (!confirm(`Are you sure you want to remove all sessions of ${item.course.course_code} for ${item.section.section_name}?`)) return
  try {
    // We send section_id and course_id to a new bulk delete endpoint or handle it in a loop
    // For now, let's assume we want to delete all sessions sharing these IDs
    await axios.delete('/schedules/bulk-delete', { 
      data: { 
        section_id: item.section_id, 
        course_id: item.course_id,
        class_type: item.class_type
      } 
    })
    fetchSchedules()
  } catch (err) {
    alert('Failed to delete schedule.')
  }
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  
  importing.value = true
  try {
    const res = await axios.post('/schedules/import', formData)
    alert(res.data.message)
    fetchSchedules()
  } catch (err) {
    alert(err.response?.data?.message || 'Import failed.')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const resetForm = () => {
  form.value = {
    section_id: '',
    course_id: '',
    class_type: 'lec',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    room: ''
  }
  curriculumCourses.value = []
}

onMounted(() => {
  fetchSchedules()
  fetchSections()
  fetchFaculty()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.schedule-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 12px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.filter-bar { padding: 16px 22px; display: flex; gap: 20px; align-items: center; }
.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; }
.filter-group select { padding: 8px 12px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; background: #fff; }

.section-tabs-container { margin-top: 8px; margin-bottom: -8px; }
.tabs-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0 12px; scrollbar-width: none; }
.tabs-scroll::-webkit-scrollbar { display: none; }

.section-tab { padding: 10px 20px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 12px; font-size: 13px; font-weight: 700; color: #9a8070; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.section-tab:hover { border-color: #FF6B1A; color: #FF6B1A; }
.section-tab.active { background: #FF6B1A; border-color: #FF6B1A; color: #fff; box-shadow: 0 4px 12px rgba(255,107,26,0.2); }
.no-sections-hint { font-size: 13px; color: #b89f90; font-style: italic; padding: 10px 0; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 14px 22px; background: #fffaf8; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #f0e8e0; }
.data-table td { padding: 14px 22px; border-bottom: 1px solid #faf8f6; color: #1a0a00; }

.section-badge { background: #fff1e6; color: #ff6b1a; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; }
.type-badge { padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 10px; text-transform: uppercase; }
.type-badge.lec { background: #e0f2fe; color: #0369a1; }
.type-badge.lab { background: #fef3c7; color: #92400e; }
.c-code { font-weight: 700; color: #1a0a00; font-size: 13px; }
.c-name { font-size: 13px; color: #1a0a00; font-weight: 500; }
.units-cell { font-size: 12px; color: #9a8070; font-weight: 600; text-align: center; }
.day-badge { background: #f0fdf4; color: #166534; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 12px; }
.time-text { font-size: 12px; color: #1a0a00; font-weight: 500; white-space: nowrap; }
.proctor-name { font-weight: 600; color: #1a0a00; font-size: 13px; }

.outline-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-icon { width: 16px; height: 16px; }

.assign-btn { background: #fff; color: #FF6B1A; border: 1.5px solid #FF6B1A; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.assign-btn:hover { background: #FF6B1A; color: #fff; }

.action-btns { display: flex; gap: 8px; justify-content: flex-end; }
.delete-btn { background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
.delete-btn:hover { background: #fee2e2; }
.delete-btn svg { width: 18px; height: 18px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-lg { max-width: 600px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.modal-body { padding: 24px; overflow-y: auto; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; }
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
.primary-btn:hover { background: #e85500; }
.primary-btn:disabled { background: #f0e8e0; color: #b89f90; cursor: not-allowed; }

/* ── View modal detail rows ── */
.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }

.selected-schedule-info { padding: 16px; background: #fffaf8; border: 1px solid #f0e8e0; border-radius: 16px; font-size: 13px; display: flex; flex-direction: column; gap: 8px; }
.bulk-alert { display: flex; gap: 8px; align-items: center; background: #e0f2fe; color: #0369a1; padding: 8px 12px; border-radius: 10px; margin-top: 4px; font-size: 12px; }
.info-icon { width: 16px; height: 16px; flex-shrink: 0; }
.mt-4 { margin-top: 24px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }
.form-group input,
.form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; width: 100%; }
.form-group input:focus,
.form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.form-hint { font-size: 11px; color: #ef4444; margin-top: 4px; }

.loading-state { padding: 60px; text-align: center; color: #b89f90; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #ff6b1a; border-radius: 50%; animation: spin 0.8s linear infinite; display: block; margin: 0 auto 12px; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
