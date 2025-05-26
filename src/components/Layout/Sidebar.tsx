import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Home, BookOpen, Calendar, Code2, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  activeTab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa';
  setActiveTab: (tab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, activeTab, setActiveTab }) => {
  const { getCompletionPercentage, getDaysRemaining } = useApp();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: <Home size={20} className="flex-shrink-0" />,
      path: '/'
    },
    {
      id: 'subjects' as const,
      label: 'Subjects',
      icon: <BookOpen size={20} className="flex-shrink-0" />,
      path: '/subjects'
    },
    {
      id: 'schedule' as const,
      label: 'Schedule',
      icon: <Calendar size={20} className="flex-shrink-0" />,
      path: '/schedule'
    },
    {
      id: 'profiles' as const,
      label: 'Coding Profiles',
      icon: <Code2 size={20} className="flex-shrink-0" />,
      path: '/profiles'
    },
    {
      id: 'dsa' as const,
      label: 'DSA Questions',
      icon: <Code2 size={20} className="flex-shrink-0" />,
      path: '/dsa'
    },
    // {
    //   id: 'jobs' as const,
    //   label: 'Government Jobs',
    //   icon: <Briefcase size={20} className="flex-shrink-0" />,
    //   path: '/govt-jobs'
    // }
  ];

  // Update active tab based on current route
  React.useEffect(() => {
    const path = location.pathname;
    const matchingItem = navItems.find(item => item.path === path);
    if (matchingItem) {
      setActiveTab(matchingItem.id);
    }
  }, [location.pathname, setActiveTab]);

  const handleNavigation = (tabId: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa', path: string) => {
    setActiveTab(tabId);
    navigate(path);
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold">Study Planner</h1>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeTab === item.id 
                    ? theme.mode === 'dark'
                      ? 'bg-gray-700 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : theme.mode === 'dark'
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation(item.id, item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className={`text-sm font-medium ${
                theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mb-2`}>
                Overall Progress
              </h3>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{getCompletionPercentage()}% Complete</p>
            </div>
            
            <div>
              <h3 className={`text-sm font-medium ${
                theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mb-2`}>
                Days Remaining
              </h3>
              <p className="text-2xl font-semibold">{getDaysRemaining().remainingDays}</p>
              <p className="text-sm text-gray-500">of {getDaysRemaining().totalDays} total days</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;