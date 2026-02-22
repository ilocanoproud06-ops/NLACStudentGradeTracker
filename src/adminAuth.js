import React from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail, HardDrive } from 'lucide-react';

export default function AdminAuth({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      {/* Decorative Grid Background for Admin Only */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1e293b 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-500/40 mb-4">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Admin<span className="text-indigo-400">Panel</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Restricted Faculty Access</p>
        </div>

        <div className="bg-[#1e293b] rounded-[40px] shadow-2xl border border-slate-800 p-10">
          <div className="mb-8">
            <h2 className="text-xl font-black text-white">Authorized Entry</h2>
            <p className="text-xs text-slate-500 font-medium">Session will be logged for security purposes.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin('admin'); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@institution.edu"
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-800 focus:border-indigo-500 text-white rounded-2xl outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-800 focus:border-indigo-500 text-white rounded-2xl outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group mt-4">
              Secure Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-4 text-slate-600">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <HardDrive size={12} /> Server: Secure_01
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
          <div className="text-[10px] font-black uppercase tracking-widest">v3.2.0-PRO</div>
        </div>
      </div>
    </div>
  );
}