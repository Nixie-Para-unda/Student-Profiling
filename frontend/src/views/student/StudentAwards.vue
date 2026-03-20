<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Awards & Recognition</h2><p class="page-sub">All your academic and extracurricular achievements.</p></div>
    </div>
    <div class="pcard">
      <div class="pcard-body">
        <div v-if="awards.length === 0" class="empty-state">
          <svg viewBox="0 0 48 48" fill="none" style="width:48px;height:48px"><path d="M24 4l4.5 13.5H43l-11.5 8.5 4.5 13.5L24 31.5l-12 8 4.5-13.5L5 17.5h14.5L24 4z" stroke="#f0e8e0" stroke-width="2" stroke-linejoin="round"/></svg>
          <p>No awards recorded yet.</p>
        </div>
        <div v-else class="awards-list">
          <div class="award-row" v-for="award in awards" :key="award.title">
            <div class="award-icon" :style="{ background: award.color + '18' }">
              <svg viewBox="0 0 20 20" fill="none" :style="{ color: award.color }"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14.5l-5 3.5 2-6L2 8h6l2-6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
            </div>
            <div class="award-info">
              <p class="award-title">{{ award.title }}</p>
              <p class="award-meta">{{ award.semester }} · {{ award.category }}</p>
            </div>
            <span class="award-badge" :style="{ background: award.color + '18', color: award.color }">{{ award.badge }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const awards = ref([
  { title: "Dean's List Awardee", semester: '1st Sem 2025–2026', badge: 'Academic', category: 'Academic Excellence', color: '#f59e0b' },
  { title: 'Best Research Paper', semester: '2nd Sem 2024–2025', badge: 'Research', category: 'Research & Innovation', color: '#3b82f6' },
  { title: 'Outstanding Student Leader', semester: '1st Sem 2024–2025', badge: 'Leadership', category: 'Student Affairs', color: '#10b981' }
])
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-body { padding: 22px; }
.awards-list { display: flex; flex-direction: column; gap: 12px; }
.award-row { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #f0e8e0; border-radius: 14px; transition: all 0.15s; }
.award-row:hover { border-color: #FF6B1A; background: #fffaf8; }
.award-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.award-icon svg { width: 24px; height: 24px; }
.award-info { flex: 1; }
.award-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.award-meta { font-size: 12px; color: #b89f90; margin-top: 3px; }
.award-badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 7px; white-space: nowrap; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; }
.empty-state p { font-size: 14px; color: #b89f90; }
</style>