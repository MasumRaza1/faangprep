import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GovtJobPortal from './components/Jobs/GovtJobPortal';
import DSAQuestions from './components/DSA/DSAQuestions';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa'>('overview');
  const location = useLocation();

  // Update active tab based on current route
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('overview');
    else if (path === '/subjects') setActiveTab('subjects');
    else if (path === '/schedule') setActiveTab('schedule');
    else if (path === '/profiles') setActiveTab('profiles');
    else if (path === '/govt-jobs') setActiveTab('jobs');
    else if (path === '/dsa') setActiveTab('dsa');
  }, [location]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Routes>
        <Route path="/" element={<Dashboard activeTab="overview" setActiveTab={setActiveTab} />} />
        <Route path="/subjects" element={<Dashboard activeTab="subjects" setActiveTab={setActiveTab} />} />
        <Route path="/schedule" element={<Dashboard activeTab="schedule" setActiveTab={setActiveTab} />} />
        <Route path="/profiles" element={<Dashboard activeTab="profiles" setActiveTab={setActiveTab} />} />
        <Route path="/dsa" element={<DSAQuestions />} />
        <Route path="/govt-jobs" element={<GovtJobPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;