import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Trash2,
  GraduationCap,
  IndianRupee
} from 'lucide-react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';
import { downloadSampleAdmissionTemplate } from '../utils/excelUtils';

const ImportAdmissionModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [validRecords, setValidRecords] = useState([]);
  const [invalidRecords, setInvalidRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (fileObj) => {
    setError('');
    setSuccessMsg('');
    setFile(fileObj);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (rawJson.length === 0) {
          setError('The uploaded Excel file appears to be empty.');
          setParsedData([]);
          setValidRecords([]);
          setInvalidRecords([]);
          return;
        }

        const valid = [];
        const invalid = [];

        rawJson.forEach((row, idx) => {
          const studentName = String(
            row['Student Name'] || 
            row['NAME'] || 
            row['Name'] || 
            row['studentName'] || 
            ''
          ).trim();

          const contactNo = String(
            row['Contact Number'] || 
            row['CONTACT NO.'] || 
            row['CONTACT NO'] || 
            row['Contact No'] || 
            row['Phone'] || 
            row['contactNo'] || 
            ''
          ).trim();

          if (studentName && contactNo) {
            const totalFees = Number(row['Total Fees'] || row['totalFees'] || 15000);
            const paidFees = Number(row['Paid Fees'] || row['paidFees'] || 5000);

            valid.push({
              studentName,
              contactNo,
              email: String(row['Email'] || row['Email Address'] || row['email'] || '').trim(),
              collegeName: String(row['College Name'] || row['COLLAGE'] || row['College'] || row['collegeName'] || '').trim(),
              company: String(row['Company'] || row['Company Allotted'] || row['company'] || 'Creative Web Infotech').trim(),
              domain: String(row['Domain'] || row['Internship Domain'] || row['domain'] || 'Full Stack Web Development (MERN)').trim(),
              duration: String(row['Duration'] || row['duration'] || '6 Months (Full Live Project Internship)').trim(),
              batchTime: String(row['Batch Time'] || row['Batch'] || row['batchTime'] || 'Morning (9:00 AM - 1:00 PM)').trim(),
              admissionDate: row['Admission Date'] || row['Date'] || new Date().toISOString().split('T')[0],
              joiningDate: row['Joining Date'] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              totalFees,
              paidFees,
              paymentMode: String(row['Payment Mode'] || row['paymentMode'] || 'UPI / GPay / PhonePe').trim(),
              paymentReference: String(row['Payment Reference'] || row['paymentReference'] || '').trim(),
              status: String(row['Status'] || row['status'] || 'Active').trim(),
              remarks: String(row['Remarks'] || row['remarks'] || '').trim(),
              _rowNum: idx + 2,
            });
          } else {
            invalid.push({
              _rowNum: idx + 2,
              reason: !studentName ? 'Missing Student Name' : 'Missing Contact Number',
              row,
            });
          }
        });

        setParsedData(rawJson);
        setValidRecords(valid);
        setInvalidRecords(invalid);
      } catch (err) {
        console.error('File parsing error:', err);
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
      }
    };

    reader.readAsBinaryString(fileObj);
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setValidRecords([]);
    setInvalidRecords([]);
    setError('');
    setSuccessMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImport = async () => {
    if (validRecords.length === 0) {
      setError('No valid records to import.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.post('/admissions/bulk', { admissions: validRecords });
      if (res.data.success) {
        setSuccessMsg(res.data.message || `${validRecords.length} admissions imported successfully!`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(err.response?.data?.message || 'Failed to import admissions into database');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = validRecords.reduce((acc, curr) => acc + (curr.totalFees || 0), 0);
  const totalCollected = validRecords.reduce((acc, curr) => acc + (curr.paidFees || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Import Admissions from Excel</h2>
              <p className="text-xs text-indigo-200">
                Upload .xlsx or .xls file to bulk register enrolled students & fees
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Sample Template Download Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Need a Sample Template?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download our pre-formatted Admission template with Company, Fees and Batch columns.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadSampleAdmissionTemplate}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample Template</span>
            </button>
          </div>

          {/* Success or Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* File Upload / Drag & Drop Area */}
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag & drop Admission Excel file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports .xlsx and .xls spreadsheets
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length} total rows parsed
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Rows</span>
                  <span className="text-lg font-bold text-slate-800 block mt-0.5">{parsedData.length}</span>
                </div>
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-center">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase">Valid Records</span>
                  <span className="text-lg font-bold text-emerald-700 block mt-0.5">{validRecords.length}</span>
                </div>
                <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-center">
                  <span className="text-[11px] font-semibold text-indigo-700 uppercase">Est. Revenue</span>
                  <span className="text-lg font-bold text-indigo-700 block mt-0.5">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-teal-200 bg-teal-50 text-center">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase">Paid Advance</span>
                  <span className="text-lg font-bold text-teal-700 block mt-0.5">₹{totalCollected.toLocaleString()}</span>
                </div>
              </div>

              {/* Data Preview Table */}
              {validRecords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                    Preview (Showing first {Math.min(5, validRecords.length)} of {validRecords.length} records)
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs overflow-x-auto max-h-48">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2">Row</th>
                          <th className="p-2">Student Name</th>
                          <th className="p-2">Contact</th>
                          <th className="p-2">Company</th>
                          <th className="p-2">Domain</th>
                          <th className="p-2">Total Fees</th>
                          <th className="p-2">Paid Fees</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validRecords.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2 text-slate-400 font-mono">#{row._rowNum}</td>
                            <td className="p-2 font-medium text-slate-900">{row.studentName}</td>
                            <td className="p-2 text-slate-600">{row.contactNo}</td>
                            <td className="p-2 text-indigo-700 font-semibold">{row.company}</td>
                            <td className="p-2 text-slate-600 truncate max-w-[160px]">{row.domain}</td>
                            <td className="p-2 font-medium text-slate-800">₹{row.totalFees?.toLocaleString()}</td>
                            <td className="p-2 font-semibold text-emerald-600">₹{row.paidFees?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || validRecords.length === 0}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-indigo-300 transition-all flex items-center space-x-1.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Importing to MongoDB...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import {validRecords.length > 0 ? `${validRecords.length} Admissions` : 'Admissions'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAdmissionModal;
