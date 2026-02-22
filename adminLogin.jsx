import React, { useState } from 'react';
import { Key, Mail, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add auth logic here
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[40px] shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/40 mb-6">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Academic<span className="text-blue-400">Pro</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[3px] mt-2">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="admin@academicpro.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In to Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Secure Enterprise Access</span>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-xs font-medium">
          © 2026 AcademicPro Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
}