import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const StreakCalendar: React.FC = () => {
  const { state, getTopicsForDate } = useApp();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateInFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const getDateStatus = (date: Date) => {
    if (isDateInFuture(date)) {
      return 'future';
    }

    const topicsForDate = getTopicsForDate(date);
    if (topicsForDate.length === 0) {
      return 'no-tasks';
    }

    const allCompleted = topicsForDate.every(({ subtopics }) => 
      subtopics.every(subtopic => subtopic.completed)
    );

    return allCompleted ? 'completed' : 'incomplete';
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const isToday = isSameDay(date, today);
      const status = getDateStatus(date);
      const hasTopics = getTopicsForDate(date).length > 0;

      days.push(
        <div
          key={day}
          className={`h-10 w-full rounded-lg flex flex-col items-center justify-center relative ${
            isToday
              ? 'ring-2 ring-blue-500'
              : ''
          } ${
            status === 'future'
              ? 'opacity-50'
              : ''
          }`}
        >
          <span className={isToday ? 'font-bold' : ''}>{day}</span>
          {hasTopics && (
            <div className="mt-1">
              {status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {status === 'incomplete' && (
                <div className="w-2 h-2 rounded-full bg-red-500" />
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
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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

      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
          <span>All Complete</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
          <span>Incomplete</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar; 