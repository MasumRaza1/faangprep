import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, Clock, Calendar, Target, Award, Code } from 'lucide-react';
import ultimateData from '../../data/ultimateData';

const StudyInsights: React.FC = () => {
  const { state } = useApp();
  const { theme } = useTheme();

  // Calculate statistics including DSA
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

    // Calculate subject stats
    state.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        totalSubtopics += topic.subtopics.length;
        completedSubtopics += topic.subtopics.filter(st => st.completed).length;
      });
      if (subject.schedule?.totalDays) {
        totalStudyDays += subject.schedule.totalDays;
      }
    });

    // Calculate DSA stats
    const studyPlan = localStorage.getItem('studyPlan');
    const completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));
    
    let totalDSAQuestions = 0;
    let completedDSAQuestions = completedQuestions.size;
    let dsaStudyDays = 0;

    if (studyPlan) {
      const plan = JSON.parse(studyPlan);
      dsaStudyDays = plan.numberOfDays || 0;

      // Count total DSA questions
      ultimateData.data.content.forEach(section => {
        section.categoryList.forEach(category => {
          totalDSAQuestions += category.questionList.length;
        });
      });
    }

    // Calculate combined completion rate
    const totalItems = totalSubtopics + totalDSAQuestions;
    const completedItems = completedSubtopics + completedDSAQuestions;
    const completionRate = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;

    // Calculate combined daily workload
    const totalDays = Math.max(totalStudyDays, dsaStudyDays);
    const avgDailyItems = totalDays > 0 
      ? Math.round(((totalItems) / totalDays) * 10) / 10 
      : 0;

    return {
      totalSubtopics,
      completedSubtopics,
      totalDSAQuestions,
      completedDSAQuestions,
      completionRate,
      totalStudyDays: totalDays,
      avgDailyItems,
      currentStreak,
      longestStreak
    };
  };

  const stats = calculateStats();

  const insights = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Overall Progress',
      value: `${stats.completionRate}%`,
      description: `${stats.completedSubtopics + stats.completedDSAQuestions} of ${stats.totalSubtopics + stats.totalDSAQuestions} items`
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Study Period',
      value: `${stats.totalStudyDays} Days`,
      description: 'Total planned study days'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Daily Target',
      value: `${stats.avgDailyItems}`,
      description: 'Items per day'
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: 'DSA Progress',
      value: `${Math.round((stats.completedDSAQuestions / stats.totalDSAQuestions) * 100)}%`,
      description: `${stats.completedDSAQuestions} of ${stats.totalDSAQuestions} questions`
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