import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inquiries from './pages/Inquiries';
import Admissions from './pages/Admissions';
import TodayFollowups from './pages/TodayFollowups';
import NewLeads from './pages/NewLeads';
import PublicLeadForm from './pages/PublicLeadForm';

import InquiryModal from './components/InquiryModal';
import FollowupModal from './components/FollowupModal';
import ConvertAdmissionModal from './components/ConvertAdmissionModal';
import InquiryDetailsModal from './components/InquiryDetailsModal';
import AdmissionDetailsModal from './components/AdmissionDetailsModal';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // Modals state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryToEdit, setInquiryToEdit] = useState(null);

  const [followupModalOpen, setFollowupModalOpen] = useState(false);
  const [inquiryForFollowup, setInquiryForFollowup] = useState(null);

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [inquiryForConvert, setInquiryForConvert] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [inquiryForDetails, setInquiryForDetails] = useState(null);

  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [admissionForDetails, setAdmissionForDetails] = useState(null);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Initializing portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Action Triggers
  const openAddInquiry = () => {
    setInquiryToEdit(null);
    setInquiryModalOpen(true);
  };

  const openEditInquiry = (inquiry) => {
    setInquiryToEdit(inquiry);
    setInquiryModalOpen(true);
  };

  const openFollowup = (inquiry) => {
    setInquiryForFollowup(inquiry);
    setFollowupModalOpen(true);
  };

  const openConvert = (inquiry) => {
    setInquiryForConvert(inquiry);
    setConvertModalOpen(true);
  };

  const openInquiryDetails = (inquiry) => {
    setInquiryForDetails(inquiry);
    setDetailsModalOpen(true);
  };

  const openAdmissionDetails = (admission) => {
    setAdmissionForDetails(admission);
    setAdmissionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans antialiased text-slate-800 flex flex-col">
      {/* Top Header Navigation */}
      <Navbar onOpenAddInquiry={openAddInquiry} />

      {/* Main Content Area */}
      <main className="flex-1 w-full py-6 px-4 sm:px-8 xl:px-[80px]">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  key={`dash-${refreshKey}`}
                  onOpenAddInquiry={openAddInquiry}
                  onOpenInquiryDetails={openInquiryDetails}
                  onOpenFollowup={openFollowup}
                  onOpenConvert={openConvert}
                />
              }
            />
            <Route
              path="/new-leads"
              element={
                <NewLeads
                  key={`leads-${refreshKey}`}
                  onOpenDetails={openInquiryDetails}
                  onOpenFollowup={openFollowup}
                  onOpenConvert={openConvert}
                  onOpenEditInquiry={openEditInquiry}
                />
              }
            />
            <Route
              path="/today-followups"
              element={
                <TodayFollowups
                  key={`today-${refreshKey}`}
                  onOpenFollowup={openFollowup}
                  onOpenConvert={openConvert}
                  onOpenDetails={openInquiryDetails}
                  onOpenEditInquiry={openEditInquiry}
                />
              }
            />
            <Route
              path="/inquiries"
              element={
                <Inquiries
                  key={`inq-${refreshKey}`}
                  onOpenAddInquiry={openAddInquiry}
                  onOpenEditInquiry={openEditInquiry}
                  onOpenFollowup={openFollowup}
                  onOpenConvert={openConvert}
                  onOpenDetails={openInquiryDetails}
                />
              }
            />
            <Route
              path="/admissions"
              element={
                <Admissions
                  key={`adm-${refreshKey}`}
                  onOpenAdmissionDetails={openAdmissionDetails}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      {/* Global Modals */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        inquiryToEdit={inquiryToEdit}
        onSuccess={handleDataChange}
      />

      <FollowupModal
        isOpen={followupModalOpen}
        onClose={() => setFollowupModalOpen(false)}
        inquiry={inquiryForFollowup}
        onSuccess={handleDataChange}
      />

      <ConvertAdmissionModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        inquiry={inquiryForConvert}
        onSuccess={handleDataChange}
      />

      <InquiryDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        inquiry={inquiryForDetails}
        onOpenFollowup={openFollowup}
        onOpenConvert={openConvert}
        onOpenEdit={openEditInquiry}
      />

      <AdmissionDetailsModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        admission={admissionForDetails}
        onSuccess={handleDataChange}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<PublicLeadForm />} />
          <Route path="/lead-form" element={<PublicLeadForm />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
