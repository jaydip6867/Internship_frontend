import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  PhoneCall, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Download, 
  MessageCircle, 
  Phone, 
  Clock, 
  Users, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  AlertCircle,
  FileText,
  ArrowRightCircle,
  X,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import GoogleFormView from '../components/GoogleFormView';
import ConvertLeadModal from '../components/ConvertLeadModal';
import { exportInquiriesToExcel } from '../utils/excelUtils';

const NewLeads = ({ 
  onOpenDetails, 
  onOpenFollowup, 
  onOpenConvert, 
  onOpenEditInquiry 
}) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'form'
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Convert to Inquiry Modal State
  const [leadForConvert, setLeadForConvert] = useState(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  // Google Form Webhook Integration State
  const [syncStatus, setSyncStatus] = useState({ syncActive: false, lastPing: null });
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSyncStatus = async () => {
    try {
      const res = await axiosClient.get('/leads/sync-status');
      if (res.data.success) {
        setSyncStatus(res.data);
      }
    } catch (err) {
      console.error('Fetch sync status error:', err);
    }
  };

  const handleToggleSync = async () => {
    try {
      const res = await axiosClient.post('/leads/toggle-sync', { active: !syncStatus.syncActive });
      if (res.data.success) {
        setSyncStatus((prev) => ({ ...prev, syncActive: res.data.syncActive }));
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Toggle sync error:', err);
      alert('Failed to toggle sync status');
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedDomain !== 'All') params.domain = selectedDomain;

      const res = await axiosClient.get('/leads', { params });
      if (res.data.success) {
        setLeads(res.data.leads || []);
      }
    } catch (err) {
      console.error('Fetch leads error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchLeads();
    fetchSyncStatus();
  }, [selectedStatus, selectedDomain]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLeads();
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/leads/${id}`);
      setDeleteConfirmId(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert('Failed to delete lead');
    }
  };

  const handleOpenConvertLead = (lead) => {
    setLeadForConvert(lead);
    setIsConvertModalOpen(true);
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/apply`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleFormSubmitted = () => {
    fetchLeads();
    setActiveTab('list');
  };

  // Stats
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'New Lead' || !l.isConvertedToInquiry).length;
  const convertedToInquiryCount = leads.filter((l) => l.isConvertedToInquiry || l.status === 'Converted to Inquiry').length;

  // Filtered domains
  const availableDomains = Array.from(
    new Set(leads.map((l) => l.interestedDomain).filter(Boolean))
  ).sort();

  // Pagination calculation
  const totalRecords = leads.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentLeads = leads.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">New Leads Management</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Incoming student inquiries from Google Form — Review & Convert directly into Official Inquiries
          </p>
        </div>

        {/* Action Buttons: Copy Link, Open Public Link, Export */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsIntegrationModalOpen(true)}
            title="Google Form / Sheet Webhook Integration"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200 transition-colors shadow-xs active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
            <span>Google Sheet Sync {syncStatus.syncActive ? '(Active)' : '(Standby)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Public Google Form Application Link"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-xs active:scale-95"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Form Link</span>
              </>
            )}
          </button>

          <a
            href="/apply"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Public Application Form in New Tab"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-colors shadow-xs active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Public Form</span>
          </a>

          <button
            type="button"
            onClick={() => exportInquiriesToExcel(leads, 'Google_Form_Leads')}
            title="Export Leads to Excel"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors shadow-xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Integration Standby Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/40 to-purple-50 border border-purple-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">
                Google Form Webhook:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                syncStatus.syncActive 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
                {syncStatus.syncActive ? '● Sync Active (Saving Leads)' : '○ Standby / Paused (No Records Added)'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {syncStatus.syncActive
                ? 'All Google Form submissions are actively saved into MongoDB as New Leads.'
                : 'Webhook integration is connected and verified. Sync is currently on standby as requested.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsIntegrationModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto whitespace-nowrap"
        >
          <span>Webhook Setup & Script</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'list'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Received Leads ({totalLeads})</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'form'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Submit New Lead (Google Form)</span>
        </button>
      </div>

      {/* TAB 1: Leads Table & List */}
      {activeTab === 'list' && (
        <div className="space-y-5">
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Leads Received</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{totalLeads} Leads</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-800 font-semibold uppercase">Pending / New Leads</span>
                <p className="text-xl font-bold text-amber-700 mt-0.5">{newLeadsCount} Pending Review</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-semibold uppercase">Converted into Inquiries</span>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">{convertedToInquiryCount} In Inquiries</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by student name, contact, college, city..."
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
                <option value="All">All Leads</option>
                <option value="New Lead">Pending Review</option>
                <option value="Converted to Inquiry">Converted to Inquiry</option>
                <option value="Rejected">Rejected</option>
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

          {/* Leads Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs">Loading leads from database...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 text-sm">No Leads Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No responses received yet. You can submit one using the "Submit New Lead (Google Form)" tab or share your public form link with students.
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Fill Google Form Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-3 py-3 w-12 text-center">#</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Contact & WhatsApp</th>
                      <th className="px-4 py-3">College & Degree</th>
                      <th className="px-4 py-3">Interested Domain</th>
                      <th className="px-4 py-3">Option & City</th>
                      <th className="px-4 py-3 text-center">Inquiry Action</th>
                      <th className="px-3 py-3 text-center w-14">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentLeads.map((lead, index) => {
                      const cleanContact = lead.contactNo?.replace(/[^0-9]/g, '') || '';
                      const whatsappUrl = `https://wa.me/91${cleanContact.slice(-10)}?text=Hello%20${encodeURIComponent(lead.studentName)},%20we%20received%20your%20internship%20application%20for%20${encodeURIComponent(lead.interestedDomain)}.`;

                      return (
                        <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                          {/* 1. Incremental Serial Number */}
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-400">
                            {startIndex + index + 1}
                          </td>

                          {/* 2. Student Name & Date */}
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 block text-xs sm:text-sm">
                              {lead.studentName}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}
                            </span>
                          </td>

                          {/* 3. Contact & Quick Action */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-700">
                              <span>{lead.contactNo}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <a
                                href={`tel:${lead.contactNo}`}
                                title="Call Student"
                                className="inline-flex items-center space-x-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                              <span className="text-slate-300">|</span>
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="inline-flex items-center space-x-1 text-[11px] text-emerald-600 hover:text-emerald-800 font-medium"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>

                          {/* 4. College & Degree */}
                          <td className="px-4 py-3">
                            <span className="font-medium text-slate-800 block truncate max-w-[170px]">
                              {lead.collegeName || 'Not specified'}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[170px]">
                              {lead.degree} {lead.semester ? `• ${lead.semester}` : ''}
                            </span>
                          </td>

                          {/* 5. Interested Domain */}
                          <td className="px-4 py-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-xs border border-indigo-100 max-w-[200px] truncate">
                              {lead.interestedDomain}
                            </span>
                          </td>

                          {/* 6. Option & City */}
                          <td className="px-4 py-3">
                            {lead.internshipType ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                  lead.internshipType.toLowerCase().includes('free')
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : lead.internshipType.toLowerCase().includes('paid')
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {lead.internshipType}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500 font-medium">
                                {lead.preferredBatch || lead.duration || 'Standard'}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500 block mt-0.5 truncate max-w-[160px]">
                              📍 {lead.city || 'Surat'}
                            </span>
                          </td>

                          {/* 7. Inquiry Action: Set to Inquiry vs Already In Inquiry */}
                          <td className="px-4 py-3 text-center">
                            {lead.isConvertedToInquiry ? (
                              <div className="flex flex-col items-center space-y-0.5">
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold whitespace-nowrap shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>In Inquiries</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Assigned: {lead.assignedTo || 'Haresh Sir'}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenConvertLead(lead)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-300 transition-all active:scale-95 whitespace-nowrap"
                                title="Click to move this student into Inquiries"
                              >
                                <span>Set to Inquiry</span>
                                <ArrowRightCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>

                          {/* 8. Action: Delete / Remove */}
                          <td className="px-2 py-3 text-center align-middle">
                            <button
                              onClick={() => setDeleteConfirmId(lead._id)}
                              title="Delete Lead"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-medium text-slate-500">Show</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="font-medium text-slate-500">leads per page</span>
                  </div>

                  <span className="text-slate-300 hidden sm:inline">|</span>

                  <span className="font-medium">
                    Showing <strong className="text-slate-800">{totalRecords === 0 ? 0 : startIndex + 1}</strong> to{' '}
                    <strong className="text-slate-800">{endIndex}</strong> of{' '}
                    <strong className="text-indigo-600 font-bold">{totalRecords}</strong> leads
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Embedded Google Form View */}
      {activeTab === 'form' && (
        <div className="py-4">
          <div className="max-w-2xl mx-auto mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
            <span className="flex items-center space-x-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Fill and submit below. The record will immediately appear in the Received Leads tab and database!</span>
            </span>
            <button
              onClick={() => setActiveTab('list')}
              className="text-xs font-bold text-indigo-600 hover:underline shrink-0 ml-2"
            >
              Back to List →
            </button>
          </div>

          <GoogleFormView onSuccess={handleFormSubmitted} isEmbedded={true} />
        </div>
      )}

      {/* Convert Lead to Inquiry Modal */}
      {isConvertModalOpen && (
        <ConvertLeadModal
          isOpen={isConvertModalOpen}
          onClose={() => {
            setIsConvertModalOpen(false);
            setLeadForConvert(null);
          }}
          lead={leadForConvert}
          onSuccess={fetchLeads}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Lead?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove this lead? This action cannot be undone.
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

      {/* Google Form / Sheet Webhook Integration Modal */}
      {isIntegrationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Google Form & Sheet Integration</h3>
                  <p className="text-xs text-purple-200">
                    Live Webhook sync pipeline between Google Form and MongoDB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsIntegrationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              {/* Standby Status Alert */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                syncStatus.syncActive
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-purple-50 border-purple-200 text-purple-950'
              }`}>
                <ShieldCheck className="w-5 h-5 shrink-0 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      Sync Status: {syncStatus.syncActive ? 'ACTIVE (Saving to Database)' : 'STANDBY / PAUSED'}
                    </span>
                    <button
                      onClick={handleToggleSync}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        syncStatus.syncActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {syncStatus.syncActive ? 'Pause Sync' : 'Start Running Sync'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {syncStatus.syncActive
                      ? 'All incoming submissions from your Google Form are automatically inserted as New Leads.'
                      : 'As requested, the integration is fully configured and ready, but saving to database is on PAUSED (Standby) mode. Click "Start Running Sync" whenever you want to activate it.'}
                  </p>
                </div>
              </div>

              {/* Webhook URL Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Production Webhook URL (Render Backend)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value="https://internship-backend-5oke.onrender.com/api/leads/google-form-webhook"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://internship-backend-5oke.onrender.com/api/leads/google-form-webhook');
                      setCopiedWebhookUrl(true);
                      setTimeout(() => setCopiedWebhookUrl(false), 2000);
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 border border-slate-300"
                  >
                    {copiedWebhookUrl ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">
                  3 Simple Steps to Connect your Google Sheet / Form:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                  <li>
                    Open your Google Sheet linked to the form (<a href="https://docs.google.com/spreadsheets/d/1vz6Oc2oUQ9p3wbka08UBMlpdF9JZ7kdtblA6g4SjFmI/edit?gid=22449246#gid=22449246" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">Open Sheet</a>).
                  </li>
                  <li>
                    Click menu <strong>Extensions &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Delete any existing code, paste the script below, and click <strong>Save (Ctrl + S)</strong>.
                  </li>
                  <li>
                    In Apps Script, click <strong>Triggers (Clock icon on left) &gt; Add Trigger</strong>, set Function to <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700">onFormSubmit</code> and Event type to <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700">On form submit</code>.
                  </li>
                </ol>
              </div>

              {/* Google Apps Script Code Block */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Google Apps Script Code
                  </label>
                  <button
                    onClick={() => {
                      const script = `function onFormSubmit(e) {
  var webhookUrl = "https://internship-backend-5oke.onrender.com/api/leads/google-form-webhook";
  try {
    var payload = {};
    if (e && e.namedValues) {
      payload = {
        studentName: (e.namedValues['Student Full Name'] ? e.namedValues['Student Full Name'][0] : ''),
        contactNo: (e.namedValues['Mobile / WhatsApp Number'] ? e.namedValues['Mobile / WhatsApp Number'][0] : ''),
        email: (e.namedValues['Email Address'] ? e.namedValues['Email Address'][0] : ''),
        collegeName: (e.namedValues['College / University Name'] ? e.namedValues['College / University Name'][0] : ''),
        degree: (e.namedValues['Current Course'] ? e.namedValues['Current Course'][0] : ''),
        semester: (e.namedValues['Current Academic Year'] ? e.namedValues['Current Academic Year'][0] : ''),
        interestedDomain: (e.namedValues['Preferred Internship Domain'] ? e.namedValues['Preferred Internship Domain'][0] : ''),
        internshipType: (e.namedValues['Internship Program Preference'] ? e.namedValues['Internship Program Preference'][0] : ''),
        internshipMode: (e.namedValues['Preferred Internship Mode'] ? e.namedValues['Preferred Internship Mode'][0] : ''),
        notes: (e.namedValues['Any Questions? (Optional)'] ? e.namedValues['Any Questions? (Optional)'][0] : ''),
        timestamp: (e.namedValues['Timestamp'] ? e.namedValues['Timestamp'][0] : new Date().toISOString())
      };
    } else if (e && e.values) {
      payload = {
        timestamp: e.values[0] || '',
        studentName: e.values[1] || '',
        contactNo: e.values[2] || '',
        email: e.values[3] || '',
        collegeName: e.values[4] || '',
        degree: e.values[5] || '',
        semester: e.values[6] || '',
        interestedDomain: e.values[7] || '',
        internshipType: e.values[8] || '',
        internshipMode: e.values[9] || '',
        notes: e.values[10] || ''
      };
    }
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(webhookUrl, options);
  } catch (err) {
    Logger.log("Error: " + err.message);
  }
}`;
                      navigator.clipboard.writeText(script);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Copy Apps Script</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
{`function onFormSubmit(e) {
  var webhookUrl = "https://internship-backend-5oke.onrender.com/api/leads/google-form-webhook";
  try {
    var payload = {};
    if (e && e.namedValues) {
      payload = {
        studentName: (e.namedValues['Student Full Name'] ? e.namedValues['Student Full Name'][0] : ''),
        contactNo: (e.namedValues['Mobile / WhatsApp Number'] ? e.namedValues['Mobile / WhatsApp Number'][0] : ''),
        email: (e.namedValues['Email Address'] ? e.namedValues['Email Address'][0] : ''),
        collegeName: (e.namedValues['College / University Name'] ? e.namedValues['College / University Name'][0] : ''),
        degree: (e.namedValues['Current Course'] ? e.namedValues['Current Course'][0] : ''),
        semester: (e.namedValues['Current Academic Year'] ? e.namedValues['Current Academic Year'][0] : ''),
        interestedDomain: (e.namedValues['Preferred Internship Domain'] ? e.namedValues['Preferred Internship Domain'][0] : ''),
        internshipType: (e.namedValues['Internship Program Preference'] ? e.namedValues['Internship Program Preference'][0] : ''),
        internshipMode: (e.namedValues['Preferred Internship Mode'] ? e.namedValues['Preferred Internship Mode'][0] : ''),
        notes: (e.namedValues['Any Questions? (Optional)'] ? e.namedValues['Any Questions? (Optional)'][0] : '')
      };
    }
    UrlFetchApp.fetch(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log("Error: " + err.message);
  }
}`}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsIntegrationModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLeads;
