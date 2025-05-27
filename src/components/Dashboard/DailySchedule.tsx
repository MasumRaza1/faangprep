import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, Circle, Calendar, Code } from 'lucide-react';
import { SubTopic, Topic } from '../../types';
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

const DailySchedule: React.FC = () => {
  const { getTodaysTopics, dispatch } = useApp();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const todaysTopics = getTodaysTopics();
  
  // Convert to Indian timezone and normalize to start of day
  const getIndianTime = (date: Date): Date => {
    // Create a date string in Indian timezone
    const indianDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    // Reset time to start of day
    indianDate.setHours(0, 0, 0, 0);
    return indianDate;
  };

  // Get normalized date string in Indian timezone
  const getIndianDateString = (date: Date): string => {
    const indianDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `${indianDate.getFullYear()}-${String(indianDate.getMonth() + 1).padStart(2, '0')}-${String(indianDate.getDate()).padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    const indianDate = getIndianTime(date);
    return indianDate.toLocaleDateString('en-IN', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
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

  // Handle DSA question completion
  const handleToggleDSAQuestionCompletion = (questionId: string) => {
    const completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));
    
    if (completedQuestions.has(questionId)) {
      completedQuestions.delete(questionId);
    } else {
      completedQuestions.add(questionId);
    }
    
    localStorage.setItem('completedQuestions', JSON.stringify(Array.from(completedQuestions)));
    
    // Force update by dispatching a custom event
    window.dispatchEvent(new Event('dsaStatusUpdate'));
    
    // Force re-render
    setSelectedDate(new Date(selectedDate));
  };

  // Get DSA questions for today
  const getDSAQuestionsForToday = () => {
    const today = new Date();
    const todayStr = getIndianDateString(today);
    
    const studyPlan = localStorage.getItem('studyPlan');
    if (!studyPlan) return [];

    const plan = JSON.parse(studyPlan);
    const questionIds = plan.questionAssignments[todayStr] || [];
    const completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));

    const allQuestions: DSAQuestion[] = [];
    ultimateData.data.content.forEach((section: DSASection) => {
      section.categoryList.forEach((category: DSACategory) => {
        category.questionList.forEach((question) => {
          if (questionIds.includes(question.questionId)) {
            allQuestions.push({
              ...question,
              completed: completedQuestions.has(question.questionId)
            });
          }
        });
      });
    });

    return allQuestions;
  };

  const dsaQuestions = getDSAQuestionsForToday();

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

        {todaysTopics.length === 0 && dsaQuestions.length === 0 ? (
          <div className={`p-8 text-center ${
            theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg`}>
            <p className="mb-2 font-medium">No tasks scheduled for today</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Go to Schedule tab to generate your study plan
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* DSA Questions Section */}
            {dsaQuestions.length > 0 && (
              <div className={`p-4 rounded-lg ${
                theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-blue-500" />
                    <h3 className="font-medium text-lg">DSA Practice</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dsaQuestions.length} questions scheduled
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {dsaQuestions.map((question) => (
                    <li key={question.questionId} className="flex items-center">
                      <button
                        onClick={() => handleToggleDSAQuestionCompletion(question.questionId)}
                        className="flex-shrink-0 mr-3"
                      >
                        {question.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-gray-400" />
                        )}
                      </button>
                      <span className={`text-sm ${
                        question.completed ? 'line-through text-gray-400' : ''
                      }`}>
                        {question.questionHeading}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Regular Topics Section */}
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