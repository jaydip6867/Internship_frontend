import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react';
import GoogleFormView from '../components/GoogleFormView';

const PublicLeadForm = () => {
  return (
    <div className="min-h-screen bg-[#f0ebf8]/60 py-8 px-4 sm:px-6 flex flex-col justify-between font-sans antialiased text-slate-800">
      {/* Top Brand Bar */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base block leading-tight">
              Internship Portal
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider block">
              Live Project & Training
            </span>
          </div>
        </div>

        <Link
          to="/login"
          className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          Staff / Admin Login →
        </Link>
      </div>

      {/* Main Google Form Component */}
      <main className="flex-1 flex items-center justify-center">
        <GoogleFormView />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto text-center pt-6 pb-2 text-xs text-slate-400 flex items-center justify-center space-x-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Official Student Registration Form • Powered by Internship Management Portal</span>
      </footer>
    </div>
  );
};

export default PublicLeadForm;
