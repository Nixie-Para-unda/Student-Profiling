<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-title">Settings</h2>
        <p class="page-sub">Manage your account preferences and configurations.</p>
      </div>
    </div>

    <div class="settings-grid">
      <!-- LEFT COLUMN -->
      <div class="settings-main">

        <!-- ── SHARED: Account Settings ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Account Settings</h3>
            <span class="coming-soon">Coming Soon</span>
          </div>
          <div class="settings-card-body">
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Display Name</p>
                <p class="setting-desc">Change how your name appears across the portal</p>
              </div>
              <button class="setting-btn" disabled>Edit</button>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Email Address</p>
                <p class="setting-desc">Update your institutional email address</p>
              </div>
              <button class="setting-btn" disabled>Edit</button>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Change Password</p>
                <p class="setting-desc">Update your login password</p>
              </div>
              <button class="setting-btn" disabled>Change</button>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Profile Photo</p>
                <p class="setting-desc">Upload a profile picture for your account</p>
              </div>
              <button class="setting-btn" disabled>Upload</button>
            </div>
          </div>
        </div>

        <!-- ── SHARED: Notifications ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>Notifications</h3>
            <span class="coming-soon">Coming Soon</span>
          </div>
          <div class="settings-card-body">
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Email Notifications</p>
                <p class="setting-desc">Receive updates and alerts via email</p>
              </div>
              <div class="toggle disabled">
                <div class="toggle-knob"></div>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">In-App Notifications</p>
                <p class="setting-desc">Show notifications inside the portal</p>
              </div>
              <div class="toggle active disabled">
                <div class="toggle-knob"></div>
              </div>
            </div>

            <!-- Dean-specific notifications -->
            <template v-if="authStore.isDean">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Violation Alerts</p>
                  <p class="setting-desc">Notify when a new student violation is recorded</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Award Approval Requests</p>
                  <p class="setting-desc">Notify when faculty submits an award recommendation</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Report Generation Complete</p>
                  <p class="setting-desc">Notify when a department report is ready</p>
                </div>
                <div class="toggle disabled"><div class="toggle-knob"></div></div>
              </div>
            </template>

            <!-- Faculty-specific notifications -->
            <template v-if="authStore.isFaculty">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Student Performance Alerts</p>
                  <p class="setting-desc">Notify when a student in your class is at risk</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Grade Submission Reminders</p>
                  <p class="setting-desc">Remind you when grade submission deadline is near</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Schedule Changes</p>
                  <p class="setting-desc">Notify when your teaching schedule is updated</p>
                </div>
                <div class="toggle disabled"><div class="toggle-knob"></div></div>
              </div>
            </template>

            <!-- Student-specific notifications -->
            <template v-if="authStore.isStudent">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Grade Released</p>
                  <p class="setting-desc">Notify when your grades are posted by a professor</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Violation Notice</p>
                  <p class="setting-desc">Notify when a violation is recorded on your account</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Award Recognition</p>
                  <p class="setting-desc">Notify when you receive an award or recognition</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Schedule Updates</p>
                  <p class="setting-desc">Notify when your class schedule changes</p>
                </div>
                <div class="toggle disabled"><div class="toggle-knob"></div></div>
              </div>
            </template>
          </div>
        </div>

        <!-- ── DEAN: System & Reports ── -->
        <template v-if="authStore.isDean">
          <div class="settings-card">
            <div class="settings-card-header">
              <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5M13 21l4-4m0 0l4 4m-4-4v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h3>Reports & Data Export</h3>
              <span class="coming-soon">Coming Soon</span>
            </div>
            <div class="settings-card-body">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Default Report Format</p>
                  <p class="setting-desc">Choose between PDF, Excel, or CSV for exported reports</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Scheduled Report Generation</p>
                  <p class="setting-desc">Automatically generate department reports on a schedule</p>
                </div>
                <div class="toggle disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Data Retention Period</p>
                  <p class="setting-desc">Set how long student records are kept in the system</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
            </div>
          </div>

          <div class="settings-card">
            <div class="settings-card-header">
              <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h3>Academic Year Configuration</h3>
              <span class="coming-soon">Coming Soon</span>
            </div>
            <div class="settings-card-body">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Current Academic Year</p>
                  <p class="setting-desc">Set the active academic year for the system</p>
                </div>
                <button class="setting-btn" disabled>Edit</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Current Semester</p>
                  <p class="setting-desc">Set whether the system is in 1st or 2nd semester</p>
                </div>
                <button class="setting-btn" disabled>Edit</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">GWA Grading Scale</p>
                  <p class="setting-desc">Configure the GWA scale used for Dean's List qualification</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
            </div>
          </div>
        </template>

        <!-- ── FACULTY: Teaching Preferences ── -->
        <template v-if="authStore.isFaculty">
          <div class="settings-card">
            <div class="settings-card-header">
              <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h3>Teaching Preferences</h3>
              <span class="coming-soon">Coming Soon</span>
            </div>
            <div class="settings-card-body">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Default Grading Scheme</p>
                  <p class="setting-desc">Set your preferred grading system for student evaluation</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Student Performance Threshold</p>
                  <p class="setting-desc">Set the grade threshold to flag at-risk students</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Class Attendance Tracking</p>
                  <p class="setting-desc">Enable attendance monitoring for your classes</p>
                </div>
                <div class="toggle disabled"><div class="toggle-knob"></div></div>
              </div>
            </div>
          </div>
        </template>

        <!-- ── STUDENT: Privacy ── -->
        <template v-if="authStore.isStudent">
          <div class="settings-card">
            <div class="settings-card-header">
              <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h3>Privacy Settings</h3>
              <span class="coming-soon">Coming Soon</span>
            </div>
            <div class="settings-card-body">
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Profile Visibility</p>
                  <p class="setting-desc">Control who can view your profile and academic details</p>
                </div>
                <button class="setting-btn" disabled>Configure</button>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Show GWA on Profile</p>
                  <p class="setting-desc">Allow faculty and classmates to see your GWA</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
              <div class="setting-row">
                <div class="setting-info">
                  <p class="setting-label">Show Awards on Profile</p>
                  <p class="setting-desc">Display your awards and recognitions publicly</p>
                </div>
                <div class="toggle active disabled"><div class="toggle-knob"></div></div>
              </div>
            </div>
          </div>
        </template>

        <!-- ── SHARED: Appearance ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <svg viewBox="0 0 24 24" fill="none" class="settings-icon"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <h3>Appearance</h3>
            <span class="coming-soon">Coming Soon</span>
          </div>
          <div class="settings-card-body">
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Theme</p>
                <p class="setting-desc">Switch between light and dark mode</p>
              </div>
              <div class="theme-options">
                <button class="theme-btn active" disabled>Light</button>
                <button class="theme-btn" disabled>Dark</button>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label">Sidebar Collapsed by Default</p>
                <p class="setting-desc">Start with the sidebar minimized on login</p>
              </div>
              <div class="toggle disabled"><div class="toggle-knob"></div></div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Info Panel -->
      <div class="settings-side">
        <!-- Role Badge -->
        <div class="settings-card role-card">
          <div class="role-icon">{{ authStore.user?.name?.charAt(0) ?? 'U' }}</div>
          <p class="role-name">{{ authStore.user?.name ?? 'User' }}</p>
          <p class="role-label">{{ roleLabel }}</p>
          <div class="role-divider"></div>
          <div class="role-info-row">
            <span class="role-info-label">Role</span>
            <span class="role-info-value">{{ roleLabel }}</span>
          </div>
          <div class="role-info-row" v-if="authStore.isStudent">
            <span class="role-info-label">Section</span>
            <span class="role-info-value">BSCS 3-A</span>
          </div>
          <div class="role-info-row" v-if="authStore.isFaculty">
            <span class="role-info-label">Department</span>
            <span class="role-info-value">CCS</span>
          </div>
          <div class="role-info-row" v-if="authStore.isDean">
            <span class="role-info-label">Department</span>
            <span class="role-info-value">CCS</span>
          </div>
          <div class="role-info-row">
            <span class="role-info-label">AY</span>
            <span class="role-info-value">2026–2027</span>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="settings-card notice-card">
          <svg viewBox="0 0 24 24" fill="none" style="width:32px;height:32px;color:#FF6B1A;margin-bottom:10px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <p class="notice-title">Settings Under Development</p>
          <p class="notice-desc">These settings are placeholders for features currently being built. They will be fully functional in a future update.</p>
        </div>

        <!-- Danger Zone -->
        <div class="settings-card danger-card">
          <div class="settings-card-header">
            <svg viewBox="0 0 24 24" fill="none" class="settings-icon" style="color:#ef4444"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 style="color:#ef4444">Danger Zone</h3>
          </div>
          <div class="settings-card-body">
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-label" style="color:#ef4444">Deactivate Account</p>
                <p class="setting-desc">Temporarily disable your account access</p>
              </div>
              <button class="danger-btn" disabled>Deactivate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

const roleLabel = computed(() => {
  const role = authStore.user?.role
  if (role === 'dean') return 'Dean · Head of Department'
  if (role === 'faculty') return 'Faculty Member'
  if (role === 'student') return 'Student'
  return 'User'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');
.page { display: flex; flex-direction: column; gap: 24px; font-family: 'Outfit', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: #1a0a00; }
.page-sub { font-size: 13px; color: #b89f90; margin-top: 4px; }

/* Layout */
.settings-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
.settings-main { display: flex; flex-direction: column; gap: 16px; }
.settings-side { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 0; }

/* Cards */
.settings-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; overflow: hidden; }
.settings-card-header { padding: 16px 22px; border-bottom: 1px solid #faf8f6; display: flex; align-items: center; gap: 10px; }
.settings-icon { width: 18px; height: 18px; color: #FF6B1A; flex-shrink: 0; }
.settings-card-header h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #1a0a00; flex: 1; }
.coming-soon { font-size: 9px; font-weight: 700; background: #fff5ef; color: #FF6B1A; border: 1px solid #ffd5b0; padding: 2px 8px; border-radius: 5px; white-space: nowrap; }
.settings-card-body { padding: 8px 0; }

/* Setting Rows */
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 22px; border-bottom: 1px solid #faf8f6; }
.setting-row:last-child { border-bottom: none; }
.setting-row:hover { background: #fdf9f7; }
.setting-info { flex: 1; min-width: 0; }
.setting-label { font-size: 13px; font-weight: 600; color: #1a0a00; }
.setting-desc { font-size: 11px; color: #b89f90; margin-top: 2px; }

/* Buttons */
.setting-btn { background: #faf8f6; border: 1.5px solid #f0e8e0; color: #9a8070; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 8px; cursor: not-allowed; font-family: 'Outfit', sans-serif; opacity: 0.7; white-space: nowrap; }
.danger-btn { background: #fff1f2; border: 1.5px solid #fecdd3; color: #ef4444; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 8px; cursor: not-allowed; font-family: 'Outfit', sans-serif; opacity: 0.7; white-space: nowrap; }

/* Toggle */
.toggle { width: 38px; height: 22px; background: #e5e7eb; border-radius: 11px; position: relative; cursor: not-allowed; flex-shrink: 0; transition: all 0.2s; }
.toggle.active { background: #FF6B1A; }
.toggle-knob { width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.toggle.active .toggle-knob { left: 19px; }

/* Theme options */
.theme-options { display: flex; gap: 6px; }
.theme-btn { padding: 6px 14px; border: 1.5px solid #f0e8e0; border-radius: 8px; font-size: 12px; font-weight: 600; color: #9a8070; background: #faf8f6; cursor: not-allowed; font-family: 'Outfit', sans-serif; }
.theme-btn.active { background: #1a0a00; color: #fff; border-color: #1a0a00; }

/* Role Card */
.role-card { padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
.role-icon { width: 56px; height: 56px; background: #FF6B1A; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.role-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a0a00; }
.role-label { font-size: 11px; color: #b89f90; }
.role-divider { width: 100%; height: 1px; background: #f0e8e0; margin: 10px 0; }
.role-info-row { width: 100%; display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #faf8f6; }
.role-info-row:last-child { border-bottom: none; }
.role-info-label { font-size: 11px; color: #b89f90; }
.role-info-value { font-size: 11px; font-weight: 600; color: #1a0a00; }

/* Notice Card */
.notice-card { padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; background: #fffaf8; border-color: #ffd5b0; }
.notice-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; color: #1a0a00; }
.notice-desc { font-size: 11px; color: #b89f90; line-height: 1.6; margin-top: 6px; }

/* Danger Card */
.danger-card { border-color: #fecdd3; }
.danger-card .settings-card-header { border-color: #fff1f2; background: #fffafa; }

@media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } }
</style>