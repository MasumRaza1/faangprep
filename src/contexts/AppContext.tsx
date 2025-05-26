import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Subject, Topic, SubTopic, Schedule } from '../types';
import { defaultSubjects } from '../data/defaultData';

// Action types
type AppAction =
  | { type: 'TOGGLE_TOPIC_COMPLETION'; subjectId: string; topicId: string }
  | { type: 'TOGGLE_SUBTOPIC_COMPLETION'; subjectId: string; topicId: string; subtopicId: string }
  | { type: 'ADD_TOPIC'; subjectId: string; topic: Topic }
  | { type: 'REMOVE_TOPIC'; subjectId: string; topicId: string }
  | { type: 'EDIT_TOPIC'; subjectId: string; topicId: string; title: string }
  | { type: 'ADD_SUBTOPIC'; subjectId: string; topicId: string; subtopic: SubTopic }
  | { type: 'REMOVE_SUBTOPIC'; subjectId: string; topicId: string; subtopicId: string }
  | { type: 'EDIT_SUBTOPIC'; subjectId: string; topicId: string; subtopicId: string; title: string }
  | { type: 'ADD_NESTED_SUBTOPIC'; subjectId: string; topicId: string; parentSubtopicId: string; subtopic: SubTopic }
  | { type: 'REMOVE_NESTED_SUBTOPIC'; subjectId: string; topicId: string; subtopicPath: string[] }
  | { type: 'TOGGLE_NESTED_SUBTOPIC_COMPLETION'; subjectId: string; topicId: string; subtopicPath: string[] }
  | { type: 'ADD_SUBJECT'; subject: Subject }
  | { type: 'REMOVE_SUBJECT'; subjectId: string }
  | { type: 'EDIT_SUBJECT'; subjectId: string; title: string; description: string }
  | { type: 'UPDATE_SUBJECT_SCHEDULE'; subjectId: string; schedule: Schedule }
  | { type: 'GENERATE_PLAN' }
  | { type: 'GENERATE_SUBJECT_PLAN'; subjectId: string }
  | { type: 'RESET_SUBJECT'; subjectId: string }
  | { type: 'SET_STATE'; state: AppState };

// Default state
const defaultSchedule: Schedule = {
  startDate: new Date(),
  totalDays: 0, // Changed from 30 to 0 days default
  endDate: new Date(), // Set to same as start date since totalDays is 0
};

const defaultState: AppState = {
  subjects: defaultSubjects,
  schedule: defaultSchedule,
  lastUpdated: new Date(),
};

// Context setup
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getCompletionPercentage: (subjectId?: string) => number;
  getTodaysTopics: () => { 
    subjectId: string; 
    subjectTitle: string; 
    topic: Topic;
    subtopics: SubTopic[];
  }[];
  getDaysRemaining: () => { totalDays: number; remainingDays: number };
  getTotalTopics: () => { total: number; completed: number };
  getTopicsForDate: (date: Date) => { 
    subjectId: string; 
    subjectTitle: string; 
    topic: Topic;
    subtopics: SubTopic[];
  }[];
}

const AppContext = createContext<AppContextType>({
  state: defaultState,
  dispatch: () => null,
  getCompletionPercentage: () => 0,
  getTodaysTopics: () => [],
  getDaysRemaining: () => ({ totalDays: 0, remainingDays: 0 }),
  getTotalTopics: () => ({ total: 0, completed: 0 }),
  getTopicsForDate: () => [],
});

// Helper function to find and update a nested subtopic
const updateNestedSubtopic = (
  subtopics: SubTopic[],
  path: string[],
  updater: (subtopic: SubTopic) => SubTopic
): SubTopic[] => {
  if (path.length === 0) return subtopics;

  const [currentId, ...remainingPath] = path;
  return subtopics.map(subtopic => {
    if (subtopic.id === currentId) {
      if (remainingPath.length === 0) {
        return updater(subtopic);
      }
      return {
        ...subtopic,
        subtopics: updateNestedSubtopic(subtopic.subtopics, remainingPath, updater)
      };
    }
    return subtopic;
  });
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'TOGGLE_TOPIC_COMPLETION': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map((topic) => {
            if (topic.id === action.topicId) {
              const completed = !topic.completed;
              // If topic is marked as completed, also mark all subtopics
              const updatedSubtopics = topic.subtopics.map((subtopic) => ({
                ...subtopic,
                completed,
              }));
              return { ...topic, completed, subtopics: updatedSubtopics };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'TOGGLE_SUBTOPIC_COMPLETION': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map((topic) => {
            if (topic.id === action.topicId) {
              const updatedSubtopics = topic.subtopics.map((subtopic) => {
                if (subtopic.id === action.subtopicId) {
                  return { ...subtopic, completed: !subtopic.completed };
                }
                return subtopic;
              });
              
              // Check if all subtopics are completed
              const allSubtopicsCompleted = updatedSubtopics.every((subtopic) => subtopic.completed);
              
              return { 
                ...topic, 
                subtopics: updatedSubtopics,
                completed: allSubtopicsCompleted && updatedSubtopics.length > 0 ? true : topic.completed 
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'ADD_TOPIC': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          return {
            ...subject,
            topics: [...subject.topics, action.topic],
          };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'REMOVE_TOPIC': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          return {
            ...subject,
            topics: subject.topics.filter((topic) => topic.id !== action.topicId),
          };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'ADD_SUBTOPIC': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map((topic) => {
            if (topic.id === action.topicId) {
              return {
                ...topic,
                subtopics: [...topic.subtopics, action.subtopic],
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'REMOVE_SUBTOPIC': {
      const newSubjects = state.subjects.map((subject) => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map((topic) => {
            if (topic.id === action.topicId) {
              return {
                ...topic,
                subtopics: topic.subtopics.filter(
                  (subtopic) => subtopic.id !== action.subtopicId
                ),
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'ADD_NESTED_SUBTOPIC': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map(topic => {
            if (topic.id === action.topicId) {
              return {
                ...topic,
                subtopics: updateNestedSubtopic(
                  topic.subtopics,
                  [action.parentSubtopicId],
                  (subtopic) => ({
                    ...subtopic,
                    subtopics: [...subtopic.subtopics, action.subtopic]
                  })
                )
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'REMOVE_NESTED_SUBTOPIC': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map(topic => {
            if (topic.id === action.topicId) {
              const [parentId, targetId] = action.subtopicPath;
              return {
                ...topic,
                subtopics: updateNestedSubtopic(
                  topic.subtopics,
                  [parentId],
                  (subtopic) => ({
                    ...subtopic,
                    subtopics: subtopic.subtopics.filter(s => s.id !== targetId)
                  })
                )
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'TOGGLE_NESTED_SUBTOPIC_COMPLETION': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map(topic => {
            if (topic.id === action.topicId) {
              const [parentId, targetId] = action.subtopicPath;
              return {
                ...topic,
                subtopics: updateNestedSubtopic(
                  topic.subtopics,
                  [parentId],
                  (subtopic) => ({
                    ...subtopic,
                    subtopics: subtopic.subtopics.map(s =>
                      s.id === targetId ? { ...s, completed: !s.completed } : s
                    )
                  })
                )
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'ADD_SUBJECT': {
      return {
        ...state,
        subjects: [...state.subjects, action.subject],
        lastUpdated: new Date(),
      };
    }

    case 'REMOVE_SUBJECT': {
      return {
        ...state,
        subjects: state.subjects.filter((subject) => subject.id !== action.subjectId),
        lastUpdated: new Date(),
      };
    }

    case 'EDIT_SUBJECT': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          return {
            ...subject,
            title: action.title,
            description: action.description
          };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'UPDATE_SUBJECT_SCHEDULE': {
      console.log('Handling UPDATE_SUBJECT_SCHEDULE action:', action);
      
      // Ensure dates are properly set in local timezone
      const startDate = new Date(action.schedule.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(action.schedule.endDate);
      endDate.setHours(23, 59, 59, 999);

      const schedule = {
        ...action.schedule,
        startDate,
        endDate
      };

      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          return {
            ...subject,
            schedule
          };
        }
        return subject;
      });

      return {
        ...state,
        subjects: newSubjects,
        lastUpdated: new Date()
      };
    }

    case 'GENERATE_PLAN': {
      console.log('Handling GENERATE_PLAN action');
      console.log('Current schedule:', state.schedule);
      
      // Get all topics grouped by subject, maintaining order
      const allTopics: { topic: Topic; subject: Subject }[] = [];
      state.subjects.forEach((subject) => {
        // Get all topics for this subject
        const subjectTopics = subject.topics.map(topic => ({
          topic: { ...topic },
          subject: { ...subject }
        }));
        allTopics.push(...subjectTopics);
      });

      console.log('Total topics to schedule:', allTopics.length);

      // Calculate topics per day
      const { startDate, totalDays } = state.schedule;
      const topicsPerDay = Math.ceil(allTopics.length / totalDays);
      console.log('Topics per day:', topicsPerDay);

      // Reset all scheduled dates
      const newSubjects = state.subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => ({
          ...topic,
          scheduledDate: null as Date | null
        }))
      }));

      // Start from the selected start date
      let currentDate = new Date(startDate);
      currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
      let currentDayTopicCount = 0;

      // Process topics subject by subject
      let currentSubjectIndex = 0;
      let currentTopicIndex = 0;

      while (currentSubjectIndex < state.subjects.length) {
        const subject = state.subjects[currentSubjectIndex];
        console.log('Processing subject:', subject.title);

        // Process all topics in current subject
        while (currentTopicIndex < subject.topics.length) {
          const topic = subject.topics[currentTopicIndex];

          // Check if we need to move to next day
          if (currentDayTopicCount >= topicsPerDay) {
            currentDayTopicCount = 0;
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(0, 0, 0, 0);
          }

          // Schedule the topic
          console.log('Scheduling topic:', {
            subject: subject.title,
            topic: topic.title,
            date: new Date(currentDate).toISOString()
          });

          // Update the topic in newSubjects
          const subjectIndex = newSubjects.findIndex(s => s.id === subject.id);
          if (subjectIndex !== -1) {
            const topicIndex = newSubjects[subjectIndex].topics.findIndex(t => t.id === topic.id);
            if (topicIndex !== -1) {
              newSubjects[subjectIndex].topics[topicIndex].scheduledDate = new Date(currentDate);
            }
          }

          currentDayTopicCount++;
          currentTopicIndex++;
        }

        // Move to next subject
        currentSubjectIndex++;
        currentTopicIndex = 0; // Reset topic index for next subject
      }

      console.log('Plan generation complete');
      return {
        ...state,
        subjects: newSubjects,
        lastUpdated: new Date(),
      };
    }

    case 'GENERATE_SUBJECT_PLAN': {
      console.log('Handling GENERATE_SUBJECT_PLAN action:', action.subjectId);
      
      // Find the subject
      const subjectIndex = state.subjects.findIndex(s => s.id === action.subjectId);
      if (subjectIndex === -1) {
        console.error('Subject not found:', action.subjectId);
        return state;
      }

      const subject = state.subjects[subjectIndex];
      const { startDate, totalDays } = subject.schedule!;

      // Create a copy of subjects array
      const newSubjects = [...state.subjects];

      // Get all subtopics from the subject
      const allSubtopics: {
        topicIndex: number;
        subtopicIndex: number;
        topic: string;
        subtopic: string;
        completed: boolean;
      }[] = [];

      // Only collect non-completed subtopics
      subject.topics.forEach((topic, topicIndex) => {
        topic.subtopics.forEach((subtopic, subtopicIndex) => {
          if (!subtopic.completed) {
            allSubtopics.push({
              topicIndex,
              subtopicIndex,
              topic: topic.title,
              subtopic: subtopic.title,
              completed: subtopic.completed
            });
          }
        });
      });

      // Calculate subtopics per day
      const subtopicsPerDay = Math.ceil(allSubtopics.length / totalDays);
      console.log('Subtopics per day:', subtopicsPerDay);

      // Initialize scheduling variables
      const userStartDate = new Date(startDate);
      userStartDate.setHours(0, 0, 0, 0);
      let currentDate = new Date(userStartDate);
      let subtopicsScheduledToday = 0;

      // Schedule each subtopic
      allSubtopics.forEach((item) => {
        // If we've scheduled enough subtopics for today, move to next day
        if (subtopicsScheduledToday >= subtopicsPerDay) {
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(0, 0, 0, 0);
          subtopicsScheduledToday = 0;
        }

        // Schedule the subtopic for current date
        newSubjects[subjectIndex].topics[item.topicIndex].subtopics[item.subtopicIndex].scheduledDate = new Date(currentDate);

        console.log('Scheduled:', {
          date: currentDate.toISOString(),
          topic: item.topic,
          subtopic: item.subtopic,
          subtopicsToday: subtopicsScheduledToday + 1
        });

        subtopicsScheduledToday++;
      });

      // Calculate end date based on the last scheduled date
      const endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);

      // Update the subject's schedule
      newSubjects[subjectIndex].schedule = {
        ...newSubjects[subjectIndex].schedule!,
        startDate: userStartDate,
        totalDays: totalDays,
        endDate: endDate
      };

      console.log('Scheduling complete');
      console.log('Final schedule:', {
        startDate: userStartDate,
        endDate: endDate,
        totalDays: totalDays
      });

      return {
        ...state,
        subjects: newSubjects,
        lastUpdated: new Date()
      };
    }

    case 'RESET_SUBJECT': {
      console.log('Resetting subject:', action.subjectId);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create a new default schedule
      const defaultSchedule = {
        startDate: today,
        totalDays: 0,
        endDate: today
      };

      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          return {
            ...subject,
            schedule: defaultSchedule,
            topics: subject.topics.map(topic => ({
              ...topic,
              completed: false,
              scheduledDate: null,
              subtopics: topic.subtopics.map(subtopic => ({
                ...subtopic,
                completed: false,
                scheduledDate: null,
                subtopics: subtopic.subtopics.map(nestedSubtopic => ({
                  ...nestedSubtopic,
                  completed: false,
                  scheduledDate: null
                }))
              }))
            }))
          };
        }
        return subject;
      });

      return {
        ...state,
        subjects: newSubjects,
        lastUpdated: new Date()
      };
    }

    case 'EDIT_TOPIC': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map(topic => {
            if (topic.id === action.topicId) {
              return {
                ...topic,
                title: action.title
              };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'EDIT_SUBTOPIC': {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === action.subjectId) {
          const updatedTopics = subject.topics.map(topic => {
            if (topic.id === action.topicId) {
              const updatedSubtopics = topic.subtopics.map(subtopic => {
                if (subtopic.id === action.subtopicId) {
                  return {
                    ...subtopic,
                    title: action.title
                  };
                }
                return subtopic;
              });
              return { ...topic, subtopics: updatedSubtopics };
            }
            return topic;
          });
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      });
      return { ...state, subjects: newSubjects, lastUpdated: new Date() };
    }

    case 'SET_STATE':
      return action.state;

    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use default
  const [state, dispatch] = useReducer(appReducer, defaultState, () => {
    const savedState = localStorage.getItem('appState');
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Convert string dates back to Date objects and ensure subtopics arrays exist
        const subjects = parsedState.subjects.map((subject: any) => ({
          ...subject,
          schedule: {
            ...subject.schedule,
            startDate: new Date(subject.schedule.startDate),
            endDate: new Date(subject.schedule.endDate)
          },
          topics: subject.topics.map((topic: any) => ({
            ...topic,
            scheduledDate: topic.scheduledDate ? new Date(topic.scheduledDate) : null,
            subtopics: Array.isArray(topic.subtopics) ? topic.subtopics.map((subtopic: any) => ({
              ...subtopic,
              scheduledDate: subtopic.scheduledDate ? new Date(subtopic.scheduledDate) : null,
              subtopics: Array.isArray(subtopic.subtopics) ? subtopic.subtopics : []
            })) : []
          }))
        }));
        
        const schedule = {
          ...parsedState.schedule,
          startDate: new Date(parsedState.schedule.startDate),
          endDate: new Date(parsedState.schedule.endDate)
        };
        
        return {
          ...parsedState,
          subjects,
          schedule,
          lastUpdated: new Date(parsedState.lastUpdated)
        };
      } catch (error) {
        console.error('Failed to parse saved state:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('appState', JSON.stringify({
        ...state,
        subjects: state.subjects.map(subject => ({
          ...subject,
          topics: subject.topics.map(topic => ({
            ...topic,
            subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : []
          }))
        }))
      }));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  // Helper functions
  const getCompletionPercentage = (subjectId?: string): number => {
    const subjects = subjectId
      ? state.subjects.filter((subject) => subject.id === subjectId)
      : state.subjects;

    let totalSubtopics = 0;
    let completedSubtopics = 0;

    const countSubtopics = (subtopics: SubTopic[]) => {
      subtopics.forEach(subtopic => {
        totalSubtopics++;
        if (subtopic.completed) completedSubtopics++;
        // Recursively count nested subtopics
        if (subtopic.subtopics && subtopic.subtopics.length > 0) {
          countSubtopics(subtopic.subtopics);
        }
      });
    };

    subjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        if (topic.subtopics.length === 0) {
          // If topic has no subtopics, count it as one item
          totalSubtopics++;
          if (topic.completed) completedSubtopics++;
        } else {
          // Count all subtopics recursively
          countSubtopics(topic.subtopics);
        }
      });
    });

    return totalSubtopics === 0 ? 0 : Math.round((completedSubtopics / totalSubtopics) * 100);
  };

  const getTotalTopics = () => {
    let total = 0;
    let completed = 0;

    const countSubtopics = (subtopics: SubTopic[]) => {
      subtopics.forEach(subtopic => {
        total++;
        if (subtopic.completed) completed++;
        // Recursively count nested subtopics
        if (subtopic.subtopics && subtopic.subtopics.length > 0) {
          countSubtopics(subtopic.subtopics);
        }
      });
    };

    state.subjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        if (topic.subtopics.length === 0) {
          // If topic has no subtopics, count it as one item
          total++;
          if (topic.completed) completed++;
        } else {
          // Count all subtopics recursively
          countSubtopics(topic.subtopics);
        }
      });
    });

    return { total, completed };
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getTopicsForDate = (date: Date) => {
    const topicsForDay: { 
      subjectId: string; 
      subjectTitle: string; 
      topic: Topic;
      subtopics: SubTopic[];
    }[] = [];

    state.subjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        const scheduledSubtopics = topic.subtopics.filter(
          subtopic => subtopic.scheduledDate && isSameDay(new Date(subtopic.scheduledDate), new Date(date))
        );
        
        if (scheduledSubtopics.length > 0) {
          topicsForDay.push({
            subjectId: subject.id,
            subjectTitle: subject.title,
            topic: topic,
            subtopics: scheduledSubtopics
          });
        }
      });
    });

    return topicsForDay;
  };

  const getTodaysTopics = () => {
    return getTopicsForDate(new Date());
  };

  const getDaysRemaining = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if any subject has a valid schedule
    const hasValidSchedule = state.subjects.some(subject => 
      subject.schedule?.startDate && 
      subject.schedule?.totalDays > 0
    );

    // If no valid schedules exist, return 0/0
    if (!hasValidSchedule) {
      return {
        totalDays: 0,
        remainingDays: 0
      };
    }

    let totalPlannedDays = 0;
    let earliestStartDate = today;
    let latestEndDate = today;
    let hasSchedules = false;

    // Calculate total days and find date range
    state.subjects.forEach(subject => {
      if (subject.schedule?.startDate && subject.schedule.totalDays > 0) {
        hasSchedules = true;

        // Add to total planned days
        totalPlannedDays += subject.schedule.totalDays;

        const startDate = new Date(subject.schedule.startDate);
        startDate.setHours(0, 0, 0, 0);

        // Update earliest start date
        if (startDate < earliestStartDate) {
          earliestStartDate = startDate;
        }

        // Calculate end date based on start date and total days
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + subject.schedule.totalDays - 1);
        endDate.setHours(23, 59, 59, 999);

        // Update latest end date
        if (endDate > latestEndDate) {
          latestEndDate = endDate;
        }
      }
    });

    // If no valid schedules found, return 0/0
    if (!hasSchedules) {
      return {
        totalDays: 0,
        remainingDays: 0
      };
    }

    // Calculate elapsed days since earliest start date
    const elapsedDays = Math.floor((today.getTime() - earliestStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate remaining days by subtracting elapsed days from total days
    const remainingDays = Math.max(0, totalPlannedDays - elapsedDays);
    
    return {
      totalDays: totalPlannedDays,
      remainingDays: remainingDays
    };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getCompletionPercentage,
        getTodaysTopics,
        getDaysRemaining,
        getTotalTopics,
        getTopicsForDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);