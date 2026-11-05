import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
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

const SEMESTERS = [
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester / Final Year',
  'Graduate / Completed'
];

const BATCH_TIMINGS = [
  'Morning (9:00 AM - 1:00 PM)',
  'Afternoon (2:00 PM - 6:00 PM)',
  'Evening (6:00 PM - 8:00 PM)',
  'Full Day (10:00 AM - 6:00 PM)',
  'Flexible'
];

const DURATIONS = [
  '3 Months (Project Based)',
  '6 Months (Full Live Project Internship)',
  '1 Year (Comprehensive Program)',
  '1 Month (Fast Track)'
];

const GoogleFormView = ({ onSuccess, isEmbedded = false }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    contactNo: '',
    alternateContactNo: '',
    email: '',
    collegeName: '',
    degree: 'B.Tech / BE (Computer / IT)',
    semester: '6th Semester',
    interestedDomain: 'Full Stack Web Development (MERN)',
    city: 'Surat',
    preferredBatch: 'Morning (9:00 AM - 1:00 PM)',
    duration: '6 Months (Full Live Project Internship)',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      studentName: '',
      contactNo: '',
      alternateContactNo: '',
      email: '',
      collegeName: '',
      degree: 'B.Tech / BE (Computer / IT)',
      semester: '6th Semester',
      interestedDomain: 'Full Stack Web Development (MERN)',
      city: 'Surat',
      preferredBatch: 'Morning (9:00 AM - 1:00 PM)',
      duration: '6 Months (Full Live Project Internship)',
      notes: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.contactNo.trim()) {
      setError('Please provide a valid contact / mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post('/leads/public', formData);
      if (res.data.success) {
        setSubmitted(true);
        setSubmittedData(res.data.lead);
        onSuccess?.(res.data.lead);
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit form. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    handleClear();
    setSubmitted(false);
    setSubmittedData(null);
  };

  // Google Form Success View
  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto my-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Purple header card */}
        <div className="bg-white rounded-2xl shadow-md border-t-8 border-indigo-600 overflow-hidden p-6 sm:p-8 border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Your response has been recorded.
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Thank you for applying! Your inquiry has been registered in our portal. Our senior academic counselors (Haresh Sir / Mishal Sir / Jaydip Sir) will contact you shortly regarding syllabus, batches, and live project allotment.
          </p>

          {submittedData && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
              <p><strong className="text-slate-900">Student Name:</strong> {submittedData.studentName}</p>
              <p><strong className="text-slate-900">Contact Number:</strong> {submittedData.contactNo}</p>
              <p><strong className="text-slate-900">Domain / Track:</strong> {submittedData.interestedDomain}</p>
              <p><strong className="text-slate-900">Status:</strong> <span className="text-emerald-700 font-semibold">New Lead (Registered)</span></p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleResetForm}
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
            >
              <span>Submit another response</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Google Form Interactive Form View
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 1. Form Header Card */}
      <div className="bg-white rounded-2xl shadow-md border-t-8 border-indigo-600 overflow-hidden p-6 sm:p-8 border border-slate-200/80">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Student Application & Inquiry Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Live Project Internship Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Welcome to the official internship application portal. Please fill in your accurate personal, college, and domain details below. Once submitted, your inquiry will be instantly recorded and our counseling desk will reach out to you.
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-medium">
          <span>* Indicates required question</span>
          <span className="text-slate-400">Google Form Style</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Student Full Name */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-3">
          <label className="block text-sm sm:text-base font-semibold text-slate-900">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500">As shown in college records / marksheets</p>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Your answer"
            className="w-full px-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
            required
          />
        </div>

        {/* Card 2: Contact Number */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-3">
          <label className="block text-sm sm:text-base font-semibold text-slate-900">
            Contact / WhatsApp Number <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500">10-digit mobile number for counselor updates</p>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-1 top-2.5 text-slate-400" />
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full pl-8 pr-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
              required
            />
          </div>
        </div>

        {/* Card 3: Alternate Contact & Email */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-900 mb-1">
              Email Address
            </label>
            <p className="text-xs text-slate-500 mb-2">For internship offer letters & updates</p>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-1 top-2.5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full pl-8 pr-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Alternate Contact Number (Parent / Guardian)
            </label>
            <input
              type="tel"
              name="alternateContactNo"
              value={formData.alternateContactNo}
              onChange={handleChange}
              placeholder="Your answer"
              className="w-full px-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
            />
          </div>
        </div>

        {/* Card 4: College & Academic Background */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-900 mb-1">
              College / University Name
            </label>
            <p className="text-xs text-slate-500 mb-2">e.g. SCET, BVM, CKPCET, SASCMA, VNSGU...</p>
            <div className="relative">
              <GraduationCap className="w-4 h-4 absolute left-1 top-2.5 text-slate-400" />
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Your College Name"
                className="w-full pl-8 pr-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree / Qualification
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {DEGREES.map((deg) => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 5: Interested Internship Track / Technology */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-3">
          <label className="block text-sm sm:text-base font-semibold text-slate-900">
            Interested Internship Track / Technology <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500">Choose the field you want to specialize in</p>
          <div className="space-y-2.5 pt-1">
            {DOMAINS.map((dom) => (
              <label
                key={dom}
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.interestedDomain === dom
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="interestedDomain"
                  value={dom}
                  checked={formData.interestedDomain === dom}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs sm:text-sm text-slate-800 font-medium">{dom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card 6: Preferred Timings & Duration */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Preferred Batch Time
              </label>
              <select
                name="preferredBatch"
                value={formData.preferredBatch}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {BATCH_TIMINGS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Internship Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Current City / Area
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Surat, Varachha, Adajan, Katargam..."
              className="w-full px-3 py-2 text-sm text-slate-900 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent placeholder-slate-400"
            />
          </div>
        </div>

        {/* Card 7: Special Notes / Reference */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-3">
          <label className="block text-sm sm:text-base font-semibold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
            Any Questions, Special Notes or Referral Details
          </label>
          <p className="text-xs text-slate-500">
            Tell us about your project requirements or who recommended you
          </p>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Type your notes or questions here..."
            className="w-full px-3 py-2 text-sm text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          ></textarea>
        </div>

        {/* Form Bottom Submission Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-400/30 transition-all active:scale-95 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Submitting Response...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear form</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleFormView;
