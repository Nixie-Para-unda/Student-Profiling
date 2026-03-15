<template>
  <div class="faculty-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Faculty Profiles</h2>
        <p class="section-desc">View faculty workloads, assigned subjects, and teaching schedules.</p>
      </div>
      <div class="header-right">
        <button class="export-btn">
          <svg viewBox="0 0 20 20" fill="none"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1m-4-8l-4-4-4 4m4-4v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Export Workload
        </button>
      </div>
    </div>

    <div class="faculty-grid">
      <div class="faculty-card" v-for="prof in faculty" :key="prof.name">
        <div class="card-top">
          <div class="prof-avatar" :style="{ background: prof.color }">{{ prof.initials }}</div>
          <div class="prof-main">
            <h3 class="prof-name">{{ prof.name }}</h3>
            <p class="prof-expertise">{{ prof.expertise }}</p>
            <span class="status-tag" :class="prof.statusClass">{{ prof.status }}</span>
          </div>
        </div>
        
        <div class="workload-section">
          <div class="workload-header">
            <span class="workload-label">Teaching Load</span>
            <span class="workload-value"><strong>{{ prof.load }}</strong>/30 hrs</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (prof.load / 30 * 100) + '%', background: prof.barColor }"></div>
          </div>
        </div>

        <div class="subjects-section">
          <span class="subjects-label">ASSIGNED SUBJECTS</span>
          <div class="subjects-tags">
            <span v-for="sub in prof.subjects" :key="sub" class="subject-tag">{{ sub }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const faculty = [
  { 
    name: 'Prof. R. Aquino', expertise: 'CS Theory, Algorithms', initials: 'RA', color: '#fff5ef', 
    status: 'Overloaded', statusClass: 'st-danger', load: 27, barColor: '#ef4444',
    subjects: ['CSTHEORY', 'ALGO301', 'DISCMATH']
  },
  { 
    name: 'Prof. C. Buenaventura', expertise: 'Web Dev, Databases', initials: 'CB', color: '#eff6ff', 
    status: 'Normal', statusClass: 'st-success', load: 22, barColor: '#10b981',
    subjects: ['WEB301', 'DB201', 'IT402']
  },
  { 
    name: 'Prof. M. Laurel', expertise: 'Networks, Security', initials: 'ML', color: '#f5f3ff', 
    status: 'Normal', statusClass: 'st-success', load: 18, barColor: '#10b981',
    subjects: ['NETW201', 'SECU301']
  },
  { 
    name: 'Prof. T. dela Cruz', expertise: 'AI, Machine Learning', initials: 'TD', color: '#fffbeb', 
    status: 'Heavy', statusClass: 'st-warning', load: 25, barColor: '#f59e0b',
    subjects: ['AI401', 'ML302', 'DATSC']
  },
  { 
    name: 'Prof. P. Navarro', expertise: 'Math, Statistics', initials: 'PN', color: '#fdf2f8', 
    status: 'Light', statusClass: 'st-info', load: 15, barColor: '#3b82f6',
    subjects: ['MATH101', 'STAT201']
  },
  { 
    name: 'Prof. E. Reyes', expertise: 'Programming, OOP', initials: 'ER', color: '#f0fdf4', 
    status: 'Normal', statusClass: 'st-success', load: 20, barColor: '#10b981',
    subjects: ['PROG101', 'OOP202', 'JAVA301']
  }
]
</script>

<style scoped>
.faculty-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #f0e8e0;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1a0a00;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.export-btn:hover {
  border-color: #FF6B1A;
  color: #FF6B1A;
  background: #fff5ef;
}

.export-btn svg { width: 16px; height: 16px; }

.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.faculty-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.faculty-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(26, 10, 0, 0.05);
}

.card-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.prof-avatar {
  width: 54px; height: 54px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 18px;
  color: #FF6B1A;
  border: 1px solid rgba(255,107,26,0.1);
}

.prof-main { flex: 1; }

.prof-name {
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a0a00;
}

.prof-expertise {
  font-size: 12px;
  color: #b89f90;
  margin-top: 2px;
}

.status-tag {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 8px;
}

.st-danger { background: #fff1f2; color: #e11d48; }
.st-success { background: #f0fdf4; color: #16a34a; }
.st-warning { background: #fff7ed; color: #ea580c; }
.st-info { background: #eff6ff; color: #3b82f6; }

.workload-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.workload-label { font-size: 12px; color: #9a8070; }
.workload-value { font-size: 12px; color: #1a0a00; }

.progress-bar {
  height: 6px;
  background: #f0e8e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.subjects-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  color: #b89f90;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.subjects-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  font-size: 10px;
  font-weight: 600;
  background: #fff5ef;
  color: #c94000;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #ffd5b0;
}
</style>
