// StudentLogin - Standalone Login Component
// Simplified to avoid circular dependency issues
import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, AlertCircle, ChevronLeft, Wifi, WifiOff, Cloud, CloudOff, RefreshCw, Search } from 'lucide-react';

// Session management - inline to avoid import issues
const studentSession = {
  startSession: (studentId) => {
    sessionStorage.setItem('studentSession', JSON.stringify({
      studentId: studentId,
      lastActivity: Date.now()
    }));
  },
  validateSession: () => {
    const sessionData = sessionStorage.getItem('studentSession');
    if (!sessionData) return false;
    try {
      const parsed = JSON.parse(sessionData);
      return !!parsed.studentId;
    } catch (e) {
      return false;
    }
  }
};

// Sample students data
const SAMPLE_STUDENTS = [
  { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
  { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
  { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
];

export default function StudentLogin({ onLogin, onBack }) {
  // Single input for ID or PIN
  const [loginInput, setLoginInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cloudStatus, setCloudStatus] = useState('ready');
  const [students, setStudents] = useState([]);

  // Initialize student data on mount
  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load students from localStorage or use sample data
    const stored = localStorage.getItem('nlac_students');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.length > 0) {
          setStudents(data);
          console.log('Loaded students from localStorage:', data.length);
        } else {
          // Use sample data
          localStorage.setItem('nlac_students', JSON.stringify(SAMPLE_STUDENTS));
          setStudents(SAMPLE_STUDENTS);
        }
      } catch (err) {
        console.error('Error parsing students:', err);
        localStorage.setItem('nlac_students', JSON.stringify(SAMPLE_STUDENTS));
        setStudents(SAMPLE_STUDENTS);
      }
    } else {
      // Initialize with sample data
      localStorage.setItem('nlac_students', JSON.stringify(SAMPLE_STUDENTS));
      setStudents(SAMPLE_STUDENTS);
      console.log('Initialized sample students');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle login with single input field (ID or PIN)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const input = loginInput.trim();
    if (!input) {
      setError('Please enter your Student ID or PIN');
      return;
    }

    // Ensure we have student data
    let studentData = students;
    if (studentData.length === 0) {
      // Fallback to sample data
      studentData = SAMPLE_STUDENTS;
    }
    
    console.log('Looking for student with input:', input);
    console.log('Available students:', studentData.map(s => ({id: s.studentIdNum, pin: s.pinCode})));

    // Try to find student by ID or PIN
    const student = studentData.find(
      s => String(s.studentIdNum) === input || String(s.pinCode) === input
    );

    if (student) {
      console.log('Login successful for:', student);
      studentSession.startSession(student.id);
      onLogin(student);
    } else {
      console.log('Student not found. Input:', input);
      setError('Student ID or PIN not found. Try: 2024-0001 or 4521');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <div className="text-white font-bold text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 ml-2"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-bold">Back to Welcome</span>
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[40px] shadow-2xl">
          {/* Connection Status - Enhanced with Cloud Status */}
          <div className="space-y-2 mb-4">
            {/* Online/Offline Status */}
            <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl ${isOnline ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isOnline ? 'Online' : 'Offline - Using Local Data'}</span>
            </div>
            {/* Cloud Sync Status */}
            <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl ${
              cloudStatus === 'firebase' ? 'bg-orange-500/10 text-orange-400' :
              cloudStatus === 'github' ? 'bg-purple-500/10 text-purple-400' :
              cloudStatus === 'local' ? 'bg-slate-500/10 text-slate-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              {cloudStatus === 'initializing' ? <RefreshCw size={14} className="animate-spin" /> :
               cloudStatus === 'firebase' ? <Cloud size={14} /> :
               cloudStatus === 'github' ? <Cloud size={14} /> :
               cloudStatus === 'local' ? <CloudOff size={14} /> :
               <Cloud size={14} />}
              <span>
                {cloudStatus === 'initializing' ? 'Initializing Cloud Storage...' :
                 cloudStatus === 'firebase' ? 'Firebase Cloud Active' :
                 cloudStatus === 'github' ? 'GitHub Cloud Active' :
                 cloudStatus === 'local' ? 'Local Storage Mode' :
                 'Cloud Ready'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center mb-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/40 mb-6">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Academic<span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[3px] mt-2">Student Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-400 text-xs font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID or PIN Code</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter ID (2025-0001) or PIN (9815)"
                  required
                  autoComplete="off"
                  inputMode="text"
                />
              </div>
              <p className="text-[10px] text-slate-500 ml-1">Enter your Student ID Number or PIN Code</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              View My Grades
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-center gap-2">
            <GraduationCap size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Track Your Academic Performance</span>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-xs font-medium">
          © 2026 Student Grade Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}

