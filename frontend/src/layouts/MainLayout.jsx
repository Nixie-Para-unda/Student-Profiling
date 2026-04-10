import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ccsLogo from '../assets/ccs-logo.jpg'

const icons = {
  dashboard: <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>,
  reports: <path d="M12 15V9m-4 6V5m-4 10v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  curriculum: <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 3v14M14 3v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  courses: <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 8h14M8 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  performance: <path d="M2 14l4-8 4 5 3-3 5 6H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
  violations: <path d="M10 7v3m0 3.5v.5M3.5 16h13a1 1 0 00.87-1.5l-6.5-11a1 1 0 00-1.74 0l-6.5 11A1 1 0 003.5 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  profile: <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  faculty: <path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  schedule: <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  archive: <path d="M4 6h12M4 10h12M4 14h12M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  subjects: <path d="M4 4h12v12H4zM8 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  awards: <path d="M10 2l1.8 5.4H18l-4.9 3.6 1.9 5.7L10 13.4l-5 3.3 1.9-5.7L2 7.4h6.2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
  settings: <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
}

const routeMeta = {
  'student/dashboard': { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'student', sidebar: true, icon: 'dashboard', section: 'Overview' },
  'student/profile': { title: 'My Profile', breadcrumb: 'Student Portal > My Profile', role: 'student', sidebar: false, icon: 'profile', section: 'My Academic' },
  'student/curriculum': { title: 'My Curriculum', breadcrumb: 'Academic > My Curriculum', role: 'student', sidebar: true, icon: 'curriculum', section: 'My Academic' },
  'student/schedule': { title: 'My Schedule', breadcrumb: 'Academic > My Schedule', role: 'student', sidebar: true, icon: 'schedule', section: 'Academics' },
  'student/achievements': { title: 'My Achievements', breadcrumb: 'Student Portal > My Achievements', role: 'student', sidebar: true, icon: 'awards', section: 'My Activities' },
  'student/violations': { title: 'My Violations', breadcrumb: 'Student Portal > My Violations', role: 'student', sidebar: true, icon: 'violations', section: 'My Activities' },
  'student/academic-history': { title: 'Academic History', breadcrumb: 'Academic > Academic History', role: 'student', sidebar: false, icon: 'performance', section: 'My Academic' },
  'student/activities': { title: 'My Activities', breadcrumb: 'Student Portal > My Activities', role: 'student', sidebar: false, icon: 'awards', section: 'My Activities' },
  'student/performance': { title: 'My Performance', breadcrumb: 'Academic > My Performance', role: 'student', sidebar: false, icon: 'performance', section: 'My Academic' },
  'student/affiliation': { title: 'Affiliation', breadcrumb: 'Student Portal > Affiliation', role: 'student', sidebar: false, icon: 'profile', section: 'My Activities' },
  'dean/dashboard': { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'dean', sidebar: true, icon: 'dashboard', section: 'Overview' },
  'profiling/report': { title: 'Profiling Reports', breadcrumb: 'Overview > Profiling Reports', role: 'dean', sidebar: true, icon: 'reports', section: 'Overview' },
  'dean/curriculum': { title: 'Curriculum', breadcrumb: 'Overview > Curriculum', role: 'dean', sidebar: true, icon: 'curriculum', section: 'Overview' },
  'dean/courses': { title: 'Courses', breadcrumb: 'Overview > Course Management', role: 'dean', sidebar: true, icon: 'courses', section: 'Overview' },
  'academic-performance': { title: 'Academic Performance', breadcrumb: 'Academic > Academic Performance', role: 'dean', sidebar: true, icon: 'performance', section: 'Academic' },
  'violations': { title: 'Violations', breadcrumb: 'Academic > Student Violations', role: 'dean', sidebar: true, icon: 'violations', section: 'Academic' },
  'students': { title: 'Student Accounts', breadcrumb: 'Academic > Student Accounts', role: ['dean', 'secretary', 'department_chair'], sidebar: true, icon: 'profile', section: 'Accounts' },
  'faculty': { title: 'Faculty Accounts', breadcrumb: 'Academic > Faculty Accounts', role: ['dean', 'secretary', 'department_chair'], sidebar: true, icon: 'faculty', section: 'Accounts' },
  'dean/archive': { title: 'Archive Management', breadcrumb: 'Management > Archive', role: 'dean', sidebar: true, icon: 'archive', section: 'Management' },
  'faculty/dashboard': { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'faculty', sidebar: true, icon: 'dashboard', section: 'Overview' },
  'faculty/schedule': { title: 'My Schedule', breadcrumb: 'Academic > My Schedule', role: 'faculty', sidebar: true, icon: 'schedule', section: 'My Classes' },
  'faculty/subjects': { title: 'My Subjects', breadcrumb: 'Academic > My Subjects', role: 'faculty', sidebar: true, icon: 'subjects', section: 'My Classes' },
  'faculty/students': { title: 'Student Profiles', breadcrumb: 'Academic > Student Profiles', role: 'faculty', sidebar: true, icon: 'profile', section: 'Monitoring' },
  'faculty/violations': { title: 'Record Violation', breadcrumb: 'Academic > Student Violations', role: 'faculty', sidebar: true, icon: 'violations', section: 'Monitoring' },
  'faculty/awards': { title: 'Recommend Awards', breadcrumb: 'Academic > Recommend Awards', role: 'faculty', sidebar: true, icon: 'awards', section: 'Monitoring' },
  'faculty/profile': { title: 'My Profile', breadcrumb: 'Faculty Portal > My Profile', role: 'faculty', sidebar: true, icon: 'profile', section: 'My Academic' },
  'secretary/dashboard': { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'secretary', sidebar: true, icon: 'dashboard', section: 'Overview' },
  'secretary/faculty-schedule': { title: 'Faculty Workload', breadcrumb: 'Monitoring > Faculty Workload', role: ['secretary', 'dean'], sidebar: true, icon: 'schedule', section: 'Monitoring' },
  'secretary/achievements': { title: 'Achievement Verification', breadcrumb: 'Management > Achievement Verification', role: 'secretary', sidebar: true, icon: 'awards', section: 'Management', badge: '8', badgeClass: 'warning' },
  'secretary/reports': { title: 'Generate Reports', breadcrumb: 'Reports > Generate Reports', role: 'secretary', sidebar: true, icon: 'reports', section: 'Reports' },
  'chair/dashboard': { title: 'Dashboard', breadcrumb: 'Overview > Dashboard', role: 'department_chair', sidebar: true, icon: 'dashboard', section: 'Overview' },
  'chair/performance': { title: 'Academic Performance', breadcrumb: 'Academic > Academic Performance', role: 'department_chair', sidebar: true, icon: 'performance', section: 'Academic' },
  'chair/schedules': { title: 'Manage Schedules', breadcrumb: 'Academic > Schedule Management', role: 'department_chair', sidebar: true, icon: 'schedule', section: 'Academic' },
  'chair/violations': { title: 'Student Violations', breadcrumb: 'Academic > Student Violations', role: 'department_chair', sidebar: true, icon: 'violations', section: 'Management', badge: '12', badgeClass: 'danger' },
  'chair/awards': { title: 'Approve Awards', breadcrumb: 'Academic > Approve Awards', role: 'department_chair', sidebar: true, icon: 'awards', section: 'Management', badge: '5', badgeClass: 'warning' },
  'chair/reports': { title: 'Generate Reports', breadcrumb: 'Reports > Generate Reports', role: 'department_chair', sidebar: true, icon: 'reports', section: 'Management' },
  'settings': { title: 'Account Settings', breadcrumb: 'Settings > Account Settings', sidebar: false, icon: 'settings', section: 'Settings' }
}

const allRoutes = Object.entries(routeMeta).map(([path, meta]) => ({ path, ...meta }))

function MainLayout() {
  const { user, fetchUser, logout, getDashboardRoute, isStudent } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUser()
    }
  }, [])

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }, [])

  const userInitials = useMemo(() => {
    if (!user?.name) return 'U'
    const names = user.name.trim().split(' ')
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0)
    }
    return names[0].charAt(0)
  }, [user])

  const portalLabel = useMemo(() => {
    if (!user) return 'Portal'
    const role = user.role
    if (role === 'dean') return 'Dean Portal'
    if (role === 'faculty') return 'Faculty Portal'
    if (role === 'student') return 'Student Portal'
    if (role === 'secretary') return 'Admin Portal'
    if (role === 'department_chair') return 'Chair Portal'
    return 'Portal'
  }, [user])

  const breadcrumb = useMemo(() => {
    const path = location.pathname.substring(1)
    const meta = routeMeta[path]
    if (!meta?.breadcrumb) return null
    return {
      category: meta.breadcrumb.split(' > ')[0],
      current: meta.breadcrumb.split(' > ')[1]
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    if (isStudent) {
      navigate('/students/login')
    } else {
      navigate('/login')
    }
  }

  const menuSections = useMemo(() => {
    const userRole = user?.role
    if (!userRole) return []

    const sidebarRoutes = allRoutes.filter(r => {
      if (!r.sidebar) return false
      if (r.role) {
        if (Array.isArray(r.role)) {
          return r.role.includes(userRole)
        }
        return r.role === userRole
      }
      return true
    })

    const sections = {}
    sidebarRoutes.forEach(route => {
      let sectionName = route.section || 'Other'
      let title = route.title

      if (userRole === 'department_chair') {
        if (route.path === 'students') {
          sectionName = 'Academic'
          title = 'Student Profiles'
        } else if (route.path === 'faculty') {
          sectionName = 'Academic'
          title = 'Faculty Members'
        }
      }

      if (!sections[sectionName]) {
        sections[sectionName] = []
      }
      sections[sectionName].push({ ...route, displayTitle: title })
    })

    const sectionOrder = ['Overview', 'My Academic', 'Academics', 'Academic', 'My Classes', 'Accounts', 'Monitoring', 'Management', 'Reports', 'My Activities', 'Settings']

    return Object.keys(sections)
      .sort((a, b) => {
        const indexA = sectionOrder.indexOf(a)
        const indexB = sectionOrder.indexOf(b)
        if (indexA === -1 && indexB === -1) return a.localeCompare(b)
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
      })
      .map(name => ({
        name,
        items: sections[name]
      }))
  }, [user])

  return (
    <div className="dashboard-root">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div 
          className="sidebar-brand" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand Sidebar' : ''}
        >
          <div className="brand-icon">
            <img src={ccsLogo} alt="CSS Logo" className="brand-logo-img" />
          </div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <span className="brand-name">CSS Portal</span>
              <span className="brand-sub">CCS · AY 2026–2027</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="collapse-btn" onClick={(e) => { e.stopPropagation(); setSidebarCollapsed(true); }}>
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="sidebar-brand-separator" style={{ display: sidebarCollapsed ? 'none' : 'block' }}></div>

        <nav className="sidebar-nav">
          {menuSections.map(section => (
            <div key={section.name}>
              <div className="nav-section-label" style={{ display: sidebarCollapsed ? 'none' : 'block' }}>{section.name}</div>
              
              {section.items.map(item => (
                <Link 
                  key={item.path}
                  to={`/${item.path}`} 
                  className={`nav-item ${location.pathname === `/${item.path}` ? 'active' : ''}`}
                >
                  <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
                    {icons[item.icon] || icons.dashboard}
                  </svg>
                  {!sidebarCollapsed && <span>{item.displayTitle || item.title}</span>}
                  {item.meta?.badge && !sidebarCollapsed && (
                    <span className={`nav-badge ${item.meta.badgeClass || 'warning'}`}>
                      {item.meta.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <div className="page-title-block">
              <div className="page-breadcrumb">
                College of <span className="breadcrumb-orange">Computing Studies</span>
                <span className="breadcrumb-sep">|</span>
                {portalLabel}
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="date-chip">
              <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
                <path d="M17.5 3.5h-2V2M6.5 3.5h-2V2M3.75 8.5h12.5M3.5 4.5h13c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2v-11c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="date-text">{currentDate}</span>
            </div>
            <div className="topbar-separator"></div>
            <button className="icon-btn notification-btn" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.46 5.36 5.82 7.93 5.82 11v5l-2 2v1h16.36v-1l-2-2z" fill="currentColor"/>
                <circle cx="19" cy="17" r="2.5" fill="#FF6B1A"/>
              </svg>
            </button>
            <div className="topbar-separator"></div>
            <div className="user-dropdown" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="topbar-user-avatar">{userInitials}</div>
              <span className="user-full-name">{user?.name ?? 'User'}</span>
              <svg className="dropdown-arrow" viewBox="0 0 20 20" fill="none" width="16" height="16">
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {showUserMenu && (
              <div className="user-menu">
                <button className="user-menu-item" onClick={() => { navigate(user?.role === 'student' ? '/student/profile' : '/faculty/profile'); setShowUserMenu(false); }}>
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>My Profile</span>
                </button>
                <button className="user-menu-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Account Settings</span>
                </button>
                <button className="user-menu-item" onClick={handleLogout}>
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <path d="M13 10H3m0 0l3-3m-3 3l3 3M8 5V4a2 2 0 012-2h5a2 2 0 012 2v12a2 2 0 01-2 2h-5a2 2 0 01-2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="content">
          {breadcrumb && (
            <div className="page-breadcrumb-trail">
              <span className="breadcrumb-category">{breadcrumb.category}</span>
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-current">{breadcrumb.current}</span>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout