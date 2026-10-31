import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Database,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/inquiries',
      label: 'Inquiries',
      icon: Users,
    },
    {
      to: '/admissions',
      label: 'Admissions',
      icon: GraduationCap,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-none">
            Internship Portal
          </h1>
          <p className="text-[11px] text-slate-400 mt-1">Admission & Inquiry</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* System info / Footer */}
      <div className="p-4 border-t border-slate-800 m-3 rounded-2xl bg-slate-800/40 text-xs text-slate-400">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
          <Database className="w-4 h-4" />
          <span>MongoDB Atlas</span>
        </div>
        <p className="text-[11px] text-slate-400 truncate" title="Internship_jd">
          DB: <span className="text-slate-300 font-mono">Internship_jd</span>
        </p>
        <div className="mt-2.5 flex items-center text-[11px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span>Admin Authenticated</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
