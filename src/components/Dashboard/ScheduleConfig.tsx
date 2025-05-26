import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, Circle, ChevronDown } from 'lucide-react';
import { Subject } from '../../types';
import StudyInsights from './StudyInsights';
import StudyRecommendations from './StudyRecommendations';
import SubjectProgress from './SubjectProgress';
import { AlertCircle } from 'lucide-react';

interface ScheduleConfigProps {
  showFullCalendar?: boolean;
}

const ScheduleConfig: React.FC<ScheduleConfigProps> = ({ showFullCalendar = false }) => {
  const { state, dispatch, getTotalTopics, getTopicsForDate } = useApp();
  const { theme } = useTheme();
  
  // State for subject schedules
  const [subjectSchedules, setSubjectSchedules] = useState<{
    [subjectId: string]: {
      startDate: string;
      totalDays: number;
    };
  }>({});

  // Add state for expanded subjects
  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({});

  // Initialize subject schedules from state
  useEffect(() => {
    const initialSchedules: { [key: string]: { startDate: string; totalDays: number } } = {};
    const today = new Date();
    // Reset hours to start of day in local timezone
    today.setHours(0, 0, 0, 0);

    state.subjects.forEach(subject => {
      // If subject has an existing schedule, use that
      const existingStartDate = subject.schedule?.startDate;
      const existingTotalDays = subject.schedule?.totalDays;

      // Format date in local timezone
      const formattedDate = today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format

      initialSchedules[subject.id] = {
        startDate: existingStartDate 
          ? new Date(existingStartDate).toLocaleDateString('en-CA')
          : formattedDate,
        totalDays: existingTotalDays ?? 0
      };
    });
    setSubjectSchedules(initialSchedules);

    // Also update any subjects that don't have a schedule
    state.subjects.forEach(subject => {
      if (!subject.schedule?.startDate) {
        dispatch({
          type: 'UPDATE_SUBJECT_SCHEDULE',
          subjectId: subject.id,
          schedule: {
            startDate: today,
            totalDays: initialSchedules[subject.id].totalDays,
            endDate: new Date(today.getTime() + (initialSchedules[subject.id].totalDays * 24 * 60 * 60 * 1000))
          }
        });
      }
    });
  }, [state.subjects]);

  // Set current month and selected date to today by default
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, []);

  const handleToggleSubtopicCompletion = (subjectId: string, topicId: string, subtopicId: string) => {
    dispatch({
      type: 'TOGGLE_SUBTOPIC_COMPLETION',
      subjectId,
      topicId,
      subtopicId
    });
  };

  const updateSubjectSchedule = (subjectId: string) => {
    const schedule = subjectSchedules[subjectId];
    if (!schedule) return;

    // Find the existing subject schedule
    const existingSubject = state.subjects.find(s => s.id === subjectId);
    
    // Use existing start date if available, otherwise use the new one
    const startDate = existingSubject?.schedule?.startDate 
      ? new Date(existingSubject.schedule.startDate)
      : new Date(schedule.startDate);

    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + schedule.totalDays - 1);
    endDate.setHours(23, 59, 59, 999);

    dispatch({
      type: 'UPDATE_SUBJECT_SCHEDULE',
      subjectId,
      schedule: {
        startDate: startDate,
        totalDays: schedule.totalDays,
        endDate: endDate
      },
    });
  };

  const generateSubjectPlan = (subjectId: string) => {
    // First update the schedule
    updateSubjectSchedule(subjectId);
    
    // Then generate the plan
    dispatch({ 
      type: 'GENERATE_SUBJECT_PLAN',
      subjectId 
    });
  };

  const handleStartDateChange = (subjectId: string, date: string) => {
    // Only update if there's a valid date
    if (!date) return;

    setSubjectSchedules(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        startDate: date
      }
    }));

    // Create date object in local timezone
    const newStartDate = new Date(date + 'T00:00:00');
    newStartDate.setHours(0, 0, 0, 0);

    const endDate = new Date(newStartDate);
    endDate.setDate(newStartDate.getDate() + (subjectSchedules[subjectId]?.totalDays || 0) - 1);
    endDate.setHours(23, 59, 59, 999);

    dispatch({
      type: 'UPDATE_SUBJECT_SCHEDULE',
      subjectId,
      schedule: {
        startDate: newStartDate,
        totalDays: subjectSchedules[subjectId]?.totalDays || 0,
        endDate: endDate
      },
    });
  };

  const handleTotalDaysChange = (subjectId: string, days: number) => {
    setSubjectSchedules(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        totalDays: Math.max(0, days) // Allow 0 as minimum instead of 1
      }
    }));
  };

  // Calendar state and functions
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleToggleTopicCompletion = (subjectId: string, topicId: string) => {
    dispatch({
      type: 'TOGGLE_TOPIC_COMPLETION',
      subjectId,
      topicId,
    });
  };

  const getSubtopicsCount = (subject: Subject) => {
    let count = 0;
    subject.topics.forEach(topic => {
      count += topic.subtopics.length;
    });
    return count;
  };

  const getCompletedSubtopicsCount = (subject: Subject) => {
    let count = 0;
    subject.topics.forEach(topic => {
      topic.subtopics.forEach(subtopic => {
        if (subtopic.completed) {
          count++;
        }
      });
    });
    return count;
  };

  const getRemainingSubtopicsCount = (subject: Subject) => {
    let count = 0;
    subject.topics.forEach(topic => {
      topic.subtopics.forEach(subtopic => {
        if (!subtopic.completed) {
          count++;
        }
      });
    });
    return count;
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
      const isSelected = isSameDay(date, selectedDate);
      const hasTopics = getTopicsForDate(date).length > 0;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-full rounded-lg flex items-center justify-center relative ${
            isSelected
              ? 'bg-blue-500 text-white'
              : isToday
              ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
              : ''
          }`}
        >
          <span className={isToday ? 'font-bold' : ''}>{day}</span>
          {hasTopics && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className={`w-1 h-1 rounded-full ${
                isSelected ? 'bg-white' : 'bg-green-500'
              }`} />
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedDateTopics = getTopicsForDate(selectedDate);

  const handleResetSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to reset this subject? This will:\n- Clear all progress\n- Reset schedule\n- Set preparation days to 0')) {
      // First dispatch the reset action
      dispatch({
        type: 'RESET_SUBJECT',
        subjectId
      });

      // Then reset the local state
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setSubjectSchedules(prev => ({
        ...prev,
        [subjectId]: {
          startDate: today.toISOString().slice(0, 10),
          totalDays: 0
        }
      }));

      // Finally, update the subject's schedule to ensure sync
      dispatch({
        type: 'UPDATE_SUBJECT_SCHEDULE',
        subjectId,
        schedule: {
          startDate: today,
          totalDays: 0,
          endDate: today
        }
      });
    }
  };

  const handleGlobalReset = () => {
    if (window.confirm('Are you sure you want to reset everything? This will:\n- Clear all progress across all subjects\n- Reset all schedules\n- Set all preparation days to 0')) {
      // Reset all subjects in local state
      const resetSchedules: { [key: string]: { startDate: string; totalDays: number } } = {};
      state.subjects.forEach(subject => {
        resetSchedules[subject.id] = {
          startDate: new Date().toISOString().slice(0, 10),
          totalDays: 0
        };
      });
      setSubjectSchedules(resetSchedules);

      // Reset each subject
      state.subjects.forEach(subject => {
        dispatch({
          type: 'RESET_SUBJECT',
          subjectId: subject.id
        });
      });
    }
  };

  // Toggle subject expansion
  const toggleSubjectExpansion = (subjectId: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  return (
    <div className="space-y-6">
      {showFullCalendar && (
        <>
          <StudyInsights />
          
          <SubjectProgress />

          <div className={`rounded-xl ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden`}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Today's Schedule</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                  </div>
                  
              {getTopicsForDate(new Date()).length > 0 ? (
                <div className="space-y-3">
                  {getTopicsForDate(new Date()).map(({ subjectId, subjectTitle, topic, subtopics }) => (
                    <div 
                      key={topic.id}
                      className={`p-4 rounded-lg ${
                        theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {subjectTitle} - {topic.title}
                  </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {subtopics.filter(s => s.completed).length} of {subtopics.length} completed
                    </div>
                  </div>
                        <div className="space-y-1">
                          {subtopics.map(subtopic => (
                            <div key={subtopic.id} className="flex items-center">
                    <button
                                onClick={() => handleToggleSubtopicCompletion(subjectId, topic.id, subtopic.id)}
                                className="flex-shrink-0 mr-2"
                              >
                                {subtopic.completed ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <Circle size={16} className="text-gray-400" />
                                )}
                    </button>
                              <span className={`text-sm ${subtopic.completed ? 'line-through text-gray-400' : ''}`}>
                                {subtopic.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-3">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-sm font-medium mb-1">No Tasks for Today</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use the schedule settings below to plan your study sessions.
                  </p>
                </div>
              )}
        </div>
        
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Study Calendar</h2>
                <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <ChevronLeft size={20} />
                </button>
                  <span className="text-sm font-medium">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
                <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
            
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3">
                  Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </h3>
              
                {selectedDateTopics.length > 0 ? (
                  <div className="space-y-2">
                  {selectedDateTopics.map(({ subjectId, subjectTitle, topic, subtopics }) => (
                      <div 
                      key={topic.id} 
                      className={`p-3 rounded-lg ${
                          theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                          {subjectTitle} - {topic.title}
                        </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {subtopics.filter(s => s.completed).length} of {subtopics.length} completed
                            </div>
                          </div>
                          <div className="space-y-1">
                        {subtopics.map(subtopic => (
                          <div key={subtopic.id} className="flex items-center">
                            <button
                              onClick={() => handleToggleSubtopicCompletion(subjectId, topic.id, subtopic.id)}
                                  className="flex-shrink-0 mr-2"
                            >
                              {subtopic.completed ? (
                                    <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                    <Circle size={16} className="text-gray-400" />
                              )}
                            </button>
                                <span className={`text-sm ${subtopic.completed ? 'line-through text-gray-400' : ''}`}>
                              {subtopic.title}
                            </span>
                          </div>
                        ))}
                      </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    No tasks scheduled for this date
                  </div>
                )}
              </div>
            </div>
          </div>

          <StudyRecommendations />
        </>
      )}

      <div className={`rounded-xl ${
        theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-md overflow-hidden`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Schedule Settings</h2>
            <button
              onClick={handleGlobalReset}
              className="text-xs px-3 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-colors font-medium"
              title="Reset all subjects and clear all progress"
            >
              Reset All Subjects
            </button>
          </div>
          
          <div className="space-y-2">
            {state.subjects.map(subject => {
              const subtopicsCount = getSubtopicsCount(subject);
              const completedCount = getCompletedSubtopicsCount(subject);
              const progress = Math.round((completedCount / subtopicsCount) * 100) || 0;
              const isExpanded = expandedSubjects[subject.id];
              
              return (
                <div 
                  key={subject.id} 
                  className={`rounded-lg border ${
                    isExpanded 
                      ? 'border-blue-200 dark:border-blue-800' 
                      : 'border-gray-100 dark:border-gray-700'
                  } hover:border-gray-200 dark:hover:border-gray-600 transition-colors overflow-hidden`}
                >
                  <button
                    onClick={() => toggleSubjectExpansion(subject.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium truncate pr-4">{subject.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {progress}% Complete
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={subjectSchedules[subject.id]?.startDate || ''}
                            onChange={(e) => handleStartDateChange(subject.id, e.target.value)}
                            className={`w-full p-1.5 text-sm border rounded ${
                              theme.mode === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Days
                          </label>
                          <input
                            type="number"
                            value={subjectSchedules[subject.id]?.totalDays || ''}
                            min={0}
                            max={365}
                            onChange={(e) => handleTotalDaysChange(subject.id, parseInt(e.target.value) || 0)}
                            className={`w-full p-1.5 text-sm border rounded ${
                              theme.mode === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Subtopics: {subtopicsCount}</span>
                          <span>~{Math.ceil(subtopicsCount / (subjectSchedules[subject.id]?.totalDays || 1))} per day</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => generateSubjectPlan(subject.id)}
                            className="flex-1 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 text-xs font-medium transition-colors flex items-center justify-center"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Generate Schedule
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetSubject(subject.id);
                            }}
                            className="px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-medium transition-colors"
                          >
                            Reset Subject
                          </button>
                        </div>

                        {subject.schedule?.startDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {new Date(subject.schedule.startDate).toLocaleDateString()} - {' '}
                            {new Date(subject.schedule.endDate).toLocaleDateString()}
                          </div>
              )}
            </div>
          </div>
        )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfig;