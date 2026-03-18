<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Student Profiles</h2><p class="page-sub">View all enrolled student profiles in the department.</p></div>
    </div>
    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by name, student number, or course..." />
      </div>
      <div class="filter-group">
        <select v-model="filterCourse"><option value="">All Courses</option><option>BSCS</option><option>BSIT</option><option>BSIS</option></select>
        <select v-model="filterYear"><option value="">All Years</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select>
      </div>
    </div>
    <div class="table-card">
      <table class="data-table">
        <thead><tr><th>STUDENT</th><th>STUDENT NO.</th><th>COURSE</th><th>YEAR & SECTION</th><th>GWA</th><th>VIOLATIONS</th><th>STATUS</th><th>ACTION</th></tr></thead>
        <tbody>
          <tr v-for="s in filteredStudents" :key="s.id">
            <td><div class="student-cell"><div class="s-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div><div><p class="s-name">{{ s.name }}</p><p class="s-sub">{{ s.email }}</p></div></div></td>
            <td><span class="code-badge">{{ s.student_number }}</span></td>
            <td>{{ s.course }}</td>
            <td>{{ s.year }}{{ getSuffix(s.year) }} · {{ s.section }}</td>
            <td><span class="gwa-val" :class="s.gwa <= 1.75 ? 'gwa-good' : 'gwa-ok'">{{ s.gwa }}</span></td>
            <td><span :class="s.violations > 0 ? 'v-danger' : 'v-clear'">{{ s.violations }}</span></td>
            <td><span class="status-badge" :class="s.status === 'active' ? 'st-active' : 'st-pending'">{{ s.status }}</span></td>
            <td><button class="view-btn" @click="viewing = s">View</button></td>
          </tr>
          <tr v-if="!filteredStudents.length"><td colspan="8" class="empty-row">No students found.</td></tr>
        </tbody>
      </table>
    </div>
    <div v-if="viewing" class="modal-overlay" @click.self="viewing = null">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-student-info">
            <div class="s-avatar lg" :style="{ background: viewing.color }">{{ viewing.name.charAt(0) }}</div>
            <div><h3>{{ viewing.name }}</h3><p>{{ viewing.student_number }} · {{ viewing.course }} · {{ viewing.section }}</p></div>
          </div>
          <button class="close-btn" @click="viewing = null">×</button>
        </div>
        <div class="modal-body">
          <div class="info-grid">
            <div class="pi-row"><span class="pi-label">Email</span><span class="pi-value">{{ viewing.email }}</span></div>
            <div class="pi-row"><span class="pi-label">GWA</span><span class="pi-value gwa-hl">{{ viewing.gwa }}</span></div>
            <div class="pi-row"><span class="pi-label">Year Level</span><span class="pi-value">{{ viewing.year }}{{ getSuffix(viewing.year) }} Year</span></div>
            <div class="pi-row"><span class="pi-label">Section</span><span class="pi-value">{{ viewing.section }}</span></div>
            <div class="pi-row"><span class="pi-label">Violations</span><span class="pi-value" :class="viewing.violations > 0 ? 'v-danger' : 'v-clear'">{{ viewing.violations }}</span></div>
            <div class="pi-row"><span class="pi-label">Status</span><span class="status-badge" :class="viewing.status === 'active' ? 'st-active' : 'st-pending'">{{ viewing.status }}</span></div>
          </div>
        </div>
        <div class="modal-footer"><button class="ghost-btn" @click="viewing = null">Close</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const search = ref(''); const filterCourse = ref(''); const filterYear = ref(''); const viewing = ref(null)
const students = ref([
  { id:1, name:'Aira Mae Reyes', student_number:'2023-00142', email:'aira@school.edu.ph', course:'BSCS', year:3, section:'BSCS 3-A', gwa:'1.21', violations:0, status:'active', color:'#f59e0b' },
  { id:2, name:'Jose Miguel Cruz', student_number:'2023-00143', email:'jose@school.edu.ph', course:'BSIT', year:3, section:'BSIT 3-A', gwa:'1.34', violations:0, status:'active', color:'#3b82f6' },
  { id:3, name:'Katrina Villanueva', student_number:'2023-00144', email:'katrina@school.edu.ph', course:'BSCS', year:2, section:'BSCS 2-B', gwa:'1.38', violations:0, status:'active', color:'#10b981' },
  { id:4, name:'Ryan Santos', student_number:'2023-00145', email:'ryan@school.edu.ph', course:'BSCS', year:4, section:'BSCS 4-A', gwa:'2.10', violations:2, status:'active', color:'#ef4444' },
])
const filteredStudents = computed(() => students.value.filter(s => {
  const m = !search.value || s.name.toLowerCase().includes(search.value.toLowerCase()) || s.student_number.includes(search.value)
  const c = !filterCourse.value || s.course === filterCourse.value
  const y = !filterYear.value || s.year == filterYear.value
  return m && c && y
}))
const getSuffix = y => y==1?'st':y==2?'nd':y==3?'rd':'th'
</script>
<style scoped>
.page{display:flex;flex-direction:column;gap:20px;font-family:'DM Sans',sans-serif}.page-header{display:flex;justify-content:space-between;align-items:flex-end}.page-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#1a0a00}.page-sub{font-size:13px;color:#b89f90;margin-top:4px}.table-toolbar{display:flex;gap:12px;align-items:center}.search-wrap{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #f0e8e0;border-radius:10px;padding:9px 14px;flex:1;transition:all .2s}.search-wrap:focus-within{border-color:#FF6B1A;box-shadow:0 0 0 3px rgba(255,107,26,.07)}.search-wrap svg{width:15px;height:15px;color:#c0b0a5;flex-shrink:0}.search-wrap input{border:none;outline:none;font-size:13px;font-family:'DM Sans',sans-serif;color:#1a0a00;width:100%;background:none}.search-wrap input::placeholder{color:#c0b0a5}.filter-group{display:flex;gap:8px}.filter-group select{padding:9px 14px;border:1.5px solid #f0e8e0;border-radius:10px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1a0a00;background:#fff;outline:none}.table-card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;overflow:hidden}.data-table{width:100%;border-collapse:collapse}.data-table th{padding:13px 18px;background:#faf8f6;font-size:10px;font-weight:700;color:#9a8070;text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid #f0e8e0;text-align:left}.data-table td{padding:13px 18px;font-size:13px;color:#1a0a00;border-bottom:1px solid #faf8f6}.data-table tr:last-child td{border-bottom:none}.data-table tr:hover td{background:#fdf9f7}.student-cell{display:flex;align-items:center;gap:10px}.s-avatar{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}.s-avatar.lg{width:48px;height:48px;font-size:20px;border-radius:14px}.s-name{font-size:13px;font-weight:600;color:#1a0a00}.s-sub{font-size:11px;color:#b89f90}.code-badge{font-size:11px;font-weight:700;color:#FF6B1A;background:#fff5ef;padding:3px 8px;border-radius:6px}.gwa-val{font-family:'Syne',sans-serif;font-size:14px;font-weight:800}.gwa-good{color:#16a34a}.gwa-ok{color:#FF6B1A}.gwa-hl{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#FF6B1A}.v-danger{color:#ef4444;font-weight:700}.v-clear{color:#16a34a;font-weight:700}.status-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px}.st-active{background:#f0fdf4;color:#16a34a}.st-pending{background:#fffbeb;color:#d97706}.view-btn{background:#fff5ef;color:#FF6B1A;border:1.5px solid #ffd5b0;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}.view-btn:hover{background:#FF6B1A;color:#fff}.empty-row{text-align:center;color:#b89f90;font-style:italic;padding:40px}.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}.modal{background:#fff;border-radius:20px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.15)}.modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0e8e0}.modal-student-info{display:flex;align-items:center;gap:14px}.modal-student-info h3{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#1a0a00}.modal-student-info p{font-size:12px;color:#b89f90;margin-top:2px}.close-btn{background:none;border:none;font-size:22px;color:#b89f90;cursor:pointer;padding:0;line-height:1}.modal-body{padding:24px}.modal-footer{display:flex;justify-content:flex-end;padding:16px 24px;border-top:1px solid #f0e8e0;background:#faf8f6}.info-grid{display:flex;flex-direction:column;gap:0;border:1px solid #f0e8e0;border-radius:12px;overflow:hidden}.pi-row{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #faf8f6}.pi-row:last-child{border-bottom:none}.pi-label{font-size:12px;color:#9a8070;font-weight:500}.pi-value{font-size:13px;font-weight:600;color:#1a0a00}.ghost-btn{display:flex;align-items:center;gap:7px;background:#fff;color:#1a0a00;border:1.5px solid #f0e8e0;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
</style>