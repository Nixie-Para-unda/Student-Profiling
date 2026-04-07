<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Award Approvals</h2><p class="page-sub">Review and approve student award nominations.</p></div>
    </div>
    <div class="filter-tabs">
      <button v-for="t in tabs" :key="t.key" class="filter-tab" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">{{ t.label }}<span class="tab-count" v-if="t.count">{{ t.count }}</span></button>
    </div>
    <div class="awards-list">
      <div class="ach-card" v-for="a in filtered" :key="a.id">
        <div class="ach-icon" :style="{ background: a.color + '18', color: a.color }">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14.5l-5 3.5 2-6L2 8h6l2-6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
        </div>
        <div class="ach-info">
          <p class="ach-title">{{ a.award }}</p>
          <p class="ach-student">{{ a.student }} · {{ a.course }}</p>
          <p class="ach-meta">Submitted by {{ a.faculty }} · {{ a.date }}</p>
        </div>
        <div class="ach-right">
          <span class="cat-badge" :style="{ background: a.color + '18', color: a.color }">{{ a.category }}</span>
          <span class="ach-status" :class="'as-' + a.status">{{ a.status }}</span>
          <div class="ach-actions" v-if="a.status === 'pending'">
            <button class="approve-btn" @click="a.status = 'approved'">
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Approve
            </button>
            <button class="reject-btn" @click="a.status = 'rejected'">
              <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Reject
            </button>
          </div>
          <div v-else class="ach-resolved">
            <svg v-if="a.status==='approved'" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#16a34a" stroke-width="1.3"/><path d="M5 8l2 2 4-4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" stroke-width="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>{{ a.status === 'approved' ? 'Approved' : 'Rejected' }}</span>
          </div>
        </div>
      </div>
      <div v-if="!filtered.length" class="empty-state"><p>No awards in this category.</p></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const activeTab = ref('pending')
const awards = ref([
  { id:1, award:"Dean's List Nomination", student:'Aira Mae Reyes', course:'BSCS 3-A', category:'Academic', faculty:'Dr. R. Villanueva', date:'Mar 10, 2026', status:'pending', color:'#f59e0b' },
  { id:2, award:'Best Research Paper', student:'Jose Miguel Cruz', course:'BSIT 3-A', category:'Research', faculty:'Prof. A. Reyes', date:'Mar 11, 2026', status:'pending', color:'#3b82f6' },
  { id:3, award:'Leadership Award', student:'Katrina Villanueva', course:'BSCS 2-B', category:'Leadership', faculty:'Prof. L. Garcia', date:'Mar 12, 2026', status:'pending', color:'#10b981' },
  { id:4, award:"Dean's List Nomination", student:'Mark Dela Cruz', course:'BSCS 4-A', category:'Academic', faculty:'Dr. J. Cruz', date:'Mar 13, 2026', status:'pending', color:'#f59e0b' },
  { id:5, award:'Outstanding Student', student:'Paolo Reyes', course:'BSIT 2-A', category:'Leadership', faculty:'Prof. A. Reyes', date:'Mar 5, 2026', status:'approved', color:'#8b5cf6' },
])
const tabs = computed(() => [
  { key:'all', label:'All', count:0 },
  { key:'pending', label:'Pending', count: awards.value.filter(a=>a.status==='pending').length },
  { key:'approved', label:'Approved', count:0 },
  { key:'rejected', label:'Rejected', count:0 },
])
const filtered = computed(() => activeTab.value === 'all' ? awards.value : awards.value.filter(a => a.status === activeTab.value))
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page{display:flex;flex-direction:column;gap:20px;font-family:'Outfit',sans-serif}.page-header{display:flex;justify-content:space-between;align-items:flex-end}.page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:700;color:#1a0a00}.page-sub{font-size:13px;color:#b89f90;margin-top:4px}.filter-tabs{display:flex;gap:6px;background:#faf8f6;padding:6px;border-radius:14px;border:1px solid #f0e8e0;width:fit-content}.filter-tab{display:flex;align-items:center;gap:6px;padding:8px 16px;border:none;background:none;border-radius:9px;font-size:13px;font-weight:600;color:#9a8070;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s}.filter-tab.active{background:#1a0a00;color:#fff}.tab-count{background:#FF6B1A;color:#fff;font-size:10px;padding:1px 6px;border-radius:5px}.awards-list{display:flex;flex-direction:column;gap:12px}.ach-card{background:#fff;border:1px solid #f0e8e0;border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:14px;transition:all .15s}.ach-card:hover{border-color:#FF6B1A;background:#fffaf8}.ach-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.ach-icon svg{width:22px;height:22px}.ach-info{flex:1}.ach-title{font-size:14px;font-weight:600;color:#1a0a00}.ach-student{font-size:12px;color:#9a8070;margin-top:2px}.ach-meta{font-size:11px;color:#b89f90;margin-top:2px}.ach-right{display:flex;align-items:center;gap:10px;flex-shrink:0}.cat-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;white-space:nowrap}.ach-status{font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px}.as-pending{background:#fffbeb;color:#d97706}.as-approved{background:#f0fdf4;color:#16a34a}.as-rejected{background:#fff1f2;color:#e11d48}.ach-actions{display:flex;gap:8px}.approve-btn{display:flex;align-items:center;gap:5px;background:#f0fdf4;color:#16a34a;border:1.5px solid #bbf7d0;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s}.approve-btn:hover{background:#16a34a;color:#fff}.approve-btn svg{width:13px;height:13px}.reject-btn{display:flex;align-items:center;gap:5px;background:#fff1f2;color:#ef4444;border:1.5px solid #fecdd3;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s}.reject-btn:hover{background:#ef4444;color:#fff}.reject-btn svg{width:13px;height:13px}.ach-resolved{display:flex;align-items:center;gap:6px;font-size:12px;color:#9a8070}.ach-resolved svg{width:16px;height:16px}.empty-state{text-align:center;padding:60px;color:#b89f90;font-size:13px}
</style>