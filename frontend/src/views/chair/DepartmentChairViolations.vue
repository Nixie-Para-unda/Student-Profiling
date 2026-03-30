<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Department Faculty</h2><p class="page-sub">View all faculty members and manage subject assignments.</p></div>
    </div>
    <div class="search-wrap" style="margin-bottom:0">
      <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <input v-model="search" type="text" placeholder="Search faculty..." />
    </div>
    <div class="faculty-grid">
      <div class="faculty-card" v-for="f in filtered" :key="f.id">
        <div class="fc-header">
          <div class="fc-avatar" :style="{ background: f.color }">{{ f.name.charAt(0) }}</div>
          <div class="fc-info">
            <p class="fc-name">{{ f.name }}</p>
            <p class="fc-dept">{{ f.department }}</p>
            <p class="fc-pos">{{ f.position }}</p>
          </div>
          <div class="fc-load" :class="f.units >= 18 ? 'load-full' : 'load-normal'">
            <span class="load-num">{{ f.units }}</span>
            <span class="load-lbl">units</span>
          </div>
        </div>
        <div class="fc-subjects">
          <div class="fc-subj-row" v-for="s in f.subjects" :key="s.code">
            <span class="code-badge">{{ s.code }}</span>
            <span class="subj-name">{{ s.name }}</span>
            <span class="subj-sec">{{ s.section }}</span>
          </div>
        </div>
        <div class="fc-footer">
          <span class="fc-students">{{ f.totalStudents }} students</span>
          <span class="wl-badge" :class="f.units >= 18 ? 'wl-full' : 'wl-normal'">{{ f.units >= 18 ? 'Full Load' : 'Normal Load' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const search = ref('')
const faculty = ref([])
const filtered = computed(() => faculty.value.filter(f => !search.value || f.name.toLowerCase().includes(search.value.toLowerCase())))
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page{display:flex;flex-direction:column;gap:20px;font-family:'Outfit',sans-serif}.page-header{display:flex;justify-content:space-between;align-items:flex-end}.page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:700;color:#1a0a00}.page-sub{font-size:13px;color:#b89f90;margin-top:4px}.search-wrap{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #f0e8e0;border-radius:10px;padding:9px 14px;transition:all .2s}.search-wrap:focus-within{border-color:#FF6B1A}.search-wrap svg{width:15px;height:15px;color:#c0b0a5;flex-shrink:0}.search-wrap input{border:none;outline:none;font-size:13px;font-family:'Outfit',sans-serif;color:#1a0a00;width:100%;background:none}.faculty-grid{display:flex;flex-direction:column;gap:16px}.faculty-card{background:#fff;border:1px solid #f0e8e0;border-radius:18px;overflow:hidden}.fc-header{display:flex;align-items:flex-start;gap:14px;padding:20px 22px;border-bottom:1px solid #faf8f6}.fc-avatar{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;flex-shrink:0}.fc-info{flex:1}.fc-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;color:#1a0a00}.fc-dept{font-size:12px;color:#b89f90;margin-top:2px}.fc-pos{font-size:11px;color:#9a8070;margin-top:1px}.fc-load{display:flex;flex-direction:column;align-items:center;padding:8px 16px;border-radius:12px}.fc-load.load-full{background:#fff1f2}.fc-load.load-normal{background:#fffbeb}.load-num{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800;color:#1a0a00}.load-lbl{font-size:9px;color:#9a8070;text-transform:uppercase;letter-spacing:.5px}.fc-subjects{padding:8px 0}.fc-subj-row{display:flex;align-items:center;gap:12px;padding:10px 22px;border-bottom:1px solid #faf8f6}.fc-subj-row:last-child{border-bottom:none}.code-badge{font-size:11px;font-weight:700;color:#FF6B1A;background:#fff5ef;padding:3px 8px;border-radius:6px;white-space:nowrap;flex-shrink:0}.subj-name{flex:1;font-size:13px;color:#1a0a00}.subj-sec{font-size:11px;color:#9a8070;font-weight:600}.fc-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 22px;background:#faf8f6}.fc-students{font-size:12px;color:#9a8070}.wl-badge{font-size:10px;font-weight:700;padding:4px 10px;border-radius:7px}.wl-full{background:#fff1f2;color:#e11d48}.wl-normal{background:#fffbeb;color:#d97706}
</style>