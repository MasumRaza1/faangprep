import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa';
  setActiveTab: (tab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen ${
      theme.mode === 'dark' 
        ? 'dark bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    } transition-colors duration-200`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={() => setSidebarOpen(false)} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;