import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Plus, 
  Menu, 
  X,
  Database,
  PhoneCall,
  Sparkles
} from 'lucide-react';

const Navbar = ({ onOpenAddInquiry }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/new-leads', label: 'New Leads', icon: Sparkles, highlight: true },
    { to: '/today-followups', label: "Today's Follow-ups", icon: PhoneCall },
    { to: '/inquiries', label: 'Inquiries', icon: Users },
    { to: '/admissions', label: 'Admissions', icon: GraduationCap },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="w-full px-4 sm:px-8 xl:px-[80px]">
        <div className="h-16 flex items-center justify-between">
          
          {/* Left: Brand + Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand Logo & Name */}
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-white text-lg tracking-tight block leading-tight">
                  Internship Portal
                </span>
                <span className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase block">
                  Admission & Inquiry Management
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: Quick Action & User Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* DB status pill */}
            <div className="hidden lg:flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              {/* <span>DB: Internship_jd</span> */}
            </div>

            {/* New Inquiry Action */}
            <button
              onClick={onOpenAddInquiry}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Inquiry</span>
            </button>

            <div className="h-6 w-px bg-slate-800"></div>

            {/* Admin Avatar & Info */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold text-sm shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-white leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400">{user?.role || 'Admin'}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              onClick={onOpenAddInquiry}
              className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2 animate-in fade-in duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-xs font-semibold text-slate-300">{user?.name || 'Admin'}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-rose-400 font-semibold hover:underline flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
