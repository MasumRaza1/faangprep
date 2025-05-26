import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle as CircleCheck, CircleDashed, ListChecks, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProgressSummary: React.FC = () => {
  const { 
    state, 
    getCompletionPercentage, 
    getDaysRemaining,
    getTotalTopics
  } = useApp();
  const { theme } = useTheme();
  const { total, completed } = getTotalTopics();

  const stats = [
    {
      title: 'Overall Progress',
      value: `${getCompletionPercentage()}%`,
      icon: <CircleDashed size={28} className="text-blue-500" />,
      description: `${completed}/${total} topics completed`,
    },
    {
      title: 'Days Remaining',
      value: getDaysRemaining().remainingDays,
      icon: <Calendar size={28} className="text-purple-500" />,
      description: `${getDaysRemaining().remainingDays}/${getDaysRemaining().totalDays} days`,
    },
    {
      title: 'Subjects Tracked',
      value: state.subjects.length,
      icon: <ListChecks size={28} className="text-green-500" />,
      description: 'Learning areas',
    },
    {
      title: 'Completion Status',
      value: getCompletionPercentage() === 100 ? 'Complete' : 'In Progress',
      icon: <CircleCheck size={28} className={getCompletionPercentage() === 100 ? "text-green-500" : "text-amber-500"} />,
      description: getCompletionPercentage() === 100 ? 'Well done!' : 'Keep going!',
    },
  ];

  return (
    <div className={`rounded-lg ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden mb-6`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Progress Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              theme.mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${
                  theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{stat.title}</p>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs mt-1 ${
                theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`px-6 py-4 ${
        theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Progress by Subject</h3>
        </div>
        <div className="space-y-3">
          {state.subjects.map((subject) => (
            <div key={subject.id}>
              <div className="flex justify-between text-xs mb-1">
                <span>{subject.title}</span>
                <span>{getCompletionPercentage(subject.id)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${getCompletionPercentage(subject.id)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;