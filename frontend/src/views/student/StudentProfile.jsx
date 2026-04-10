import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function StudentProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/student/profile')
        setProfile(response.data)
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="loading-state">Loading profile...</div>
  if (error) return <div className="error-state">{error}</div>

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'Student'}</h1>
          <p className="profile-id">Student ID: {profile?.student_number || 'N/A'}</p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <span>{profile?.email || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Contact Number</label>
              <span>{profile?.contact_number || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Gender</label>
              <span>{profile?.gender || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <span>{profile?.date_of_birth || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Address</h3>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Address</label>
              <span>{profile?.address || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Academic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Program</label>
              <span>{profile?.program || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Year Level</label>
              <span>{profile?.year_level || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Current GWA</label>
              <span>{profile?.gwa || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Enrollment Status</label>
              <span>{profile?.enrollment_status || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile