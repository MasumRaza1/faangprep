import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Book, CheckCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';

const SubjectProgress: React.FC = () => {
  const { state } = useApp();
  const { theme } = useTheme();

  const calculateSubjectStats = (subjectId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (!subject) return null;

    let totalSubtopics = 0;
    let completedSubtopics = 0;
    let totalTopics = subject.topics.length;
    let completedTopics = 0;

    subject.topics.forEach(topic => {
      const topicSubtopics = topic.subtopics.length;
      const topicCompletedSubtopics = topic.subtopics.filter(st => st.completed).length;
      
      totalSubtopics += topicSubtopics;
      completedSubtopics += topicCompletedSubtopics;
      
      if (topicCompletedSubtopics === topicSubtopics) {
        completedTopics++;
      }
    });

    const completionRate = totalSubtopics > 0 
      ? Math.round((completedSubtopics / totalSubtopics) * 100) 
      : 0;

    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = subject.schedule?.endDate ? new Date(subject.schedule.endDate) : null;
    const daysRemaining = endDate 
      ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate daily progress needed
    const remainingSubtopics = totalSubtopics - completedSubtopics;
    const dailyTarget = daysRemaining > 0 
      ? Math.ceil(remainingSubtopics / daysRemaining)
      : remainingSubtopics;

    return {
      completionRate,
      completedSubtopics,
      totalSubtopics,
      completedTopics,
      totalTopics,
      daysRemaining,
      dailyTarget
    };
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 75) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (rate >= 50) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    if (rate >= 25) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  };

  const getProgressBarColor = (rate: number) => {
    if (rate >= 75) return 'bg-green-500';
    if (rate >= 50) return 'bg-blue-500';
    if (rate >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`rounded-xl ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden p-5`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Progress by Subject</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">75%+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">50%+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">25%+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">&lt;25%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {state.subjects.map(subject => {
          const stats = calculateSubjectStats(subject.id);
          if (!stats) return null;

          return (
            <div
              key={subject.id}
              className={`p-4 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getProgressColor(stats.completionRate)}`}>
                    <Book className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{subject.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stats.completedTopics} of {stats.totalTopics} topics completed
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(stats.completionRate)}`}>
                  {stats.completionRate}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${getProgressBarColor(stats.completionRate)} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {stats.completedSubtopics}/{stats.totalSubtopics} subtopics
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {stats.daysRemaining} days left
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.dailyTarget > 3 ? (
                      <ArrowUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-gray-600 dark:text-gray-300">
                      {stats.dailyTarget} per day needed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectProgress; 