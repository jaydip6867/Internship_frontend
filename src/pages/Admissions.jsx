import React, { useState, useEffect } from 'react';
import { 
  Search, 
  GraduationCap, 
  IndianRupee, 
  Eye, 
  Edit,
  Trash2, 
  Calendar, 
  Clock, 
  Filter,
  CheckCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import EditAdmissionModal from '../components/EditAdmissionModal';

const Admissions = ({ onOpenAdmissionDetails }) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await axiosClient.get('/admissions', { params });
      if (res.data.success) {
        setAdmissions(res.data.admissions);
      }
    } catch (err) {
      console.error('Fetch admissions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdmissions();
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/admissions/${id}`);
      setDeleteConfirmId(null);
      fetchAdmissions();
    } catch (err) {
      console.error(err);
      alert('Failed to delete admission');
    }
  };

  const handleOpenEdit = (admission) => {
    setEditingAdmission(admission);
    setIsEditModalOpen(true);
  };

  // Financial calculations
  const totalRevenue = admissions.reduce((acc, curr) => acc + (curr.totalFees || 0), 0);
  const totalCollected = admissions.reduce((acc, curr) => acc + (curr.paidFees || 0), 0);
  const totalPending = admissions.reduce((acc, curr) => acc + (curr.remainingFees || 0), 0);

  // Pagination calculation
  const totalRecords = admissions.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentAdmissions = admissions.slice(startIndex, endIndex);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Enrolled Admissions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage registered students, batches, installment collections & receipts
          </p>
        </div>
      </div>

      {/* Mini Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Enrolled</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{admissions.length} Students</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 font-semibold uppercase">Fees Collected</span>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">₹{totalCollected.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold uppercase">Pending Dues</span>
            <p className="text-xl font-bold text-amber-700 mt-0.5">₹{totalPending.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, registration no, phone, college..."
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

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="All">All Admissions</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs">Loading admission records...</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 text-sm">No Admissions Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Convert prospective students from the Inquiries page to start enrolling them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-3.5 text-center w-10 text-slate-400">#</th>
                  <th className="px-4 py-3.5">Reg. No & Student</th>
                  <th className="px-4 py-3.5">Domain & Batch</th>
                  <th className="px-4 py-3.5">Joining Date</th>
                  <th className="px-4 py-3.5">Fees Summary</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-2 py-3.5 text-center w-14">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentAdmissions.map((adm, index) => (
                  <tr key={adm._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* # Increment */}
                    <td className="px-3 py-3.5 text-center font-bold text-slate-400 text-xs">
                      {startIndex + index + 1}
                    </td>

                    {/* Reg No & Student & Company */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {adm.registrationNo}
                        </span>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                          {adm.company || 'Creative Web Infotech'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-1">{adm.studentName}</div>
                      <div className="text-[11px] text-slate-500">{adm.contactNo}</div>
                    </td>

                    {/* Domain & Duration */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{adm.domain}</div>
                      <div className="text-[11px] text-slate-500">{adm.duration} • {adm.batchTime}</div>
                    </td>

                    {/* Joining Date */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">
                        {new Date(adm.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Adm: {new Date(adm.admissionDate || adm.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    {/* Fees Breakdown */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-slate-900">₹{adm.totalFees?.toLocaleString()}</span>
                        <span className="text-slate-400 text-[10px]">Total</span>
                      </div>
                      <div className="text-[11px] space-x-2 mt-0.5">
                        <span className="text-emerald-700 font-medium">Paid: ₹{adm.paidFees?.toLocaleString()}</span>
                        {adm.remainingFees > 0 ? (
                          <span className="text-amber-700 font-semibold">Due: ₹{adm.remainingFees?.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-1 rounded">Paid in Full</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap inline-block ${
                        adm.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {adm.status}
                      </span>
                    </td>

                    {/* Actions (Up-Down stacked to minimize width) */}
                    <td className="px-2 py-2 text-center w-14 align-middle">
                      <div className="flex flex-col gap-1 items-center justify-center mx-auto w-max">
                        <button
                          onClick={() => onOpenAdmissionDetails(adm)}
                          title="View Details & Receipt"
                          className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(adm)}
                          title="Edit Admission"
                          className="p-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors border border-slate-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(adm._id)}
                          title="Delete Admission"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-slate-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
                <strong className="text-indigo-600 font-bold">{totalRecords}</strong> admissions
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

      {/* Edit Admission Modal */}
      {isEditModalOpen && (
        <EditAdmissionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAdmission(null);
          }}
          admission={editingAdmission}
          onSuccess={fetchAdmissions}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Admission?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure? This will delete the admission record and restore the student inquiry back to Follow-up status.
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
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;
