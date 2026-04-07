<template>
  <div class="schedule-container">
    <aside class="sidebar"></aside>

    <main class="main-content">
      <header class="header"></header>

      <div class="content-area">
        <div class="calendar-section">
          <div class="calendar-header">
            <div class="calendar-header-left">
              <h2>Schedule</h2>
              <div class="date-nav">
                <button class="nav-arrow" @click="prevWeek">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span class="current-date">{{ formattedDateRange }}</span>
                <button class="nav-arrow" @click="nextWeek">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="calendar-grid-wrapper">
            <div class="calendar-grid">
              <div class="day-headers">
                <div class="time-col-header"></div>
                <div 
                  v-for="(day, idx) in days" 
                  :key="day" 
                  class="day-header"
                  :class="{ 'is-today': isToday(idx) }"
                >
                  <span class="day-name">{{ day.substring(0, 3) }}</span>
                  <span class="day-date">{{ dayDates[idx] }}</span>
                </div>
              </div>

              <div class="time-grid">
                <div class="time-labels">
                  <div v-for="time in timeSlots" :key="time" class="time-label">
                    {{ time }}
                  </div>
                </div>

                <div class="grid-columns">
                  <div v-for="time in timeSlots" :key="'line-'+time" class="grid-line" :style="{ top: getLineTop(time) }"></div>
                  
                  <div v-for="(day, dayIdx) in days" :key="day" class="grid-column">
                    <div v-for="(time, timeIdx) in timeSlots" :key="timeIdx" class="grid-cell"></div>
                  </div>

                  <div 
                    v-for="item in schedule" 
                    :key="item.id" 
                    class="schedule-item"
                    :class="{ 'item-active': selectedId === item.id }"
                    :style="getItemStyle(item)"
                    @click="handleSelect(item.id)"
                  >
                    <div class="item-accent" :style="{ backgroundColor: getDarkerColor(item.color) }"></div>
                    <div class="item-content">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-info">{{ item.code }} • {{ item.room }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-panel">
          <div class="mini-calendar">
            <div class="mini-calendar-header">
              <h3>August 2020</h3>
              <div class="mini-nav">
                <button class="mini-nav-btn" @click="miniNavClick"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
                <button class="mini-nav-btn" @click="miniNavClick"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
              </div>
            </div>
            <div class="mini-calendar-days">
              <span v-for="day in miniDays" :key="day">{{ day[0] }}</span>
            </div>
            <div class="mini-calendar-grid">
              <span 
                v-for="(date, idx) in monthDates" 
                :key="idx" 
                :class="{ 
                  'empty': date === null, 
                  'current': date === miniSelectedDate,
                  'has-event': date && [12, 13, 14, 15, 16, 17, 18].includes(date)
                }"
                @click="date && (miniSelectedDate = date)"
              >
                {{ date }}
              </span>
            </div>
          </div>

          <div class="class-list">
            <div class="class-list-header">
              <h3>Today's Classes</h3>
              <a href="#" class="view-all" @click.prevent="alertAction('View All Classes')">View all</a>
            </div>
            <div class="class-cards">
              <div 
                v-for="item in todayClasses" 
                :key="item.id" 
                class="class-card clickable-card"
                :class="{ 'card-active': selectedId === item.id }"
                @click="handleSelect(item.id)"
              >
                <div class="card-indicator" :style="{ backgroundColor: item.color }"></div>
                <div class="class-card-details">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.startTime }} - {{ item.endTime }}</p>
                </div>
                <div class="card-action">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Interactive State
const selectedId = ref(null)
const miniSelectedDate = ref(14)
const dayDates = ref([12, 13, 14, 15, 16, 17, 18])

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']
const miniDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthDates = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  31, null, null, null, null, null, null
]

const schedule = ref([
  { id: '1', name: 'IT Elective', code: 'IT 401', room: 'Room 301', day: 'Monday', startTime: '7:30 AM', endTime: '9:00 AM', color: '#FFF3E0' },
  { id: '2', name: 'IT Elective', code: 'IT 402', room: 'Room 302', day: 'Tuesday', startTime: '8:30 AM', endTime: '10:00 AM', color: '#E8F5E9' },
  { id: '3', name: 'IT Elective', code: 'IT 403', room: 'Room 303', day: 'Wednesday', startTime: '7:00 AM', endTime: '10:00 AM', color: '#E1F5FE' },
  { id: '4', name: 'Graphic Design', code: 'GD 201', room: 'Lab 2', day: 'Wednesday', startTime: '10:30 AM', endTime: '12:00 PM', color: '#F1F8E9' },
  { id: '5', name: 'Event Faculty', code: 'EF 101', room: 'Room 105', day: 'Thursday', startTime: '10:30 AM', endTime: '12:00 PM', color: '#FFF8E1' },
  { id: '6', name: 'Class Exhibition', code: 'CE 301', room: 'Hall A', day: 'Monday', startTime: '1:00 PM', endTime: '2:30 PM', color: '#FFEBEE' },
  { id: '7', name: 'Design Review', code: 'DR 201', room: 'Studio 1', day: 'Tuesday', startTime: '1:30 PM', endTime: '3:00 PM', color: '#FBE9E7' },
  { id: '8', name: 'English Exam', code: 'EN 102', room: 'Room 201', day: 'Friday', startTime: '1:00 PM', endTime: '2:30 PM', color: '#FFFDE7' },
  { id: '9', name: 'Workshop', code: 'WS 101', room: 'Lab 3', day: 'Saturday', startTime: '10:00 AM', endTime: '12:00 PM', color: '#F3E5F5' }
])

// Computed for header text
const formattedDateRange = computed(() => {
  return `August ${dayDates.value[0]} - ${dayDates.value[6]}, 2020`
})

const todayClasses = computed(() => {
  return schedule.value.filter(item => item.day === 'Wednesday')
})

// Interaction Handlers
const handleSelect = (id) => {
  selectedId.value = selectedId.value === id ? null : id
}

const prevWeek = () => {
  dayDates.value = dayDates.value.map(d => d - 7)
}

const nextWeek = () => {
  dayDates.value = dayDates.value.map(d => d + 7)
}

const miniNavClick = () => alert('Navigating mini calendar month...')
const alertAction = (msg) => alert(msg)

const isToday = (idx) => {
  // Logic to highlight Wednesday 14th based on your static design
  return dayDates.value[idx] === 14;
}

const timeToRow = (timeStr) => {
  const [time, modifier] = timeStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (!minutes) minutes = 0
  if (hours === 12) hours = 0
  if (modifier === 'PM') hours += 12
  return (hours - 7) * 4 + Math.floor(minutes / 15)
}

const getLineTop = (time) => {
    const idx = timeSlots.indexOf(time);
    return `${idx * 80}px`;
}

const getDarkerColor = (color) => {
    const map = { '#FFF3E0': '#FFB74D', '#E8F5E9': '#81C784', '#E1F5FE': '#4FC3F7', '#F1F8E9': '#AED581', '#FFF8E1': '#FFD54F', '#FFEBEE': '#E57373', '#FBE9E7': '#FF8A65', '#FFFDE7': '#FFF176', '#F3E5F5': '#BA68C8' };
    return map[color] || color;
}

const getItemStyle = (item) => {
  const totalRows = timeToRow(item.startTime);
  const span = timeToRow(item.endTime) - totalRows;
  const colIdx = days.indexOf(item.day);
  
  return {
    backgroundColor: item.color,
    top: `${totalRows * 20}px`,
    height: `${span * 20 - 6}px`,
    left: `calc(${colIdx} * (100% / 7) + 6px)`,
    width: `calc(100% / 7 - 12px)`,
    position: 'absolute',
    border: selectedId.value === item.id ? '2px solid #6366f1' : 'none',
    zIndex: selectedId.value === item.id ? 50 : 1
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.schedule-container {
  display: flex;
  height: 100vh;
  background: #F8F9FB;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1A1C1E;
}

.sidebar { width: 72px; background: #FFF; border-right: 1px solid #E9EDF5; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.header { height: 60px; background: #FFF; border-bottom: 1px solid #E9EDF5; }
.content-area { padding: 24px; gap: 24px; overflow: hidden; display: flex; flex: 1; }

.calendar-section {
  flex: 1;
  background: #FFF;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  border: 1px solid #E9EDF5;
}

.calendar-header { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
.calendar-header h2 { font-size: 20px; font-weight: 700; }
.date-nav { display: flex; align-items: center; gap: 16px; margin-top: 4px; }
.current-date { font-weight: 600; color: #475569; font-size: 14px; }
.nav-arrow { background: none; border: 1px solid #E2E8F0; border-radius: 8px; padding: 4px; cursor: pointer; color: #64748B; transition: background 0.2s; }
.nav-arrow:hover { background: #f8fafc; }

.calendar-grid-wrapper { flex: 1; overflow-y: auto; padding: 0 16px 16px 16px; }

.day-headers {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  position: sticky;
  top: 0;
  background: #FFF;
  z-index: 20;
  padding-bottom: 12px;
}

.day-header { display: flex; flex-direction: column; align-items: center; padding: 12px 0; }
.day-name { font-size: 12px; font-weight: 600; color: #94A3B8; text-transform: uppercase; }
.day-date { 
    font-size: 18px; 
    font-weight: 700; 
    margin-top: 4px; 
    width: 36px; height: 36px; 
    display: flex; align-items: center; justify-content: center;
}

.is-today .day-date { background: #6366f1; color: #FFF; border-radius: 50%; }

.time-grid { position: relative; display: flex; }
.time-labels { width: 80px; }
.time-label { height: 80px; font-size: 12px; color: #94A3B8; font-weight: 600; display: flex; justify-content: center; }

.grid-columns { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); position: relative; }
.grid-cell { height: 80px; border-right: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; }
.grid-line { position: absolute; left: 0; right: 0; border-top: 1px solid #F1F5F9; pointer-events: none; }

.schedule-item {
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
  cursor: pointer;
}
.schedule-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.item-active { transform: scale(1.02); }

.item-accent { width: 4px; }
.item-content { padding: 10px; display: flex; flex-direction: column; gap: 2px; }
.item-name { font-weight: 700; font-size: 13px; color: #1E293B; }
.item-info { font-size: 11px; color: #64748B; font-weight: 500; }

.right-panel { width: 320px; display: flex; flex-direction: column; gap: 24px; }

.mini-calendar { background: #FFF; border-radius: 24px; padding: 24px; border: 1px solid #E9EDF5; }
.mini-calendar-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.mini-calendar-header h3 { font-size: 15px; font-weight: 700; }
.mini-nav-btn { background: none; border: none; cursor: pointer; color: #94A3B8; }

.mini-calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 12px; }
.mini-calendar-days span { text-align: center; font-size: 11px; font-weight: 700; color: #CBD5E1; }

.mini-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.mini-calendar-grid span { 
    height: 32px; display: flex; align-items: center; justify-content: center; 
    font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 8px;
    transition: all 0.2s;
}
.mini-calendar-grid span:not(.empty):hover { background: #f1f5f9; }
.mini-calendar-grid .current { background: #6366f1 !important; color: #FFF; }
.mini-calendar-grid .has-event { color: #6366f1; position: relative; }

.class-list { flex: 1; background: #FFF; border-radius: 24px; padding: 24px; border: 1px solid #E9EDF5; }
.class-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.class-list-header h3 { font-size: 15px; font-weight: 700; }
.view-all { font-size: 12px; color: #6366f1; font-weight: 600; text-decoration: none; }

.class-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  background: #F8FAFC;
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}
.class-card:hover { background: #f1f5f9; }
.card-active { border-color: #6366f1; background: #EEF2FF; }

.card-indicator { width: 10px; height: 10px; border-radius: 50%; }
.class-card-details h4 { font-size: 13px; font-weight: 700; margin: 0; }
.class-card-details p { font-size: 11px; color: #64748B; margin: 2px 0 0 0; }
</style>```