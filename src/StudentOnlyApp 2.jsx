import React, { useState } from 'react';
import StudentLogin from './StudentLogin';
import StudentWelcome from './StudentWelcome';

function StudentOnlyApp() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [studentData, setStudentData] = useState(null);

  const handleStudentLogin = (student) => {
    setStudentData(student);
    setShowWelcome(false);
  };

  const handleBack = () => {
    setShowWelcome(true);
    setStudentData(null);
  };

  // Only show welcome and login - no dashboard access
  if (showWelcome) {
    return <StudentWelcome onEnter={() => setShowWelcome(false)} onBack={handleBack} />;
  }

  if (!studentData) {
    return <StudentLogin onLogin={handleStudentLogin} onBack={handleBack} />;
  }

  // Instead of showing dashboard, redirect to main app with student data
  // This prevents direct access to student data from this URL
  const redirectUrl = `/?student=${studentData.id}&secure=true`;
  window.location.href = redirectUrl;
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Secure Access</h2>
        <p className="text-slate-400">Redirecting to your grade portal...</p>
        <p className="text-xs text-slate-500 mt-4">URL: {redirectUrl}</p>
      </div>
    </div>
  );
}

export default StudentOnlyApp;