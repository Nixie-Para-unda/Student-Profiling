import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function StudentDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState([])
  const [profileIncomplete, setProfileIncomplete] = useState(false)
  const [studentProfile, setStudentProfile] = useState({ gwa: '' })
  const [studentActivities, setStudentActivities] = useState([
    { title: 'ICPEP.SE Hackathon' },
    { title: 'Annual JS Summit 2026' },
    { title: 'Campus Clean Drive' }
  ])
  const [studentAwards, setStudentAwards] = useState([
    { title: "Dean's List Awardee", semester: '1st Sem 2025–2026', badge: 'Academic', color: '#f59e0b' },
    { title: 'Best Research Paper', semester: '2nd Sem 2024–2025', badge: 'Research', color: '#3b82f6' },
    { title: 'Outstanding Student Leader', semester: '1st Sem 2024–2025', badge: 'Leadership', color: '#10b981' }
  ])
  const [studentViolations, setStudentViolations] = useState([])
  const [todaySchedule, setTodaySchedule] = useState([])

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }), [])

  const studentChartData = useMemo(() => [
    { sem: "1S'23", gwa: 1.95, pct: 45 }, { sem: "2S'23", gwa: 1.88, pct: 55 },
    { sem: "1S'24", gwa: 1.81, pct: 68 }, { sem: "2S'24", gwa: 1.77, pct: 76 },
    { sem: "1S'25", gwa: 1.74, pct: 83 }, { sem: "2S'25", gwa: 1.72, pct: 90 }
  ], [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/student/profile')
        const s = response.data
        setProfileIncomplete(!s.gender || !s.contact_number || !s.address)
        setStudentProfile({ ...s })
        setStats(buildStats(s))
      } catch (err) {
        console.error('Failed to fetch student profile:', err)
        setStats(buildStats({}))
      }
    }
    fetchProfile()
  }, [])

  function buildStats(s) {
    return [
      { label: 'My GWA', value: s.gwa || '0.00', delta: 'Academic', deltaClass: 'positive', fill: '80%', iconBg: '#f5f3ff', iconColor: '#8b5cf6', route: '/student/academic-history', iconPath: '<path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>' },
      { label: 'Subjects', value: '7', delta: 'Enrolled', deltaClass: 'positive', fill: '70%', iconBg: '#eff6ff', iconColor: '#3b82f6', route: '/student/schedule', iconPath: '<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6h6M6 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>' },
      { label: 'Awards', value: '3', delta: 'This year', deltaClass: 'positive', fill: '60%', iconBg: '#fffbeb', iconColor: '#f59e0b', route: '/student/awards', iconPath: '<path d="M9 1.5l1.6 4.8H16l-4.2 3.1 1.6 4.9L9 11.1l-4.4 3.2 1.6-4.9L2 7.3h5.4L9 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>' },
      { label: 'Violations', value: '0', delta: 'Clear', deltaClass: 'positive', fill: '0%', iconBg: '#f0fdf4', iconColor: '#10b981', route: '/student/violations', iconPath: '<circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>' },
      { label: 'Activities', value: '6', delta: 'Non-academic', deltaClass: 'neutral', fill: '50%', iconBg: '#fff5ef', iconColor: '#FF6B1A', route: '/student/activities', iconPath: '<circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 16c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>' }
    ]
  }

  return (
    <div className="dashboard-home">
      <div className="hero-banner">
        <div className="ambient ambient-1"></div>
        <div className="ambient ambient-2"></div>
        <div className="ambient ambient-3"></div>

        <div className="hero-body">
          <div className="hero-left">
            <div className="hero-meta">
              <span className="meta-dot"></span>
              <span>AY 2026–2027 · 2nd Semester</span>
            </div>
            <h1 className="hero-heading">
              Good morning, <span className="hero-name">{user?.name?.split(' ')[0] ?? 'Student'}</span> <span className="wave">👋</span>
            </h1>
            <div className="hero-chips">
              <span className="hero-chip">
                <svg viewBox="0 0 16 16" fill="none" style={{width:'12px',height:'12px'}}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                {todaySchedule.length} class{todaySchedule.length !== 1 ? 'es' : ''} today
              </span>
            </div>
            <div className="hero-actions">
              <Link to="/student/schedule" className="btn-primary">
                <svg viewBox="0 0 16 16" fill="none" style={{width:'14px',height:'14px'}}>
                  <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                View Schedule
              </Link>
              <Link to="/student/academic-history" className="btn-ghost">
                <svg viewBox="0 0 16 16" fill="none" style={{width:'13px',height:'13px'}}>
                  <path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Academic History
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="kpi-tile">
              <div className="kpi-tile-header">
                <svg viewBox="0 0 18 18" fill="none" className="kpi-icon">
                  <path d="M2 13l3-5 3 3 3-4 5 6H2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="kpi-eyebrow">Current GWA</span>
              </div>
              <span className="kpi-val">{studentProfile.gwa || '0.00'}</span>
              <span className="kpi-foot">This semester</span>
              <div className="kpi-sparkbar">
                {studentChartData.map((b, i) => (
                  <div key={i} className="kpi-spark-seg" style={{ height: b.pct * 0.28 + 'px', opacity: i === studentChartData.length-1 ? 1 : 0.25 + i*0.1 }}></div>
                ))}
              </div>
            </div>
            <div className="kpi-tile kpi-accent">
              <div className="kpi-tile-header">
                <svg viewBox="0 0 18 18" fill="none" className="kpi-icon">
                  <circle cx="9" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 16c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span className="kpi-eyebrow">Activities</span>
              </div>
              <span className="kpi-val">{studentActivities.length}</span>
              <span className="kpi-foot">Non-academic</span>
              <div className="kpi-ring">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.15)" strokeWidth="5"/>
                  <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.8)" strokeWidth="5" strokeDasharray="119.4" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 24 24)"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {profileIncomplete && (
        <div className="profile-nudge">
          <div className="nudge-bar-right"></div>
          <div className="nudge-left">
            <div className="nudge-icon">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 17c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="nudge-title">Your profile is incomplete</p>
              <p className="nudge-desc">Add your contact details and address to finish registration.</p>
            </div>
          </div>
          <div className="nudge-progress">
            <div className="nudge-steps">
              <div className="nudge-step done"></div>
              <div className="nudge-step done"></div>
              <div className="nudge-step"></div>
              <div className="nudge-step"></div>
            </div>
            <span className="nudge-progress-label">2 of 4 complete</span>
          </div>
          <Link to="/student/profile" className="nudge-cta">Complete Profile →</Link>
        </div>
      )}

      <div className="stats-strip">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-chip ${stat.route ? 'stat-chip--clickable' : ''}`} onClick={() => stat.route && window.history.push(stat.route)}>
            <div className="sc-icon" style={{ background: stat.iconBg, color: stat.iconColor }}>
              <svg viewBox="0 0 18 18" fill="none" width="15" height="15" dangerouslySetInnerHTML={{ __html: stat.iconPath }}></svg>
            </div>
            <div className="sc-body">
              <span className="sc-label">{stat.label}</span>
              <span className="sc-value">{stat.value}</span>
            </div>
            <span className={`sc-badge ${stat.deltaClass}`}>{stat.delta}</span>
            <div className="sc-progress">
              <div className="sc-progress-fill" style={{ width: stat.fill, background: stat.iconColor }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Today's Schedule</h3>
              <p className="panel-sub">{todayLabel}</p>
            </div>
            <Link to="/student/schedule" className="panel-link">View all →</Link>
          </div>
          <div className="timeline">
            {todaySchedule.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" style={{width:'28px',height:'28px',opacity:'.25'}}>
                  <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span>No classes today</span>
              </div>
            ) : (
              todaySchedule.map((cls, idx) => (
                <div key={idx} className="tl-item">
                  <div className="tl-time">
                    <span className="tl-t">{cls.time}</span>
                    <span className="tl-dur">{cls.duration}</span>
                  </div>
                  <div className="tl-track">
                    <div className="tl-node" style={{ background: cls.color }}></div>
                    {idx < todaySchedule.length - 1 && <div className="tl-rail"></div>}
                  </div>
                  <div className="tl-content">
                    <p className="tl-subject">{cls.subject}</p>
                    <p className="tl-meta">{cls.professor} · {cls.room}</p>
                    <span className="tl-badge" style={{ background: cls.color + '18', color: cls.color }}>{cls.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Awards & Recognition</h3>
              <p className="panel-sub">Your achievements this year</p>
            </div>
            <Link to="/student/awards" className="panel-link">View all →</Link>
          </div>
          <div className="awards-list">
            {studentAwards.slice(0,3).map((award, idx) => (
              <div key={idx} className="award-row">
                <div className="award-icon" style={{ background: award.color + '18', color: award.color }}>
                  <svg viewBox="0 0 14 14" fill="none" style={{width:'13px',height:'13px'}}>
                    <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9.5 3.5 12l1.5-4L1 5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="award-body">
                  <p className="award-title">{award.title}</p>
                  <p className="award-sem">{award.semester}</p>
                </div>
                <span className="award-chip">{award.badge}</span>
              </div>
            ))}
            {studentAwards.length === 0 && <div className="empty-state"><span>No awards yet</span></div>}
          </div>

          <div className="divider"></div>

          <div className="viol-section">
            <div className="viol-header">
              <span className="viol-label">Violations</span>
              <Link to="/student/violations" className="panel-link">See all →</Link>
            </div>
            {studentViolations.length === 0 ? (
              <div className="viol-clear">
                <div className="viol-check">
                  <svg viewBox="0 0 12 12" fill="none" style={{width:'10px',height:'10px'}}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>No active violations — keep it up!</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Academic Performance</h3>
              <p className="panel-sub">GWA trend per semester</p>
            </div>
            <Link to="/student/academic-history" className="panel-link">History →</Link>
          </div>
          <div className="chart-area">
            {studentChartData.map((bar, i) => (
              <div key={i} className="chart-col">
                <div className="chart-col-inner">
                  <div className={`chart-bar ${i === studentChartData.length - 1 ? 'chart-bar--active' : ''}`} style={{ height: bar.pct + '%' }}>
                    <div className="chart-tip">{bar.sem}<br><strong>{bar.gwa}</strong></div>
                  </div>
                </div>
                <span className="chart-lbl">{bar.sem}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="cl-dot cl-dot--active"></span><span className="cl-text">Current sem</span>
            <span className="cl-dot"></span><span className="cl-text">Previous</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard