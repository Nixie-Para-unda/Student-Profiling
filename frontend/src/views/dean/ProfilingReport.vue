<template>
  <div class="report-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">Profiling Report Engine</h2>
        <p class="page-sub">Generate qualified-student reports by filtering across multiple academic and extracurricular criteria.</p>
      </div>
      <div class="header-right" v-if="reportData.length > 0">
        <button class="export-btn" @click="exportToCSV">
          <svg viewBox="0 0 20 20" fill="none"><path d="M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1M9 2v9M6 8l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Export CSV
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-card pcard">
      <div class="pcard-header">
        <div class="header-with-icon">
          <svg viewBox="0 0 20 20" fill="none" class="header-icon"><path d="M3 5h14M5 10h10M8 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <h3>Report Configuration</h3>
        </div>
      </div>
      <div class="pcard-body">
        <div class="filter-grid">
          <!-- Academic Group -->
          <div class="filter-group-box">
            <p class="group-label">Academic Background</p>
            <div class="group-content">
              <div class="form-group">
                <label>Year Level</label>
                <select v-model="filters.year_level">
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div class="form-group">
                <label>GWA Range</label>
                <div class="dual-input">
                  <input v-model.number="filters.gwa_min" type="number" step="0.01" min="1.0" max="5.0" placeholder="Min" />
                  <span class="to-separator">to</span>
                  <input v-model.number="filters.gwa_max" type="number" step="0.01" min="1.0" max="5.0" placeholder="Max" />
                </div>
              </div>
            </div>
          </div>

          <!-- Skills & Awards Group -->
          <div class="filter-group-box">
            <p class="group-label">Skills & Achievements</p>
            <div class="group-content">
              <div class="form-group">
                <label>Skill Name / Category</label>
                <input v-model="filters.skill_name" type="text" placeholder="e.g. Java, Web Design" />
              </div>
              <div class="form-group">
                <label>Award Name</label>
                <input v-model="filters.award_name" type="text" placeholder="e.g. Dean's List" />
              </div>
            </div>
          </div>

          <!-- Extracurricular Group -->
          <div class="filter-group-box">
            <p class="group-label">Extracurricular</p>
            <div class="group-content">
              <div class="form-group">
                <label>Organization / Affiliation</label>
                <input v-model="filters.organization" type="text" placeholder="e.g. JPCS, CSC" />
              </div>
              <div class="form-group">
                <label>Activity Name</label>
                <input v-model="filters.academic_activity" type="text" placeholder="e.g. Hackathon" />
              </div>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button class="primary-btn" @click="generateReport" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            {{ loading ? 'Generating Report...' : 'Generate Report' }}
          </button>
          <button class="ghost-btn" @click="resetFilters">
            <svg viewBox="0 0 18 18" fill="none"><path d="M3 9a6 6 0 111.5 4M1 12h4v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="reportData.length > 0" class="report-results pcard">
      <div class="pcard-header results-header">
        <div class="header-with-icon">
          <svg viewBox="0 0 20 20" fill="none" class="header-icon success"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3-8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h3>Found {{ reportData.length }} Qualified Students</h3>
        </div>
      </div>
      <div class="pcard-body no-padding">
        <div class="table-container">
          <table class="report-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Program</th>
                <th>Year/Sec</th>
                <th class="text-center">GWA</th>
                <th>Matched Skills</th>
                <th>Relevant Awards</th>
                <th>Organizations</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in reportData" :key="student.id">
                <td class="name-cell">
                  <div class="student-name">{{ student.full_name }}</div>
                </td>
                <td><span class="program-badge">{{ student.program }}</span></td>
                <td>{{ student.year_level }}-{{ student.section }}</td>
                <td class="text-center">
                  <span class="gwa-badge" :class="getGwaClass(student.gwa)">{{ student.gwa }}</span>
                </td>
                <td>
                  <div class="tag-list">
                    <span v-for="skill in student.matched_skills" :key="skill" class="tag skill-tag">{{ skill }}</span>
                    <span v-if="!student.matched_skills.length" class="empty-tag">—</span>
                  </div>
                </td>
                <td>
                  <div class="tag-list">
                    <span v-for="award in student.relevant_awards" :key="award" class="tag award-tag">{{ award }}</span>
                    <span v-if="!student.relevant_awards.length" class="empty-tag">—</span>
                  </div>
                </td>
                <td>
                  <div class="tag-list">
                    <span v-for="org in student.org_memberships" :key="org" class="tag org-tag">{{ org }}</span>
                    <span v-if="!student.org_memberships.length" class="empty-tag">—</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty/Initial State -->
    <div v-else-if="!loading && hasSearched" class="empty-results-card pcard">
      <div class="empty-state-content">
        <div class="empty-icon">
          <svg viewBox="0 0 48 48" fill="none"><path d="M24 12v12M24 32h.01M44 24c0 11.046-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4s20 8.954 20 20z" stroke="#FF6B1A" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <h4>No Matches Found</h4>
        <p>Try adjusting your filters to find a broader range of students.</p>
        <button class="ghost-btn" @click="resetFilters">Clear All Filters</button>
      </div>
    </div>

    <div v-else-if="!loading && !hasSearched" class="initial-state">
      <div class="welcome-box">
        <div class="welcome-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#9a8070" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <h3>Ready to Profile?</h3>
        <p>Select criteria above and click "Generate Report" to find students matching specific profiles.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const loading = ref(false)
const hasSearched = ref(false)
const reportData = ref([])

const filters = ref({
  skill_name: '',
  award_name: '',
  academic_activity: '',
  organization: '',
  year_level: '',
  gwa_min: null,
  gwa_max: null
})

const generateReport = async () => {
  loading.value = true
  hasSearched.value = true
  try {
    const response = await axios.get('/profiling/report', { params: filters.value })
    reportData.value = response.data
  } catch (err) {
    console.error('Failed to generate report:', err)
    alert('Error generating report.')
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    skill_name: '',
    award_name: '',
    academic_activity: '',
    organization: '',
    year_level: '',
    gwa_min: null,
    gwa_max: null
  }
  reportData.value = []
  hasSearched.value = false
}

const getGwaClass = (gwa) => {
  if (gwa === 'N/A') return ''
  const val = parseFloat(gwa)
  if (val <= 1.5) return 'gwa-excellent'
  if (val <= 2.0) return 'gwa-good'
  if (val <= 3.0) return 'gwa-fair'
  return 'gwa-poor'
}

const exportToCSV = () => {
  if (!reportData.value.length) return

  const headers = ['Full Name', 'Program', 'Year', 'Section', 'GWA', 'Skills', 'Awards', 'Organizations']
  const rows = reportData.value.map(s => [
    s.full_name,
    s.program,
    s.year_level,
    s.section,
    s.gwa,
    s.matched_skills.join('; '),
    s.relevant_awards.join('; '),
    s.org_memberships.join('; ')
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(field => `"${field}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `profiling_report_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.report-page { display: flex; flex-direction: column; gap: 24px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #1a0a00; }
.page-sub { font-size: 14px; color: #b89f90; margin-top: 4px; max-width: 600px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(26, 10, 0, 0.03); }
.pcard-header { padding: 18px 24px; border-bottom: 1px solid #faf8f6; background: #fffaf8; }
.header-with-icon { display: flex; align-items: center; gap: 10px; }
.header-icon { width: 20px; height: 20px; color: #FF6B1A; }
.header-icon.success { color: #16a34a; }
.pcard-header h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.pcard-body { padding: 24px; }
.pcard-body.no-padding { padding: 0; }

/* Filters */
.filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px; }
.filter-group-box { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #faf8f6; border-radius: 16px; border: 1px solid #f5f0ec; }
.group-label { font-size: 11px; font-weight: 800; color: #9a8070; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
.group-content { display: flex; flex-direction: column; gap: 14px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 600; color: #4a3020; }
.form-group input, .form-group select { padding: 10px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; outline: none; background: #fff; transition: all 0.2s; color: #1a0a00; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.08); }

.dual-input { display: flex; align-items: center; gap: 10px; }
.dual-input input { width: 100%; }
.to-separator { font-size: 11px; font-weight: 700; color: #b89f90; text-transform: uppercase; }

.filter-actions { display: flex; gap: 12px; padding-top: 12px; border-top: 1px solid #f5f0ec; }

/* Buttons */
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 12px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.primary-btn:hover:not(:disabled) { background: #e85500; transform: translateY(-1px); }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.ghost-btn svg { width: 16px; height: 16px; }

.export-btn { background: #16a34a; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.export-btn:hover { background: #15803d; }
.export-btn svg { width: 16px; height: 16px; }

/* Table */
.table-container { overflow-x: auto; }
.report-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.report-table th { text-align: left; padding: 16px 20px; background: #faf8f6; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.8px; border-bottom: 2px solid #f0e8e0; }
.report-table td { padding: 16px 20px; border-bottom: 1px solid #faf8f6; color: #1a0a00; vertical-align: middle; }
.report-table tr:hover td { background: #fffaf8; }

.name-cell { font-weight: 700; color: #1a0a00; }
.program-badge { background: #f0f4ff; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.text-center { text-align: center; }

.gwa-badge { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; padding: 4px 12px; border-radius: 8px; }
.gwa-excellent { background: #f0fdf4; color: #16a34a; }
.gwa-good { background: #eff6ff; color: #3b82f6; }
.gwa-fair { background: #fffbeb; color: #d97706; }
.gwa-poor { background: #fef2f2; color: #ef4444; }

.tag-list { display: flex; flex-wrap: wrap; gap: 6px; max-width: 300px; }
.tag { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px; white-space: nowrap; }
.skill-tag { background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
.award-tag { background: #fffbeb; color: #f59e0b; border: 1px solid #fef3c7; }
.org-tag { background: #f5f3ff; color: #8b5cf6; border: 1px solid #ede9fe; }
.empty-tag { color: #c0b0a5; font-size: 12px; }

/* States */
.empty-results-card { padding: 60px 24px; display: flex; justify-content: center; align-items: center; }
.empty-state-content { text-align: center; max-width: 400px; }
.empty-icon { width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.5; }
.empty-state-content h4 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #1a0a00; margin-bottom: 10px; }
.empty-state-content p { color: #9a8070; margin-bottom: 24px; font-size: 14px; }
.empty-state-content .ghost-btn { margin: 0 auto; }

.initial-state { padding: 80px 24px; text-align: center; }
.welcome-box { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.welcome-icon { width: 48px; height: 48px; background: #fffaf8; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #f0e8e0; }
.welcome-box h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #1a0a00; }
.welcome-box p { color: #9a8070; line-height: 1.6; }

.spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
