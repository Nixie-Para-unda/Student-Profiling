<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Academic History</h2>
        <p class="page-sub">GWA trend across all semesters.</p>
      </div>
    </div>

    <!-- GWA Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card" v-for="s in gwaSummary" :key="s.label">
        <span class="summary-label">{{ s.label }}</span>
        <span class="summary-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="summary-sub">{{ s.sub }}</span>
      </div>
    </div>

    <!-- GWA Trend Chart -->
    <div class="pcard">
      <div class="pcard-header">
        <svg viewBox="0 0 24 24" fill="none" class="pcard-icon"><path d="M3 17l4-8 4 5 3-4 7 7H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <h3>GWA Trend per Semester</h3>
      </div>
      <div class="pcard-body">
        <div class="chart-area">
          <div class="chart-y-labels">
            <span v-for="y in yLabels" :key="y">{{ y }}</span>
          </div>
          <div class="chart-bars-wrap">
            <div class="chart-bar-col" v-for="(sem, i) in history" :key="i">
              <div class="chart-bar-wrap">
                <div
                  class="chart-bar-fill"
                  :class="{
                    current: i === history.length - 1,
                    deans: sem.gwa <= 1.75 && i !== history.length - 1
                  }"
                  :style="{ height: barHeight(sem.gwa) + '%' }"
                >
                  <span class="chart-tooltip">{{ sem.semester_short }}: {{ sem.gwa }}</span>
                </div>
              </div>
              <span class="chart-bar-label">{{ sem.semester_short }}</span>
            </div>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot current"></span><span class="legend-text">Current semester</span>
          <span class="legend-dot deans"></span><span class="legend-text">Dean's List (≤ 1.75)</span>
          <span class="legend-dot"></span><span class="legend-text">Previous</span>
        </div>

        <!-- Semester GWA table below chart -->
        <div class="gwa-table">
          <div class="gwa-table-header">
            <span>Semester</span>
            <span>GWA</span>
            <span>Total Units</span>
            <span>Status</span>
          </div>
          <div class="gwa-table-row" v-for="(sem, i) in [...history].reverse()" :key="i">
            <span class="gwa-sem-name">
              {{ sem.semester }}
              <span class="current-tag" v-if="sem.semester.includes('Current')">Current</span>
            </span>
            <span class="gwa-val" :class="sem.gwa <= 1.75 ? 'gwa-good' : 'gwa-warn'">{{ sem.gwa }}</span>
            <span class="gwa-units">{{ totalUnits(sem.subjects) }} units</span>
            <span class="gwa-status" :class="sem.gwa <= 1.75 ? 'st-deans' : 'st-good'">
              {{ sem.gwa <= 1.75 ? "Dean's List" : 'Good Standing' }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const history = ref([
  {
    semester: '1st Semester 2024–2025', semester_short: "1st '24", gwa: 1.81,
    subjects: [
      { units: 3 }, { units: 3 }, { units: 3 }, { units: 2 }
    ]
  },
  {
    semester: '2nd Semester 2024–2025', semester_short: "2nd '24", gwa: 1.77,
    subjects: [
      { units: 3 }, { units: 3 }, { units: 3 }, { units: 3 }
    ]
  },
  {
    semester: '1st Semester 2025–2026', semester_short: "1st '25", gwa: 1.74,
    subjects: [
      { units: 3 }, { units: 3 }, { units: 3 }, { units: 3 }
    ]
  },
  {
    semester: '2nd Semester 2025–2026 (Current)', semester_short: "2nd '25", gwa: 1.72,
    subjects: [
      { units: 3 }, { units: 3 }, { units: 3 }, { units: 3 }
    ]
  }
])

const gwaSummary = computed(() => {
  const gwas = history.value.map(s => s.gwa)
  const current = gwas[gwas.length - 1]
  const best = Math.min(...gwas)
  const avg = (gwas.reduce((a, b) => a + b, 0) / gwas.length).toFixed(2)
  const deansCount = gwas.filter(g => g <= 1.75).length
  return [
    { label: 'Current GWA', value: current, sub: 'This semester', color: '#FF6B1A' },
    { label: 'Best GWA', value: best, sub: 'All time', color: '#16a34a' },
    { label: 'Overall Average', value: avg, sub: 'All semesters', color: '#8b5cf6' },
    { label: "Dean's List", value: deansCount, sub: 'Semesters', color: '#f59e0b' }
  ]
})

const yLabels = ['1.00', '1.50', '2.00', '2.50', '3.00']

const barHeight = (gwa) => {
  const min = 1.0
  const max = 3.0
  return Math.round(((max - gwa) / (max - min)) * 80 + 10)
}

const totalUnits = (subjects) => subjects.reduce((a, s) => a + s.units, 0)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* Summary Cards */
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.summary-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; }
.summary-label { font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; }
.summary-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; }
.summary-sub { font-size: 11px; color: #b89f90; }

/* Card */
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-header { padding: 18px 24px; border-bottom: 1px solid #faf8f6; display: flex; align-items: center; gap: 12px; }
.pcard-icon { width: 20px; height: 20px; color: #FF6B1A; flex-shrink: 0; }
.pcard-header h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.pcard-body { padding: 24px; }

/* Chart */
.chart-area { display: flex; gap: 8px; height: 200px; }
.chart-y-labels { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-bottom: 22px; gap: 0; }
.chart-y-labels span { font-size: 9px; color: #c0b0a5; }
.chart-bars-wrap { flex: 1; display: flex; align-items: flex-end; gap: 16px; }
.chart-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 6px; }
.chart-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.chart-bar-fill { width: 100%; background: #fde8d8; border-radius: 8px 8px 0 0; transition: height 0.8s ease; position: relative; cursor: pointer; min-height: 6px; }
.chart-bar-fill.deans { background: #bbf7d0; }
.chart-bar-fill.current { background: #FF6B1A; }
.chart-bar-fill:hover .chart-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }
.chart-tooltip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%) translateY(4px); background: #1a0a00; color: #fff; font-size: 10px; padding: 4px 10px; border-radius: 6px; white-space: nowrap; opacity: 0; transition: all 0.15s; pointer-events: none; z-index: 10; }
.chart-bar-label { font-size: 10px; color: #b89f90; text-transform: uppercase; letter-spacing: 0.3px; text-align: center; white-space: nowrap; font-weight: 600; }
.chart-legend { display: flex; align-items: center; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; background: #fde8d8; }
.legend-dot.current { background: #FF6B1A; }
.legend-dot.deans { background: #bbf7d0; }
.legend-text { font-size: 11px; color: #b89f90; }

/* GWA Table */
.gwa-table { margin-top: 28px; border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.gwa-table-header { display: grid; grid-template-columns: 1fr 100px 120px 130px; gap: 8px; padding: 12px 20px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.7px; border-bottom: 1px solid #f0e8e0; }
.gwa-table-row { display: grid; grid-template-columns: 1fr 100px 120px 130px; gap: 8px; padding: 14px 20px; border-bottom: 1px solid #faf8f6; align-items: center; transition: background 0.15s; }
.gwa-table-row:last-child { border-bottom: none; }
.gwa-table-row:hover { background: #fdf9f7; }
.gwa-sem-name { font-size: 13px; font-weight: 500; color: #1a0a00; display: flex; align-items: center; gap: 8px; }
.current-tag { font-size: 9px; font-weight: 700; background: #fff5ef; color: #FF6B1A; border: 1px solid #ffd5b0; padding: 2px 7px; border-radius: 5px; }
.gwa-val { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; }
.gwa-good { color: #16a34a; }
.gwa-warn { color: #FF6B1A; }
.gwa-units { font-size: 12px; color: #9a8070; }
.gwa-status { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 7px; display: inline-block; }
.st-deans { background: #f0fdf4; color: #16a34a; }
.st-good { background: #eff6ff; color: #3b82f6; }
</style>