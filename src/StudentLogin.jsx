import React, { useState, useEffect } from 'react';
import { Key, GraduationCap, ArrowRight, User, AlertCircle, ChevronLeft, Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import studentSession from './sessionManager';
import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS, isCloudSyncEnabled, setCloudSyncEnabled } from './cloudDataService';
import { initializeGitHubStorage, syncToGitHub, syncFromGitHub, getGitHubStatus, isGitHubStorageAvailable } from './githubCloudService';

export default function StudentLogin({ onLogin, onBack }) {
  const [studentIdNum, setStudentIdNum] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('initializing'); // 'firebase', 'github', 'local', 'initializing'
  const [isSyncing, setIsSyncing] = useState(false);
  const [students, setStudents] = useState([]);

  // Check online status and sync settings
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initialize student data and cloud services
    const initialize = async () => {
      try {
        // Auto-enable cloud sync by default
        setCloudSyncEnabled(true);
        setSyncEnabled(true);
        
        // Initialize cloud storage (Firebase first, then GitHub fallback)
        setCloudStatus('initializing');
        
        // Initialize GitHub storage as fallback
        await initializeGitHubStorage();
        
        // Try to sync from cloud
        const loadedStudents = await syncStudentDataFromCloud();
        setStudents(loadedStudents);
        
        setCloudStatus('ready');
      } catch (error) {
        console.error('Cloud initialization error:', error);
        // Fall back to local data
        const localStudents = initializeStudentData();
        setStudents(localStudents);
        setCloudStatus('local');
      }
      
      setIsLoading(false);
    };
    
    initialize();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync student data from cloud (Firebase -> GitHub -> localStorage)
  const syncStudentDataFromCloud = async () => {
    let studentData = null;
    
    // Try Firebase first
    try {
      const { downloadAllFromCloud } = await import('./cloudDataService');
      const result = await downloadAllFromCloud();
      if (result.success && result.data && result.data.students.length > 0) {
        setCloudStatus('firebase');
        return result.data.students;
      }
    } catch (error) {
      console.log('Firebase not available, trying GitHub...');
    }
    
    // Try GitHub storage as fallback
    try {
      const githubData = await syncFromGitHub();
      if (githubData && githubData.students && githubData.students.length > 0) {
        setCloudStatus('github');
        // Save to localStorage
        saveToLocalStorage(STORAGE_KEYS.STUDENTS, githubData.students);
        return githubData.students;
      }
    } catch (error) {
      console.log('GitHub storage not available, using local data');
    }
    
    // Fall back to localStorage
    const localStudents = initializeStudentData();
    setCloudStatus('local');
    return localStudents;
  };

  // Initialize student data if not present
  const initializeStudentData = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    let data = stored ? JSON.parse(stored) : [];

    // If no students exist, initialize with sample data
    if (data.length === 0) {
      const sampleStudents = [
        { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
        { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
        { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
      ];
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sampleStudents));
      localStorage.setItem('nlac_students', JSON.stringify(sampleStudents)); // Also set legacy key
      data = sampleStudents;
      console.log('Initialized localStorage with sample student data');
      console.log('Sample students:', data);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure we have student data
    let studentData = students;
    if (!studentData || studentData.length === 0) {
      studentData = initializeStudentData();
      setStudents(studentData);
    }
    
    // Also check legacy key
    if (!studentData || studentData.length === 0) {
      const legacyStored = localStorage.getItem('nlac_students');
      if (legacyStored) {
        studentData = JSON.parse(legacyStored);
        setStudents(studentData);
      }
    }

    // Debug information
    console.log('Login attempt:', { studentIdNum, pinCode });
    console.log('Available students:', studentData);

    // Normalize input - trim whitespace
    const normalizedIdNum = studentIdNum.trim();
    const normalizedPin = pinCode.trim();

    // Find matching student
    const student = studentData.find(
      s => s.studentIdNum === normalizedIdNum && s.pinCode === normalizedPin
    );

    // More detailed error messaging
    if (student) {
      console.log('Login successful for:', student);
      // Start student session
      studentSession.startSession(student.id);
      
      // Sync data to cloud in background
      try {
        await syncStudentDataToCloud(student);
      } catch (err) {
        console.log('Background sync failed:', err);
      }
      
      onLogin(student);
    } else {
      // Check what specifically is wrong
      const idMatch = studentData.find(s => s.studentIdNum === normalizedIdNum);
      if (!idMatch) {
        setError('ID Number not found. Please check your ID Number.');
      } else if (idMatch.pinCode !== normalizedPin) {
        setError('Incorrect PIN Code. Please try again.');
      } else {
        setError('Invalid ID Number or PIN. Please try again.');
      }
    }
  };

  // Sync student data to cloud (Firebase + GitHub)
  const syncStudentDataToCloud = async (student) => {
    const allData = {
      students: students,
      lastUpdated: new Date().toISOString()
    };
    
    // Upload to Firebase
    try {
      const { uploadAllToCloud } = await import('./cloudDataService');
      await uploadAllToCloud();
    } catch (err) {
      console.log('Firebase upload failed:', err);
    }
    
    // Upload to GitHub as backup
    try {
      await syncToGitHub(allData);
    } catch (err) {
      console.log('GitHub upload failed:', err);
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={studentIdNum}
                  onChange={(e) => setStudentIdNum(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="2024-0001"
                  required
                  autoComplete="username"
                  inputMode="text"
                  autoCapitalize="characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PIN Code</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="••••"
                  maxLength={4}
                  required
                  autoComplete="current-password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
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

