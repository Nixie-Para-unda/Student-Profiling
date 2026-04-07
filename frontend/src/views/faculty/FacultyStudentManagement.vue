<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Students</h2>
        <p class="page-sub">View information for students in your handled sections.</p>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="mini-stats">
      <div class="mini-stat stat-orange">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[0].value }}</span>
          <span class="stat-label">{{ miniStats[0].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-purple">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[1].value }}</span>
          <span class="stat-label">{{ miniStats[1].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[2].value }}</span>
          <span class="stat-label">{{ miniStats[2].label }}</span>
        </div>
      </div>

      <div class="mini-stat stat-green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ miniStats[3].value }}</span>
          <span class="stat-label">{{ miniStats[3].label }}</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by name, email, or student number..." />
      </div>
      <div class="filter-group">
        <select v-model="filterSubject">
          <option value="">All Subjects</option>
          <option v-for="subj in availableSubjects" :key="subj.id" :value="subj.id">
            {{ subj.name }} ({{ subj.code }})
          </option>
        </select>
        <select v-model="filterCourse">
          <option value="">All Programs</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSIS">BSIS</option>
        </select>
        <select v-model="filterYear">
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <select v-model="filterSection">
          <option value="">All Sections</option>
          <option v-for="sec in availableSections" :key="sec" :value="sec">{{ sec }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-lg"></div>
        <p>Fetching students...</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>STUDENT NO.</th>
              <th>COURSE</th>
              <th>YEAR/SECTION</th>
              <th>GWA</th>
              <th>VIOLATIONS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in paginatedStudents" :key="student.id" @click="viewDetails(student)" class="clickable-row">
              <td>
                <div class="student-cell">
                  <div class="s-avatar" :style="{ background: student.color }">{{ student.first_name.charAt(0) }}</div>
                  <div>
                    <p class="s-name">{{ student.first_name }} {{ student.last_name }}</p>
                    <p class="s-sub">{{ student.email }}</p>
                  </div>
                </div>
              </td>
              <td><span class="code-badge">{{ student.student_number }}</span></td>
              <td>{{ student.course }}</td>
              <td>{{ student.year_level }}{{ getYearSuffix(student.year_level) }} Year · {{ student.section || '—' }}</td>
              <td><span class="gwa-val" :class="student.gwa <= 1.75 ? 'gwa-good' : 'gwa-ok'">{{ student.gwa || 'N/A' }}</span></td>
              <td><span class="v-count" :class="student.violations_count > 0 ? 'v-danger' : 'v-clear'">{{ student.violations_count || 0 }}</span></td>
              <td>
                <span class="status-badge" :class="student.status === 'active' ? 'st-active' : 'st-pending'">
                  {{ student.status === 'active' ? 'Active' : 'Pending' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0 && !loading">
              <td colspan="7" class="empty-row">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar" v-if="filteredStudents.length > pageSize">
        <div class="pagination-info">
          Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> to <strong>{{ Math.min(currentPage * pageSize, filteredStudents.length) }}</strong> of <strong>{{ filteredStudents.length }}</strong> students
        </div>
        <div class="pagination-btns">
          <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="pag-pages">
            <button v-for="p in totalPages" :key="p" class="pag-page-btn" :class="{ active: currentPage === p }" @click="currentPage = p">{{ p }}</button>
          </div>
          <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="viewingStudent" class="modal-overlay" @click.self="viewingStudent = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-student-meta">
            <div class="s-avatar lg" :style="{ background: viewingStudent.color }">
              {{ viewingStudent.first_name.charAt(0) }}
            </div>
            <div>
              <h3>{{ viewingStudent.first_name }} {{ viewingStudent.last_name }}</h3>
              <p class="modal-sub">{{ viewingStudent.student_number }} · {{ viewingStudent.course }} · {{ viewingStudent.section || 'No Section' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingStudent = null">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Personal Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Full Name</span>
                <span class="detail-val">{{ viewingStudent.first_name }} {{ viewingStudent.last_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Email Address</span>
                <span class="detail-val">{{ viewingStudent.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Student Number</span>
                <span class="detail-val"><span class="code-badge">{{ viewingStudent.student_number }}</span></span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Academic Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Program</span>
                <span class="detail-val">{{ viewingStudent.course }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Year Level</span>
                <span class="detail-val">{{ viewingStudent.year_level }}{{ getYearSuffix(viewingStudent.year_level) }} Year</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Section</span>
                <span class="detail-val">{{ viewingStudent.section || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Current GWA</span>
                <span class="detail-val">{{ viewingStudent.gwa || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="profile-section" v-if="viewingStudent.guardian">
            <h4 class="section-title">Guardian Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Guardian Name</span>
                <span class="detail-val">{{ viewingStudent.guardian.first_name }} {{ viewingStudent.guardian.last_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Relationship</span>
                <span class="detail-val">{{ viewingStudent.guardian.relationship }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Contact Number</span>
                <span class="detail-val">{{ viewingStudent.guardian.contact_number }}</span>
              </div>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Guardian Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align:left;color:#b89f90;font-style:italic;">No guardian information provided.</span>
              </div>
            </div>
          </div>

          <div class="profile-section" v-if="viewingStudent.organizations && viewingStudent.organizations.length > 0">
            <h4 class="section-title">Affiliations</h4>
            <div class="detail-rows">
              <div class="detail-row" v-for="org in viewingStudent.organizations" :key="org.name">
                <span class="detail-key">{{ org.name }}</span>
                <span class="detail-val">{{ org.role }}</span>
              </div>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Affiliations</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align:left;color:#b89f90;font-style:italic;">No affiliations recorded.</span>
              </div>
            </div>
          </div>

          <div class="profile-section" v-if="viewingStudent.skills && viewingStudent.skills.length > 0">
            <h4 class="section-title">Skills</h4>
            <div class="skill-tags">
              <span class="skill-tag" v-for="skill in viewingStudent.skills" :key="skill.name">
                {{ skill.name }}
                <span class="skill-cat">{{ skill.category }}</span>
              </span>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Skills</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align:left;color:#b89f90;font-style:italic;">No skills recorded.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingStudent = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const search = ref('')
const filterCourse = ref('')
const filterYear = ref('')
const filterSection = ref('')
const filterSubject = ref('')
const loading = ref(false)
const viewingStudent = ref(null)
const currentPage = ref(1)
const pageSize = ref(50)

const colors = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
const students = ref([])
const handledSubjects = ref([])

const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await axios.get('/faculty/students')
    const data = response.data
    students.value = data.students.map((s, idx) => ({
      id: s.id,
      first_name: s.first_name,
      last_name: s.last_name,
      student_number: s.user?.student_number || 'N/A',
      email: s.user?.email || 'N/A',
      course: s.program?.program_code || 'N/A',
      year_level: s.year_level || s.section?.year_level || 1,
      section: s.section?.section_name || null,
      section_id: s.section_id,
      status: s.user?.status || 'pending',
      gwa: s.gwa || 'N/A',
      violations_count: s.violations_count || 0,
      color: colors[idx % colors.length],
      guardian: s.guardian || null,
      skills: (s.skills || []).map(sk => ({ name: sk.skillName, category: sk.skill_category })),
      organizations: (s.organizations || []).map(org => ({
        name: org.organization?.organization_name || 'Unknown',
        role: org.role,
        dateJoined: org.dateJoined,
        dateLeft: org.dateLeft
      }))
    }))
    handledSubjects.value = data.subjects
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loading.value = false
  }
}

const getYearSuffix = (y) => {
  const last = y % 10
  if (last === 1 && y !== 11) return 'st'
  if (last === 2 && y !== 12) return 'nd'
  if (last === 3 && y !== 13) return 'rd'
  return 'th'
}

const miniStats = computed(() => [
  { label: 'My Students', value: students.value.length },
  { label: 'BSCS', value: students.value.filter(s => s.course === 'BSCS').length },
  { label: 'BSIT', value: students.value.filter(s => s.course === 'BSIT').length },
  { label: 'Active', value: students.value.filter(s => s.status === 'active').length }
])

const availableSections = computed(() => {
  const secs = students.value.map(s => s.section).filter(Boolean)
  return [...new Set(secs)].sort()
})

const availableSubjects = computed(() => {
  const unique = []
  const ids = new Set()
  for (const s of handledSubjects.value) {
    if (!ids.has(s.id)) {
      ids.add(s.id)
      unique.push({ id: s.id, name: s.name, code: s.code })
    }
  }
  return unique.sort((a, b) => a.name.localeCompare(b.name))
})

const filteredStudents = computed(() => {
  let subjectSectionIds = []
  if (filterSubject.value) {
    subjectSectionIds = handledSubjects.value
      .filter(s => s.id == filterSubject.value)
      .map(s => s.section_id)
  }
  return students.value.filter(s => {
    const matchSearch = !search.value ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
      s.email.toLowerCase().includes(search.value.toLowerCase()) ||
      s.student_number.toLowerCase().includes(search.value.toLowerCase())
    const matchCourse = !filterCourse.value || s.course === filterCourse.value
    const matchYear = !filterYear.value || s.year_level == filterYear.value
    const matchSection = !filterSection.value || s.section === filterSection.value
    const matchSubject = !filterSubject.value || subjectSectionIds.includes(s.section_id)
    return matchSearch && matchCourse && matchYear && matchSection && matchSubject
  })
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredStudents.value.slice(start, start + pageSize.value)
})

const viewDetails = (student) => {
  viewingStudent.value = student
}

onMounted(fetchStudents)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* ── Stats ── */
.mini-stats { display: flex; gap: 14px; }

.mini-stat {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-top: 3px solid;
  border-radius: 14px;
  padding: 16px 20px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg { width: 18px; height: 18px; }

.stat-text { display: flex; flex-direction: column; gap: 3px; }

.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.stat-orange { border-top-color: #FF6B1A; }
.stat-orange .stat-icon { background: #fff5ef; }
.stat-orange .stat-icon svg { color: #FF6B1A; }
.stat-orange .stat-value { color: #FF6B1A; }

.stat-purple { border-top-color: #8b5cf6; }
.stat-purple .stat-icon { background: #f5f3ff; }
.stat-purple .stat-icon svg { color: #8b5cf6; }
.stat-purple .stat-value { color: #8b5cf6; }

.stat-blue { border-top-color: #3b82f6; }
.stat-blue .stat-icon { background: #eff6ff; }
.stat-blue .stat-icon svg { color: #3b82f6; }
.stat-blue .stat-value { color: #3b82f6; }

.stat-green { border-top-color: #10b981; }
.stat-green .stat-icon { background: #f0fdf4; }
.stat-green .stat-icon svg { color: #10b981; }
.stat-green .stat-value { color: #10b981; }

/* ── Toolbar ── */
.table-toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; min-width: 200px; transition: all 0.2s; }
.search-wrap:focus-within { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.search-wrap svg { width: 15px; height: 15px; color: #c0b0a5; flex-shrink: 0; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; width: 100%; background: none; }
.search-wrap input::placeholder { color: #c0b0a5; }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-group select { padding: 9px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; background: #fff; outline: none; cursor: pointer; transition: border-color 0.2s; }
.filter-group select:focus { border-color: #FF6B1A; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; position: relative; flex: 1; display: flex; flex-direction: column; min-height: 400px; }
.table-container { flex: 1; overflow-y: auto; }
.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; gap: 10px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.clickable-row { cursor: pointer; transition: background 0.15s; }
.clickable-row:hover td { background: #fdf5ef !important; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-avatar.lg { width: 50px; height: 50px; border-radius: 14px; font-size: 20px; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; }
.s-sub { font-size: 11px; color: #b89f90; margin-top: 1px; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.gwa-val { font-weight: 700; font-size: 13px; }
.gwa-good { color: #16a34a; }
.gwa-ok { color: #f59e0b; }
.v-count { font-weight: 700; font-size: 12px; padding: 2px 7px; border-radius: 5px; }
.v-danger { background: #fef2f2; color: #ef4444; }
.v-clear { background: #f0fdf4; color: #16a34a; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Pagination ── */
.pagination-bar { padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #fff; display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.pagination-info { font-size: 13px; color: #9a8070; }
.pagination-btns { display: flex; align-items: center; gap: 12px; }
.pag-pages { display: flex; gap: 6px; }
.pag-btn, .pag-page-btn { background: #fff; border: 1.5px solid #f0e8e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; }
.pag-btn { width: 32px; height: 32px; color: #1a0a00; }
.pag-page-btn { min-width: 32px; height: 32px; padding: 0 8px; font-size: 13px; font-weight: 600; color: #9a8070; }
.pag-btn:hover:not(:disabled), .pag-page-btn:hover { border-color: #FF6B1A; color: #FF6B1A; background: #fffaf8; }
.pag-page-btn.active { background: #FF6B1A; border-color: #FF6B1A; color: #fff; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 600px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-student-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-student-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.modal-body { padding: 24px; overflow-y: auto; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }
.detail-rows { display: flex; flex-direction: column; border: 1px solid #f0e8e0; border-radius: 12px; overflow: hidden; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
.skill-tag { display: inline-flex; align-items: center; gap: 6px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #1a0a00; }
.skill-cat { font-size: 10px; font-weight: 700; color: #FF6B1A; background: #fff; padding: 1px 6px; border-radius: 4px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; }

.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>