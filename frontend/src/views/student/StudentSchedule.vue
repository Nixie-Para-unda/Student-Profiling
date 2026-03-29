<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Class Schedule</h2>
        <p class="page-sub">2nd Semester · Academic Year 2026–2027</p>
      </div>
    </div>

    <div class="calendar-card">
      <div class="calendar-wrapper">
        <div class="calendar-grid">
          <!-- Header: Days -->
          <div class="time-header"></div>
          <div v-for="day in days" :key="day" class="day-header">{{ day }}</div>

          <!-- Time Labels and Grid Background -->
          <template v-for="(time, tIdx) in timeLabels" :key="time">
            <div class="time-label">{{ time }}</div>
            <div v-for="day in days" :key="day + time" class="grid-cell"></div>
          </template>

          <!-- Schedule Items (Dynamic) -->
          <div 
            v-for="(item, index) in formattedSchedule" 
            :key="index"
            class="schedule-item"
            :style="getItemStyle(item)"
          >
            <div class="item-content">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-meta">
                <span class="item-code">{{ item.code }}</span>
                <span class="item-sep">|</span>
                <span class="item-room">{{ item.room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Generate time labels from 7:00 AM to 8:30 PM in 30-minute increments
const timeLabels = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', 
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
]

// Empty schedule for user to fill with real data
const schedule = ref([])

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0
  const [time, modifier] = timeStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (!minutes) minutes = 0
  if (hours === 12) hours = 0
  if (modifier === 'PM') hours += 12
  return hours * 60 + minutes
}

const START_MINUTES = 7 * 60 // 7:00 AM
const MINUTES_PER_ROW = 15 // 15-minute increments for better precision

const formattedSchedule = computed(() => {
  return schedule.value.map(item => {
    const start = timeToMinutes(item.startTime)
    const end = timeToMinutes(item.endTime)
    const duration = end - start
    
    // grid-row: starts at 2 (1 is header)
    const startRow = Math.floor((start - START_MINUTES) / MINUTES_PER_ROW) + 2
    const rowSpan = Math.floor(duration / MINUTES_PER_ROW)
    const colIndex = days.indexOf(item.day) + 2 // +1 for time column, +1 for 1-based index
    
    return {
      ...item,
      gridArea: `${startRow} / ${colIndex} / span ${rowSpan} / ${colIndex}`
    }
  })
})

const getItemStyle = (item) => ({
  gridArea: item.gridArea,
  backgroundColor: item.color || '#FF6B1A',
  borderLeft: `3px solid rgba(0,0,0,0.15)`
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page { display: flex; flex-direction: column; gap: 16px; font-family: 'Outfit', sans-serif; height: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 4px 0; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 12px; color: #b89f90; margin-top: 2px; }

.calendar-card {
  background: #fff;
  border: 1px solid #f0e8e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.calendar-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

.calendar-grid {
  display: grid;
  grid-template-columns: 70px repeat(7, 1fr);
  /* 14 hours * 4 slots = 56 rows + 1 header */
  grid-template-rows: 40px repeat(56, 24px); 
  min-width: 1000px;
}

.time-header {
  background: #faf8f6;
  border-bottom: 1px solid #f0e8e0;
  border-right: 1px solid #f0e8e0;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 21;
}

.day-header {
  background: #faf8f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #6b7280;
  border-bottom: 1px solid #f0e8e0;
  border-right: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 20;
}

.time-label {
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  border-right: 1px solid #f0e8e0;
  grid-row: span 2;
  background: #fff;
  position: sticky;
  left: 0;
  z-index: 10;
  border-bottom: 1px solid #f3f4f6;
}

.grid-cell {
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f9fafb;
}

/* Hourly separators (stronger lines for full hours) */
.time-label:nth-of-type(odd) {
  border-bottom: 1px solid #f0e8e0;
}

.schedule-item {
  margin: 1px 2px;
  padding: 6px 8px;
  border-radius: 6px;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  z-index: 5;
  transition: transform 0.2s, box-shadow 0.2s;
}

.schedule-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 15;
}

.item-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  padding-top: 4px;
}

.item-name {
  font-weight: 700;
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 600;
  opacity: 0.95;
}

.item-sep {
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .calendar-grid {
    grid-template-columns: 60px repeat(7, 1fr);
    min-width: 800px;
  }
}
</style>