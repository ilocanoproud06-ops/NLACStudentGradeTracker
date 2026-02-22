import React from 'react';
import { GraduationCap, ArrowRight, Lock, IdCard, Sparkles } from 'lucide-react';

export default function StudentAuth({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-emerald-600 p-4 rounded-3xl shadow-xl shadow-emerald-200 mb-4">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Student<span className="text-emerald-600">Hub</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Academic Access Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-400 font-medium">Please enter your student credentials</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin('student'); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID Number</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="2024-XXXX"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret PIN / Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/10 group mt-4">
              Sign In to Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
          <Sparkles size={12} /> Student Privacy Protected
        </div>
      </div>
    </div>
  );
}