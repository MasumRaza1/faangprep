import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, Clock, Calendar, Target, Award } from 'lucide-react';

const StudyInsights: React.FC = () => {
  const { state } = useApp();
  const { theme } = useTheme();

  // Calculate statistics
  const calculateStats = () => {
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    let totalStudyDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    state.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        totalSubtopics += topic.subtopics.length;
        completedSubtopics += topic.subtopics.filter(st => st.completed).length;
      });
      if (subject.schedule?.totalDays) {
        totalStudyDays += subject.schedule.totalDays;
      }
    });

    // Calculate completion rate
    const completionRate = totalSubtopics > 0 
      ? Math.round((completedSubtopics / totalSubtopics) * 100) 
      : 0;

    // Calculate average daily workload
    const avgDailySubtopics = totalStudyDays > 0 
      ? Math.round((totalSubtopics / totalStudyDays) * 10) / 10 
      : 0;

    return {
      totalSubtopics,
      completedSubtopics,
      completionRate,
      totalStudyDays,
      avgDailySubtopics,
      currentStreak,
      longestStreak
    };
  };

  const stats = calculateStats();

  const insights = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      description: `${stats.completedSubtopics} of ${stats.totalSubtopics} subtopics`
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Study Period',
      value: `${stats.totalStudyDays} Days`,
      description: 'Total planned study days'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Daily Average',
      value: `${stats.avgDailySubtopics}`,
      description: 'Subtopics per day'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Progress Trend',
      value: stats.completionRate > 50 ? 'On Track' : 'Needs Focus',
      description: `${100 - stats.completionRate}% remaining`
    }
  ];

  return (
    <div className={`rounded-xl ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden p-5`}>
      <h2 className="text-lg font-semibold mb-4">Study Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={insight.label}
            className={`p-4 rounded-lg ${
              theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            } flex flex-col`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`text-blue-500`}>
                {insight.icon}
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {insight.label}
              </span>
            </div>
            <div className="mt-1">
              <div className="text-xl font-semibold">
                {insight.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {insight.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.completionRate < 100 && (
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                  Overall Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
                  {stats.completionRate}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-gray-700">
              <div
                style={{ width: `${stats.completionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyInsights; 