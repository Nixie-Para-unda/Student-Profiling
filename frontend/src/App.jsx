import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import FacultyLogin from './views/auth/login/FacultyLogin'
import StudentLogin from './views/auth/login/StudentLogin'
import SetupPassword from './views/auth/setup/SetupPassword'
import SetupPasswordFaculty from './views/auth/setup/SetupPasswordFaculty'
import ActivateAccount from './views/auth/activate/ActivateAccount'
import Settings from './views/shared/Settings'
import StudentProfile from './views/student/StudentProfile'
import { SecretaryDashboard, SecretaryFacultyWorkload, SecretaryAchievements, SecretaryReports } from './views/secretary/SecretaryComponents'
import { DepartmentChairDashboard, DepartmentChairViolations, DepartmentChairAwards, DepartmentChairPerformance, DepartmentChairReports, ScheduleManagement } from './views/chair/ChairComponents'
import { FacultyDashboard, FacultySchedule, FacultyStudentManagement, FacultyViolationManagement } from './views/faculty/FacultyComponents'
import { StudentCurriculum, StudentSchedule, StudentAwards, StudentViolations, StudentAcademicHistory, StudentActivities, StudentPerformance, StudentAffiliation } from './views/student/StudentViews'
import { useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<FacultyLogin />} />
      <Route path="/students/login" element={<StudentLogin />} />
      <Route path="/setup-password" element={<SetupPassword />} />
      <Route path="/setup-password-faculty" element={<SetupPasswordFaculty />} />
      <Route path="/activate" element={<ActivateAccount />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="student/dashboard" element={<StudentDashboard />} />
        <Route path="student/profile" element={<StudentProfile />} />
        <Route path="student/curriculum" element={<StudentCurriculum />} />
        <Route path="student/schedule" element={<StudentSchedule />} />
        <Route path="student/achievements" element={<StudentAwards />} />
        <Route path="student/violations" element={<StudentViolations />} />
        <Route path="student/academic-history" element={<StudentAcademicHistory />} />
        <Route path="student/activities" element={<StudentActivities />} />
        <Route path="student/performance" element={<StudentPerformance />} />
        <Route path="student/affiliation" element={<StudentAffiliation />} />

        <Route path="dean/dashboard" element={<DeanDashboard />} />
        <Route path="profiling/report" element={<ProfilingReport />} />
        <Route path="dean/curriculum" element={<CurriculumManagement />} />
        <Route path="dean/courses" element={<CourseManagement />} />
        <Route path="academic-performance" element={<PerformanceOverview />} />
        <Route path="violations" element={<ViolationsList />} />
        <Route path="violations/:id" element={<ViolationsList />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="students/:id" element={<StudentManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="faculty/:id" element={<FacultyManagement />} />
        <Route path="dean/archive" element={<ArchiveManagement />} />

        <Route path="faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="faculty/schedule" element={<FacultySchedule />} />
        <Route path="faculty/subjects" element={<FacultySchedule />} />
        <Route path="faculty/students" element={<FacultyStudentManagement />} />
        <Route path="faculty/violations" element={<FacultyViolationManagement />} />
        <Route path="faculty/awards" element={<DepartmentChairAwards />} />
        <Route path="faculty/profile" element={<StudentProfile />} />

        <Route path="secretary/dashboard" element={<SecretaryDashboard />} />
        <Route path="secretary/faculty-schedule" element={<SecretaryFacultyWorkload />} />
        <Route path="secretary/achievements" element={<SecretaryAchievements />} />
        <Route path="secretary/reports" element={<SecretaryReports />} />

        <Route path="chair/dashboard" element={<DepartmentChairDashboard />} />
        <Route path="chair/performance" element={<DepartmentChairPerformance />} />
        <Route path="chair/schedules" element={<ScheduleManagement />} />
        <Route path="chair/violations" element={<DepartmentChairViolations />} />
        <Route path="chair/awards" element={<DepartmentChairAwards />} />
        <Route path="chair/reports" element={<DepartmentChairReports />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

const DeanDashboard = () => <div className="page-container"><h1>Dean Dashboard</h1></div>
const ProfilingReport = () => <div className="page-container"><h1>Profiling Report</h1></div>
const CurriculumManagement = () => <div className="page-container"><h1>Curriculum Management</h1></div>
const CourseManagement = () => <div className="page-container"><h1>Course Management</h1></div>
const PerformanceOverview = () => <div className="page-container"><h1>Performance Overview</h1></div>
const ViolationsList = () => <div className="page-container"><h1>Violations List</h1></div>
const ArchiveManagement = () => <div className="page-container"><h1>Archive Management</h1></div>
const StudentManagement = () => <div className="page-container"><h1>Student Management</h1></div>
const FacultyManagement = () => <div className="page-container"><h1>Faculty Management</h1></div>
const StudentDashboard = () => <div className="page-container"><h1>Student Dashboard</h1></div>

export default App