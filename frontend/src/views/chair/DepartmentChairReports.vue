<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Generate Reports</h2><p class="page-sub">Generate and export department-wide reports.</p></div>
    </div>
    <div class="reports-grid">
      <div class="report-card" v-for="r in reportTypes" :key="r.id" @click="selected = r" :class="{ selected: selected?.id === r.id }">
        <div class="report-icon" :style="{ background: r.color + '18', color: r.color }"><svg viewBox="0 0 20 20" fill="none" v-html="r.icon"></svg></div>
        <div class="report-info"><p class="report-title">{{ r.title }}</p><p class="report-desc">{{ r.desc }}</p></div>
        <svg v-if="selected?.id === r.id" viewBox="0 0 16 16" fill="none" style="width:18px;height:18px;flex-shrink:0"><circle cx="8" cy="8" r="6" fill="#FF6B1A"/><path d="M5 8l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else viewBox="0 0 16 16" fill="none" style="width:18px;height:18px;flex-shrink:0"><circle cx="8" cy="8" r="6" stroke="#f0e8e0" stroke-width="1.5"/></svg>
      </div>
    </div>
    <div v-if="selected" class="options-card">
      <div class="options-header"><h3>Configure: {{ selected.title }}</h3></div>
      <div class="options-body">
        <div class="form-grid">
          <div class="form-group"><label>Academic Year</label><select v-model="cfg.ay"><option>2026-2027</option><option>2025-2026</option><option>2024-2025</option></select></div>
          <div class="form-group"><label>Semester</label><select v-model="cfg.sem"><option value="1st">1st Semester</option><option value="2nd">2nd Semester</option><option value="both">Both</option></select></div>
          <div class="form-group"><label>Program</label><select v-model="cfg.course"><option value="all">All Programs</option><option>BSCS</option><option>BSIT</option><option>BSIS</option></select></div>
          <div class="form-group"><label>Export Format</label><select v-model="cfg.format"><option value="pdf">PDF</option><option value="excel">Excel (.xlsx)</option><option value="csv">CSV</option></select></div>
        </div>
        <div class="options-actions">
          <button class="ghost-btn" @click="selected = null">Cancel</button>
          <button class="primary-btn" @click="generate" :disabled="generating">
            <span v-if="generating" class="spinner-sm"></span>
            <svg v-else viewBox="0 0 18 18" fill="none"><path d="M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1M9 10V2M6 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ generating ? 'Generating...' : 'Generate & Download' }}
          </button>
        </div>
      </div>
    </div>
    <div class="section-title-row"><h3 class="section-title">Recent Reports</h3></div>
    <div class="recent-list">
      <div class="recent-row" v-for="r in recent" :key="r.id">
        <div class="rr-icon" :style="{ background: r.color + '18', color: r.color }"><svg viewBox="0 0 18 18" fill="none"><path d="M4 2h7l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.4"/><path d="M11 2v4h4M5 8h8M5 11h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></div>
        <div class="rr-info"><p class="rr-title">{{ r.title }}</p><p class="rr-meta">{{ r.date }} · {{ r.format.toUpperCase() }}</p></div>
        <span class="rr-badge" :style="{ background: r.color + '18', color: r.color }">{{ r.type }}</span>
        <button class="dl-btn"><svg viewBox="0 0 16 16" fill="none"><path d="M4 12v1a1 1 0 001 1h6a1 1 0 001-1v-1M8 9V3M5 7l3 2 3-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Download</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const selected = ref(null)
const generating = ref(false)
const cfg = ref({ ay: '2026-2027', sem: '2nd', course: 'all', format: 'pdf' })
const reportTypes = [
  { id:'students', title:'Student Enrollment Report', desc:'Complete enrolled student list', color:'#FF6B1A', icon:'<path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id:'faculty', title:'Faculty Workload Report', desc:'Faculty subject loads and schedules', color:'#3b82f6', icon:'<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id:'performance', title:'Academic Performance Report', desc:'GWA averages and Dean\'s List', color:'#8b5cf6', icon:'<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { id:'violations', title:'Violations Summary Report', desc:'Student disciplinary cases', color:'#ef4444', icon:'<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { id:'awards', title:'Awards & Recognition Report', desc:'Approved student awards', color:'#f59e0b', icon:'<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { id:'dept', title:'Department Overview Report', desc:'Comprehensive department stats', color:'#10b981', icon:'<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
]
const recent = ref([
  { id:1, title:'Student Enrollment Report — 2nd Sem 2025–2026', date:'Mar 15, 2026', format:'pdf', type:'Enrollment', color:'#FF6B1A' },
  { id:2, title:'Academic Performance Report — 1st Sem 2025–2026', date:'Feb 28, 2026', format:'pdf', type:'Performance', color:'#8b5cf6' },
  { id:3, title:'Violations Summary — 2nd Sem 2025–2026', date:'Mar 10, 2026', format:'excel', type:'Violations', color:'#ef4444' },
])
const generate = async () => {
  generating.value = true
  await new Promise(r => setTimeout(r, 1500))
  recent.value.unshift({ id: Date.now(), title: `${selected.value.title} — ${cfg.value.sem} Sem ${cfg.value.ay}`, date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }), format: cfg.value.format, type: selected.value.title.split(' ')[0], color: selected.value.color })
  alert(`${selected.value.title} generated! Backend integration pending.`)
  selected.value = null
  generating.value = false
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page{display:flex;flex-direction:column;gap:20px;font-family:'Outfit',sans-serif}.page-header{display:flex;justify-content:space-between;align-items:flex-end}.page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:700;color:#1a0a00}.page-sub{font-size:13px;color:#b89f90;margin-top:4px}.reports-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.report-card{background:#fff;border:1.5px solid #f0e8e0;border-radius:16px;padding:18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s}.report-card:hover{border-color:#FF6B1A;background:#fffaf8}.report-card.selected{border-color:#FF6B1A;background:#fffaf8;box-shadow:0 0 0 3px rgba(255,107,26,.1)}.report-icon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.report-icon svg{width:20px;height:20px}.report-info{flex:1;min-width:0}.report-title{font-size:13px;font-weight:600;color:#1a0a00}.report-desc{font-size:11px;color:#b89f90;margin-top:3px}.options-card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;overflow:hidden}.options-header{padding:18px 22px;border-bottom:1px solid #faf8f6}.options-header h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;color:#1a0a00}.options-body{padding:22px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}.form-group{display:flex;flex-direction:column;gap:7px}.form-group label{font-size:11px;font-weight:700;color:#9a8070;text-transform:uppercase;letter-spacing:.5px}.form-group select{padding:11px 14px;border:1.5px solid #f0e8e0;border-radius:11px;font-size:13px;outline:none;font-family:'Outfit',sans-serif;background:#faf8f6;color:#1a0a00;transition:all .2s}.form-group select:focus{border-color:#FF6B1A;background:#fff}.options-actions{display:flex;justify-content:flex-end;gap:10px}.primary-btn{display:flex;align-items:center;gap:7px;background:#FF6B1A;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s}.primary-btn:hover:not(:disabled){background:#e85500}.primary-btn:disabled{opacity:.7;cursor:not-allowed}.primary-btn svg{width:15px;height:15px}.ghost-btn{display:flex;align-items:center;gap:7px;background:#fff;color:#1a0a00;border:1.5px solid #f0e8e0;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif}.section-title-row{display:flex;align-items:center;justify-content:space-between}.section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:700;color:#1a0a00}.recent-list{display:flex;flex-direction:column;gap:10px}.recent-row{background:#fff;border:1px solid #f0e8e0;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:14px;transition:all .15s}.recent-row:hover{border-color:#FF6B1A;background:#fffaf8}.rr-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.rr-icon svg{width:18px;height:18px}.rr-info{flex:1;min-width:0}.rr-title{font-size:13px;font-weight:600;color:#1a0a00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rr-meta{font-size:11px;color:#b89f90;margin-top:2px}.rr-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;white-space:nowrap}.dl-btn{display:flex;align-items:center;gap:6px;background:#faf8f6;border:1.5px solid #f0e8e0;color:#9a8070;border-radius:9px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;white-space:nowrap}.dl-btn:hover{border-color:#FF6B1A;color:#FF6B1A;background:#fff5ef}.dl-btn svg{width:13px;height:13px}.spinner-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>