import React from 'react';
import { GraduationCap, ArrowRight, Award, BookOpen, ClipboardList, Percent, ChevronLeft } from 'lucide-react';

export default function StudentWelcome({ onEnter, onBack }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-green-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-2xl z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 ml-2"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-bold">Back to Portal Selection</span>
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[40px] shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-lg shadow-emerald-500/40 mb-6">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Student<span className="text-emerald-400">Portal</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-3 text-center">
              Access your grades, track your academic performance, and manage your profile
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
              <div className="bg-emerald-600/20 p-2 rounded-xl w-fit mb-3">
                <ClipboardList className="text-emerald-400 w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm uppercase mb-1">View Grades</h3>
              <p className="text-slate-400 text-xs">Access your grades by assessment</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
              <div className="bg-emerald-600/20 p-2 rounded-xl w-fit mb-3">
                <Percent className="text-emerald-400 w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm uppercase mb-1">Track Performance</h3>
              <p className="text-slate-400 text-xs">Monitor your overall average and progress</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
              <div className="bg-emerald-600/20 p-2 rounded-xl w-fit mb-3">
                <BookOpen className="text-emerald-400 w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm uppercase mb-1">Enrolled Courses</h3>
              <p className="text-slate-400 text-xs">View your course enrollments</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
              <div className="bg-emerald-600/20 p-2 rounded-xl w-fit mb-3">
                <Award className="text-emerald-400 w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm uppercase mb-1">Profile Management</h3>
              <p className="text-slate-400 text-xs">Update your profile and PIN</p>
            </div>
          </div>

          {/* Credentials Info */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-8">
            <p className="text-slate-400 text-xs text-center">
              <span className="text-emerald-400 font-bold">Login Credentials:</span> Get your ID Number and PIN from your administrator
            </p>
          </div>

          {/* Action Button */}
          <button 
            onClick={onEnter}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            Proceed to Login
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-xs font-medium">
          © 2026 AcademicPro Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
}

