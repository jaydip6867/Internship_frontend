import * as XLSX from 'xlsx';

// Helper to format date safely
const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toISOString().split('T')[0];
};

// 1. Export Inquiries to Excel
export const exportInquiriesToExcel = (inquiries, fileName = 'Inquiries_Export') => {
  const data = inquiries.map((inq, index) => {
    const latestFollowup = inq.followups && inq.followups.length > 0 ? inq.followups[0] : null;

    return {
      '#': index + 1,
      'Inquiry Date': formatDate(inq.inquiryDate || inq.createdAt),
      'Student Name': inq.studentName || '',
      'Contact Number': inq.contactNo || '',
      'Alternate Contact': inq.alternateContactNo || '',
      'Email Address': inq.email || '',
      'College Name': inq.collegeName || '',
      'Degree': inq.degree || '',
      'Semester': inq.semester || '',
      'Interested Domain': inq.interestedDomain || '',
      'Taken By': inq.takenBy || 'Haresh Sir',
      'Status': inq.status || 'New',
      'Reference / Source': inq.reference || '',
      'Reference Details': inq.referenceDetails || '',
      'Counselor Notes': inq.notes || '',
      'Follow-ups Count': inq.followups ? inq.followups.length : 0,
      'Latest Follow-up Date': latestFollowup ? formatDate(latestFollowup.date) : '',
      'Latest Follow-up Status': latestFollowup ? latestFollowup.status : '',
      'Latest Follow-up Remarks': latestFollowup ? latestFollowup.remarks : '',
      'Latest Follow-up Taken By': latestFollowup ? latestFollowup.recordedBy : '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set nice column widths
  worksheet['!cols'] = [
    { wch: 5 },  // #
    { wch: 14 }, // Date
    { wch: 22 }, // Name
    { wch: 15 }, // Contact
    { wch: 16 }, // Alt Contact
    { wch: 24 }, // Email
    { wch: 22 }, // College
    { wch: 20 }, // Degree
    { wch: 14 }, // Semester
    { wch: 30 }, // Domain
    { wch: 14 }, // Taken By
    { wch: 22 }, // Status
    { wch: 20 }, // Reference
    { wch: 20 }, // Ref details
    { wch: 30 }, // Notes
    { wch: 16 }, // Follow-ups count
    { wch: 18 }, // Latest date
    { wch: 20 }, // Latest status
    { wch: 35 }, // Latest remarks
    { wch: 16 }, // Latest by
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${fileName}_${todayStr}.xlsx`);
};

// 2. Export Admissions to Excel
export const exportAdmissionsToExcel = (admissions, fileName = 'Admissions_Export') => {
  const data = admissions.map((adm, index) => {
    return {
      '#': index + 1,
      'Registration No': adm.registrationNo || '',
      'Admission Date': formatDate(adm.admissionDate || adm.createdAt),
      'Joining Date': formatDate(adm.joiningDate),
      'Student Name': adm.studentName || '',
      'Contact Number': adm.contactNo || '',
      'Email Address': adm.email || '',
      'College Name': adm.collegeName || '',
      'Company Allotted': adm.company || 'Creative Web Infotech',
      'Internship Domain': adm.domain || '',
      'Duration': adm.duration || '6 Months',
      'Batch Time': adm.batchTime || 'Morning',
      'Total Fees (₹)': adm.totalFees || 0,
      'Paid Fees (₹)': adm.paidFees || 0,
      'Remaining Fees (₹)': adm.remainingFees || 0,
      'Payment Mode': adm.paymentMode || 'UPI / GPay / PhonePe',
      'Payment Reference': adm.paymentReference || '',
      'Status': adm.status || 'Active',
      'Remarks': adm.remarks || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 5 },  // #
    { wch: 18 }, // Reg No
    { wch: 14 }, // Adm Date
    { wch: 14 }, // Join Date
    { wch: 22 }, // Name
    { wch: 15 }, // Contact
    { wch: 24 }, // Email
    { wch: 22 }, // College
    { wch: 24 }, // Company
    { wch: 30 }, // Domain
    { wch: 18 }, // Duration
    { wch: 22 }, // Batch
    { wch: 14 }, // Total Fees
    { wch: 14 }, // Paid Fees
    { wch: 16 }, // Remaining Fees
    { wch: 22 }, // Payment Mode
    { wch: 20 }, // Payment Ref
    { wch: 12 }, // Status
    { wch: 30 }, // Remarks
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Admissions');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${fileName}_${todayStr}.xlsx`);
};

// 3. Download Sample Inquiry Import Template
export const downloadSampleInquiryTemplate = () => {
  const sampleData = [
    {
      'Student Name': 'Rahul Patel',
      'Contact Number': '9876543210',
      'Alternate Contact': '9123456780',
      'Email': 'rahul.patel@gmail.com',
      'College Name': 'SCET College Surat',
      'Degree': 'B.Tech / BE (Computer / IT)',
      'Semester': '6th Semester',
      'Interested Domain': 'Full Stack Web Development (MERN)',
      'Taken By': 'Haresh Sir',
      'Status': 'New',
      'Reference': 'Walk-in / Direct Visit',
      'Reference Details': 'Walk-in inquiry with parents',
      'Counselor Notes': 'Interested in 6 months live project internship',
      'Follow-up Remarks': 'Called student, invited for campus visit tomorrow',
      'Date': '2026-11-05',
    },
    {
      'Student Name': 'Priya Shah',
      'Contact Number': '9825123456',
      'Alternate Contact': '',
      'Email': 'priya.shah@gmail.com',
      'College Name': 'BVM Engineering',
      'Degree': 'BCA',
      'Semester': '4th Semester',
      'Interested Domain': 'UI/UX Design & Frontend',
      'Taken By': 'Jaydip Sir',
      'Status': 'Interested',
      'Reference': 'Instagram / Facebook Ad',
      'Reference Details': 'Saw social media post',
      'Counselor Notes': 'Prefers morning batch from 9 AM to 1 PM',
      'Follow-up Remarks': 'Shared brochure on WhatsApp, will decide by weekend',
      'Date': '2026-11-05',
    },
    {
      'Student Name': 'Utsav Prajapati',
      'Contact Number': '9909988776',
      'Alternate Contact': '',
      'Email': 'utsav.prajapati@gmail.com',
      'College Name': 'SASCMA',
      'Degree': 'Diploma IT / Computer',
      'Semester': '5th Semester',
      'Interested Domain': 'Flutter & Android App Dev',
      'Taken By': 'Mishal Sir',
      'Status': 'Follow-up',
      'Reference': 'Friend / Senior Referral',
      'Reference Details': 'Referred by senior Amit',
      'Counselor Notes': 'Looking for immediate live project joining',
      'Follow-up Remarks': 'Interested, wants to join next Monday',
      'Date': '2026-11-05',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  worksheet['!cols'] = [
    { wch: 20 }, // Student Name
    { wch: 16 }, // Contact Number
    { wch: 18 }, // Alternate Contact
    { wch: 26 }, // Email
    { wch: 22 }, // College Name
    { wch: 22 }, // Degree
    { wch: 14 }, // Semester
    { wch: 32 }, // Interested Domain
    { wch: 14 }, // Taken By
    { wch: 14 }, // Status
    { wch: 22 }, // Reference
    { wch: 26 }, // Reference Details
    { wch: 34 }, // Counselor Notes
    { wch: 36 }, // Follow-up Remarks
    { wch: 14 }, // Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample_Inquiries');
  XLSX.writeFile(workbook, 'Sample_Inquiry_Upload_Template.xlsx');
};

// 4. Download Sample Admission Import Template
export const downloadSampleAdmissionTemplate = () => {
  const sampleData = [
    {
      'Student Name': 'Janvi Mevada',
      'Contact Number': '9879879870',
      'Email': 'janvi.m@gmail.com',
      'College Name': 'TMTBCA',
      'Company': 'Creative Web Infotech',
      'Domain': 'UI/UX Design & Frontend',
      'Duration': '6 Months (Full Live Project Internship)',
      'Batch Time': 'Morning (9:00 AM - 1:00 PM)',
      'Admission Date': '2026-11-05',
      'Joining Date': '2026-11-12',
      'Total Fees': 15000,
      'Paid Fees': 5000,
      'Payment Mode': 'UPI / GPay / PhonePe',
      'Payment Reference': 'UPI/293810293',
      'Status': 'Active',
      'Remarks': 'Registration fee paid via GPay',
    },
    {
      'Student Name': 'Meet Patel',
      'Contact Number': '9723456789',
      'Email': 'meet.patel@gmail.com',
      'College Name': 'SCET Surat',
      'Company': 'Granthi It Solution',
      'Domain': 'Full Stack Web Development (MERN)',
      'Duration': '6 Months (Full Live Project Internship)',
      'Batch Time': 'Afternoon (2:00 PM - 6:00 PM)',
      'Admission Date': '2026-11-05',
      'Joining Date': '2026-11-10',
      'Total Fees': 18000,
      'Paid Fees': 18000,
      'Payment Mode': 'Bank Transfer (NEFT/IMPS)',
      'Payment Reference': 'NEFT-88392019',
      'Status': 'Active',
      'Remarks': 'Full one-time payment completed',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  worksheet['!cols'] = [
    { wch: 20 }, // Student Name
    { wch: 16 }, // Contact Number
    { wch: 24 }, // Email
    { wch: 20 }, // College Name
    { wch: 24 }, // Company
    { wch: 32 }, // Domain
    { wch: 26 }, // Duration
    { wch: 24 }, // Batch Time
    { wch: 14 }, // Admission Date
    { wch: 14 }, // Joining Date
    { wch: 12 }, // Total Fees
    { wch: 12 }, // Paid Fees
    { wch: 22 }, // Payment Mode
    { wch: 20 }, // Payment Ref
    { wch: 12 }, // Status
    { wch: 28 }, // Remarks
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample_Admissions');
  XLSX.writeFile(workbook, 'Sample_Admission_Upload_Template.xlsx');
};
