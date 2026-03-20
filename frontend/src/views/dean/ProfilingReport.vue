<template>
  <div class="report-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Profiling Report Engine</h2>
        <p class="page-sub">Generate qualified-student reports by filtering across multiple criteria.</p>
      </div>
    </div>

    <div class="filter-card pcard">
      <div class="pcard-body">
        <div class="filter-grid">
          <div class="form-group">
            <label>Skill Name / Category</label>
            <input v-model="filters.skill_name" type="text" placeholder="e.g. Java, Web Design" />
          </div>
          <div class="form-group">
            <label>Award Name</label>
            <input v-model="filters.award_name" type="text" placeholder="e.g. Dean's List" />
          </div>
          <div class="form-group">
            <label>Activity Name</label>
            <input v-model="filters.academic_activity" type="text" placeholder="e.g. Hackathon" />
          </div>
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
        </div>
        <div class="filter-actions">
          <button class="primary-btn" @click="generateReport" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            {{ loading ? 'Generating...' : 'Generate Report' }}
          </button>
          <button class="ghost-btn" @click="resetFilters">Reset</button>
        </div>
      </div>
    </div>

    <div v-if="reportData.length > 0" class="report-results pcard">
      <div class="pcard-header">
        <h3>Found {{ reportData.length }} Qualified Students</h3>
      </div>
      <div class="pcard-body">
        <div class="table-container">
          <table class="report-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Program</th>
                <th>Year/Section</th>
                <th>Matched Skills</th>
                <th>Relevant Awards</th>
                <th>Organizations</th>
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
                <td>
                  <div class="tag-list">
                    <span v-for="org in student.org_memberships" :key="org" class="tag org-tag">{{ org }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else-if="!loading && hasSearched" class="empty-results">
      No students matched the selected criteria.
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
  year_level: ''
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
    year_level: ''
  }
  reportData.value = []
  hasSearched.value = false
}
</script>

<style scoped>
.report-page { display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-header { padding: 18px 22px; border-bottom: 1px solid #faf8f6; background: #fffaf8; }
.pcard-header h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.pcard-body { padding: 22px; }

.filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'DM Sans', sans-serif; background: #faf8f6; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; background: #fff; }

.filter-actions { display: flex; gap: 12px; }
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }

.report-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.report-table th { text-align: left; padding: 12px; color: #9a8070; font-weight: 700; text-transform: uppercase; font-size: 11px; border-bottom: 2px solid #faf8f6; }
.report-table td { padding: 14px 12px; border-bottom: 1px solid #faf8f6; color: #1a0a00; }

.tag-list { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 6px; }
.skill-tag { background: #eff6ff; color: #3b82f6; }
.award-tag { background: #fffbeb; color: #f59e0b; }
.org-tag { background: #f5f3ff; color: #8b5cf6; }

.empty-results { text-align: center; padding: 60px; color: #b89f90; font-style: italic; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; margin-right: 8px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
