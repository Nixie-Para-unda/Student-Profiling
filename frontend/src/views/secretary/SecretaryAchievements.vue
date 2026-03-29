<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Achievement Verification</h2>
        <p class="page-sub">Review and verify student award nominations submitted by faculty.</p>
      </div>
    </div>

    <!-- Mini Stats -->
    <div class="mini-stats">
      <div class="mini-stat" v-for="s in miniStats" :key="s.label">
        <span class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="mini-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button v-for="tab in tabs" :key="tab.key" class="filter-tab" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
        {{ tab.label }}
        <span class="tab-count" v-if="tab.count > 0">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Achievement Cards -->
    <div class="achievements-list">
      <div class="ach-card" v-for="ach in filteredAchievements" :key="ach.id">
        <div class="ach-left">
          <div class="ach-icon" :style="{ background: ach.color + '18', color: ach.color }">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14.5l-5 3.5 2-6L2 8h6l2-6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
          </div>
          <div class="ach-info">
            <p class="ach-title">{{ ach.award }}</p>
            <p class="ach-student">{{ ach.student }} · {{ ach.course }}</p>
            <p class="ach-meta">Submitted by {{ ach.submittedBy }} · {{ ach.date }}</p>
          </div>
        </div>
        <div class="ach-right">
          <span class="category-badge" :style="{ background: ach.color + '18', color: ach.color }">{{ ach.category }}</span>
          <span class="ach-status" :class="'ach-' + ach.status">{{ ach.status }}</span>
          <div class="ach-actions" v-if="ach.status === 'pending'">
            <button class="approve-btn" @click="updateStatus(ach, 'approved')">
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Approve
            </button>
            <button class="reject-btn" @click="updateStatus(ach, 'rejected')">
              <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              Reject
            </button>
          </div>
          <div v-else class="ach-resolved">
            <svg v-if="ach.status === 'approved'" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#16a34a" stroke-width="1.3"/><path d="M5 8l2 2 4-4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" stroke-width="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>{{ ach.status === 'approved' ? 'Approved' : 'Rejected' }}</span>
          </div>
        </div>
      </div>
      <div v-if="filteredAchievements.length === 0" class="empty-state">
        <svg viewBox="0 0 48 48" fill="none" style="width:40px;height:40px"><path d="M24 4l4.5 13.5H43l-11.5 8.5 4.5 13.5L24 31.5l-12 8 4.5-13.5L5 17.5h14.5L24 4z" stroke="#f0e8e0" stroke-width="2" stroke-linejoin="round"/></svg>
        <p>No achievements in this category.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('pending')

const achievements = ref([
  { id: 1, award: "Dean's List Nomination", student: 'Aira Mae Reyes', course: 'BSCS 3-A', category: 'Academic', submittedBy: 'Dr. R. Villanueva', date: 'Mar 10, 2026', status: 'pending', color: '#f59e0b' },
  { id: 2, award: 'Best Research Paper', student: 'Jose Miguel Cruz', course: 'BSIT 3-A', category: 'Research', submittedBy: 'Prof. A. Reyes', date: 'Mar 11, 2026', status: 'pending', color: '#3b82f6' },
  { id: 3, award: 'Leadership Award', student: 'Katrina Villanueva', course: 'BSCS 2-B', category: 'Leadership', submittedBy: 'Prof. L. Garcia', date: 'Mar 12, 2026', status: 'pending', color: '#10b981' },
  { id: 4, award: "Dean's List Nomination", student: 'Mark Dela Cruz', course: 'BSCS 4-A', category: 'Academic', submittedBy: 'Dr. J. Cruz', date: 'Mar 13, 2026', status: 'pending', color: '#f59e0b' },
  { id: 5, award: 'Outstanding Student Leader', student: 'Paolo Reyes', course: 'BSIT 2-A', category: 'Leadership', submittedBy: 'Prof. A. Reyes', date: 'Mar 5, 2026', status: 'approved', color: '#8b5cf6' },
  { id: 6, award: 'Best Thesis Proposal', student: 'Carla Santos', course: 'BSCS 4-B', category: 'Research', submittedBy: 'Dr. R. Villanueva', date: 'Mar 3, 2026', status: 'rejected', color: '#ef4444' }
])

const tabs = computed(() => [
  { key: 'all', label: 'All', count: 0 },
  { key: 'pending', label: 'Pending', count: achievements.value.filter(a => a.status === 'pending').length },
  { key: 'approved', label: 'Approved', count: 0 },
  { key: 'rejected', label: 'Rejected', count: 0 }
])

const filteredAchievements = computed(() => {
  if (activeTab.value === 'all') return achievements.value
  return achievements.value.filter(a => a.status === activeTab.value)
})

const miniStats = computed(() => [
  { label: 'Total Submitted', value: achievements.value.length, color: '#FF6B1A' },
  { label: 'Pending', value: achievements.value.filter(a => a.status === 'pending').length, color: '#f59e0b' },
  { label: 'Approved', value: achievements.value.filter(a => a.status === 'approved').length, color: '#16a34a' },
  { label: 'Rejected', value: achievements.value.filter(a => a.status === 'rejected').length, color: '#ef4444' }
])

const updateStatus = (ach, status) => { ach.status = status }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 14px; padding: 14px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.mini-stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.filter-tabs { display: flex; gap: 6px; background: #faf8f6; padding: 6px; border-radius: 14px; border: 1px solid #f0e8e0; width: fit-content; }
.filter-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; background: none; border-radius: 9px; font-size: 13px; font-weight: 600; color: #9a8070; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
.filter-tab.active { background: #1a0a00; color: #fff; }
.filter-tab:hover:not(.active) { background: #fff; color: #1a0a00; }
.tab-count { background: #FF6B1A; color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 5px; }
.achievements-list { display: flex; flex-direction: column; gap: 12px; }
.ach-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.15s; }
.ach-card:hover { border-color: #FF6B1A; background: #fffaf8; }
.ach-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.ach-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ach-icon svg { width: 22px; height: 22px; }
.ach-info { min-width: 0; }
.ach-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.ach-student { font-size: 12px; color: #9a8070; margin-top: 2px; }
.ach-meta { font-size: 11px; color: #b89f90; margin-top: 2px; }
.ach-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.category-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.ach-status { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.ach-pending { background: #fffbeb; color: #d97706; }
.ach-approved { background: #f0fdf4; color: #16a34a; }
.ach-rejected { background: #fff1f2; color: #e11d48; }
.ach-actions { display: flex; gap: 8px; }
.approve-btn { display: flex; align-items: center; gap: 5px; background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
.approve-btn:hover { background: #16a34a; color: #fff; }
.approve-btn svg { width: 13px; height: 13px; }
.reject-btn { display: flex; align-items: center; gap: 5px; background: #fff1f2; color: #ef4444; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
.reject-btn:hover { background: #ef4444; color: #fff; }
.reject-btn svg { width: 13px; height: 13px; }
.ach-resolved { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9a8070; }
.ach-resolved svg { width: 16px; height: 16px; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px; color: #b89f90; font-size: 13px; }
</style>