<template>
  <div class="performance-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Academic Performance</h2>
        <p class="section-desc">Monitor GWA trends, Dean's List qualifiers, and at-risk students.</p>
      </div>
    </div>

    <!-- Summary Grid -->
    <div class="summary-grid">
      <div class="summary-card" v-for="item in summary" :key="item.label">
        <div class="summary-content">
          <span class="summary-label">{{ item.label }}</span>
          <div class="summary-main">
            <span class="summary-value">{{ item.value }}</span>
            <span class="summary-unit">students</span>
          </div>
          <span class="summary-tag" :style="{ background: item.tagBg, color: item.tagColor }">{{ item.tag }}</span>
        </div>
      </div>
    </div>

    <div class="performance-content">
      <!-- GWA Distribution -->
      <div class="perf-card distribution-card">
        <div class="card-header">
          <h3 class="card-title">GWA Distribution</h3>
          <p class="card-sub">Students per GWA bracket</p>
        </div>
        <div class="distribution-list">
          <div class="dist-row" v-for="row in distribution" :key="row.range">
            <div class="dist-label-wrap">
              <span class="dist-range">{{ row.range }}</span>
              <span class="dist-desc">({{ row.desc }})</span>
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

      <!-- Semester Trend -->
      <div class="perf-card trend-card">
        <div class="card-header">
          <h3 class="card-title">Semester Trend</h3>
          <p class="card-sub">Average GWA over 6 semesters</p>
        </div>
        <div class="trend-chart">
          <div class="chart-bars">
            <div class="chart-col" v-for="bar in trend" :key="bar.sem">
              <div class="bar-wrap">
                <div class="bar-fill" :style="{ height: bar.pct + '%' }"></div>
              </div>
              <span class="bar-label">{{ bar.sem }}</span>
            </div>
          </div>
        </div>
        <div class="trend-footer">
          <div class="trend-stat">
            <span class="ts-label">Highest GWA</span>
            <span class="ts-value">1.21</span>
          </div>
          <div class="trend-stat">
            <span class="ts-label">Lowest GWA</span>
            <span class="ts-value">3.45</span>
          </div>
          <div class="trend-stat">
            <span class="ts-label">Dept. Average</span>
            <span class="ts-value">1.87</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const summary = [
  { label: "DEAN'S LIST", value: 127, tag: "Dean's List", tagBg: '#f0fdf4', tagColor: '#16a34a' },
  { label: "SATISFACTORY", value: 583, tag: "Satisfactory", tagBg: '#eff6ff', tagColor: '#3b82f6' },
  { label: "AT RISK", value: 98, tag: "At Risk", tagBg: '#fff7ed', tagColor: '#ea580c' },
  { label: "FAILED SUBJECTS", value: 34, tag: "Failed Subjects", tagBg: '#fff1f2', tagColor: '#e11d48' }
]

const distribution = [
  { range: '1.00–1.50', desc: 'Excellent', count: 127, pct: 15, color: '#065f46' },
  { range: '1.51–2.00', desc: 'Very Good', count: 310, pct: 37, color: '#1e40af' },
  { range: '2.01–2.50', desc: 'Good', count: 273, pct: 32, color: '#d97706' },
  { range: '2.51–3.00', desc: 'Satisfactory', count: 98, pct: 12, color: '#ea580c' },
  { range: 'Below 3.00', desc: 'At Risk', count: 34, pct: 4, color: '#b91c1c' }
]

const trend = [
  { sem: "1st '22", pct: 45 },
  { sem: "2nd '22", pct: 55 },
  { sem: "1st '23", pct: 50 },
  { sem: "2nd '23", pct: 65 },
  { sem: "1st '24", pct: 70 },
  { sem: "2nd '24", pct: 85 }
]
</script>

<style scoped>
.performance-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a0a00;
}

.section-desc {
  font-size: 13px;
  color: #b89f90;
  margin-top: 4px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  padding: 24px;
}

.summary-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #9a8070;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}

.summary-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 14px;
}

.summary-value {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #1a0a00;
}

.summary-unit {
  font-size: 12px;
  color: #b89f90;
}

.summary-tag {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
}

.performance-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.perf-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  padding: 28px;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.card-sub {
  font-size: 12px;
  color: #b89f90;
  margin-top: 4px;
  margin-bottom: 24px;
}

.dist-row {
  margin-bottom: 18px;
}

.dist-label-wrap {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.dist-range { font-size: 12px; font-weight: 700; color: #1a0a00; }
.dist-desc { font-size: 11px; color: #b89f90; }

.dist-bar-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dist-bar {
  flex: 1;
  height: 8px;
  background: #f0e8e0;
  border-radius: 4px;
  overflow: hidden;
}

.dist-fill { height: 100%; border-radius: 4px; }
.dist-stats { font-size: 11px; color: #9a8070; min-width: 80px; text-align: right; }

.trend-chart {
  height: 200px;
  margin-bottom: 24px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding: 20px 0;
  background: linear-gradient(180deg, rgba(255,107,26,0.02) 0%, rgba(255,107,26,0.08) 100%);
  border-radius: 12px;
}

.chart-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-wrap {
  flex: 1;
  width: 40px;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: #FF6B1A;
  border-radius: 6px 6px 0 0;
  box-shadow: 0 4px 12px rgba(255,107,26,0.2);
}

.bar-label { font-size: 9px; color: #b89f90; text-transform: uppercase; }

.trend-footer {
  display: flex;
  justify-content: space-between;
  background: #faf8f6;
  padding: 16px 24px;
  border-radius: 12px;
}

.trend-stat { display: flex; flex-direction: column; gap: 4px; }
.ts-label { font-size: 10px; color: #b89f90; text-transform: uppercase; letter-spacing: 0.4px; }
.ts-value { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #1a0a00; }
</style>
