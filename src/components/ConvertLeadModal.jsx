import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRightCircle, 
  User, 
  Phone, 
  GraduationCap, 
  Code2, 
  CheckCircle2, 
  Sparkles,
  FileText
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const TAKEN_BY_OPTIONS = [
  'Haresh Sir',
  'Mishal Sir',
  'Jaydip Sir'
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

const DEGREES = [
  'B.Tech / BE (Computer / IT)',
  'B.Tech / BE (Other Branch)',
  'BCA',
  'MCA',
  'Diploma IT / Computer',
  'B.Sc (IT / CS)',
  'M.Sc (IT / CA)',
  'Non-IT Graduate',
  'Other'
];

const SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  'Graduate / Completed'
];

const ConvertLeadModal = ({ isOpen, onClose, lead, onSuccess }) => {
  const [formData, setFormData] = useState({
    takenBy: 'Haresh Sir',
    interestedDomain: 'Full Stack Web Development (MERN)',
    degree: 'B.Tech / BE (Computer / IT)',
    semester: '6th Semester',
    status: 'New',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        takenBy: lead.assignedTo || 'Haresh Sir',
        interestedDomain: lead.interestedDomain || 'Full Stack Web Development (MERN)',
        degree: lead.degree || 'B.Tech / BE (Computer / IT)',
        semester: lead.semester || '6th Semester',
        status: 'New',
        notes: lead.notes || (lead.city ? `Lead from ${lead.city}` : ''),
      });
      setError('');
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.post(`/leads/${lead._id}/convert-to-inquiry`, formData);
      if (res.data.success) {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to convert lead to inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-purple-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Set Lead to Official Inquiry</h2>
              <p className="text-xs text-indigo-200">
                Move student lead into Inquiry Management pipeline
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

        {/* Lead Student Overview Banner */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 block text-sm">{lead.studentName}</span>
            <span className="text-slate-500">{lead.contactNo} • {lead.collegeName || 'No college'}</span>
            {lead.internshipType && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Option: {lead.internshipType}
              </span>
            )}
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            Source: Google Form
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Taken By / Assigned Counselor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assign Counselor (Taken By) <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              Select who will handle this student's counseling and follow-ups
            </p>
            <select
              name="takenBy"
              value={formData.takenBy}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-indigo-200 bg-indigo-50/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-indigo-950"
              required
            >
              {TAKEN_BY_OPTIONS.map((sir) => (
                <option key={sir} value={sir}>{sir}</option>
              ))}
            </select>
          </div>

          {/* Interested Domain */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interested Domain / Technology <span className="text-red-500">*</span>
            </label>
            <select
              name="interestedDomain"
              value={formData.interestedDomain}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              required
            >
              {DOMAINS.map((dom) => (
                <option key={dom} value={dom}>{dom}</option>
              ))}
            </select>
          </div>

          {/* Degree & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree / Qualification
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {DEGREES.map((deg) => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Inquiry Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="New">New</option>
              <option value="Interested">Interested</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* Counselor Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Counselor Notes / Remarks
            </label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Student inquired for morning batch, follow up scheduled for tomorrow..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-300 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Setting to Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Set into Inquiry</span>
                  <ArrowRightCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertLeadModal;
