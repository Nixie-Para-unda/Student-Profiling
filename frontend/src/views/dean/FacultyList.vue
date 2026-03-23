<template>
  <div class="faculty-page">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1>Faculty Dashboard</h1>
        <p>Manage faculty, subjects, and teaching loads</p>
      </div>
      <div class="actions">
        <button v-if="authStore.isDean" class="btn outline" @click="showCourseModal = true">+ Course</button>
        <button v-if="authStore.isDean" class="btn primary" @click="showAddModal = true">+ Faculty</button>
      </div>
    </div>

    <!-- ADDED: SEARCH + FILTER -->
    <div class="toolbar">
      <input v-model="search" placeholder="Search faculty..." />
      <select v-model="statusFilter">
        <option value="">All</option>
        <option value="Normal">Normal</option>
        <option value="Overloaded">Overloaded</option>
      </select>
    </div>

    <!-- GRID -->
    <div class="grid">
      <div class="card" v-for="prof in filteredFaculty" :key="prof.id">
        <div class="card-header">
          <div class="avatar">{{ prof.initials }}</div>
          <div>
            <h3>{{ prof.name }}</h3>
            <p>{{ prof.expertise }}</p>
            <!-- ADDED STATUS BADGE -->
            <span class="status" :class="prof.load >= 30 ? 'danger' : 'ok'">
              {{ prof.load >= 30 ? 'Overloaded' : 'Normal' }}
            </span>
          </div>
        </div>

        <div class="load">
          <span>{{ prof.load }}/30 hrs</span>
          <div class="bar">
            <div class="fill" :style="{ width: (prof.load/30*100)+'%' }"></div>
          </div>
        </div>

        <div class="subjects">
          <span v-for="s in prof.subjects" :key="s" class="tag">{{ s }}</span>
        </div>

        <button v-if="authStore.isDean" class="assign" @click="openAssignModal(prof)">
          Assign Course
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const faculty = ref([])
const search = ref('')

// ADDED FILTER
const statusFilter = ref('')

const filteredFaculty = computed(() => {
  return faculty.value.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value
      ? (statusFilter.value === 'Overloaded' ? f.load >= 30 : f.load < 30)
      : true
    return matchesSearch && matchesStatus
  })
})

const fetchFaculty = async () => {
  const res = await axios.get('/faculty')
  faculty.value = res.data.map(f => ({
    id: f.id,
    name: `Prof. ${f.first_name} ${f.last_name}`,
    expertise: f.position,
    initials: f.first_name[0] + f.last_name[0],
    load: f.load || 0,
    subjects: f.subject_loads
      ? f.subject_loads.map(l => l.subject.subject_code)
      : []
  }))
}

onMounted(fetchFaculty)
</script>

<style scoped>
.faculty-page {
  padding: 24px;
  background: #ffffff;
  color: #000;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  color: #ff6b1a;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.btn.primary {
  background: #ff6b1a;
  color: white;
  border: none;
}

.btn.outline {
  border: 2px solid #ff6b1a;
  color: #ff6b1a;
  background: transparent;
}

/* ADDED toolbar improvement */
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toolbar input,
.toolbar select {
  padding: 12px;
  border: 2px solid #000;
  border-radius: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  border: 2px solid #000;
  border-radius: 16px;
  padding: 16px;
  background: #fff;
  transition: 0.2s;
}

.card:hover {
  transform: scale(1.02);
  border-color: #ff6b1a;
}

.card-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  background: #ff6b1a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
}

/* ADDED STATUS */
.status {
  display: inline-block;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 4px;
  font-weight: bold;
}

.status.ok {
  background: #000;
  color: #fff;
}

.status.danger {
  background: #ff6b1a;
  color: #fff;
}

.load {
  margin: 12px 0;
}

.bar {
  height: 6px;
  background: #000;
  border-radius: 4px;
}

.fill {
  height: 100%;
  background: #ff6b1a;
}

.subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #000;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
}

.assign {
  margin-top: 10px;
  width: 100%;
  background: #ff6b1a;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}
</style>