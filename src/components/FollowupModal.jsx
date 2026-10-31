import React, { useState } from 'react';
import { X, PhoneCall, Calendar, MessageSquare, Clock, User } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const FOLLOWUP_STATUSES = [
  'Interested',
  'Callback Requested',
  'Cold/No Response',
  'Visited Campus',
  'Ready for Admission',
  'Not Interested',
  'Other'
];

const FOLLOWUP_TAKEN_BY = [
  'Haresh Sir',
  'Mishal Sir',
  'Jaydip Sir',
  'Sanjana'
];

const FollowupModal = ({ isOpen, onClose, inquiry, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Interested',
    recordedBy: 'Haresh Sir',
    remarks: '',
    nextFollowupDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !inquiry) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.remarks.trim()) {
      setError('Remarks are required to record follow-up details');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axiosClient.post(`/inquiries/${inquiry._id}/followup`, formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Add Follow-up Record</h2>
              <p className="text-xs text-emerald-100">
                {inquiry.studentName} ({inquiry.contactNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick context info */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 text-xs text-slate-600 flex justify-between items-center">
          <span>
            Domain: <strong className="text-slate-800">{inquiry.interestedDomain}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
            Current: {inquiry.status}
          </span>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Follow-up Taken By <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="recordedBy"
                value={formData.recordedBy}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white text-emerald-900"
                required
              >
                {FOLLOWUP_TAKEN_BY.map((person) => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" /> Follow-up Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Call / Interaction Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
            >
              {FOLLOWUP_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" /> Discussion & Remarks <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="remarks"
              rows="3"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="e.g. Student visited office. Discussed syllabus and live project timeline. Asking for 2 days to confirm with parents..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Next Follow-up Date (Optional)
            </label>
            <input
              type="date"
              name="nextFollowupDate"
              value={formData.nextFollowupDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
            />
          </div>

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
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition-all"
            >
              {loading ? 'Saving...' : 'Save Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowupModal;
