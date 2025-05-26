import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, Circle, Calendar } from 'lucide-react';
import { SubTopic, Topic } from '../../types';

const DailySchedule: React.FC = () => {
  const { getTodaysTopics, dispatch } = useApp();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const todaysTopics = getTodaysTopics();
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleToggleSubtopicCompletion = (subjectId: string, topicId: string, subtopicId: string) => {
    dispatch({ 
      type: 'TOGGLE_SUBTOPIC_COMPLETION', 
      subjectId,
      topicId,
      subtopicId
    });
  };

  return (
    <div className={`rounded-lg ${
      theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today's Schedule</h2>
          <div className="flex items-center">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(selectedDate)}</span>
          </div>
        </div>

        {todaysTopics.length === 0 ? (
          <div className={`p-8 text-center ${
            theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg`}>
            <p className="mb-2 font-medium">No topics scheduled for today</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Go to Schedule tab to generate your study plan
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {todaysTopics.map(({ subjectId, subjectTitle, topic, subtopics }) => (
              <div key={`${subjectId}-${topic.id}`} className={`p-4 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="mb-3">
                  <h3 className="font-medium text-lg">{subjectTitle}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{topic.title}</p>
                </div>
                
                <ul className="space-y-2">
                  {subtopics.map((subtopic) => (
                    <li key={subtopic.id} className="flex items-center">
                      <button
                        onClick={() => handleToggleSubtopicCompletion(subjectId, topic.id, subtopic.id)}
                        className="flex-shrink-0 mr-3"
                      >
                        {subtopic.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-gray-400" />
                        )}
                      </button>
                      <span className={`text-sm ${
                        subtopic.completed ? 'line-through text-gray-400' : ''
                      }`}>
                        {subtopic.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySchedule;