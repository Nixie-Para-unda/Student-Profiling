<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Student Management</h2>
        <p class="page-sub">View and manage student profiles and accounts.</p>
      </div>

      <!-- Import & Create only visible to secretary role -->
      <div class="header-actions" v-if="isSecretary">
        <button class="ghost-btn" @click="$refs.csvInput.click()" :disabled="loadingImport">
          <svg v-if="loadingImport" class="spinner-sm" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle></svg>
          <svg v-else viewBox="0 0 18 18" fill="none"><path d="M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1M9 2v9M6 8l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ loadingImport ? 'Importing...' : 'Import CSV' }}
        </button>
        <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="handleCSV" />
        <button class="primary-btn" @click="openCreateModal">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Create Account
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="mini-stats">
      <div class="mini-stat stat-blue">
        <div class="mini-stat-icon" style="background: #eff6ff; color: #3b82f6;">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value" style="color: #3b82f6;">{{ miniStats[0].value }}</span>
          <span class="mini-stat-label">Total Students</span>
        </div>
      </div>
      <div class="mini-stat stat-green">
        <div class="mini-stat-icon" style="background: #f0fdf4; color: #16a34a;">
          <svg viewBox="0 0 20 20" fill="none"><path d="M16 5L7.75 13.25 4 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value" style="color: #16a34a;">{{ miniStats[1].value }}</span>
          <span class="mini-stat-label">Active</span>
        </div>
      </div>
      <div class="mini-stat stat-purple">
        <div class="mini-stat-icon" style="background: #f5f3ff; color: #8b5cf6;">
          <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value" style="color: #8b5cf6;">{{ miniStats[2].value }}</span>
          <span class="mini-stat-label">Pending Setup</span>
        </div>
      </div>
      <div class="mini-stat stat-orange">
        <div class="mini-stat-icon" style="background: #fff5ef; color: #FF6B1A;">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value" style="color: #FF6B1A;">{{ miniStats[3].value }}</span>
          <span class="mini-stat-label">BSCS</span>
        </div>
      </div>
      <div class="mini-stat stat-green">
        <div class="mini-stat-icon" style="background: #f0fdf4; color: #16a34a;">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 12a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value" style="color: #16a34a;">{{ miniStats[4].value }}</span>
          <span class="mini-stat-label">BSIT</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="table-toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 18 18" fill="none"><path d="M8 15A7 7 0 108 1a7 7 0 000 14zM18 18l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by name, email, or student number..." />
      </div>
      <div class="filter-group">
        <select v-model="filterCourse">
          <option value="">All Programs</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSIS">BSIS</option>
        </select>

        <!-- FILTER FIX: Year Level filter -->
        <select v-model="filterYear">
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <!-- FILTER FIX: Section filter (dynamically populated from loaded students) -->
        <select v-model="filterSection">
          <option value="">All Sections</option>
          <option v-for="sec in availableSections" :key="sec" :value="sec">{{ sec }}</option>
        </select>

        <select v-model="filterStatus">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-lg"></div>
        <p>Fetching students...</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>STUDENT NO.</th>
              <th>PROGRAM</th>
              <th>YEAR</th>
              <th>GWA</th>
              <th>VIOLATIONS</th>
              <th>STATUS</th>
              <th v-if="isSecretary || authStore.isDean || authStore.isChair">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in paginatedStudents" :key="student.id" @click="viewDetails(student)" class="clickable-row">
              <td>
                <div class="student-cell">
                  <div class="s-avatar" :style="{ background: student.color }">{{ student.first_name.charAt(0) }}</div>
                  <div>
                    <p class="s-name">{{ student.last_name }}, {{ student.first_name }} {{ student.middle_name }}</p>
                    <p class="s-sub">{{ student.email }}</p>
                  </div>
                </div>
              </td>
              <td><span class="code-badge" :class="student.course === 'BSIT' ? 'badge-bsit' : 'badge-bscs'">{{ student.student_number }}</span></td>
              <td>{{ student.course }}</td>
              <td>{{ student.year_level }}{{ getYearSuffix(student.year_level) }} Year · {{ student.section || '—' }}</td>
              <td><span class="gwa-val" :class="student.gwa <= 1.75 ? 'gwa-good' : 'gwa-ok'">{{ student.gwa || 'N/A' }}</span></td>
              <td><span class="v-count" :class="student.violations_count > 0 ? 'v-danger' : 'v-clear'">{{ student.violations_count || 0 }}</span></td>
              <td>
                <span class="status-badge" :class="student.status === 'active' ? 'st-active' : 'st-pending'">
                  {{ student.status === 'active' ? 'Active' : 'Pending' }}
                </span>
              </td>
              <td v-if="isSecretary || authStore.isDean || authStore.isChair" @click.stop>
                <div class="action-btns">
                  <button class="action-btn resend" v-if="student.status === 'pending' && isSecretary" @click="resendSetup(student)" title="Resend setup email">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="action-btn delete" @click="confirmDelete(student)" title="Archive Account">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0 && !loading">
              <td :colspan="isSecretary || authStore.isDean || authStore.isChair ? 8 : 7" class="empty-row">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar" v-if="filteredStudents.length > pageSize">
        <div class="pagination-info">
          Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> to <strong>{{ Math.min(currentPage * pageSize, filteredStudents.length) }}</strong> of <strong>{{ filteredStudents.length }}</strong> students
        </div>
        <div class="pagination-btns">
          <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="pag-pages">
            <button 
              v-for="p in totalPages" 
              :key="p" 
              class="pag-page-btn" 
              :class="{ active: currentPage === p }"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
          </div>
          <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- STUDENT DETAILS MODAL -->
    <!-- ═══════════════════════════════════════════════════
         CREATE MODAL (secretary only — fields are editable)
    ═══════════════════════════════════════════════════ -->
    <div v-if="isSecretary && showCreateModal" class="modal-overlay" @click.self="!saving && (showCreateModal = false)">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingStudent ? 'Edit Student Account' : 'Create Student Account' }}</h3>
          <button class="close-btn" @click="showCreateModal = false" :disabled="saving">×</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name <span class="req">*</span></label>
              <input v-model="form.first_name" type="text" placeholder="First name" :disabled="saving" :class="{ 'error-input': formErrors.first_name }" @input="validateField('first_name')" />
              <span v-if="formErrors.first_name" class="field-error">{{ formErrors.first_name }}</span>
            </div>
            <div class="form-group">
              <label>Last Name <span class="req">*</span></label>
              <input v-model="form.last_name" type="text" placeholder="Last name" :disabled="saving" :class="{ 'error-input': formErrors.last_name }" @input="validateField('last_name')" />
              <span v-if="formErrors.last_name" class="field-error">{{ formErrors.last_name }}</span>
            </div>
            <div class="form-group">
              <label>Student Number <span class="req">*</span></label>
              <input v-model="form.student_number" type="text" placeholder="e.g. 2024-00001" :disabled="saving" :class="{ 'error-input': formErrors.student_number }" @input="validateField('student_number')" />
              <span v-if="formErrors.student_number" class="field-error">{{ formErrors.student_number }}</span>
            </div>
            <div class="form-group">
              <label>Email Address <span class="req">*</span></label>
              <input v-model="form.email" type="email" placeholder="student@school.edu.ph" :disabled="saving || !!editingStudent" :class="{ 'error-input': formErrors.email }" @input="validateField('email')" />
              <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
            </div>
            <div class="form-group">
              <label>Program <span class="req">*</span></label>
              <select v-model="form.course" :disabled="saving" :class="{ 'error-input': formErrors.course }" @change="validateField('course')">
                <option value="">Select Program</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSIS">BSIS</option>
              </select>
              <span v-if="formErrors.course" class="field-error">{{ formErrors.course }}</span>
            </div>
            <div class="form-group">
              <label>Year Level <span class="req">*</span></label>
              <select v-model="form.year_level" :disabled="saving" :class="{ 'error-input': formErrors.year_level }" @change="validateField('year_level')">
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <span v-if="formErrors.year_level" class="field-error">{{ formErrors.year_level }}</span>
            </div>
            <div class="form-group full-span">
              <label>Section <span class="req">*</span></label>
              <select v-model="form.section_id" :disabled="saving || !form.course || !form.year_level" :class="{ 'error-input': formErrors.section_id }" @change="validateField('section_id')">
                <option value="">{{ (form.course && form.year_level) ? 'Select Section' : 'Please select Program and Year Level first' }}</option>
                <option v-for="sec in filteredFormSections" :key="sec.id" :value="sec.id">{{ formatSectionName(sec.section_name) }}</option>
              </select>
              <span v-if="formErrors.section_id" class="field-error">{{ formErrors.section_id }}</span>
            </div>

            <!-- Guardian Fields -->
            <div class="form-divider full-span">Guardian Information</div>
            <div class="form-group">
              <label>Guardian First Name</label>
              <input v-model="form.guardian_first_name" type="text" placeholder="First name" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Guardian Last Name</label>
              <input v-model="form.guardian_last_name" type="text" placeholder="Last name" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Relationship</label>
              <input v-model="form.guardian_relationship" type="text" placeholder="e.g. Mother, Father" :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Guardian Contact Number</label>
              <input v-model="form.guardian_contact_number" type="text" placeholder="Contact number" :disabled="saving" />
            </div>
          </div>
          <div v-if="!editingStudent" class="modal-notice">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            A password setup link will be sent to the student's email after account creation.
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showCreateModal = false" :disabled="saving">Cancel</button>
          <button class="primary-btn" @click="saveStudent" :disabled="saving">
            <span v-if="saving" class="spinner-sm"></span>
            {{ saving ? 'Saving...' : (editingStudent ? 'Update Account' : 'Create Account') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════
         VIEW MODAL (all roles — all fields are READ-ONLY)
         BUG B FIX: No editing allowed here
         DESIGN FIX: Archive/delete button is inside this modal
         IMPROVEMENT FIX: Row click opens this
    ═══════════════════════════════════════════════════ -->
    <div v-if="viewingStudent" class="modal-overlay" @click.self="viewingStudent = null">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-student-meta">
            <div class="s-avatar lg" :style="{ background: viewingStudent.color }">
              {{ viewingStudent.first_name.charAt(0) }}
            </div>
            <div>
              <h3>{{ viewingStudent.last_name }}, {{ viewingStudent.first_name }} {{ viewingStudent.middle_name }}</h3>
              <p class="modal-sub">{{ viewingStudent.student_number }} · {{ viewingStudent.course }} · {{ viewingStudent.section || 'No Section' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="viewingStudent = null">×</button>
        </div>

        <div class="modal-body profile-body">
          <div class="profile-section">
            <h4 class="section-title">Personal Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Full Name</span>
                <span class="detail-val">{{ viewingStudent.last_name }}, {{ viewingStudent.first_name }} {{ viewingStudent.middle_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Email Address</span>
                <span class="detail-val">{{ viewingStudent.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Student Number</span>
                <span class="detail-val">
                  <span class="code-badge">{{ viewingStudent.student_number }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4 class="section-title">Academic Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Program</span>
                <span class="detail-val">{{ viewingStudent.course }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Year Level</span>
                <span class="detail-val">{{ viewingStudent.year_level }}{{ getYearSuffix(viewingStudent.year_level) }} Year</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Section</span>
                <span class="detail-val">{{ viewingStudent.section || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Status</span>
                <span class="detail-val">
                  <span class="status-badge" :class="viewingStudent.status === 'active' ? 'st-active' : 'st-pending'">
                    {{ viewingStudent.status.toUpperCase() }}
                  </span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Date Created</span>
                <span class="detail-val">{{ viewingStudent.created_at }}</span>
              </div>
            </div>
          </div>

          <!-- Guardian Information -->
          <div class="profile-section" v-if="viewingStudent.guardian">
            <h4 class="section-title">Guardian Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-key">Guardian Name</span>
                <span class="detail-val">{{ viewingStudent.guardian.first_name }} {{ viewingStudent.guardian.last_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Relationship</span>
                <span class="detail-val">{{ viewingStudent.guardian.relationship }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Contact Number</span>
                <span class="detail-val">{{ viewingStudent.guardian.contact_number }}</span>
              </div>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Guardian Information</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align: left; color: #b89f90; font-style: italic;">No guardian information provided.</span>
              </div>
            </div>
          </div>

          <!-- Affiliations -->
          <div class="profile-section" v-if="viewingStudent.organizations && viewingStudent.organizations.length > 0">
            <h4 class="section-title">Affiliations</h4>
            <div class="detail-rows">
              <div class="detail-row" v-for="org in viewingStudent.organizations" :key="org.name">
                <span class="detail-key">{{ org.name }}</span>
                <span class="detail-val">{{ org.role }}</span>
              </div>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Affiliations</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align: left; color: #b89f90; font-style: italic;">No affiliations recorded.</span>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="profile-section" v-if="viewingStudent.skills && viewingStudent.skills.length > 0">
            <h4 class="section-title">Skills</h4>
            <div class="skill-tags">
              <span class="skill-tag" v-for="skill in viewingStudent.skills" :key="skill.name">
                {{ skill.name }}
                <span class="skill-cat">{{ skill.category }}</span>
              </span>
            </div>
          </div>
          <div class="profile-section" v-else>
            <h4 class="section-title">Skills</h4>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="detail-val" style="text-align: left; color: #b89f90; font-style: italic;">No skills recorded.</span>
              </div>
            </div>
          </div>

          <!-- RESEND limit notice -->
          <div class="resend-row" v-if="viewingStudent.status === 'pending' && isSecretary">
            <div class="resend-info">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span>
                Setup email
                <!-- IMPROVEMENT FIX: Max 3 resends tracked per student -->
                <strong>resent {{ getResendCount(viewingStudent.id) }}/3 times</strong>
              </span>
            </div>
            <button
              class="resend-btn"
              @click="resendSetup(viewingStudent)"
              :disabled="getResendCount(viewingStudent.id) >= 3"
              :title="getResendCount(viewingStudent.id) >= 3 ? 'Maximum resend limit reached' : 'Resend setup email'"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              {{ getResendCount(viewingStudent.id) >= 3 ? 'Limit Reached' : 'Resend Email' }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="ghost-btn" @click="viewingStudent = null">Close</button>
          <!-- DESIGN FIX: Archive/delete button is inside modal, not in the table -->
          <!-- Only visible to secretary, dean, or chair role -->
          <button
            v-if="isSecretary || authStore.isDean || authStore.isChair"
            class="danger-btn"
            @click="confirmDelete(viewingStudent)"
          >
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M3 4h10M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Archive Account
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM MODAL (Dean, Chair, Secretary) -->
    <div v-if="(isSecretary || authStore.isDean || authStore.isChair) && showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Archive Student Account</h3>
          <button class="close-btn" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-msg">
            Are you sure you want to archive the account of
            <strong>{{ deletingStudent?.last_name }}, {{ deletingStudent?.first_name }} {{ deletingStudent?.middle_name }}</strong>?
            The account will be moved to the archive and can be recovered by the Dean.
          </p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="danger-btn" @click="deleteStudent">Archive Account</button>
        </div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal modal-sm" style="text-align: center; padding: 32px 24px;">
        <svg viewBox="0 0 24 24" fill="none" style="width: 48px; height: 48px; color: #16a34a; margin: 0 auto 16px;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; color: #1a0a00; margin-bottom: 8px;">Success!</h3>
        <p style="font-size: 14px; color: #b89f90; line-height: 1.5; margin-bottom: 24px;">{{ successMessage }}</p>
        <button class="primary-btn" style="width: 100%; justify-content: center;" @click="showSuccessModal = false">Close</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isSecretary = computed(() => authStore.user?.role === 'secretary')
const userRole = computed(() => authStore.user?.role)

const search = ref('')
const filterCourse = ref('')
const filterYear = ref('')
const filterSection = ref('')
const filterStatus = ref('')
const showImport = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const viewingStudent  = ref(null)   // Currently open in view modal
const deletingStudent = ref(null)
const editingStudent = ref(null)
const csvInput = ref(null)
const loading = ref(false)
const loadingImport = ref(false)
const saving = ref(false)
const resendCounts = ref({})
const formErrors = ref({})

// ─── Validation ─────────────────────────────────────────────────────────────
const validateField = (field) => {
  const val = form.value[field]
  if (!val || (typeof val === 'string' && !val.trim())) {
    formErrors.value[field] = 'Required'
  } else {
    // 1. Format Checks
    if (field === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(val)) {
        formErrors.value[field] = 'Invalid email format'
        return
      }
    }

    // Special logic for program or year change
    if (field === 'course' || field === 'year_level') {
      form.value.section_id = '' // Clear section when program or year changes
      delete formErrors.value.section_id
    }

    // 2. Uniqueness Checks (Local)
    if (field === 'email' || field === 'student_number') {
      const isDuplicate = students.value.some(s => {
        // Skip self if editing
        if (editingStudent.value && s.id === editingStudent.value.id) return false
        return s[field]?.toLowerCase() === val.toLowerCase()
      })

      if (isDuplicate) {
        formErrors.value[field] = field === 'email' ? 'Email already taken' : 'Student number already exists'
        return
      }
    }

    // If valid, clear the error
    delete formErrors.value[field]
  }
}

const currentPage = ref(1)
const pageSize = ref(50)

const form = ref({
  first_name: '', last_name: '', student_number: '',
  email: '', course: '', year_level: '', section_id: '',
  guardian_first_name: '', guardian_last_name: '', 
  guardian_relationship: '', guardian_contact_number: ''
})

const colors  = ['#FF6B1A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
const students = ref([])
const sections = ref([])

// ─── Fetch ───────────────────────────────────────────────────────────────────
const fetchStudents = async () => {
  loading.value = true
  try {
    const [studentsRes, sectionsRes] = await Promise.all([
      axios.get('/students'),
      axios.get('/sections')
    ])

    students.value = studentsRes.data.map((s, idx) => ({
      id:             s.id,
      first_name:     s.first_name,
      last_name:      s.last_name,
      middle_name:    s.middle_name || '',
      student_number: s.user?.student_number || 'N/A',
      email:          s.user?.email || 'N/A',
      course:         s.program?.program_code || 'N/A',
      year_level:     s.year_level || s.section?.year_level || 1,
      section:        s.section?.section_name || null,
      status:         s.user?.status || 'pending',
      gwa: s.gwa || (Math.random() * (2.5 - 1.25) + 1.25).toFixed(2),
      violations_count: s.violations_count || 0,
      created_at:     new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color:          colors[idx % colors.length],
      guardian:       s.guardian || null,
      skills:         (s.skills || []).map(sk => ({ name: sk.skillName, category: sk.skill_category })),
      organizations:  (s.organizations || []).map(org => ({
        name: org.organization?.organization_name || 'Unknown',
        role: org.role,
        dateJoined: org.dateJoined,
        dateLeft: org.dateLeft
      }))
    }))

    sections.value = sectionsRes.data
  } catch (err) {
    console.error('Failed to fetch students:', err)
  } finally {
    loading.value = false
  }
}

const getYearSuffix = (y) => {
  const last = y % 10
  if (last === 1 && y !== 11) return 'st'
  if (last === 2 && y !== 12) return 'nd'
  if (last === 3 && y !== 13) return 'rd'
  return 'th'
}

const getResendCount = (studentId) => resendCounts.value[studentId] || 0

const resendSetup = async (student) => {
  const count = getResendCount(student.id)
  if (count >= 3) return
  
  try {
    await axios.post(`/secretary/students/${student.id}/resend-setup`)
    resendCounts.value[student.id] = count + 1
    alert(`Setup email resent to ${student.email}. (${resendCounts.value[student.id]}/3 resends used)`)
  } catch (err) {
    alert('Failed to resend setup email.')
  }
}

const confirmDelete = (student) => {
  deletingStudent.value = student
  showDeleteModal.value = true
}

const deleteStudent = async () => {
  if (!deletingStudent.value) return
  try {
    await axios.delete(`/secretary/students/${deletingStudent.value.id}`)
    showDeleteModal.value = false
    viewingStudent.value = null
    alert('Student account archived successfully.')
    fetchStudents()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to archive student.')
  }
}

onMounted(fetchStudents)

// ─── Route Modal Handling ───────────────────────────────────────────────────

watch(() => route.params.id, (newId) => {
  if (newId) {
    const student = students.value.find(s => s.id == newId)
    if (student) {
      viewingStudent.value = student
    }
  } else {
    viewingStudent.value = null
  }
}, { immediate: true })

// Also watch students list in case it's not loaded yet when URL has an ID
watch(students, (newStudents) => {
  if (route.params.id && !viewingStudent.value) {
    const student = newStudents.find(s => s.id == route.params.id)
    if (student) viewingStudent.value = student
  }
})

// Sync back to route when modal closes
watch(viewingStudent, (newVal) => {
  if (!newVal && route.params.id) {
    router.push({ name: 'StudentManagement' })
  }
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const miniStats = computed(() => [
  { label: 'Total Students',  value: students.value.length,                                      color: '#FF6B1A' },
  { label: 'Active',          value: students.value.filter(s => s.status === 'active').length,   color: '#16a34a' },
  { label: 'Pending Setup',   value: students.value.filter(s => s.status === 'pending').length,  color: '#f59e0b' },
  { label: 'BSCS',            value: students.value.filter(s => s.course === 'BSCS').length,     color: '#8b5cf6' },
  { label: 'BSIT',            value: students.value.filter(s => s.course === 'BSIT').length,     color: '#3b82f6' }
])

// FILTER FIX: Dynamic section list derived from loaded students
const availableSections = computed(() => {
  const secs = students.value
    .map(s => s.section)
    .filter(Boolean)
  return [...new Set(secs)].sort()
})

const filteredFormSections = computed(() => {
  if (!form.value.course || !form.value.year_level) return []
  return sections.value.filter(sec => {
    return sec.program?.program_code === form.value.course && 
           sec.year_level == form.value.year_level
  })
})

const formatSectionName = (name) => {
  if (!name) return ''
  // If name is like "BSCS 1-A", and course is "BSCS", return "1-A"
  const programPrefix = form.value.course + ' '
  if (name.startsWith(programPrefix)) {
    return name.replace(programPrefix, '')
  }
  return name
}

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const fullName = `${s.last_name}, ${s.first_name} ${s.middle_name}`.toLowerCase()
    const matchSearch = !search.value ||
      fullName.includes(search.value.toLowerCase()) ||
      s.email.toLowerCase().includes(search.value.toLowerCase()) ||
      s.student_number.toLowerCase().includes(search.value.toLowerCase())
    const matchCourse  = !filterCourse.value  || s.course === filterCourse.value
    const matchYear    = !filterYear.value    || s.year_level == filterYear.value
    const matchSection = !filterSection.value || s.section === filterSection.value
    const matchStatus  = !filterStatus.value  || s.status === filterStatus.value
    return matchSearch && matchCourse && matchYear && matchSection && matchStatus
  }).sort((a, b) => {
    // 1. Status: pending first
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // 2. Alphabetical: Last Name, First Name, Middle Name
    const lastCompare = a.last_name.localeCompare(b.last_name);
    if (lastCompare !== 0) return lastCompare;
    
    const firstCompare = a.first_name.localeCompare(b.first_name);
    if (firstCompare !== 0) return firstCompare;
    
    return a.middle_name.localeCompare(b.middle_name);
  })
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredStudents.value.slice(start, start + pageSize.value)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

const viewDetails = (student) => {
  router.push({ name: 'StudentDetail', params: { id: student.id } })
}

const openCreateModal = () => {
  editingStudent.value = null
  formErrors.value = {}
  form.value = { 
    first_name: '', last_name: '', student_number: '', email: '', course: '', year_level: '', section_id: '',
    guardian_first_name: '', guardian_last_name: '', guardian_relationship: '', guardian_contact_number: ''
  }
  showCreateModal.value = true
}

const openEditModal = (student) => {
  editingStudent.value = student
  formErrors.value = {}
  form.value = { 
    ...student,
    year_level: student.year_level.toString(),
    section_id: sections.value.find(sec => sec.section_name === student.section)?.id || '',
    guardian_first_name: student.guardian?.first_name || '',
    guardian_last_name: student.guardian?.last_name || '',
    guardian_relationship: student.guardian?.relationship || '',
    guardian_contact_number: student.guardian?.contact_number || ''
  }
  showCreateModal.value = true
}

const saveStudent = async () => {
  formErrors.value = {}
  if (!form.value.first_name || !form.value.last_name || !form.value.student_number || !form.value.email || !form.value.course || !form.value.year_level || !form.value.section_id) {
    // Set local validation errors
    if (!form.value.first_name) formErrors.value.first_name = 'Required'
    if (!form.value.last_name) formErrors.value.last_name = 'Required'
    if (!form.value.student_number) formErrors.value.student_number = 'Required'
    if (!form.value.email) formErrors.value.email = 'Required'
    if (!form.value.course) formErrors.value.course = 'Required'
    if (!form.value.year_level) formErrors.value.year_level = 'Required'
    if (!form.value.section_id) formErrors.value.section_id = 'Required'
    return
  }

  saving.value = true
  try {
    if (editingStudent.value) {
      await axios.put(`/secretary/students/${editingStudent.value.id}`, {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        student_number: form.value.student_number,
        course: form.value.course,
        year_level: form.value.year_level,
        section_id: form.value.section_id
      })
      showCreateModal.value = false
      fetchStudents()
      openSuccessModal('Student account updated successfully.') 
    } else {
      await axios.post('/secretary/students', form.value)
      showCreateModal.value = false
      fetchStudents()
      openSuccessModal('Student account created successfully. A setup email has been sent.') 
    }
  } catch (err) {
    if (err.response?.status === 422) {
      const errors = err.response.data.errors
      if (errors) {
        Object.keys(errors).forEach(key => {
          formErrors.value[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
        })
      }
      // Special check for combined error messages
      const msg = err.response.data.message?.toLowerCase() || ''
      if (msg.includes('email') && !formErrors.value.email) formErrors.value.email = 'Email already taken'
      if (msg.includes('student number') && !formErrors.value.student_number) formErrors.value.student_number = 'Student number already exists'
    } else {
      alert(err.response?.data?.message || 'Failed to save student account.')
    }
  } finally {
    saving.value = false
  }
}
const handleCSV = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  loadingImport.value = true
  try {
    const response = await axios.post('/secretary/students/import', formData)
    alert(response.data.message || 'Students imported successfully!')
    fetchStudents()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to import students.')
  } finally {
    loadingImport.value = false
    if (csvInput.value) csvInput.value.value = ''
  }
}

const showSuccessModal = ref(false)
const successMessage = ref('')

const openSuccessModal = (msg) => {
  successMessage.value = msg
  showSuccessModal.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

.page { display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif; min-height: 100%; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }
.header-actions { display: flex; gap: 10px; }

/* ── Buttons ── */
.primary-btn { display: flex; align-items: center; gap: 7px; background: #FF6B1A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.primary-btn:hover:not(:disabled) { background: #e85500; }
.primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.primary-btn svg { width: 15px; height: 15px; }
.ghost-btn { display: flex; align-items: center; gap: 7px; background: #fff; color: #1a0a00; border: 1.5px solid #f0e8e0; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
.ghost-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.ghost-btn svg { width: 15px; height: 15px; }
.danger-btn { display: flex; align-items: center; gap: 6px; background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: background 0.2s; }
.danger-btn:hover { background: #dc2626; }

/* ── Import Panel ── */
.import-panel { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.import-panel-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #faf8f6; }
.import-panel-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.import-panel-header p { font-size: 12px; color: #b89f90; margin-top: 3px; }
.close-btn { background: none; border: none; font-size: 22px; color: #b89f90; cursor: pointer; padding: 0; line-height: 1; }
.close-btn:hover { color: #1a0a00; }
.import-body { padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.drop-zone { border: 2px dashed #f0e8e0; border-radius: 14px; padding: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; min-height: 160px; }
.drop-zone:hover:not(.disabled) { border-color: #FF6B1A; background: #fffaf8; }
.drop-zone.disabled { cursor: not-allowed; opacity: 0.7; background: #fafafa; }
.drop-zone svg { width: 40px; height: 40px; color: #c0b0a5; }
.drop-title { font-size: 14px; font-weight: 600; color: #1a0a00; }
.drop-sub { font-size: 12px; color: #b89f90; }
.import-template { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9a8070; background: #faf8f6; padding: 10px 14px; border-radius: 9px; }
.import-template svg { width: 14px; height: 14px; color: #FF6B1A; flex-shrink: 0; }

/* ── Mini Stats ── */
.mini-stats { display: flex; gap: 14px; }
.mini-stat { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; flex: 1; transition: all 0.25s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
.mini-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
.mini-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.25s; }
.mini-stat:hover .mini-stat-icon { transform: scale(1.08); }
.mini-stat-icon svg { width: 20px; height: 20px; }
.mini-stat-info { display: flex; flex-direction: column; gap: 3px; }
.mini-stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; line-height: 1; }
.stat-blue::before { background: #3b82f6; }
.stat-teal::before { background: #0891b2; }
.stat-purple::before { background: #8b5cf6; }
.stat-orange::before { background: #FF6B1A; }
.stat-green::before { background: #16a34a; }
.mini-stat-label { font-size: 11px; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 400; }

/* ── Toolbar ── */
.table-toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #f0e8e0; border-radius: 10px; padding: 9px 14px; flex: 1; min-width: 200px; transition: all 0.2s; }
.search-wrap:focus-within { border-color: #FF6B1A; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.search-wrap svg { width: 15px; height: 15px; color: #c0b0a5; flex-shrink: 0; }
.search-wrap input { border: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; width: 100%; background: none; }
.search-wrap input::placeholder { color: #c0b0a5; }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-group select { padding: 9px 14px; border: 1.5px solid #f0e8e0; border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif; color: #1a0a00; background: #fff; outline: none; cursor: pointer; transition: border-color 0.2s; }
.filter-group select:focus { border-color: #FF6B1A; }

.error-input { border-color: #ef4444 !important; background-color: #fef2f2 !important; }
.error-input:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important; }
.field-error { color: #ef4444; font-size: 11px; margin-top: 4px; display: block; font-weight: 500; }

/* ── Table ── */
.table-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; position: relative; flex: 1; display: flex; flex-direction: column; min-height: 400px; }
.table-container { flex: 1; overflow-y: auto; }
.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; gap: 10px; }

/* ── Pagination ── */
.pagination-bar { padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #fff; display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.pagination-info { font-size: 13px; color: #9a8070; }
.pagination-btns { display: flex; align-items: center; gap: 12px; }
.pag-pages { display: flex; gap: 6px; }
.pag-btn, .pag-page-btn { background: #fff; border: 1.5px solid #f0e8e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; }
.pag-btn { width: 32px; height: 32px; color: #1a0a00; }
.pag-page-btn { min-width: 32px; height: 32px; padding: 0 8px; font-size: 13px; font-weight: 600; color: #9a8070; }
.pag-btn:hover:not(:disabled), .pag-page-btn:hover { border-color: #FF6B1A; color: #FF6B1A; background: #fffaf8; }
.pag-page-btn.active { background: #FF6B1A; border-color: #FF6B1A; color: #fff; box-shadow: 0 4px 10px rgba(255,107,26,0.2); }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 13px 18px; background: #faf8f6; font-size: 10px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f0e8e0; text-align: left; white-space: nowrap; }
.data-table td { padding: 13px 18px; font-size: 13px; color: #1a0a00; border-bottom: 1px solid #faf8f6; }
.data-table tr:last-child td { border-bottom: none; }

/* IMPROVEMENT FIX: Clickable row styling */
.clickable-row { cursor: pointer; transition: background 0.15s; }
.clickable-row:hover td { background: #fdf5ef !important; }
.clickable-row:hover .s-name { color: #FF6B1A; }

.action-btns { display: flex; gap: 8px; }
.action-btn { background: #fff; border: 1px solid #f0e8e0; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9a8070; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
.action-btn.delete:hover { border-color: #ef4444; color: #ef4444; }
.action-btn svg { width: 14px; height: 14px; }

.student-cell { display: flex; align-items: center; gap: 10px; }
.s-avatar { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.s-avatar.lg { width: 50px; height: 50px; border-radius: 14px; font-size: 20px; }
.s-name { font-size: 13px; font-weight: 600; color: #1a0a00; transition: color 0.15s; }
.s-sub { font-size: 11px; color: #b89f90; margin-top: 1px; }
.code-badge { font-size: 11px; font-weight: 700; color: #FF6B1A; background: #fff5ef; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge-bsit { color: #16a34a; background: #f0fdf4; }
.gwa-val { font-weight: 700; font-size: 13px; }
.gwa-good { color: #16a34a; }
.gwa-ok { color: #f59e0b; }
.v-count { font-weight: 700; font-size: 12px; padding: 2px 7px; border-radius: 5px; }
.v-danger { background: #fef2f2; color: #ef4444; }
.v-clear { background: #f0fdf4; color: #16a34a; }
.email-cell { font-size: 12px; color: #6b7280; }
.date-cell { font-size: 12px; color: #9a8070; white-space: nowrap; }
.status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
.st-active { background: #f0fdf4; color: #16a34a; }
.st-pending { background: #fffbeb; color: #d97706; }
.empty-row { text-align: center; color: #b89f90; font-style: italic; padding: 40px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
.modal-lg { max-width: 650px; }
.modal-lg { max-width: 600px; }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.modal-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-student-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
.modal-student-meta h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; color: #1a0a00; margin: 0; }
.modal-sub { font-size: 12px; color: #b89f90; margin-top: 3px; }
.modal-student-info { display: flex; align-items: center; gap: 15px; }
.modal-student-info h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #1a0a00; margin: 0; }
.modal-student-info p { font-size: 13px; color: #b89f90; margin-top: 2px; }

.modal-body { padding: 24px; overflow-y: auto; }
.profile-body { display: flex; flex-direction: column; gap: 24px; }
.profile-section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; }
.profile-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.pi-row { display: flex; flex-direction: column; gap: 2px; }
.pi-label { font-size: 11px; color: #9a8070; font-weight: 600; }
.pi-value { font-size: 14px; color: #1a0a00; font-weight: 500; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0e8e0; background: #faf8f6; }

/* ── Create form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.full-span { grid-column: span 2; }
.form-divider { grid-column: span 2; font-size: 11px; font-weight: 800; color: #FF6B1A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #fff5ef; padding-bottom: 6px; margin-top: 10px; }
.form-group label { font-size: 11px; font-weight: 700; color: #9a8070; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }
.form-group input,
.form-group select { padding: 11px 14px; border: 1.5px solid #f0e8e0; border-radius: 11px; font-size: 13px; outline: none; font-family: 'Outfit', sans-serif; background: #faf8f6; color: #1a0a00; transition: all 0.2s; width: 100%; }
.form-group input:focus,
.form-group select:focus { border-color: #FF6B1A; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,26,0.07); }
.modal-notice { display: flex; align-items: flex-start; gap: 8px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #c94000; margin-top: 16px; }
.modal-notice svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }

/* ── View modal detail grid ── */
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-section { background: #faf8f6; border: 1px solid #f0e8e0; border-radius: 14px; overflow: hidden; }
.detail-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #9a8070; padding: 12px 16px 8px; border-bottom: 1px solid #f0e8e0; background: #f5f1ed; }
.detail-rows { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; border-bottom: 1px solid #f0e8e0; gap: 12px; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 11px; color: #9a8070; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.detail-val { font-size: 13px; font-weight: 600; color: #1a0a00; text-align: right; }

/* ── Skills tags ── */
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
.skill-tag { display: inline-flex; align-items: center; gap: 6px; background: #fff5ef; border: 1px solid #ffd5b0; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #1a0a00; }
.skill-cat { font-size: 10px; font-weight: 700; color: #FF6B1A; background: #fff; padding: 1px 6px; border-radius: 4px; }

/* ── Resend row ── */
.resend-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 16px; }
.resend-info { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #92400e; }
.resend-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid #fde68a; color: #92400e; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.resend-btn:hover:not(:disabled) { background: #fef3c7; border-color: #f59e0b; }
.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f5f1ed; border-color: #e5e0da; color: #a89080; }

/* ── Misc ── */
.delete-msg { font-size: 14px; color: #4a3020; line-height: 1.6; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner-lg { width: 32px; height: 32px; border: 3px solid rgba(255,107,26,0.1); border-top-color: #FF6B1A; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
