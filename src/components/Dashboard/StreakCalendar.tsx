import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, CheckCircle, Code } from 'lucide-react';
import ultimateData from '../../data/ultimateData';

interface DSAQuestion {
  questionId: string;
  questionHeading: string;
  completed: boolean;
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

const StreakCalendar: React.FC = () => {
  const { state, getTopicsForDate } = useApp();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(getIndianTime(new Date()));
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Convert to Indian timezone and normalize to start of day
  function getIndianTime(date: Date): Date {
    // Create a date string in Indian timezone
    const indianDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    // Reset time to start of day
    indianDate.setHours(0, 0, 0, 0);
    return indianDate;
  }

  // Get normalized date string in Indian timezone
  function getIndianDateString(date: Date): string {
    const indianDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `${indianDate.getFullYear()}-${String(indianDate.getMonth() + 1).padStart(2, '0')}-${String(indianDate.getDate()).padStart(2, '0')}`;
  }

  // Listen for changes in localStorage and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'completedQuestions' || e.key === 'studyPlan') {
        setUpdateTrigger(prev => prev + 1);
      }
    };

    const handleDSAStatusUpdate = () => {
      setUpdateTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dsaStatusUpdate', handleDSAStatusUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dsaStatusUpdate', handleDSAStatusUpdate);
    };
  }, []);

  // Force re-render when updateTrigger changes
  useEffect(() => {
    setCurrentMonth(new Date(currentMonth));
  }, [updateTrigger]);

  const getDaysInMonth = (date: Date) => {
    const indianDate = getIndianTime(date);
    return new Date(indianDate.getFullYear(), indianDate.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const indianDate = getIndianTime(date);
    return new Date(indianDate.getFullYear(), indianDate.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    const indian1 = getIndianTime(date1);
    const indian2 = getIndianTime(date2);
    return indian1.getDate() === indian2.getDate() &&
           indian1.getMonth() === indian2.getMonth() &&
           indian1.getFullYear() === indian2.getFullYear();
  };

  const isDateInFuture = (date: Date) => {
    const today = getIndianTime(new Date());
    const checkDate = getIndianTime(date);
    return checkDate > today;
  };

  // Get DSA questions for a specific date
  const getDSAQuestionsForDate = (date: Date) => {
    const dateStr = getIndianDateString(date);
    const studyPlan = localStorage.getItem('studyPlan');
    if (!studyPlan) return [];

    const plan = JSON.parse(studyPlan);
    const questionIds = plan.questionAssignments[dateStr] || [];
    const completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));

    const questions = questionIds.map((id: string) => {
      let found: DSAQuestion | null = null;
      ultimateData.data.content.forEach((section: DSASection) => {
        section.categoryList.forEach((category: DSACategory) => {
          category.questionList.forEach((question) => {
            if (question.questionId === id) {
              found = {
                ...question,
                completed: completedQuestions.has(id)
              };
            }
          });
        });
      });
      return found;
    }).filter((q: DSAQuestion | null): q is DSAQuestion => q !== null);

    return questions;
  };

  const getDateStatus = (date: Date) => {
    if (isDateInFuture(date)) {
      return {
        type: 'future',
        subjectsCompleted: false,
        dsaCompleted: false,
        hasSubjects: false,
        hasDSA: false
      };
    }

    const topicsForDate = getTopicsForDate(date);
    const dsaQuestions = getDSAQuestionsForDate(date);

    const hasSubjects = topicsForDate.length > 0;
    const hasDSA = dsaQuestions.length > 0;

    if (!hasSubjects && !hasDSA) {
      return {
        type: 'no-tasks',
        subjectsCompleted: false,
        dsaCompleted: false,
        hasSubjects: false,
        hasDSA: false
      };
    }

    const allTopicsCompleted = hasSubjects && topicsForDate.every(({ subtopics }) => 
      subtopics.every(subtopic => subtopic.completed)
    );

    const allDSACompleted = hasDSA && 
      dsaQuestions.every((question: DSAQuestion) => question.completed);

    return {
      type: 'has-tasks',
      subjectsCompleted: allTopicsCompleted,
      dsaCompleted: allDSACompleted,
      hasSubjects,
      hasDSA
    };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = getIndianTime(new Date());

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const indianDate = getIndianTime(date);
      const isToday = isSameDay(indianDate, today);
      const status = getDateStatus(indianDate);

      days.push(
        <div
          key={day}
          className={`h-10 w-full rounded-lg flex flex-col items-center justify-center relative ${
            isToday
              ? 'ring-2 ring-blue-500'
              : ''
          } ${
            status.type === 'future'
              ? 'opacity-50'
              : ''
          }`}
        >
          <span className={isToday ? 'font-bold' : ''}>{day}</span>
          {(status.hasSubjects || status.hasDSA) && (
            <div className="mt-1 flex items-center gap-1">
              {status.hasSubjects && (
                status.subjectsCompleted ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )
              )}
              {status.hasDSA && (
                status.dsaCompleted ? (
                  <Code className="w-3 h-3 text-green-500" />
                ) : (
                  <Code className="w-3 h-3 text-red-500" />
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`rounded-lg ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Study Streak</h3>
        <div className="flex items-center">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className={`p-1 rounded-full ${
              theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="mx-2">
            {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className={`p-1 rounded-full ${
              theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <span className="text-xs font-medium">Subject</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-green-500" />
            <Code className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-xs font-medium">DSA</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar; 