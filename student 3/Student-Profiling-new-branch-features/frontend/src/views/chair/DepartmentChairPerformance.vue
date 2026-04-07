<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Academic Performance</h2><p class="page-sub">Department-wide GWA trends and academic history review.</p></div>
    </div>
    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card" v-for="s in summary" :key="s.label">
        <span class="s-label">{{ s.label }}</span>
        <span class="s-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="s-sub">{{ s.sub }}</span>
      </div>
    </div>
    <!-- Chart -->
    <div class="pcard">
      <div class="pcard-header"><svg viewBox="0 0 24 24" fill="none" class="pcard-icon"><path d="M3 17l4-8 4 5 3-4 7 7H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Department GWA Trend</h3></div>
      <div class="pcard-body">
        <div class="chart-area">
          <div class="chart-y"><span v-for="y in yLabels" :key="y">{{ y }}</span></div>
          <div class="chart-bars-wrap">
            <div class="chart-bar-col" v-for="(bar, i) in chartData" :key="i">
              <div class="chart-bar-wrap">
                <div class="chart-bar-fill" :class="{ current: i === chartData.length-1 }" :style="{ height: barH(bar.gwa) + '%' }">
                  <span class="chart-tooltip">{{ bar.sem }}: {{ bar.gwa }}</span>
                </div>
              </div>
              <span class="chart-bar-label">{{ bar.sem }}</span>
            </div>
          </div>
        </div>
        <div class="chart-legend"><span class="legend-dot current"></span><span class="legend-text">Current semester</span><span class="legend-dot"></span><span class="legend-text">Previous</span></div>
      </div>
    </div>
    <!-- Per-Course GWA -->
    <div class="pcard">
      <div class="pcard-header"><svg viewBox="0 0 24 24" fill="none" class="pcard-icon"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><h3>GWA by Course</h3></div>
      <div class="pcard-body">
        <div class="course-list">
          <div class="course-row" v-for="c in courses" :key="c.name">
            <div class="course-info"><p class="course-name">{{ c.name }}</p><p class="course-students">{{ c.students }} students</p></div>
            <div class="course-bar-wrap">
              <div class="course-bar" :style="{ width: c.pct + '%', background: c.color }"></div>
            </div>
            <span class="course-gwa" :style="{ color: c.color }">{{ c.gwa }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const summary = ref([
  { label:'Current Dept GWA', value:'1.87', sub:'This semester', color:'#FF6B1A' },
  { label:"Dean's List Students", value:'142', sub:'This semester', color:'#16a34a' },
  { label:'At-Risk Students', value:'18', sub:'GWA below 2.5', color:'#ef4444' },
  { label:'Improvement Rate', value:'+0.04', sub:'vs last semester', color:'#8b5cf6' },
])
const chartData = ref([
  { sem:"1st '22", gwa:2.14, pct:38 },{ sem:"2nd '22", gwa:2.08, pct:50 },
  { sem:"1st '23", gwa:2.01, pct:60 },{ sem:"2nd '23", gwa:1.96, pct:68 },
  { sem:"1st '24", gwa:1.91, pct:75 },{ sem:"2nd '24", gwa:1.87, pct:85 },
])
const yLabels = ['1.50','1.75','2.00','2.25','2.50']
const barH = gwa => Math.round(((3-gwa)/(3-1.5))*80+10)
const courses = ref([
  { name:'BSCS', students:420, gwa:'1.82', pct:85, color:'#FF6B1A' },
  { name:'BSIT', students:310, gwa:'1.91', pct:75, color:'#3b82f6' },
  { name:'BSIS', students:112, gwa:'1.95', pct:70, color:'#8b5cf6' },
])
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page{display:flex;flex-direction:column;gap:20px;font-family:'Outfit',sans-serif}.page-header{display:flex;justify-content:space-between;align-items:flex-end}.page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:700;color:#1a0a00}.page-sub{font-size:13px;color:#b89f90;margin-top:4px}.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.summary-card{background:#fff;border:1px solid #f0e8e0;border-radius:16px;padding:18px 20px;display:flex;flex-direction:column;gap:4px}.s-label{font-size:10px;font-weight:700;color:#9a8070;text-transform:uppercase;letter-spacing:.6px}.s-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:30px;font-weight:800;line-height:1}.s-sub{font-size:11px;color:#b89f90}.pcard{background:#fff;border:1px solid #f0e8e0;border-radius:20px;overflow:hidden}.pcard-header{padding:18px 24px;border-bottom:1px solid #faf8f6;display:flex;align-items:center;gap:12px}.pcard-icon{width:20px;height:20px;color:#FF6B1A;flex-shrink:0}.pcard-header h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;color:#1a0a00}.pcard-body{padding:24px}.chart-area{display:flex;gap:8px;height:180px}.chart-y{display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;padding-bottom:22px}.chart-y span{font-size:9px;color:#c0b0a5}.chart-bars-wrap{flex:1;display:flex;align-items:flex-end;gap:12px}.chart-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;gap:6px}.chart-bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end}.chart-bar-fill{width:100%;background:#fde8d8;border-radius:6px 6px 0 0;transition:height .8s ease;position:relative;cursor:pointer;min-height:6px}.chart-bar-fill.current{background:#FF6B1A}.chart-bar-fill:hover .chart-tooltip{opacity:1;transform:translateX(-50%) translateY(0)}.chart-tooltip{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%) translateY(4px);background:#1a0a00;color:#fff;font-size:10px;padding:4px 10px;border-radius:6px;white-space:nowrap;opacity:0;transition:all .15s;pointer-events:none;z-index:10}.chart-bar-label{font-size:10px;color:#b89f90;text-transform:uppercase;letter-spacing:.3px;text-align:center;white-space:nowrap}.chart-legend{display:flex;align-items:center;gap:16px;margin-top:16px}.legend-dot{width:8px;height:8px;border-radius:50%;background:#fde8d8}.legend-dot.current{background:#FF6B1A}.legend-text{font-size:11px;color:#b89f90}.course-list{display:flex;flex-direction:column;gap:14px}.course-row{display:flex;align-items:center;gap:14px}.course-info{width:60px;flex-shrink:0}.course-name{font-size:13px;font-weight:700;color:#1a0a00}.course-students{font-size:11px;color:#b89f90}.course-bar-wrap{flex:1;height:8px;background:#f0e8e0;border-radius:4px;overflow:hidden}.course-bar{height:100%;border-radius:4px;transition:width .8s ease}.course-gwa{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:800;width:40px;text-align:right}
</style>