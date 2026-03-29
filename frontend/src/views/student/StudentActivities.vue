<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Non-Academic Activities</h2><p class="page-sub">Extracurriculars, events, seminars, and competitions.</p></div>
      <button class="primary-btn" @click="showForm = !showForm">+ Log Activity</button>
    </div>
    <div v-if="showForm" class="pcard">
      <div class="pcard-header"><h3>Log New Activity</h3></div>
      <div class="pcard-body">
        <div class="form-grid">
          <div class="form-group"><label>Activity Title</label><input v-model="form.title" type="text" placeholder="e.g. JS Summit 2026" /></div>
          <div class="form-group"><label>Organization / Host</label><input v-model="form.org" type="text" placeholder="e.g. GDSC Campus" /></div>
          <div class="form-group"><label>Date</label><input v-model="form.date" type="text" placeholder="e.g. March 2026" /></div>
          <div class="form-group"><label>Type</label>
            <select v-model="form.type"><option>Competition</option><option>Seminar</option><option>Community</option><option>Workshop</option><option>Sports</option><option>Other</option></select>
          </div>
        </div>
        <div class="form-actions">
          <button class="primary-btn" @click="addActivity">Save</button>
          <button class="ghost-btn" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>
    <div class="activities-grid">
      <div class="activity-card" v-for="act in activities" :key="act.title">
        <div class="act-top">
          <div class="act-icon-wrap" :style="{ background: typeColor(act.type) + '18' }">
            <svg viewBox="0 0 20 20" fill="none" :style="{ color: typeColor(act.type) }" v-html="typeIcon(act.type)"></svg>
          </div>
          <span class="act-badge" :style="{ background: typeColor(act.type) + '18', color: typeColor(act.type) }">{{ act.type }}</span>
        </div>
        <p class="act-title">{{ act.title }}</p>
        <p class="act-org">{{ act.org }}</p>
        <p class="act-date">{{ act.date }}</p>
      </div>
      <div v-if="activities.length === 0" class="empty-state">No activities logged yet.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showForm = ref(false)
const form = ref({ title: '', org: '', date: '', type: 'Seminar' })
const activities = ref([
  { title: 'ICPEP.SE Hackathon', org: 'ICPEP.SE', date: 'March 2026', type: 'Competition' },
  { title: 'Annual JS Summit 2026', org: 'GDSC Campus', date: 'February 2026', type: 'Seminar' },
  { title: 'Campus Clean Drive', org: 'BLGF Campus', date: 'January 2026', type: 'Community' }
])
const typeColor = (t) => ({ Competition: '#FF6B1A', Seminar: '#3b82f6', Community: '#10b981', Workshop: '#8b5cf6', Sports: '#f59e0b', Other: '#6b7280' }[t] || '#6b7280')
const typeIcon = (t) => {
  const icons = {
    Competition: '<path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    Seminar: '<rect x="3" y="3" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M8 17h4M10 14v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    Community: '<circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    default: '<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/>'
  }
  return icons[t] || icons.default
}
const addActivity = () => {
  if (!form.value.title) return
  activities.value.unshift({ ...form.value })
  form.value = { title: '', org: '', date: '', type: 'Seminar' }
  showForm.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; margin-bottom: 0; }
.pcard-header { padding: 18px 22px; border-bottom: 1px solid #faf8f6; }
.pcard-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.pcard-body { padding: 22px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.form-actions { display: flex; gap: 10px; }
.activities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.activity-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 8px; transition: all 0.2s; }
.activity-card:hover { border-color: #FF6B1A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,26,0.08); }
.act-top { display: flex; align-items: center; justify-content: space-between; }
.act-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.act-icon-wrap svg { width: 18px; height: 18px; }
.act-badge { font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
.act-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.act-org { font-size: 12px; color: #b89f90; }
.act-date { font-size: 11px; color: #c0b0a5; }
.empty-state { grid-column: span 3; text-align: center; padding: 60px; color: #b89f90; font-size: 13px; font-style: italic; }
@media (max-width: 900px) { .activities-grid { grid-template-columns: 1fr 1fr; } }
</style>