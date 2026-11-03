import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Code2, 
  Building2, 
  Calendar, 
  Clock, 
  CreditCard, 
  IndianRupee, 
  CheckCircle,
  Edit3
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const COMPANIES = [
  'Creative Web Infotech',
  'Granthi It Solution'
];

const DOMAINS = [
  'Full Stack Web Development (MERN)',
  'React.js & Node.js',
  'Python & Data Science',
  'AI & Machine Learning',
  'Flutter & Android App Dev',
  'Java Full Stack Development',
  'UI/UX Design & Frontend',
  'DevOps & Cloud Computing',
  'Cyber Security',
  'Other / Custom Track'
];

const BATCH_TIMINGS = [
  'Morning (9:00 AM - 1:00 PM)',
  'Afternoon (2:00 PM - 6:00 PM)',
  'Evening (6:00 PM - 8:00 PM)',
  'Full Day (10:00 AM - 6:00 PM)',
  'Weekend Batch',
  'Flexible / Remote'
];

const DURATIONS = [
  '1 Month (Fast Track)',
  '3 Months (Project Based)',
  '6 Months (Full Live Project Internship)',
  '1 Year (Comprehensive Program)'
];

const PAYMENT_MODES = [
  'UPI / GPay / PhonePe',
  'Cash',
  'Bank Transfer (NEFT/IMPS)',
  'Cheque',
  'Other'
];

const STATUSES = ['Active', 'Completed', 'Cancelled'];

const EditAdmissionModal = ({ isOpen, onClose, admission, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    contactNo: '',
    email: '',
    collegeName: '',
    domain: '',
    company: 'Creative Web Infotech',
    duration: '6 Months (Full Live Project Internship)',
    batchTime: 'Morning (9:00 AM - 1:00 PM)',
    admissionDate: '',
    joiningDate: '',
    totalFees: 15000,
    paidFees: 5000,
    paymentMode: 'UPI / GPay / PhonePe',
    paymentReference: '',
    status: 'Active',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admission) {
      setFormData({
        studentName: admission.studentName || '',
        contactNo: admission.contactNo || '',
        email: admission.email || '',
        collegeName: admission.collegeName || '',
        domain: admission.domain || 'Full Stack Web Development (MERN)',
        company: admission.company || 'Creative Web Infotech',
        duration: admission.duration || '6 Months (Full Live Project Internship)',
        batchTime: admission.batchTime || 'Morning (9:00 AM - 1:00 PM)',
        admissionDate: admission.admissionDate
          ? new Date(admission.admissionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        joiningDate: admission.joiningDate
          ? new Date(admission.joiningDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        totalFees: admission.totalFees ?? 15000,
        paidFees: admission.paidFees ?? 0,
        paymentMode: admission.paymentMode || 'UPI / GPay / PhonePe',
        paymentReference: admission.paymentReference || '',
        status: admission.status || 'Active',
        remarks: admission.remarks || '',
      });
      setError('');
    }
  }, [admission, isOpen]);

  if (!isOpen || !admission) return null;

  const remaining = Math.max(0, Number(formData.totalFees || 0) - Number(formData.paidFees || 0));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentName.trim()) {
      setError('Student name is required');
      return;
    }
    if (!formData.contactNo.trim()) {
      setError('Contact number is required');
      return;
    }
    if (Number(formData.totalFees) < 0 || Number(formData.paidFees) < 0) {
      setError('Fees cannot be negative');
      return;
    }

    try {
      setLoading(true);
      await axiosClient.put(`/admissions/${admission._id}`, {
        ...formData,
        totalFees: Number(formData.totalFees),
        paidFees: Number(formData.paidFees),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Update admission error:', err);
      setError(err.response?.data?.message || 'Failed to update admission details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Edit Admission Record</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold">
                  {admission.registrationNo}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Update student admission, company, batch timings and fee collections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Section 1: Student Information */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <User className="w-4 h-4 mr-1.5" /> Student Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  College / University Name
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Course & Company Allotment */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <Building2 className="w-4 h-4 mr-1.5" /> Company & Course Allotment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allotted Company <span className="text-red-500">*</span>
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium text-indigo-950"
                  required
                >
                  {COMPANIES.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Internship Track / Domain <span className="text-red-500">*</span>
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {DOMAINS.map((dom) => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {DURATIONS.map((dur) => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Batch Timing
                </label>
                <select
                  name="batchTime"
                  value={formData.batchTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {BATCH_TIMINGS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Admission Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Joining Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Fees & Payment Status */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <IndianRupee className="w-4 h-4 mr-1.5" /> Fees Structure & Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Fees (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="number"
                    name="totalFees"
                    value={formData.totalFees}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paid Fees (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="number"
                    name="paidFees"
                    value={formData.paidFees}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-emerald-600"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remaining Due (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={remaining}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 font-semibold text-amber-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {PAYMENT_MODES.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Payment Ref / Transaction ID
                </label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g. UPI Ref / Cash Memo"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Admission Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Remarks / Special Instructions
              </label>
              <textarea
                name="remarks"
                rows="2"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="e.g. 2nd installment expected on next month 10th..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              ></textarea>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-300 transition-all flex items-center space-x-1.5"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Update Admission</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmissionModal;
