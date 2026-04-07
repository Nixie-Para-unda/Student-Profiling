<template>
  <div class="wrap">
    <!-- Main Calendar -->
    <div class="main">
      <!-- Calendar Grid -->
      <div class="cal-area">
        <div class="cal-inner">
          <!-- Day Headers -->
          <div class="day-headers">
            <div class="time-spacer"></div>
            <div
              v-for="(day, i) in DAYS"
              :key="day"
              class="dh"
              :class="{ today: isToday(i) }"
            >
              <span class="dh-name">{{ day.slice(0, 3) }}</span>
              <span class="dh-num">{{ weekDates[i] }}</span>
            </div>
          </div>

          <!-- Time Grid -->
          <div class="time-grid">
            <div class="time-col">
              <div v-for="t in TIMES" :key="t" class="t-label">{{ t }}</div>
            </div>
            <div class="grid-cols" ref="gridRef">
              <!-- Background cells -->
              <div v-for="(day, di) in DAYS" :key="'col-' + di" class="g-col">
                <div v-for="t in TIMES" :key="t" class="g-cell"></div>
              </div>

              <!-- Event blocks -->
              <div
                v-for="ev in events"
                :key="ev.id"
                class="evt"
                :style="getEventStyle(ev)"
                @click="selectedId = selectedId === ev.id ? null : ev.id"
              >
                <div class="evt-name">{{ ev.name }}</div>
                <div class="evt-time">{{ ev.start }} - {{ ev.end }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="right">
      <!-- Mini Calendar -->
      <div class="mini-cal">
        <div class="mini-hdr">
          <h3>August 2020</h3>
          <div class="mini-nav">
            <button>&#8249;</button>
            <button>&#8250;</button>
          </div>
        </div>
        <div class="mini-days">
          <span v-for="d in ['M','T','W','T','F','S','S']" :key="d + Math.random()">{{ d }}</span>
        </div>
        <div class="mini-grid">
          <span
            v-for="(d, i) in MONTH_DATES"
            :key="i"
            :class="{
              empty: d === null,
              cur: d === currentHighlight,
              hi: d !== null && weekDates.includes(d) && d !== currentHighlight
            }"
            @click="d && (miniSelected = d)"
          >{{ d }}</span>
        </div>
      </div>

      <!-- Class List -->
      <div class="class-list">
        <div class="cl-hdr">
          <h3>Class list</h3>
          <a href="#" @click.prevent>View all</a>
        </div>
        <div class="cl-sub">Today, Aug 14</div>
        <div
          v-for="ev in todayEvents"
          :key="'card-' + ev.id"
          class="cl-card"
          :style="{ background: ev.bg }"
          :class="{ 'card-active': selectedId === ev.id }"
          @click="selectedId = selectedId === ev.id ? null : ev.id"
        >
          <div class="cl-card-inner">
            <div class="cl-dot" :style="{ background: ev.fg, opacity: 0.6 }"></div>
            <div class="cl-info">
              <h4 :style="{ color: ev.fg }">{{ ev.name }}</h4>
              <p :style="{ color: ev.fg }">{{ ev.start }} - {{ ev.end }}</p>
            </div>
          </div>
          <div class="cl-arr" :style="{ color: ev.fg, opacity: 0.5 }">&#8250;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const TIMES = ['7 AM','8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM']
const CELL_H   = 72   // px per hour
const START_HR  = 7   // grid starts at 7 AM
const TODAY_COL = 2   // Wednesday = index 2

const MONTH_DATES = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  31, null, null, null, null, null, null,
]

// ─── Event Data ───────────────────────────────────────────────────────────────
const events = ref([
  { id: 1, name: 'IT Elective',      code: 'IT 401', room: 'Room 301', day: 0, start: '7:30 AM',  end: '9:00 AM',  bg: '#FF9800', fg: '#fff'    },
  { id: 2, name: 'IT Elective',      code: 'IT 402', room: 'Room 302', day: 1, start: '8:30 AM',  end: '10:00 AM', bg: '#B2DFDB', fg: '#004D40' },
  { id: 3, name: 'IT Elective',      code: 'IT 403', room: 'Room 303', day: 2, start: '7:00 AM',  end: '10:00 AM', bg: '#29B6F6', fg: '#fff'    },
  { id: 4, name: 'Graphic Design',   code: 'GD 201', room: 'Lab 2',    day: 2, start: '10:30 AM', end: '12:00 PM', bg: '#66BB6A', fg: '#fff'    },
  { id: 5, name: 'Event Faculty',    code: 'EF 101', room: 'Room 105', day: 3, start: '10:30 AM', end: '12:00 PM', bg: '#FFA726', fg: '#fff'    },
  { id: 6, name: 'Class Exhibition', code: 'CE 301', room: 'Hall A',   day: 0, start: '1:00 PM',  end: '2:30 PM',  bg: '#EF9A9A', fg: '#7f0000' },
  { id: 7, name: 'Design Review',    code: 'DR 201', room: 'Studio 1', day: 1, start: '1:30 PM',  end: '3:00 PM',  bg: '#FF8A65', fg: '#fff'    },
  { id: 8, name: 'English Exam',     code: 'EN 102', room: 'Room 201', day: 4, start: '1:00 PM',  end: '2:30 PM',  bg: '#FFF176', fg: '#5d4037' },
  { id: 9, name: 'Workshop',         code: 'WS 101', room: 'Lab 3',    day: 5, start: '10:00 AM', end: '12:00 PM', bg: '#CE93D8', fg: '#4a148c' },
])

// ─── State ────────────────────────────────────────────────────────────────────
const weekOffset  = ref(0)
const selectedId  = ref(null)
const miniSelected = ref(14)


// ─── Computed ─────────────────────────────────────────────────────────────────
const weekDates = computed(() =>
  DAYS.map((_, i) => 12 + weekOffset.value * 7 + i)
)

const dateRangeLabel = computed(() =>
  `${weekDates.value[0]}-${weekDates.value[6]} Aug 2020`
)

const currentHighlight = computed(() =>
  weekDates.value[TODAY_COL]
)

const todayEvents = computed(() =>
  events.value.filter(e => e.day === TODAY_COL)
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toMins(timeStr) {
  const [time, mod] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (!m) m = 0
  if (mod === 'PM' && h !== 12) h += 12
  if (mod === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function getEventStyle(ev) {
  const startMins = toMins(ev.start)
  const endMins   = toMins(ev.end)
  const top       = ((startMins - START_HR * 60) / 60) * CELL_H
  const height    = ((endMins - startMins) / 60) * CELL_H - 4
  const isActive  = selectedId.value === ev.id

  return {
    position:   'absolute',
    top:        `${top}px`,
    height:     `${height}px`,
    left:       `calc(${ev.day} * (100% / 7) + 5px)`,
    width:      `calc(100% / 7 - 10px)`,
    background: ev.bg,
    color:      ev.fg,
    zIndex:     isActive ? 50 : 1,
    outline:    isActive ? '2px solid #1976D2' : 'none',
    outlineOffset: '1px',
  }
}

function isToday(colIdx) {
  return colIdx === TODAY_COL && weekOffset.value === 0
}

function shiftWeek(dir) {
  weekOffset.value += dir
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.wrap {
  display: flex;
  height: 100vh;
  min-height: 680px;
  background: #F8F9FB;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  color: #1A1C1E;
  overflow: hidden;
}

/* ── Main ── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Calendar area ── */
.cal-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.cal-inner { flex: 1; overflow-y: auto; }

/* Day headers */
.day-headers {
  display: grid;
  grid-template-columns: 64px repeat(7, 1fr);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #F1F5F9;
}
.time-spacer { width: 64px; }

.dh {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 8px;
}
.dh-name {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.dh-num {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.dh.today .dh-num { background: #F97316; color: #fff; }

/* Time grid */
.time-grid { display: flex; }
.time-col { width: 64px; flex-shrink: 0; }
.t-label {
  height: 72px;
  font-size: 11px;
  color: #94A3B8;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
}

.grid-cols {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
}
.g-col { }
.g-cell {
  height: 72px;
  border-right: 1px solid #F1F5F9;
  border-bottom: 1px solid #F1F5F9;
}

/* Event blocks */
.evt {
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.15s, outline 0.15s;
}
.evt:hover { opacity: 0.85; }
.evt-name { font-size: 12px; font-weight: 700; }
.evt-time { font-size: 11px; opacity: 0.75; margin-top: 2px; }

/* ── Right panel ── */
.right {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid #E9EDF5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mini calendar */
.mini-cal {
  padding: 20px 18px 16px;
  border-bottom: 1px solid #F1F5F9;
  flex-shrink: 0;
}
.mini-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.mini-hdr h3 { font-size: 14px; font-weight: 700; }
.mini-nav { display: flex; gap: 4px; }
.mini-nav button {
  background: none;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  font-size: 16px;
  padding: 0 4px;
}

.mini-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
}
.mini-days span {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #CBD5E1;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.mini-grid span {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  color: #475569;
  transition: background 0.15s;
}
.mini-grid span:not(.empty):hover { background: #f1f5f9; }
.mini-grid span.cur  { background: #F97316 !important; color: #fff !important; }
.mini-grid span.hi   { color: #F97316; }
.mini-grid span.empty { cursor: default; color: transparent; }

/* Class list */
.class-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
}
.cl-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.cl-hdr h3 { font-size: 14px; font-weight: 700; }
.cl-hdr a  { font-size: 11px; color: #F97316; font-weight: 600; text-decoration: none; }
.cl-sub    { font-size: 11px; color: #94A3B8; margin-bottom: 14px; }

.cl-card {
  display: flex;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
  cursor: pointer;
  transition: opacity 0.15s, outline 0.15s;
}
.cl-card:hover { opacity: 0.85; }
.cl-card.card-active { outline: 2px solid #1976D2; }

.cl-card-inner {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 12px 14px;
  gap: 10px;
}
.cl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cl-info h4 { font-size: 13px; font-weight: 700; margin: 0; }
.cl-info p  { font-size: 11px; margin: 2px 0 0; opacity: 0.8; }
.cl-arr     { padding: 12px 10px 12px 0; font-size: 16px; }
</style>