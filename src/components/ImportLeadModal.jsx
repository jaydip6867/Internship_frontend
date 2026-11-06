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
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';
import { downloadSampleLeadTemplate } from '../utils/excelUtils';

const cleanPhoneNumber = (val) => {
  if (!val) return '';
  let str = String(val).trim().replace(/\.0+$/, '').replace(/[^0-9]/g, '');
  if (str.length === 12 && str.startsWith('91')) {
    str = str.slice(2);
  } else if (str.length === 11 && str.startsWith('0')) {
    str = str.slice(1);
  }
  return str;
};

const ImportLeadModal = ({ isOpen, onClose, onSuccess }) => {
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
          setError('The uploaded file appears to be empty.');
          setParsedData([]);
          setValidRecords([]);
          setInvalidRecords([]);
          return;
        }

        const valid = [];
        const invalid = [];

        rawJson.forEach((row, idx) => {
          const rawContact = row['Mobile / WhatsApp Number'] ||
            row['Mobile Number'] ||
            row['WhatsApp Number'] ||
            row['Contact Number'] ||
            row['Contact No'] ||
            row['phone'] ||
            row['Mobile'] ||
            row['contactNo'] ||
            '';

          const phone = cleanPhoneNumber(rawContact);
          const studentName = String(
            row['Student Full Name'] ||
            row['Student Name'] ||
            row['Name'] ||
            row['studentName'] ||
            ''
          ).trim();

          // Validation: student must have a name or valid phone
          if (!studentName && !phone) {
            invalid.push({ rowNumber: idx + 2, reason: 'Missing student name & contact number', row });
            return;
          }

          valid.push({
            studentName: studentName || `Student - ${phone.slice(-4)}`,
            contactNo: phone || '9999999999',
            email: String(row['Email Address'] || row['Email'] || row['email'] || '').trim().toLowerCase(),
            collegeName: String(row['College / University Name'] || row['College Name'] || row['College'] || row['collegeName'] || '').trim(),
            degree: String(row['Current Course'] || row['Course'] || row['Degree'] || row['degree'] || 'BCA').trim(),
            semester: String(row['Current Academic Year'] || row['Academic Year'] || row['Semester'] || row['semester'] || '3rd Year').trim(),
            interestedDomain: String(row['Preferred Internship Domain'] || row['Domain'] || row['interestedDomain'] || 'Full Stack Web Development').trim(),
            internshipType: String(row['Internship Program Preference'] || row['Program Preference'] || row['Option'] || row['internshipType'] || 'free (interview crack mandatory.)').trim(),
            internshipMode: String(row['Preferred Internship Mode'] || row['Mode'] || row['internshipMode'] || 'Offline (Surat)').trim(),
            notes: String(row['Any Questions? (Optional)'] || row['Questions'] || row['Notes'] || row['notes'] || '').trim(),
            city: 'Surat',
          });
        });

        setParsedData(rawJson);
        setValidRecords(valid);
        setInvalidRecords(invalid);
      } catch (err) {
        console.error('File parsing error:', err);
        setError('Failed to read spreadsheet file. Please upload a valid .xlsx or .csv file.');
      }
    };

    reader.readAsBinaryString(fileObj);
  };

  const handleUploadSubmit = async () => {
    if (validRecords.length === 0) {
      setError('No valid lead rows to import.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await axiosClient.post('/leads/bulk', {
        leads: validRecords,
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message || `Successfully imported ${res.data.count} leads!`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Import lead error:', err);
      setError(err.response?.data?.message || 'Server error while importing leads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Import Google Sheet / Excel Leads</h2>
              <p className="text-xs text-purple-200">
                Upload Google Sheet download or Excel to add leads ONLY to New Leads page
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Note Banner: Guarantees records appear ONLY in New Leads */}
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span className="font-semibold">
                Guaranteed: All imported records will be added <strong>ONLY to the New Leads page</strong> (never directly to Inquiries or Admissions).
              </span>
            </div>
            <button
              onClick={downloadSampleLeadTemplate}
              className="inline-flex items-center space-x-1 font-bold text-indigo-700 hover:underline shrink-0 ml-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </button>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              file 
                ? 'border-indigo-500 bg-indigo-50/20' 
                : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Choose Google Sheet (Excel or CSV) or drag and drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports .xlsx, .xls, and .csv files downloaded from Google Sheet
            </p>
          </div>

          {/* Parsed Summary Preview */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Total Rows</span>
                  <span className="text-lg font-bold text-slate-900">{parsedData.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-700 block">Valid Leads Ready</span>
                  <span className="text-lg font-bold text-emerald-800">{validRecords.length}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-xs text-amber-700 block">Skipped / Invalid</span>
                  <span className="text-lg font-bold text-amber-800">{invalidRecords.length}</span>
                </div>
              </div>

              {/* Sample Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                  Preview Leads to be Imported ({Math.min(5, validRecords.length)} of {validRecords.length})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Student Name</th>
                        <th className="px-3 py-2">Contact</th>
                        <th className="px-3 py-2">Course / Degree</th>
                        <th className="px-3 py-2">Preferred Domain</th>
                        <th className="px-3 py-2">Option</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {validRecords.slice(0, 5).map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-slate-400">{i + 1}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{rec.studentName}</td>
                          <td className="px-3 py-2 font-mono text-slate-700">{rec.contactNo}</td>
                          <td className="px-3 py-2 text-slate-600">{rec.degree}</td>
                          <td className="px-3 py-2 text-indigo-700 font-medium">{rec.interestedDomain}</td>
                          <td className="px-3 py-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              {rec.internshipType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              setFile(null);
              setParsedData([]);
              setValidRecords([]);
              setInvalidRecords([]);
              setError('');
            }}
            disabled={!file || loading}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40"
          >
            Clear File
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={validRecords.length === 0 || loading}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import {validRecords.length} Leads</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLeadModal;
