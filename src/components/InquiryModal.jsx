import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, GraduationCap, Code2, Share2, FileText, Calendar } from 'lucide-react';
import axiosClient from '../api/axiosClient';

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

const REFERENCES = [
  'Walk-in / Direct Visit',
  'Friend / Senior Referral',
  'Instagram / Facebook Ad',
  'College Campus Seminar',
  'Google Search / Website',
  'WhatsApp / Telegram Group',
  'Other'
];

const TAKEN_BY_OPTIONS = [
  'Haresh Sir',
  'Mishal Sir',
  'Jaydip Sir'
];

const InquiryModal = ({ isOpen, onClose, inquiryToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    contactNo: '',
    alternateContactNo: '',
    email: '',
    collegeName: '',
    degree: 'B.Tech / BE (Computer / IT)',
    semester: '6th Semester',
    interestedDomain: 'Full Stack Web Development (MERN)',
    reference: 'Walk-in / Direct Visit',
    referenceDetails: '',
    notes: '',
    takenBy: 'Haresh Sir',
    status: 'New',
    inquiryDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inquiryToEdit) {
      setFormData({
        studentName: inquiryToEdit.studentName || '',
        contactNo: inquiryToEdit.contactNo || '',
        alternateContactNo: inquiryToEdit.alternateContactNo || '',
        email: inquiryToEdit.email || '',
        collegeName: inquiryToEdit.collegeName || '',
        degree: inquiryToEdit.degree || 'B.Tech / BE (Computer / IT)',
        semester: inquiryToEdit.semester || '',
        interestedDomain: inquiryToEdit.interestedDomain || 'Full Stack Web Development (MERN)',
        reference: inquiryToEdit.reference || 'Walk-in / Direct Visit',
        referenceDetails: inquiryToEdit.referenceDetails || '',
        notes: inquiryToEdit.notes || '',
        takenBy: inquiryToEdit.takenBy || 'Haresh Sir',
        status: inquiryToEdit.status || 'New',
        inquiryDate: inquiryToEdit.inquiryDate ? new Date(inquiryToEdit.inquiryDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        studentName: '',
        contactNo: '',
        alternateContactNo: '',
        email: '',
        collegeName: '',
        degree: 'B.Tech / BE (Computer / IT)',
        semester: '6th Semester',
        interestedDomain: 'Full Stack Web Development (MERN)',
        reference: 'Walk-in / Direct Visit',
        referenceDetails: '',
        notes: '',
        takenBy: 'Haresh Sir',
        status: 'New',
        inquiryDate: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [inquiryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentName.trim()) {
      setError('Student Name is required');
      return;
    }
    if (!formData.contactNo.trim()) {
      setError('Contact Number is required');
      return;
    }

    try {
      setLoading(true);
      if (inquiryToEdit) {
        await axiosClient.put(`/inquiries/${inquiryToEdit._id}`, formData);
      } else {
        await axiosClient.post('/inquiries', formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {inquiryToEdit ? 'Edit Inquiry Details' : 'Add New Student Inquiry'}
            </h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Fill in student information for internship counseling & follow-ups
            </p>
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
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 1: Basic Information */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <User className="w-4 h-4 mr-1.5" /> Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Patel"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alternate Contact / WhatsApp No.
                </label>
                <input
                  type="tel"
                  name="alternateContactNo"
                  value={formData.alternateContactNo}
                  onChange={handleChange}
                  placeholder="e.g. 9123456780"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-1.5" /> Academic Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Degree / Qualification
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {DEGREES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Semester / Passing Year
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. 6th Sem / 2026 Batch"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  College / Institute Name
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="e.g. LD College, Silver Oak, etc."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Internship Interest & Source */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center">
              <Code2 className="w-4 h-4 mr-1.5" /> Internship & Reference
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Interested Domain / Technology <span className="text-red-500">*</span>
                </label>
                <select
                  name="interestedDomain"
                  value={formData.interestedDomain}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                  required
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Inquiry Date
                </label>
                <input
                  type="date"
                  name="inquiryDate"
                  value={formData.inquiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                  Inquiry Taken By <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="takenBy"
                  value={formData.takenBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-indigo-900"
                  required
                >
                  {TAKEN_BY_OPTIONS.map((person) => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Source / Reference
                </label>
                <select
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {REFERENCES.map((ref) => (
                    <option key={ref} value={ref}>{ref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reference Detail / Person Name
                </label>
                <input
                  type="text"
                  name="referenceDetails"
                  value={formData.referenceDetails}
                  onChange={handleChange}
                  placeholder="e.g. Referred by Amit Sharma"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              {inquiryToEdit && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Inquiry Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted to Admission">Converted to Admission</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Counselor Remarks / Special Notes
              </label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Looking for 6 months live project internship, flexible with morning batch..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{inquiryToEdit ? 'Update Inquiry' : 'Save Inquiry'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
