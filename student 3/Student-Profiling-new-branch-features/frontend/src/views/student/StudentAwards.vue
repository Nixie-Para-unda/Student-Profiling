<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Awards & Recognition</h2>
        <p class="page-sub">All your academic and extracurricular achievements.</p>
      </div>
      <button class="primary-btn" @click="showApplyModal = true">
        <svg viewBox="0 0 20 20" fill="none" style="width: 16px; height: 16px;"><path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Apply for Award
      </button>
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
            <span class="award-badge" :style="{ background: award.status === 'Pending' ? '#fffbeb' : award.color + '18', color: award.status === 'Pending' ? '#d97706' : award.color }">
              {{ award.status === 'Pending' ? 'Pending Approval' : award.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showApplyModal" class="modal-overlay" @click.self="!submitting && (showApplyModal = false)">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>Submit Achievement</h3>
            <p class="modal-sub">Apply to have an award or certification recognized.</p>
          </div>
          <button class="close-btn" @click="showApplyModal = false" :disabled="submitting">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Award Category <span class="req">*</span></label>
            <select v-model="form.category">
              <option value="">Select a category...</option>
              <option value="Academic">Academic Excellence</option>
              <option value="Leadership">Leadership & Service</option>
              <option value="Research">Research & Innovation</option>
              <option value="Athletics">Athletics & Sports</option>
              <option value="Other">Other Certification</option>
            </select>
          </div>

          <div class="form-group">
            <label>Award/Achievement Title <span class="req">*</span></label>
            <input v-model="form.title" type="text" placeholder="e.g., Best Research Paper" />
          </div>

          <div class="form-group">
            <label>Description & Context</label>
            <textarea v-model="form.description" rows="3" placeholder="Briefly describe the award or event..."></textarea>
          </div>

          <div class="form-group">
            <label>Proof / Certificate <span class="req">*</span></label>
            <div class="file-upload-box">
              <input type="file" @change="handleFileUpload" accept=".pdf,.jpg,.png" id="cert-upload" class="file-input" />
              <label for="cert-upload" class="file-label">
                <svg viewBox="0 0 20 20" fill="none" style="width:24px;height:24px;margin-bottom:8px;color:#FF6B1A"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1m-4-8l-4-4-4 4m4-4v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>{{ form.fileName || 'Click to upload PDF or Image' }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="showApplyModal = false" :disabled="submitting">Cancel</button>
          <button class="primary-btn" @click="submitApplication" :disabled="submitting || !form.category || !form.title">
            <span v-if="submitting" class="spinner-sm"></span>
            {{ submitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const showApplyModal = ref(false)
const submitting = ref(false)

const form = ref({
  category: '',
  title: '',
  description: '',
  file: null,
  fileName: ''
})

const awards = ref([
  { title: "Dean's List Awardee", semester: '1st Sem 2025–2026', badge: 'Academic', category: 'Academic Excellence', color: '#f59e0b', status: 'Approved' },
  { title: 'Best Research Paper', semester: '2nd Sem 2024–2025', badge: 'Research', category: 'Research & Innovation', color: '#3b82f6', status: 'Approved' },
  { title: 'Outstanding Student Leader', semester: '1st Sem 2024–2025', badge: 'Leadership', category: 'Student Affairs', color: '#10b981', status: 'Approved' }
])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
    form.value.fileName = file.name
  }
}

const submitApplication = () => {
  submitting.value = true
  
  // Simulate an API call to the backend
  setTimeout(() => {
    // Add the pending award to the frontend list for immediate feedback
    awards.value.unshift({
      title: form.value.title,
      semester: 'Current Semester',
      badge: form.value.category,
      category: form.value.category + ' (Pending)',
      color: '#9ca3af',
      status: 'Pending'
    })
    
    // Reset form and close modal
    form.value = { category: '', title: '', description: '', file: null, fileName: '' }
    submitting.value = false
    showApplyModal.value = false
    
    alert('Achievement application submitted successfully! It is now pending review.')
  }, 800)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.pcard { background: #fff; border: 1px solid #f0e8e0; border-radius: 20px; overflow: hidden; }
.pcard-body { padding: 22px; }

/* Buttons */
.primary-btn { background: #FF6B1A; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
.primary-btn:hover:not(:disabled) { background: #e85500; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,107,26,0.2); }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; }

/* List */
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

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 500px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 24px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.modal-body { padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }

/* Forms */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 700; color: #1a0a00; }
.req { color: #ef4444; }
.form-group input[type="text"], .form-group select, .form-group textarea { padding: 12px 14px; border: 1.5px solid #f0e8e0; border-radius: 12px; font-size: 13px; font-family: 'Outfit', sans-serif; outline: none; transition: all 0.2s; background: #faf8f6; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }

/* File Upload */
.file-upload-box { border: 2px dashed #f0e8e0; border-radius: 12px; background: #faf8f6; transition: all 0.2s; }
.file-upload-box:hover { border-color: #FF6B1A; background: #fffaf8; }
.file-input { display: none; }
.file-label { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; cursor: pointer; font-size: 13px; color: #9a8070; font-weight: 500; text-align: center; }

.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>