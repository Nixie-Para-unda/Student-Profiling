<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">My Subjects</h2>
        <p class="page-sub">Manage your assigned courses and view class details for the current semester.</p>
      </div>
    </div>

    <div class="mini-stats">
      <div class="mini-stat stat-orange">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ subjects.length }}</span>
          <span class="stat-label">Total Subjects</span>
        </div>
      </div>
      <div class="mini-stat stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ totalStudents }}</span>
          <span class="stat-label">Total Students</span>
        </div>
      </div>
    </div>

    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search by subject code or name..." />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      Loading your subjects...
    </div>
    
    <div v-else class="subjects-grid">
      <div v-for="subj in filteredSubjects" :key="subj.id" class="subject-card">
        <div class="subj-header">
          <div class="subj-code">{{ subj.code }}</div>
          <span class="subj-section">{{ subj.section }}</span>
        </div>
        <div class="subj-body">
          <h3 class="subj-name">{{ subj.name }}</h3>
          <div class="subj-details">
            <div class="detail-item">
              <span class="detail-icon">🕒</span>
              <span>{{ subj.schedule_time || 'TBA' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span>{{ subj.room || 'TBA' }}</span>
            </div>
          </div>
        </div>
        <div class="subj-footer">
          <div class="enrolled-count">
            <strong>{{ subj.enrolled_students || 0 }}</strong> students enrolled
          </div>
          <router-link :to="{ path: '/faculty/students', query: { subject: subj.id } }" class="view-btn">View Class →</router-link>
        </div>
      </div>
      
      <div v-if="filteredSubjects.length === 0" class="empty-state">
        <p>No subjects found matching "{{ searchQuery }}".</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const subjects = ref([])
const loading = ref(true)
const searchQuery = ref('')

const fetchSubjects = async () => {
  loading.value = true
  try {
    // Calling your existing backend endpoint for faculty analytics/subjects
    const response = await axios.get('/analytics/faculty')
    // Assuming the backend returns the subjects array inside the response
    subjects.value = response.data.subjects || []
  } catch (err) {
    console.error('Failed to fetch subjects:', err)
  } finally {
    loading.value = false
  }
}

const totalStudents = computed(() => {
  return subjects.value.reduce((total, subj) => total + (subj.enrolled_students || subj.enrolled || 0), 0)
})

const filteredSubjects = computed(() => {
  if (!searchQuery.value) return subjects.value
  const query = searchQuery.value.toLowerCase()
  return subjects.value.filter(s => 
    s.code.toLowerCase().includes(query) || 
    s.name.toLowerCase().includes(query)
  )
})

onMounted(fetchSubjects)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* ── Stats ── */
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-top: 3px solid; border-radius: 14px; padding: 16px 20px; flex: 1; display: flex; align-items: center; gap: 14px; max-width: 300px; }
.stat-icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon svg { width: 18px; height: 18px; }
.stat-text { display: flex; flex-direction: column; gap: 3px; }
.stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
.stat-label { font-size: 10px; font-weight: 600; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; }

.stat-orange { border-top-color: #FF6B1A; }
.stat-orange .stat-icon { background: #fff5ef; }
.stat-orange .stat-icon svg { color: #FF6B1A; }
.stat-orange .stat-value { color: #FF6B1A; }

.stat-blue { border-top-color: #3b82f6; }
.stat-blue .stat-icon { background: #eff6ff; }
.stat-blue .stat-icon svg { color: #3b82f6; }
.stat-blue .stat-value { color: #3b82f6; }

/* ── Toolbar ── */
.table-toolbar { display: flex; gap: 12px; align-items: center; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; max-width: 400px; transition: all 0.2s; }
.search-wrap:focus-within { border-color: #FF6B1A; }
.search-wrap svg { width: 15px; height: 15px; color: #c0b0a5; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; width: 100%; background: none; }

/* ── Grid ── */
.subjects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.subject-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.subject-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: #ffd5b0; }

.subj-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #faf8f6; background: #fffcfaf0; }
.subj-code { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #FF6B1A; }
.subj-section { font-size: 11px; font-weight: 700; color: #9a8070; background: #f0e8e040; padding: 4px 8px; border-radius: 6px; }

.subj-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
.subj-name { font-size: 15px; font-weight: 600; color: #1a0a00; line-height: 1.4; margin: 0; }
.subj-details { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }
.detail-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #b89f90; }

.subj-footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #faf8f6; border-top: 1px solid #f0e8e0; }
.enrolled-count { font-size: 12px; color: #9a8070; }
.enrolled-count strong { color: #1a0a00; font-weight: 700; }
.view-btn { font-size: 12px; font-weight: 700; color: #FF6B1A; text-decoration: none; transition: color 0.2s; }
.view-btn:hover { color: #e85500; }

.loading-state { padding: 60px; text-align: center; color: #b89f90; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.spinner { width: 24px; height: 24px; border: 3px solid #f0e8e0; border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
.empty-state { grid-column: 1 / -1; padding: 60px; text-align: center; color: #b89f90; font-style: italic; background: #fff; border: 1px dashed #f0e8e0; border-radius: 16px; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>