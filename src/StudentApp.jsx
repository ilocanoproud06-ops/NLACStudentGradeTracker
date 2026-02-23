import React, { useState, useEffect } from 'react';
import StudentLogin from './StudentLogin';
import StudentDashboard from './StudentDashboard';
import StudentWelcome from './StudentWelcome';

function StudentApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [studentData, setStudentData] = useState(null);

  const handleStudentLogin = (student) => {
    setStudentData(student);
    setIsAuthenticated(true);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStudentData(null);
    setShowWelcome(true);
  };

  // Show welcome page first
  if (showWelcome) {
    return <StudentWelcome onEnter={() => setShowWelcome(false)} onBack={() => window.location.href = '/'} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <StudentLogin onLogin={handleStudentLogin} onBack={() => setShowWelcome(true)} />;
  }

  // Show student dashboard if authenticated
  return <StudentDashboard student={studentData} onLogout={handleLogout} />;
}

export default StudentApp;