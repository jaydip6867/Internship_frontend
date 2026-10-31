import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  PhoneCall,
  Edit,
  Tag
} from 'lucide-react';

const InquiryDetailsModal = ({ 
  isOpen, 
  onClose, 
  inquiry, 
  onOpenFollowup, 
  onOpenConvert, 
  onOpenEdit 
}) => {
  if (!isOpen || !inquiry) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interested':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Follow-up':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Converted to Admission':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Not Interested':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getFollowupStatusBadge = (status) => {
    switch (status) {
      case 'Interested':
      case 'Ready for Admission':
      case 'Visited Campus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Callback Requested':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cold/No Response':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Not Interested':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center font-bold text-lg">
              {inquiry.studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{inquiry.studentName}</h2>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(inquiry.status)}`}>
                  {inquiry.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Inquiry Date: {new Date(inquiry.inquiryDate || inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              onClick={() => {
                onClose();
                onOpenFollowup(inquiry);
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Add Follow-up</span>
            </button>

            {!inquiry.isConverted ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenConvert(inquiry);
                }}
                className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Convert to Admission</span>
              </button>
            ) : (
              <span className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Admission Enrolled</span>
              </span>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenEdit(inquiry);
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-all ml-auto"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Student & Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Contact & College */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Personal & College Details
              </h3>

              <div className="flex items-center text-sm text-slate-700">
                <Phone className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">{inquiry.contactNo}</span>
                  {inquiry.alternateContactNo && (
                    <span className="text-xs text-slate-500 ml-2">/ Alt: {inquiry.alternateContactNo}</span>
                  )}
                </div>
              </div>

              {inquiry.email && (
                <div className="flex items-center text-sm text-slate-700">
                  <Mail className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                  <span>{inquiry.email}</span>
                </div>
              )}

              <div className="flex items-start text-sm text-slate-700 pt-1 border-t border-slate-100">
                <GraduationCap className="w-4 h-4 mr-2.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">{inquiry.collegeName || 'College not specified'}</p>
                  <p className="text-xs text-slate-500">
                    {inquiry.degree} {inquiry.semester ? `(${inquiry.semester})` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Internship Track & Source */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Domain & Lead Source
              </h3>

              <div>
                <span className="text-xs text-slate-500 block mb-1">Interested Internship Domain:</span>
                <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-semibold">
                  {inquiry.interestedDomain}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="text-slate-500">Source: </span>
                  <span className="font-semibold text-slate-800">{inquiry.reference}</span>
                  {inquiry.referenceDetails && (
                    <span className="ml-1 text-slate-500 italic">({inquiry.referenceDetails})</span>
                  )}
                </div>
                {inquiry.takenBy && (
                  <div className="bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-indigo-200">
                    Taken By: {inquiry.takenBy}
                  </div>
                )}
              </div>

              {inquiry.notes && (
                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 mt-2">
                  <span className="font-semibold block mb-0.5">Counseling Notes:</span>
                  {inquiry.notes}
                </div>
              )}
            </div>
          </div>

          {/* Follow-up Timeline Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
                Follow-up History ({inquiry.followups?.length || 0})
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenFollowup(inquiry);
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                + Add Record
              </button>
            </div>

            {(!inquiry.followups || inquiry.followups.length === 0) ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs">
                No follow-ups recorded yet. Click 'Add Follow-up' to log conversations with this student.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiry.followups.map((fp, index) => (
                  <div 
                    key={index} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getFollowupStatusBadge(fp.status)}`}>
                          {fp.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(fp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        By {fp.recordedBy || 'Admin'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {fp.remarks}
                    </p>

                    {fp.nextFollowupDate && (
                      <div className="mt-2 text-[11px] text-indigo-600 font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Next Follow-up Scheduled: {new Date(fp.nextFollowupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailsModal;
