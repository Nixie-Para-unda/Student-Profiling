<template>
  <div class="dashboard-home">

    <!-- HERO BANNER -->
    <div class="hero-banner">
      <div class="hero-bg-shape shape-1"></div>
      <div class="hero-bg-shape shape-2"></div>
      <div class="hero-body">

        <div v-if="authStore.isStudent && profileIncomplete" class="profile-warning-banner">
          <div class="warning-content">
            <svg viewBox="0 0 24 24" fill="none" class="warning-icon"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div class="warning-text">
              <h4>Your profile is incomplete!</h4>
              <p>Please provide your contact details and skills to complete your registration.</p>
            </div>
          </div>
          <router-link to="/student/profile" class="complete-btn">Complete Profile</router-link>
        </div>

        <!-- DEAN Hero Left -->
        <div v-if="authStore.isDean" class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Dean' }} 👋</h2>
          <p class="hero-desc">You have <strong>3 pending recognition approvals</strong> and <strong>12 student violations</strong> requiring attention this week.</p>
          <div class="hero-actions">
            <button class="hero-btn-primary">Pending Approvals <span class="hero-btn-badge">3</span></button>
            <button class="hero-btn-ghost">Generate Report</button>
          </div>
        </div>

        <!-- STUDENT Hero Left -->
        <div v-else-if="authStore.isStudent" class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Student' }} 👋</h2>
          <p class="hero-desc">Your current GWA is <strong>{{ studentProfile.gwa || '0.00' }}</strong>. You have <strong>{{ todaySchedule.length }} classes</strong> scheduled today.</p>
          <div class="hero-actions">
            <router-link to="/student/schedule" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 1v4M12 1v4M2 7h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              View Schedule
            </router-link>
            <router-link to="/student/academic-history" class="hero-btn-ghost">Academic History</router-link>
          </div>
        </div>

        <!-- FACULTY Hero Left -->
        <div v-else-if="authStore.isFaculty" class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Professor' }} 👋</h2>
          <p class="hero-desc">You have <strong>{{ facultyStats.totalSubjects }} subjects</strong> this semester with <strong>{{ facultyStats.totalStudents }} enrolled students</strong> across all your classes.</p>
          <div class="hero-actions">
            <router-link to="/faculty/schedule" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 1v4M12 1v4M2 7h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              My Schedule
            </router-link>
            <router-link to="/faculty/students" class="hero-btn-ghost">View My Students</router-link>
          </div>
        </div>

        <!-- SECRETARY Hero Left -->
        <div v-else-if="authStore.isSecretary" class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Secretary' }} 👋</h2>
          <p class="hero-desc">There are <strong>{{ secStats.pendingAccounts }} pending account requests</strong> and <strong>{{ secStats.pendingVerifications }} achievements</strong> awaiting verification today.</p>
          <div class="hero-actions">
            <router-link to="/secretary/students" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              Student Accounts
            </router-link>
            <router-link to="/secretary/reports" class="hero-btn-ghost">Generate Report</router-link>
          </div>
        </div>

        <!-- CHAIR Hero Left -->
        <div v-else-if="authStore.isChair" class="hero-left">
          <p class="hero-eyebrow"><span class="eyebrow-dot"></span>Academic Year 2026-2027 · 2nd Semester</p>
          <h2 class="hero-greeting">Good morning, {{ authStore.user?.name?.split(' ')[0] ?? 'Chair' }} 👋</h2>
          <p class="hero-desc">Department avg GWA is <strong>{{ chairStats.avgGwa }}</strong>. You have <strong>{{ chairStats.pendingAwards }} awards</strong> awaiting approval and <strong>{{ chairStats.activeViolations }} active violations</strong> this semester.</p>
          <div class="hero-actions">
            <router-link to="/chair/students" class="hero-btn-primary">
              <svg viewBox="0 0 18 18" fill="none" style="width:14px;height:14px"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              View Students
            </router-link>
            <router-link to="/chair/reports" class="hero-btn-ghost">Generate Report</router-link>
          </div>
        </div>

        <!-- DEAN Hero Right -->
        <div v-if="authStore.isDean" class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">This Week</span><span class="hsc-value">47</span><span class="hsc-sub">Activities logged</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Pending</span><span class="hsc-value">3</span><span class="hsc-sub">Awaiting review</span></div>
        </div>

        <!-- STUDENT Hero Right -->
        <div v-else-if="authStore.isStudent" class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Current GWA</span><span class="hsc-value">{{ studentProfile.gwa || '0.00' }}</span><span class="hsc-sub">This semester</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Activities</span><span class="hsc-value">{{ studentActivities.length }}</span><span class="hsc-sub">Non-academic</span></div>
        </div>

        <!-- FACULTY Hero Right -->
        <div v-else-if="authStore.isFaculty" class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Subjects</span><span class="hsc-value">{{ facultyStats.totalSubjects }}</span><span class="hsc-sub">This semester</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Students</span><span class="hsc-value">{{ facultyStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
        </div>

        <!-- SECRETARY Hero Right -->
        <div v-else-if="authStore.isSecretary" class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Total Students</span><span class="hsc-value">{{ secStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Pending</span><span class="hsc-value">{{ secStats.pendingAccounts }}</span><span class="hsc-sub">Account requests</span></div>
        </div>

        <!-- CHAIR Hero Right -->
        <div v-else-if="authStore.isChair" class="hero-right">
          <div class="hero-stat-card"><span class="hsc-label">Total Students</span><span class="hsc-value">{{ chairStats.totalStudents }}</span><span class="hsc-sub">Enrolled</span></div>
          <div class="hero-stat-card accent"><span class="hsc-label">Avg GWA</span><span class="hsc-value">{{ chairStats.avgGwa }}</span><span class="hsc-sub">Department</span></div>
        </div>

      </div>
    </div>

    <!-- STATS GRID -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label"
        @click="stat.route && $router.push(stat.route)"
        :class="{ clickable: stat.route }">
        <div class="stat-top">
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-icon" :style="{ background: stat.iconBg, color: stat.iconColor }">
            <component :is="'svg'" viewBox="0 0 18 18" fill="none" v-html="stat.iconPath"></component>
          </div>
        </div>
        <div class="stat-bottom">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-delta" :class="stat.deltaClass">{{ stat.delta }}</span>
        </div>
        <div class="stat-bar"><div class="stat-bar-fill" :style="{ width: stat.fill, background: stat.iconColor }"></div></div>
      </div>
    </div>

    <!-- ==================== DEAN BOTTOM GRID ==================== -->
    <div v-if="authStore.isDean" class="bottom-grid">
      <div class="card chart-card">
        <div class="card-header">
          <div><h3 class="card-title">Academic Performance Trends</h3><p class="card-sub">Average GWA per semester</p></div>
          <a href="#" class="card-link">Full report →</a>
        </div>
        <div class="chart-bars">
          <div class="chart-bar-col" v-for="(bar, i) in chartData" :key="i">
            <div class="chart-bar-wrap">
              <div class="chart-bar-fill" :class="{ current: i === chartData.length - 1 }" :style="{ height: bar.pct + '%' }">
                <span class="chart-tooltip">{{ bar.sem }}: {{ bar.gwa }}</span>
              </div>
            </div>
            <span class="chart-bar-label">{{ bar.sem }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot current"></span><span class="legend-text">Current sem</span>
          <span class="legend-dot"></span><span class="legend-text">Previous</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Top Performing Students</h3><p class="card-sub">Ranked by GWA · current semester</p></div>
          <a href="#" class="card-link">View all →</a>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in topStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ s.name }}</p><p class="student-course">{{ s.course }}</p></div>
            <span class="student-tag" :class="s.tagClass">{{ s.tag }}</span>
            <span class="student-gwa">{{ s.gwa }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Student Violations</h3><p class="card-sub">Active cases this semester</p></div>
          <a href="#" class="card-link">View all →</a>
        </div>
        <div class="violation-list">
          <div class="violation-row" v-for="(v, i) in deanViolations" :key="i">
            <div class="violation-avatar" :style="{ background: v.color }">{{ v.name.charAt(0) }}</div>
            <div class="violation-info"><p class="violation-name">{{ v.name }}</p><p class="violation-type">{{ v.type }}</p></div>
            <span class="violation-badge" :class="v.severityClass">{{ v.severity }}</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 5v4M8 11.5v.5M2.5 14h11a1 1 0 00.87-1.5l-5.5-9.5a1 1 0 00-1.74 0l-5.5 9.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          <span>8 more cases need review</span>
          <button>Review Now →</button>
        </div>
      </div>
    </div>

    <!-- ==================== STUDENT BOTTOM GRID ==================== -->
    <div v-else-if="authStore.isStudent" class="bottom-grid">
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Today's Schedule</h3><p class="card-sub">{{ todayLabel }}</p></div>
          <router-link to="/student/schedule" class="card-link">View all →</router-link>
        </div>
        <div class="schedule-list">
          <div class="schedule-row" v-for="cls in todaySchedule" :key="cls.subject">
            <div class="schedule-time-col">
              <span class="schedule-time">{{ cls.time }}</span>
              <span class="schedule-duration">{{ cls.duration }}</span>
            </div>
            <div class="schedule-dot-col">
              <div class="schedule-dot" :style="{ background: cls.color }"></div>
              <div class="schedule-line"></div>
            </div>
            <div class="schedule-info">
              <p class="schedule-subject">{{ cls.subject }}</p>
              <p class="schedule-prof">{{ cls.professor }} · {{ cls.room }}</p>
            </div>
            <span class="schedule-type-badge" :style="{ background: cls.color + '20', color: cls.color }">{{ cls.type }}</span>
          </div>
          <div v-if="todaySchedule.length === 0" class="empty-small">No classes today.</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Awards & Recognition</h3><p class="card-sub">Your achievements this year</p></div>
          <router-link to="/student/awards" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="award in studentAwards.slice(0,3)" :key="award.title">
            <div class="student-avatar" :style="{ background: award.color }">
              <svg viewBox="0 0 14 14" fill="none" style="width:12px;height:12px"><path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9.5 3.5 12l1.5-4L1 5h4.5L7 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
            </div>
            <div class="student-info"><p class="student-name">{{ award.title }}</p><p class="student-course">{{ award.semester }}</p></div>
            <span class="student-tag tag-green">{{ award.badge }}</span>
          </div>
          <div v-if="studentAwards.length === 0" class="empty-small">No awards yet.</div>
        </div>
        <div class="violations-mini">
          <div class="vm-header">
            <span class="vm-label">Violations</span>
            <router-link to="/student/violations" class="card-link">See all →</router-link>
          </div>
          <div v-if="studentViolations.length === 0" class="vm-clear">
            <svg viewBox="0 0 16 16" fill="none" style="width:13px;height:13px"><circle cx="8" cy="8" r="6" stroke="#10b981" stroke-width="1.4"/><path d="M5 8l2 2 4-4" stroke="#10b981" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            No active violations. Keep it up!
          </div>
          <div v-else v-for="v in studentViolations" :key="v.type" class="violation-row">
            <div class="violation-avatar" :style="{ background: v.color }">!</div>
            <div class="violation-info"><p class="violation-name">{{ v.type }}</p></div>
            <span class="violation-badge" :class="v.severityClass">{{ v.severity }}</span>
          </div>
        </div>
      </div>
      <div class="card chart-card">
        <div class="card-header">
          <div><h3 class="card-title">Academic Performance</h3><p class="card-sub">GWA trend per semester</p></div>
          <router-link to="/student/academic-history" class="card-link">History →</router-link>
        </div>
        <div class="chart-bars">
          <div class="chart-bar-col" v-for="(bar, i) in studentChartData" :key="i">
            <div class="chart-bar-wrap">
              <div class="chart-bar-fill" :class="{ current: i === studentChartData.length - 1 }" :style="{ height: bar.pct + '%' }">
                <span class="chart-tooltip">{{ bar.sem }}: {{ bar.gwa }}</span>
              </div>
            </div>
            <span class="chart-bar-label">{{ bar.sem }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot current"></span><span class="legend-text">Current sem</span>
          <span class="legend-dot"></span><span class="legend-text">Previous</span>
        </div>
      </div>
    </div>

    <!-- ==================== FACULTY BOTTOM GRID ==================== -->
    <div v-else-if="authStore.isFaculty" class="bottom-grid">

      <!-- Today's Teaching Schedule -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Today's Teaching Schedule</h3><p class="card-sub">{{ todayLabel }}</p></div>
          <router-link to="/faculty/schedule" class="card-link">View all →</router-link>
        </div>
        <div class="schedule-list">
          <div class="schedule-row" v-for="cls in facultyScheduleToday" :key="cls.subject">
            <div class="schedule-time-col">
              <span class="schedule-time">{{ cls.time }}</span>
              <span class="schedule-duration">{{ cls.duration }}</span>
            </div>
            <div class="schedule-dot-col">
              <div class="schedule-dot" :style="{ background: cls.color }"></div>
              <div class="schedule-line"></div>
            </div>
            <div class="schedule-info">
              <p class="schedule-subject">{{ cls.subject }}</p>
              <p class="schedule-prof">{{ cls.section }} · {{ cls.room }}</p>
            </div>
            <span class="schedule-type-badge" :style="{ background: cls.color + '20', color: cls.color }">{{ cls.enrolled }} students</span>
          </div>
          <div v-if="facultyScheduleToday.length === 0" class="empty-small">No classes today.</div>
        </div>
      </div>

      <!-- Student Performance in My Classes -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Student Performance</h3><p class="card-sub">Top students across my classes</p></div>
          <router-link to="/faculty/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in facultyTopStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info">
              <p class="student-name">{{ s.name }}</p>
              <p class="student-course">{{ s.subject }}</p>
            </div>
            <span class="student-tag tag-green">{{ s.grade }}</span>
          </div>
        </div>
        <!-- Pending Actions -->
        <div class="violations-mini">
          <div class="vm-header">
            <span class="vm-label">Pending Actions</span>
          </div>
          <div class="pending-actions-list">
            <div class="pending-action-row" v-for="action in facultyPendingActions" :key="action.label">
              <div class="pending-dot" :style="{ background: action.color }"></div>
              <span class="pending-text">{{ action.label }}</span>
              <span class="pending-badge" :style="{ background: action.color + '18', color: action.color }">{{ action.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subjects I Teach -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Subjects I Teach</h3><p class="card-sub">Current semester workload</p></div>
          <router-link to="/faculty/subjects" class="card-link">View all →</router-link>
        </div>
        <div class="faculty-subjects-list">
          <div class="faculty-subject-row" v-for="subj in facultySubjects" :key="subj.code">
            <div class="fsubj-left">
              <div class="fsubj-icon" :style="{ background: subj.color + '18', color: subj.color }">
                <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              </div>
              <div class="fsubj-info">
                <p class="fsubj-code">{{ subj.code }}</p>
                <p class="fsubj-name">{{ subj.name }}</p>
              </div>
            </div>
            <div class="fsubj-right">
              <span class="fsubj-section">{{ subj.section }}</span>
              <span class="fsubj-enrolled">{{ subj.enrolled }} students</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- END FACULTY BOTTOM GRID -->

    <!-- ==================== SECRETARY BOTTOM GRID ==================== -->
    <div v-else-if="authStore.isSecretary" class="bottom-grid">

      <!-- Recent Account Requests -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Recent Account Requests</h3><p class="card-sub">Pending student & faculty accounts</p></div>
          <router-link to="/secretary/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="req in secAccountRequests" :key="req.name">
            <div class="student-avatar" :style="{ background: req.color }">{{ req.name.charAt(0) }}</div>
            <div class="student-info">
              <p class="student-name">{{ req.name }}</p>
              <p class="student-course">{{ req.type }} · {{ req.course }}</p>
            </div>
            <span class="student-tag" :class="req.statusClass">{{ req.status }}</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          <span>{{ secStats.pendingAccounts }} accounts awaiting creation</span>
          <button>Create Now →</button>
        </div>
      </div>

      <!-- Faculty Workload Overview -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Faculty Workload</h3><p class="card-sub">Schedules & subject loads</p></div>
          <router-link to="/secretary/faculty" class="card-link">View all →</router-link>
        </div>
        <div class="faculty-subjects-list">
          <div class="faculty-subject-row" v-for="f in secFacultyWorkload" :key="f.name">
            <div class="fsubj-left">
              <div class="fsubj-icon" :style="{ background: f.color + '18', color: f.color }">
                <svg viewBox="0 0 18 18" fill="none"><path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              </div>
              <div class="fsubj-info">
                <p class="fsubj-code">{{ f.name }}</p>
                <p class="fsubj-name">{{ f.department }}</p>
              </div>
            </div>
            <div class="fsubj-right">
              <span class="fsubj-section">{{ f.subjects }} subjects</span>
              <span class="fsubj-enrolled">{{ f.students }} students</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Verification -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Achievement Verification</h3><p class="card-sub">Pending awards to verify</p></div>
          <router-link to="/secretary/achievements" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="ach in secPendingAchievements" :key="ach.student">
            <div class="student-avatar" :style="{ background: ach.color }">{{ ach.student.charAt(0) }}</div>
            <div class="student-info">
              <p class="student-name">{{ ach.student }}</p>
              <p class="student-course">{{ ach.achievement }}</p>
            </div>
            <span class="student-tag tag-orange">Pending</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6-4-2.9h4.5L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>{{ secStats.pendingVerifications }} achievements need verification</span>
          <button>Verify Now →</button>
        </div>
      </div>

    </div>
    <!-- END SECRETARY BOTTOM GRID -->

    <!-- ==================== CHAIR BOTTOM GRID ==================== -->
    <div v-else-if="authStore.isChair" class="bottom-grid">

      <!-- Academic Performance Trend -->
      <div class="card chart-card">
        <div class="card-header">
          <div><h3 class="card-title">Academic Performance Trends</h3><p class="card-sub">Department avg GWA per semester</p></div>
          <router-link to="/chair/performance" class="card-link">Full report →</router-link>
        </div>
        <div class="chart-bars">
          <div class="chart-bar-col" v-for="(bar, i) in chairChartData" :key="i">
            <div class="chart-bar-wrap">
              <div class="chart-bar-fill" :class="{ current: i === chairChartData.length - 1 }" :style="{ height: bar.pct + '%' }">
                <span class="chart-tooltip">{{ bar.sem }}: {{ bar.gwa }}</span>
              </div>
            </div>
            <span class="chart-bar-label">{{ bar.sem }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot current"></span><span class="legend-text">Current sem</span>
          <span class="legend-dot"></span><span class="legend-text">Previous</span>
        </div>
      </div>

      <!-- Top Performing Students -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Top Performing Students</h3><p class="card-sub">Ranked by GWA · current semester</p></div>
          <router-link to="/chair/students" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="(s, i) in chairTopStudents" :key="i">
            <span class="rank">{{ i + 1 }}</span>
            <div class="student-avatar" :style="{ background: s.color }">{{ s.name.charAt(0) }}</div>
            <div class="student-info"><p class="student-name">{{ s.name }}</p><p class="student-course">{{ s.course }}</p></div>
            <span class="student-tag" :class="s.tagClass">{{ s.tag }}</span>
            <span class="student-gwa">{{ s.gwa }}</span>
          </div>
        </div>
      </div>

      <!-- Pending Award Approvals -->
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">Pending Award Approvals</h3><p class="card-sub">Awaiting your review</p></div>
          <router-link to="/chair/awards" class="card-link">View all →</router-link>
        </div>
        <div class="student-list">
          <div class="student-row" v-for="ach in chairPendingAwards" :key="ach.student">
            <div class="student-avatar" :style="{ background: ach.color }">{{ ach.student.charAt(0) }}</div>
            <div class="student-info">
              <p class="student-name">{{ ach.student }}</p>
              <p class="student-course">{{ ach.award }}</p>
            </div>
            <span class="student-tag tag-orange">Pending</span>
          </div>
        </div>
        <div class="violation-alert">
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6-4-2.9h4.5L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>{{ chairStats.pendingAwards }} awards need your approval</span>
          <router-link to="/chair/awards" style="background:none;border:none;color:#FF6B1A;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none">Approve Now →</router-link>
        </div>
      </div>

    </div>
    <!-- END CHAIR BOTTOM GRID -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref([])
const profileIncomplete = ref(false)

// ==================== STUDENT STATE ====================
const studentProfile = ref({ gwa: '' })
const studentActivities = ref([
  { title: 'ICPEP.SE Hackathon' },
  { title: 'Annual JS Summit 2026' },
  { title: 'Campus Clean Drive' }
])
const studentAwards = ref([
  { title: "Dean's List Awardee", semester: '1st Sem 2025-2026', badge: 'Academic', color: '#f59e0b' },
  { title: 'Best Research Paper', semester: '2nd Sem 2024-2025', badge: 'Research', color: '#3b82f6' },
  { title: 'Outstanding Student Leader', semester: '1st Sem 2024-2025', badge: 'Leadership', color: '#10b981' }
])
const studentViolations = ref([])
const todaySchedule = ref([
  { time: '7:30 AM', duration: '1.5 hrs', subject: 'Data Structures & Algorithms', professor: 'Dr. R. Villanueva', room: 'CS Lab 3', type: 'Lecture', color: '#8b5cf6' },
  { time: '10:00 AM', duration: '3 hrs', subject: 'Software Engineering', professor: 'Prof. A. Reyes', room: 'Room 204', type: 'Lab', color: '#FF6B1A' },
  { time: '1:00 PM', duration: '1.5 hrs', subject: 'Discrete Mathematics', professor: 'Dr. J. Cruz', room: 'Room 101', type: 'Lecture', color: '#3b82f6' }
])
const studentChartData = ref([
  { sem: "1st '23", gwa: 1.95, pct: 45 }, { sem: "2nd '23", gwa: 1.88, pct: 55 },
  { sem: "1st '24", gwa: 1.81, pct: 68 }, { sem: "2nd '24", gwa: 1.77, pct: 76 },
  { sem: "1st '25", gwa: 1.74, pct: 83 }, { sem: "2nd '25", gwa: 1.72, pct: 90 }
])

// ==================== FACULTY STATE ====================
const facultyStats = ref({ totalSubjects: 4, totalStudents: 142 })
const facultyScheduleToday = ref([
  { time: '7:30 AM', duration: '1.5 hrs', subject: 'Data Structures & Algorithms', section: 'BSCS 3-A', room: 'CS Lab 3', enrolled: 38, color: '#8b5cf6' },
  { time: '10:00 AM', duration: '1.5 hrs', subject: 'Algorithms & Complexity', section: 'BSCS 3-B', room: 'Room 204', enrolled: 35, color: '#FF6B1A' },
  { time: '1:00 PM', duration: '3 hrs', subject: 'Data Structures Lab', section: 'BSCS 3-A', room: 'CS Lab 3', enrolled: 38, color: '#3b82f6' }
])
const facultyTopStudents = ref([
  { name: 'Aira Mae Reyes', subject: 'Data Structures', grade: '1.00', color: '#f59e0b' },
  { name: 'Jose Miguel Cruz', subject: 'Algorithms', grade: '1.25', color: '#3b82f6' },
  { name: 'Katrina Villanueva', subject: 'Data Structures', grade: '1.25', color: '#10b981' },
  { name: 'Mark Dela Cruz', subject: 'Data Structures Lab', grade: '1.50', color: '#8b5cf6' }
])
const facultyPendingActions = ref([
  { label: 'Grades to submit', count: 2, color: '#FF6B1A' },
  { label: 'Award recommendations', count: 3, color: '#f59e0b' },
  { label: 'Violation reports', count: 1, color: '#ef4444' }
])
const facultySubjects = ref([
  { code: 'CS301', name: 'Data Structures & Algorithms', section: 'BSCS 3-A', enrolled: 38, color: '#8b5cf6' },
  { code: 'CS301L', name: 'Data Structures Lab', section: 'BSCS 3-A', enrolled: 38, color: '#3b82f6' },
  { code: 'CS401', name: 'Algorithms & Complexity', section: 'BSCS 3-B', enrolled: 35, color: '#FF6B1A' },
  { code: 'CS401L', name: 'Algorithms Lab', section: 'BSCS 3-B', enrolled: 31, color: '#10b981' }
])

const todayLabel = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))

// ==================== CHAIR STATE ====================
const chairStats = ref({ totalStudents: 842, totalFaculty: 38, avgGwa: '1.87', activeViolations: 12, pendingAwards: 5 })
const chairTopStudents = ref([
  { name: 'Aira Mae Reyes', course: 'BSCS', gwa: '1.21', color: '#f59e0b', tagClass: 'tag-green', tag: "Dean's List" },
  { name: 'Jose Miguel Cruz', course: 'BSIT', gwa: '1.34', color: '#3b82f6', tagClass: 'tag-green', tag: "Dean's List" },
  { name: 'Katrina Villanueva', course: 'BSCS', gwa: '1.38', color: '#10b981', tagClass: 'tag-green', tag: "Dean's List" }
])
const chairPendingAwards = ref([
  { student: 'Aira Mae Reyes', award: "Dean's List Nomination", faculty: 'Dr. R. Villanueva', color: '#f59e0b' },
  { student: 'Jose Miguel Cruz', award: 'Best Research Paper', faculty: 'Prof. A. Reyes', color: '#3b82f6' },
  { student: 'Mark Dela Cruz', award: "Dean's List Nomination", faculty: 'Dr. J. Cruz', color: '#8b5cf6' }
])
const chairChartData = ref([
  { sem: "1st '22", gwa: 2.14, pct: 38 }, { sem: "2nd '22", gwa: 2.08, pct: 50 },
  { sem: "1st '23", gwa: 2.01, pct: 60 }, { sem: "2nd '23", gwa: 1.96, pct: 68 },
  { sem: "1st '24", gwa: 1.91, pct: 75 }, { sem: "2nd '24", gwa: 1.87, pct: 85 }
])

// ==================== SECRETARY STATE ====================
const secStats = ref({ totalStudents: 842, totalFaculty: 38, pendingAccounts: 5, pendingVerifications: 8 })
const secAccountRequests = ref([
  { name: 'Juan dela Cruz', type: 'Student', course: 'BSCS', status: 'Pending', statusClass: 'tag-orange', color: '#FF6B1A' },
  { name: 'Ana Reyes', type: 'Student', course: 'BSIT', status: 'Pending', statusClass: 'tag-orange', color: '#3b82f6' },
  { name: 'Prof. R. Santos', type: 'Faculty', course: 'CCS Dept', status: 'Pending', statusClass: 'tag-orange', color: '#8b5cf6' },
  { name: 'Maria Cruz', type: 'Student', course: 'BSCS', status: 'Pending', statusClass: 'tag-orange', color: '#10b981' }
])
const secFacultyWorkload = ref([
  { name: 'Dr. R. Villanueva', department: 'CS Department', subjects: 3, students: 95, color: '#FF6B1A' },
  { name: 'Prof. A. Reyes', department: 'CS Department', subjects: 2, students: 70, color: '#3b82f6' },
  { name: 'Dr. J. Cruz', department: 'Math Department', subjects: 4, students: 140, color: '#8b5cf6' },
  { name: 'Prof. L. Garcia', department: 'CS Department', subjects: 2, students: 65, color: '#10b981' }
])
const secPendingAchievements = ref([
  { student: 'Aira Mae Reyes', achievement: "Dean's List Nomination", color: '#f59e0b' },
  { student: 'Jose Miguel Cruz', achievement: 'Best Research Paper', color: '#3b82f6' },
  { student: 'Katrina Villanueva', achievement: 'Leadership Award', color: '#10b981' },
  { student: 'Mark Dela Cruz', achievement: "Dean's List Nomination", color: '#8b5cf6' }
])

// ==================== FETCH ====================
const fetchSummary = async () => {
  loading.value = true
  try {
    if (authStore.isDean || authStore.isChair || authStore.isSecretary) {
      const response = await axios.get('/analytics/summary')
      const data = response.data
      stats.value = [
        { label: 'Total Students', value: data.total_students.toString(), delta: 'Real-time sync', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Total Faculty', value: data.total_faculty.toString(), delta: 'Active members', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Dept. Avg GWA', value: data.dept_avg_gwa.toFixed(2), delta: 'Target: 1.75', deltaClass: 'warning', fill: '60%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'With Violations', value: data.active_violations.toString(), delta: 'Active cases', deltaClass: 'negative', fill: '25%', iconBg: '#fff1f2', iconColor: '#ef4444', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Awards Logged', value: data.total_awards.toString(), delta: 'Recognitions', deltaClass: 'positive', fill: '100%', iconBg: '#fffbeb', iconColor: '#f59e0b', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' }
      ]
    } else if (authStore.isStudent) {
      const response = await axios.get('/student/profile')
      const s = response.data
      profileIncomplete.value = !s.gender || !s.contact_number || !s.address
      studentProfile.value = { ...s }
      stats.value = [
        { label: 'My GWA', value: s.gwa || '0.00', delta: 'Academic', deltaClass: 'positive', fill: '80%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/student/academic-history', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Subjects', value: '7', delta: 'Enrolled', deltaClass: 'positive', fill: '70%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/student/schedule', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h6M6 9h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Awards', value: '3', delta: 'This year', deltaClass: 'positive', fill: '60%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/student/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Violations', value: '0', delta: 'Clear record', deltaClass: 'positive', fill: '0%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/student/violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Activities', value: '6', delta: 'Non-academic', deltaClass: 'positive', fill: '50%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/student/activities', iconPath: '<circle cx="9" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M2 16c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
      ]
    } else if (authStore.isFaculty) {
      // Replace with real API call when backend is ready
      // const response = await axios.get('/faculty/dashboard/summary')
      stats.value = [
        { label: 'My Subjects', value: '4', delta: 'This semester', deltaClass: 'positive', fill: '80%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/faculty/subjects', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Total Students', value: '142', delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/faculty/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Avg Class GWA', value: '1.87', delta: 'All classes', deltaClass: 'positive', fill: '75%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Violations Filed', value: '3', delta: 'This semester', deltaClass: 'negative', fill: '15%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/faculty/violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Awards Given', value: '5', delta: 'Recommended', deltaClass: 'positive', fill: '50%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/faculty/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' }
      ]
    } else if (authStore.isSecretary) {
      // Replace with real API call when backend is ready
      // const response = await axios.get('/secretary/dashboard/summary')
      stats.value = [
        { label: 'Total Students', value: secStats.value.totalStudents.toString(), delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/secretary/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Total Faculty', value: secStats.value.totalFaculty.toString(), delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/secretary/faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Pending Accounts', value: secStats.value.pendingAccounts.toString(), delta: 'To create', deltaClass: 'warning', fill: '30%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/secretary/students', iconPath: '<path d="M9 1v10M9 1L6 4M9 1l3 3M2 13h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Pending Verify', value: secStats.value.pendingVerifications.toString(), delta: 'Achievements', deltaClass: 'warning', fill: '40%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/secretary/achievements', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Dept Reports', value: '12', delta: 'Generated', deltaClass: 'positive', fill: '80%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/secretary/reports', iconPath: '<path d="M4 15V9m4 6V5m4 10v-4m4 4V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' }
      ]
    } else if (authStore.isChair) {
      // Replace with real API call when backend is ready
      // const response = await axios.get('/chair/dashboard/summary')
      stats.value = [
        { label: 'Total Students', value: chairStats.value.totalStudents.toString(), delta: 'Enrolled', deltaClass: 'positive', fill: '100%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/chair/students', iconPath: '<path d="M9 8a3 3 0 100-6 3 3 0 000 6zM2 16a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Total Faculty', value: chairStats.value.totalFaculty.toString(), delta: 'Active', deltaClass: 'positive', fill: '100%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/chair/faculty', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 6h1m-1 3h1m4-3h1m-1 3h1M6 13v-3a1 1 0 011-1h4a1 1 0 011-1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Dept Avg GWA', value: chairStats.value.avgGwa, delta: 'This semester', deltaClass: 'positive', fill: '75%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/chair/performance', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { label: 'Active Violations', value: chairStats.value.activeViolations.toString(), delta: 'This semester', deltaClass: 'negative', fill: '20%', iconBg: '#fff1f2', iconColor: '#ef4444', route: '/chair/violations', iconPath: '<path d="M9 5v4M9 11.5v.5M2.5 14h13a1 1 0 00.87-1.5L10 2.5a1 1 0 00-1.74 0L2.5 12.5A1 1 0 002.5 14z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
        { label: 'Pending Awards', value: chairStats.value.pendingAwards.toString(), delta: 'To approve', deltaClass: 'warning', fill: '35%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/chair/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' }
      ]
    }
  } catch (err) {
    console.error('Failed to fetch dashboard summary:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchSummary() })

// ==================== DEAN STATIC DATA ====================
const chartData = [
  { sem: "1st '22", gwa: 2.14, pct: 38 }, { sem: "2nd '22", gwa: 2.08, pct: 50 },
  { sem: "1st '23", gwa: 2.01, pct: 60 }, { sem: "2nd '23", gwa: 1.96, pct: 68 },
  { sem: "1st '24", gwa: 1.91, pct: 75 }, { sem: "2nd '24", gwa: 1.87, pct: 85 }
]
const topStudents = [
  { name: 'Aira Mae Reyes', course: 'BSCS', tag: "Dean's List", gwa: '1.21', color: '#f59e0b', tagClass: 'tag-green' },
  { name: 'Jose Miguel Cruz', course: 'BSIT', tag: "Dean's List", gwa: '1.34', color: '#3b82f6', tagClass: 'tag-green' },
  { name: 'Katrina Villanueva', course: 'BSCS', tag: "Dean's List", gwa: '1.38', color: '#10b981', tagClass: 'tag-green' }
]
const deanViolations = [
  { name: 'Ryan Santos', type: 'Academic Dishonesty', severity: 'Major', color: '#b91c1c', severityClass: 'sev-major' },
  { name: 'Luis Pascual', type: 'Excessive Absences', severity: 'Moderate', color: '#c2410c', severityClass: 'sev-moderate' }
]
</script>

<style scoped>
/* ===== HERO ===== */
.hero-banner { background: linear-gradient(130deg, #1a0a00 0%, #3d1500 55%, #FF6B1A 130%); border-radius: 20px; padding: 28px 32px; position: relative; overflow: hidden; margin-bottom: 20px; }
.profile-warning-banner { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 20px; }
.warning-content { display: flex; align-items: center; gap: 16px; }
.warning-icon { width: 32px; height: 32px; color: #FF6B1A; }
.warning-text h4 { color: #fff; font-family: 'Syne', sans-serif; font-size: 16px; margin-bottom: 2px; }
.warning-text p { color: rgba(255,255,255,0.6); font-size: 13px; }
.complete-btn { background: #fff; color: #1a0a00; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; transition: all 0.2s; white-space: nowrap; }
.complete-btn:hover { background: #FF6B1A; color: #fff; }
.hero-bg-shape { position: absolute; border-radius: 50%; pointer-events: none; }
.shape-1 { width: 320px; height: 320px; background: rgba(255,107,26,0.15); top: -100px; right: -80px; filter: blur(60px); }
.shape-2 { width: 200px; height: 200px; background: rgba(255,255,255,0.05); bottom: -60px; left: 40%; filter: blur(40px); }
.hero-body { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hero-eyebrow { display: flex; align-items: center; gap: 7px; font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.eyebrow-dot { width: 6px; height: 6px; background: #FF6B1A; border-radius: 50%; box-shadow: 0 0 8px #FF6B1A; }
.hero-greeting { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 8px; }
.hero-desc { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.6; max-width: 400px; margin-bottom: 20px; }
.hero-desc strong { color: rgba(255,255,255,0.85); font-weight: 500; }
.hero-actions { display: flex; gap: 10px; }
.hero-btn-primary { display: flex; align-items: center; gap: 8px; background: #FF6B1A; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 16px rgba(255,107,26,0.4); text-decoration: none; }
.hero-btn-primary:hover { background: #e85500; transform: translateY(-1px); }
.hero-btn-badge { background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 6px; font-size: 11px; }
.hero-btn-ghost { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; backdrop-filter: blur(8px); text-decoration: none; }
.hero-btn-ghost:hover { background: rgba(255,255,255,0.18); }
.hero-right { display: flex; gap: 12px; flex-shrink: 0; }
.hero-stat-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 16px 20px; display: flex; flex-direction: column; gap: 2px; backdrop-filter: blur(8px); min-width: 100px; }
.hero-stat-card.accent { background: rgba(255,107,26,0.2); border-color: rgba(255,107,26,0.3); }
.hsc-label { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.6px; }
.hsc-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; line-height: 1; margin-top: 4px; }
.hsc-sub { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* ===== STATS ===== */
.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-top: 20px; }
.stat-card { background: #fff; border: 1px solid #f0e8e0; border-radius: 16px; padding: 18px 18px 14px; transition: all 0.2s; }
.stat-card.clickable { cursor: pointer; }
.stat-card.clickable:hover { border-color: #FF6B1A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,26,0.1); }
.stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.stat-label { font-size: 10px; font-weight: 600; color: #9a8070; text-transform: uppercase; letter-spacing: 0.6px; line-height: 1.4; max-width: 80px; }
.stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon svg { width: 16px; height: 16px; }
.stat-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 4px; margin-bottom: 12px; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #1a0a00; line-height: 1; }
.stat-delta { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 5px; white-space: nowrap; }
.stat-delta.positive { background: #f0fdf4; color: #16a34a; }
.stat-delta.negative { background: #fff1f2; color: #e11d48; }
.stat-delta.warning { background: #fff5ef; color: #c94000; }
.stat-bar { height: 3px; background: #f0e8e0; border-radius: 2px; overflow: hidden; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

/* ===== GRID & CARDS ===== */
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 20px; }
.card { background: #fff; border: 1px solid #f0e8e0; border-radius: 18px; padding: 22px; }
.card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1a0a00; }
.card-sub { font-size: 11px; color: #b89f90; margin-top: 3px; }
.card-link { font-size: 11px; font-weight: 600; color: #FF6B1A; text-decoration: none; white-space: nowrap; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.card-link:hover { text-decoration: underline; }

/* ===== CHART ===== */
.chart-bars { display: flex; align-items: flex-end; gap: 8px; height: 140px; padding-bottom: 4px; }
.chart-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 4px; }
.chart-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.chart-bar-fill { width: 100%; background: #fde8d8; border-radius: 5px 5px 0 0; transition: height 0.8s ease; position: relative; cursor: pointer; }
.chart-bar-fill.current { background: #FF6B1A; }
.chart-bar-fill:hover .chart-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }
.chart-tooltip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%) translateY(4px); background: #1a0a00; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 6px; white-space: nowrap; opacity: 0; transition: all 0.15s; pointer-events: none; }
.chart-bar-label { font-size: 8px; color: #b89f90; text-transform: uppercase; letter-spacing: 0.3px; text-align: center; white-space: nowrap; }
.chart-legend { display: flex; align-items: center; gap: 16px; margin-top: 16px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; background: #fde8d8; }
.legend-dot.current { background: #FF6B1A; }
.legend-text { font-size: 10px; color: #b89f90; }

/* ===== STUDENT LIST (shared) ===== */
.student-list { display: flex; flex-direction: column; gap: 10px; }
.student-row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; transition: background 0.15s; }
.student-row:hover { background: #faf8f6; }
.rank { font-size: 11px; font-weight: 700; color: #ddd0c8; width: 14px; flex-shrink: 0; text-align: center; }
.student-avatar { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
.student-info { flex: 1; min-width: 0; }
.student-name { font-size: 12px; font-weight: 600; color: #1a0a00; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.student-course { font-size: 10px; color: #b89f90; }
.student-tag { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 5px; white-space: nowrap; }
.tag-green { background: #f0fdf4; color: #16a34a; }
.tag-orange { background: #fff5ef; color: #c94000; }
.student-gwa { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #1a0a00; flex-shrink: 0; }

/* ===== VIOLATIONS (shared) ===== */
.violation-list { display: flex; flex-direction: column; gap: 10px; }
.violation-row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; transition: background 0.15s; }
.violation-row:hover { background: #faf8f6; }
.violation-avatar { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
.violation-info { flex: 1; min-width: 0; }
.violation-name { font-size: 12px; font-weight: 600; color: #1a0a00; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.violation-type { font-size: 10px; color: #b89f90; }
.violation-badge { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 5px; white-space: nowrap; }
.sev-major { background: #fff1f2; color: #e11d48; }
.sev-moderate { background: #fff7ed; color: #ea580c; }
.sev-minor { background: #fffbeb; color: #d97706; }
.violation-alert { margin-top: 16px; padding: 12px; background: #1a0a00; border-radius: 12px; display: flex; align-items: center; gap: 10px; color: #fff; font-size: 11px; }
.violation-alert svg { width: 14px; height: 14px; color: #FF6B1A; }
.violation-alert span { flex: 1; }
.violation-alert button { background: none; border: none; color: #FF6B1A; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }

/* ===== SCHEDULE (shared) ===== */
.schedule-list { display: flex; flex-direction: column; }
.schedule-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; }
.schedule-time-col { width: 64px; flex-shrink: 0; }
.schedule-time { display: block; font-size: 11px; font-weight: 700; color: #1a0a00; }
.schedule-duration { font-size: 9px; color: #b89f90; }
.schedule-dot-col { display: flex; flex-direction: column; align-items: center; width: 18px; flex-shrink: 0; padding-top: 3px; }
.schedule-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.schedule-line { flex: 1; width: 2px; background: #f0e8e0; margin-top: 4px; min-height: 20px; }
.schedule-row:last-child .schedule-line { display: none; }
.schedule-info { flex: 1; min-width: 0; }
.schedule-subject { font-size: 12px; font-weight: 600; color: #1a0a00; }
.schedule-prof { font-size: 10px; color: #b89f90; margin-top: 2px; }
.schedule-type-badge { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 5px; white-space: nowrap; align-self: flex-start; margin-top: 3px; }

/* ===== STUDENT violations mini ===== */
.violations-mini { border-top: 1px solid #f0e8e0; padding-top: 14px; margin-top: 10px; }
.vm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.vm-label { font-size: 11px; font-weight: 700; color: #1a0a00; text-transform: uppercase; letter-spacing: 0.5px; }
.vm-clear { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #10b981; font-weight: 500; }

/* ===== FACULTY SPECIFIC ===== */
.pending-actions-list { display: flex; flex-direction: column; gap: 8px; }
.pending-action-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; background: #faf8f6; }
.pending-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pending-text { flex: 1; font-size: 12px; color: #1a0a00; font-weight: 500; }
.pending-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }

.faculty-subjects-list { display: flex; flex-direction: column; gap: 10px; }
.faculty-subject-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px; border: 1px solid #f0e8e0; border-radius: 12px; transition: all 0.15s; }
.faculty-subject-row:hover { border-color: #FF6B1A; background: #fffaf8; }
.fsubj-left { display: flex; align-items: center; gap: 10px; }
.fsubj-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fsubj-icon svg { width: 16px; height: 16px; }
.fsubj-code { font-size: 11px; font-weight: 700; color: #FF6B1A; }
.fsubj-name { font-size: 12px; font-weight: 500; color: #1a0a00; margin-top: 1px; }
.fsubj-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.fsubj-section { font-size: 11px; font-weight: 600; color: #1a0a00; }
.fsubj-enrolled { font-size: 10px; color: #b89f90; }

/* ===== EMPTY ===== */
.empty-small { font-size: 12px; color: #b89f90; font-style: italic; padding: 8px 0; }
</style>