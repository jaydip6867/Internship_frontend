import React, { useState } from 'react';
import { X, CheckCircle, DollarSign, Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';

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

const ConvertAdmissionModal = ({ isOpen, onClose, inquiry, onSuccess }) => {
  const [formData, setFormData] = useState({
    duration: '6 Months (Full Live Project Internship)',
    batchTime: 'Morning (9:00 AM - 1:00 PM)',
    admissionDate: new Date().toISOString().split('T')[0],
    joiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalFees: 15000,
    paidFees: 5000,
    paymentMode: 'UPI / GPay / PhonePe',
    paymentReference: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !inquiry) return null;

  const remaining = Math.max(0, Number(formData.totalFees || 0) - Number(formData.paidFees || 0));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.joiningDate) {
      setError('Please provide a Joining Date');
      return;
    }
    if (formData.totalFees < 0 || formData.paidFees < 0) {
      setError('Fees cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axiosClient.post(`/inquiries/${inquiry._id}/convert-admission`, {
        ...formData,
        totalFees: Number(formData.totalFees),
        paidFees: Number(formData.paidFees),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to convert to admission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Convert to Official Admission</h2>
              <p className="text-xs text-indigo-200">
                Register student, assign batch details & record enrollment fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Summary Card */}
        <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Student</span>
            <span className="font-bold text-slate-800 truncate block">{inquiry.studentName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Phone</span>
            <span className="font-semibold text-slate-800">{inquiry.contactNo}</span>
          </div>
          <div>
            <span className="text-slate-500 block">College</span>
            <span className="font-medium text-slate-700 truncate block">{inquiry.collegeName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Domain</span>
            <span className="font-semibold text-indigo-700 truncate block">{inquiry.interestedDomain}</span>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Internship Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
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
                {BATCH_TIMINGS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> Admission Date
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> Internship Joining Date <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                required
              />
            </div>
          </div>

          {/* Fees Breakdown Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-emerald-600" /> Fee Structure & Payment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total Fees (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalFees"
                  value={formData.totalFees}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Initial Paid Fees (₹)
                </label>
                <input
                  type="number"
                  name="paidFees"
                  value={formData.paidFees}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalFees}
                  className="w-full px-3 py-2 text-sm font-semibold text-emerald-700 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Remaining Balance (₹)
                </label>
                <div className="px-3 py-2 text-sm font-bold text-amber-700 bg-amber-50/60 rounded-lg border border-amber-200">
                  ₹{remaining.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
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
                  Transaction Ref / Receipt No.
                </label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g. UPI Ref / Cash Receipt #1024"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Admission Remarks / Notes
            </label>
            <textarea
              name="remarks"
              rows="2"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="e.g. Student provided college NOC. Balance to be cleared in 2nd week..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            ></textarea>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-300 transition-all flex items-center space-x-1.5"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Register Admission</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertAdmissionModal;
