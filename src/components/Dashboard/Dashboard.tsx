import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import SubjectList from './SubjectList';
import DailySchedule from './DailySchedule';
import ProgressSummary from './ProgressSummary';
import ScheduleConfig from './ScheduleConfig';
import StreakCalendar from './StreakCalendar';
import CodingProfiles from './CodingProfiles';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { RefreshCw } from 'lucide-react';

interface DashboardProps {
  activeTab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa';
  setActiveTab: (tab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useApp();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add refresh handler
  const handleRefresh = () => {
    if (window.confirm('This will reset all data to default. Are you sure you want to continue?')) {
      localStorage.clear();
      // Force a hard reload to ensure all state is properly reset
      window.location.href = window.location.href;
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa') => {
    setActiveTab(tab);
    const path = tab === 'overview' ? '/' : `/${tab}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'subjects' && 'Subjects'}
              {activeTab === 'schedule' && 'Schedule'}
              {activeTab === 'profiles' && 'Coding Profiles'}
            </h1>
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme.mode === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
              title="Reset all data to default"
            >
              <RefreshCw size={18} />
              <span>Reset Data</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'subjects'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => handleTabChange('subjects')}
            >
              Subjects
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => handleTabChange('schedule')}
            >
              Schedule
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => handleTabChange('profiles')}
            >
              Coding Profiles
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Mobile Layout */}
              <div className="block lg:hidden space-y-6">
                <ProgressSummary />
                <StreakCalendar />
                <DailySchedule />
                <ScheduleConfig />
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ProgressSummary />
                  <ScheduleConfig />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <StreakCalendar />
                  <DailySchedule />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div>
              <SubjectList />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <ScheduleConfig showFullCalendar />
            </div>
          )}

          {activeTab === 'profiles' && (
            <div>
              <CodingProfiles />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;