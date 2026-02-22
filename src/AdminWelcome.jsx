import React from 'react';
import { GraduationCap, ArrowRight, Shield, Users, BookOpen, ClipboardList, ChevronLeft } from 'lucide-react';

export default function AdminWelcome({ onEnter, onBack }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 ml-2"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-bold">Back to Portal Selection</span>
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[40px] shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/40 mb-6">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Academic<span className="text-blue-400">Pro</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[3px] mt-2">Admin Portal</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600/20 p-2 rounded-xl w-fit">
                  <Users className="text-blue-400 w-4 h-4" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase">Student Management</h3>
              </div>
              <p className="text-slate-400 text-xs">Register, edit, and manage student records</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600/20 p-2 rounded-xl w-fit">
                  <BookOpen className="text-blue-400 w-4 h-4" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase">Course Management</h3>
              </div>
              <p className="text-slate-400 text-xs">Create and manage courses, schedules, and rooms</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600/20 p-2 rounded-xl w-fit">
                  <ClipboardList className="text-blue-400 w-4 h-4" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase">Enrollment</h3>
              </div>
              <p className="text-slate-400 text-xs">Enroll students in courses and track progress</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600/20 p-2 rounded-xl w-fit">
                  <GraduationCap className="text-blue-400 w-4 h-4" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase">Grade Entry</h3>
              </div>
              <p className="text-slate-400 text-xs">Input and manage student grades</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="text-blue-400 w-4 h-4" />
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Secure Access Required</span>
            </div>
            <p className="text-slate-400 text-xs text-center">
              Administrator credentials are required for access. Contact system administrator for login details.
            </p>
          </div>

          {/* Action Button */}
          <button 
            onClick={onEnter}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            Proceed to Login
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Security Notice</p>
            <p className="text-slate-400 text-xs">Unauthorized access is prohibited. All activities are monitored and logged.</p>
          </div>
          <p className="text-slate-600 text-xs font-medium">
            © 2026 AcademicPro Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

