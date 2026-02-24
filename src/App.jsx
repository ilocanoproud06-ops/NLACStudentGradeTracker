import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminWelcome from './AdminWelcome';
import StudentLogin from './StudentLogin';
import StudentDashboard from './StudentDashboard';
import StudentWelcome from './StudentWelcome';
import DataStorageViewer from './DataStorageViewer';
import CloudStorageDemo from './CloudStorageDemo';

function App() {
  const [userType, setUserType] = useState(null); // 'admin' | 'student' | null
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false); // Show welcome page
  const [studentData, setStudentData] = useState(null);
  const [isStudentOnlyMode, setIsStudentOnlyMode] = useState(false);
  const [isSecureStudentAccess, setIsSecureStudentAccess] = useState(false);
  const [showDataViewer, setShowDataViewer] = useState(false);
  const [showCloudDemo, setShowCloudDemo] = useState(false);

  // Check if we're in student-only mode (accessed via student URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const hash = window.location.hash;
    const studentId = urlParams.get('student');
    
    // Handle hash routing for data viewer and cloud demo
    if (hash === '#data-viewer') {
      setShowDataViewer(true);
      return;
    }
    
    if (hash === '#cloud-demo') {
      setShowCloudDemo(true);
      return;
    }

    // Handle redirect from secure student portal
    if (studentId) {
      const students = JSON.parse(localStorage.getItem('nlac_students') || '[]');
      const student = students.find(s => s.id.toString() === studentId);
      if (student) {
        setUserType('student');
        setStudentData(student);
        setIsAuthenticated(true);
        setShowWelcome(false);
        setIsSecureStudentAccess(urlParams.get('secure') === 'true');
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }

    const isStudentMode = urlParams.get('mode') === 'student' ||
                         currentPath.includes('/student') ||
                         currentPath.includes('student.html') ||
                         window.location.hostname.includes('student');

    if (isStudentMode) {
      setIsStudentOnlyMode(true);
      setUserType('student');
      setShowWelcome(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setUserType('admin');
    setIsAuthenticated(true);
    setShowWelcome(false);
  };
  
  const handleBackToAdmin = () => {
    setShowDataViewer(false);
    setShowCloudDemo(false);
    setUserType('admin');
    setIsAuthenticated(true);
  };
  

  const handleStudentLogin = (student) => {
    setUserType('student');
    setStudentData(student);
    setIsAuthenticated(true);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    // Clear student session if it exists
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('studentSession');
    }
    
    if (isSecureStudentAccess) {
      // For secure student access, redirect back to the secure portal
      window.location.href = './student.html';
      return;
    }
    setUserType(null);
    setIsAuthenticated(false);
    setStudentData(null);
    setShowWelcome(false);
    setIsSecureStudentAccess(false);
  };

  // Portal Selection Screen (only show if not in student-only mode and not secure student access)
  if (!isAuthenticated && userType === null && !isStudentOnlyMode && !isSecureStudentAccess) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]" />

        <div className="w-full max-w-4xl z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">
              Academic<span className="text-blue-400">Pro</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">NLAC Student Grade Tracker</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Admin Portal */}
            <button 
              onClick={() => { setUserType('admin'); setShowWelcome(true); }}
              className="group bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 hover:border-blue-500 p-8 rounded-[40px] transition-all hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-500/40 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase">Admin Dashoard</h2>
                <p className="text-slate-400 text-sm text-center">Manage student records, courses, enrollments, and enter grades</p>
                <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Enter Admin <span className="text-xl">→</span>
                </div>
              </div>
            </button>

            {/* Student Portal */}
            <button 
              onClick={() => { setUserType('student'); setShowWelcome(true); }}
              className="group bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 hover:border-emerald-500 p-8 rounded-[40px] transition-all hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="flex flex-col items-center">
                <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-500/40 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase">Student Portal</h2>
                <p className="text-slate-400 text-sm text-center">View your grades, track your performance, and manage your profile</p>
                <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Enter Student <span className="text-xl">→</span>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center mt-12 text-slate-600 text-xs font-medium">
            © 2026 AcademicPro Systems. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Show welcome pages
  if (showWelcome && userType === 'admin') {
    return <AdminWelcome onEnter={() => setShowWelcome(false)} onBack={() => {setUserType(null); setShowWelcome(false)}} />;
  }

  if (showWelcome && userType === 'student') {
    return <StudentWelcome onEnter={() => setShowWelcome(false)} onBack={() => {setUserType(null); setShowWelcome(false)}} />;
  }

  // Render based on user type
  return (
    <>
      {userType === 'admin' && !isAuthenticated && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowWelcome(true)} />
      )}
      {userType === 'admin' && isAuthenticated && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {userType === 'student' && !isAuthenticated && (
        <StudentLogin onLogin={handleStudentLogin} onBack={() => setShowWelcome(true)} />
      )}
      {userType === 'student' && isAuthenticated && studentData && (
        <StudentDashboard student={studentData} onLogout={handleLogout} />
      )}
      
      {/* Data Viewer and Cloud Demo */}
      {showDataViewer && <DataStorageViewer />}
      {showCloudDemo && <CloudStorageDemo />}
    </>
  );
}

export default App;

