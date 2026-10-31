import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Calendar, Clock, CreditCard, Award, Printer } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AdmissionDetailsModal = ({ isOpen, onClose, admission, onSuccess }) => {
  const [isUpdatingFees, setIsUpdatingFees] = useState(false);
  const [newPaidAmount, setNewPaidAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('UPI / GPay / PhonePe');
  const [paymentRef, setPaymentRef] = useState('');
  const [status, setStatus] = useState(admission?.status || 'Active');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !admission) return null;

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const totalPaidSoFar = Number(admission.paidFees || 0) + Number(newPaidAmount || 0);
      await axiosClient.put(`/admissions/${admission._id}`, {
        paidFees: totalPaidSoFar,
        paymentMode,
        paymentReference: paymentRef ? `${admission.paymentReference || ''} | ${paymentRef}` : admission.paymentReference,
        status,
      });
      setIsUpdatingFees(false);
      setNewPaidAmount(0);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">{admission.studentName}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold">
                  {admission.registrationNo}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Official Internship Admission & Fee Record
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status & Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 block uppercase font-semibold">Total Fees</span>
              <span className="text-base font-bold text-slate-800">₹{admission.totalFees?.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[11px] text-emerald-700 block uppercase font-semibold">Fees Paid</span>
              <span className="text-base font-bold text-emerald-700">₹{admission.paidFees?.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-[11px] text-amber-700 block uppercase font-semibold">Pending Due</span>
              <span className="text-base font-bold text-amber-700">₹{admission.remainingFees?.toLocaleString()}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="grid grid-cols-2 p-3 bg-slate-50/50">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-800">{admission.contactNo}</span>
            </div>
            {admission.email && (
              <div className="grid grid-cols-2 p-3">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-800">{admission.email}</span>
              </div>
            )}
            <div className="grid grid-cols-2 p-3 bg-slate-50/50">
              <span className="text-slate-500">College / Institute:</span>
              <span className="font-semibold text-slate-800">{admission.collegeName || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-slate-500">Internship Domain:</span>
              <span className="font-bold text-indigo-700">{admission.domain}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-slate-50/50">
              <span className="text-slate-500">Duration & Batch:</span>
              <span className="font-medium text-slate-800">{admission.duration} | {admission.batchTime}</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-slate-500">Joining Date:</span>
              <span className="font-semibold text-slate-800">
                {new Date(admission.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-slate-50/50">
              <span className="text-slate-500">Payment Mode & Ref:</span>
              <span className="text-slate-800">{admission.paymentMode} {admission.paymentReference ? `(${admission.paymentReference})` : ''}</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-slate-500">Admission Status:</span>
              <span className={`inline-flex font-semibold px-2 py-0.5 rounded text-xs w-max ${
                admission.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {admission.status}
              </span>
            </div>
            {admission.remarks && (
              <div className="p-3 bg-slate-50/50">
                <span className="text-slate-500 block mb-0.5">Remarks:</span>
                <p className="text-slate-700">{admission.remarks}</p>
              </div>
            )}
          </div>

          {/* Collect Payment Drawer */}
          {admission.remainingFees > 0 && (
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
              {!isUpdatingFees ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900">Pending Installment Due: ₹{admission.remainingFees?.toLocaleString()}</h4>
                    <p className="text-[11px] text-indigo-700">Record a new payment installment received from student</p>
                  </div>
                  <button
                    onClick={() => setIsUpdatingFees(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    + Record Payment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdatePayment} className="space-y-3">
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Add Payment Installment</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Amount to Collect (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={admission.remainingFees}
                        value={newPaidAmount}
                        onChange={(e) => setNewPaidAmount(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Transaction Note / Ref
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Second installment UPI ref: 83948..."
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsUpdatingFees(false)}
                      className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !newPaidAmount}
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      {loading ? 'Saving...' : 'Confirm Receipt'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetailsModal;
