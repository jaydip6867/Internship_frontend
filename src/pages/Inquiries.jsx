import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  PhoneCall, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  GraduationCap, 
  Phone, 
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Inquiries = ({ 
  onOpenAddInquiry, 
  onOpenEditInquiry, 
  onOpenFollowup, 
  onOpenConvert, 
  onOpenDetails 
}) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedDomain !== 'All') params.domain = selectedDomain;

      const res = await axiosClient.get('/inquiries', { params });
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchInquiries();
  }, [selectedStatus, selectedDomain]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInquiries();
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/inquiries/${id}`);
      setDeleteConfirmId(null);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry');
    }
  };

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

  // Collect dynamic unique domains from inquiries list
  const availableDomains = Array.from(
    new Set(
      inquiries
        .map((inq) => inq.interestedDomain)
        .filter(Boolean)
    )
  ).sort();

  // Pagination calculation
  const totalRecords = inquiries.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inquiry Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track student inquiries, manage follow-ups, and convert admissions
          </p>
        </div>
        <button
          onClick={onOpenAddInquiry}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-indigo-300 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Inquiry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, phone, email or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2.5 shrink-0 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Converted to Admission">Converted to Admission</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 max-w-[180px] truncate"
          >
            <option value="All">All Domains</option>
            {availableDomains.map((dom) => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiry List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs">Loading inquiries from MongoDB...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 text-sm">No Inquiries Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No student inquiry records match your search or filter. Try clearing filters or create a new inquiry.
            </p>
            <button
              onClick={onOpenAddInquiry}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              + Add Inquiry Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-3.5 text-center w-10 text-slate-400">#</th>
                  <th className="px-4 py-3.5">Student Details</th>
                  <th className="px-4 py-3.5">Academic</th>
                  <th className="px-4 py-3.5">Interested Domain</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3.5 min-w-[260px]">Follow-up Details</th>
                  <th className="px-2 py-3.5 text-center w-14">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentInquiries.map((inq, index) => (
                  <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. Incrementing Serial Number */}
                    <td className="px-3 py-3.5 text-center font-bold text-slate-400 text-xs">
                      {startIndex + index + 1}
                    </td>

                    {/* 2. Student Info */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                        <span>{inq.studentName}</span>
                      </div>
                      <div className="flex items-center text-slate-600 font-medium mt-0.5 space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{inq.contactNo}</span>
                      </div>
                      {inq.email && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{inq.email}</div>
                      )}
                    </td>

                    {/* 3. Academic */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{inq.collegeName || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{inq.degree} {inq.semester ? `(${inq.semester})` : ''}</div>
                    </td>

                    {/* 4. Domain & Date & Taken By */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block" title={inq.interestedDomain}>
                        {inq.interestedDomain}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(inq.inquiryDate || inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-indigo-700 font-semibold bg-indigo-50/80 border border-indigo-200/80 rounded px-1.5 py-0.5 w-max mt-1">
                        Taken By: {inq.takenBy || 'Haresh Sir'}
                      </div>
                    </td>

                    {/* 5. Status (No wrap) */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap inline-block ${getStatusBadge(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>

                    {/* 6. Follow-up Full Details (No truncate) */}
                    <td className="px-5 py-3.5">
                      {inq.followups && inq.followups.length > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${getFollowupBadge(inq.followups[0].status)}`}>
                              {inq.followups[0].status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(inq.followups[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            {inq.followups[0].recordedBy && (
                              <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                Followup By: {inq.followups[0].recordedBy}
                              </span>
                            )}
                          </div>

                          {/* Full Remarks & Call Details */}
                          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-normal break-words">
                            {inq.followups[0].remarks}
                          </p>

                          {/* Next Followup Date if present */}
                          {inq.followups[0].nextFollowupDate && (
                            <div className="flex items-center text-[10px] text-emerald-700 font-medium">
                              <Clock className="w-3 h-3 mr-1 text-emerald-600" />
                              <span>Next: {new Date(inq.followups[0].nextFollowupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          )}

                          {inq.followups.length > 1 && (
                            <button
                              onClick={() => onOpenDetails(inq)}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline block pt-0.5"
                            >
                              +{inq.followups.length - 1} more follow-up log(s)
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No follow-ups recorded</span>
                      )}
                    </td>

                    {/* 7. Action buttons (Arranged Up-Down to save width) */}
                    <td className="px-2 py-2 text-center w-14 align-middle">
                      <div className="flex flex-col gap-1 items-center justify-center mx-auto w-max">
                        {/* Row 1: View & Follow-up */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenDetails(inq)}
                            title="Show Full Inquiry Details"
                            className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenFollowup(inq)}
                            title="Add Follow-up"
                            className="p-1 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors border border-slate-200"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Row 2: Convert to Admission & Edit */}
                        <div className="flex items-center gap-1">
                          {!inq.isConverted ? (
                            <button
                              onClick={() => onOpenConvert(inq)}
                              title="Convert to Admission"
                              className="p-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors border border-slate-200"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span
                              title="Admission Enrolled"
                              className="p-1 text-purple-600 bg-purple-50 rounded-md border border-purple-200 cursor-default"
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <button
                            onClick={() => onOpenEditInquiry(inq)}
                            title="Edit Inquiry"
                            className="p-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors border border-slate-200"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Row 3: Delete */}
                        <button
                          onClick={() => setDeleteConfirmId(inq._id)}
                          title="Delete Inquiry"
                          className="w-full p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-slate-200 flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalRecords > 0 && (
          <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            {/* Left: Records Per Page Selector & Summary */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <span className="font-medium text-slate-500">Show</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="font-medium text-slate-500">records</span>
              </div>

              <span className="text-slate-300 hidden sm:inline">|</span>

              <span className="font-medium">
                Showing <strong className="text-slate-800">{totalRecords === 0 ? 0 : startIndex + 1}</strong> to{' '}
                <strong className="text-slate-800">{endIndex}</strong> of{' '}
                <strong className="text-indigo-600 font-bold">{totalRecords}</strong> inquiries
              </span>
            </div>

            {/* Right: Page Navigation Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  return (
                    <React.Fragment key={page}>
                      {prev && page - prev > 1 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Inquiry?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete this student inquiry? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
