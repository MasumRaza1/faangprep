import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle as CircleCheck, CircleDashed, ListChecks, Calendar, Code } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ultimateData from '../../data/ultimateData';

interface DSACategory {
  questionList: Array<{
    questionId: string;
    questionHeading: string;
  }>;
}

interface DSASection {
  categoryList: DSACategory[];
}

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  extraInfo?: React.ReactNode;
}

const ProgressSummary: React.FC = () => {
  const { 
    state, 
    getCompletionPercentage, 
    getDaysRemaining,
    getTotalTopics
  } = useApp();
  const { theme } = useTheme();
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

  const dsaProgress = getDSAProgress();

  // Get study plan days
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

  // Calculate combined progress
  const getCombinedProgress = () => {
    const totalItems = total + dsaProgress.total;
    const completedItems = completed + dsaProgress.completed;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const subjectDays = getDaysRemaining();
  const dsaDays = getStudyPlanDays();

  // Calculate total and remaining days
  const totalDays = Math.max(subjectDays.totalDays, dsaDays.totalDays);
  const today = new Date();
  const startDate = new Date(Math.min(
    new Date(JSON.parse(localStorage.getItem('studyPlan') || '{"startDate": ""}').startDate || today).getTime(),
    new Date(state.subjects[0]?.schedule?.startDate || today).getTime()
  ));
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, totalDays - daysPassed);

  const stats: StatItem[] = [
    {
      title: 'Overall Progress',
      value: `${getCombinedProgress()}%`,
      icon: <CircleDashed size={28} className="text-blue-500" />,
      description: `${completed + dsaProgress.completed}/${total + dsaProgress.total} items completed`,
    },
    {
      title: 'Days Remaining',
      value: remainingDays,
      icon: <Calendar size={28} className="text-purple-500" />,
      description: `${remainingDays}/${totalDays} days total`,
      extraInfo: (
        <div className="flex justify-between text-[10px] mb-1 text-gray-500 dark:text-gray-400">
          <div>
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Subjects: {subjectDays.remainingDays}/{subjectDays.totalDays} days
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            DSA: {dsaDays.remainingDays}/{dsaDays.totalDays} days
          </div>
        </div>
      )
    },
    {
      title: 'DSA Progress',
      value: `${dsaProgress.percentage}%`,
      icon: <Code size={28} className="text-green-500" />,
      description: `${dsaProgress.completed}/${dsaProgress.total} questions`,
    },
    {
      title: 'Completion Status',
      value: getCombinedProgress() === 100 ? 'Complete' : 'In Progress',
      icon: <CircleCheck size={28} className={getCombinedProgress() === 100 ? "text-green-500" : "text-amber-500"} />,
      description: getCombinedProgress() === 100 ? 'Well done!' : 'Keep going!',
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
              {stat.extraInfo}
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
          {/* DSA Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>DSA Questions</span>
              <span>{dsaProgress.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
              <div 
                className="h-full rounded-full bg-green-500"
                style={{ width: `${dsaProgress.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Subject Progress Bars */}
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