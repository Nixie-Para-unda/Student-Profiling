<template>
  <div class="students-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="section-title">Student Profiles</h2>
        <p class="section-desc">View all student records, GWA, violations, and organization memberships.</p>
      </div>
      <div class="header-right">
        <div class="search-container">
          <svg viewBox="0 0 20 20" fill="none" class="search-icon"><path d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <input type="text" placeholder="Search students..." class="table-search" />
        </div>
        <div class="filter-group">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">BSCS</button>
          <button class="filter-btn">BSIT</button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-student">STUDENT</th>
            <th class="col-course">COURSE</th>
            <th class="col-year">YEAR</th>
            <th class="col-gwa">GWA</th>
            <th class="col-violations">VIOLATIONS</th>
            <th class="col-org">ORGANIZATION</th>
            <th class="col-skills">SKILLS</th>
            <th class="col-status">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="index">
            <td class="col-rank">{{ index + 1 }}</td>
            <td class="col-student">
              <div class="student-cell">
                <div class="avatar" :style="{ background: student.color }">{{ student.name.charAt(0) }}</div>
                <span class="name">{{ student.name }}</span>
              </div>
            </td>
            <td class="col-course">{{ student.course }}</td>
            <td class="col-year">{{ student.year }}</td>
            <td class="col-gwa"><strong>{{ student.gwa }}</strong></td>
            <td class="col-violations">
              <span class="v-count" :class="{ danger: student.violations > 0 }">{{ student.violations }}</span>
            </td>
            <td class="col-org">{{ student.org }}</td>
            <td class="col-skills">
              <div class="skills-wrap">
                <span v-for="skill in student.skills" :key="skill" class="skill-tag">{{ skill }}</span>
              </div>
            </td>
            <td class="col-status">
              <span class="status-badge" :class="student.statusClass">{{ student.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const students = [
  { name: 'Aira Mae Reyes', course: 'BSCS', year: '4th Year', gwa: '1.21', violations: 0, org: 'ACM Student Chapter', skills: ['Python', 'ML', 'UI/UX'], status: "Dean's List", statusClass: 'st-dean', color: '#f59e0b' },
  { name: 'Jose Miguel Cruz', course: 'BSIT', year: '3rd Year', gwa: '1.34', violations: 0, org: 'Google Dev Group', skills: ['Web Dev', 'React', 'Node'], status: "Dean's List", statusClass: 'st-dean', color: '#3b82f6' },
  { name: 'Katrina Villanueva', course: 'BSCS', year: '4th Year', gwa: '1.38', violations: 0, org: 'IEEE Student Branch', skills: ['Java', 'Databases', 'Algo'], status: "Dean's List", statusClass: 'st-dean', color: '#10b981' },
  { name: 'Mark Daniel Lim', course: 'BSIT', year: '2nd Year', gwa: '1.42', violations: 0, org: 'Coding Club', skills: ['PHP', 'MySQL', 'HTML'], status: 'Rising', statusClass: 'st-rising', color: '#FF6B1A' },
  { name: 'Sofia Tan Garcia', course: 'BSCS', year: '3rd Year', gwa: '1.47', violations: 0, org: 'ACM Student Chapter', skills: ['AI', 'Python', 'Research'], status: 'Rising', statusClass: 'st-rising', color: '#8b5cf6' },
  { name: 'Ryan Santos', course: 'BSIT', year: '2nd Year', gwa: '2.1', violations: 2, org: '—', skills: ['HTML', 'CSS'], status: 'At Risk', statusClass: 'st-risk', color: '#ef4444' },
  { name: 'Luis Pascual', course: 'BSCS', year: '1st Year', gwa: '1.9', violations: 1, org: '—', skills: ['Python', 'Scratch'], status: 'Monitor', statusClass: 'st-monitor', color: '#f97316' },
  { name: 'Ana Bautista', course: 'BSIT', year: '3rd Year', gwa: '1.75', violations: 1, org: 'JPCS', skills: ['DB', 'SQL', 'Excel'], status: 'Good', statusClass: 'st-good', color: '#06b6d4' }
]
</script>

<style scoped>
.students-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #c0b0a5;
}

.table-search {
  width: 100%;
  padding: 9px 12px 9px 36px;
  background: #fff;
  border: 1.5px solid #f0e8e0;
  border-radius: 10px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: all 0.2s;
}

.table-search:focus {
  border-color: #FF6B1A;
  box-shadow: 0 0 0 3px rgba(255,107,26,0.08);
}

.filter-group {
  display: flex;
  background: #f0e8e0;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}

.filter-btn {
  padding: 6px 16px;
  border: none;
  background: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #9a8070;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #fff;
  color: #FF6B1A;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.table-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 18px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 16px 20px;
  background: #faf8f6;
  font-size: 11px;
  font-weight: 700;
  color: #9a8070;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #f0e8e0;
}

.data-table td {
  padding: 14px 20px;
  font-size: 13px;
  color: #1a0a00;
  border-bottom: 1px solid #faf8f6;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.col-rank { width: 50px; text-align: center; color: #b89f90; font-weight: 600; }
.student-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 12px;
}
.name { font-weight: 600; }

.v-count {
  font-weight: 700;
  color: #10b981;
}
.v-count.danger {
  color: #ef4444;
}

.skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-tag {
  font-size: 10px;
  padding: 2px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 5px;
  white-space: nowrap;
}

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.st-dean { background: #f0fdf4; color: #16a34a; }
.st-rising { background: #fff5ef; color: #FF6B1A; }
.st-risk { background: #fff1f2; color: #e11d48; }
.st-monitor { background: #fff7ed; color: #ea580c; }
.st-good { background: #ecfeff; color: #0891b2; }
</style>
