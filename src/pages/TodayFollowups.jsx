import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PhoneCall, 
  Eye, 
  Edit, 
  CheckCircle2, 
  GraduationCap, 
  Phone, 
  Calendar, 
  Clock, 
  AlertCircle, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Filter,
  CheckCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const COUNSELORS = ['All', 'Haresh Sir', 'Mishal Sir', 'Jaydip Sir', 'Sanjana'];

const TodayFollowups = ({ 
  onOpenFollowup, 
  onOpenConvert, 
  onOpenDetails, 
  onOpenEditInquiry 
}) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchTodayDue = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/inquiries/today-due');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error('Fetch today-due error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayDue();
  }, []);

  // Filter inquiries by search & counselor
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      !search || 
      inq.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inq.contactNo.includes(search) ||
      (inq.collegeName && inq.collegeName.toLowerCase().includes(search.toLowerCase())) ||
      inq.interestedDomain.toLowerCase().includes(search.toLowerCase());

    const latestFp = inq.followups?.[0];
    const counselor = latestFp?.recordedBy || inq.takenBy || '';
    const matchesCounselor = 
      selectedCounselor === 'All' || 
      counselor.toLowerCase().includes(selectedCounselor.toLowerCase());

    return matchesSearch && matchesCounselor;
  });

  // Pagination calculations
  const totalRecords = filteredInquiries.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const getFollowupBadge = (status) => {
    switch (status) {
      case 'Ready for Admission':
      case 'Interested':
      case 'Visited Campus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Callback Requested':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cold/No Response':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Not Interested':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
                <Flame className="w-3.5 h-3.5 mr-1 text-amber-400 animate-pulse" />
                Action Required Today
              </span>
              <span className="text-xs text-slate-400 font-medium">{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Today's Due Follow-ups (આજના ફોલો-અપ)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              List of student inquiries scheduled for a call or office visit today. Call them, record notes, and convert interested candidates into admissions.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
            <div className="text-center">
              <span className="text-xs text-amber-300 font-semibold block uppercase tracking-wider">Due Today</span>
              <span className="text-3xl font-black text-white">{inquiries.length}</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-xs text-slate-300 space-y-0.5">
              <p>• Call Students</p>
              <p>• Log Responses</p>
              <p>• Convert Admissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, phone, college or domain..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Counselor:</span>
          <select
            value={selectedCounselor}
            onChange={(e) => {
              setSelectedCounselor(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {COUNSELORS.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Counselors' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs">Loading today's due follow-ups...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">All Caught Up!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No follow-ups currently due today{selectedCounselor !== 'All' ? ` for ${selectedCounselor}` : ''}. All scheduled follow-ups are either completed or scheduled for upcoming dates.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-3.5 text-center w-10 text-slate-400">#</th>
                  <th className="px-4 py-3.5">Student & Contact</th>
                  <th className="px-4 py-3.5">Academic & Domain</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Due Status</th>
                  <th className="px-5 py-3.5 min-w-[260px]">Last Remarks & Call Log</th>
                  <th className="px-2 py-3.5 text-center w-14">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentInquiries.map((inq, index) => {
                  const latestFp = inq.followups?.[0];
                  return (
                    <tr key={inq._id} className="hover:bg-amber-50/30 transition-colors">
                      {/* 1. # */}
                      <td className="px-3 py-3.5 text-center font-bold text-slate-400 text-xs">
                        {startIndex + index + 1}
                      </td>

                      {/* 2. Student & Contact */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                          <span>{inq.studentName}</span>
                        </div>
                        <div className="flex items-center text-slate-700 font-semibold mt-1 space-x-2">
                          <a 
                            href={`tel:${inq.contactNo}`} 
                            title="Click to Call"
                            className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{inq.contactNo}</span>
                          </a>
                        </div>
                        {inq.email && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{inq.email}</div>
                        )}
                      </td>

                      {/* 3. Academic & Domain */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                          {inq.interestedDomain}
                        </span>
                        <div className="text-[11px] text-slate-700 font-medium mt-1">
                          {inq.collegeName || inq.degree}
                        </div>
                        <div className="text-[10px] text-indigo-800 font-semibold bg-indigo-50/80 border border-indigo-200/80 rounded px-1.5 py-0.5 w-max mt-1">
                          Taken By: {inq.takenBy || 'Haresh Sir'}
                        </div>
                      </td>

                      {/* 4. Due Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap inline-flex items-center bg-amber-50 text-amber-800 border-amber-300">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            Due Today
                          </span>
                          {latestFp?.status && (
                            <div>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap inline-block ${getFollowupBadge(latestFp.status)}`}>
                                {latestFp.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Last Remarks & Call Log */}
                      <td className="px-5 py-3.5">
                        {latestFp ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {latestFp.recordedBy && (
                                <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                  Followup By: {latestFp.recordedBy}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                Date: {new Date(latestFp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>

                            <p className="text-xs text-slate-800 font-semibold leading-relaxed whitespace-normal break-words">
                              {latestFp.remarks}
                            </p>

                            <div className="text-[10px] text-indigo-700 font-medium">
                              Scheduled For: {new Date(latestFp.nextFollowupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No notes</span>
                        )}
                      </td>

                      {/* 6. Actions (Up-Down Compact) */}
                      <td className="px-2 py-2 text-center w-14 align-middle">
                        <div className="flex flex-col gap-1 items-center justify-center mx-auto w-max">
                          {/* Row 1: Add Follow-up & View Details */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenFollowup(inq)}
                              title="Add Follow-up (Log Call/Visit)"
                              className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-xs transition-colors"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenDetails(inq)}
                              title="Show Full Inquiry Details"
                              className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-slate-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Row 2: Convert to Admission & Edit */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenConvert(inq)}
                              title="Convert to Admission"
                              className="p-1 text-purple-700 hover:bg-purple-50 rounded-md transition-colors border border-purple-200"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenEditInquiry(inq)}
                              title="Edit Inquiry Details"
                              className="p-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors border border-slate-200"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalRecords > 0 && (
          <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            {/* Left */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <span className="font-medium text-slate-500">Show</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="font-medium text-slate-500">records</span>
              </div>

              <span className="text-slate-300 hidden sm:inline">|</span>

              <span className="font-medium">
                Showing <strong className="text-slate-800">{totalRecords === 0 ? 0 : startIndex + 1}</strong> to{' '}
                <strong className="text-slate-800">{endIndex}</strong> of{' '}
                <strong className="text-amber-700 font-bold">{totalRecords}</strong> due follow-ups
              </span>
            </div>

            {/* Right: Page Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === p
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayFollowups;
