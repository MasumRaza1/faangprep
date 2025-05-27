import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Home, BookOpen, Calendar, Code2, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ultimateData from '../../data/ultimateData';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  activeTab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa';
  setActiveTab: (tab: 'overview' | 'subjects' | 'schedule' | 'profiles' | 'jobs' | 'dsa') => void;
}

interface DSACategory {
  questionList: Array<{
    questionId: string;
    questionHeading: string;
  }>;
}

interface DSASection {
  categoryList: DSACategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, activeTab, setActiveTab }) => {
  const { state, getCompletionPercentage, getDaysRemaining, getTotalTopics } = useApp();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { total, completed } = getTotalTopics();

  // Calculate DSA progress
  const getDSAProgress = () => {
    const completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));
    let totalQuestions = 0;

    ultimateData.data.content.forEach((section: DSASection) => {
      section.categoryList.forEach((category: DSACategory) => {
        totalQuestions += category.questionList.length;
      });
    });

    return {
      total: totalQuestions,
      completed: completedQuestions.size,
      percentage: totalQuestions > 0 ? Math.round((completedQuestions.size / totalQuestions) * 100) : 0
    };
  };

  // Get DSA days
  const getStudyPlanDays = () => {
    const studyPlan = localStorage.getItem('studyPlan');
    if (!studyPlan) return { totalDays: 0, remainingDays: 0 };

    const plan = JSON.parse(studyPlan);
    const totalDays = plan.numberOfDays || 0;
    const startDate = new Date(plan.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - daysPassed);

    return { totalDays, remainingDays };
  };

  const dsaProgress = getDSAProgress();
  const subjectDays = getDaysRemaining();
  const dsaDays = getStudyPlanDays();

  // Calculate combined progress
  const getCombinedProgress = () => {
    const totalItems = total + dsaProgress.total;
    const completedItems = completed + dsaProgress.completed;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Calculate total and remaining days
  const totalDays = subjectDays.totalDays + dsaDays.totalDays;
  const today = new Date();
  const startDate = new Date(Math.min(
    new Date(JSON.parse(localStorage.getItem('studyPlan') || '{"startDate": ""}').startDate || today).getTime(),
    new Date(state.subjects[0]?.schedule?.startDate || today).getTime()
  ));
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, totalDays - daysPassed);

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
        className={`fixed top-0 left-0 bottom-0 w-72 sm:w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0 overflow-y-auto`}
      >
        <div className="p-4 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold">Study Planner</h1>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition text-sm sm:text-base ${
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
                <span className="ml-3 truncate">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div>
              <h3 className={`text-xs sm:text-sm font-medium ${
                theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mb-2`}>
                Overall Progress
              </h3>
              <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${getCombinedProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm mt-1">{getCombinedProgress()}% Complete</p>
            </div>
            
            <div>
              <h3 className={`text-xs sm:text-sm font-medium ${
                theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mb-2`}>
                Days Remaining
              </h3>
              <p className="text-xl sm:text-2xl font-semibold">{remainingDays}</p>
              <p className="text-xs sm:text-sm text-gray-500">of {totalDays} total days</p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] sm:text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1 flex-shrink-0"></span>
                  <span className="truncate">Subjects: {subjectDays.remainingDays}/{subjectDays.totalDays} days</span>
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 flex-shrink-0"></span>
                  <span className="truncate">DSA: {dsaDays.remainingDays}/{dsaDays.totalDays} days</span>
                </p>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;