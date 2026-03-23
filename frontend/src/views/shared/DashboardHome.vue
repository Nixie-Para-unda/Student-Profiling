<template>
  <div class="dashboard-home">

    <!-- HERO BANNER -->
    <div class="hero-banner">
      <div class="hero-bg-shape shape-1"></div>
      <div class="hero-bg-shape shape-2"></div>
      <div class="hero-body">
        <!-- DEAN Hero Left -->
        <div class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Dean' }} 👋</h2>
          <p class="hero-desc">You have <strong>{{ summaryData.pendingApprovals }} pending recognition approvals</strong> and <strong>{{ summaryData.activeViolations }} student violations</strong> requiring attention this week.</p>
          <div class="hero-actions">
            <button class="hero-btn-primary" @click="activeTab = 'approvals'">Pending Approvals <span class="hero-btn-badge">{{ summaryData.pendingApprovals }}</span></button>
            <button class="hero-btn-ghost" @click="activeTab = 'reports'">Generate Report</button>
          </div>
        </div>

        <!-- DEAN Hero Right -->
        <div class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">This Week</span><span class="hsc-value">{{ summaryData.activitiesThisWeek }}</span><span class="hsc-sub">Activities logged</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Pending</span><span class="hsc-value">{{ summaryData.pendingApprovals }}</span><span class="hsc-sub">Awaiting review</span></div>
        </div>
      </div>
    </div>

    <!-- STATS GRID -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label"
        @click="stat.action && stat.action()"
        :class="{ clickable: stat.action }">
        <div class="stat-top">
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-icon" :style="{ background: stat.iconBg, color: stat.iconColor }">
            <component :is="'svg'" viewBox="0 0 18 18" fill="none" v-html="stat.iconPath"></component>
          </div>
        </div>
        <div class="stat-bottom">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-delta" :class="stat.deltaClass">{{ stat.delta }}</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill" :style="{ width: stat.fill, background: stat.iconColor }"></div></div>
      </div>
    </div>

    <!-- DEAN DASHBOARD TABS -->
    <div v-if="authStore.isDean" class="dean-tabs-container">
      <!-- Tab Navigation -->
      <div class="tabs-nav">
        <button 
          v-for="tab in deanTabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon" v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content: Faculty -->
      <div v-if="activeTab === 'faculty'" class="tab-content">
        <div class="tab-header">
          <h3>Faculty Management</h3>
          <div class="tab-actions">
            <input v-model="facultySearch" type="text" placeholder="Search faculty..." class="tab-search" />
            <select v-model="facultyFilter" class="tab-select">
              <option value="">All Status</option>
              <option value="Normal">Normal</option>
              <option value="Overloaded">Overloaded</option>
            </select>
          </div>
        </div>
        <div class="faculty-grid">
          <div class="faculty-card" v-for="prof in filteredFaculty" :key="prof.id">
            <div class="faculty-card-header">
              <div class="faculty-avatar">{{ prof.initials }}</div>
              <div class="faculty-info">
                <h4>{{ prof.name }}</h4>
                <p>{{ prof.expertise }}</p>
                <span class="faculty-status" :class="prof.load >= 30 ? 'overloaded' : 'normal'">
                  {{ prof.load >= 30 ? 'Overloaded' : 'Normal' }} · {{ prof.load }}/30 hrs
                </span>
              </div>
            </div>
            <div class="faculty-load-bar">
              <div class="load-bar-track">
                <div class="load-bar-fill" :style="{ width: (prof.load/30*100) + '%' }"></div>
              </div>
            </div>
            <div class="faculty-subjects">
              <span class="subject-tag" v-for="s in prof.subjects" :key="s">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Students -->
      <div v-if="activeTab === 'students'" class="tab-content">
        <div class="tab-header">
          <h3>Student Profiles</h3>
          <div class="tab-actions">
            <input v-model="studentSearch" type="text" placeholder="Search students..." class="tab-search" />
            <select v-model="programFilter" class="tab-select">
              <option value="">All Programs</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIT">BSIT</option>
            </select>
          </div>
        </div>
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Program</th>
                <th>Year</th>
                <th>GWA</th>
                <th>Violations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id">
                <td><span class="student-id">{{ student.studentNumber }}</span></td>
                <td>{{ student.name }}</td>
                <td>{{ student.course }}</td>
                <td>{{ student.year }}</td>
                <td><strong>{{ student.gwa }}</strong></td>
                <td><span class="violation-count" :class="{ 'has-violations': student.violations > 0 }">{{ student.violations }}</span></td>
                <td><span class="status-badge" :class="student.statusClass">{{ student.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Violations -->
      <div v-if="activeTab === 'violations'" class="tab-content">
        <div class="tab-header">
          <h3>Student Violations</h3>
          <div class="tab-actions">
            <div class="summary-tags">
              <span class="summary-tag major">Major: {{ violationCounts.major }}</span>
              <span class="summary-tag moderate">Moderate: {{ violationCounts.moderate }}</span>
              <span class="summary-tag minor">Minor: {{ violationCounts.minor }}</span>
            </div>
            <input v-model="violationSearch" type="text" placeholder="Search..." class="tab-search" />
          </div>
        </div>
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Violation Type</th>
                <th>Severity</th>
                <th>Date Filed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in filteredViolations" :key="v.id">
                <td>
                  <div class="student-cell">
                    <div class="cell-avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
                    <span>{{ v.name }}</span>
                  </div>
                </td>
                <td>{{ v.type }}</td>
                <td><span class="severity-badge" :class="v.severityClass">{{ v.severity }}</span></td>
                <td>{{ v.date }}</td>
                <td><span class="status-badge" :class="v.statusClass">{{ v.status }}</span></td>
                <td><button class="review-btn">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Performance -->
      <div v-if="activeTab === 'performance'" class="tab-content">
        <div class="tab-header">
          <h3>Academic Performance</h3>
        </div>
        <div class="performance-grid">
          <div class="perf-card">
            <div class="card-header">
              <h4>GWA Distribution</h4>
              <p>Students per GWA bracket</p>
            </div>
            <div class="dist-list">
              <div class="dist-row" v-for="row in performanceData.distribution" :key="row.range">
                <div class="dist-label">
                  <span class="range">{{ row.range }}</span>
                  <span class="desc">({{ row.desc }})</span>
                </div>
                <div class="dist-bar-wrap">
                  <div class="dist-bar">
                    <div class="dist-fill" :style="{ width: row.pct + '%', background: row.color }"></div>
                  </div>
                  <span class="dist-stats"><strong>{{ row.count }}</strong> ({{ row.pct }}%)</span>
                </div>
              </div>
            </div>
          </div>
          <div class="perf-card">
            <div class="card-header">
              <h4>Semester Trend</h4>
              <p>Average GWA over semesters</p>
            </div>
            <div class="trend-chart">
              <div class="chart-bars">
                <div class="chart-col" v-for="bar in performanceData.trend" :key="bar.sem">
                  <div class="bar-wrap">
                    <div class="bar-fill" :style="{ height: bar.pct + '%' }"></div>
                  </div>
                  <span class="bar-label">{{ bar.sem }}</span>
                </div>
              </div>
            </div>
            <div class="trend-stats">
              <div class="trend-stat">
                <span class="ts-label">Highest</span>
                <span class="ts-value">{{ performanceData.highestGwa }}</span>
              </div>
              <div class="trend-stat">
                <span class="ts-label">Lowest</span>
                <span class="ts-value">{{ performanceData.lowestGwa }}</span>
              </div>
              <div class="trend-stat">
                <span class="ts-label">Average</span>
                <span class="ts-value">{{ performanceData.avgGwa }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Curriculum -->
      <div v-if="activeTab === 'curriculum'" class="tab-content">
        <div class="tab-header">
          <h3>Curriculum Management</h3>
          <div class="tab-actions">
            <select v-model="curriculumProgram" class="tab-select">
              <option value="">Select Program</option>
              <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.program_code }}</option>
            </select>
            <button class="tab-btn-action" @click="showAddCurriculum = true">+ Add Curriculum</button>
          </div>
        </div>
        <div class="curriculum-container">
          <div v-if="groupedCurriculum.length === 0" class="empty-state">
            <p>No curriculum entries found. Select a program or add new curriculum.</p>
          </div>
          <div v-else v-for="year in groupedCurriculum" :key="year.year" class="year-section">
            <div class="year-header">
              <h4>{{ year.year }}{{ getYearSuffix(year.year) }} Year</h4>
            </div>
            <div class="semester-grid">
              <div v-for="sem in year.semesters" :key="sem.semester" class="sem-card">
                <div class="sem-header">
                  <h5>{{ sem.semester }} Semester</h5>
                  <span class="course-count">{{ sem.courses.length }} courses</span>
                </div>
                <table class="sem-table">
                  <tbody>
                    <tr v-for="item in sem.courses" :key="item.id">
                      <td class="code">{{ item.course?.course_code }}</td>
                      <td>{{ item.course?.course_name }}</td>
                      <td class="units">{{ item.course?.units }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Courses -->
      <div v-if="activeTab === 'courses'" class="tab-content">
        <div class="tab-header">
          <h3>Course Management</h3>
          <div class="tab-actions">
            <input v-model="courseSearch" type="text" placeholder="Search courses..." class="tab-search" />
            <button class="tab-btn-action" @click="showAddCourse = true">+ Add Course</button>
          </div>
        </div>
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Program</th>
                <th>Year/Sem</th>
                <th>Units</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredCourses" :key="c.id">
                <td><span class="code-badge">{{ c.course_code }}</span></td>
                <td><strong>{{ c.course_name }}</strong></td>
                <td>{{ c.program?.program_code || 'N/A' }}</td>
                <td>{{ c.year_level }}{{ getYearSuffix(c.year_level) }} / {{ c.semester }}</td>
                <td>{{ c.units }}</td>
                <td><span class="type-badge" :class="c.type">{{ c.type?.toUpperCase() }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Reports -->
      <div v-if="activeTab === 'reports'" class="tab-content">
        <div class="tab-header">
          <h3>Profiling Report Engine</h3>
        </div>
        <div class="filter-card">
          <div class="filter-grid">
            <div class="form-group">
              <label>Skill Name / Category</label>
              <input v-model="reportFilters.skill_name" type="text" placeholder="e.g. Java, Web Design" />
            </div>
            <div class="form-group">
              <label>Award Name</label>
              <input v-model="reportFilters.award_name" type="text" placeholder="e.g. Dean's List" />
            </div>
            <div class="form-group">
              <label>Activity Name</label>
              <input v-model="reportFilters.academic_activity" type="text" placeholder="e.g. Hackathon" />
            </div>
            <div class="form-group">
              <label>Year Level</label>
              <select v-model="reportFilters.year_level">
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div class="filter-actions">
            <button class="primary-btn" @click="generateReport" :disabled="reportLoading">
              {{ reportLoading ? 'Generating...' : 'Generate Report' }}
            </button>
            <button class="ghost-btn" @click="resetReportFilters">Reset</button>
          </div>
        </div>
        <div v-if="reportData.length > 0" class="report-results">
          <h4>Found {{ reportData.length }} Qualified Students</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Program</th>
                <th>Year/Section</th>
                <th>Matched Skills</th>
                <th>Relevant Awards</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in reportData" :key="student.full_name">
                <td>{{ student.full_name }}</td>
                <td>{{ student.program }}</td>
                <td>{{ student.year_level }} - {{ student.section }}</td>
                <td>
                  <div class="tag-list">
                    <span v-for="skill in student.matched_skills" :key="skill" class="tag skill-tag">{{ skill }}</span>
                  </div>
                </td>
                <td>
                  <div class="tag-list">
                    <span v-for="award in student.relevant_awards" :key="award" class="tag award-tag">{{ award }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Approvals -->
      <div v-if="activeTab === 'approvals'" class="tab-content">
        <div class="tab-header">
          <h3>Pending Approvals</h3>
        </div>
        <div class="approvals-grid">
          <div class="approval-card" v-for="(approval, index) in pendingApprovals" :key="index">
            <div class="approval-icon" :style="{ background: approval.color + '18', color: approval.color }">
              <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="approval-info">
              <h4>{{ approval.student }}</h4>
              <p>{{ approval.award }}</p>
              <span class="approval-meta">Recommended by {{ approval.faculty }}</span>
            </div>
            <div class="approval-actions">
              <button class="approve-btn" @click="approveAward(approval.id)">Approve</button>
              <button class="reject-btn" @click="rejectAward(approval.id)">Reject</button>
            </div>
          </div>
          <div v-if="pendingApprovals.length === 0" class="empty-state">
            <p>No pending approvals at this time.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- DEAN BOTTOM GRID (Quick Stats) -->
    <div v-if="authStore.isDean && false" class="bottom-grid">
      <div class="card chart-card">
        <div class="card-header">
          <div><h3 class="card-title">Academic Performance Trends</h3><p class="card-sub">Average GWA per semester</p></div>
        </div>
        <div class="chart-bars">
          <div class="chart-bar-col" v-for="(bar, i) in chartData" :key="i">
            <div class="chart-bar-wrap">
              <div class="chart-bar-fill" :class="{ current: i === chartData.length - 1 }" :style="{ height: bar.pct + '%' }">
              </div>
            </div>
            <span class="chart-bar-label">{{ bar.sem }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Top Performing Students</h3><p class="card-sub">Ranked by GWA</p></div>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in topStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ s.name }}</p><p class="student-course">{{ s.course }}</p></div>
            <span class="student-tag tag-green">{{ s.tag }}</span>
            <span class="student-gwa">{{ s.gwa }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Recent Violations</h3><p class="card-sub">Active cases</p></div>
        </div>
        <div class="violation-list">
          <div class="violation-row" v-for="(v, i) in deanViolations" :key="i">
            <div class="violation-avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
            <div class="violation-info"><p class="violation-name">{{ v.name }}</p><p class="violation-type">{{ v.type }}</p></div>
            <span class="violation-badge" :class="v.severityClass">{{ v.severity }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref([])

// Tab state
const activeTab = ref('faculty')

// Dean tabs configuration
const deanTabs = [
  { id: 'faculty', label: 'Faculty', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M3 10h12M3 6h12M3 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { id: 'students', label: 'Students', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { id: 'violations', label: 'Violations', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M9 6v3m0 3v.5M3.5 14.5h11a1 1 0 00.87-1.5l-5.5-9.5a1 1 0 00-1.74 0l-5.5 9.5A1 1 0 003.5 14.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { id: 'performance', label: 'Performance', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M2 12l3-6 3 4 3-3 5 5H2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  { id: 'curriculum', label: 'Curriculum', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M3 4h12M3 9h12M3 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { id: 'courses', label: 'Courses', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { id: 'reports', label: 'Reports', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M4 12V7m3 5V3m3 7V5m3 5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { id: 'approvals', label: 'Approvals', icon: '<svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2 4 5 1-4 4 1 5L9 13l-4 3 1-5-4-4 5-1 2-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
]

// Summary data
const summaryData = ref({
  totalStudents: 0,
  totalFaculty: 0,
  avgGwa: 0,
  activeViolations: 0,
  activitiesThisWeek: 0,
  pendingApprovals: 0
})

// Faculty data
const faculty = ref([])
const facultySearch = ref('')
const facultyFilter = ref('')

// Students data
const students = ref([])
const studentSearch = ref('')
const programFilter = ref('')

// Violations data
const violations = ref([])
const violationSearch = ref('')

// Curriculum data
const curriculum = ref([])
const programs = ref([])
const curriculumProgram = ref('')

// Courses data
const courses = ref([])
const courseSearch = ref('')

// Report data
const reportFilters = ref({ skill_name: '', award_name: '', academic_activity: '', year_level: '' })
const reportData = ref([])
const reportLoading = ref(false)

// Performance data
const performanceData = ref({
  summary: { deans_list: 0, satisfactory: 0, at_risk: 0, failed: 0 },
  distribution: [],
  trend: [],
  highestGwa: '1.21',
  lowestGwa: '3.45',
  avgGwa: '1.87'
})

// Pending approvals
const pendingApprovals = ref([
  { id: 1, student: 'Aira Mae Reyes', award: "Dean's List Nomination", faculty: 'Dr. R. Villanueva', color: '#f59e0b' },
  { id: 2, student: 'Jose Miguel Cruz', award: 'Best Research Paper', faculty: 'Prof. A. Reyes', color: '#3b82f6' },
  { id: 3, student: 'Mark Dela Cruz', award: "Dean's List Nomination", faculty: 'Dr. J. Cruz', color: '#8b5cf6' }
])

// Computed
const filteredFaculty = computed(() => {
  return faculty.value.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(facultySearch.value.toLowerCase())
    const matchesStatus = facultyFilter.value
      ? (facultyFilter.value === 'Overloaded' ? f.load >= 30 : f.load < 30)
      : true
    return matchesSearch && matchesStatus
  })
})

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.value.toLowerCase())
    const matchesProgram = programFilter.value ? s.course === programFilter.value : true
    return matchesSearch && matchesProgram
  })
})

const filteredViolations = computed(() => {
  return violations.value.filter(v => {
    return v.name.toLowerCase().includes(violationSearch.value.toLowerCase())
  })
})

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    return c.course_code.toLowerCase().includes(courseSearch.value.toLowerCase()) ||
           c.course_name.toLowerCase().includes(courseSearch.value.toLowerCase())
  })
})

const violationCounts = computed(() => ({
  major: violations.value.filter(v => v.severity === 'Major').length,
  moderate: violations.value.filter(v => v.severity === 'Moderate').length,
  minor: violations.value.filter(v => v.severity === 'Minor').length
}))

const groupedCurriculum = computed(() => {
  if (curriculum.value.length === 0) return []
  const filtered = curriculumProgram.value 
    ? curriculum.value.filter(c => c.program_id == curriculumProgram.value)
    : curriculum.value
  
  const years = {}
  filtered.forEach(item => {
    const y = item.year_level
    if (!years[y]) years[y] = {}
    const s = item.semester
    if (!years[y][s]) years[y][s] = []
    years[y][s].push(item)
  })
  return Object.keys(years).sort().map(y => ({
    year: y,
    semesters: Object.keys(years[y]).sort().map(s => ({
      semester: s,
      courses: years[y][s]
    }))
  }))
})

// Methods
const getYearSuffix = (y) => y == 1 ? 'st' : y == 2 ? 'nd' : y == 3 ? 'rd' : 'th'

const fetchSummary = async () => {
  loading.value = true
  try {
    const response = await axios.get('/analytics/summary')
    const data = response.data
    summaryData.value = {
      totalStudents: data.total_students,
      totalFaculty: data.total_faculty,
      avgGwa: data.dept_avg_gwa,
      activeViolations: data.active_violations,
      activitiesThisWeek: 47,
      pendingApprovals: 3
    }
    stats.value = [
      { label: 'Total Students', value: data.total_students.toString(), delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', action: () => activeTab.value = 'students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
      { label: 'Total Faculty', value: data.total_faculty.toString(), delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', action: () => activeTab.value = 'faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4"/>' },
      { label: 'Avg GWA', value: data.dept_avg_gwa.toFixed(2), delta: 'Target: 1.75', deltaClass: 'warning', fill: '60%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', action: () => activeTab.value = 'performance', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
      { label: 'Violations', value: data.active_violations.toString(), delta: 'Active', deltaClass: 'negative', fill: '25%', iconBg: '#fff1f2', iconColor: '#ef4444', action: () => activeTab.value = 'violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4"/>' },
      { label: 'Awards', value: data.total_awards.toString(), delta: 'Recognitions', deltaClass: 'positive', fill: '100%', iconBg: '#fffbeb', iconColor: '#f59e0b', action: () => activeTab.value = 'approvals', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4"/>' }
    ]
  } catch (err) {
    console.error('Failed to fetch summary:', err)
  } finally {
    loading.value = false
  }
}

const fetchFaculty = async () => {
  try {
    const res = await axios.get('/faculty')
    faculty.value = res.data.map(f => ({
      id: f.id,
      name: `Prof. ${f.first_name} ${f.last_name}`,
      expertise: f.position || 'N/A',
      initials: (f.first_name?.[0] || '?') + (f.last_name?.[0] || '?'),
      load: f.load || 0,
      subjects: f.subject_loads?.map(l => l.subject?.subject_code).filter(Boolean) || []
    }))
  } catch (err) {
    console.error('Failed to fetch faculty:', err)
  }
}

const fetchStudents = async () => {
  try {
    const res = await axios.get('/students')
    students.value = res.data.map(s => ({
      id: s.id,
      studentNumber: s.user?.student_number || 'N/A',
      name: `${s.first_name} ${s.last_name}`,
      course: s.program?.program_code || 'N/A',
      year: s.section?.year_level ? `${s.section.year_level}${getYearSuffix(s.section.year_level)}` : 'N/A',
      gwa: s.gwa || '0.00',
      violations: s.violations_count || 0,
      status: s.user?.status === 'active' ? 'Active' : 'Pending',
      statusClass: s.user?.status === 'active' ? 'st-good' : 'st-monitor'
    }))
  } catch (err) {
    console.error('Failed to fetch students:', err)
  }
}

const fetchViolations = async () => {
  try {
    const res = await axios.get('/violations')
    violations.value = res.data.map(v => ({
      id: v.id,
      name: `${v.student.first_name} ${v.student.last_name}`,
      type: v.violation_type,
      severity: v.severity,
      date: v.date_filed,
      status: v.status,
      color: v.severity === 'Major' ? '#ef4444' : v.severity === 'Moderate' ? '#f59e0b' : '#6b7280',
      severityClass: v.severity === 'Major' ? 'sev-major' : v.severity === 'Moderate' ? 'sev-moderate' : 'sev-minor',
      statusClass: v.status === 'Resolved' ? 'st-resolved' : v.status === 'Warned' ? 'st-warned' : 'st-review'
    }))
  } catch (err) {
    console.error('Failed to fetch violations:', err)
  }
}

const fetchCourses = async () => {
  try {
    const [coursesRes, programsRes] = await Promise.all([
      axios.get('/courses'),
      axios.get('/programs')
    ])
    courses.value = coursesRes.data
    programs.value = programsRes.data
    if (programs.value.length > 0 && !curriculumProgram.value) {
      curriculumProgram.value = programs.value[0].id
    }
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  }
}

const fetchCurriculum = async () => {
  try {
    if (curriculumProgram.value) {
      const res = await axios.get('/dean/curriculum', { params: { program_id: curriculumProgram.value } })
      curriculum.value = res.data
    }
  } catch (err) {
    console.error('Failed to fetch curriculum:', err)
  }
}

const fetchPerformance = async () => {
  try {
    const res = await axios.get('/analytics/performance')
    performanceData.value = res.data
  } catch (err) {
    console.error('Failed to fetch performance:', err)
  }
}

const generateReport = async () => {
  reportLoading.value = true
  try {
    const res = await axios.get('/profiling/report', { params: reportFilters.value })
    reportData.value = res.data
  } catch (err) {
    console.error('Failed to generate report:', err)
  } finally {
    reportLoading.value = false
  }
}

const resetReportFilters = () => {
  reportFilters.value = { skill_name: '', award_name: '', academic_activity: '', year_level: '' }
  reportData.value = []
}

const approveAward = (id) => {
  pendingApprovals.value = pendingApprovals.value.filter(a => a.id !== id)
  summaryData.value.pendingApprovals--
}

const rejectAward = (id) => {
  pendingApprovals.value = pendingApprovals.value.filter(a => a.id !== id)
  summaryData.value.pendingApprovals--
}

// Modals (simplified - would open modal dialogs)
const showAddCurriculum = ref(false)
const showAddCourse = ref(false)

// Watch for curriculum program change
watch(curriculumProgram, () => {
  fetchCurriculum()
})

// Fetch all dean data on mount
onMounted(async () => {
  if (authStore.isDean) {
    await Promise.all([
      fetchSummary(),
      fetchFaculty(),
      fetchStudents(),
      fetchViolations(),
      fetchCourses()
    ])
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

/* ===== HERO ===== */
.hero-banner { background: linear-gradient(130deg, #1a0a00 0%, #3d1500 55%, #FF6B1A 130%); border-radius: 20px; padding: 28px 32px; position: relative; overflow: hidden; margin-bottom: 20px; }
.profile-warning-banner { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 20px; }
.warning-content { display: flex; align-items: center; gap: 16px; }
.warning-icon { width: 32px; height: 32px; color: #FF6B1A; }
.warning-text h4 { color: #fff; font-family: 'Syne', sans-serif; font-size: 16px; margin-bottom: 2px; }
.warning-text p { color: rgba(255,255,255,0.6); font-size: 13px; }
.complete-btn { background: #fff; color: #1a0a00; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; transition: all 0.2s; white-space: nowrap; }
.complete-btn:hover { background: #FF6B1A; color: #fff; }
.hero-bg-shape { position: absolute; border-radius: 50%; pointer-events: none; }
.shape-1 { width: 320px; height: 320px; background: rgba(255,107,26,0.15); top: -100px; right: -80px; filter: blur(60px); }
.shape-2 { width: 200px; height: 200px; background: rgba(255,255,255,0.05); bottom: -60px; left: 40%; filter: blur(40px); }
.hero-body { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hero-eyebrow { display: flex; align-items: center; gap: 7px; font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.eyebrow-dot { width: 6px; height: 6px; background: #FF6B1A; border-radius: 50%; box-shadow: 0 0 8px #FF6B1A; }
.hero-greeting { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 8px; }
.hero-desc { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.6; max-width: 400px; margin-bottom: 20px; }
.hero-desc strong { color: rgba(255,255,255,0.85); font-weight: 500; }
.hero-actions { display: flex; gap: 10px; }
.hero-btn-primary { display: flex; align-items: center; gap: 8px; background: #FF6B1A; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 16px rgba(255,107,26,0.4); text-decoration: none; }
.hero-btn-primary:hover { background: #e85500; transform: translateY(-1px); }
.hero-btn-badge { background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 6px; font-size: 11px; }
.hero-btn-ghost { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; backdrop-filter: blur(8px); text-decoration: none; }
.hero-btn-ghost:hover { background: rgba(255,255,255,0.18); }
.hero-right { display: flex; gap: 12px; flex-shrink: 0; }
.hero-stat-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 16px 20px; display: flex; flex-direction: column; gap: 2px; backdrop-filter: blur(8px); min-width: 100px; }
.hero-stat-card.accent { background: rgba(255,107,26,0.2); border-color: rgba(255,107,26,0.3); }
.hsc-label { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.6px; }
.hsc-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; line-height: 1; margin-top: 4px; }
.hsc-sub { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* ===== STATS ===== */
.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-top: 20px; }
.stat-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 18px 18px 14px; transition: all 0.2s; }
.stat-card.clickable { cursor: pointer; }
.stat-card.clickable:hover { border-color: #FF6B1A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,26,0.1); }
.stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.stat-label { font-size: 10px; font-weight: 600; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; line-height: 1.4; max-width: 80px; }
.stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon svg { width: 16px; height: 16px; }
.stat-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 4px; margin-bottom: 12px; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #1a0a00; line-height: 1; }
.stat-delta { font-size: 10px; font-weight: 500; color: #9a8070; }
.stat-delta.positive { color: #10b981; }
.stat-delta.negative { color: #ef4444; }
.stat-delta.warning { color: #f59e0b; }
.stat-bar { height: 4px; background: #f0e8e0; border-radius: 2px; overflow: hidden; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

/* ===== DEAN TABS ===== */
.dean-tabs-container { margin-top: 24px; }

.tabs-nav { display: flex; gap: 4px; background: #fff; padding: 6px; border-radius: 14px; border: 1px solid #f0e8e0; margin-bottom: 20px; overflow-x: auto; }
.tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: none; background: transparent; border-radius: 10px; font-size: 13px; font-weight: 500; color: #9a8070; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.tab-btn:hover { background: #faf8f6; color: #1a0a00; }
.tab-btn.active { background: #FF6B1A; color: #fff; }
.tab-icon { display: flex; align-items: center; }
.tab-icon svg { width: 16px; height: 16px; }

.tab-content { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; padding: 24px; }
.tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.tab-header h3 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #1a0a00; }
.tab-actions { display: flex; gap: 10px; align-items: center; }
.tab-search { padding: 10px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; min-width: 180px; }
.tab-search:focus { border-color: #FF6B1A; }
.tab-select { padding: 10px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; background: #fff; cursor: pointer; }
.tab-btn-action { padding: 10px 18px; background: #FF6B1A; color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }

/* Faculty Grid */
.faculty-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.faculty-card { border: 1.5px solid #f0e8e0; border-radius: 14px; padding: 16px; transition: all 0.2s; }
.faculty-card:hover { border-color: #FF6B1A; transform: translateY(-2px); }
.faculty-card-header { display: flex; gap: 12px; margin-bottom: 12px; }
.faculty-avatar { width: 48px; height: 48px; background: #FF6B1A; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.faculty-info h4 { font-size: 14px; font-weight: 600; color: #1a0a00; }
.faculty-info p { font-size: 12px; color: #9a8070; }
.faculty-status { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 6px; margin-top: 4px; }
.faculty-status.normal { background: #f0fdf4; color: #16a34a; }
.faculty-status.overloaded { background: #fff1f2; color: #ef4444; }
.faculty-load-bar { margin-bottom: 12px; }
.load-bar-track { height: 6px; background: #f0e8e0; border-radius: 3px; overflow: hidden; }
.load-bar-fill { height: 100%; background: #FF6B1A; border-radius: 3px; transition: width 0.3s; }
.faculty-subjects { display: flex; flex-wrap: wrap; gap: 6px; }
.subject-tag { background: #1a0a00; color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 6px; }

/* Table Styles */
.table-card { border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 14px 16px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; text-align: left; border-bottom: 1px solid #f0e8e0; }
.data-table td { padding: 14px 16px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover { background: #fffaf8; }
.student-id { font-weight: 600; color: #64748b; font-size: 12px; }
.violation-count { font-weight: 700; color: #10b981; }
.violation-count.has-violations { color: #ef4444; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.cell-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }

.status-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
.st-good { background: #ecfeff; color: #0891b2; }
.st-monitor { background: #fff7ed; color: #ea580c; }
.st-resolved { background: #fff; color: #1a0a00; border: 1px solid #f0e8e0; }
.st-warned { background: #1a0a00; color: #fff; }
.st-review { background: #FF6B1A; color: #fff; }

.severity-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
.sev-major { background: #ef4444; color: #fff; }
.sev-moderate { background: #f59e0b; color: #fff; }
.sev-minor { background: #fff; color: #1a0a00; border: 1px solid #f0e8e0; }

.review-btn { background: #1a0a00; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; }
.review-btn:hover { background: #FF6B1A; }

.code-badge { background: #fff1e6; color: #FF6B1A; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; }
.type-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
.type-badge.lec { background: #eff6ff; color: #3b82f6; }
.type-badge.lab { background: #f5f3ff; color: #8b5cf6; }
.type-badge.lec\+lab { background: #fff7ed; color: #f59e0b; }

/* Summary Tags */
.summary-tags { display: flex; gap: 8px; }
.summary-tag { font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 8px; }
.summary-tag.major { background: #ef4444; color: #fff; }
.summary-tag.moderate { background: #1a0a00; color: #fff; }
.summary-tag.minor { background: #fff; color: #1a0a00; border: 1px solid #f0e8e0; }

/* Performance Grid */
.performance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.perf-card { background: #faf8f6; border-radius: 14px; padding: 20px; }
.perf-card .card-header { margin-bottom: 16px; }
.perf-card h4 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1a0a00; }
.perf-card p { font-size: 11px; color: #9a8070; margin-top: 2px; }

.dist-list { display: flex; flex-direction: column; gap: 14px; }
.dist-row { display: flex; flex-direction: column; gap: 6px; }
.dist-label { display: flex; gap: 6px; }
.dist-label .range { font-size: 12px; font-weight: 700; color: #1a0a00; }
.dist-label .desc { font-size: 11px; color: #9a8070; }
.dist-bar-wrap { display: flex; align-items: center; gap: 10px; }
.dist-bar { flex: 1; height: 8px; background: #f0e8e0; border-radius: 4px; overflow: hidden; }
.dist-fill { height: 100%; border-radius: 4px; }
.dist-stats { font-size: 11px; color: #9a8070; min-width: 70px; text-align: right; }

.trend-chart { height: 160px; margin-bottom: 16px; }
.trend-chart .chart-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 100%; padding: 10px 0; }
.trend-chart .chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.trend-chart .bar-wrap { flex: 1; width: 30px; display: flex; align-items: flex-end; }
.trend-chart .bar-fill { width: 100%; background: #FF6B1A; border-radius: 4px 4px 0 0; }
.trend-chart .bar-label { font-size: 9px; color: #9a8070; text-transform: uppercase; }

.trend-stats { display: flex; justify-content: space-between; background: #fff; padding: 12px 16px; border-radius: 10px; }
.trend-stat { display: flex; flex-direction: column; gap: 2px; }
.ts-label { font-size: 10px; color: #9a8070; text-transform: uppercase; }
.ts-value { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; }

/* Curriculum */
.curriculum-container { display: flex; flex-direction: column; gap: 24px; }
.year-section { display: flex; flex-direction: column; gap: 12px; }
.year-header h4 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; border-left: 3px solid #FF6B1A; padding-left: 10px; }
.semester-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.sem-card { border: 1px solid #f0e8e0; border-radius: 12px; overflow: hidden; }
.sem-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fffaf8; border-bottom: 1px solid #f0e8e0; }
.sem-header h5 { font-size: 13px; font-weight: 600; color: #1a0a00; }
.course-count { font-size: 10px; color: #9a8070; background: #f0e8e0; padding: 2px 8px; border-radius: 6px; }
.sem-table { width: 100%; }
.sem-table td { padding: 10px 16px; font-size: 12px; }
.sem-table .code { font-weight: 700; color: #FF6B1A; width: 80px; }
.sem-table .units { width: 50px; text-align: center; }

/* Reports */
.filter-card { background: #faf8f6; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
.filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 11px; font-weight: 600; color: #9a8070; text-transform: uppercase; }
.form-group input, .form-group select { padding: 10px 12px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; }
.filter-actions { display: flex; gap: 10px; }
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }

.report-results { margin-top: 20px; }
.report-results h4 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1a0a00; margin-bottom: 12px; }
.tag-list { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 5px; }
.skill-tag { background: #eff6ff; color: #3b82f6; }
.award-tag { background: #fffbeb; color: #f59e0b; }

/* Approvals */
.approvals-grid { display: grid; gap: 12px; }
.approval-card { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #f0e8e0; border-radius: 14px; }
.approval-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.approval-icon svg { width: 20px; height: 20px; }
.approval-info { flex: 1; }
.approval-info h4 { font-size: 14px; font-weight: 600; color: #1a0a00; }
.approval-info p { font-size: 12px; color: #9a8070; }
.approval-meta { font-size: 10px; color: #9a8070; }
.approval-actions { display: flex; gap: 8px; }
.approve-btn { background: #10b981; color: #fff; border: none; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; }
.reject-btn { background: #fff; color: #ef4444; border: 1px solid #ef4444; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; }

.empty-state { padding: 40px; text-align: center; color: #9a8070; }

/* Bottom Grid (disabled) */
.bottom-grid { display: none; }

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
  .performance-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .tabs-nav { flex-wrap: nowrap; overflow-x: auto; }
  .tab-header { flex-direction: column; align-items: flex-start; }
  .tab-actions { width: 100%; flex-wrap: wrap; }
}
</style>
