<template>
  <div class="page">
    <div class="page-header">
      <div><h2 class="page-title">Affiliations</h2><p class="page-sub">Your organization memberships and roles.</p></div>
      <button class="primary-btn" @click="showForm = !showForm">+ Add Affiliation</button>
    </div>
    <div v-if="showForm" class="pcard form-card">
      <div class="pcard-header"><h3>New Affiliation</h3></div>
      <div class="pcard-body">
        <div class="form-grid">
          <div class="form-group">
            <label>Organization</label>
            <select v-model="form.org_id">
              <option value="">Select Organization</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organization_name }}</option>
            </select>
          </div>
          <div class="form-group"><label>Role / Position</label><input v-model="form.role" type="text" placeholder="e.g. Member" /></div>
          <div class="form-group"><label>Date Joined</label><input v-model="form.dateJoined" type="date" /></div>
        </div>
        <div class="form-actions">
          <button class="primary-btn" @click="addAffiliation">Save</button>
          <button class="ghost-btn" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>
    <div class="pcard">
      <div class="pcard-body">
        <div v-if="affiliations.length === 0" class="empty-state">No affiliations recorded yet.</div>
        <div v-else class="affil-list">
          <div class="affil-row" v-for="aff in affiliations" :key="aff.id">
            <div class="affil-avatar" :style="{ background: aff.color }">{{ aff.name.charAt(0) }}</div>
            <div class="affil-info">
              <p class="affil-name">{{ aff.name }}</p>
              <p class="affil-role">{{ aff.role }}</p>
            </div>
            <span class="affil-since">Since {{ aff.since }}</span>
            <span class="status-badge" :class="aff.status === 'Active' ? 'st-active' : 'st-inactive'">{{ aff.status }}</span>
            <button class="delete-btn" @click="removeAffiliation(aff.id)">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const showForm = ref(false)
const organizations = ref([])
const affiliations = ref([])
const loading = ref(true)

const form = ref({ 
  org_id: '', 
  role: '', 
  dateJoined: '', 
})

const colors = ['#FF6B1A','#3b82f6','#10b981','#f59e0b','#8b5cf6']

const fetchData = async () => {
  loading.value = true
  try {
    const [orgsRes, profileRes] = await Promise.all([
      axios.get('/student/organizations'),
      axios.get('/student/profile')
    ])
    organizations.value = orgsRes.data
    affiliations.value = profileRes.data.organizations.map((aff, idx) => ({
      ...aff,
      name: aff.organization.organization_name,
      since: new Date(aff.dateJoined).getFullYear(),
      status: aff.dateLeft ? 'Inactive' : 'Active',
      color: colors[idx % colors.length]
    }))
  } catch (err) {
    console.error('Failed to fetch affiliations:', err)
  } finally {
    loading.value = false
  }
}

const addAffiliation = async () => {
  if (!form.value.org_id || !form.value.role || !form.value.dateJoined) return
  try {
    const response = await axios.post('/student/affiliations', form.value)
    alert('Affiliation added successfully!')
    showForm.value = false
    form.value = { org_id: '', role: '', dateJoined: '' }
    fetchData()
  } catch (err) {
    console.error('Failed to add affiliation:', err)
    alert('Error adding affiliation.')
  }
}

const removeAffiliation = async (id) => {
  if (!confirm('Are you sure you want to remove this affiliation?')) return
  try {
    await axios.delete(`/student/affiliations/${id}`)
    fetchData()
  } catch (err) {
    console.error('Failed to remove affiliation:', err)
    alert('Error removing affiliation.')
  }
}

onMounted(fetchData)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.primary-btn:hover { background: #e85500; }
.ghost-btn { background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-header { padding: 18px 22px; border-bottom: 1px solid #faf8f6; }
.pcard-header h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.pcard-body { padding: 22px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'DM Sans', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; }
.form-group input:focus, .form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.form-actions { display: flex; gap: 10px; }
.affil-list { display: flex; flex-direction: column; gap: 12px; }
.affil-row { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid #f0e8e0; border-radius: 14px; transition: all 0.15s; }
.affil-row:hover { border-color: #FF6B1A; background: #fffaf8; }
.affil-avatar { width: 44px; height: 44px; border-radius: 12px; color: #fff; font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.affil-info { flex: 1; }
.affil-name { font-size: 14px; font-weight: 600; color: #1a0a00; }
.affil-role { font-size: 12px; color: #b89f90; margin-top: 2px; }
.affil-since { font-size: 11px; color: #9a8070; white-space: nowrap; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-inactive { background: #f3f4f6; color: #6b7280; }
.delete-btn { background: none; border: none; color: #e11d48; font-size: 20px; cursor: pointer; line-height: 1; padding: 0 4px; }
.empty-state { text-align: center; padding: 60px; color: #b89f90; font-size: 13px; font-style: italic; }
</style>