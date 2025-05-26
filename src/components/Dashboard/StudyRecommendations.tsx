import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Lightbulb, AlertTriangle, CheckCircle2, ArrowUp } from 'lucide-react';

const StudyRecommendations: React.FC = () => {
  const { state } = useApp();
  const { theme } = useTheme();

  const analyzeStudyPattern = () => {
    const recommendations = [];
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    let overloadedDays = 0;
    let emptyDays = 0;

    // Analyze subject schedules
    state.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        totalSubtopics += topic.subtopics.length;
        completedSubtopics += topic.subtopics.filter(st => st.completed).length;
      });

      if (subject.schedule) {
        const subtopicsPerDay = Math.ceil(totalSubtopics / (subject.schedule.totalDays || 1));
        if (subtopicsPerDay > 5) {
          overloadedDays++;
        }
        if (subtopicsPerDay === 0) {
          emptyDays++;
        }
      }
    });

    // Generate recommendations based on analysis
    if (overloadedDays > 0) {
      recommendations.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'High Daily Workload',
        description: 'Consider extending your study period to reduce daily workload.',
        action: 'Aim for 3-5 subtopics per day for better retention.'
      });
    }

    const completionRate = (completedSubtopics / totalSubtopics) * 100;
    if (completionRate < 30) {
      recommendations.push({
        type: 'alert',
        icon: <ArrowUp className="w-5 h-5" />,
        title: 'Progress Boost Needed',
        description: 'Your completion rate is below target.',
        action: 'Try to complete at least 2-3 subtopics daily to stay on track.'
      });
    }

    if (emptyDays > 0) {
      recommendations.push({
        type: 'info',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Schedule Optimization',
        description: 'Some days have no assigned topics.',
        action: 'Distribute topics evenly across your study period.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        icon: <CheckCircle2 className="w-5 h-5" />,
        title: 'Great Progress!',
        description: 'Your study schedule looks well-balanced.',
        action: 'Keep up the good work and stay consistent.'
      });
    }

    return recommendations;
  };

  const recommendations = analyzeStudyPattern();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'alert':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'success':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`rounded-xl ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden p-5`}>
      <h2 className="text-lg font-semibold mb-4">Study Recommendations</h2>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getTypeStyles(rec.type)} flex items-start space-x-3`}
          >
            <div className="flex-shrink-0">
              {rec.icon}
            </div>
            <div>
              <h3 className="font-medium mb-1">{rec.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {rec.description}
              </p>
              <p className="text-sm font-medium">
                {rec.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyRecommendations; 