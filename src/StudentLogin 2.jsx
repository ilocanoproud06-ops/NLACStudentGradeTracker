import React, { useState } from 'react';
import { Key, GraduationCap, ArrowRight, User, AlertCircle, ChevronLeft } from 'lucide-react';

export default function StudentLogin({ onLogin, onBack }) {
  const [studentIdNum, setStudentIdNum] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Initialize sample data if localStorage is empty
    const storedStudents = localStorage.getItem('nlac_students');
    let students = storedStudents ? JSON.parse(storedStudents) : [];

    // If no students exist, initialize with sample data
    if (students.length === 0) {
      const sampleStudents = [
        { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
        { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
        { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
      ];
      localStorage.setItem('nlac_students', JSON.stringify(sampleStudents));
      students = sampleStudents;
      console.log('Initialized localStorage with sample student data');
    }

    // Debug information
    console.log('Login attempt:', { studentIdNum, pinCode });
    console.log('Stored students:', students);

    // Find matching student
    const student = students.find(
      s => s.studentIdNum === studentIdNum && s.pinCode === pinCode
    );

    // More detailed error messaging
    if (student) {
      console.log('Login successful for:', student);
      onLogin(student);
    } else {
      // Check what specifically is wrong
      const idMatch = students.find(s => s.studentIdNum === studentIdNum);
      if (!idMatch) {
        setError('ID Number not found. Please check your ID Number.');
      } else if (idMatch.pinCode !== pinCode) {
        setError('Incorrect PIN Code. Please try again.');
      } else {
        setError('Invalid ID Number or PIN. Please try again.');
      }
    }
  };

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

