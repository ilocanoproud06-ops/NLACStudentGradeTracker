// StudentApp - Standalone Student Portal Application
// Handles student login, authentication, and dashboard viewing

import React, { useState, useEffect } from 'react';
import StudentLogin from './StudentLogin';
import StudentDashboard from './StudentDashboard';
import StudentWelcome from './StudentWelcome';

// Sample students data - centralized to avoid duplication
const SAMPLE_STUDENTS = [
  { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
  { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
  { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
];

// Generate sample students if none exist
const initializeStudentData = () => {
  try {
    const stored = localStorage.getItem('nlac_students');
    let students = [];

    if (stored) {
      students = JSON.parse(stored);
    }

    if (!students || students.length === 0) {
      localStorage.setItem('nlac_students', JSON.stringify(SAMPLE_STUDENTS));
      console.log('Initialized localStorage with sample student data');
      return SAMPLE_STUDENTS;
    }

    return students;
  } catch (err) {
    console.error('Error initializing student data:', err);
    // Fallback to sample data
    localStorage.setItem('nlac_students', JSON.stringify(SAMPLE_STUDENTS));
    return SAMPLE_STUDENTS;
  }
};

export default function StudentApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    // Use setTimeout to ensure DOM is ready and avoid initialization conflicts
    const timer = setTimeout(() => {
      try {
        // Initialize local student data first (synchronous, no dependencies)
        initializeStudentData();
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(String(err));
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleStudentLogin = (student) => {
    setStudentData(student);
    setIsAuthenticated(true);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    // Clear student session
    sessionStorage.removeItem('studentSession');
    setStudentData(null);
    setIsAuthenticated(false);
    setShowWelcome(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <div className="text-white font-bold text-xl">Loading...</div>
          <div className="text-slate-400 text-sm mt-2">Initializing Student Portal</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-white font-black text-xl mb-2">Error Loading Portal</h2>
          <p className="text-red-400 mb-4">Please refresh the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show welcome screen first
  if (showWelcome && !isAuthenticated) {
    return (
      <StudentWelcome 
        onEnter={() => setShowWelcome(false)} 
        onBack={() => window.location.href = './index.html'} 
      />
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <StudentLogin 
        onLogin={handleStudentLogin} 
        onBack={() => setShowWelcome(true)} 
      />
    );
  }

  // Show dashboard if authenticated
  return (
    <StudentDashboard 
      student={studentData} 
      onLogout={handleLogout} 
    />
  );
}

