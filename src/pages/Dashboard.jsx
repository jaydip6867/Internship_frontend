import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Clock, 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Eye,
  Plus,
  Flame,
  Phone
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ onOpenAddInquiry, onOpenInquiryDetails, onOpenFollowup, onOpenConvert }) => {
  const [stats, setStats] = useState(null);
  const [todayDueList, setTodayDueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, todayDueRes] = await Promise.all([
        axiosClient.get('/inquiries/stats'),
        axiosClient.get('/inquiries/today-due'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (todayDueRes.data.success) {
        setTodayDueList(todayDueRes.data.inquiries);
      }
    } catch (err) {
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interested':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Follow-up':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Converted to Admission':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Not Interested':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading portal analytics...</p>
        </div>
      </div>
    );
  }

  const todayCount = stats?.todayDueCount || todayDueList.length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide border border-indigo-500/30">
            Counseling & Admissions Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-white">
            Internship Inquiry Portal
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Manage student counseling, monitor pending call schedules, and convert prospects into registered admissions.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenAddInquiry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Inquiry</span>
            </button>
            <Link
              to="/today-followups"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>Today's Due Follow-ups ({todayCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Due Follow-up (Clickable Highlight Card) */}
        <Link 
          to="/today-followups"
          className="bg-gradient-to-br from-amber-50 via-white to-amber-100/40 p-5 rounded-2xl border-2 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-ping"></span>
                Today Due Follow-ups
              </p>
              <h3 className="text-3xl font-black text-amber-600 mt-1 group-hover:scale-105 transition-transform">
                {todayCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:rotate-6 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-800 pt-2 border-t border-amber-200/80">
            <span>Click to View All List</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Total Inquiries */}
        <Link 
          to="/inquiries"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Inquiries</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalInquiries || 0}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-semibold text-blue-600 mr-1.5">+{stats?.todayInquiries || 0}</span> inquiries today
          </div>
        </Link>

        {/* Card 3: Admissions */}
        <Link 
          to="/admissions"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Admissions</p>
              <h3 className="text-2xl font-bold text-purple-700 mt-1">{stats?.totalAdmissions || 0}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span className="font-semibold text-emerald-600 mr-1">{stats?.conversionRate || 0}%</span> conversion rate
          </div>
        </Link>

        {/* Card 4: Fees Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Fees Collected</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">
                ₹{(stats?.financial?.totalCollected || 0).toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Pending Due: <span className="font-bold text-amber-600 ml-1">₹{(stats?.financial?.totalPending || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Section: Today's Due Follow-up Action Center (Replaced generic recent activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Due Follow-up Box (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base">Today's Due Follow-ups (આજના ફોલો-અપ)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-extrabold">
                      {todayCount}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    Students scheduled for counseling callback or visit confirmation today
                  </p>
                </div>
              </div>

              {/* Action Link to Full Page */}
              <Link
                to="/today-followups"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
              >
                <span>Open Full List ({todayCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Content Preview */}
            {todayDueList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">No Pending Calls Due Today</h4>
                <p className="text-xs text-slate-400 mt-1">All scheduled follow-up calls are completed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-50/50 text-slate-600 border-b border-amber-100 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Student & Contact</th>
                      <th className="px-5 py-3">Domain</th>
                      <th className="px-5 py-3">Last Remarks / Log</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayDueList.slice(0, 5).map((inq) => {
                      const latestFp = inq.followups?.[0];
                      return (
                        <tr key={inq._id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-slate-900 text-sm">{inq.studentName}</div>
                            <div className="flex items-center text-slate-600 text-[11px] font-semibold mt-0.5 space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{inq.contactNo}</span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                              {inq.interestedDomain}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">{inq.collegeName || inq.degree}</div>
                          </td>

                          <td className="px-5 py-3.5">
                            {latestFp ? (
                              <div>
                                <p className="text-xs font-semibold text-slate-800 leading-snug">
                                  {latestFp.remarks}
                                </p>
                                <span className="text-[10px] text-teal-800 font-medium bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 mt-1 inline-block">
                                  By: {latestFp.recordedBy || inq.takenBy || 'Haresh Sir'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No notes</span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => onOpenFollowup(inq)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Log Call</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Call-To-Action */}
          <div className="p-3.5 bg-amber-50/70 border-t border-amber-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900">
              Showing top {Math.min(5, todayDueList.length)} of {todayCount} today's follow-ups
            </span>
            <Link
              to="/today-followups"
              className="font-bold text-amber-800 hover:text-amber-950 flex items-center space-x-1 hover:underline"
            >
              <span>Click to Open Full List & Calling Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Domain Stats / Top Technology Interests (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Popular Internship Domains</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top technologies requested by students</p>

            <div className="mt-4 space-y-3">
              {stats?.domainStats && stats.domainStats.length > 0 ? (
                stats.domainStats.map((item, idx) => {
                  const percentage = stats.totalInquiries > 0 ? Math.round((item.count / stats.totalInquiries) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700 truncate max-w-[180px]">{item._id}</span>
                        <span className="font-semibold text-slate-900">{item.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No domain breakdown available yet
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-indigo-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="flex items-center space-x-2 text-xs text-indigo-900 font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Conversion Summary</span>
            </div>
            <p className="text-[11px] text-indigo-700 mt-1">
              {stats?.totalAdmissions || 0} out of {stats?.totalInquiries || 0} leads successfully converted to admission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
